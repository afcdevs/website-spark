// Spark Services - local static server + Pterodactyl Client API proxy (no dependencies)
// Usage: node server.js   ->  http://localhost:3000
// Only serves files from this folder - safe against path traversal.

// ---------------------------------------------------------------------------
// PTERODACTYL PROXY CONFIG
// The dashboard (dash.html) talks to /api/ptero/* on this server, which is
// forwarded to your Pterodactyl panel's APPLICATION API (/api/application/*).
// The panel URL + key below are hardcoded (can be overridden with env vars).
// An Application API key starts with ptla_ and is created in Admin -> API.
//
// NO Client API key is required: the dashboard runs entirely on the
// Application API key above (+ a direct Wings daemon bridge) so you get full
// admin control with just ptla_. A Client API key (ptlc_) can still be
// provided through the PTERODACTYL_CLIENT_KEY env var to unlock the two
// panel-DB-only tabs (backups & schedules) - otherwise it stays empty.
// ---------------------------------------------------------------------------
const PTERO_PANEL = process.env.PTERODACTYL_PANEL || "https://panel.spark-services.kdns.fr";
const PTERO_KEY   = process.env.PTERODACTYL_KEY   || "ptla_z4NC5jmMroTp0PHW5t1Ohmp94dEJNQzxnXYhwtX0oVI";
const PTERO_CLIENT_KEY = process.env.PTERODACTYL_CLIENT_KEY || "";

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".txt": "text/plain; charset=utf-8",
};

/* ==========================================================================
   PTERODACTYL PROXY
   Route:
     /api/ptero/<path>  -> {panel}/api/application/<path>   (same method/body)
   ========================================================================== */

function collectBody(req, cb) {
    const chunks = [];
    let size = 0;
    req.on("data", function (c) {
        size += c.length;
        if (size > 200 * 1024 * 1024) {
            req.destroy();
            return;
        }
        chunks.push(c);
    });
    req.on("end", function () {
        cb(Buffer.concat(chunks));
    });
    req.on("error", function () {
        cb(Buffer.alloc(0));
    });
}

function libRequest(method, targetUrl, authKey, cb) {
    let parsed;
    try {
        parsed = new URL(targetUrl);
    } catch (e) {
        cb(400, null, "Invalid proxy target URL");
        return null;
    }
    const isHttps = parsed.protocol === "https:";
    const lib = isHttps ? https : http;
    const port = parsed.port || (isHttps ? 443 : 80);
    const headers = {
        Accept: "application/vnd.pterodactyl.v1+json",
        "User-Agent": "Spark-Dashboard/1.0",
    };
    if (authKey) headers["Authorization"] = "Bearer " + authKey;
    const outReq = lib.request(
        {
            hostname: parsed.hostname,
            port: port,
            path: parsed.pathname + parsed.search,
            method: method,
            headers: headers,
        },
        function (outRes) {
            const outChunks = [];
            outRes.on("data", function (c) { outChunks.push(c); });
            outRes.on("end", function () {
                cb(outRes.statusCode || 502, Buffer.concat(outChunks), null);
            });
        }
    );
    outReq.on("error", function (err) {
        cb(502, null, "Proxy request failed: " + err.message);
    });
    return outReq;
}

function forwardRequest(req, res, targetUrl, method, body, authKey) {
    let parsed;
    try {
        parsed = new URL(targetUrl);
    } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid proxy target URL" }));
    }

    const isHttps = parsed.protocol === "https:";
    const lib = isHttps ? https : http;
    const port = parsed.port || (isHttps ? 443 : 80);

    const headers = {
        // Pterodactyl requires this versioned Accept header (else 406)
        Accept: req.headers["accept"] || "application/vnd.pterodactyl.v1+json",
        "User-Agent": "Spark-Dashboard/1.0",
    };
    if (authKey) headers["Authorization"] = "Bearer " + authKey;
    if (method !== "GET" && method !== "HEAD") {
        headers["Content-Type"] = req.headers["content-type"] || "application/json";
        headers["Content-Length"] = body.length;
    }

    const outReq = lib.request(
        {
            hostname: parsed.hostname,
            port: port,
            path: parsed.pathname + parsed.search,
            method: method,
            headers: headers,
        },
        function (outRes) {
            const outChunks = [];
            outRes.on("data", function (c) { outChunks.push(c); });
            outRes.on("end", function () {
                const outBody = Buffer.concat(outChunks);
                res.writeHead(outRes.statusCode || 502, {
                    "Content-Type": outRes.headers["content-type"] || "application/octet-stream",
                    "Cache-Control": "no-store",
                });
                res.end(outBody);
            });
        }
    );
    outReq.on("error", function (err) {
        if (!res.headersSent) {
            res.writeHead(502, { "Content-Type": "application/json" });
        }
        res.end(JSON.stringify({ error: "Proxy request failed: " + err.message }));
    });
    if (body && body.length) outReq.write(body);
    outReq.end();
}

