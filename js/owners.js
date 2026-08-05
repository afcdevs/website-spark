/* Spark Services - owners list + server stats
   Reads window.SPARK_OWNERS / window.SPARK_SERVERS, written by the Discord bot
   to assets/owners-data.js (no database). */
(function () {
    "use strict";

    var MSG = {
        loading: { en: "Loading team…", ar: "جاري تحميل الفريق…" },
        empty: { en: "No team members yet. Join the Discord to be the first.", ar: "لا يوجد أعضاء في الفريق بعد. انضم للديسكورد لتكون الأول." },
        notConfigured: { en: "Team data not generated yet. Run the Discord bot.", ar: "لم يتم توليد بيانات الفريق بعد. شغل البوت." }
    };

    function lang() {
        return document.documentElement.lang === "ar" ? "ar" : "en";
    }
    function t(key) {
        return MSG[key][lang()];
    }
    function esc(s) {
        var d = document.createElement("div");
        d.textContent = s == null ? "" : String(s);
        return d.innerHTML;
    }

    function renderOwner(o) {
        var name = esc(o.name || "?");
        var server = esc(o.server || "");
        var letter = (o.name || "?").charAt(0).toUpperCase();
        var avatar = o.avatar
            ? '<img class="owner-avatar" data-letter="' + letter + '" src="' + esc(o.avatar) + '" alt="' + name + '" loading="lazy">'
            : '<span class="owner-avatar">' + letter + "</span>";
        return '<div class="owner-card">' +
            avatar +
            "<div>" +
            "<strong>" + name + "</strong>" +
            (server ? '<span class="owner-server">' + server + "</span>" : "") +
            "</div>" +
            "</div>";
    }

    function setOwners(html) {
        var grid = document.getElementById("owners-grid");
        if (grid) grid.innerHTML = html;
    }

    function loadOwners() {
        var grid = document.getElementById("owners-grid");
        if (!grid) return;
        var data = window.SPARK_OWNERS;
        if (!data || !data.length) {
            setOwners('<p class="owners-empty">' + (data ? t("empty") : t("notConfigured")) + "</p>");
            return;
        }
        setOwners(data.map(renderOwner).join(""));
    }

    function loadStats() {
        var s = window.SPARK_SERVERS;
        if (!s) return;
        var el = document.querySelector(".stat-number[data-stat='servers']");
        if (el && s.online != null) el.textContent = s.online + "+";
    }

    // avatar <img> error fallback -> show the first letter instead
    document.addEventListener(
        "error",
        function (e) {
            var img = e.target;
            if (img && img.classList && img.classList.contains("owner-avatar")) {
                var letter = img.getAttribute("data-letter") || "?";
                img.outerHTML = '<span class="owner-avatar">' + letter + "</span>";
            }
        },
        true
    );

    document.addEventListener("DOMContentLoaded", function () {
        loadOwners();
        loadStats();
    });

    // re-render owners when language switches (fires from js/script.js)
    document.addEventListener("spark:lang", function () {
        loadOwners();
    });

    window.sparkOwners = {
        loadOwners: loadOwners,
        loadStats: loadStats
    };
})();
