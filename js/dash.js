/* ==========================================================================
   Spark Services — Admin Area (Pterodactyl Application API + Wings daemon)
   Runs entirely on the admin (ptla_) Application API key — no Client API key
   needed. The Wings daemon bridge gives real status, power, files, console &
   live usage; the Application API gives startup, network, databases, subusers
   (read-only) and settings. Only backups & schedules are panel-DB-only.
   ========================================================================== */
(function () {
    "use strict";

    /* ======================================================================
       I18N
       ====================================================================== */
    var T = {
        en: {
            "dash.back": "Back to site",
            "dash.servers.tag": "Your Servers",
            "dash.servers.title": "Pick a <span class=\"gradient-text\">server</span>",
            "dash.refresh": "Refresh",
            "dash.servers.empty": "No servers found.",
            "dash.backList": "All servers",
            "dash.tab.console": "Console",
            "dash.tab.files": "Files",
            "dash.tab.databases": "Databases",
            "dash.tab.backups": "Backups",
            "dash.tab.schedules": "Schedules",
            "dash.tab.network": "Network",
            "dash.tab.users": "Subusers",
            "dash.tab.startup": "Startup",
            "dash.tab.settings": "Settings",
            "dash.power.start": "Start",
            "dash.power.restart": "Restart",
            "dash.power.stop": "Stop",
            "dash.power.kill": "Kill",
            "dash.suspend": "Suspend",
            "dash.unsuspend": "Unsuspend",
            "dash.info.status": "Status",
            "dash.info.node": "Node",
            "dash.info.egg": "Egg",
            "dash.info.nest": "Nest",
            "dash.info.owner": "Owner",
            "dash.info.memory": "Memory",
            "dash.info.swap": "Swap",
            "dash.info.disk": "Disk",
            "dash.info.cpu": "CPU",
            "dash.info.io": "I/O",
            "dash.info.threads": "Threads",
            "dash.client.missing": "Client API not configured on the server. Add PTERO_CLIENT_KEY in server.js to enable power, console, files, backups, schedules & live status.",
            "dash.client.required": "This tab is stored in the panel's own client database, which an admin key cannot read. Only a Client API key (ptlc_) can unlock backups & schedules.",
            "dash.files.uploadKey": "Upload needs the Client API key.",
            "dash.console.placeholder": "Type a command…",
            "dash.console.send": "Send",
            "dash.console.clear": "Clear",
            "dash.console.connecting": "Connecting to console…",
            "dash.console.wsFail": "Live console unavailable — sending commands only.",
            "dash.console.sent": "Command sent",
            "dash.console.reconnected": "Reconnected",
            "dash.console.offline": "Server is not running — start it to accept commands.",
            "dash.files.newFile": "New file",
            "dash.files.newFolder": "New folder",
            "dash.files.upload": "Upload",
            "dash.files.uploading": "Uploading…",
            "dash.files.uploaded": "Uploaded",
            "dash.files.uploadFail": "Upload failed",
            "dash.files.downloadFail": "Download failed",
            "dash.files.edit": "Edit",
            "dash.files.rename": "Rename",
            "dash.files.copy": "Copy",
            "dash.files.chmod": "Permissions",
            "dash.files.compress": "Compress",
            "dash.files.decompress": "Extract",
            "dash.files.delete": "Delete",
            "dash.files.download": "Download",
            "dash.files.empty": "This folder is empty.",
            "dash.files.name": "Name",
            "dash.files.size": "Size",
            "dash.files.modified": "Modified",
            "dash.files.newFileTitle": "New file",
            "dash.files.newFolderTitle": "New folder",
            "dash.files.fileName": "File name",
            "dash.files.folderName": "Folder name",
            "dash.files.renameTitle": "Rename",
            "dash.files.copyTitle": "Copy",
            "dash.files.copyText": "Copy this file to:",
            "dash.files.chmodTitle": "Change permissions",
            "dash.files.chmodText": "Mode (e.g. 755):",
            "dash.files.deleteTitle": "Delete?",
            "dash.files.deleteText": "Delete this item? This cannot be undone.",
            "dash.files.created": "Created",
            "dash.files.renamed": "Renamed",
            "dash.files.copied": "Copied",
            "dash.files.chmodded": "Permissions updated",
            "dash.files.compressed": "Compressed",
            "dash.files.decompressed": "Extracted",
            "dash.files.deleted": "Deleted",
            "dash.files.editTitle": "Edit file",
            "dash.files.saved": "File saved",
            "dash.files.save": "Save",
            "dash.databases.title": "Databases",
            "dash.databases.new": "New database",
            "dash.databases.createTitle": "Create database",
            "dash.databases.name": "Database name",
            "dash.databases.host": "Database host ID",
            "dash.databases.remote": "Remote connections (%)",
            "dash.databases.created": "Database created",
            "dash.databases.rotated": "Password reset",
            "dash.databases.rotating": "Reset password",
            "dash.databases.deleteTitle": "Delete database?",
            "dash.databases.deleteText": "This will permanently delete the database",
            "dash.databases.none": "No databases",
            "dash.backups.title": "Backups",
            "dash.backups.new": "New backup",
            "dash.backups.createTitle": "New backup",
            "dash.backups.name": "Backup name (optional)",
            "dash.backups.ignored": "Ignored files (comma separated, optional)",
            "dash.backups.created": "Backup started",
            "dash.backups.downloadFail": "Download failed",
            "dash.backups.restoreTitle": "Restore backup?",
            "dash.backups.restoreText": "This will overwrite the server files from this backup.",
            "dash.backups.restore": "Restore",
            "dash.backups.restoreStarted": "Restore started",
            "dash.backups.lock": "Lock",
            "dash.backups.unlock": "Unlock",
            "dash.backups.locked": "Locked",
            "dash.backups.unlocked": "Unlocked",
            "dash.backups.deleteTitle": "Delete backup?",
            "dash.backups.deleteText": "This will permanently delete the backup",
            "dash.backups.none": "No backups",
            "dash.backups.failed": "failed",
            "dash.schedules.title": "Schedules",
            "dash.schedules.new": "New schedule",
            "dash.schedules.createTitle": "New schedule",
            "dash.schedules.name": "Schedule name",
            "dash.schedules.cron": "Cron expression",
            "dash.schedules.minute": "Minute",
            "dash.schedules.hour": "Hour",
            "dash.schedules.dayMonth": "Day of month",
            "dash.schedules.month": "Month",
            "dash.schedules.dayWeek": "Day of week",
            "dash.schedules.onlineOnly": "Only when online",
            "dash.schedules.created": "Schedule created",
            "dash.schedules.run": "Run now",
            "dash.schedules.pause": "Pause",
            "dash.schedules.resume": "Resume",
            "dash.schedules.ran": "Schedule triggered",
            "dash.schedules.toggled": "Schedule updated",
            "dash.schedules.addTask": "Add task",
            "dash.schedules.taskTitle": "Add task",
            "dash.schedules.taskAction": "Action",
            "dash.schedules.taskPayload": "Payload (optional)",
            "dash.schedules.taskOffset": "Time offset (s)",
            "dash.schedules.taskAdded": "Task added",
            "dash.schedules.deleteTitle": "Delete schedule?",
            "dash.schedules.deleteText": "This will permanently delete the schedule and its tasks.",
            "dash.schedules.none": "No schedules",
            "dash.schedules.actions": "No tasks",
            "dash.network.title": "Network",
            "dash.network.assign": "Assign allocation",
            "dash.network.assigned": "Allocation assigned",
            "dash.network.primary": "Set primary",
            "dash.network.primarySet": "Primary set",
            "dash.network.notes": "Notes",
            "dash.network.notesSaved": "Notes saved",
            "dash.network.deleteTitle": "Delete allocation?",
            "dash.network.deleteText": "This will remove the allocation from the server.",
            "dash.network.none": "No allocations",
            "dash.network.removed": "Allocation removed",
            "dash.users.title": "Subusers",
            "dash.users.new": "New subuser",
            "dash.users.createTitle": "New subuser",
            "dash.users.email": "Email address",
            "dash.users.permissions": "Permissions",
            "dash.users.selectAll": "Select all",
            "dash.users.created": "Subuser created",
            "dash.users.deleteTitle": "Remove subuser?",
            "dash.users.deleteText": "This will revoke access for",
            "dash.users.none": "No subusers",
            "dash.users.readonly": "Subusers are read-only with an admin key — create or remove them from the panel.",
            "dash.startup.title": "Startup",
            "dash.startup.none": "No startup variables",
            "dash.startup.saved": "Startup saved",
            "dash.startup.auto": "auto",
            "dash.startup.command": "Startup command",
            "dash.startup.image": "Docker image",
            "dash.startup.saveAll": "Save changes",
            "dash.startup.skip": "Skip install script",
            "dash.startup.skipDesc": "Do not re-run the egg's install script on the next start (advanced).",
            "dash.settings.title": "Settings",
            "dash.settings.rename": "Rename server",
            "dash.settings.newname": "New server name",
            "dash.settings.save": "Save",
            "dash.settings.danger": "Danger zone",
            "dash.settings.reinstallDesc": "Reinstall this server from its egg. All files are wiped.",
            "dash.settings.reinstall": "Reinstall server",
            "dash.settings.reinstallConfirm": "Reinstall this server? All files will be destroyed and re-created from the egg.",
            "dash.settings.renamed": "Server renamed",
            "dash.settings.reinstalling": "Reinstall started",
            "dash.suspendConfirm": "Suspend this server? It will be locked until unsuspended.",
            "dash.unsuspendConfirm": "Unsuspend this server?",
            "dash.suspended": "Server suspended",
            "dash.unsuspended": "Server unsuspended",
            "dash.modal.cancel": "Cancel",
            "dash.modal.confirm": "Confirm",
            "dash.modal.delete": "Delete",
            "dash.modal.create": "Create",
            "dash.modal.save": "Save",
            "dash.modal.copy": "Copy",
            "dash.status.unknown": "—",
            "dash.status.offline": "offline",
            "dash.status.online": "online",
            "dash.status.starting": "starting",
            "dash.status.stopping": "stopping",
            "dash.status.error": "error",
            "dash.status.suspended": "suspended",
            "dash.status.installing": "installing",
            "dash.err.generic": "Something went wrong",
            "dash.err.load": "Could not load servers — check the panel and API key in server.js.",
            "dash.err.title": "Can't reach the dashboard server",
            "dash.err.fileHint": "This page was opened directly from disk. The API proxy only runs inside the Node server, so open the page through it instead:",
            "dash.err.fileHint2": "Then open this address in your browser:",
            "dash.err.retry": "Retry",
            "dash.err.serverUp": "The server is running. Here is the real response from the panel:",
            "dash.err.diag": "The panel responded:",
            "dash.err.checkKey": "If it says 401/403 the API key in server.js is wrong or lacks permission. If it says 404 the panel URL is wrong.",
            "dash.err.serverDown": "The dashboard server isn't reachable. Start it from the project folder:",
            "dash.loading": "Loading…",
            "dash.size.bytes": "B",
            "dash.size.kb": "KB",
            "dash.size.mb": "MB",
            "dash.size.gb": "GB"
        },
        ar: {
            "dash.back": "العودة للموقع",
            "dash.servers.tag": "سيرفراتك",
            "dash.servers.title": "اختر <span class=\"gradient-text\">سيرفرًا</span>",
            "dash.refresh": "تحديث",
            "dash.servers.empty": "لا توجد سيرفرات.",
            "dash.backList": "كل السيرفرات",
            "dash.tab.console": "الكونسول",
            "dash.tab.files": "الملفات",
            "dash.tab.databases": "قواعد البيانات",
            "dash.tab.backups": "النسخ الاحتياطي",
            "dash.tab.schedules": "الجدولة",
            "dash.tab.network": "الشبكة",
            "dash.tab.users": "المستخدمون الفرعيون",
            "dash.tab.startup": "الإقلاع",
            "dash.tab.settings": "الإعدادات",
            "dash.power.start": "تشغيل",
            "dash.power.restart": "إعادة تشغيل",
            "dash.power.stop": "إيقاف",
            "dash.power.kill": "قتل",
            "dash.suspend": "تعليق",
            "dash.unsuspend": "إلغاء التعليق",
            "dash.info.status": "الحالة",
            "dash.info.node": "العقدة",
            "dash.info.egg": "Egg",
            "dash.info.nest": "Nest",
            "dash.info.owner": "المالك",
            "dash.info.memory": "الذاكرة",
            "dash.info.swap": "Swap",
            "dash.info.disk": "التخزين",
            "dash.info.cpu": "المعالج",
            "dash.info.io": "الإدخال/الإخراج",
            "dash.info.threads": "الخيوط",
            "dash.client.missing": "مفتاح Client API غير مضبوط على الخادم. أضف PTERO_CLIENT_KEY في server.js لتفعيل التشغيل والكونسول والملفات والنسخ الاحتياطي والجدولة والحالة المباشرة.",
            "dash.client.required": "تُخزَّن هذه التبويبات في قاعدة بيانات اللوحة الخاصة بالعميل، ولا يمكن لمفتاح الأدمن قراءتها. مفتاح Client API (ptlc_) وحده يفتح النسخ الاحتياطي والجدولة.",
            "dash.files.uploadKey": "الرفع يتطلب مفتاح Client API.",
            "dash.console.placeholder": "اكتب أمرًا…",
            "dash.console.send": "إرسال",
            "dash.console.clear": "مسح",
            "dash.console.connecting": "جارٍ الاتصال بالكونسول…",
            "dash.console.wsFail": "الكونسول المباشر غير متاح — سيتم إرسال الأوامر فقط.",
            "dash.console.sent": "تم إرسال الأمر",
            "dash.console.reconnected": "تمت إعادة الاتصال",
            "dash.console.offline": "السيرفر غير قيد التشغيل — شغّله لاستقبال الأوامر.",
            "dash.files.newFile": "ملف جديد",
            "dash.files.newFolder": "مجلد جديد",
            "dash.files.upload": "رفع",
            "dash.files.uploading": "جارٍ الرفع…",
            "dash.files.uploaded": "تم الرفع",
            "dash.files.uploadFail": "فشل الرفع",
            "dash.files.downloadFail": "فشل التنزيل",
            "dash.files.edit": "تعديل",
            "dash.files.rename": "إعادة تسمية",
            "dash.files.copy": "نسخ",
            "dash.files.chmod": "الصلاحيات",
            "dash.files.compress": "ضغط",
            "dash.files.decompress": "فك الضغط",
            "dash.files.delete": "حذف",
            "dash.files.download": "تنزيل",
            "dash.files.empty": "هذا المجلد فارغ.",
            "dash.files.name": "الاسم",
            "dash.files.size": "الحجم",
            "dash.files.modified": "آخر تعديل",
            "dash.files.newFileTitle": "ملف جديد",
            "dash.files.newFolderTitle": "مجلد جديد",
            "dash.files.fileName": "اسم الملف",
            "dash.files.folderName": "اسم المجلد",
            "dash.files.renameTitle": "إعادة تسمية",
            "dash.files.copyTitle": "نسخ",
            "dash.files.copyText": "انسخ هذا الملف إلى:",
            "dash.files.chmodTitle": "تغيير الصلاحيات",
            "dash.files.chmodText": "الوضع (مثال 755):",
            "dash.files.deleteTitle": "حذف؟",
            "dash.files.deleteText": "حذف هذا العنصر؟ لا يمكن التراجع.",
            "dash.files.created": "تم الإنشاء",
            "dash.files.renamed": "تمت إعادة التسمية",
            "dash.files.copied": "تم النسخ",
            "dash.files.chmodded": "تم تحديث الصلاحيات",
            "dash.files.compressed": "تم الضغط",
            "dash.files.decompressed": "تم فك الضغط",
            "dash.files.deleted": "تم الحذف",
            "dash.files.editTitle": "تعديل الملف",
            "dash.files.saved": "تم حفظ الملف",
            "dash.files.save": "حفظ",
            "dash.databases.title": "قواعد البيانات",
            "dash.databases.new": "قاعدة بيانات جديدة",
            "dash.databases.createTitle": "إنشاء قاعدة بيانات",
            "dash.databases.name": "اسم قاعدة البيانات",
            "dash.databases.host": "معرّف مضيف قاعدة البيانات",
            "dash.databases.remote": "الاتصالات عن بُعد (%)",
            "dash.databases.created": "تم إنشاء قاعدة البيانات",
            "dash.databases.rotated": "تمت إعادة تعيين كلمة المرور",
            "dash.databases.rotating": "إعادة تعيين كلمة المرور",
            "dash.databases.deleteTitle": "حذف قاعدة البيانات؟",
            "dash.databases.deleteText": "سيتم حذف قاعدة البيانات نهائيًا",
            "dash.databases.none": "لا توجد قواعد بيانات",
            "dash.backups.title": "النسخ الاحتياطي",
            "dash.backups.new": "نسخة جديدة",
            "dash.backups.createTitle": "نسخة احتياطية جديدة",
            "dash.backups.name": "اسم النسخة (اختياري)",
            "dash.backups.ignored": "الملفات المتجاهلة (مفصولة بفواصل، اختياري)",
            "dash.backups.created": "بدأت النسخة الاحتياطية",
            "dash.backups.downloadFail": "فشل التنزيل",
            "dash.backups.restoreTitle": "استعادة النسخة؟",
            "dash.backups.restoreText": "سيتم استبدال ملفات السيرفر من هذه النسخة.",
            "dash.backups.restore": "استعادة",
            "dash.backups.restoreStarted": "بدأت الاستعادة",
            "dash.backups.lock": "قفل",
            "dash.backups.unlock": "فتح",
            "dash.backups.locked": "تم القفل",
            "dash.backups.unlocked": "تم الفتح",
            "dash.backups.deleteTitle": "حذف النسخة؟",
            "dash.backups.deleteText": "سيتم حذف النسخة الاحتياطية نهائيًا",
            "dash.backups.none": "لا توجد نسخ",
            "dash.backups.failed": "فشلت",
            "dash.schedules.title": "الجدولة",
            "dash.schedules.new": "جدول جديد",
            "dash.schedules.createTitle": "جدول جديد",
            "dash.schedules.name": "اسم الجدول",
            "dash.schedules.cron": "تعبير Cron",
            "dash.schedules.minute": "الدقيقة",
            "dash.schedules.hour": "الساعة",
            "dash.schedules.dayMonth": "يوم الشهر",
            "dash.schedules.month": "الشهر",
            "dash.schedules.dayWeek": "يوم الأسبوع",
            "dash.schedules.onlineOnly": "فقط عند الاتصال",
            "dash.schedules.created": "تم إنشاء الجدول",
            "dash.schedules.run": "تشغيل الآن",
            "dash.schedules.pause": "إيقاف مؤقت",
            "dash.schedules.resume": "استئناف",
            "dash.schedules.ran": "تم تشغيل الجدول",
            "dash.schedules.toggled": "تم تحديث الجدول",
            "dash.schedules.addTask": "إضافة مهمة",
            "dash.schedules.taskTitle": "إضافة مهمة",
            "dash.schedules.taskAction": "الإجراء",
            "dash.schedules.taskPayload": "الحمولة (اختياري)",
            "dash.schedules.taskOffset": "الإزاحة الزمنية (ث)",
            "dash.schedules.taskAdded": "تمت إضافة المهمة",
            "dash.schedules.deleteTitle": "حذف الجدول؟",
            "dash.schedules.deleteText": "سيتم حذف الجدول ومهامه نهائيًا.",
            "dash.schedules.none": "لا توجد جداول",
            "dash.schedules.actions": "لا توجد مهام",
            "dash.network.title": "الشبكة",
            "dash.network.assign": "تخصيص عنوان",
            "dash.network.assigned": "تم تخصيص العنوان",
            "dash.network.primary": "تعيين أساسي",
            "dash.network.primarySet": "تم تعيين الأساسي",
            "dash.network.notes": "ملاحظات",
            "dash.network.notesSaved": "تم حفظ الملاحظات",
            "dash.network.deleteTitle": "حذف العنوان؟",
            "dash.network.deleteText": "سيتم إزالة العنوان من السيرفر.",
            "dash.network.none": "لا توجد عناوين",
            "dash.network.removed": "تمت إزالة العنوان",
            "dash.users.title": "المستخدمون الفرعيون",
            "dash.users.new": "مستخدم فرعي جديد",
            "dash.users.createTitle": "مستخدم فرعي جديد",
            "dash.users.email": "البريد الإلكتروني",
            "dash.users.permissions": "الصلاحيات",
            "dash.users.selectAll": "تحديد الكل",
            "dash.users.created": "تم إنشاء المستخدم الفرعي",
            "dash.users.deleteTitle": "إزالة المستخدم الفرعي؟",
            "dash.users.deleteText": "سيتم إلغاء الوصول لـ",
            "dash.users.none": "لا يوجد مستخدمون فرعيون",
            "dash.users.readonly": "المستخدمون الفرعيون للقراءة فقط بمفتاح الأدمن — أنشئهم أو أزلهم من اللوحة.",
            "dash.startup.title": "الإقلاع",
            "dash.startup.none": "لا توجد متغيرات إقلاع",
            "dash.startup.saved": "تم حفظ الإقلاع",
            "dash.startup.auto": "تلقائي",
            "dash.startup.command": "أمر الإقلاع",
            "dash.startup.image": "صورة Docker",
            "dash.startup.saveAll": "حفظ التغييرات",
            "dash.startup.skip": "تخطي سكربت التثبيت",
            "dash.startup.skipDesc": "لا تعِد تشغيل سكربت تثبيت الـ egg عند الإقلاع التالي (متقدم).",
            "dash.settings.title": "الإعدادات",
            "dash.settings.rename": "إعادة تسمية السيرفر",
            "dash.settings.newname": "اسم السيرفر الجديد",
            "dash.settings.save": "حفظ",
            "dash.settings.danger": "منطقة الخطر",
            "dash.settings.reinstallDesc": "إعادة تثبيت السيرفر من egg. سيتم مسح جميع الملفات.",
            "dash.settings.reinstall": "إعادة تثبيت السيرفر",
            "dash.settings.reinstallConfirm": "إعادة تثبيت هذا السيرفر؟ سيتم تدمير جميع الملفات وإعادة إنشائها من egg.",
            "dash.settings.renamed": "تمت إعادة تسمية السيرفر",
            "dash.settings.reinstalling": "بدأت إعادة التثبيت",
            "dash.suspendConfirm": "تعليق هذا السيرفر؟ سيتم قفله حتى إلغاء التعليق.",
            "dash.unsuspendConfirm": "إلغاء تعليق هذا السيرفر؟",
            "dash.suspended": "تم تعليق السيرفر",
            "dash.unsuspended": "تم إلغاء تعليق السيرفر",
            "dash.modal.cancel": "إلغاء",
            "dash.modal.confirm": "تأكيد",
            "dash.modal.delete": "حذف",
            "dash.modal.create": "إنشاء",
            "dash.modal.save": "حفظ",
            "dash.modal.copy": "نسخ",
            "dash.status.unknown": "—",
            "dash.status.offline": "غير متصل",
            "dash.status.online": "متصل",
            "dash.status.starting": "جارٍ التشغيل",
            "dash.status.stopping": "جارٍ الإيقاف",
            "dash.status.error": "خطأ",
            "dash.status.suspended": "موقوف",
            "dash.status.installing": "جارٍ التثبيت",
            "dash.err.generic": "حدث خطأ ما",
            "dash.err.load": "تعذر تحميل السيرفرات — تحقق من اللوحة والمفتاح في server.js.",
            "dash.err.title": "تعذر الوصول إلى خادم لوحة التحكم",
            "dash.err.fileHint": "تم فتح هذه الصفحة مباشرة من القرص. يعمل بروكسي API فقط داخل خادم Node، لذا افتح الصفحة من خلاله بدلاً من ذلك:",
            "dash.err.fileHint2": "ثم افتح هذا العنوان في المتصفح:",
            "dash.err.retry": "إعادة المحاولة",
            "dash.err.serverUp": "الخادم يعمل. هذا هو الرد الفعلي من اللوحة:",
            "dash.err.diag": "استجابت اللوحة:",
            "dash.err.checkKey": "إذا ظهر 401/403 فمفتاح API في server.js خاطئ أو لا يملك صلاحية. وإذا ظهر 404 فعنوان اللوحة خاطئ.",
            "dash.err.serverDown": "خادم لوحة التحكم غير متاح. ابدأ تشغيله من مجلد المشروع:",
            "dash.loading": "جارٍ التحميل…",
            "dash.size.bytes": "ب",
            "dash.size.kb": "ك.ب",
            "dash.size.mb": "م.ب",
            "dash.size.gb": "ج.ب"
        }
    };

    function currentLang() {
        return document.documentElement.lang === "ar" ? "ar" : "en";
    }
    function t(key) {
        var dict = T[currentLang()] || T.en;
        return dict[key] != null ? dict[key] : key;
    }
    function statusText(status) {
        var mapped = { "installing": "installing", "suspended": "suspended", "running": "online", "offline": "offline", "starting": "starting", "stopping": "stopping" };
        var key = "dash.status." + (mapped[status] || status || "unknown");
        var val = T[currentLang()] ? T[currentLang()][key] : null;
        return val != null ? val : (status || "—");
    }

    /* ======================================================================
       Helpers
       ====================================================================== */
    var $ = function (id) { return document.getElementById(id); };

    function esc(s) {
        var d = document.createElement("div");
        d.textContent = s == null ? "" : String(s);
        return d.innerHTML;
    }

    function formatBytes(bytes) {
        if (bytes == null || isNaN(bytes)) return "—";
        if (bytes < 1024) return Math.round(bytes) + " " + t("dash.size.bytes");
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " " + t("dash.size.kb");
        if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + " " + t("dash.size.mb");
        return (bytes / 1024 / 1024 / 1024).toFixed(2) + " " + t("dash.size.gb");
    }

    function formatDate(d) {
        if (!d) return "—";
        var dt = new Date(d);
        if (isNaN(dt.getTime())) return "—";
        var pad = function (n) { return (n < 10 ? "0" : "") + n; };
        return pad(dt.getDate()) + "/" + pad(dt.getMonth() + 1) + "/" + dt.getFullYear() + " " + pad(dt.getHours()) + ":" + pad(dt.getMinutes());
    }

    /* ======================================================================
       State + API
       ====================================================================== */
    var state = {
        servers: [],
        server: null,
        currentTab: "console",
        fileDir: "/",
        ws: null,
        wsAlive: false,
        clientReady: false,
        wingsReady: false
    };

    var API_BASE = "";
    if (window.location.protocol === "file:") {
        API_BASE = "http://localhost:3000";
    }

    // The Client API key lives in server.js (PTERO_CLIENT_KEY); the server uses
    // it automatically. Here we only learn whether it is configured (from the
    // /api/health probe) so the UI can enable/disable client-only features.
    function clientReady() {
        return !!state.clientReady;
    }

    function checkClientReady() {
        return fetch(API_BASE + "/api/health", { headers: { "Accept": "application/json" } })
            .then(function (r) { return r.json(); })
            .then(function (h) { state.clientReady = !!(h && h.pteroClientKeySet); })
            .catch(function () { state.clientReady = false; });
    }

    // Admin path: even without a Client API key, the server can reach each node's
    // Wings daemon (using the node config from the Application API key) for REAL
    // power state + power control. wingsReady turns on once that works.
    function controlsAvailable() {
        return clientReady() || state.wingsReady;
    }

    function fetchWingsStatuses() {
        return fetch(API_BASE + "/api/wings/status", { headers: { "Accept": "application/json" } })
            .then(function (r) { return r.json(); })
            .then(function (d) {
                if (!d || d.error) { state.wingsReady = false; return null; }
                // Only consider the daemon bridge usable if at least one server
                // actually answered with a real state (not all errors).
                var map = d.servers || {};
                var keys = Object.keys(map);
                var anyOk = keys.some(function (k) { return map[k] && map[k].state != null; });
                state.wingsReady = anyOk;
                return map;
            })
            .catch(function () { state.wingsReady = false; return null; });
    }

    /* Admin path: generic Wings (daemon) proxy call for the currently open
       server (files, logs, commands...). Requires no Client API key. */
    function wingsUuid() {
        var a = state.server && state.server.attributes;
        return a ? a.uuid : null;
    }

    function wingsApi(path, opts) {
        opts = opts || {};
        var headers = { "Accept": "application/json" };
        var init = { method: opts.method || "GET", headers: headers };
        if (opts.body !== undefined) { headers["Content-Type"] = "application/json"; init.body = JSON.stringify(opts.body); }
        if (opts.rawBody !== undefined) { headers["Content-Type"] = "text/plain"; init.body = opts.rawBody; }
        var uuid = wingsUuid();
        if (!uuid) return Promise.reject(new Error("server uuid missing"));
        return fetch(API_BASE + "/api/wings/servers/" + uuid + "/" + path, init).then(function (res) {
            return res.text().then(function (txt) {
                var data = null;
                try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
                if (!res.ok) {
                    var e0 = data && data.errors && data.errors[0];
                    var msg = (data && data.error) || (e0 && (e0.detail || e0.code)) || "";
                    if (!msg && typeof data === "string") {
                        // Wings sometimes replies with plain "error code: 502"
                        // instead of JSON — turn it into something readable.
                        msg = /error code: \d+/i.test(data)
                            ? "The daemon rejected the request (" + res.status + ") — is the server running?"
                            : data.slice(0, 140);
                    }
                    throw new Error(msg || ("HTTP " + res.status));
                }
                return data;
            });
        });
    }

    // Tabs the admin (application) key cannot serve - they live in the
    // panel's client API. Marked with a lock + friendly message when no key.
    var KEY_TABS = ["backups", "schedules"];
    function markKeyTabs() {
        var on = !clientReady();
        document.querySelectorAll(".dash-tab").forEach(function (b) {
            if (KEY_TABS.indexOf(b.dataset.tab) < 0) return;
            var lock = b.querySelector(".tab-lock");
            if (on && !lock) b.insertAdjacentHTML("beforeend", ' <span class="tab-lock">🔒</span>');
            else if (!on && lock) lock.remove();
            var pane = document.getElementById("tab-" + b.dataset.tab);
            if (pane) pane.classList.toggle("tab-locked", on);
        });
    }

    function needsKeyTab(listId) {
        $(listId).innerHTML = '<div class="dash-empty needs-key">🔒 ' + esc(t("dash.client.required")) + "</div>";
    }

    function request(path, opts, client) {
        opts = opts || {};
        var headers = { "Accept": "application/vnd.pterodactyl.v1+json" };
        // the key is attached server-side (PTERO_CLIENT_KEY for /api/ptero-client/*)
        var init = { method: opts.method || "GET", headers: headers };
        if (opts.body !== undefined) {
            headers["Content-Type"] = "application/json";
            init.body = JSON.stringify(opts.body);
        }
        if (opts.rawBody !== undefined) {
            headers["Content-Type"] = "text/plain";
            init.body = opts.rawBody;
        }
        return fetch(API_BASE + (client ? "/api/ptero-client/" : "/api/ptero/") + path, init).then(function (res) {
            return res.text().then(function (txt) {
                var data = null;
                try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
                if (!res.ok) {
                    var msg = data && data.errors && data.errors[0]
                        ? (data.errors[0].detail || data.errors[0].code || "API error")
                        : (data && data.error) || t("dash.err.generic");
                    throw new Error(msg);
                }
                return data;
            });
        });
    }

    function api(path, options) { return request(path, options, false); }
    function apiClient(path, options) { return request(path, options, true); }

    /* ======================================================================
       Views
       ====================================================================== */
    function showView(name) {
        ["servers", "server"].forEach(function (v) {
            $("view-" + v).classList.toggle("hidden", v !== name);
        });
    }

    function requireClient() {
        if (clientReady()) return true;
        toast(t("dash.client.missing"), "info");
        return false;
    }

    /* ======================================================================
       Server list (Application API)
       ====================================================================== */
    function loadServers() {
        $("servers-grid").innerHTML = '<p class="dash-empty">' + esc(t("dash.loading")) + "</p>";
        $("servers-empty").classList.add("hidden");
        // Re-probe health each load so a newly-added PTERO_CLIENT_KEY in
        // server.js is picked up by Refresh / Retry without a page reload.
        checkClientReady().then(function () {
            return api("servers?per_page=100");
        }).then(function (data) {
            state.servers = (data && data.data) || [];
            markKeyTabs();
            // Subusers can only be listed (read-only) with an admin key.
            var newUserBtn = document.getElementById("btn-newuser");
            if (newUserBtn) newUserBtn.style.display = clientReady() ? "" : "none";
            renderServers();
            showView("servers");
            refreshAllStatuses(); // client API when key set, else Wings daemon
        }).catch(function (err) {
            renderLoadError(err);
        });
    }

    function renderServers() {
        var grid = $("servers-grid");
        grid.innerHTML = "";
        if (!state.servers.length) {
            $("servers-empty").classList.remove("hidden");
            return;
        }
        state.servers.forEach(function (srv) {
            var a = srv.attributes || {};
            var limits = a.limits || {};
            var mem = limits.memory || 0;
            var suspended = !!a.suspended;
            var card = document.createElement("div");
            card.className = "server-card";
            card.innerHTML =
                '<div class="server-card-top">' +
                    '<span class="server-card-name" title="' + esc(a.name) + '">' + esc(a.name) + "</span>" +
                    (suspended ? statusPill("suspended") : statusPill(a.status)) +
                "</div>" +
                '<div class="server-card-limits">' +
                    '<span class="limit-chip">' + esc(a.identifier || "?") + "</span>" +
                    '<span class="limit-chip">RAM ' + formatBytes((mem || 0) * 1024 * 1024) + "</span>" +
                    '<span class="limit-chip">CPU ' + (limits.cpu || 0) + "%</span>" +
                    (limits.disk ? '<span class="limit-chip">' + formatBytes(limits.disk * 1024 * 1024) + "</span>" : "") +
                "</div>" +
                '<div class="server-card-usage">' +
                    '<div class="card-stat"><span class="card-stat-label">' + esc(t("dash.info.cpu")) + '</span><div class="mini-bar"><div class="mini-bar-fill" data-fill="cpu"></div></div><span class="card-stat-value mono" data-val="cpu">—</span></div>' +
                    '<div class="card-stat"><span class="card-stat-label">' + esc(t("dash.info.memory")) + '</span><div class="mini-bar"><div class="mini-bar-fill" data-fill="ram"></div></div><span class="card-stat-value mono" data-val="ram">—</span></div>' +
                    '<div class="card-stat"><span class="card-stat-label">' + esc(t("dash.info.disk")) + '</span><div class="mini-bar"><div class="mini-bar-fill" data-fill="disk"></div></div><span class="card-stat-value mono" data-val="disk">—</span></div>' +
                "</div>";
            card.setAttribute("data-identifier", a.identifier || "");
            card.addEventListener("click", function () { openServer(srv); });
            grid.appendChild(card);
        });
    }

    /* Live status: for each server, ask the Client API for current_state (when a
       client key exists) or the Wings daemon directly (admin path, no key). */
    function refreshAllStatuses() {
        if (!state.servers.length) return;
        if (clientReady()) {
            state.servers.forEach(function (srv) {
                var a = srv.attributes || {};
                apiClient("servers/" + a.identifier + "/resources").then(function (data) {
                    var attrs = data && data.attributes;
                    if (!attrs) return;
                    a.current_state = attrs.current_state;
                    a.resources = attrs.resources || {};
                    var card = document.querySelector('.server-card[data-identifier="' + a.identifier + '"]');
                    if (!card) return;
                    var pill = card.querySelector(".status-pill");
                    if (!pill) return;
                    var suspended = !!a.suspended;
                    var st = suspended ? "suspended" : (attrs.current_state === "running" ? "online" : attrs.current_state || "unknown");
                    pill.className = "status-pill status-" + st;
                    pill.textContent = statusText(st);
                    applyCardUsage(card, a, attrs.resources || {});
                }).catch(function () { /* keep previous */ });
            });
            return;
        }
        // Admin path: real power state straight from the Wings daemon.
        fetchWingsStatuses().then(function (map) {
            if (!map) return;
            state.servers.forEach(function (srv) {
                var a = srv.attributes || {};
                var info = map[a.identifier];
                if (!info || info.error) return;
                a.current_state = info.state;
                var pill = document.querySelector('.server-card[data-identifier="' + a.identifier + '"] .status-pill');
                if (!pill) return;
                var st = a.suspended ? "suspended" : (info.state === "running" ? "online" : (info.state || "offline"));
                pill.className = "status-pill status-" + st;
                pill.textContent = statusText(st);
                if (info.resources) {
                    var card = document.querySelector('.server-card[data-identifier="' + a.identifier + '"]');
                    applyCardUsage(card, a, info.resources);
                }
            });
        });
    }

    function statusPill(status) {
        var mapped = { "installing": "installing", "running": "online" };
        var cls = "status-" + (mapped[status] || status || "unknown");
        return '<span class="status-pill ' + cls + '">' + esc(statusText(status)) + "</span>";
    }

    /* Live usage computation shared by cards and the detail stat-row. res follows
       the client-API resources shape (memory_bytes, cpu_absolute, disk_bytes,
       memory_limit, disk_limit). Limits Wings doesn't report fall back to the
       application-API limits (memory/disk in MB). */
    function usageSets(res, limits) {
        limits = limits || {};
        var memLimit = (res.memory_limit || 0) || (limits.memory || 0) * 1024 * 1024;
        var diskLimit = (res.disk_limit || 0) || (limits.disk || 0) * 1024 * 1024;
        var cpuPct = res.cpu_absolute == null ? null : Math.max(0, Math.min(100, res.cpu_absolute));
        return [
            { k: "cpu", pct: cpuPct, txt: cpuPct == null ? "—" : Math.round(cpuPct) + "%" },
            { k: "ram", pct: memLimit > 0 ? (res.memory_bytes / memLimit) * 100 : null,
              txt: memLimit > 0 ? formatBytes(res.memory_bytes) + " / " + formatBytes(memLimit) : "—" },
            { k: "disk", pct: diskLimit > 0 ? (res.disk_bytes / diskLimit) * 100 : null,
              txt: diskLimit > 0 ? formatBytes(res.disk_bytes) + " / " + formatBytes(diskLimit) : "—" }
        ];
    }

    /* Live usage bars on a server card (wings or client path). */
    function applyCardUsage(card, a, res) {
        if (!card || !res) return;
        usageSets(res, a.limits).forEach(function (s) {
            var f = card.querySelector('[data-fill="' + s.k + '"]');
            var v = card.querySelector('[data-val="' + s.k + '"]');
            if (f) {
                var p = s.pct == null ? 0 : Math.max(0, Math.min(100, s.pct));
                f.style.width = p + "%";
                f.classList.toggle("high", p > 80);
            }
            if (v) v.textContent = s.txt;
        });
    }

    /* Live usage bars in the server detail stat-row (#stat-cpu/ram/disk). */
    function applyStatRow(res, limits) {
        usageSets(res, limits).forEach(function (s) {
            setStat("stat-" + s.k, "stat-" + s.k + "-v", s.pct, s.txt);
        });
    }

    $("btn-refresh-servers").addEventListener("click", loadServers);

    /* ======================================================================
       Connection diagnostics
       ====================================================================== */
    function renderLoadError(err) {
        var grid = $("servers-grid");
        var lines = ["<strong>" + esc(t("dash.err.title")) + "</strong>"];
        lines.push('<p class="err-line">' + esc(err.message || t("dash.err.generic")) + "</p>");

        fetch(API_BASE + "/api/health", { headers: { "Accept": "application/json" } })
            .then(function (r) {
                if (!r.ok) throw new Error("health-http-" + r.status);
                return r.json();
            })
            .then(function (h) {
                if (!h || !h.ok) throw new Error("health-fail");
                lines.push('<p class="err-hint">' + esc(t("dash.err.serverUp")) + "</p>");
                return fetch(API_BASE + "/api/ptero/diag", { headers: { "Accept": "application/vnd.pterodactyl.v1+json" } })
                    .then(function (r) { return r.json().then(function (b) { return { status: r.status, data: b }; }); });
            })
            .then(function (diag) {
                lines.push('<p class="err-hint">' + esc(t("dash.err.diag")) + "</p>");
                var d = (diag && diag.data) || {};
                var diagMsg = d.detail || d.body || d.error || "";
                lines.push('<code class="err-cmd">HTTP ' + esc(diag && diag.status ? diag.status : "?") + " — " + esc(snippet(diagMsg, 300)) + "</code>");
                lines.push('<p class="err-hint">' + esc(t("dash.err.checkKey")) + "</p>");
            })
            .catch(function () {
                if (window.location.protocol === "file:") {
                    lines.push('<p class="err-hint">' + esc(t("dash.err.fileHint")) + "</p>");
                    lines.push('<code class="err-cmd">node server.js</code>');
                    lines.push('<p class="err-hint">' + esc(t("dash.err.fileHint2")) + "</p>");
                    lines.push('<code class="err-cmd">http://localhost:3000/dash.html</code>');
                } else {
                    lines.push('<p class="err-hint">' + esc(t("dash.err.serverDown")) + "</p>");
                    lines.push('<code class="err-cmd">node server.js</code>');
                }
            })
            .then(function () {
                lines.push('<button class="btn btn-outline btn-sm err-retry" id="err-retry">' + esc(t("dash.err.retry")) + "</button>");
                grid.innerHTML = '<div class="dash-empty err-box">' + lines.join("") + "</div>";
                var retry = document.getElementById("err-retry");
                if (retry) retry.addEventListener("click", loadServers);
            });
    }

    function snippet(str, max) {
        if (str == null) return "";
        str = String(str).replace(/\s+/g, " ").trim();
        return str.length > max ? str.slice(0, max) + "…" : str;
    }

    /* ======================================================================
       Server detail
       ====================================================================== */
    function clientId() {
        var a = state.server && state.server.attributes;
        return a ? (a.identifier || a.id) : null;
    }

    function openServer(srv) {
        state.server = srv;
        var a = srv.attributes || {};
        // reset stat bars so a previous server's values never linger
        ["cpu", "ram", "disk"].forEach(function (k) {
            var v = $("stat-" + k + "-v");
            var b = $("stat-" + k);
            if (v) v.textContent = "—";
            if (b) b.style.width = "0%";
        });
        $("server-name").textContent = a.name || "Server";
        $("server-meta").innerHTML =
            statusPill(a.status) +
            '<span>' + esc(a.identifier || "") + "</span>" +
            '<span>#' + esc(a.id != null ? a.id : "") + "</span>";
        $("btn-suspend-label").textContent = t(a.suspended ? "dash.unsuspend" : "dash.suspend");
        $("power-actions").classList.toggle("locked", !controlsAvailable());
        switchTab("console"); // also (re)starts the console websocket when a client key is present
        showView("server");
        state.fileDir = "/";
        if (clientReady()) {
            refreshResources();
            loadActiveTab();
        } else {
            loadDatabases();
            loadActiveTab();
            refreshServerStatus(); // wings fallback: real status + unlock power
        }
    }

    /* Live resources (Client API /resources) -> stat bars + status */
    function refreshResources() {
        if (!clientReady() || !state.server) return;
        var id = clientId();
        if (!id) return;
        apiClient("servers/" + id + "/resources").then(function (data) {
            var attrs = data && data.attributes;
            if (!attrs) return;
            var res = attrs.resources || {};
            if (state.server && state.server.attributes) {
                state.server.attributes.current_state = attrs.current_state;
                state.server.attributes.resources = res;
            }
            applyStatRow(res, (state.server.attributes && state.server.attributes.limits) || {});
            // live status pill in the server header
            var pill = $("server-meta").querySelector(".status-pill");
            if (pill) {
                var st = (state.server && state.server.attributes && state.server.attributes.suspended)
                    ? "suspended"
                    : (attrs.current_state === "running" ? "online" : attrs.current_state || "unknown");
                pill.className = "status-pill status-" + st;
                pill.textContent = statusText(st);
            }
        }).catch(function () { /* ignore */ });
    }

    function setStat(barId, valId, pct, label) {
        var bar = $(barId);
        var val = $(valId);
        var p = pct == null ? 0 : Math.max(0, Math.min(100, pct));
        bar.style.width = p + "%";
        bar.classList.toggle("high", p > 80);
        val.textContent = label;
    }

    function refreshServerStatus() {
        if (!state.server) return;
        var a = state.server.attributes || {};
        $("server-name").textContent = a.name || "Server";
        $("btn-suspend-label").textContent = t(a.suspended ? "dash.unsuspend" : "dash.suspend");
        $("power-actions").classList.toggle("locked", !controlsAvailable());
        if (clientReady()) return;
        // Admin path: pull the real state from Wings and show it in the header pill.
        fetchWingsStatuses().then(function (map) {
            if (!map || !state.server) return;
            var info = map[state.server.attributes.identifier];
            if (!info || info.error) return;
            var pill = $("server-meta").querySelector(".status-pill");
            if (pill) {
                var st = a.suspended ? "suspended" : (info.state === "running" ? "online" : (info.state || "offline"));
                pill.className = "status-pill status-" + st;
                pill.textContent = statusText(st);
            }
            $("power-actions").classList.toggle("locked", !controlsAvailable());
            // Live resource bars: Wings utilization -> same shape as /resources
            if (info.resources) {
                applyStatRow(info.resources, (state.server.attributes && state.server.attributes.limits) || {});
            }
        });
    }

    $("btn-back").addEventListener("click", function () {
        state.server = null;
        if (state.ws) { try { state.ws.close(); } catch (e) { } state.ws = null; }
        if (wingsConsoleTimer) { clearInterval(wingsConsoleTimer); wingsConsoleTimer = null; }
        showView("servers");
        refreshAllStatuses();
    });

    /* ---------- Tabs ---------- */
    $("dash-tabs").addEventListener("click", function (e) {
        var tab = e.target.closest(".dash-tab");
        if (tab) switchTab(tab.dataset.tab);
    });

    function switchTab(name) {
        state.currentTab = name;
        document.querySelectorAll(".dash-tab").forEach(function (b) {
            var on = b.dataset.tab === name;
            b.classList.toggle("active", on);
            b.setAttribute("aria-selected", on ? "true" : "false");
        });
        document.querySelectorAll(".tab-pane").forEach(function (p) {
            p.classList.toggle("active", p.id === "tab-" + name);
        });
        if (name !== "console" && state.ws) { try { state.ws.close(); } catch (e) { } state.ws = null; }
        if (name !== "console" && wingsConsoleTimer) { clearInterval(wingsConsoleTimer); wingsConsoleTimer = null; }
        if (name === "console") {
            if (clientReady()) connectConsole();
            else startWingsConsole();
        }
        loadActiveTab();
    }

    function loadActiveTab() {
        switch (state.currentTab) {
            case "files": loadFiles(); break;
            case "databases": loadDatabases(); break;
            case "backups": loadBackups(); break;
            case "schedules": loadSchedules(); break;
            case "network": loadAllocations(); break;
            case "users": loadUsers(); break;
            case "startup": loadStartup(); break;
            case "console": break;
        }
    }

    /* ======================================================================
       Power (Client API)
       ====================================================================== */
    $("power-actions").addEventListener("click", function (e) {
        var btn = e.target.closest("[data-power]");
        if (!btn) return;
        if (btn.id === "btn-suspend" || btn.id === "btn-reinstall") return; // handled elsewhere
        var signal = btn.dataset.power;
        var a = state.server && state.server.attributes;
        if (clientReady()) {
            apiClient("servers/" + clientId() + "/power", { method: "POST", body: { signal: signal } })
                .then(function () {
                    toast(signal.toUpperCase(), "success");
                    setTimeout(refreshResources, 1500);
                })
                .catch(function (err) { toast(err.message, "error"); });
        } else if (state.wingsReady && a && a.uuid && a.node != null) {
            // Admin path: talk to the Wings daemon directly (no client key).
            fetch(API_BASE + "/api/wings/power", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ uuid: a.uuid, node: a.node, action: signal })
            }).then(function (r) { return r.json(); }).then(function (d) {
                if (d && d.error) throw new Error(d.error);
                toast(signal.toUpperCase(), "success");
                setTimeout(function () { refreshServerStatus(); refreshAllStatuses(); }, 1500);
            }).catch(function (err) { toast(err.message, "error"); });
        } else {
            toast(t("dash.client.missing"), "info");
        }
    });

    /* ======================================================================
       Console (WebSocket via Client API)
       ====================================================================== */
    function connectConsole() {
        var shell = $("console-shell");
        var out = $("console-output");
        if (!state.server || !clientReady()) return;
        if (state.ws && state.wsAlive) return;
        if (state.ws) { try { state.ws.close(); } catch (e) { } state.ws = null; }
        appendConsole("> " + t("dash.console.connecting"));

        apiClient("servers/" + clientId() + "/websocket").then(function (data) {
            var wd = data && data.data; // websocket endpoint returns {data:{token,socket}}
            if (!wd || !wd.socket || !wd.token) {
                appendConsole("> " + t("dash.console.wsFail"));
                return;
            }
            var ws;
            try { ws = new WebSocket(wd.socket); } catch (e) {
                appendConsole("> " + t("dash.console.wsFail"));
                return;
            }
            state.ws = ws;
            ws.onopen = function () {
                ws.send(JSON.stringify({ event: "auth", args: [wd.token] }));
                state.wsAlive = true;
            };
            ws.onmessage = function (ev) {
                var msg;
                try { msg = JSON.parse(ev.data); } catch (e) { return; }
                if (msg.event === "console output") {
                    (msg.args || []).forEach(function (line) { appendConsole(line); });
                } else if (msg.event === "status") {
                    state.wsAlive = true;
                } else if (msg.event === "token expiring") {
                    // silently re-auth on next message by reconnecting after short delay
                    setTimeout(function () { if (state.ws === ws) { try { ws.close(); } catch (e) { } } }, 500);
                }
            };
            ws.onerror = function () {
                appendConsole("> " + t("dash.console.wsFail"));
            };
            ws.onclose = function () {
                state.wsAlive = false;
                if (state.currentTab === "console" && state.server && clientReady()) {
                    setTimeout(connectConsole, 4000);
                }
            };
            shell.classList.add("live");
        }).catch(function () {
            appendConsole("> " + t("dash.console.wsFail"));
        });
    }

    var wingsConsoleTimer = null;
    /* Admin console: the daemon has no live websocket for us (its JWT is minted
       by the panel), but it exposes recent logs + a command endpoint, so poll
       every 3s for a live-ish console. */
    function startWingsConsole() {
        if (!state.server || clientReady()) return;
        var out = $("console-output");
        out.innerHTML = "";
        var prev = [];
        var failed = 0;
        var poll = function () {
            wingsApi("logs?size=100").then(function (data) {
                failed = 0;
                var lines = (data && data.data) || [];
                if (prev.length && lines.length) {
                    // The daemon only returns the last 100 lines, so track by
                    // content: find where the new batch overlaps what we showed.
                    var idx = -1;
                    for (var i = 0; i < prev.length; i++) {
                        if (prev[i] === lines[0]) { idx = i; break; }
                    }
                    if (idx >= 0) {
                        for (var j = prev.length - idx; j < lines.length; j++) appendConsole(lines[j]);
                    } else {
                        // log rolled past the window: redraw the tail
                        out.innerHTML = "";
                        lines.forEach(function (l) { appendConsole(l); });
                    }
                } else {
                    lines.forEach(function (l) { appendConsole(l); });
                }
                prev = lines;
            }).catch(function () {
                failed++;
                if (failed === 1) appendConsole("> " + t("dash.console.wsFail"));
            });
        };
        poll();
        if (wingsConsoleTimer) clearInterval(wingsConsoleTimer);
        wingsConsoleTimer = setInterval(poll, 3000);
    }

    // Strip ANSI escape sequences (colors, cursor moves) Wings keeps in logs
    // so the console shows clean text instead of raw \u001b codes.
    function stripAnsi(s) {
        return String(s == null ? "" : s)
            .replace(/\u001b\[[0-9;?]*[a-zA-Z]/g, "")
            .replace(/\u001b\][^\u0007]*\u0007/g, "")
            .replace(/\u001b[>=]/g, "")
            .replace(/\r/g, "");
    }

    function appendConsole(line) {
        var out = $("console-output");
        var p = document.createElement("div");
        p.className = "console-line";
        p.textContent = stripAnsi(line);
        out.appendChild(p);
        while (out.children.length > 800) out.removeChild(out.firstChild);
        out.scrollTop = out.scrollHeight;
    }

    function sendConsoleCommand(cmd) {
        if (!cmd) return;
        appendConsole("$ " + cmd);
        if (clientReady()) {
            apiClient("servers/" + clientId() + "/command", { method: "POST", body: { command: cmd } })
                .then(function () { /* ok */ })
                .catch(function (err) { appendConsole("> " + err.message); });
            return;
        }
        // Admin path: a stopped server can't accept commands - warn first.
        var a = state.server && state.server.attributes;
        var st = a && a.current_state;
        if (st && st !== "running" && st !== "online" && st !== "starting") {
            appendConsole("> " + t("dash.console.offline"));
            return;
        }
        wingsApi("commands", { method: "POST", body: { commands: [cmd] } })
            .then(function () { /* ok */ })
            .catch(function (err) { appendConsole("> " + err.message); });
    }

    $("btn-console-send").addEventListener("click", function () {
        var input = $("console-input");
        sendConsoleCommand(input.value);
        input.value = "";
    });
    $("console-input").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            sendConsoleCommand(this.value);
            this.value = "";
        }
    });
    $("btn-console-clear").addEventListener("click", function () {
        $("console-output").innerHTML = "";
    });

    /* ======================================================================
       Files (Client API)
       ====================================================================== */
    function currentPath() { return state.fileDir || "/"; }

    function joinPath(dir, name) {
        if (!dir || dir === "/") return "/" + name;
        return dir.replace(/\/+$/, "") + "/" + name;
    }

    function loadFiles() {
        var list = $("file-list");
        list.innerHTML = '<p class="dash-empty" style="padding:24px 0;">' + esc(t("dash.loading")) + "</p>";
        renderBreadcrumbs();
        var fetchItems = clientReady()
            ? apiClient("servers/" + clientId() + "/files/list?directory=" + encodeURIComponent(currentPath()))
            : wingsApi("files/list-directory?directory=" + encodeURIComponent(currentPath()));
        fetchItems.then(function (data) {
            // client API wraps in {data:[{attributes}]}; the daemon returns a plain array
            var raw = Array.isArray(data) ? data : ((data && data.data) || []);
            var items = raw.map(function (it) {
                var a = (it && it.attributes) || it || {};
                return { attributes: { name: a.name, is_file: a.is_file != null ? a.is_file : !a.is_dir, size: a.size, modified_at: a.modified_at } };
            });
            list.innerHTML = "";
            if (!items.length) { list.innerHTML = '<p class="dash-empty">' + esc(t("dash.files.empty")) + "</p>"; return; }
            items.forEach(function (it) {
                var a = it.attributes || {};
                var isDir = !a.is_file;
                var card = document.createElement("div");
                card.className = "file-row";
                card.innerHTML =
                    '<button class="file-name ' + (isDir ? "dir" : "") + '">' +
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;flex:none;">' +
                            (isDir
                                ? '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>'
                                : '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>') +
                        "</svg>" +
                        '<span>' + esc(a.name) + "</span>" +
                    "</button>" +
                    '<span class="file-size mono">' + (isDir ? "—" : formatBytes(a.size)) + "</span>" +
                    '<span class="file-date mono">' + formatDate(a.modified_at) + "</span>" +
                    '<div class="list-card-actions">' + buildFileActions(a, isDir) + "</div>";
                if (isDir) {
                    card.querySelector(".file-name").addEventListener("click", function () {
                        state.fileDir = joinPath(currentPath(), a.name);
                        loadFiles();
                    });
                } else {
                    card.querySelector(".file-name").addEventListener("click", function () { editFile(a.name); });
                }
                bindFileActions(card, a, isDir);
                list.appendChild(card);
            });
        }).catch(function (err) { list.innerHTML = '<p class="dash-empty">' + esc(err.message) + "</p>"; });
    }

    function buildFileActions(a, isDir) {
        var acts = "";
        if (!isDir) {
            acts += '<button class="btn btn-ghost btn-sm file-act" data-act="download" title="' + esc(t("dash.files.download")) + '">' + iconDownload() + "</button>";
            acts += '<button class="btn btn-ghost btn-sm file-act" data-act="edit" title="' + esc(t("dash.files.edit")) + '">' + iconEdit() + "</button>";
        }
        acts += '<button class="btn btn-ghost btn-sm file-act" data-act="rename" title="' + esc(t("dash.files.rename")) + '">' + iconRename() + "</button>";
        acts += '<button class="btn btn-ghost btn-sm file-act" data-act="copy" title="' + esc(t("dash.files.copy")) + '">' + iconCopy() + "</button>";
        if (!isDir) acts += '<button class="btn btn-ghost btn-sm file-act" data-act="chmod" title="' + esc(t("dash.files.chmod")) + '">' + iconChmod() + "</button>";
        if (isDir || /\.(zip|tar|gz|tgz|tar\.gz)$/i.test(a.name || "")) {
            acts += '<button class="btn btn-ghost btn-sm file-act" data-act="compress" title="' + esc(t("dash.files.compress")) + '">' + iconCompress() + "</button>";
        }
        if (!isDir && /\.(zip|tar|gz|tgz|tar\.gz)$/i.test(a.name || "")) {
            acts += '<button class="btn btn-ghost btn-sm file-act" data-act="decompress" title="' + esc(t("dash.files.decompress")) + '">' + iconExtract() + "</button>";
        }
        acts += '<button class="btn btn-outline btn-sm file-act danger-act" data-act="delete" title="' + esc(t("dash.files.delete")) + '">' + iconTrash() + "</button>";
        return acts;
    }

    function bindFileActions(card, a, isDir) {
        card.querySelectorAll(".file-act").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                var act = btn.dataset.act;
                var path = joinPath(currentPath(), a.name);
                if (act === "download") downloadFile(a.name);
                else if (act === "edit") editFile(a.name);
                else if (act === "rename") renameFile(a.name, isDir);
                else if (act === "copy") copyFile(a.name);
                else if (act === "chmod") chmodFile(a.name);
                else if (act === "compress") compressFile(a.name, isDir);
                else if (act === "decompress") decompressFile(a.name);
                else if (act === "delete") deleteFile(path, a.name, isDir);
            });
        });
    }

    function renderBreadcrumbs() {
        var crumbs = $("file-crumbs");
        var parts = currentPath().split("/").filter(Boolean);
        var html = '<button class="crumb" data-crumb="">/</button>';
        var acc = "";
        parts.forEach(function (p) {
            acc += "/" + p;
            html += '<button class="crumb" data-crumb="' + esc(acc) + '">' + esc(p) + "</button>";
        });
        crumbs.innerHTML = html;
        crumbs.querySelectorAll(".crumb").forEach(function (c) {
            c.addEventListener("click", function () {
                state.fileDir = c.dataset.crumb || "/";
                loadFiles();
            });
        });
    }

    $("btn-refresh-files").addEventListener("click", loadFiles);

    function downloadFile(name) {
        var path = joinPath(currentPath(), name);
        if (clientReady()) {
            apiClient("servers/" + clientId() + "/files/download?file=" + encodeURIComponent(path))
                .then(function (data) {
                    var url = data && data.attributes && data.attributes.url;
                    if (url) window.open(url, "_blank");
                    else toast(t("dash.files.downloadFail"), "error");
                })
                .catch(function (err) { toast(err.message, "error"); });
            return;
        }
        // Admin path: the daemon streams the file itself (?download=1).
        window.open(API_BASE + "/api/wings/servers/" + wingsUuid() + "/files/contents?file=" + encodeURIComponent(path) + "&download=1", "_blank");
    }

    function editFile(name) {
        var path = joinPath(currentPath(), name);
        var load = clientReady()
            ? apiClient("servers/" + clientId() + "/files/contents?file=" + encodeURIComponent(path))
            : wingsApi("files/contents?file=" + encodeURIComponent(path));
        load.then(function (content) {
            openModal({
                title: t("dash.files.editTitle") + " — " + name,
                size: "lg",
                body:
                    '<textarea class="dash-input file-editor" id="edit-content" spellcheck="false"></textarea>' +
                    '<div class="editor-bar">' +
                        '<span class="mono editor-path">' + esc(path) + "</span>" +
                        '<span class="mono" id="edit-pos">Ln 1, Col 1</span>' +
                    "</div>",
                confirmLabel: t("dash.files.save"),
                onConfirm: function () {
                    var val = $("edit-content").value;
                    var save = clientReady()
                        ? request("servers/" + clientId() + "/files/write?file=" + encodeURIComponent(path), { method: "POST", rawBody: val }, true)
                        : wingsApi("files/write?file=" + encodeURIComponent(path), { method: "POST", rawBody: val });
                    return save.then(function () { toast(t("dash.files.saved"), "success"); });
                }
            });
            var ta = $("edit-content");
            ta.value = content == null ? "" : String(content);
            var updatePos = function () {
                var pos = $("edit-pos");
                if (!pos) return;
                var upto = ta.value.slice(0, ta.selectionStart);
                var line = (upto.match(/\n/g) || []).length + 1;
                var col = upto.length - (upto.lastIndexOf("\n") + 1) + 1;
                pos.textContent = "Ln " + line + ", Col " + col;
            };
            // Tab inserts spaces; Ctrl/Cmd+S saves without leaving the editor.
            ta.addEventListener("keydown", function (e) {
                if (e.key === "Tab") {
                    e.preventDefault();
                    var s = ta.selectionStart, en = ta.selectionEnd;
                    ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(en);
                    ta.selectionStart = ta.selectionEnd = s + 4;
                    updatePos();
                } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                    e.preventDefault();
                    var cf = $("modal-confirm");
                    if (cf) cf.click();
                }
            });
            ta.addEventListener("input", updatePos);
            ta.addEventListener("click", updatePos);
            ta.addEventListener("keyup", updatePos);
            updatePos();
            ta.focus();
        }).catch(function (err) { toast(err.message, "error"); });
    }

    $("btn-newfile").addEventListener("click", function () {
        openModal({
            title: t("dash.files.newFileTitle"),
            body: '<label class="dash-label">' + t("dash.files.fileName") + '</label><input class="dash-input" id="modal-value">',
            confirmLabel: t("dash.modal.create"),
            onConfirm: function () {
                var name = $("modal-value").value.trim();
                if (!name) return;
                var create = clientReady()
                    ? request("servers/" + clientId() + "/files/write?file=" + encodeURIComponent(joinPath(currentPath(), name)), { method: "POST", rawBody: "" }, true)
                    : wingsApi("files/write?file=" + encodeURIComponent(joinPath(currentPath(), name)), { method: "POST", rawBody: "" });
                return create.then(function () { toast(t("dash.files.created"), "success"); loadFiles(); });
            }
        });
    });

    $("btn-newfolder").addEventListener("click", function () {
        openModal({
            title: t("dash.files.newFolderTitle"),
            body: '<label class="dash-label">' + t("dash.files.folderName") + '</label><input class="dash-input" id="modal-value">',
            confirmLabel: t("dash.modal.create"),
            onConfirm: function () {
                var name = $("modal-value").value.trim();
                if (!name) return;
                var create = clientReady()
                    ? apiClient("servers/" + clientId() + "/files/create-folder", { method: "POST", body: { root: currentPath(), name: name } })
                    : wingsApi("files/create-directory", { method: "POST", body: { name: name, path: currentPath() } });
                return create.then(function () { toast(t("dash.files.created"), "success"); loadFiles(); });
            }
        });
    });

    function renameFile(name, isDir) {
        var path = joinPath(currentPath(), name);
        openModal({
            title: t("dash.files.renameTitle"),
            body: '<label class="dash-label">' + t("dash.files.fileName") + '</label><input class="dash-input" id="modal-value" value="' + esc(name) + '">',
            confirmLabel: t("dash.modal.save"),
            onConfirm: function () {
                var to = $("modal-value").value.trim();
                if (!to || to === name) return;
                var call = clientReady()
                    ? apiClient("servers/" + clientId() + "/files/rename", { method: "PUT", body: { root: currentPath(), files: [{ from: name, to: to }] } })
                    : wingsApi("files/rename", { method: "PUT", body: { root: currentPath(), files: [{ from: name, to: to }] } });
                return call.then(function () { toast(t("dash.files.renamed"), "success"); loadFiles(); });
            }
        });
    }

    function copyFile(name) {
        // copy takes a single {location} and creates "<name> copy.ext" (same on the daemon)
        var call = clientReady()
            ? apiClient("servers/" + clientId() + "/files/copy", { method: "POST", body: { location: joinPath(currentPath(), name) } })
            : wingsApi("files/copy", { method: "POST", body: { location: joinPath(currentPath(), name) } });
        call.then(function () { toast(t("dash.files.copied"), "success"); loadFiles(); })
            .catch(function (err) { toast(err.message, "error"); });
    }

    function chmodFile(name) {
        openModal({
            title: t("dash.files.chmodTitle"),
            text: t("dash.files.chmodText"),
            body: '<input class="dash-input" id="modal-value" value="755">',
            confirmLabel: t("dash.modal.save"),
            onConfirm: function () {
                var mode = $("modal-value").value.trim();
                if (!/^[0-7]{3,4}$/.test(mode)) return;
                var call = clientReady()
                    ? apiClient("servers/" + clientId() + "/files/chmod", { method: "POST", body: { root: currentPath(), files: [{ file: name, mode: mode }] } })
                    : wingsApi("files/chmod", { method: "POST", body: { root: currentPath(), files: [{ file: name, mode: mode }] } });
                return call.then(function () { toast(t("dash.files.chmodded"), "success"); });
            }
        });
    }

    function compressFile(name, isDir) {
        var call = clientReady()
            ? apiClient("servers/" + clientId() + "/files/compress", { method: "POST", body: { root: currentPath(), files: [name] } })
            : wingsApi("files/compress", { method: "POST", body: { root: currentPath(), files: [name] } });
        call.then(function () {
            toast(t("dash.files.compressed"), "success");
            loadFiles();
        }).catch(function (err) { toast(err.message, "error"); });
    }

    function decompressFile(name) {
        var call = clientReady()
            ? apiClient("servers/" + clientId() + "/files/decompress", { method: "POST", body: { root: currentPath(), file: name } })
            : wingsApi("files/decompress", { method: "POST", body: { root: currentPath(), file: name } });
        call.then(function () {
            toast(t("dash.files.decompressed"), "success");
            loadFiles();
        }).catch(function (err) { toast(err.message, "error"); });
    }

    function deleteFile(path, name, isDir) {
        openModal({
            title: t("dash.files.deleteTitle"),
            text: t("dash.files.deleteText"),
            danger: true,
            confirmLabel: t("dash.modal.delete"),
            onConfirm: function () {
                var call = clientReady()
                    ? apiClient("servers/" + clientId() + "/files/delete", { method: "POST", body: { root: currentPath(), files: [name] } })
                    : wingsApi("files/delete", { method: "POST", body: { root: currentPath(), files: [name] } });
                return call.then(function () { toast(t("dash.files.deleted"), "success"); loadFiles(); });
            }
        });
    }

    /* ---------- file upload (signed URL passthrough) ---------- */
    function uploadFiles(fileList) {
        var files = Array.prototype.slice.call(fileList || []);
        if (!files.length) return;
        var file = files.shift();
        toast(t("dash.files.uploading") + " — " + file.name, "info");
        var done = function () {
            if (files.length) { uploadFiles(files); return; }
            toast(t("dash.files.uploaded"), "success");
            loadFiles();
        };
        if (!clientReady()) {
            // Admin path: stream the raw file through the Wings daemon write
            // endpoint (no Client API key). Creates/overwrites the target file.
            var path = joinPath(currentPath(), file.name);
            fetch(API_BASE + "/api/wings/servers/" + wingsUuid() + "/files/write?file=" + encodeURIComponent(path), {
                method: "POST",
                headers: { "Content-Type": "application/octet-stream", "Accept": "application/json" },
                body: file
            }).then(function (r) {
                if (!r.ok) return r.text().then(function (txt) { throw new Error(txt || ("HTTP " + r.status)); });
                done();
            }).catch(function (err) { toast(err.message || t("dash.files.uploadFail"), "error"); loadFiles(); });
            return;
        }
        // Client-key path (optional): signed upload URL
        apiClient("servers/" + clientId() + "/files/upload")
            .then(function (data) {
                var url = data && data.attributes && data.attributes.url;
                if (!url) throw new Error(t("dash.files.uploadFail"));
                return fetch(API_BASE + "/api/ptero-upload?url=" + encodeURIComponent(url), {
                    method: "PUT",
                    headers: { "Content-Type": "application/octet-stream" },
                    body: file
                });
            })
            .then(function (r) {
                if (!r.ok) throw new Error(t("dash.files.uploadFail"));
                done();
            })
            .catch(function (err) { toast(err.message, "error"); loadFiles(); });
    }

    $("file-upload-input").addEventListener("change", function () {
        uploadFiles(this.files);
        this.value = "";
    });

    /* ======================================================================
       Databases (Application API)
       ====================================================================== */
    function loadDatabases() {
        var list = $("database-list");
        list.innerHTML = '<p class="dash-empty" style="padding:24px 0;">' + esc(t("dash.loading")) + "</p>";
        api("servers/" + serverId() + "/databases").then(function (data) {
            var items = (data && data.data) || [];
            list.innerHTML = "";
            if (!items.length) { list.innerHTML = '<p class="dash-empty">' + esc(t("dash.databases.none")) + "</p>"; return; }
            items.forEach(function (db) {
                var a = db.attributes || {};
                var card = document.createElement("div");
                card.className = "list-card";
                card.innerHTML =
                    '<div class="list-card-head">' +
                        "<div>" +
                            '<div class="list-card-title">' + esc(a.database || "") + "</div>" +
                            '<div class="list-card-sub">' +
                                '<span>' + t("dash.databases.name") + ": " + esc(a.username || "") + "</span>" +
                                "<span>remote: " + esc(a.remote || "") + "</span>" +
                                (a.host != null ? "<span>host: #" + esc(a.host) + "</span>" : "") +
                            "</div>" +
                        "</div>" +
                        '<div class="list-card-actions">' +
                            '<button class="btn btn-ghost btn-sm db-rotate">' + t("dash.databases.rotating") + "</button>" +
                            '<button class="btn btn-outline btn-sm db-del">' + t("dash.modal.delete") + "</button>" +
                        "</div>" +
                    "</div>";
                card.querySelector(".db-rotate").addEventListener("click", function () {
                    api("servers/" + serverId() + "/databases/" + a.id + "/reset-password", { method: "POST" })
                        .then(function () {
                            toast(t("dash.databases.rotated"), "success");
                            loadDatabases();
                        })
                        .catch(function (err) { toast(err.message, "error"); });
                });
                card.querySelector(".db-del").addEventListener("click", function () {
                    openModal({
                        title: t("dash.databases.deleteTitle"),
                        text: t("dash.databases.deleteText") + " \"" + a.database + "\"",
                        danger: true,
                        confirmLabel: t("dash.modal.delete"),
                        onConfirm: function () {
                            return api("servers/" + serverId() + "/databases/" + a.id, { method: "DELETE" })
                                .then(function () { loadDatabases(); });
                        }
                    });
                });
                list.appendChild(card);
            });
        }).catch(function (err) { list.innerHTML = '<p class="dash-empty">' + esc(err.message) + "</p>"; });
    }

    $("btn-refresh-databases").addEventListener("click", loadDatabases);

    $("btn-newdatabase").addEventListener("click", function () {
        openModal({
            title: t("dash.databases.createTitle"),
            body:
                '<label class="dash-label">' + t("dash.databases.name") + '</label><input class="dash-input" id="modal-value">' +
                '<label class="dash-label">' + t("dash.databases.remote") + '</label><input class="dash-input" id="modal-value2" value="%">' +
                '<label class="dash-label">' + t("dash.databases.host") + '</label><input class="dash-input" id="modal-value3" type="number" value="1">',
            confirmLabel: t("dash.modal.create"),
            onConfirm: function () {
                var name = $("modal-value").value.trim();
                var remote = $("modal-value2").value.trim() || "%";
                var host = parseInt($("modal-value3").value, 10) || 1;
                if (!name) return;
                return api("servers/" + serverId() + "/databases", {
                    method: "POST",
                    body: { database: name, remote: remote, host: host }
                }).then(function () {
                    toast(t("dash.databases.created"), "success");
                    loadDatabases();
                });
            }
        });
    });

    /* ======================================================================
       Backups (Client API)
       ====================================================================== */
    function loadBackups() {
        var list = $("backup-list");
        if (!clientReady()) { needsKeyTab("backup-list"); return; }
        list.innerHTML = '<p class="dash-empty" style="padding:24px 0;">' + esc(t("dash.loading")) + "</p>";
        apiClient("servers/" + clientId() + "/backups").then(function (data) {
            var items = (data && data.data) || [];
            list.innerHTML = "";
            if (!items.length) { list.innerHTML = '<p class="dash-empty">' + esc(t("dash.backups.none")) + "</p>"; return; }
            items.forEach(function (bk) {
                var a = bk.attributes || {};
                var card = document.createElement("div");
                card.className = "list-card";
                card.innerHTML =
                    '<div class="list-card-head">' +
                        "<div>" +
                            '<div class="list-card-title">' + esc(a.name || a.uuid || "Backup") +
                                (a.is_locked ? ' <span class="limit-chip">🔒</span>' : "") +
                            "</div>" +
                            '<div class="list-card-sub">' +
                                "<span>" + formatBytes(a.bytes) + "</span>" +
                                "<span>" + formatDate(a.created_at) + "</span>" +
                                (a.completed_at ? "<span>" + formatDate(a.completed_at) + "</span>" : "") +
                                (!a.is_successful && a.completed_at ? "<span class=\"text-danger\">" + t("dash.backups.failed") + "</span>" : "") +
                            "</div>" +
                        "</div>" +
                        '<div class="list-card-actions">' +
                            (a.completed_at && a.is_successful
                                ? '<button class="btn btn-ghost btn-sm bk-download">' + t("dash.files.download") + "</button>" +
                                  '<button class="btn btn-ghost btn-sm bk-restore">' + t("dash.backups.restore") + "</button>"
                                : "") +
                            '<button class="btn btn-ghost btn-sm bk-lock">' + t(a.is_locked ? "dash.backups.unlock" : "dash.backups.lock") + "</button>" +
                            '<button class="btn btn-outline btn-sm bk-del">' + t("dash.modal.delete") + "</button>" +
                        "</div>" +
                    "</div>";
                card.querySelector(".bk-lock").addEventListener("click", function () {
                    // /lock toggles the lock state server-side
                    apiClient("servers/" + clientId() + "/backups/" + a.uuid + "/lock", { method: "POST" })
                        .then(function () {
                            toast(t(a.is_locked ? "dash.backups.unlocked" : "dash.backups.locked"), "success");
                            loadBackups();
                        })
                        .catch(function (err) { toast(err.message, "error"); });
                });
                card.querySelector(".bk-del").addEventListener("click", function () {
                    openModal({
                        title: t("dash.backups.deleteTitle"),
                        text: t("dash.backups.deleteText"),
                        danger: true,
                        confirmLabel: t("dash.modal.delete"),
                        onConfirm: function () {
                            return apiClient("servers/" + clientId() + "/backups/" + a.uuid, { method: "DELETE" })
                                .then(function () { loadBackups(); });
                        }
                    });
                });
                if (card.querySelector(".bk-download")) {
                    card.querySelector(".bk-download").addEventListener("click", function () {
                        apiClient("servers/" + clientId() + "/backups/" + a.uuid + "/download")
                            .then(function (data) {
                                var url = data && data.attributes && data.attributes.url;
                                if (url) window.open(url, "_blank");
                                else toast(t("dash.backups.downloadFail"), "error");
                            })
                            .catch(function (err) { toast(err.message, "error"); });
                    });
                }
                if (card.querySelector(".bk-restore")) {
                    card.querySelector(".bk-restore").addEventListener("click", function () {
                        openModal({
                            title: t("dash.backups.restoreTitle"),
                            text: t("dash.backups.restoreText"),
                            danger: true,
                            confirmLabel: t("dash.backups.restore"),
                            onConfirm: function () {
                                return apiClient("servers/" + clientId() + "/backups/" + a.uuid + "/restore", { method: "POST" })
                                    .then(function () { toast(t("dash.backups.restoreStarted"), "success"); });
                            }
                        });
                    });
                }
                list.appendChild(card);
            });
        }).catch(function (err) { list.innerHTML = '<p class="dash-empty">' + esc(err.message) + "</p>"; });
    }

    $("btn-refresh-backups").addEventListener("click", loadBackups);

    $("btn-newbackup").addEventListener("click", function () {
        if (!requireClient()) return;
        openModal({
            title: t("dash.backups.createTitle"),
            body:
                '<label class="dash-label">' + t("dash.backups.name") + '</label><input class="dash-input" id="modal-value">' +
                '<label class="dash-label">' + t("dash.backups.ignored") + '</label><input class="dash-input" id="modal-value2">',
            confirmLabel: t("dash.modal.create"),
            onConfirm: function () {
                var name = $("modal-value").value.trim();
                var ignored = $("modal-value2").value.trim();
                var body = {};
                if (name) body.name = name;
                if (ignored) body.ignored = ignored.split(",").map(function (s) { return s.trim(); }).filter(Boolean).join("\n");
                return apiClient("servers/" + clientId() + "/backups", { method: "POST", body: body })
                    .then(function () { toast(t("dash.backups.created"), "success"); loadBackups(); });
            }
        });
    });

    /* ======================================================================
       Schedules (Client API)
       ====================================================================== */
    function loadSchedules() {
        var list = $("schedule-list");
        if (!clientReady()) { needsKeyTab("schedule-list"); return; }
        list.innerHTML = '<p class="dash-empty" style="padding:24px 0;">' + esc(t("dash.loading")) + "</p>";
        apiClient("servers/" + clientId() + "/schedules").then(function (data) {
            var items = (data && data.data) || [];
            list.innerHTML = "";
            if (!items.length) { list.innerHTML = '<p class="dash-empty">' + esc(t("dash.schedules.none")) + "</p>"; return; }
            items.forEach(function (sc) {
                var a = sc.attributes || {};
                var cron = a.cron || {};
                var tasks = (a.relationships && a.relationships.tasks && a.relationships.tasks.data) || [];
                var card = document.createElement("div");
                card.className = "list-card";
                card.innerHTML =
                    '<div class="list-card-head">' +
                        "<div>" +
                            '<div class="list-card-title">' + esc(a.name || "") + (a.is_active ? "" : ' <span class="limit-chip">⏸</span>') + "</div>" +
                            '<div class="list-card-sub mono">' + cronCell(cron.minute) + " " + cronCell(cron.hour) + " " + cronCell(cron.day_of_month) + " " + cronCell(cron.month) + " " + cronCell(cron.day_of_week) + "</div>" +
                            '<div class="list-card-sub">' + (tasks.length ? tasks.length + " tasks" : t("dash.schedules.actions")) + "</div>" +
                        "</div>" +
                        '<div class="list-card-actions">' +
                            '<button class="btn btn-ghost btn-sm sch-run">' + t("dash.schedules.run") + "</button>" +
                            '<button class="btn btn-ghost btn-sm sch-toggle">' + t(a.is_active ? "dash.schedules.pause" : "dash.schedules.resume") + "</button>" +
                            '<button class="btn btn-ghost btn-sm sch-task">' + t("dash.schedules.addTask") + "</button>" +
                            '<button class="btn btn-outline btn-sm sch-del">' + t("dash.modal.delete") + "</button>" +
                        "</div>" +
                    "</div>";
                card.querySelector(".sch-run").addEventListener("click", function () {
                    apiClient("servers/" + clientId() + "/schedules/" + a.id + "/execute", { method: "POST" })
                        .then(function () { toast(t("dash.schedules.ran"), "success"); })
                        .catch(function (err) { toast(err.message, "error"); });
                });
                card.querySelector(".sch-toggle").addEventListener("click", function () {
                    // schedule update is POST (not PATCH) and needs the full body
                    apiClient("servers/" + clientId() + "/schedules/" + a.id, {
                        method: "POST",
                        body: {
                            name: a.name || "",
                            cron: a.cron || {},
                            is_active: !a.is_active,
                            only_when_online: !!a.only_when_online
                        }
                    }).then(function () {
                        toast(t("dash.schedules.toggled"), "success");
                        loadSchedules();
                    }).catch(function (err) { toast(err.message, "error"); });
                });
                card.querySelector(".sch-task").addEventListener("click", function () { addTask(a); });
                card.querySelector(".sch-del").addEventListener("click", function () {
                    openModal({
                        title: t("dash.schedules.deleteTitle"),
                        text: t("dash.schedules.deleteText"),
                        danger: true,
                        confirmLabel: t("dash.modal.delete"),
                        onConfirm: function () {
                            return apiClient("servers/" + clientId() + "/schedules/" + a.id, { method: "DELETE" })
                                .then(function () { loadSchedules(); });
                        }
                    });
                });
                list.appendChild(card);
            });
        }).catch(function (err) { list.innerHTML = '<p class="dash-empty">' + esc(err.message) + "</p>"; });
    }

    function cronCell(v) { return v == null || v === "" ? "*" : esc(v); }

    function addTask(schedule) {
        openModal({
            title: t("dash.schedules.taskTitle"),
            body:
                '<label class="dash-label">' + t("dash.schedules.taskAction") + '</label><select class="dash-input" id="modal-value">' +
                    "<option>command</option><option>backup</option><option>power</option>" +
                "</select>" +
                '<label class="dash-label">' + t("dash.schedules.taskPayload") + '</label><input class="dash-input" id="modal-value2">' +
                '<label class="dash-label">' + t("dash.schedules.taskOffset") + '</label><input class="dash-input" id="modal-value3" type="number" value="0">',
            confirmLabel: t("dash.modal.create"),
            onConfirm: function () {
                var action = $("modal-value").value;
                var payload = $("modal-value2").value.trim();
                var offset = parseInt($("modal-value3").value, 10) || 0;
                var body = { action: action, time_offset: offset, continue_on_failure: false };
                if (payload) body.payload = payload;
                return apiClient("servers/" + clientId() + "/schedules/" + schedule.id + "/tasks", { method: "POST", body: body })
                    .then(function () { toast(t("dash.schedules.taskAdded"), "success"); loadSchedules(); });
            }
        });
    }

    $("btn-refresh-schedules").addEventListener("click", loadSchedules);

    $("btn-newschedule").addEventListener("click", function () {
        if (!requireClient()) return;
        openModal({
            title: t("dash.schedules.createTitle"),
            body:
                '<label class="dash-label">' + t("dash.schedules.name") + '</label><input class="dash-input" id="modal-value">' +
                '<label class="dash-label">' + t("dash.schedules.minute") + '</label><input class="dash-input" id="cron-0" value="*">' +
                '<label class="dash-label">' + t("dash.schedules.hour") + '</label><input class="dash-input" id="cron-1" value="*">' +
                '<label class="dash-label">' + t("dash.schedules.dayMonth") + '</label><input class="dash-input" id="cron-2" value="*">' +
                '<label class="dash-label">' + t("dash.schedules.month") + '</label><input class="dash-input" id="cron-3" value="*">' +
                '<label class="dash-label">' + t("dash.schedules.dayWeek") + '</label><input class="dash-input" id="cron-4" value="*">' +
                '<label class="dash-label"><input type="checkbox" id="cron-online"> ' + t("dash.schedules.onlineOnly") + "</label>",
            confirmLabel: t("dash.modal.create"),
            onConfirm: function () {
                var name = $("modal-value").value.trim();
                if (!name) return;
                var cron = {
                    minute: $("cron-0").value || "*",
                    hour: $("cron-1").value || "*",
                    day_of_month: $("cron-2").value || "*",
                    month: $("cron-3").value || "*",
                    day_of_week: $("cron-4").value || "*"
                };
                return apiClient("servers/" + clientId() + "/schedules", {
                    method: "POST",
                    body: { name: name, cron: cron, is_active: true, only_when_online: $("cron-online").checked }
                }).then(function () { toast(t("dash.schedules.created"), "success"); loadSchedules(); });
            }
        });
    });

    /* ======================================================================
       Network (Client API)
       ====================================================================== */
    function loadAllocations() {
        var list = $("allocation-list");
        list.innerHTML = '<p class="dash-empty" style="padding:24px 0;">' + esc(t("dash.loading")) + "</p>";
        api("servers/" + serverId() + "?include=allocations").then(function (data) {
            var a = (data && data.attributes) || {};
            var primaryId = a.allocation;
            var items = ((a.relationships && a.relationships.allocations && a.relationships.allocations.data) || [])
                .map(function (x) { return x.attributes || {}; });
            list.innerHTML = "";
            if (!items.length) { list.innerHTML = '<p class="dash-empty">' + esc(t("dash.network.none")) + "</p>"; return; }
            items.forEach(function (al) {
                var isPrimary = al.id === primaryId;
                var card = document.createElement("div");
                card.className = "list-card";
                card.innerHTML =
                    '<div class="list-card-head">' +
                        "<div>" +
                            '<div class="list-card-title mono">' + esc(al.ip) + ":" + esc(al.port) +
                                (isPrimary ? ' <span class="limit-chip">★ ' + esc(t("dash.network.primary")) + "</span>" : "") + "</div>" +
                            '<div class="list-card-sub mono">' + esc(al.alias || "") + (al.notes ? " — " + esc(al.notes) : "") + "</div>" +
                        "</div>" +
                        '<div class="list-card-actions">' +
                            (!isPrimary ? '<button class="btn btn-ghost btn-sm al-primary">' + t("dash.network.primary") + "</button>" : "") +
                            (!isPrimary ? '<button class="btn btn-outline btn-sm al-del">' + t("dash.modal.delete") + "</button>" : "") +
                        "</div>" +
                    "</div>";
                if (card.querySelector(".al-primary")) {
                    card.querySelector(".al-primary").addEventListener("click", function () {
                        buildAllocation({ allocation: al.id }).then(function () {
                            toast(t("dash.network.primarySet"), "success");
                            loadAllocations(); refreshServer();
                        }).catch(function (err) { toast(err.message, "error"); });
                    });
                }
                if (card.querySelector(".al-del")) {
                    card.querySelector(".al-del").addEventListener("click", function () {
                        openModal({
                            title: t("dash.network.deleteTitle"),
                            text: t("dash.network.deleteText"),
                            danger: true,
                            confirmLabel: t("dash.modal.delete"),
                            onConfirm: function () {
                                return buildAllocation({ remove_allocations: [al.id] }).then(function () {
                                    toast(t("dash.network.removed"), "success");
                                    loadAllocations(); refreshServer();
                                });
                            }
                        });
                    });
                }
                list.appendChild(card);
            });
        }).catch(function (err) { list.innerHTML = '<p class="dash-empty">' + esc(err.message) + "</p>"; });
    }

    /* Admin path: PATCH the server build to attach/detach/switch allocations.
       The build endpoint requires feature_limits, so pass the current ones. */
    function buildAllocation(patch) {
        var a = state.server && state.server.attributes;
        var fl = (a && a.feature_limits) || {};
        var body = {
            feature_limits: {
                databases: fl.databases || 0,
                allocations: fl.allocations || 0,
                backups: fl.backups || 0
            }
        };
        if (patch.allocation != null) body.allocation = patch.allocation;
        if (patch.add_allocations) body.add_allocations = patch.add_allocations;
        if (patch.remove_allocations) body.remove_allocations = patch.remove_allocations;
        return api("servers/" + serverId() + "/build", { method: "PATCH", body: body });
    }

    $("btn-refresh-network").addEventListener("click", loadAllocations);

    $("btn-assign-allocation").addEventListener("click", function () {
        var a = state.server && state.server.attributes;
        if (!a || a.node == null) { toast(t("dash.err.generic"), "error"); return; }
        // Admin path: find a free allocation on the server's node, attach it.
        api("nodes/" + a.node + "/allocations").then(function (data) {
            var items = (data && data.data) || [];
            var free = items.filter(function (x) { return x.attributes && x.attributes.assigned === false; })[0];
            if (!free) { toast(t("dash.network.none"), "info"); return; }
            return buildAllocation({ add_allocations: [free.attributes.id] });
        }).then(function () {
            toast(t("dash.network.assigned"), "success");
            loadAllocations(); refreshServer();
        }).catch(function (err) { toast(err.message, "error"); });
    });

    /* ======================================================================
       Subusers (Client API)
       ====================================================================== */
    var PERMISSIONS = [
        "websocket.connect", "control.console", "control.start", "control.stop", "control.restart",
        "user.create", "user.update", "user.delete", "file.create", "file.read", "file.update",
        "file.delete", "file.archive", "file.sftp", "backup.create", "backup.read", "backup.delete",
        "backup.download", "allocation.create", "allocation.update", "allocation.delete",
        "startup.read", "startup.update", "database.create", "database.read", "database.update",
        "database.delete", "schedule.create", "schedule.read", "schedule.update", "schedule.delete"
    ];

    function loadUsers() {
        var list = $("user-list");
        list.innerHTML = '<p class="dash-empty" style="padding:24px 0;">' + esc(t("dash.loading")) + "</p>";
        api("servers/" + serverId() + "?include=subusers").then(function (data) {
            var a = (data && data.attributes) || {};
            var items = ((a.relationships && a.relationships.subusers && a.relationships.subusers.data) || [])
                .map(function (x) { return x.attributes || {}; });
            list.innerHTML = "";
            if (!items.length) { list.innerHTML = '<p class="dash-empty">' + esc(t("dash.users.none")) + "</p>"; }
            items.forEach(function (u) {
                var perms = (u.permissions || []).length;
                var card = document.createElement("div");
                card.className = "list-card";
                card.innerHTML =
                    '<div class="list-card-head">' +
                        "<div>" +
                            '<div class="list-card-title">' + esc(u.username || u.email || "") + "</div>" +
                            '<div class="list-card-sub">' + esc(u.email || "") + (u["2fa_enabled"] ? " · 2FA" : "") + "</div>" +
                        "</div>" +
                        '<div class="list-card-actions"><span class="limit-chip">' + perms + " perms</span></div>" +
                    "</div>";
                list.appendChild(card);
            });
            list.insertAdjacentHTML("beforeend", '<div class="dash-empty needs-key">' + esc(t("dash.users.readonly")) + "</div>");
        }).catch(function (err) { list.innerHTML = '<p class="dash-empty">' + esc(err.message) + "</p>"; });
    }

    $("btn-refresh-users").addEventListener("click", loadUsers);

    $("btn-newuser").addEventListener("click", function () {
        if (!requireClient()) return;
        var boxes = PERMISSIONS.map(function (p) {
            return '<label class="perm-line"><input type="checkbox" class="perm-box" value="' + esc(p) + '" checked> <span class="mono">' + esc(p) + "</span></label>";
        }).join("");
        openModal({
            title: t("dash.users.createTitle"),
            body:
                '<label class="dash-label">' + t("dash.users.email") + '</label><input class="dash-input" id="modal-value" type="email">' +
                '<label class="dash-label">' + t("dash.users.permissions") + '</label><div class="perm-grid">' + boxes + "</div>",
            confirmLabel: t("dash.modal.create"),
            onConfirm: function () {
                var email = $("modal-value").value.trim();
                if (!email) return;
                var perms = Array.prototype.map.call(document.querySelectorAll(".perm-box:checked"), function (el) { return el.value; });
                return apiClient("servers/" + clientId() + "/users", { method: "POST", body: { email: email, permissions: perms } })
                    .then(function () {
                        toast(t("dash.users.created"), "success");
                        loadUsers();
                    });
            }
        });
    });

    /* ======================================================================
       Startup (Client API)
       ====================================================================== */
    function loadStartup() {
        var list = $("startup-list");
        list.innerHTML = '<p class="dash-empty" style="padding:24px 0;">' + esc(t("dash.loading")) + "</p>";
        api("servers/" + serverId() + "?include=variables").then(function (data) {
            var a = (data && data.attributes) || {};
            var cont = a.container || {};
            var vars = ((a.relationships && a.relationships.variables && a.relationships.variables.data) || [])
                .map(function (v) { return v.attributes || {}; });
            list.innerHTML = "";
            if (!vars.length && !cont.startup_command) {
                list.innerHTML = '<p class="dash-empty">' + esc(t("dash.startup.none")) + "</p>";
                return;
            }
            var html =
                '<div class="startup-item startup-meta">' +
                    "<div>" +
                        '<div class="list-card-title">' + esc(t("dash.startup.command")) + "</div>" +
                        '<div class="list-card-sub mono">' + esc(cont.startup_command || "") + "</div>" +
                    "</div>" +
                    '<div class="startup-control"><input class="dash-input startup-input startup-wide" id="startup-cmd" value="' + esc(cont.startup_command || "") + '"></div>' +
                "</div>" +
                '<div class="startup-item startup-meta">' +
                    "<div>" +
                        '<div class="list-card-title">' + esc(t("dash.startup.image")) + "</div>" +
                        '<div class="list-card-sub">' + esc(cont.image || "") + "</div>" +
                    "</div>" +
                    '<div class="startup-control"><input class="dash-input startup-input startup-wide" id="startup-image" value="' + esc(cont.image || "") + '"></div>' +
                "</div>" +
                '<div class="startup-item startup-meta">' +
                    "<div>" +
                        '<div class="list-card-title">' + esc(t("dash.startup.skip")) + "</div>" +
                        '<div class="list-card-sub">' + esc(t("dash.startup.skipDesc")) + "</div>" +
                    "</div>" +
                    '<div class="startup-control"><input type="checkbox" class="dash-check" id="startup-skip"></div>' +
                "</div>";
            vars.forEach(function (v) {
                var val = v.server_value != null ? v.server_value : (v.default_value != null ? v.default_value : "");
                html += '<div class="startup-item">' +
                    "<div>" +
                        '<div class="list-card-title mono">' + esc(v.env_variable || v.name || "") + "</div>" +
                        '<div class="list-card-sub">' + esc(v.description || "") + "</div>" +
                    "</div>" +
                    '<div class="startup-control"><input class="dash-input startup-input startup-wide startup-var" data-key="' + esc(v.env_variable || "") + '" value="' + esc(val) + '"></div>' +
                "</div>";
            });
            html += '<div class="startup-savebar"><button class="btn btn-primary" id="startup-save-all">' + esc(t("dash.startup.saveAll")) + "</button></div>";
            list.innerHTML = html;
            var saveBtn = $("startup-save-all");
            if (saveBtn) saveBtn.addEventListener("click", saveStartup);
        }).catch(function (err) { list.innerHTML = '<p class="dash-empty">' + esc(err.message) + "</p>"; });
    }

    /* Admin path: save startup command, docker image and every variable in one
       PATCH to the Application API startup endpoint. */
    function saveStartup() {
        var env = {};
        document.querySelectorAll(".startup-var").forEach(function (inp) {
            if (inp.dataset.key) env[inp.dataset.key] = inp.value;
        });
        var skipBox = $("startup-skip");
        var body = {
            startup: $("startup-cmd").value,
            environment: env,
            skip_scripts: skipBox ? skipBox.checked : false
        };
        var img = $("startup-image").value.trim();
        if (img) body.image = img;
        api("servers/" + serverId() + "/startup", { method: "PATCH", body: body })
            .then(function () {
                toast(t("dash.startup.saved"), "success");
                loadStartup();
            })
            .catch(function (err) { toast(err.message, "error"); });
    }

    var refreshStartupBtn = document.getElementById("btn-refresh-startup");
    if (refreshStartupBtn) refreshStartupBtn.addEventListener("click", loadStartup);

    $("btn-refresh-startup").addEventListener("click", loadStartup);

    /* ======================================================================
       Suspend / unsuspend / reinstall (Application API)
       ====================================================================== */
    function serverId() {
        return state.server && state.server.attributes ? state.server.attributes.id : null;
    }

    $("btn-suspend").addEventListener("click", function () {
        var a = state.server.attributes;
        var suspended = !!a.suspended;
        openModal({
            title: t(suspended ? "dash.unsuspend" : "dash.suspend"),
            text: t(suspended ? "dash.unsuspendConfirm" : "dash.suspendConfirm"),
            danger: true,
            confirmLabel: t(suspended ? "dash.unsuspend" : "dash.suspend"),
            onConfirm: function () {
                return api("servers/" + serverId() + (suspended ? "/unsuspend" : "/suspend"), { method: "POST" })
                    .then(function () {
                        toast(t(suspended ? "dash.unsuspended" : "dash.suspended"), "success");
                        refreshServer();
                    });
            }
        });
    });

    $("btn-reinstall").addEventListener("click", reinstallServer);
    $("btn-reinstall-danger").addEventListener("click", reinstallServer);

    function reinstallServer() {
        openModal({
            title: t("dash.settings.reinstall"),
            text: t("dash.settings.reinstallConfirm"),
            danger: true,
            confirmLabel: t("dash.settings.reinstall"),
            onConfirm: function () {
                return api("servers/" + serverId() + "/reinstall", { method: "POST" })
                    .then(function () { toast(t("dash.settings.reinstalling"), "success"); });
            }
        });
    }

    function refreshServer() {
        api("servers/" + serverId()).then(function (data) {
            // application API single-server view returns {object, attributes}
            var fresh = data && data.attributes ? { attributes: data.attributes } : state.server;
            if (data && data.attributes) {
                state.servers = state.servers.map(function (s) {
                    var a = s.attributes || {};
                    return (a.id === data.attributes.id) ? { attributes: data.attributes } : s;
                });
            }
            state.server = fresh;
            var a = fresh.attributes || {};
            $("server-name").textContent = a.name || "Server";
            $("btn-suspend-label").textContent = t(a.suspended ? "dash.unsuspend" : "dash.suspend");
            refreshServerStatus();
        }).catch(function () { /* ignore */ });
    }

    /* ======================================================================
       Settings
       ====================================================================== */
    $("form-rename").addEventListener("submit", function (e) {
        e.preventDefault();
        var name = $("input-newname").value.trim();
        if (!name) return;
        api("servers/" + serverId() + "/details", {
            method: "PATCH",
            body: { name: name, description: (state.server.attributes && state.server.attributes.description) || "" }
        }).then(function () {
            toast(t("dash.settings.renamed"), "success");
            $("server-name").textContent = name;
            $("input-newname").value = "";
            refreshServer();
        }).catch(function (err) { toast(err.message, "error"); });
    });

    /* ======================================================================
       Modal
       ====================================================================== */
    function openModal(opts) {
        $("modal-title").textContent = opts.title || "";
        $("modal-text").textContent = opts.text || "";
        $("modal-body").innerHTML = opts.body || "";
        var modalEl = $("modal");
        if (modalEl) modalEl.classList.toggle("modal-lg", opts.size === "lg");
        var confirm = $("modal-confirm");
        confirm.textContent = opts.confirmLabel || t("dash.modal.confirm");
        if (opts.danger) confirm.className = "btn btn-outline btn-sm danger-btn";
        else confirm.className = "btn btn-primary btn-sm";
        $("modal-overlay").classList.remove("hidden");
        confirm.onclick = function () {
            var p = opts.onConfirm ? opts.onConfirm() : Promise.resolve();
            Promise.resolve(p).then(function () {
                closeModal();
            }).catch(function (err) {
                toast(err.message, "error");
                closeModal();
            });
        };
        var firstInput = $("modal-body").querySelector("input, textarea, select");
        if (firstInput) setTimeout(function () { firstInput.focus(); }, 50);
    }

    function closeModal() {
        $("modal-overlay").classList.add("hidden");
        $("modal-confirm").onclick = null;
    }

    $("modal-cancel").addEventListener("click", closeModal);
    $("modal-overlay").addEventListener("click", function (e) {
        if (e.target === $("modal-overlay")) closeModal();
    });

    /* ======================================================================
       Toasts
       ====================================================================== */
    function toast(message, type) {
        var wrap = $("toast-wrap");
        var el = document.createElement("div");
        el.className = "toast " + (type || "info");
        el.textContent = message;
        wrap.appendChild(el);
        setTimeout(function () {
            el.style.opacity = "0";
            el.style.transition = "opacity 0.3s ease";
            setTimeout(function () { el.remove(); }, 320);
        }, 3200);
    }

    /* ======================================================================
       Language switcher
       ====================================================================== */
    function getStoredLang() {
        try {
            return localStorage.getItem("spark-lang") === "ar" ? "ar" : "en";
        } catch (e) { return "en"; }
    }
    function storeLang(lang) {
        try { localStorage.setItem("spark-lang", lang); } catch (e) { /* ignore */ }
    }

    function applyLanguage(lang) {
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            var key = el.dataset.i18n;
            if (T[lang] && T[lang][key] != null) el.textContent = T[lang][key];
        });
        document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
            var key = el.dataset.i18nHtml;
            if (T[lang] && T[lang][key] != null) el.innerHTML = T[lang][key];
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
            var key = el.dataset.i18nPlaceholder;
            if (T[lang] && T[lang][key] != null) el.placeholder = T[lang][key];
        });
        var flagSrc = lang === "ar" ? "assets/saudi.png" : "assets/united.png";
        var label = lang === "ar" ? "العربية" : "English";
        $("lang-flag").src = flagSrc;
        $("lang-flag").alt = label;
        $("lang-label").textContent = label;
        document.querySelectorAll(".lang-option").forEach(function (opt) {
            opt.classList.toggle("active", opt.dataset.lang === lang);
        });
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        storeLang(lang);
        markKeyTabs(); // applyLanguage wipes the appended lock spans via textContent
    }

    $("lang-toggle").addEventListener("click", function (e) {
        e.stopPropagation();
        var menu = $("lang-menu");
        var open = menu.classList.toggle("open");
        this.classList.toggle("open", open);
        this.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".lang-option").forEach(function (opt) {
        opt.addEventListener("click", function (e) {
            e.stopPropagation();
            applyLanguage(opt.dataset.lang);
            $("lang-menu").classList.remove("open");
            $("lang-toggle").classList.remove("open");
            $("lang-toggle").setAttribute("aria-expanded", "false");
            if (state.server) {
                loadActiveTab();
                refreshServerStatus();
            }
        });
    });
    document.addEventListener("click", function () {
        $("lang-menu").classList.remove("open");
        $("lang-toggle").classList.remove("open");
        $("lang-toggle").setAttribute("aria-expanded", "false");
    });

    /* ---------- header scroll ---------- */
    window.addEventListener("scroll", function () {
        $("header").classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });

    /* ---------- polling ---------- */
    setInterval(function () {
        if (state.server) {
            if (clientReady()) refreshResources();
            else refreshServerStatus();
        } else {
            refreshAllStatuses();
        }
    }, 10000);

    /* ======================================================================
       Icons
       ====================================================================== */
    function iconDownload() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'; }
    function iconEdit() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'; }
    function iconRename() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'; }
    function iconCopy() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'; }
    function iconChmod() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'; }
    function iconCompress() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M8 2v3 M16 2v3 M2 8h20 M3 5h18a1 1 0 0 1 1 1v2M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/></svg>'; }
    function iconExtract() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'; }
    function iconTrash() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'; }

    /* ======================================================================
       Init
       ====================================================================== */
    function init() {
        applyLanguage(getStoredLang());
        markKeyTabs();
        loadServers();
    }
    init();
})();