function handlePtero(req, res, fullUrl, routePrefix, targetPrefix, keyHeader) {
    // routePrefix  = what the browser calls (e.g. "/api/ptero/", "/api/ptero-client/")
    // targetPrefix = what the panel gets (e.g. "/api/application/", "/api/client/")
    const panel = req.headers["x-ptero-panel"] || PTERO_PANEL;
    const configuredKey = targetPrefix === "/api/client/" ? PTERO_CLIENT_KEY : PTERO_KEY;
    const key = keyHeader ? (req.headers[keyHeader] || configuredKey) : configuredKey;

    if (!panel) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Pterodactyl panel URL not configured. Set PTERO_PANEL in server.js." }));
    }
    if (!key) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            error: targetPrefix === "/api/client/"
                ? "Client API key missing. Set PTERO_CLIENT_KEY in server.js."
                : "Pterodactyl Application API key missing. Set PTERO_KEY in server.js."
        }));
    }

    const qIndex = fullUrl.indexOf("?");
    const pathPart = qIndex >= 0 ? fullUrl.slice(0, qIndex) : fullUrl;
    const query = qIndex >= 0 ? fullUrl.slice(qIndex) : "";
    const rest = pathPart.slice(routePrefix.length);
    const target = panel.replace(/\/+$/, "") + targetPrefix + rest + query;

    collectBody(req, function (body) {
        forwardRequest(req, res, target, req.method, body, key);
    });
}

// File upload passthrough: the panel returns a pre-signed upload URL; the
// browser PUTs the raw file to /api/ptero-upload?url=<signed> and we forward
// the body to that URL (avoids CORS issues with the panel's signed URL).
function handleUploadProxy(req, res) {
    let q;
    try {
        q = new URL(req.url, "http://localhost");
    } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Bad upload URL" }));
    }
    const url = q.searchParams.get("url");
    if (!url) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Missing upload url" }));
    }
    collectBody(req, function (body) {
        forwardRequest(req, res, url, "PUT", body, null);
    });
}

/* ==========================================================================
   WINGS (DAEMON) BRIDGE — admin status + power WITHOUT a Client API key
   --------------------------------------------------------------------------
   The panel runs servers on daemons (Wings) and talks to them directly with
   each node's daemon token. As the ADMIN we can read that token from the
   Application API (nodes/{id}/configuration) and then call Wings ourselves:

     GET  {scheme}://{node}:{port}/api/servers/{uuid}   -> real power state
     POST {scheme}://{node}:{port}/api/servers/{uuid}/power  {action}

   This is exactly how the panel itself controls servers, and it requires NO
   Client API key. Falls back gracefully when the daemon is unreachable.
   ========================================================================== */
const wingsCache = {}; // nodeId -> { scheme, fqdn, port, token, ts }

