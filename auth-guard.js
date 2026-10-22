/* ============================================================================
   Camp Office — shared session guard   (auth-guard.js, served from the site root)
   ----------------------------------------------------------------------------
   Loaded by every page of the portal and by the five separate systems (they all
   live on the same origin, cmpofficepgp.org, and share one Firebase sign-in).

   1) AUTO SIGN-OUT.  After 30 minutes (Super Admin: 10 minutes) without ANY activity in ANY open tab the
      user is signed out (a 2-minute warning with a "Stay signed in" button comes
      first).  Activity is shared between tabs through localStorage, so working in
      Case Entry keeps the whole session alive, and a closed/forgotten portal tab
      can no longer leave the account signed in forever.
      STALE SESSIONS.  A login that the browser restored after the computer / browser was off is judged by the
      activity stamp that was there BEFORE this page took part (so a mouse move while the page loads can no longer
      "refresh" a day-old session), and any login older than 12 hours is ended when a page is opened.
   2) APPROVAL GATE (optional).  A page that sets  window.CAMP_REQUIRE_APPROVED = true
      before this script is blocked, with a full-screen notice, unless the signed-in
      user's  users/{uid}  profile is approved and active.  (The Firestore rules are
      the real protection; this stops the screen from even opening.)
   3) READ-ONLY NOTICE (optional).  window.CAMP_WRITE_ROLES = ['admin','super_admin']
      shows a banner to everybody else on that page, so they know saving is not allowed.

   4) SUPER ADMIN SIGN-IN CODE.  When the Super Admin has turned the sign-in code ON and this sign-in has not yet been
      verified, any page other than the portal sends the Super Admin to the portal, which shows the code screen.
      (The Firestore rules are the real lock; this only avoids a page full of "permission denied".)

   5) MAINTENANCE SWITCH.  The Super Admin can close the portal (maintenance.html).  The document appConfig/maintenance
      { closed, message, reopenAtMs } is watched live; while it says closed (and the reopen time, if any, has not come)
      every signed-in user except the Super Admin gets a full-screen "portal closed" notice with the message and the
      reopening time.  Nothing is signed out and no data is touched; the Super Admin keeps working normally.
      This is a SCREEN lock for normal users (like the approval gate); the Firestore rules do not read this switch.

   No page logic is replaced: the guard only watches the existing Firebase session.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__campGuardLoaded) { return; }
  window.__campGuardLoaded = true;

  var IDLE_MS = 30 * 60 * 1000;      /* sign out after this much inactivity          */
  var IDLE_SUPER_MS = 10 * 60 * 1000;/* ... for the Super Admin                      */
  var MAX_SESSION_MS = 12 * 60 * 60 * 1000;  /* a login older than this is ended when a page opens */
  var KEY_SUPER = 'campSuperUid';    /* uid of the Super Admin (so every page knows the shorter limit) */
  var WARN_MS = 2 * 60 * 1000;       /* show the warning this long before sign-out   */
  var TICK_MS = 1000;                /* how often the idle clock is checked          */
  var SAVE_EVERY_MS = 5000;          /* how often activity is written to storage     */
  var KEY_ACTIVITY = 'campLastActivity';
  var KEY_IDLE_OUT = 'campIdleLogout';
  var PORTAL_URL = '/camp-office-suite/';
  var FN_STATUS = 'https://us-central1-camp-office-project.cloudfunctions.net/campOtpStatus';

  var auth = null, db = null, user = null;
  var memLast = Date.now(), lastSaved = 0;
  var firstAuthSeen = false;
  /* the activity stamp as it was BEFORE anything on this page could touch it (-1 = storage unreadable) */
  var INITIAL_LAST = (function () {
    try { var v = parseInt(localStorage.getItem('campLastActivity'), 10); return isNaN(v) ? 0 : v; } catch (e) { return -1; }
  }());
  var bannerEl = null, blockEl = null, roBannerEl = null;
  var timer = null;

  /* ----------------------------------------------------------- idle limit */
  function isSuperUid(uid) {
    try { return !!uid && localStorage.getItem(KEY_SUPER) === uid; } catch (e) { return false; }
  }
  function idleFor(uid) { return isSuperUid(uid) ? IDLE_SUPER_MS : IDLE_MS; }
  function markSuper(uid) { try { if (uid) { localStorage.setItem(KEY_SUPER, uid); } } catch (e) {} }
  function unmarkSuper(uid) { try { if (localStorage.getItem(KEY_SUPER) === uid) { localStorage.removeItem(KEY_SUPER); } } catch (e) {} }

  /* ---------------------------------------------------------------- storage */
  function getLast() {
    try {
      var v = parseInt(localStorage.getItem(KEY_ACTIVITY), 10);
      return isNaN(v) ? 0 : v;
    } catch (e) { return memLast; }
  }
  function touch(force) {
    var t = Date.now();
    if (!force && t - lastSaved < SAVE_EVERY_MS) { return; }
    lastSaved = t; memLast = t;
    try { localStorage.setItem(KEY_ACTIVITY, String(t)); } catch (e) { /* storage blocked: per-tab fallback */ }
  }

  /* --------------------------------------------------------------- styling */
  function addStyle() {
    if (document.getElementById('cg-style')) { return; }
    var st = document.createElement('style');
    st.id = 'cg-style';
    st.textContent =
      '.cg-banner{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:2147483600;width:min(460px,calc(100vw - 24px));' +
      'background:#17294a;color:#fff;border:2px solid #d4a13d;border-radius:12px;padding:14px 16px;box-shadow:0 10px 30px rgba(0,0,0,.35);' +
      'font-family:"Segoe UI",Tahoma,Arial,sans-serif;font-size:14px;line-height:1.6}' +
      '.cg-banner .cg-ur,.cg-block .cg-ur{direction:rtl;text-align:right;font-family:"Noto Nastaliq Urdu","Noto Naskh Arabic",Tahoma,Arial,sans-serif;font-size:15px;line-height:2}' +
      '.cg-banner .cg-en,.cg-block .cg-en{direction:ltr;text-align:left;font-size:12.5px;opacity:.88}' +
      '.cg-time{font-weight:700;color:#ffd77a;font-variant-numeric:tabular-nums}' +
      '.cg-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}' +
      '.cg-btn{border:1px solid #d4a13d;background:#d4a13d;color:#17294a;border-radius:8px;padding:9px 16px;font-weight:700;font-size:14px;cursor:pointer;text-decoration:none;display:inline-block}' +
      '.cg-btn.cg-alt{background:transparent;color:inherit;border-color:currentColor}' +
      '.cg-btn:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
      '.cg-block{position:fixed;inset:0;z-index:2147483646;background:rgba(15,25,45,.96);color:#fff;display:flex;align-items:center;justify-content:center;padding:16px;' +
      'font-family:"Segoe UI",Tahoma,Arial,sans-serif}' +
      '.cg-block .cg-card{max-width:460px;width:100%;background:#17294a;border:1px solid #3a4f7d;border-radius:14px;padding:26px 24px;text-align:center}' +
      '.cg-block h2{margin:0 0 8px;font-size:20px;color:#ffd77a}' +
      '.cg-block .cg-row{justify-content:center}' +
      '.cg-ro{position:fixed;top:0;left:0;right:0;z-index:2147483000;background:#fbebd0;color:#5a4309;border-bottom:2px solid #b8860b;padding:8px 14px;text-align:center;' +
      'font-family:"Segoe UI",Tahoma,Arial,sans-serif;font-size:13.5px;line-height:1.7}' +
      '.cg-ro .cg-ur{direction:rtl;font-family:"Noto Nastaliq Urdu","Noto Naskh Arabic",Tahoma,Arial,sans-serif}';
    document.head.appendChild(st);
  }

  /* ------------------------------------------------------------ idle logic */
  function signOutIdle() {
    try { localStorage.setItem(KEY_IDLE_OUT, String(Date.now())); } catch (e) {}
    hideBanner();
    if (auth) { auth.signOut(); }
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function showBanner(secsLeft) {
    addStyle();
    if (!bannerEl) {
      bannerEl = document.createElement('div');
      bannerEl.className = 'cg-banner';
      bannerEl.setAttribute('role', 'alertdialog');
      bannerEl.setAttribute('aria-live', 'assertive');
      bannerEl.setAttribute('aria-label', 'Session about to expire');
      bannerEl.innerHTML =
        '<div class="cg-ur">کافی دیر سے کوئی سرگرمی نہیں ہوئی۔ حفاظت کے لیے <span class="cg-time" data-cg-time></span> میں آپ خود بخود لاگ آؤٹ ہو جائیں گے۔</div>' +
        '<div class="cg-en">No activity for a while. For your protection you will be signed out automatically in <span class="cg-time" data-cg-time2></span>.</div>' +
        '<div class="cg-row"><button type="button" class="cg-btn" data-cg-stay>لاگ اِن رکھیں / Stay signed in</button>' +
        '<button type="button" class="cg-btn cg-alt" data-cg-out>ابھی لاگ آؤٹ / Sign out now</button></div>';
      document.body.appendChild(bannerEl);
      bannerEl.querySelector('[data-cg-stay]').addEventListener('click', function () { touch(true); hideBanner(); });
      bannerEl.querySelector('[data-cg-out]').addEventListener('click', function () { signOutIdle(); });
      try { bannerEl.querySelector('[data-cg-stay]').focus(); } catch (e) {}
    }
    var txt = Math.floor(secsLeft / 60) + ':' + pad2(secsLeft % 60);
    var a = bannerEl.querySelector('[data-cg-time]'), b = bannerEl.querySelector('[data-cg-time2]');
    if (a) { a.textContent = txt; }
    if (b) { b.textContent = txt; }
  }
  function hideBanner() {
    if (bannerEl && bannerEl.parentNode) { bannerEl.parentNode.removeChild(bannerEl); }
    bannerEl = null;
  }
  function tick() {
    applyMaint();
    if (!user) { hideBanner(); return; }
    var limit = idleFor(user.uid);
    var idle = Date.now() - getLast();
    if (idle >= limit) { signOutIdle(); return; }
    if (idle >= limit - WARN_MS) { showBanner(Math.max(0, Math.ceil((limit - idle) / 1000))); }
    else { hideBanner(); }
  }

  /* ------------------------------------------------------- approval gate */
  function setInert(on) {
    try { if (on) { document.body.setAttribute('inert', ''); } else { document.body.removeAttribute('inert'); } } catch (e) {}
  }
  function unblock() {
    if (blockEl && blockEl.parentNode) { blockEl.parentNode.removeChild(blockEl); }
    blockEl = null; setInert(!!maintEl);
  }
  function block(kind) {
    addStyle();
    unblock();
    var titleUr, titleEn, bodyUr, bodyEn;
    if (kind === 'error') {
      titleUr = 'جانچ مکمل نہیں ہو سکی'; titleEn = 'Could not verify your account';
      bodyUr = 'آپ کے اکاؤنٹ کی حالت معلوم نہیں ہو سکی۔ انٹرنیٹ چیک کریں اور صفحہ دوبارہ کھولیں۔';
      bodyEn = 'We could not check your account status. Check your connection and reload the page.';
    } else {
      titleUr = 'رسائی منظور نہیں'; titleEn = 'Access not approved';
      bodyUr = 'آپ کا اکاؤنٹ اس وقت منظور شدہ اور فعال نہیں ہے۔ براہ کرم اپنے دفتر کے ایڈمن سے رابطہ کریں۔';
      bodyEn = 'Your account is not approved and active right now. Please contact your office administrator.';
    }
    blockEl = document.createElement('div');
    blockEl.className = 'cg-block';
    blockEl.setAttribute('role', 'alertdialog');
    blockEl.setAttribute('aria-modal', 'true');
    blockEl.innerHTML =
      '<div class="cg-card"><h2>' + titleUr + ' / ' + titleEn + '</h2>' +
      '<div class="cg-ur">' + bodyUr + '</div><div class="cg-en">' + bodyEn + '</div>' +
      '<div class="cg-row"><a class="cg-btn" href="' + PORTAL_URL + '">پورٹل پر جائیں / Go to portal</a>' +
      '<button type="button" class="cg-btn cg-alt" data-cg-out>لاگ آؤٹ / Sign out</button></div></div>';
    /* appended to <html>, outside <body>, so that making <body> inert does not disable it */
    document.documentElement.appendChild(blockEl);
    setInert(true);
    blockEl.querySelector('[data-cg-out]').addEventListener('click', function () {
      if (auth) { auth.signOut().then(function () { location.href = PORTAL_URL; }); }
    });
  }
  function applyWriteRole(role) {
    var allowed = window.CAMP_WRITE_ROLES;
    if (!allowed || !allowed.length) { return; }
    var ok = allowed.indexOf(role) !== -1;
    document.documentElement.classList.toggle('camp-readonly', !ok);
    if (ok) {
      if (roBannerEl && roBannerEl.parentNode) { roBannerEl.parentNode.removeChild(roBannerEl); }
      roBannerEl = null; return;
    }
    if (roBannerEl) { return; }
    addStyle();
    roBannerEl = document.createElement('div');
    roBannerEl.className = 'cg-ro';
    roBannerEl.setAttribute('role', 'status');
    roBannerEl.innerHTML = '<span class="cg-ur">آپ کو اس صفحے پر صرف دیکھنے کی اجازت ہے؛ تبدیلی صرف ایڈمن کر سکتا ہے۔</span> · ' +
      '<span>View-only for your role: only an administrator can save changes here.</span>';
    document.body.appendChild(roBannerEl);
  }
  function checkApproved(u) {
    if (!window.CAMP_REQUIRE_APPROVED || !db) { return; }
    db.collection('users').doc(u.uid).get().then(function (snap) {
      var x = snap.exists ? snap.data() : null;
      var ok = !!x && x.approvalStatus === 'approved' && x.isActive !== false;
      window.CAMP_ROLE = x ? (x.roleV2 || 'viewer') : null;
      if (!ok) { block('denied'); return; }
      unblock();
      applyWriteRole(window.CAMP_ROLE);
    }).catch(function () { block('error'); });
  }

  /* ------------------------------------------------- Super Admin sign-in code */
  function onPortalPage() {
    var p = location.pathname;
    return p === PORTAL_URL || p === PORTAL_URL + 'index.html' || p === '/' || p === '/index.html';
  }
  function checkOtp(u) {
    if (onPortalPage()) { return; }
    u.getIdTokenResult().then(function (res) {
      var key = u.uid + ':' + (res.claims && res.claims.auth_time);
      try { if (sessionStorage.getItem('campOtpOk') === key) { return; } } catch (e) {}
      return fetch(FN_STATUS, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + res.token }, body: '{}' })
        .then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j || {} }; }); })
        .then(function (r) {
          if (r.s !== 200) { return; }                       /* server unreachable / not deployed yet: leave the page alone */
          if (r.j.isSuper) { markSuper(u.uid); } else { unmarkSuper(u.uid); }
          if (r.j.required && !r.j.verified) { location.href = PORTAL_URL; return; }
          if (!r.j.isSuper || r.j.verified) { try { sessionStorage.setItem('campOtpOk', key); } catch (e) {} }
        });
    }).catch(function () { /* ignore: never block a page because this extra check could not run */ });
  }

  /* ------------------------------------------------------ Maintenance switch */
  var maintEl = null, maintBar = null, maintUid = null, maintUnsub = null, maintDoc = null, maintIsSuper = null;
  function maintClosedNow() {
    var d = maintDoc;
    if (!d || d.closed !== true) { return false; }
    var r = Number(d.reopenAtMs) || 0;
    return !(r > 0 && Date.now() >= r);
  }
  function fmtKarachi(ms) {
    try {
      return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(ms)).replace(',', '');
    } catch (e) { return new Date(ms).toString(); }
  }
  function mkEl(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (text != null) { e.textContent = text; }
    return e;
  }
  function hideMaint() {
    if (maintEl && maintEl.parentNode) { maintEl.parentNode.removeChild(maintEl); }
    maintEl = null;
    setInert(!!blockEl);
  }
  function showMaint() {
    addStyle();
    var d = maintDoc || {};
    var r = Number(d.reopenAtMs) || 0;
    var msg = typeof d.message === 'string' ? d.message.trim() : '';
    var sig = (msg || '') + '|' + r;
    if (maintEl && maintEl.getAttribute('data-sig') === sig) { return; }   /* already showing the same notice */
    if (maintEl && maintEl.parentNode) { maintEl.parentNode.removeChild(maintEl); }
    maintEl = mkEl('div', 'cg-block');
    maintEl.setAttribute('data-sig', sig);
    maintEl.setAttribute('role', 'alertdialog');
    maintEl.setAttribute('aria-modal', 'true');
    maintEl.style.zIndex = '2147483647';
    var card = mkEl('div', 'cg-card');
    card.appendChild(mkEl('h2', null, 'پورٹل عارضی طور پر بند ہے / The portal is temporarily closed'));
    var ur = mkEl('div', 'cg-ur', msg || 'پورٹل اس وقت بند ہے۔ براہ کرم بعد میں دوبارہ کوشش کریں۔');
    card.appendChild(ur);
    if (!msg) { card.appendChild(mkEl('div', 'cg-en', 'The portal is closed at the moment. Please try again later.')); }
    var when = mkEl('div', 'cg-ur');
    when.style.marginTop = '8px';
    if (r > 0) {
      when.appendChild(document.createTextNode('کھلنے کا وقت / Reopens at: '));
      when.appendChild(mkEl('span', 'cg-time', fmtKarachi(r)));
    } else {
      when.appendChild(document.createTextNode('کھلنے کا وقت ابھی طے نہیں / Reopening time not announced yet'));
    }
    card.appendChild(when);
    var row = mkEl('div', 'cg-row');
    var again = mkEl('button', 'cg-btn', 'دوبارہ دیکھیں / Check again');
    again.type = 'button';
    again.addEventListener('click', function () { try { location.reload(); } catch (e) {} });
    var out = mkEl('button', 'cg-btn cg-alt', 'لاگ آؤٹ / Sign out');
    out.type = 'button';
    out.addEventListener('click', function () { if (auth) { auth.signOut().then(function () { location.href = PORTAL_URL; }); } });
    row.appendChild(again); row.appendChild(out);
    card.appendChild(row);
    maintEl.appendChild(card);
    document.documentElement.appendChild(maintEl);   /* outside <body>, so making <body> inert does not disable it */
    setInert(true);
    try { again.focus(); } catch (e) {}
  }
  /* Super Admin: a thin red strip while the portal is closed, so it is never forgotten */
  function superStrip(on) {
    if (!on) {
      if (maintBar && maintBar.parentNode) { maintBar.parentNode.removeChild(maintBar); }
      maintBar = null; return;
    }
    if (maintBar) { return; }
    addStyle();
    maintBar = mkEl('a', 'cg-ro');
    maintBar.href = PORTAL_URL + 'maintenance.html';
    maintBar.style.cssText = 'top:auto;bottom:0;background:#b3261e;color:#fff;border-bottom:0;border-top:2px solid #7d1a15;text-decoration:none;display:block;font-weight:700;padding:5px 10px;font-size:12.5px;line-height:1.5';
    maintBar.textContent = '🔒 پورٹل دوسروں کے لیے بند ہے — منظم کریں / Closed for everyone else — manage';
    document.body.appendChild(maintBar);
  }
  function applyMaint() {
    if (!user || maintIsSuper === null) { hideMaint(); superStrip(false); return; }
    var closed = maintClosedNow();
    if (maintIsSuper) { hideMaint(); superStrip(closed); return; }
    superStrip(false);
    if (closed) { showMaint(); } else { hideMaint(); }
  }
  /* is this signed-in user the Super Admin?  profile first; the sign-in-code endpoint as a fallback */
  function findSuper(u) {
    function viaServer() {
      return u.getIdToken().then(function (tok) {
        return fetch(FN_STATUS, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tok }, body: '{}' })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (j) { return !!(j && j.isSuper); });
      }).catch(function () { return false; });
    }
    if (!db) { return Promise.resolve(false); }
    return db.collection('users').doc(u.uid).get().then(function (snap) {
      var x = snap.exists ? snap.data() : null;
      return !!x && x.roleV2 === 'super_admin';
    }).catch(function () { return viaServer(); });
  }
  function addMaintLink() {
    /* Super Admin only: a "Maintenance" entry in the sidebar footer of every portal page that has one */
    if (!maintIsSuper) { return; }
    var foot = document.querySelector('.sidebar-foot');
    if (!foot || foot.querySelector('[data-cg-maint]')) { return; }
    var a = document.createElement('a');
    a.href = PORTAL_URL + 'maintenance.html';
    a.setAttribute('data-cg-maint', '1');
    var ico = mkEl('span', 'ico', '🔒');
    var lab = mkEl('span', 'label', 'Maintenance');
    a.appendChild(ico); a.appendChild(lab);
    foot.insertBefore(a, foot.firstChild);
  }
  function stopMaint() {
    if (maintUnsub) { try { maintUnsub(); } catch (e) {} }
    maintUnsub = null; maintUid = null; maintDoc = null; maintIsSuper = null;
    hideMaint(); superStrip(false);
  }
  function startMaint(u) {
    if (!db || !u || maintUid === u.uid) { return; }
    stopMaint();
    maintUid = u.uid;
    var myUid = u.uid;
    findSuper(u).then(function (isSup) {
      if (maintUid !== myUid) { return; }
      maintIsSuper = !!isSup;
      if (isSup) { markSuper(myUid); addMaintLink(); setTimeout(addMaintLink, 1500); }
      applyMaint();
    });
    try {
      maintUnsub = db.collection('appConfig').doc('maintenance').onSnapshot(function (snap) {
        maintDoc = snap.exists ? (snap.data() || null) : null;
        applyMaint();
      }, function () { /* cannot read the switch: leave the page alone (never lock people out by mistake) */ });
    } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------------------ wire */
  function bind() {
    addStyle();
    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel', 'click'].forEach(function (ev) {
      document.addEventListener(ev, function () { touch(false); }, { capture: true, passive: true });
    });
    window.addEventListener('scroll', function () { touch(false); }, { capture: true, passive: true });
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('focus', tick);
    if (!getLast()) { touch(true); }               /* first ever run: start the clock, do not sign anybody out */
    auth.onAuthStateChanged(function (u) {
      user = u || null;
      if (!user) { hideBanner(); unblock(); stopMaint(); return; }
      var ls = 0;
      try { ls = user.metadata && user.metadata.lastSignInTime ? Date.parse(user.metadata.lastSignInTime) : 0; } catch (e) {}
      var now = Date.now(), seen = firstAuthSeen;
      firstAuthSeen = true;
      if (ls && now - ls < 2 * 60 * 1000) { touch(true); }          /* a sign-in that just happened counts as activity */
      else if (!seen) {
        /* a login the browser restored: judge it by the stamp from BEFORE this page opened, never by what happened since */
        var limit = idleFor(user.uid);
        var tooOld = !!ls && now - ls > MAX_SESSION_MS;
        var staleIdle = INITIAL_LAST > 0 ? (now - INITIAL_LAST >= limit) : (!!ls && now - ls >= limit);
        if (tooOld || staleIdle) { signOutIdle(); return; }
      }
      tick();                                       /* a stale restored session is signed out at once */
      if (auth.currentUser) { checkApproved(user); checkOtp(user); startMaint(user); }
    });
    if (timer) { clearInterval(timer); }
    timer = setInterval(tick, TICK_MS);
  }
  function init(tries) {
    if (window.firebase && firebase.apps && firebase.apps.length && firebase.auth) {
      auth = firebase.auth();
      db = firebase.firestore ? firebase.firestore() : null;
      bind();
      return;
    }
    if (tries > 60) { return; }
    setTimeout(function () { init(tries + 1); }, 250);
  }

  window.CampGuard = {
    idleMs: IDLE_MS,
    touch: function () { touch(true); },
    signOut: signOutIdle,
    markSuper: markSuper,
    unmarkSuper: unmarkSuper,
    maintenanceClosed: function () { return maintClosedNow(); },
    lastIdleLogout: function () {
      try { return parseInt(localStorage.getItem(KEY_IDLE_OUT), 10) || 0; } catch (e) { return 0; }
    },
    clearIdleLogout: function () { try { localStorage.removeItem(KEY_IDLE_OUT); } catch (e) {} }
  };

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', function () { init(0); }); }
  else { init(0); }
})();
