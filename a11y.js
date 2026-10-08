/*!
 * Camp Office — shared accessibility helper (a11y.js)
 * One file, loaded by every page with:  <script src="a11y.js" defer></script>
 *
 * 1. "Accessibility / رسائی" button (bottom corner) with: text size, high contrast,
 *    underline links, easy-to-read font, more spacing, stop animation, reset.
 *    The choices are remembered in this browser and apply on every page of the portal.
 * 2. Quiet fixes that never change how a page looks: names for unlabeled fields and
 *    icon buttons, keyboard access for clickable boxes, page landmarks, a
 *    "skip to main content" link, dialog roles, live-message roles, table headers.
 * 3. Always-on: a clearly visible keyboard-focus ring and slightly darker grey text.
 * Nothing here reads or writes any case data. Safe to load more than once.
 */
(function () {
  'use strict';
  if (window.__campA11y) return;
  window.__campA11y = true;

  var KEY = 'a11yPrefs_v1';
  var STEPS = [100, 115, 130, 150, 175];
  var D = { size: 0, contrast: false, links: false, font: false, space: false, motion: false };
  var P = {};
  var inFrame = false;
  try { inFrame = window.self !== window.top; } catch (e) { inFrame = true; }

  function load() {
    var o = {};
    try { o = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { o = {}; }
    P = {};
    for (var k in D) P[k] = (typeof o[k] === typeof D[k]) ? o[k] : D[k];
    if (P.size < 0 || P.size >= STEPS.length) P.size = 0;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} }

  /* ---------------------------------------------------------------- styles */
  function css() {
    var s = '';
    // always-on: visible keyboard focus + darker muted text (not in the dark "night" theme)
    s += ':focus-visible{outline:3px solid #FFBF47 !important;outline-offset:2px !important;box-shadow:0 0 0 2px #1b1b1b !important;}';
    s += 'html:not([data-theme="night"]){--muted:#4C5B66;}';
    s += 'body:not([data-theme="night"]){--muted:#47555F !important;}';
    // night theme: a few panels are hard-coded cream; give them the dark card colour, and lift two dim colours
    s += 'body[data-theme="night"]{--gold-deep:#BE953F !important;}';
    s += 'body[data-theme="night"] .disclaimer,body[data-theme="night"] .sheet-head,body[data-theme="night"] table tr:hover td{background:var(--card) !important;}';
    s += 'body[data-theme="night"] .btn:not(.gold):not(.ghost),body[data-theme="night"] table th{background-color:#4F6FA3;}';
    s += '.lang-btn,.btn.gold{background:#E3B64B !important;color:#10263D !important;}';
    s += 'a.backlink,.manage-link{display:inline-flex;align-items:center;min-height:24px;}';
    s += 'a:where([href]){min-height:24px;}';
    s += '.heading-icon{display:inline-flex;align-items:center;justify-content:center;min-width:24px;min-height:24px;}';
    s += 'select,input:not([type=checkbox]):not([type=radio]):not([type=hidden]),button{min-height:24px;}';
    s += '@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important;scroll-behavior:auto !important;}}';
    // skip link
    s += '#a11y-skip{position:fixed;top:8px;inset-inline-start:8px;z-index:100000;background:#fff;color:#10263D;border:2px solid #10263D;border-radius:6px;padding:10px 14px;font:600 14px/1.3 "Segoe UI",Tahoma,Arial,sans-serif;text-decoration:none;transform:translateY(-200%);}';
    s += '#a11y-skip:focus{transform:none;}';
    // text size (browser-style zoom) — also keeps full-height sidebars the right height
    STEPS.forEach(function (p, i) {
      if (!i) return; var z = p / 100;
      s += 'html.a11y-z' + i + '{zoom:' + z + ';}';
      s += 'html.a11y-z' + i + ' .sidebar{height:calc(100vh / ' + z + ') !important;}';
      s += 'html.a11y-z' + i + ' .app-shell{min-height:calc(100vh / ' + z + ') !important;}';
      s += 'html.a11y-z' + i + ' #a11y-root,html.a11y-z' + i + ' #a11y-skip{zoom:' + (1 / z).toFixed(4) + ';}';
    });
    // high contrast
    s += 'html.a11y-hc.a11y-hc{--bg:#FFFFFF;--surface:#FFFFFF;--card:#FFFFFF;--text:#000000;--muted:#1A1A1A;--border:#000000;--border-strong:#000000;--navy:#00264D;--navy-dark:#001A38;--navy2:#00264D;--navy3:#001A38;--gold-deep:#6B4E00;--danger:#8B0000;--success:#005A24;--warn:#5C4300;}';
    s += 'html.a11y-hc body{background:#fff !important;color:#000 !important;}';
    s += 'html.a11y-hc a{color:#00338A;} html.a11y-hc .sidebar a, html.a11y-hc .topbar a{color:#fff;}';
    s += 'html.a11y-hc input,html.a11y-hc select,html.a11y-hc textarea,html.a11y-hc button,html.a11y-hc .btn{border-color:#000 !important;border-width:2px !important;}';
    // links
    s += 'html.a11y-links a{text-decoration:underline !important;text-underline-offset:3px;}';
    s += 'html.a11y-links a:not(.nav-item):not(.nav-subitem){font-weight:700;}';
    // easy-to-read font
    s += 'html.a11y-font body,html.a11y-font body *:not(svg):not(svg *){font-family:Verdana,Tahoma,"Segoe UI",Arial,"Noto Naskh Arabic","Noto Sans Arabic",sans-serif !important;}';
    // spacing
    s += 'html.a11y-space body,html.a11y-space body *{line-height:1.8 !important;letter-spacing:.03em !important;word-spacing:.12em !important;}';
    // motion
    s += 'html.a11y-motion *,html.a11y-motion *::before,html.a11y-motion *::after{animation:none !important;transition:none !important;scroll-behavior:auto !important;}';
    // toolbar
    s += '#a11y-root{position:fixed;inset-inline-end:14px;bottom:14px;z-index:99990;font:14px/1.5 "Segoe UI",Tahoma,Arial,sans-serif;color:#10263D;}';
    s += '#a11y-fab{display:flex;align-items:center;gap:8px;background:#10263D;color:#fff;border:2px solid #fff;border-radius:999px;padding:9px 15px;cursor:pointer;font:700 13px/1.2 "Segoe UI",Tahoma,Arial,sans-serif;box-shadow:0 3px 14px rgba(0,0,0,.35);min-height:44px;}';
    s += '#a11y-fab:hover{background:#1a3a5e;}';
    s += '#a11y-panel{position:absolute;bottom:56px;inset-inline-end:0;width:min(320px,calc(100vw - 28px));max-height:calc(100vh - 90px);overflow:auto;background:#fff;color:#10263D;border:2px solid #10263D;border-radius:12px;padding:14px;box-shadow:0 8px 30px rgba(0,0,0,.35);}';
    s += '#a11y-panel[hidden]{display:none;}';
    s += '#a11y-panel h2{margin:0 0 10px;font:700 15px/1.3 "Segoe UI",Tahoma,Arial,sans-serif;color:#10263D;}';
    s += '#a11y-panel .row{display:flex;align-items:center;gap:8px;margin:8px 0;}';
    s += '#a11y-panel .lab{flex:1;font-weight:600;font-size:13px;}';
    s += '#a11y-panel button{min-height:40px;background:#fff;color:#10263D;border:2px solid #10263D;border-radius:8px;padding:6px 12px;cursor:pointer;font:600 13px/1.2 "Segoe UI",Tahoma,Arial,sans-serif;}';
    s += '#a11y-panel button[aria-pressed="true"]{background:#10263D;color:#fff;}';
    s += '#a11y-panel .sz{min-width:44px;font-size:16px;}';
    s += '#a11y-panel .val{min-width:46px;text-align:center;font-weight:700;}';
    s += '#a11y-panel .tog{min-width:92px;}';
    s += '#a11y-panel .foot{display:flex;gap:8px;margin-top:12px;}';
    s += '#a11y-panel .foot button{flex:1;}';
    s += '#a11y-panel .note{font-size:11.5px;color:#3a4a58;margin:8px 0 0;}';
    s += '#a11y-status{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}';
    s += '@media print{#a11y-root,#a11y-skip{display:none !important;}html[class*="a11y-z"]{zoom:1 !important;}}';
    return s;
  }
  function injectStyle() {
    if (document.getElementById('a11y-style')) return;
    var st = document.createElement('style'); st.id = 'a11y-style'; st.textContent = css();
    (document.head || document.documentElement).appendChild(st);
  }

  /* ---------------------------------------------------------- apply prefs */
  function applyPrefs() {
    var h = document.documentElement, c = h.classList;
    for (var i = 1; i < STEPS.length; i++) c.remove('a11y-z' + i);
    if (P.size) c.add('a11y-z' + P.size);
    c.toggle('a11y-hc', !!P.contrast);
    c.toggle('a11y-links', !!P.links);
    c.toggle('a11y-font', !!P.font);
    c.toggle('a11y-space', !!P.space);
    c.toggle('a11y-motion', !!P.motion);
  }

  /* -------------------------------------------------------------- toolbar */
  var panel, fab, statusEl;
  function say(msg) { if (statusEl) { statusEl.textContent = ''; setTimeout(function () { statusEl.textContent = msg; }, 30); } }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }
  function refreshPanel() {
    if (!panel) return;
    panel.querySelector('.val').textContent = STEPS[P.size] + '%';
    ['contrast', 'links', 'font', 'space', 'motion'].forEach(function (k) {
      var b = panel.querySelector('[data-k="' + k + '"]');
      if (b) { b.setAttribute('aria-pressed', P[k] ? 'true' : 'false'); b.textContent = P[k] ? 'On / آن' : 'Off / آف'; }
    });
    panel.querySelector('[data-act="smaller"]').disabled = P.size === 0;
    panel.querySelector('[data-act="bigger"]').disabled = P.size === STEPS.length - 1;
  }
  function setPref(k, v) { P[k] = v; save(); applyPrefs(); refreshPanel(); }
  function openPanel(open) {
    panel.hidden = !open; fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var f = panel.querySelector('button'); if (f) f.focus(); } else { fab.focus(); }
  }
  function buildToolbar() {
    if (inFrame || document.getElementById('a11y-root') || !document.body) return;
    var root = el('div', { id: 'a11y-root' });
    fab = el('button', { id: 'a11y-fab', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'a11y-panel', 'aria-haspopup': 'dialog' });
    fab.appendChild(el('span', { 'aria-hidden': 'true' }, '♿'));
    fab.appendChild(el('span', null, 'Accessibility / رسائی'));
    panel = el('div', { id: 'a11y-panel', role: 'dialog', 'aria-label': 'Accessibility settings / رسائی کی ترتیبات' });
    panel.hidden = true;
    panel.appendChild(el('h2', null, 'Accessibility / رسائی'));

    var r1 = el('div', { 'class': 'row' });
    r1.appendChild(el('span', { 'class': 'lab' }, 'Text size / حروف کا سائز'));
    var bS = el('button', { type: 'button', 'class': 'sz', 'data-act': 'smaller', 'aria-label': 'Smaller text / حروف چھوٹے' }, 'A−');
    var val = el('span', { 'class': 'val', 'aria-live': 'polite' }, '100%');
    var bB = el('button', { type: 'button', 'class': 'sz', 'data-act': 'bigger', 'aria-label': 'Bigger text / حروف بڑے' }, 'A+');
    r1.appendChild(bS); r1.appendChild(val); r1.appendChild(bB);
    panel.appendChild(r1);

    [['contrast', 'High contrast / زیادہ کنٹراسٹ'], ['links', 'Underline links / لنک کے نیچے لکیر'], ['font', 'Easy-to-read font / آسان فونٹ'], ['space', 'More spacing / زیادہ فاصلہ'], ['motion', 'Stop animation / حرکت بند']].forEach(function (p) {
      var r = el('div', { 'class': 'row' });
      var id = 'a11y-l-' + p[0];
      r.appendChild(el('span', { 'class': 'lab', id: id }, p[1]));
      r.appendChild(el('button', { type: 'button', 'class': 'tog', 'data-k': p[0], 'aria-pressed': 'false', 'aria-labelledby': id }, 'Off / آف'));
      panel.appendChild(r);
    });
    var foot = el('div', { 'class': 'foot' });
    foot.appendChild(el('button', { type: 'button', 'data-act': 'reset' }, 'Reset / پہلے جیسا'));
    foot.appendChild(el('button', { type: 'button', 'data-act': 'close' }, 'Close / بند'));
    panel.appendChild(foot);
    panel.appendChild(el('p', { 'class': 'note' }, 'Your choices are saved in this browser for all portal pages. / آپ کی ترتیب اس براؤزر میں محفوظ رہتی ہے۔'));
    statusEl = el('div', { id: 'a11y-status', role: 'status', 'aria-live': 'polite' });

    root.appendChild(panel); root.appendChild(fab); root.appendChild(statusEl);
    document.body.appendChild(root);

    fab.addEventListener('click', function () { openPanel(panel.hidden); });
    panel.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var a = b.getAttribute('data-act'), k = b.getAttribute('data-k');
      if (a === 'smaller') { setPref('size', Math.max(0, P.size - 1)); say('Text size ' + STEPS[P.size] + '%'); }
      else if (a === 'bigger') { setPref('size', Math.min(STEPS.length - 1, P.size + 1)); say('Text size ' + STEPS[P.size] + '%'); }
      else if (a === 'reset') { P = JSON.parse(JSON.stringify(D)); save(); applyPrefs(); refreshPanel(); say('Settings reset'); }
      else if (a === 'close') { openPanel(false); }
      else if (k) { setPref(k, !P[k]); say(b.getAttribute('aria-labelledby') ? document.getElementById(b.getAttribute('aria-labelledby')).textContent + (P[k] ? ' on' : ' off') : ''); }
    });
    root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); openPanel(false); } });
    document.addEventListener('click', function (e) { if (!panel.hidden && !root.contains(e.target)) { panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); } });
    refreshPanel();
  }

  /* ------------------------------------------------------- quiet page fixes */
  var SYMBOL_NAMES = { '☰': 'Menu / مینو', '◧': 'Collapse sidebar / سائیڈ بار', '🎨': 'Theme / تھیم', '✕': 'Close / بند', '×': 'Close / بند', '✖': 'Close / بند', '←': 'Back / واپس', '＋': 'Add / شامل', '+': 'Add / شامل', '✎': 'Edit / ترمیم', '🗑': 'Delete / حذف', '⬇': 'Download / ڈاؤن لوڈ', '↶': 'Undo', '↷': 'Redo', '🔍': 'Search / تلاش', '🖨': 'Print / پرنٹ' };
  function stripSymbols(t) { return (t || '').replace(/[←-⇿⌀-⏿■-➿⬀-⯿️‍\u{1F000}-\u{1FFFF}\s]/gu, ''); }
  function visible(e) { var r = e.getBoundingClientRect(); return r.width > 0 || r.height > 0; }
  function humanize(s) { return String(s || '').replace(/^f_|^inp_?|^sel_?/i, '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_\-.]+/g, ' ').trim().replace(/^./, function (c) { return c.toUpperCase(); }); }
  function labelFor(f) {
    if (f.getAttribute('aria-label') || f.getAttribute('aria-labelledby') || f.getAttribute('title')) return null;
    if (f.id) { try { if (document.querySelector('label[for="' + (window.CSS && CSS.escape ? CSS.escape(f.id) : f.id) + '"]')) return null; } catch (e) {} }
    if (f.closest('label')) return null;
    var id = (f.id || '') + ' ' + (f.name || '') + ' ' + (f.className && typeof f.className === 'string' ? f.className : '');
    if (/lang/i.test(id) && f.tagName === 'SELECT') return 'Language / زبان';
    if (/theme/i.test(id) && f.tagName === 'SELECT') return 'Theme / تھیم';
    var t = '';
    var p = f.previousElementSibling;
    if (p && /^(LABEL|SPAN|DIV|B|STRONG|SMALL)$/.test(p.tagName) && !p.querySelector('input,select,textarea,button')) { t = (p.textContent || '').trim(); }
    if (!t || t.length > 60) { var box = f.parentElement; var lb = box && box.querySelector(':scope > label'); if (lb && !lb.querySelector('input,select,textarea') && lb !== f) t = (lb.textContent || '').trim(); }
    if (!t || t.length > 60) t = f.getAttribute('placeholder') || '';
    if (!t && f.tagName === 'SELECT' && f.options && f.options[0]) t = (f.options[0].textContent || '').trim();
    if (!t || t.length > 60) t = humanize(f.id || f.name || f.className.split(' ')[0] || f.tagName.toLowerCase());
    return t ? t.replace(/\s+/g, ' ').replace(/\*$/, '').trim() : null;
  }
  var lastHeadingFix = 0;
  function fixAll() {
    var root = document;
    // language of the page follows the portal's own language switch
    var b = document.body;
    if (b) {
      var ur = b.classList.contains('lang-ur') || b.classList.contains('ur') || document.documentElement.getAttribute('dir') === 'rtl';
      var want = ur ? 'ur' : 'en';
      if (!document.documentElement.getAttribute('lang') || /^(ur|en)/.test(document.documentElement.lang)) { if (document.documentElement.lang !== want) document.documentElement.lang = want; }
    }
    // landmarks
    var main = document.querySelector('main,[role=main]');
    if (!main) { main = document.querySelector('.main-col .wrap') || document.querySelector('.wrap') || document.querySelector('.main-col'); if (main) main.setAttribute('role', 'main'); }
    if (main && !main.id) main.id = 'a11y-main';
    if (main && !main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    var nav = document.querySelector('.sidebar-nav'); if (nav && !nav.getAttribute('role')) { nav.setAttribute('role', 'navigation'); if (!nav.getAttribute('aria-label')) nav.setAttribute('aria-label', 'Main menu / مین مینو'); }
    var tb = document.querySelector('.topbar'); if (tb && !document.querySelector('header,[role=banner]') && !tb.getAttribute('role')) tb.setAttribute('role', 'banner');
    var ft = document.querySelector('.app-footer'); if (ft && !ft.getAttribute('role')) ft.setAttribute('role', 'contentinfo');
    // a page with no visible <h1>: the title in the top bar becomes the level-1 heading
    var hs = [].slice.call(document.querySelectorAll('h1,h2,h3,h4,h5,h6,[role=heading]')).filter(visible);
    if (!hs.some(function (h) { return h.tagName === 'H1' || (h.getAttribute('role') === 'heading' && h.getAttribute('aria-level') === '1'); })) {
      var br = document.querySelector('.topbar .brand span[data-i18n], .topbar .brand, .page-title, .topbar h1');
      if (br && !br.getAttribute('role')) { br.setAttribute('role', 'heading'); br.setAttribute('aria-level', '1'); }
    }
    if (!hs.some(function (h) { return h.tagName === 'H1' || h.getAttribute('aria-level') === '1'; })) {
      var fh = hs.filter(function (h) { return h.tagName !== 'H1'; })[0];
      if (fh) { fh.setAttribute('role', 'heading'); fh.setAttribute('aria-level', '1'); }
    }
    // heading levels must not skip
    var prev = 0;
    [].slice.call(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).filter(visible).forEach(function (h) {
      var n = +h.tagName[1]; if (h.getAttribute('aria-level')) n = +h.getAttribute('aria-level');
      if (prev && n > prev + 1) { n = prev + 1; h.setAttribute('aria-level', String(n)); }
      prev = n;
    });
    // names for icon-only buttons / links
    [].slice.call(document.querySelectorAll('button,a[href],[role=button],input[type=button],input[type=submit]')).forEach(function (c) {
      if (c.getAttribute('aria-label') || c.getAttribute('aria-labelledby') || c.getAttribute('title')) return;
      if (c.tagName === 'INPUT' && c.value) return;
      var im = c.querySelector('img[alt]:not([alt=""])'); if (im) return;
      var t = (c.textContent || '').trim();
      if (stripSymbols(t)) return;
      var name = SYMBOL_NAMES[t] || SYMBOL_NAMES[t.charAt(0)] || '';
      if (!name && t) name = t;
      if (name) c.setAttribute('aria-label', name);
    });
    // labels for form fields
    [].slice.call(document.querySelectorAll('input:not([type=hidden]):not([type=button]):not([type=submit]):not([type=reset]),select,textarea')).forEach(function (f) {
      var t = labelFor(f); if (t) f.setAttribute('aria-label', t);
    });
    // decorative images
    [].slice.call(document.querySelectorAll('img:not([alt])')).forEach(function (i) { i.setAttribute('alt', ''); });
    // clickable boxes that a keyboard cannot reach
    [].slice.call(document.querySelectorAll('[onclick]')).forEach(function (c) {
      if (/^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY|LABEL)$/.test(c.tagName) || c.getAttribute('role') || c.hasAttribute('tabindex') || c.hasAttribute('data-a11y-k')) return;
      c.setAttribute('tabindex', '0'); c.setAttribute('data-a11y-k', '1');
      if (/^(TR|TD|TH|LI|TABLE|TBODY|THEAD)$/.test(c.tagName)) return;   // keep table / list meaning
      c.setAttribute('role', 'button');
      if (!c.getAttribute('aria-label') && !stripSymbols(c.textContent)) c.setAttribute('aria-label', c.getAttribute('title') || 'Button / بٹن');
    });
    // dialogs, messages
    [].slice.call(document.querySelectorAll('.modal-panel,.cl-modal,.modal')).forEach(function (m) {
      if (!m.getAttribute('role')) { m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); var hh = m.querySelector('h1,h2,h3'); if (hh) { if (!hh.id) hh.id = 'a11y-h' + Math.random().toString(36).slice(2, 8); m.setAttribute('aria-labelledby', hh.id); } else m.setAttribute('aria-label', 'Dialog / ڈائیلاگ'); }
    });
    [].slice.call(document.querySelectorAll('.error-box,#saveError,.alert-error,.msg-error')).forEach(function (m) { if (!m.getAttribute('role')) m.setAttribute('role', 'alert'); });
    [].slice.call(document.querySelectorAll('.cl-msg,#actMsg,#readMsg,.toast,#toast,.snackbar,.status-msg,.note-banner')).forEach(function (m) { if (!m.getAttribute('aria-live') && !m.getAttribute('role')) m.setAttribute('aria-live', 'polite'); });
    // tables
    [].slice.call(document.querySelectorAll('th:not([scope])')).forEach(function (t) { t.setAttribute('scope', 'col'); });
    [].slice.call(document.querySelectorAll('iframe:not([title])')).forEach(function (f) { f.setAttribute('title', (f.getAttribute('src') || 'Embedded page').replace(/[#?].*$/, '')); });
  }
  // keyboard activation for the boxes made focusable above
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t && t.getAttribute && t.getAttribute('data-a11y-k') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); t.click(); }
  });

  function skipLink() {
    if (inFrame || document.getElementById('a11y-skip') || !document.body) return;
    var m = document.getElementById('a11y-main') || document.querySelector('main,[role=main]'); if (!m) return;
    if (!m.id) m.id = 'a11y-main';
    var a = el('a', { id: 'a11y-skip', href: '#' + m.id }, 'Skip to main content / مرکزی مواد پر جائیں');
    a.addEventListener('click', function (e) { e.preventDefault(); m.setAttribute('tabindex', '-1'); m.focus(); try { m.scrollIntoView(); } catch (x) {} });
    document.body.insertBefore(a, document.body.firstChild);
  }

  var timer = null;
  function schedule() { clearTimeout(timer); timer = setTimeout(function () { try { fixAll(); } catch (e) {} }, 300); }

  function start() {
    injectStyle();
    load(); applyPrefs();
    try { fixAll(); } catch (e) {}
    skipLink(); buildToolbar();
    try {
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'dir'] });
    } catch (e) {}
    // another tab changed the settings → follow
    window.addEventListener('storage', function (e) { if (e.key === KEY) { load(); applyPrefs(); refreshPanel(); } });
  }

  // apply saved look as early as possible (before the page paints)
  try { injectStyle(); load(); applyPrefs(); } catch (e) {}
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