function wingsRequest(method, targetUrl, token, cb) {
    let parsed;
    try {
        parsed = new URL(targetUrl);
    } catch (e) {
        cb(400, null, "Invalid Wings URL");
        return null;
    }
    const isHttps = parsed.protocol === "https:";
    const lib = isHttps ? https : http;
    const port = parsed.port || (isHttps ? 443 : 80);
    const headers = { Accept: "application/json", "User-Agent": "Spark-Dashboard/1.0" };
    if (token) headers["Authorization"] = "Bearer " + token;
    if (method === "POST") headers["Content-Type"] = "application/json";
    let done = false;
    function once(status, body, errMsg) {
        if (done) return;
        done = true;
        cb(status, body, errMsg);
    }
    const outReq = lib.request(
        {
            hostname: parsed.hostname,
            port: port,
            path: parsed.pathname + parsed.search,
            method: method,
            headers: headers,
            rejectUnauthorized: false, // Wings usually uses self-signed certs
        },
        function (outRes) {
            const outChunks = [];
            outRes.on("data", function (c) { outChunks.push(c); });
            outRes.on("end", function () {
                once(outRes.statusCode || 502, Buffer.concat(outChunks), null);
            });
        }
    );
    outReq.on("error", function (err) {
        once(502, null, "Wings request failed: " + err.message);
    });
    // Never let a hung daemon stall the dashboard's live status poll.
    outReq.setTimeout(15000, function () {
        outReq.destroy(new Error("Wings request timed out"));
    });
    return outReq;
}

// Generic daemon forwarder used by the admin proxy: passes any method/body
// through to the daemon and streams the RAW response (status, headers, body)
// back so file contents / downloads keep their original content type.
function wingsForward(method, targetUrl, token, body, contentType, cb) {
    let parsed;
    try {
        parsed = new URL(targetUrl);
    } catch (e) {
        cb(400, {}, null, "Invalid Wings URL");
        return null;
    }
    const isHttps = parsed.protocol === "https:";
    const lib = isHttps ? https : http;
    const port = parsed.port || (isHttps ? 443 : 80);
    const headers = { Accept: "application/json", "User-Agent": "Spark-Dashboard/1.0" };
    if (token) headers["Authorization"] = "Bearer " + token;
    if (method !== "GET" && method !== "HEAD") {
        headers["Content-Type"] = contentType || "application/json";
        headers["Content-Length"] = body ? body.length : 0;
    }
    let done = false;
    function once(status, hdrs, b, errMsg) {
        if (done) return;
        done = true;
        cb(status, hdrs, b, errMsg);
    }
    const outReq = lib.request(
        {
            hostname: parsed.hostname,
            port: port,
            path: parsed.pathname + parsed.search,
            method: method,
            headers: headers,
            rejectUnauthorized: false, // Wings usually uses self-signed certs
        },
        function (outRes) {
            const outChunks = [];
            outRes.on("data", function (c) { outChunks.push(c); });
            outRes.on("end", function () {
                once(outRes.statusCode || 502, outRes.headers, Buffer.concat(outChunks), null);
            });
        }
    );
    outReq.on("error", function (err) {
        once(502, {}, null, "Wings request failed: " + err.message);
    });
    outReq.setTimeout(30000, function () {
        outReq.destroy(new Error("Wings request timed out"));
    });
    if (body && body.length) outReq.write(body);
    outReq.end();
    return outReq;
}

// Resolve a node's daemon endpoint + token (cached 10 min).
// Error-first callback: cb(errMsg) on failure, cb(null, info) on success.
function getWingsNode(nodeId, cb) {
    const hit = wingsCache[nodeId];
    if (hit && Date.now() - hit.ts < 10 * 60 * 1000) return cb(null, hit);
    const base = PTERO_PANEL.replace(/\/+$/, "");
    const req1 = libRequest("GET", base + "/api/application/nodes/" + nodeId, PTERO_KEY, function (s1, b1, e1) {
        if (e1 || s1 >= 300) return cb(e1 || ("node HTTP " + s1));
        const req2 = libRequest("GET", base + "/api/application/nodes/" + nodeId + "/configuration", PTERO_KEY, function (s2, b2, e2) {
            if (e2 || s2 >= 300) return cb(e2 || ("config HTTP " + s2));
            let node, cfg;
            try { node = JSON.parse(b1); cfg = JSON.parse(b2); } catch (e) { return cb("bad JSON from panel"); }
            const a = (node && node.attributes) || {};
            const info = {
                scheme: a.scheme || ((cfg.api && cfg.api.ssl && cfg.api.ssl.enabled) ? "https" : "http"),
                fqdn: a.fqdn,
                port: (cfg.api && cfg.api.port) || a.daemon_listen || 8080,
                token: cfg.token,
                ts: Date.now(),
            };
            wingsCache[nodeId] = info;
            cb(null, info);
        });
        if (req2) req2.end();
    });
    if (req1) req1.end();
}

