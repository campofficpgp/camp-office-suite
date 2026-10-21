/* camp-activity.js (v2) — the Camp Office portal's "Activity Log" recorder (read by the Super Admin in activity-log.html).
   WHAT IS RECORDED (short facts only, in the Firestore collection `activityLog`):
     login / logout  — who signed in or out (index page),
     visit           — which page a signed-in user opened (at most once per page per 20 minutes),
     data            — who ADDED / SAVED / EDITED / DELETED something (which collection, which record, which fields changed, how many).
   For every line: who (uid, e-mail, name, role), when (server time), from what (browser · system · phone or computer), on which page.
   NEVER recorded: passwords, IP address, the contents of a record, chat messages, "online" presence.
   The rules let every approved user ADD a line about himself only; nobody can change or delete a line; only the Super Admin can read them.
   Each line is meant to be kept 90 days (expireAt).
   This file only WATCHES the portal's own saves: it does not change what is saved. Writing the log must never stop the portal —
   every function here swallows its own errors, and the original save is always executed first, exactly as before. */
(function () {
  var KEEP_DAYS = 90;
  var VISIT_GAP_MS = 20 * 60 * 1000;      /* same page again within 20 minutes is not a new visit */
  var FLUSH_MS = 3000;                    /* saves done within 3 seconds are grouped into one line */
  var MAX_LINES = 300;                    /* safety stop per opened page */
  var SKIP = { activityLog: 1, chatMessages: 1, presence: 1, profileClaims: 1, accountRequests: 1 };
  var LABEL_PRIVATE = { employees: 1 };   /* employee records: log only the name, never other fields */

  function device() {
    var ua = '';
    try { ua = navigator.userAgent || ''; } catch (e) { return ''; }
    var br = 'Browser';
    if (/Edg\//.test(ua)) { br = 'Edge'; }
    else if (/OPR\/|Opera/.test(ua)) { br = 'Opera'; }
    else if (/Firefox\//.test(ua)) { br = 'Firefox'; }
    else if (/Chrome\//.test(ua) || /CriOS\//.test(ua)) { br = 'Chrome'; }
    else if (/Safari\//.test(ua)) { br = 'Safari'; }
    var os = 'Unknown system';
    if (/Windows/.test(ua)) { os = 'Windows'; }
    else if (/Android/.test(ua)) { os = 'Android'; }
    else if (/iPhone|iPad|iPod/.test(ua)) { os = 'iOS'; }
    else if (/Mac OS X|Macintosh/.test(ua)) { os = 'macOS'; }
    else if (/Linux|X11/.test(ua)) { os = 'Linux'; }
    var form = /Mobi|Android|iPhone|iPod/.test(ua) ? 'Phone' : (/iPad|Tablet/.test(ua) ? 'Tablet' : 'Computer');
    return (br + ' · ' + os + ' · ' + form).slice(0, 100);
  }
  function pageName() {
    try {
      var p = String(location.pathname || '').split('/').pop() || 'index.html';
      return p.slice(0, 40);
    } catch (e) { return ''; }
  }
  function nameOf(data) {
    data = data || {};
    return String(data.name || data.fullName || data.displayName || '').slice(0, 80);
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function defaultDb() { try { return firebase.app().firestore(); } catch (e) { return null; } }
  function cut(s, n) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, n); }

  /* ---------- a profile (name, role) of the signed-in user, kept for the browser session so it costs one read at most ---------- */
  var PROFILE = {};   /* uid -> {n, r} */
  function rememberProfile(uid, data) {
    try {
      if (!uid || !data) { return; }
      var p = { n: nameOf(data), r: String(data.roleV2 || '').slice(0, 20) };
      PROFILE[uid] = p;
      ssSet('campActProf_' + uid, JSON.stringify(p));
    } catch (e) {}
  }
  function getProfile(user) {
    try {
      if (PROFILE[user.uid]) { return Promise.resolve(PROFILE[user.uid]); }
      var raw = ssGet('campActProf_' + user.uid);
      if (raw) { var p = JSON.parse(raw); if (p && typeof p === 'object') { PROFILE[user.uid] = p; return Promise.resolve(p); } }
      var db = defaultDb();
      if (!db) { return Promise.resolve({ n: '', r: '' }); }
      return db.collection('users').doc(user.uid).get().then(function (s) {
        var d = (s && s.exists && s.data()) || {};
        rememberProfile(user.uid, d);
        return PROFILE[user.uid] || { n: '', r: '' };
      }, function () { return { n: '', r: '' }; });
    } catch (e) { return Promise.resolve({ n: '', r: '' }); }
  }

  /* ---------- the single place where a line is written ---------- */
  function write(db, user, data, type, extra) {
    try {
      if (!db || !user || !user.uid || !user.email) { return Promise.resolve(false); }
      var rec = {
        uid: user.uid,
        email: String(user.email).slice(0, 120),
        name: nameOf(data),
        role: String((data && data.roleV2) || '').slice(0, 20),
        type: type,
        at: firebase.firestore.FieldValue.serverTimestamp(),
        expireAt: new Date(Date.now() + KEEP_DAYS * 86400000),
        device: device(),
        page: pageName()
      };
      if (data && data.roleV2) { rememberProfile(user.uid, data); }
      if (extra) { for (var k in extra) { if (Object.prototype.hasOwnProperty.call(extra, k)) { rec[k] = extra[k]; } } }
      return db.collection('activityLog').add(rec).then(function () { return true; }, function (err) {
        try { console.warn('activity log not written', err && err.code); } catch (e) {}
        return false;
      });
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  /* A real new sign-in has a new "last sign-in time" on the account. A page that merely reopens an existing session
     has the same time as before, and is NOT recorded again. */
  function loginIfNew(db, user, data) {
    try {
      var stamp = (user && user.metadata && (user.metadata.lastSignInTime || user.metadata.creationTime)) || '';
      if (!stamp) { return Promise.resolve(false); }
      var key = 'campLoginLogged_' + user.uid;
      if (lsGet(key) === stamp) { return Promise.resolve(false); }
      return write(db, user, data, 'login').then(function (ok) {
        if (ok) { lsSet(key, stamp); }
        return ok;
      });
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  /* Record the sign-out first (while the user is still signed in), then sign out. Never waits longer than 1.5 s. */
  function logoutThenSignOut(db, auth, user, data) {
    var done = false;
    function go() { if (done) { return; } done = true; try { auth.signOut(); } catch (e) {} }
    try {
      var t = setTimeout(go, 1500);
      flush();
      write(db, user, data, 'logout').then(function () { clearTimeout(t); go(); });
    } catch (e) {
      go();
    }
  }

  /* ---------- describing a save: which record, which fields ---------- */
  function labelOf(d) {
    try {
      if (!d || typeof d !== 'object') { return ''; }
      var s = '';
      if (d.caseNo) {
        s = cut([d.type || d.caseType || '', d.caseNo].join(' '), 40);
        if (d.year) { s += '/' + cut(d.year, 6); }
        var t = d.title || d.caseTitle;
        if (t) { s += ' — ' + cut(t, 60); }
        return cut(s, 120);
      }
      var keys = ['title', 'caseTitle', 'name', 'fullName', 'diaryNo', 'fileName', 'subject', 'label', 'listName', 'key'];
      for (var i = 0; i < keys.length; i++) {
        var v = d[keys[i]];
        if (typeof v === 'string' && v) { return cut((keys[i] === 'diaryNo' ? 'Diary ' : '') + v, 120); }
        if (typeof v === 'number') { return cut(keys[i] + ' ' + v, 120); }
      }
    } catch (e) {}
    return '';
  }
  var NOTE_VALUES = { roleV2: 1, officer: 1, approvalStatus: 1, isActive: 1 };   /* short settings of a user that are worth showing with their value */
  function fieldsOf(target, data, args) {
    try {
      var keys = [];
      if (args && typeof args[0] === 'string') {            /* update('field', value, 'field2', value2 …) */
        for (var i = 0; i < args.length; i += 2) { if (typeof args[i] === 'string') { keys.push(args[i]); } }
        data = {};
        for (var j = 0; j < args.length; j += 2) { if (typeof args[j] === 'string') { data[args[j]] = args[j + 1]; } }
      } else if (data && typeof data === 'object') {
        keys = Object.keys(data);
      }
      if (!keys.length) { return ''; }
      var shown = keys.slice(0, 25).map(function (k) {
        var v = data[k];
        if (target === 'users' && NOTE_VALUES[k] && (typeof v === 'string' || typeof v === 'boolean')) { return k + '=' + cut(v, 30); }
        return k;
      });
      return cut(shown.join(', '), 200);
    } catch (e) { return ''; }
  }
  function refParts(ref) {
    try {
      var p = String((ref && ref.path) || '');
      var segs = p.split('/').filter(Boolean);
      if (!segs.length) { return null; }
      return { top: segs[0], target: cut(segs.slice(0, -1).join('/'), 60), id: cut(segs[segs.length - 1], 120) };
    } catch (e) { return null; }
  }

  /* ---------- the queue: saves are grouped (same collection + same kind within 3 s = one line with a count) ---------- */
  var QUEUE = [];
  var timer = null;
  var written = 0;

  function enqueue(item) {
    try {
      if (!item || !item.target || SKIP[item.top]) { return; }
      QUEUE.push(item);
      if (!timer) { timer = setTimeout(flush, FLUSH_MS); }
    } catch (e) {}
  }
  function currentUser() {
    try { return firebase.auth().currentUser || null; } catch (e) { return null; }
  }
  function flush() {
    try {
      if (timer) { clearTimeout(timer); timer = null; }
      if (!QUEUE.length) { return; }
      var items = QUEUE; QUEUE = [];
      var user = currentUser();
      var db = defaultDb();
      if (!user || !db) { return; }
      var groups = [], index = {};
      items.forEach(function (it) {
        var k = it.target + '|' + it.op;
        var g = index[k];
        if (!g) { g = index[k] = { target: it.target, op: it.op, docId: it.docId, label: '', labels: [], fields: [], count: 0 }; groups.push(g); }
        g.count++;
        if (it.label) { g.labels.push(it.label); }
        if (it.fields) { it.fields.split(', ').forEach(function (f) { if (f && g.fields.indexOf(f) < 0 && g.fields.length < 25) { g.fields.push(f); } }); }
      });
      getProfile(user).then(function (prof) {
        groups.forEach(function (g) {
          if (written >= MAX_LINES) { return; }
          written++;
          var extra = { target: g.target, op: g.op, docId: g.docId, count: g.count };
          if (g.labels.length) { extra.label = cut(g.labels[0], 120); }
          if (g.fields.length) { extra.fields = cut(g.fields.join(', '), 200); }
          if (g.count > 1 && g.labels.length > 1) { extra.detail = cut(g.labels.slice(1, 6).join(' | '), 200); }
          write(db, user, { name: prof.n, roleV2: prof.r }, 'data', extra);
        });
      });
    } catch (e) {}
  }
  function describe(ref, op, data, args, labelNow) {
    var rp = refParts(ref);
    if (!rp) { return null; }
    var it = { top: rp.top, target: rp.target, op: op, docId: rp.id, label: labelNow || '', fields: '' };
    if (op !== 'delete') {
      if (!it.label && !LABEL_PRIVATE[rp.top]) { it.label = labelOf(data); }
      if (LABEL_PRIVATE[rp.top] && data && typeof data.name === 'string') { it.label = cut(data.name, 120); }
      it.fields = fieldsOf(rp.top, data, args);
    }
    return it;
  }
  /* when the save itself did not carry a readable name (a partial update), read it from the local copy after the save */
  function finishLabel(ref, it, cb) {
    try {
      if (it.label || it.op === 'delete' || typeof ref.get !== 'function') { cb(it); return; }
      var done = false;
      var t = setTimeout(function () { if (!done) { done = true; cb(it); } }, 400);
      ref.get({ source: 'cache' }).then(function (s) {
        if (done) { return; }
        done = true; clearTimeout(t);
        try { var d = s && s.exists && s.data(); if (d) { it.label = LABEL_PRIVATE[it.top] ? cut(d.name, 120) : labelOf(d); } } catch (e) {}
        cb(it);
      }, function () { if (!done) { done = true; clearTimeout(t); cb(it); } });
    } catch (e) { cb(it); }
  }
  function preDeleteLabel(ref) {
    try {
      var rp = refParts(ref);
      if (!rp || SKIP[rp.top] || typeof ref.get !== 'function') { return Promise.resolve(''); }
      return ref.get({ source: 'cache' }).then(function (s) {
        try { var d = s && s.exists && s.data(); return d ? (LABEL_PRIVATE[rp.top] ? cut(d.name, 120) : labelOf(d)) : ''; } catch (e) { return ''; }
      }, function () { return ''; });
    } catch (e) { return Promise.resolve(''); }
  }

  /* ---------- watching Firestore saves (compat SDK) ---------- */
  function wrap(proto, name, make) {
    try {
      if (!proto || typeof proto[name] !== 'function' || proto[name].__campAct) { return false; }
      var orig = proto[name];
      var w = make(orig);
      w.__campAct = true;
      proto[name] = w;
      return true;
    } catch (e) { return false; }
  }
  function afterOk(p, fn) {
    try { if (p && typeof p.then === 'function') { p.then(function (v) { try { fn(v); } catch (e) {} }, function () {}); } } catch (e) {}
  }
  function opOfSet(args) {      /* set(data, {merge:true}) is an edit; plain set is a save */
    var o = args[1];
    return (o && (o.merge || o.mergeFields)) ? 'edit' : 'set';
  }

  /* several saves in one batch */
  function wrapBatchProto(BP) {
        wrap(BP, 'set', function (orig) {
          return function (ref, data) {
            try { var it = describe(ref, opOfSet(arguments.length > 1 ? [data, arguments[2]] : []), data, null, ''); if (it) { (this.__campOps || (this.__campOps = [])).push(it); } } catch (e) {}
            return orig.apply(this, arguments);
          };
        });
        wrap(BP, 'update', function (orig) {
          return function (ref, a) {
            try {
              var rest = Array.prototype.slice.call(arguments, 1);
              var it = describe(ref, 'edit', typeof a === 'object' ? a : null, typeof a === 'string' ? rest : null, '');
              if (it) { (this.__campOps || (this.__campOps = [])).push(it); }
            } catch (e) {}
            return orig.apply(this, arguments);
          };
        });
        wrap(BP, 'delete', function (orig) {
          return function (ref) {
            try {
              var it = describe(ref, 'delete', null, null, '');
              if (it) { it.pre = preDeleteLabel(ref); (this.__campOps || (this.__campOps = [])).push(it); }
            } catch (e) {}
            return orig.apply(this, arguments);
          };
        });
        wrap(BP, 'commit', function (orig) {
          return function () {
            var self = this;
            var ops = self.__campOps || [];
            var p = orig.apply(this, arguments);
            afterOk(p, function () { ops.forEach(function (it) { settle(it); }); });
            return p;
          };
        });
  }

  function wrapRunTx(FP) {
        wrap(FP, 'runTransaction', function (orig) {
          return function (fn) {
            var last = null;
            var p;
            if (typeof fn !== 'function') { return orig.apply(this, arguments); }
            p = orig.call(this, function (tx) {
              try { last = tx; if (tx) { tx.__campOps = []; } } catch (e) {}
              return fn.apply(this, arguments);
            });
            afterOk(p, function () { var ops = (last && last.__campOps) || []; ops.forEach(function (it) { settle(it); }); });
            return p;
          };
        });
  }

  var installed = false;
  function install() {
    try {
      if (installed) { return true; }
      var F = window.firebase && firebase.firestore;
      if (!F || !F.DocumentReference || !F.CollectionReference) { return false; }

      /* single document: set / update / delete */
      wrap(F.DocumentReference.prototype, 'set', function (orig) {
        return function () {
          var args = arguments, self = this;
          var p = orig.apply(this, args);
          try {
            var it = describe(self, opOfSet(args), args[0], null, '');
            if (it) { afterOk(p, function () { finishLabel(self, it, enqueue); }); }
          } catch (e) {}
          return p;
        };
      });
      wrap(F.DocumentReference.prototype, 'update', function (orig) {
        return function () {
          var args = arguments, self = this;
          var p = orig.apply(this, args);
          try {
            var it = describe(self, 'edit', typeof args[0] === 'object' ? args[0] : null, typeof args[0] === 'string' ? args : null, '');
            if (it) { afterOk(p, function () { finishLabel(self, it, enqueue); }); }
          } catch (e) {}
          return p;
        };
      });
      wrap(F.DocumentReference.prototype, 'delete', function (orig) {
        return function () {
          var self = this, pre = null;
          try { pre = preDeleteLabel(self); } catch (e) {}
          var p = orig.apply(this, arguments);
          try {
            afterOk(p, function () {
              var go = function (lab) { var it = describe(self, 'delete', null, null, lab || ''); if (it) { enqueue(it); } };
              if (pre) { pre.then(go, function () { go(''); }); } else { go(''); }
            });
          } catch (e) {}
          return p;
        };
      });
      /* a new document with an automatic id */
      wrap(F.CollectionReference.prototype, 'add', function (orig) {
        return function (data) {
          var self = this;
          var p = orig.apply(this, arguments);
          try {
            afterOk(p, function (ref) {
              var cp = String(self.path || '').split('/').filter(Boolean);
              if (!cp.length) { return; }
              var it = { top: cp[0], target: cut(cp.join('/'), 60), op: 'add', docId: cut((ref && ref.id) || '', 120), label: '', fields: '' };
              if (LABEL_PRIVATE[cp[0]]) { it.label = (data && typeof data.name === 'string') ? cut(data.name, 120) : ''; } else { it.label = labelOf(data); }
              enqueue(it);
            });
          } catch (e) {}
          return p;
        };
      });

      if (F.WriteBatch) { wrapBatchProto(F.WriteBatch.prototype); }

      /* a transaction: the saves of its last (successful) attempt are recorded when it finishes */
      if (F.Transaction) {
        var TP = F.Transaction.prototype;
        wrap(TP, 'set', function (orig) {
          return function (ref, data) {
            try { var it = describe(ref, opOfSet(arguments.length > 1 ? [data, arguments[2]] : []), data, null, ''); if (it) { (this.__campOps || (this.__campOps = [])).push(it); } } catch (e) {}
            return orig.apply(this, arguments);
          };
        });
        wrap(TP, 'update', function (orig) {
          return function (ref, a) {
            try {
              var rest = Array.prototype.slice.call(arguments, 1);
              var it = describe(ref, 'edit', typeof a === 'object' ? a : null, typeof a === 'string' ? rest : null, '');
              if (it) { (this.__campOps || (this.__campOps = [])).push(it); }
            } catch (e) {}
            return orig.apply(this, arguments);
          };
        });
        wrap(TP, 'delete', function (orig) {
          return function (ref) {
            try {
              var it = describe(ref, 'delete', null, null, '');
              if (it) { it.pre = preDeleteLabel(ref); (this.__campOps || (this.__campOps = [])).push(it); }
            } catch (e) {}
            return orig.apply(this, arguments);
          };
        });
      }
      if (F.Firestore) { wrapRunTx(F.Firestore.prototype); }
      installed = true;
      return true;
    } catch (e) { return false; }
  }
  /* an item collected in a batch / transaction: finish its delete-label, then queue it */
  function settle(it) {
    try {
      if (it.pre && typeof it.pre.then === 'function') {
        it.pre.then(function (lab) { it.label = lab || ''; enqueue(it); }, function () { enqueue(it); });
      } else { enqueue(it); }
    } catch (e) {}
  }

  /* if this build of the SDK does not expose the Firestore / WriteBatch classes by name, take them from a live instance once the page has started */
  function lateInstall() {
    try {
      if (!window.firebase || !firebase.apps || !firebase.apps.length) { return; }
      var F = firebase.firestore;
      var db = defaultDb();
      if (!db) { return; }
      if (!F.Firestore) { var fp = Object.getPrototypeOf(db); if (fp && typeof fp.runTransaction === 'function') { wrapRunTx(fp); } }
      if (!F.WriteBatch && typeof db.batch === 'function') { var bp = Object.getPrototypeOf(db.batch()); if (bp) { wrapBatchProto(bp); } }
    } catch (e) {}
  }

  /* ---------- page visits ---------- */
  var visitWatching = false;
  function logVisit(user) {
    try {
      if (!user || !user.uid || !user.email) { return; }
      var page = pageName();
      var key = 'campVisit_' + user.uid + '_' + page;
      var last = parseInt(lsGet(key) || '0', 10) || 0;
      if (Date.now() - last < VISIT_GAP_MS) { return; }
      lsSet(key, String(Date.now()));
      var db = defaultDb();
      if (!db) { return; }
      getProfile(user).then(function (prof) { write(db, user, { name: prof.n, roleV2: prof.r }, 'visit'); });
    } catch (e) {}
  }
  function watchVisits() {
    try {
      if (visitWatching) { return; }
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        try {
          if (window.firebase && firebase.apps && firebase.apps.length && firebase.auth) {
            clearInterval(iv);
            visitWatching = true;
            setTimeout(lateInstall, 500);
            firebase.auth().onAuthStateChanged(function (u) { if (u) { setTimeout(function () { logVisit(u); }, 1500); } });
          }
        } catch (e) {}
        if (tries > 60) { clearInterval(iv); }
      }, 500);
    } catch (e) {}
  }

  /* ---------- start ---------- */
  try {
    if (!window.__campActivityStarted) {
      window.__campActivityStarted = true;
      if (!install()) {
        var again = 0;
        var ti = setInterval(function () { again++; if (install() || again > 40) { clearInterval(ti); } }, 250);
      }
      try { window.addEventListener('pagehide', flush); } catch (e) {}
      try { document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') { flush(); } }); } catch (e) {}
      if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', function () { setTimeout(watchVisits, 1000); }); }
      else { setTimeout(watchVisits, 1000); }
    }
  } catch (e) {}

  window.CampActivity = { KEEP_DAYS: KEEP_DAYS, device: device, write: write, loginIfNew: loginIfNew, logoutThenSignOut: logoutThenSignOut, flush: flush, _install: install };
})();
