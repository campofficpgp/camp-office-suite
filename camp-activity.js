/* camp-activity.js — records who signed in / signed out of the Camp Office portal (for the Super Admin's "Activity Log" page).
   Only a short, fixed set of facts is written to the Firestore collection `activityLog`:
   who (uid, e-mail, name, role), what (login / logout), when (server time), from what (browser · system · phone or computer), on which page.
   No passwords, no IP address, no page content. The rules let every approved user ADD a record about themselves only;
   nobody can change or delete a record; only the Super Admin can read them. A record is meant to be shown for 90 days (expireAt).
   Writing the log must never stop the portal: every call swallows its own errors. */
(function () {
  var KEEP_DAYS = 90;

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

  function write(db, user, data, type) {
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
      return db.collection('activityLog').add(rec).then(function () { return true; }, function (err) {
        try { console.warn('activity log not written', err && err.code); } catch (e) {}
        return false;
      });
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

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
      write(db, user, data, 'logout').then(function () { clearTimeout(t); go(); });
    } catch (e) {
      go();
    }
  }

  window.CampActivity = { KEEP_DAYS: KEEP_DAYS, device: device, write: write, loginIfNew: loginIfNew, logoutThenSignOut: logoutThenSignOut };
})();