// Resolve which node a server UUID lives on (from the application API server
// list). Cached 30s so the file/console admin routes stay snappy.
const wingsServerNodeCache = {}; // uuid -> { node, ts }
function wingsServerUuidNode(uuid, cb) {
    const hit = wingsServerNodeCache[uuid];
    if (hit && Date.now() - hit.ts < 30 * 1000) return cb(null, hit.node);
    const base = PTERO_PANEL.replace(/\/+$/, "");
    const req1 = libRequest("GET", base + "/api/application/servers?per_page=100", PTERO_KEY, function (s, b, e) {
        if (e || s >= 300) return cb(e || ("panel HTTP " + s));
        let list;
        try { list = JSON.parse(b); } catch (err) { return cb("bad JSON from panel"); }
        const arr = (list && list.data) || [];
        const found = arr.filter(function (x) { return x.attributes && x.attributes.uuid === uuid; })[0];
        if (!found || !found.attributes) return cb("server not found on panel");
        wingsServerNodeCache[uuid] = { node: found.attributes.node, ts: Date.now() };
        cb(null, found.attributes.node);
    });
    if (req1) req1.end();
}

function parseWingsState(raw) {
    // The daemon returns { state, is_suspended, utilization, configuration }
    // at the top level; be defensive about both shapes anyway.
    let d = null;
    try { d = JSON.parse(raw); } catch (e) { return null; }
    const a = (d && d.attributes) || d;
    if (!a || a.state == null) return null;
    // Normalize the daemon's live utilization into the same shape the dashboard's
    // client-API path already consumes (memory_bytes, cpu_absolute, disk_bytes,
    // uptime, network). Limits Wings does not report (disk limit, sometimes
    // memory limit) are filled client-side from the application API limits.
    let res = null;
    const u = a.utilization || a.resources || null;
    if (u && u.memory_bytes != null) {
        res = {
            memory_bytes: u.memory_bytes || 0,
            memory_limit: u.memory_limit_bytes || 0,
            cpu_absolute: typeof u.cpu_absolute === "number" ? u.cpu_absolute : null,
            disk_bytes: u.disk_bytes || 0,
            uptime: u.uptime || 0,
            network_rx: (u.network && u.network.rx_bytes) || 0,
            network_tx: (u.network && u.network.tx_bytes) || 0
        };
    }
    return { state: a.state, suspended: !!(a.is_suspended != null ? a.is_suspended : a.suspended), resources: res };
}

/* ==========================================================================
   STATIC FILE SERVER
   ========================================================================== */

