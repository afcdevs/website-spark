// Temporary diagnostic: query panel + Wings daemons to see real states
const https = require("https");
const http = require("http");

const PANEL = "https://panel.spark-services.kdns.fr";
const KEY = "ptla_z4NC5jmMroTp0PHW5t1Ohmp94dEJNQzxnXYhwtX0oVI";

function req(method, url, auth, body) {
  return new Promise((resolve, reject) => {
    let lib = url.startsWith("https") ? https : http;
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      port: u.port || (url.startsWith("https") ? 443 : 80),
      path: u.pathname + u.search,
      method,
      headers: { Accept: "application/json", "User-Agent": "Spark-Diag/1.0" },
      rejectUnauthorized: false,
    };
    if (auth) opts.headers.Authorization = "Bearer " + auth;
    if (body) { opts.headers["Content-Type"] = "application/json"; opts.headers["Content-Length"] = Buffer.byteLength(body); }
    const r = lib.request(opts, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
    });
    r.on("error", reject);
    if (body) r.write(body);
    r.end();
  });
}

(async () => {
  console.log("=== 1. Server list (application API) ===");
  const list = await req("GET", PANEL + "/api/application/servers?per_page=100", KEY);
  console.log("status:", list.status);
  let servers = [];
  try { servers = (JSON.parse(list.body).data || []); } catch (e) { console.log("body:", list.body.slice(0, 500)); return; }
  for (const s of servers) {
    const a = s.attributes;
    console.log(`- ${a.identifier} | node=${a.node} | name=${a.name} | appStatus=${a.status} | suspended=${a.suspended}`);
  }

  console.log("\n=== 2. Node configs + daemon states ===");
  const nodes = [...new Set(servers.map((s) => s.attributes.node).filter((n) => n != null))];
  for (const nodeId of nodes) {
    console.log(`\n--- node ${nodeId} ---`);
    const cfgRes = await req("GET", PANEL + "/api/application/nodes/" + nodeId + "/configuration", KEY);
    if (cfgRes.status >= 300) { console.log("config error:", cfgRes.status, cfgRes.body.slice(0, 300)); continue; }
    let cfg;
    try { cfg = JSON.parse(cfgRes.body); } catch (e) { console.log("bad config json"); continue; }
    const api = cfg.api || {};
    const scheme = (api.ssl && api.ssl.enabled) ? "https" : "http";
    const port = api.port || 8080;
    console.log("daemon:", scheme + "://" + cfg.fqdn + ":" + port, "| token:", cfg.token ? cfg.token.slice(0, 8) + "..." : "MISSING");
    for (const s of servers) {
      const a = s.attributes;
      if (a.node !== nodeId) continue;
      const url = scheme + "://" + cfg.fqdn + ":" + port + "/api/servers/" + a.uuid;
      try {
        const dr = await req("GET", url, cfg.token);
        let state = "??", suspended = false;
        if (dr.status === 200) {
          try {
            const d = JSON.parse(dr.body);
            state = (d.attributes && d.attributes.state) || d.state;
            suspended = (d.attributes && d.attributes.suspended) || d.suspended;
          } catch (e) { state = "unparsable"; }
        }
        console.log(`  ${a.identifier}: daemonHTTP=${dr.status} state=${state} suspended=${suspended}`);
      } catch (e) {
        console.log(`  ${a.identifier}: ERROR ${e.message}`);
      }
    }
  }
  console.log("\nDONE");
})();
