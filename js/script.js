/* ==========================================================================
   Spark Services — Interactive behaviors
   ========================================================================== */

(function () {
    "use strict";

    const DISCORD_URL = "https://discord.gg/SM4cTKVAY3";

    /* ---------- Sticky header shadow ---------- */
    const header = document.getElementById("header");
    const backToTop = document.getElementById("back-to-top");

    function onScroll() {
        const y = window.scrollY;
        header.classList.toggle("scrolled", y > 20);
        backToTop.classList.toggle("show", y > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Back to top ---------- */
    backToTop.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ---------- Mobile hamburger menu ---------- */
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");

    function closeMenu() {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    hamburger.addEventListener("click", function () {
        const isOpen = navMenu.classList.toggle("active");
        hamburger.classList.toggle("active", isOpen);
        hamburger.setAttribute("aria-expanded", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (e) {
        if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    window.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMenu();
    });

    /* ======================================================================
       PLAN TABS — Discord Bot / Minecraft Server
       ====================================================================== */
    const planTabs = document.querySelectorAll(".plan-tab");
    const planGroups = document.querySelectorAll(".plan-group");

    planTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            const target = tab.dataset.planTab;

            planTabs.forEach(function (t) {
                const isActive = t === tab;
                t.classList.toggle("active", isActive);
                t.setAttribute("aria-selected", isActive ? "true" : "false");
            });

            planGroups.forEach(function (group) {
                const isActive = group.dataset.planGroup === target;
                group.classList.toggle("active", isActive);
                if (isActive) {
                    group.querySelectorAll(".reveal").forEach(function (el) {
                        el.classList.add("visible");
                    });
                }
            });
        });
    });

    /* ======================================================================
       LANGUAGE SWITCHER — English / العربية
       ====================================================================== */
    const translations = {
        en: {
            "nav.home": "Home",
            "nav.services": "Services",
            "nav.pricing": "Pricing",
            "nav.about": "About",
            "nav.team": "Team",
            "nav.contact": "Contact",
            "nav.cta": "Get Started",

            "hero.badge": "deploy in < 60 seconds · AMD Epyc / NVMe",
            "hero.title": "Discord bot &amp; Minecraft hosting, <span class=\"gradient-text\">without the markup</span>",
            "hero.subtitle": "Pterodactyl panel, Node 20 / Python 3.11 / Java 21, free migrations. A bot plan starts at $0.50/mo, a Minecraft server at $2/mo. No hidden fees.",
            "hero.btn1": "See pricing",
            "hero.btn2": "Ask us on Discord",
            "hero.trust1": "uptime, monitored",
            "hero.trust2": "support, in Discord",
            "hero.cardStatus": "server online",
            "hero.live": "Live",

            "stats.uptime": "uptime",
            "stats.support": "support in Discord",
            "stats.deployed": "servers running",
            "stats.setup": "time to live",

            "about.tag": "The Story",
            "about.title": "We got tired of paying for <span class=\"gradient-text\">sleeping bots</span>",
            "about.subtitle": "Spark started in May 2026 when three friends realized the bots they paid $12/mo for went offline more often than their own laptops. We built the host we wanted: simple, fast, and run by people who answer messages.",
            "about.body": "Everything runs on AMD Epyc nodes with NVMe drives, dedicated per server — not a shared $5 VPS pretending to be \"premium\". Our panel is Pterodactyl, the same one the big hosts use, because we'd rather spend time making hosting good than reinventing a control panel.",
            "about.coreValues": "What that means for you",
            "about.v1": "<strong>Price stays the price</strong> — what you see is what you pay, every month.",
            "about.v2": "<strong>We answer</strong> — support is a real person in our Discord, not a ticket queue.",
            "about.v3": "<strong>You can move</strong> — free migration, and a refund if the first 48 hours aren't right.",
            "about.v4": "<strong>We keep it running</strong> — monitored around the clock, because your community depends on it.",
            "about.card1.title": "AMD Epyc + NVMe",
            "about.card1.desc": "No overselling. The CPU power we advertise is the CPU power you get.",
            "about.card2.title": "Pterodactyl panel",
            "about.card2.desc": "The panel you already know. Files, console, backups — nothing custom to relearn.",
            "about.card3.title": "Free migration",
            "about.card3.desc": "We move your worlds, bots, and databases over. You just watch it happen.",
            "about.card4.title": "48-hour refund",
            "about.card4.desc": "Not happy in the first two days? Full refund, no questions, no hard feelings.",

            "services.tag": "Services",
            "services.title": "Two things, <span class=\"gradient-text\">done properly</span>",
            "services.subtitle": "We don't host websites or VPS junk. We host the two things we actually run ourselves, and we've spent years getting both right.",
            "services.bot.title": "Discord bot hosting",
            "services.bot.desc": "Run your bot on Node 20, Python 3.11, or Java 21. Installed from one command in the panel, online in under a minute.",
            "services.bot.f1": "Credits billed monthly, not per-minute",
            "services.bot.f2": "SQL database included on most plans",
            "services.bot.f3": "Grow from 512MB to 4GB without reinstall",
            "services.bot.btn": "Bot pricing →",
            "services.mc.title": "Minecraft server hosting",
            "services.mc.desc": "Paper, Fabric, Forge, or Vanilla with one click. Modpacks install straight from the panel — no manual jar digging.",
            "services.mc.f1": "Plugin + mod manager built in",
            "services.mc.f2": "World backups every 24h, kept for a week",
            "services.mc.f3": "Move in free — we transfer the world file",
            "services.mc.btn": "MC pricing →",

            "pricing.tag": "Pricing",
            "pricing.title": "Flat prices, <span class=\"gradient-text\">no games</span>",
            "pricing.subtitle": "All prices are per 30 days. Credits refill every cycle. Upgrade or downgrade from the panel — takes effect instantly.",
            "pricing.tab1": "Discord Bot",
            "pricing.tab2": "Minecraft Server",
            "pricing.per30": "/ 30 days",
            "pricing.mostPopular": "Most Popular",
            "pricing.select": "Order in Discord",
            "pricing.k.ram": "RAM",
            "pricing.k.storage": "Storage",
            "pricing.k.cpu": "CPU",
            "pricing.k.db": "Databases",
            "pricing.k.backups": "Backups",
            "pricing.k.credits": "Credits",
            "pricing.note": "Something bigger? <a href=\"" + DISCORD_URL + "\" target=\"_blank\" rel=\"noopener\">Message us</a> — for big servers and networks we put together custom nodes.",

            "pricing.bot1.name": "bot · 512MB",
            "pricing.bot1.desc": "One bot or a test project",
            "pricing.bot1.f1": "512 MB",
            "pricing.bot1.f2": "1 GB NVMe",
            "pricing.bot1.f3": "50%",
            "pricing.bot1.f4": "0",
            "pricing.bot1.f5": "0",
            "pricing.bot1.credits": "20 Million Credits",
            "pricing.bot2.name": "bot · 1GB",
            "pricing.bot2.desc": "For a bot that's actually growing",
            "pricing.bot2.f1": "1 GB",
            "pricing.bot2.f2": "1 GB NVMe",
            "pricing.bot2.f3": "100%",
            "pricing.bot2.f4": "1",
            "pricing.bot2.f5": "1",
            "pricing.bot2.credits": "40 Million Credits",
            "pricing.bot3.name": "bot · 2GB",
            "pricing.bot3.desc": "The one most people land on",
            "pricing.bot3.f1": "2 GB",
            "pricing.bot3.f2": "3 GB NVMe",
            "pricing.bot3.f3": "100%",
            "pricing.bot3.f4": "2",
            "pricing.bot3.f5": "2",
            "pricing.bot3.credits": "55 Million Credits",
            "pricing.bot4.name": "bot · 3GB",
            "pricing.bot4.desc": "Music bots and heavy workloads",
            "pricing.bot4.f1": "3 GB",
            "pricing.bot4.f2": "4 GB NVMe",
            "pricing.bot4.f3": "150%",
            "pricing.bot4.f4": "3",
            "pricing.bot4.f5": "3",
            "pricing.bot4.credits": "70 Million Credits",
            "pricing.bot5.name": "bot · 4GB",
            "pricing.bot5.desc": "Big bots, or several bots at once",
            "pricing.bot5.f1": "4 GB",
            "pricing.bot5.f2": "5 GB NVMe",
            "pricing.bot5.f3": "150%",
            "pricing.bot5.f4": "4",
            "pricing.bot5.f5": "4",
            "pricing.bot5.credits": "85 Million Credits",

            "pricing.mc1.name": "mc · 2GB",
            "pricing.mc1.desc": "You and your friends, ~8 players",
            "pricing.mc1.f1": "2 GB",
            "pricing.mc1.f2": "5 GB NVMe",
            "pricing.mc1.f3": "150%",
            "pricing.mc1.f4": "0",
            "pricing.mc1.f5": "0",
            "pricing.mc2.name": "mc · 3GB",
            "pricing.mc2.desc": "A proper community server, ~20 players",
            "pricing.mc2.f1": "3 GB",
            "pricing.mc2.f2": "7 GB NVMe",
            "pricing.mc2.f3": "200%",
            "pricing.mc2.f4": "1",
            "pricing.mc2.f5": "1",
            "pricing.mc3.name": "mc · 5GB",
            "pricing.mc3.desc": "Modpacks and big networks",
            "pricing.mc3.f1": "5 GB",
            "pricing.mc3.f2": "12 GB NVMe",
            "pricing.mc3.f3": "250%",
            "pricing.mc3.f4": "2",
            "pricing.mc3.f5": "2",

            "features.tag": "Under the hood",
            "features.title": "The boring stuff, <span class=\"gradient-text\">done right</span>",
            "features.subtitle": "Nothing fancy to look at — just the parts that keep your server up at 3am.",
            "features.c1.title": "AMD Epyc nodes",
            "features.c1.desc": "Dedicated CPU cores, not shared slices of a cheap VPS. Performance you can feel.",
            "features.c2.title": "NVMe storage",
            "features.c2.desc": "Every plan sits on NVMe. Chunk loading and bot startup that don't make you wait.",
            "features.c3.title": "60-second deploy",
            "features.c3.desc": "Order, click deploy, done. Your server is online before you finish your coffee.",
            "features.c4.title": "Hourly backups",
            "features.c4.desc": "We snapshot your data every hour. One click restores you to any point in the day.",
            "features.c5.title": "DDoS protection",
            "features.c5.desc": "Always-on filtering on every server. Attacks don't take you down, they just tick up our log file.",
            "features.c6.title": "Real support",
            "features.c6.desc": "A human reads your message. Average first reply is under 30 minutes, and we don't close tickets on a timer.",

            "locations.tag": "Locations",
            "locations.title": "Based in <span class=\"gradient-text\">Germany</span>",
            "locations.subtitle": "All servers are hosted in our Frankfurt, Germany node — central Europe, DDoS-filtered, 40 Gbps uplink. One location, no compromises.",
            "locations.featured": "All plans hosted here",
            "locations.l1.name": "Frankfurt, Germany",
            "locations.l1.desc": "Our single, primary location. Lowest latency across Europe, great peering worldwide.",

            "team.tag": "Team",
            "team.title": "The team that <span class=\"gradient-text\">runs it</span>",
            "team.subtitle": "Meet the people behind Spark — they all hang out in our Discord.",
            "team.loading": "Loading team…",

            "contact.tag": "Contact",
            "contact.title": "Talk to our <span class=\"gradient-text\">team</span>",
            "contact.tagline": "We don't do phone lines or contact forms. Everything runs through our Discord — that's where the answers and the people are.",
            "contact.discord.title": "Discord server",
            "contact.discord.desc": "Sales, support, billing, status updates — all in one place. Come say hi.",
            "contact.discord.link": "Join the Discord →",

            "social.tagline": "One server to rule them all. <span class=\"gradient-text\">No tickets.</span>",

            "footer.desc": "Discord bot & Minecraft hosting on AMD Epyc nodes with NVMe storage. Pterodactyl panel, real support, prices that stay put.",
            "footer.quick": "Quick Links",
            "footer.resources": "Resources",
            "footer.support": "Support",
            "footer.status": "Status Page",
            "footer.docs": "Documentation",
            "footer.serverStatus": "Server Status",
            "footer.tos": "Terms of Service",
            "footer.join.title": "Join the Discord",
            "footer.join.desc": "Status updates, new features, giveaways, and actual humans. That's where we live.",
            "footer.join.btn": "Join Discord",
            "footer.rights": "All rights reserved.",
            "footer.legal1": "Privacy Policy",
            "footer.legal2": "Terms of Service",
            "footer.legal3": "Refund Policy"
        },

        ar: {
            "nav.home": "الرئيسية",
            "nav.services": "الخدمات",
            "nav.pricing": "الأسعار",
            "nav.about": "من نحن",
            "nav.team": "الفريق",
            "nav.contact": "تواصل معنا",
            "nav.cta": "ابدأ الآن",

            "hero.badge": "تشغيل في أقل من 60 ثانية · AMD Epyc / NVMe",
            "hero.title": "استضافة بوتات ديسكورد وماين كرافت، <span class=\"gradient-text\">بلا أي زيادات</span>",
            "hero.subtitle": "لوحة Pterodactyl، Node 20 / Python 3.11 / Java 21، وترحيل مجاني. خطة بوت تبدأ من 0.50$ شهريًا، وسيرفر ماين كرافت من 2$ شهريًا. بلا رسوم خفية.",
            "hero.btn1": "شاهد الأسعار",
            "hero.btn2": "اسألنا على ديسكورد",
            "hero.trust1": "وقت تشغيل، مراقَب",
            "hero.trust2": "دعم، عبر ديسكورد",
            "hero.cardStatus": "الخادم متصل",
            "hero.live": "مباشر",

            "stats.uptime": "وقت التشغيل",
            "stats.support": "الدعم عبر ديسكورد",
            "stats.deployed": "خادم يعمل",
            "stats.setup": "وقت التشغيل الفعلي",

            "about.tag": "القصة",
            "about.title": "زهقنا ندفع مقابل <span class=\"gradient-text\">بوتات نايمة</span>",
            "about.subtitle": "بدأت سبارك في ماي 2026 حين اكتشف ثلاثة أصدقاء أن البوتات التي يدفعون مقابلها 12$ شهريًا تنقطع عن العمل أكثر من أجهزتهم الخاصة. بنينا الاستضافة التي أردناها: بسيطة، سريعة، ويديرها أشخاص يردّون على الرسائل.",
            "about.body": "كل شيء يعمل على عُقد AMD Epyc مع أقراص NVMe، مخصصة لكل خادم — وليس VPS مشترك بـ5$ يتظاهر بأنه \"بريميوم\". لوحتنا هي Pterodactyl، نفس اللوحة التي تستخدمها الشركات الكبيرة، لأننا نفضّل قضاء الوقت في تحسين الاستضافة بدلاً من إعادة اختراع لوحة تحكم.",
            "about.coreValues": "ماذا يعني هذا لك",
            "about.v1": "<strong>السعر يبقى كما هو</strong> — ما تراه هو ما تدفعه، كل شهر.",
            "about.v2": "<strong>نرد عليك</strong> — الدعم شخص حقيقي في ديسكوردنا، وليس قائمة تذاكر.",
            "about.v3": "<strong>يمكنك الانتقال</strong> — ترحيل مجاني، واسترداد إذا لم تناسبك أول 48 ساعة.",
            "about.v4": "<strong>نبقيها تعمل</strong> — مراقبة على مدار الساعة، لأن مجتمعك يعتمد عليها.",
            "about.card1.title": "AMD Epyc + NVMe",
            "about.card1.desc": "بلا مبالغة. قوة المعالج التي نعلن عنها هي التي ستحصل عليها فعلًا.",
            "about.card2.title": "لوحة Pterodactyl",
            "about.card2.desc": "اللوحة التي تعرفها أصلًا. ملفات وكونسول ونسخ احتياطية — لا شيء جديد لتتعلمه.",
            "about.card3.title": "ترحيل مجاني",
            "about.card3.desc": "ننقل عوالمك وبوتاتك وقواعد بياناتك. أنت فقط تشاهد.",
            "about.card4.title": "استرداد خلال 48 ساعة",
            "about.card4.desc": "غير راضٍ في اليومين الأولين؟ استرداد كامل، بلا أسئلة وبلا زعل.",

            "services.tag": "الخدمات",
            "services.title": "شيئان فقط، <span class=\"gradient-text\">بشكل صحيح</span>",
            "services.subtitle": "لا نستضيف مواقع أو حماقات VPS. نستضيف الشيئين اللذين نشغّلهما بأنفسنا فعلًا، وقضينا سنوات في إتقانهما.",
            "services.bot.title": "استضافة بوتات ديسكورد",
            "services.bot.desc": "شغّل بوتك على Node 20 أو Python 3.11 أو Java 21. يُثبَّت بأمر واحد من اللوحة ويعمل في أقل من دقيقة.",
            "services.bot.f1": "الرصيد يُدفع شهريًا، وليس بالدقيقة",
            "services.bot.f2": "قاعدة بيانات SQL مضمّنة في أغلب الخطط",
            "services.bot.f3": "كبّر من 512MB إلى 4GB دون إعادة تثبيت",
            "services.bot.btn": "أسعار البوتات ←",
            "services.mc.title": "استضافة سيرفرات ماين كرافت",
            "services.mc.desc": "Paper أو Fabric أو Forge أو Vanilla بنقرة واحدة. حزم المودات تُثبَّت مباشرة من اللوحة — بلا بحث يدوي عن ملفات الجار.",
            "services.mc.f1": "مدير إضافات ومودات مدمج",
            "services.mc.f2": "نسخ احتياطي للعالم كل 24 ساعة، محفوظ أسبوعًا",
            "services.mc.f3": "انتقل مجانًا — ننقل ملف العالم لك",
            "services.mc.btn": "أسعار ماين كرافت ←",

            "pricing.tag": "الأسعار",
            "pricing.title": "أسعار ثابتة، <span class=\"gradient-text\">بلا ألاعيب</span>",
            "pricing.subtitle": "جميع الأسعار لكل 30 يومًا. الرصيد يتجدد كل دورة. ترقية أو تخفيض من اللوحة — يسري فورًا.",
            "pricing.tab1": "بوتات ديسكورد",
            "pricing.tab2": "سيرفرات ماين كرافت",
            "pricing.per30": "/ 30 يوم",
            "pricing.mostPopular": "الأكثر طلبًا",
            "pricing.select": "اطلب عبر ديسكورد",
            "pricing.k.ram": "الذاكرة",
            "pricing.k.storage": "التخزين",
            "pricing.k.cpu": "المعالج",
            "pricing.k.db": "قواعد البيانات",
            "pricing.k.backups": "النسخ الاحتياطية",
            "pricing.k.credits": "الرصيد",
            "pricing.note": "تحتاج شيئًا أكبر؟ <a href=\"" + DISCORD_URL + "\" target=\"_blank\" rel=\"noopener\">راسلنا</a> — للسيرفرات والشبكات الكبيرة نجهّز عُقدًا مخصصة.",

            "pricing.bot1.name": "بوت · 512MB",
            "pricing.bot1.desc": "بوت واحد أو مشروع تجريبي",
            "pricing.bot1.f1": "512MB RAM",
            "pricing.bot1.f2": "1GB NVMe",
            "pricing.bot1.f3": "50%",
            "pricing.bot1.f4": "0",
            "pricing.bot1.f5": "0",
            "pricing.bot1.credits": "20 Million Credits",
            "pricing.bot2.name": "بوت · 1GB",
            "pricing.bot2.desc": "للبوت الذي ينمو فعلًا",
            "pricing.bot2.f1": "1GB RAM",
            "pricing.bot2.f2": "1GB NVMe",
            "pricing.bot2.f3": "100%",
            "pricing.bot2.f4": "1",
            "pricing.bot2.f5": "1",
            "pricing.bot2.credits": "40 Million Credits",
            "pricing.bot3.name": "بوت · 2GB",
            "pricing.bot3.desc": "الخيار الذي يستقر عليه معظم الناس",
            "pricing.bot3.f1": "2GB RAM",
            "pricing.bot3.f2": "3GB NVMe",
            "pricing.bot3.f3": "100%",
            "pricing.bot3.f4": "2",
            "pricing.bot3.f5": "2",
            "pricing.bot3.credits": "55 Million Credits",
            "pricing.bot4.name": "بوت · 3GB",
            "pricing.bot4.desc": "بوتات الموسيقى والأحمال الثقيلة",
            "pricing.bot4.f1": "3GB RAM",
            "pricing.bot4.f2": "4GB NVMe",
            "pricing.bot4.f3": "150%",
            "pricing.bot4.f4": "3",
            "pricing.bot4.f5": "3",
            "pricing.bot4.credits": "70 Million Credits",
            "pricing.bot5.name": "بوت · 4GB",
            "pricing.bot5.desc": "بوتات كبيرة، أو عدة بوتات معًا",
            "pricing.bot5.f1": "4GB RAM",
            "pricing.bot5.f2": "5GB NVMe",
            "pricing.bot5.f3": "150%",
            "pricing.bot5.f4": "4",
            "pricing.bot5.f5": "4",
            "pricing.bot5.credits": "85 Million Credits",

            "pricing.mc1.name": "ماين كرافت · 2GB",
            "pricing.mc1.desc": "أنت وأصدقاؤك، نحو 8 لاعبين",
            "pricing.mc1.f1": "2GB RAM",
            "pricing.mc1.f2": "5GB NVMe",
            "pricing.mc1.f3": "150%",
            "pricing.mc1.f4": "0",
            "pricing.mc1.f5": "0",
            "pricing.mc2.name": "ماين كرافت · 3GB",
            "pricing.mc2.desc": "سيرفر مجتمع حقيقي، نحو 20 لاعبًا",
            "pricing.mc2.f1": "3GB RAM",
            "pricing.mc2.f2": "7GB NVMe",
            "pricing.mc2.f3": "200%",
            "pricing.mc2.f4": "1",
            "pricing.mc2.f5": "1",
            "pricing.mc3.name": "ماين كرافت · 5GB",
            "pricing.mc3.desc": "حزم مودات وشبكات كبيرة",
            "pricing.mc3.f1": "5GB RAM",
            "pricing.mc3.f2": "12GB NVMe",
            "pricing.mc3.f3": "250%",
            "pricing.mc3.f4": "2",
            "pricing.mc3.f5": "2",

            "features.tag": "تحت الغطاء",
            "features.title": "الأشياء المملة، <span class=\"gradient-text\">مظبوطة</span>",
            "features.subtitle": "لا شيء فاخر للنظر إليه — فقط الأجزاء التي تُبقي سيرفرك يعمل في الثالثة فجرًا.",
            "features.c1.title": "عُقد AMD Epyc",
            "features.c1.desc": "أنوية معالج مخصصة، وليست شرائح مشتركة من VPS رخيص. أداء تشعر به فعلًا.",
            "features.c2.title": "تخزين NVMe",
            "features.c2.desc": "كل خطة على NVMe. تحميل العوالم وتشغيل البوت دون انتظار.",
            "features.c3.title": "تشغيل خلال 60 ثانية",
            "features.c3.desc": "اطلب، اضغط نشر، وانتهى الأمر. سيرفرك يعمل قبل أن تُنهي قهوتك.",
            "features.c4.title": "نسخ احتياطية كل ساعة",
            "features.c4.desc": "نلتقط لقطة من بياناتك كل ساعة. ضغطة واحدة تعيدك إلى أي نقطة في اليوم.",
            "features.c5.title": "حماية DDoS",
            "features.c5.desc": "تصفية دائمة على كل سيرفر. الهجمات لا تُسقطك، بل تزيد سطور ملف السجل فقط.",
            "features.c6.title": "دعم حقيقي",
            "features.c6.desc": "إنسان يقرأ رسالتك. متوسط أول رد أقل من 30 دقيقة، ولا نغلق التذاكر بمؤقت.",

            "locations.tag": "المواقع",
            "locations.title": "مركزنا في <span class=\"gradient-text\">ألمانيا</span>",
            "locations.subtitle": "جميع السيرفرات مستضافة في عقدتنا بفرانكفورت، ألمانيا — وسط أوروبا، حماية DDoS، وسعة 40 جيجابت. موقع واحد دون أي تنازلات.",
            "locations.featured": "جميع الباقات مستضافة هنا",
            "locations.l1.name": "فرانكفورت، ألمانيا",
            "locations.l1.desc": "موقعنا الأساسي الوحيد. أقل زمن استجابة عبر أوروبا واتصال ممتاز حول العالم.",

            "team.tag": "الفريق",
            "team.title": "الفريق الذي <span class=\"gradient-text\">يديرها</span>",
            "team.subtitle": "تعرف على الفريق اللي ورا سبارك — كلهم موجودون في ديسكوردنا.",
            "team.loading": "جاري تحميل الفريق…",

            "contact.tag": "تواصل معنا",
            "contact.title": "تحدث مع <span class=\"gradient-text\">طاقمنا</span>",
            "contact.tagline": "لا نستخدم خطوط الهاتف أو نماذج تواصل. كل شيء يمر عبر ديسكوردنا — هنا الإجابات والناس.",
            "contact.discord.title": "سيرفر ديسكورد",
            "contact.discord.desc": "المبيعات والدعم والفواتير وتحديثات الحالة — كلها في مكان واحد. تعال سلّم.",
            "contact.discord.link": "انضم إلى ديسكورد ←",

            "social.tagline": "سيرفر واحد يحكمهم جميعًا. <span class=\"gradient-text\">بلا تذاكر.</span>",

            "footer.desc": "استضافة بوتات ديسكورد وماين كرافت على عُقد AMD Epyc مع تخزين NVMe. لوحة Pterodactyl، دعم حقيقي، وأسعار ثابتة.",
            "footer.quick": "روابط سريعة",
            "footer.resources": "الموارد",
            "footer.support": "الدعم",
            "footer.status": "صفحة الحالة",
            "footer.docs": "التوثيق",
            "footer.serverStatus": "حالة السيرفر",
            "footer.tos": "شروط الخدمة",
            "footer.join.title": "انضم إلى ديسكورد",
            "footer.join.desc": "تحديثات الحالة، ميزات جديدة، هدايا، وأناس حقيقيون. هذا مكاننا.",
            "footer.join.btn": "انضم إلى ديسكورد",
            "footer.rights": "جميع الحقوق محفوظة.",
            "footer.legal1": "سياسة الخصوصية",
            "footer.legal2": "شروط الخدمة",
            "footer.legal3": "سياسة الاسترداد"
        }
    };

    const langToggle = document.getElementById("lang-toggle");
    const langMenu = document.getElementById("lang-menu");
    const langOptions = langMenu.querySelectorAll(".lang-option");
    const langFlag = document.getElementById("lang-flag");
    const langLabel = document.getElementById("lang-label");
    const htmlEl = document.documentElement;

    const LANG_FLAGS = {
        en: { src: "assets/united.png", label: "English" },
        ar: { src: "assets/saudi.png", label: "العربية" }
    };

    function closeLangMenu() {
        langMenu.classList.remove("open");
        langToggle.classList.remove("open");
        langToggle.setAttribute("aria-expanded", "false");
    }

    function getStoredLang() {
        try {
            const saved = localStorage.getItem("spark-lang");
            return saved === "ar" ? "ar" : "en";
        } catch (e) {
            return "en";
        }
    }

    function storeLang(lang) {
        try {
            localStorage.setItem("spark-lang", lang);
        } catch (e) {
            /* storage unavailable — non-fatal */
        }
    }

    function applyLanguage(lang) {
        const dict = translations[lang] || translations.en;

        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            const key = el.dataset.i18n;
            if (dict[key]) el.textContent = dict[key];
        });

        document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
            const key = el.dataset.i18nHtml;
            if (dict[key]) el.innerHTML = dict[key];
        });

        const info = LANG_FLAGS[lang] || LANG_FLAGS.en;
        langFlag.src = info.src;
        langFlag.alt = info.label;
        langLabel.textContent = info.label;
        langOptions.forEach(function (opt) {
            opt.classList.toggle("active", opt.dataset.lang === lang);
        });

        htmlEl.lang = lang;
        htmlEl.dir = lang === "ar" ? "rtl" : "ltr";
        storeLang(lang);

        document.dispatchEvent(new CustomEvent("spark:lang"));
    }

    langToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        const open = langMenu.classList.toggle("open");
        langToggle.classList.toggle("open", open);
        langToggle.setAttribute("aria-expanded", String(open));
    });

    langOptions.forEach(function (opt) {
        opt.addEventListener("click", function (e) {
            e.stopPropagation();
            applyLanguage(opt.dataset.lang);
            closeLangMenu();
        });
    });

    document.addEventListener("click", function () {
        closeLangMenu();
    });

    applyLanguage(getStoredLang());

    /* ---------- Scroll reveal animations ---------- */
    const revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        revealEls.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
            el.classList.add("visible");
        });
    }

    /* ---------- Active nav link highlighting ---------- */
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        navLinks.forEach(function (link) {
                            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
                        });
                    }
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );
        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    /* ---------- Footer year ---------- */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
