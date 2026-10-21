/* ============================================================================
   Camp Office — per-user permission ticks   (camp-perm.js)
   ----------------------------------------------------------------------------
   Super Admin ticks, for every user and every page, what that user may do:
     v = View (open the page)      a = Add        e = Edit        d = Delete
     x = Export / Print            l = Manage lists               ai = AI helper
   The ticks live in  users/{uid}.perms  = { "<page>": { v:true, a:true, ... }, ... }.

   * A user whose profile has no  perms  (never edited) behaves exactly like his role did before:
     DEFAULTS below (and the Firestore rules carry the same table).
   * Super Admin can always do everything; ticks never lock him out.
   * If  perms["<page>"]  exists it replaces the defaults for that page completely.
   * This file only decides what the SCREEN shows. The Firestore rules are the real lock.
   * The officer rule (a Data Entry user works only on his own officer's data) is separate and stays.
   ========================================================================== */
(function () {
  'use strict';
  if (window.CampPerm) { return; }

  /* ---- the pages that have ticks (Phase 1) -------------------------------------------------- */
  var PAGES = [
    { key: 'case-entry',  href: 'case-entry.html',  ur: 'یومیہ کیس انٹری',   en: 'Daily Cases',        acts: ['v', 'a', 'e', 'd', 'x', 'ai'] },
    { key: 'cause-list',  href: 'cause-list.html',  ur: 'کاز لسٹ امپورٹ',    en: 'Cause List Import',  acts: ['v', 'a', 'e', 'd', 'x'] },
    { key: 'lookup',      href: 'lookup.html',      ur: 'تلاش (Lookup)',      en: 'Lookup',             acts: ['v', 'x'] },
    { key: 'case-notice', href: 'case-notice.html', ur: 'کیس نوٹسز',          en: 'Case Notices',       acts: ['v', 'a', 'e', 'd', 'x'] },
    { key: 'scanning',    href: 'scanning.html',    ur: 'اسکیننگ ڈیسک',       en: 'Scanning Desk',      acts: ['v', 'a', 'e', 'd', 'x', 'ai'] },
    { key: 'employees',   href: 'employee-directory.html', ur: 'ملازمین کی ڈائریکٹری', en: 'Employee Directory', acts: ['v', 'a', 'e', 'x', 'i'] },
    { key: 'backup',      href: 'backup-center.html', ur: 'بیک اپ سینٹر (ریسٹور صرف سپر ایڈمن)', en: 'Backup Center (Restore: Super Admin only)', acts: ['v', 'b'] },
    { key: 'inspection',  href: 'inspection.html',  ur: 'انسپیکشن ڈیسک (ایڈٹ = ڈیٹا بھرنا)', en: 'Inspection Desk (Edit = enter data)', acts: ['v', 'e', 'd', 's1', 's2', 's3', 'k', 'x'] },
    { key: 'master-data', href: 'master-data.html', ur: 'ماسٹر ڈیٹا (کیس کی اقسام)', en: 'Master Data (case types)', acts: ['v', 'e'] },
    { key: 'result-list', href: 'result-list.html', ur: 'رزلٹ لسٹ', en: 'Result List', acts: ['v', 'e'] },
    { key: 'contacts',    href: 'contact-us.html',  ur: 'رابطہ (Contact)', en: 'Contact Us', acts: ['v', 'a', 'e', 'd'] },
    { key: 'help',        href: 'help.html',        ur: 'مدد (Help)', en: 'Help', acts: ['v', 'a', 'e', 'd'] },
    { key: 'about',       href: 'about.html',       ur: 'ہمارے بارے میں', en: 'About Us', acts: ['v', 'e'] },
    { key: 'chat',        href: 'chat-system.html', ur: 'ٹیم چیٹ (a = پیغام بھیجنا، d = پیغام حذف)', en: 'Team Chat (Add = send, Delete = remove messages)', acts: ['v', 'a', 'd'] },
    { key: 'ai-assistant', href: 'ai-assistant.html', ur: 'AI اسسٹنٹ', en: 'AI Assistant', acts: ['v', 'ai'] },
    { key: 'roster',      href: '',                 urlPart: 'weekly-court-roster', ur: 'ویکلی کورٹ روسٹر (ایڈٹ = روسٹر محفوظ کرنا)', en: 'Weekly Court Roster (Edit = save a week)', acts: ['v', 'e', 'd', 'x'] },
    { key: 'bill',        href: '',                 urlPart: 'bill-register-system', ur: 'بل رجسٹر (ہر ٹیب کا ایڈٹ ٹِک: شامل/ایڈٹ/ڈیلیٹ)', en: 'Bill Register (one Edit tick per tab: add/edit/delete)', acts: ['v', 'bl', 'ca', 'st', 'em', 'lv', 'at', 'cf', 'x'] },
    { key: 'recordsec',   href: '',                 urlPart: 'record-section-system', ur: 'ریکارڈ سیکشن (ہر ٹیب کا ایڈٹ ٹِک: شامل/ایڈٹ/ڈیلیٹ)', en: 'Record Section (one Edit tick per tab: add/edit/delete)', acts: ['v', 'be', 'dr', 'fm', 'lt', 'cr', 'cf', 'x'] },
    { key: 'lists',       href: '',                 ur: 'فہرستیں سنبھالنا (جج، آفیسر، اقسام…)', en: 'Manage lists (judges, officers, types…)', acts: ['l'] }
  ];
  var ACT_LABEL = {
    v: ['دیکھنا', 'View'], a: ['شامل', 'Add'], e: ['ایڈٹ', 'Edit'], d: ['ڈیلیٹ', 'Delete'],
    x: ['ایکسپورٹ / پرنٹ', 'Export / Print'], i: ['فائل سے امپورٹ', 'Import file'], b: ['بیک اپ بنانا', 'Make backup'], s1: ['دستخط: کلرک', 'Sign: Clerk'], s2: ['دستخط: پراسیکیوٹر', 'Sign: Prosecutor'], s3: ['دستخط: انچارج', 'Sign: In-charge'], k: ['مدت اور سیٹنگز', 'Periods & settings'], l: ['فہرستیں سنبھالنا', 'Manage lists'], ai: ['AI مددگار', 'AI helper'],
    bl: ['بل: ایڈٹ', 'Bills: edit'], ca: ['کیش بک: ایڈٹ', 'Cash Book: edit'], st: ['اسٹاک: ایڈٹ', 'Stock: edit'], em: ['ملازمین اور پے سلپ: ایڈٹ', 'Employees & pay slips: edit'], lv: ['چھٹی: ایڈٹ', 'Leave: edit'], at: ['حاضری: ایڈٹ', 'Attendance: edit'],
    cf: ['سیٹنگز / لیجر / فیلڈز (ایڈمن کا کام)', 'Settings / ledger / fields (admin work)'],
    be: ['بینچ اور کاز لسٹ: ایڈٹ', 'Bench & cause list: edit'], dr: ['ڈیوٹی روسٹر: ایڈٹ', 'Duty roster: edit'], fm: ['فائل موومنٹ: ایڈٹ', 'File movement: edit'], lt: ['خطوط: ایڈٹ', 'Letters: edit'], cr: ['کسٹم رجسٹر: ایڈٹ', 'Custom registers: edit']
  };

  /* ---- what a user can do when his profile has no ticks (same as before the ticks existed) --- */
  var DEFAULTS = {
    'case-entry':  { viewer: ['v', 'x'], data_entry: ['v', 'a', 'e', 'd', 'x'], admin: ['v', 'a', 'e', 'd', 'x', 'ai'] },
    'cause-list':  { viewer: ['v', 'x'], data_entry: ['v', 'a', 'e', 'x'],      admin: ['v', 'a', 'e', 'd', 'x'] },
    'lookup':      { viewer: ['v', 'x'], data_entry: ['v', 'x'],                 admin: ['v', 'x'] },
    'case-notice': { viewer: ['v', 'x'], data_entry: ['v', 'a', 'e', 'x'],      admin: ['v', 'a', 'e', 'd', 'x'] },
    'scanning':    { viewer: ['v', 'x'], data_entry: ['v', 'a', 'e', 'x', 'ai'], admin: ['v', 'a', 'e', 'd', 'x', 'ai'] },
    'employees':   { viewer: [],         data_entry: [],                         admin: ['v', 'a', 'e', 'x'] },
    'backup':      { viewer: [],         data_entry: [],                         admin: ['v', 'b'] },
    'inspection':  { viewer: ['v', 'x'], data_entry: ['v', 'e', 'd', 's1', 'x'], admin: ['v', 'e', 'd', 's1', 's2', 's3', 'k', 'x'] },
    'master-data': { viewer: [],         data_entry: [],                         admin: [] },
    'result-list': { viewer: [],         data_entry: [],                         admin: [] },
    'contacts':    { viewer: ['v'],      data_entry: ['v'],                      admin: ['v', 'a', 'e', 'd'] },
    'help':        { viewer: ['v'],      data_entry: ['v'],                      admin: ['v', 'a', 'e', 'd'] },
    'about':       { viewer: ['v'],      data_entry: ['v'],                      admin: ['v', 'e'] },
    'chat':        { viewer: ['v', 'a'], data_entry: ['v', 'a'],                 admin: ['v', 'a', 'd'] },
    'ai-assistant': { viewer: [],        data_entry: [],                         admin: ['v', 'ai'] },
    'roster':      { viewer: ['v', 'x'], data_entry: ['v', 'x'],                 admin: ['v', 'e', 'd', 'x'] },
    'bill':        { viewer: ['v', 'x'], data_entry: ['v', 'x'],                 admin: ['v', 'bl', 'ca', 'st', 'em', 'lv', 'at', 'cf', 'x'] },
    'recordsec':   { viewer: ['v', 'x'], data_entry: ['v', 'x'],                 admin: ['v', 'be', 'dr', 'fm', 'lt', 'cr', 'cf', 'x'] },
    'lists':       { viewer: [],         data_entry: [],                         admin: ['l'] }
  };

  function roleOf(u) {
    if (!u) { return 'viewer'; }
    return u.roleV2 || (u.role === 'admin' ? 'admin' : 'viewer');
  }
  function isOwner(u) { return roleOf(u) === 'super_admin'; }
  function defaultsFor(role, page) {
    var d = DEFAULTS[page];
    if (!d) { return []; }
    return d[role] || d.viewer || [];
  }
  /* can user u do act on page ?  (u = the users/{uid} data) */
  function can(u, page, act) {
    if (isOwner(u)) { return true; }
    var p = u && u.perms && u.perms[page];
    if (p && typeof p === 'object') { return p[act] === true; }
    return defaultsFor(roleOf(u), page).indexOf(act) !== -1;
  }
  /* the full table of ticks a user has right now (defaults filled in) */
  function effective(u) {
    var out = {};
    PAGES.forEach(function (pg) {
      out[pg.key] = {};
      pg.acts.forEach(function (a) { out[pg.key][a] = can(u, pg.key, a); });
    });
    return out;
  }
  /* turn a table of booleans into what is stored (only known pages/acts, only real booleans) */
  function clean(table) {
    var out = {};
    PAGES.forEach(function (pg) {
      var row = table && table[pg.key];
      if (!row) { return; }
      out[pg.key] = {};
      pg.acts.forEach(function (a) { out[pg.key][a] = row[a] === true; });
    });
    return out;
  }
  function pageInfo(key) {
    for (var i = 0; i < PAGES.length; i++) { if (PAGES[i].key === key) { return PAGES[i]; } }
    return null;
  }

  /* ---- screen part ------------------------------------------------------------------------- */
  var state = { user: null, page: null };
  function isUr() {
    try { return (window.currentLang || window.lang || (document.documentElement.getAttribute('lang') || '')).toString().indexOf('ur') === 0 || window.isUrdu === true; } catch (e) { return false; }
  }
  function lastSeg(h) {
    h = String(h || '').split('#')[0].split('?')[0];
    return h.split('/').pop();
  }
  function hideNav(u) {
    PAGES.forEach(function (pg) {
      if ((!pg.href && !pg.urlPart) || can(u, pg.key, 'v')) { return; }
      var links = document.querySelectorAll('#sidebar a[href], .quick-tile[href]');
      Array.prototype.forEach.call(links, function (a) {
        var hr = a.getAttribute('href') || '';
        if (pg.urlPart) {
          if (hr.indexOf('/' + pg.urlPart + '/') !== -1) { a.style.display = 'none'; a.setAttribute('data-perm-hidden', pg.key); }
          return;
        }
        if (/^https?:/i.test(hr)) { return; }
        if (lastSeg(hr) === pg.href) { a.style.display = 'none'; a.setAttribute('data-perm-hidden', pg.key); }
      });
    });
  }
  function showBlock(pg) {
    if (document.getElementById('cp-block')) { return; }
    var st = document.createElement('style');
    st.textContent = '.cp-block{position:fixed;inset:0;z-index:2147483645;background:rgba(15,25,45,.96);color:#fff;display:flex;align-items:center;justify-content:center;padding:16px;font-family:"Segoe UI",Tahoma,Arial,sans-serif}' +
      '.cp-card{max-width:460px;width:100%;background:#17294a;border:1px solid #3a4f7d;border-radius:14px;padding:26px 24px;text-align:center}' +
      '.cp-card h2{margin:0 0 8px;font-size:20px;color:#ffd77a}.cp-ur{direction:rtl;font-family:"Noto Nastaliq Urdu","Noto Naskh Arabic",Tahoma,Arial,sans-serif;font-size:15px;line-height:2}.cp-en{font-size:12.5px;opacity:.88}' +
      '.cp-btn{display:inline-block;margin-top:14px;border:1px solid #d4a13d;background:#d4a13d;color:#17294a;border-radius:8px;padding:9px 16px;font-weight:700;font-size:14px;text-decoration:none}';
    document.head.appendChild(st);
    var d = document.createElement('div');
    d.id = 'cp-block'; d.className = 'cp-block'; d.setAttribute('role', 'alertdialog'); d.setAttribute('aria-modal', 'true');
    d.innerHTML = '<div class="cp-card"><h2>رسائی کی اجازت نہیں / No access</h2>' +
      '<div class="cp-ur">آپ کو اس صفحے (' + (pg ? pg.ur : '') + ') کو کھولنے کی اجازت نہیں دی گئی۔ ضرورت ہو تو سپر ایڈمن سے رابطہ کریں۔</div>' +
      '<div class="cp-en">You have not been given permission to open this page (' + (pg ? pg.en : '') + '). Ask the Super Admin if you need it.</div>' +
      '<a class="cp-btn" href="index.html">پورٹل پر جائیں / Go to portal</a></div>';
    document.documentElement.appendChild(d);
    try { document.body.setAttribute('inert', ''); } catch (e) {}
  }
  function hideBlock() {
    var d = document.getElementById('cp-block');
    if (d && d.parentNode) { d.parentNode.removeChild(d); }
    try { document.body.removeAttribute('inert'); } catch (e) {}
  }
  /* call once the user's profile is known.  pageKey = the page being shown (omit on the hub). */
  function init(u, pageKey) {
    state.user = u || null; state.page = pageKey || null;
    hideNav(u || {});
    var pg = pageKey ? pageInfo(pageKey) : null;
    if (pg && !can(u, pageKey, 'v')) { showBlock(pg); return false; }
    hideBlock();
    return true;
  }
  /* the logged-in user's right (after init) */
  function canMe(page, act) { return can(state.user, page, act); }

  window.CampPerm = {
    PAGES: PAGES, ACT_LABEL: ACT_LABEL, DEFAULTS: DEFAULTS,
    roleOf: roleOf, can: can, canMe: canMe, effective: effective, clean: clean, pageInfo: pageInfo,
    init: init, isUr: isUr
  };
})();