const server = http.createServer((req, res) => {
    let urlPath;
    try {
        urlPath = decodeURIComponent(req.url.split("?")[0]);
    } catch (e) {
        res.writeHead(400);
        return res.end("Bad Request");
    }

    // CORS: let the dashboard be opened directly from disk (file://) and still
    // talk to this server at http://localhost:3000 (GET is safe, POST/PATCH/DELETE
    // send a preflight which we answer here).
    if (urlPath.indexOf("/api/") === 0) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Ptero-Panel, X-Ptero-Key");
        if (req.method === "OPTIONS") {
            res.writeHead(204);
            return res.end();
        }
    }

    // Health check: the dashboard pings this first so it can tell
    // "server not running" apart from "panel rejected the request".
    if (urlPath === "/api/health") {
        res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        return res.end(JSON.stringify({ ok: true, service: "spark-dashboard", pteroPanel: PTERO_PANEL, pteroKeySet: !!PTERO_KEY, pteroClientKeySet: !!PTERO_CLIENT_KEY }));
    }

    // Panel diagnostic: makes a real request to the panel and reports its raw
    // status + body so the dashboard can show the actual error (bad key, 404,
    // panel down, etc.). Must be checked before the generic /api/ptero/ route.
    // NOTE: success bodies are stripped (never leak server data cross-origin);
    // error bodies (401/403/404…) are passed through so the cause is visible.
    if (urlPath === "/api/ptero/diag") {
        const target = PTERO_PANEL.replace(/\/+$/, "") + "/api/application/servers?per_page=1";
        const key = req.headers["x-ptero-key"] || PTERO_KEY;
        const outReq = libRequest("GET", target, key, function (status, body, errMsg) {
            let payload;
            if (errMsg) payload = { error: errMsg };
            else if (status >= 200 && status < 300) payload = { status: status, ok: true, detail: "panel reachable" };
            else payload = { status: status, ok: false, body: String(body || "").slice(0, 300) };
            res.writeHead(status || 502, { "Content-Type": "application/json", "Cache-Control": "no-store" });
            res.end(JSON.stringify(payload));
        });
        if (outReq) { outReq.end(); }
        return;
    }

    // File upload passthrough
    if (urlPath === "/api/ptero-upload") {
        return handleUploadProxy(req, res);
    }

    // Wings (daemon) status: real power state for every server, admin-only path
    if (urlPath === "/api/wings/status" && req.method === "GET") {
        const base = PTERO_PANEL.replace(/\/+$/, "");
        const req1 = libRequest("GET", base + "/api/application/servers?per_page=100", PTERO_KEY, function (s1, b1, e1) {
            if (e1 || s1 >= 300) {
                res.writeHead(s1 || 502, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: e1 || ("panel HTTP " + s1) }));
            }
            let list;
            try { list = JSON.parse(b1); } catch (e) {
                res.writeHead(502, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "bad JSON from panel" }));
            }
            const servers = (list && list.data) || [];
            const out = {};
            let pending = servers.length;
            if (!pending) {
                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ servers: {} }));
            }
            servers.forEach(function (srv) {
                const a = (srv && srv.attributes) || {};
                const ident = a.identifier;
                const nodeId = a.node;
                const uuid = a.uuid;
                if (!nodeId || !uuid) { out[ident] = { error: "no node/uuid" }; finish(); return; }
                getWingsNode(nodeId, function (err2, info) {
                    if (err2 || !info) { out[ident] = { error: err2 || "no node info" }; finish(); return; }
                    const target = info.scheme + "://" + info.fqdn + ":" + info.port + "/api/servers/" + uuid;
                    const wr = wingsRequest("GET", target, info.token, function (ws, wb, we) {
                        if (we || ws >= 300) { out[ident] = { error: we || ("wings HTTP " + ws) }; finish(); return; }
                        const st = parseWingsState(wb);
                        if (!st) { out[ident] = { error: "unexpected wings response" }; finish(); return; }
                        // Wings' tracked state can lag reality (e.g. stuck on
                        // "starting" after a daemon restart even though the
                        // container is up). For the states most likely to be
                        // stale ("starting" / "offline"), probe the container
                        // directly: POSTing an EMPTY command list is a no-op,
                        // but the daemon only accepts it (204) when the
                        // container is genuinely running; a stopped or not-yet-
                        // created container gets a 502 instead. "stopping" is
                        // a real in-flight event, so it is left as reported.
                        if (st.state === "starting" || st.state === "offline") {
                            const probeUrl = info.scheme + "://" + info.fqdn + ":" + info.port + "/api/servers/" + uuid + "/commands";
                            const pr = wingsRequest("POST", probeUrl, info.token, function (ps, pb, pe) {
                                if (!pe && ps === 204) st.state = "running";
                                out[ident] = st;
                                finish();
                            });
                            if (pr) pr.end(JSON.stringify({ commands: [] }));
                            else { out[ident] = st; finish(); }
                        } else {
                            out[ident] = st;
                            finish();
                        }
                    });
                    if (wr) wr.end();
                });
            });
            function finish() {
                if (--pending <= 0) {
                    res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
                    res.end(JSON.stringify({ servers: out }));
                }
            }
        });
        if (req1) req1.end();
        return;
    }

    // Wings (daemon) power control: admin-only path, no Client API key needed
    if (urlPath === "/api/wings/power" && req.method === "POST") {
        collectBody(req, function (body) {
            let p;
            try { p = JSON.parse(body || "{}"); } catch (e) { p = {}; }
            const uuid = p.uuid;
            const nodeId = p.node;
            const action = p.action;
            if (!uuid || nodeId == null || !action) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "uuid, node and action are required" }));
            }
            getWingsNode(nodeId, function (err, info) {
                if (err || !info) {
                    res.writeHead(502, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ error: err || "no node info" }));
                }
                const target = info.scheme + "://" + info.fqdn + ":" + info.port + "/api/servers/" + uuid + "/power";
                const wr = wingsRequest("POST", target, info.token, function (ws, wb, we) {
                    if (we) {
                        res.writeHead(502, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ error: we }));
                    }
                    res.writeHead(ws || 502, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ ok: ws >= 200 && ws < 300, status: ws }));
                });
                if (wr) wr.end(JSON.stringify({ action: action, wait_seconds: 30 }));
            });
        });
        return;
    }
    // Wings (daemon) generic admin proxy: forwards any method/path for a server
    // to its daemon (files/*, logs, commands, reinstall, sync...) using the node
    // token - no Client API key required. Body + content-type are passed through.
    if (urlPath.indexOf("/api/wings/servers/") === 0) {
        const rest = urlPath.slice("/api/wings/servers/".length); // {uuid}/{path...}
        const slash = rest.indexOf("/");
        if (slash <= 0) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "bad wings path" }));
        }
        const uuid = rest.slice(0, slash);
        const sub = rest.slice(slash + 1);
        const qIndex = req.url.indexOf("?");
        const query = qIndex >= 0 ? req.url.slice(qIndex) : "";
        collectBody(req, function (body) {
            wingsServerUuidNode(uuid, function (err, nodeId) {
                if (err || nodeId == null) {
                    res.writeHead(502, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ error: err || "no node for server" }));
                }
                getWingsNode(nodeId, function (err2, info) {
                    if (err2 || !info) {
                        res.writeHead(502, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ error: err2 || "no node info" }));
                    }
                    const target = info.scheme + "://" + info.fqdn + ":" + info.port + "/api/servers/" + uuid + "/" + sub + query;
                    const ct = req.headers["content-type"] || "application/json";
                    const wr = wingsForward(req.method, target, info.token, body, ct, function (ws, hdrs, wb, we) {
                        if (we) {
                            res.writeHead(502, { "Content-Type": "application/json" });
                            return res.end(JSON.stringify({ error: we }));
                        }
                        const outHeaders = {
                            "Content-Type": (hdrs && hdrs["content-type"]) || "application/octet-stream",
                            "Cache-Control": "no-store",
                        };
                        if (hdrs && hdrs["content-disposition"]) outHeaders["Content-Disposition"] = hdrs["content-disposition"];
                        if (hdrs && hdrs["content-length"] != null) outHeaders["Content-Length"] = hdrs["content-length"];
                        res.writeHead(ws || 502, outHeaders);
                        res.end(wb || Buffer.alloc(0));
                    });
                    // wingsForward already wrote the body and ended the request
                    // internally — do NOT write/end again here (would throw
                    // "write after end" and return a bogus 502 to the browser
                    // even though the daemon received the request).
                });
            });
        });
        return;
    }
    // Pterodactyl proxy routes (pass the full url so query strings are forwarded)
    if (urlPath.indexOf("/api/ptero-client/") === 0) {
        return handlePtero(req, res, req.url, "/api/ptero-client/", "/api/client/", "x-ptero-client-key");
    }
    if (urlPath.indexOf("/api/ptero/") === 0) {
        return handlePtero(req, res, req.url, "/api/ptero/", "/api/application/", null);
    }
    if (urlPath.indexOf("/api/") === 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Unknown API route" }));
    }

    if (urlPath === "/") urlPath = "/index.html";

    const filePath = path.normalize(path.join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
        res.writeHead(403);
        return res.end("Forbidden");
    }

    fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
            res.writeHead(404);
            return res.end("404 Not Found");
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log("Spark Services running at http://localhost:" + PORT);
    console.log("Pterodactyl panel: " + (PTERO_PANEL || "not set"));
});
