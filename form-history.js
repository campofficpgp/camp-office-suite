/* Camp Office — Undo / Redo for entry forms (shared by every page that has one).
   Works on the pop-up entry forms: every change you make in the form is remembered, and the
   ↶ Undo / ↷ Redo buttons (next to Save) step back and forward through them.
   Nothing is saved to the database by Undo / Redo — only the Save button saves.
   It does not change how any page saves or validates; it only restores field values. */
(function () {
  if (window.__formHistory) return;
  var IDS = ['caseForm', 'noticeForm', 'addForm', 'editForm', 'userForm'];
  var MAX = 80;
  var SKIP_TYPES = { file: 1, button: 1, submit: 1, reset: 1, image: 1, password: 1, hidden: 1 };

  function isUr() {
    var b = document.body;
    return !!b && (b.getAttribute('dir') === 'rtl' || b.classList.contains('lang-ur'));
  }
  function isModal(m) { return m.classList.contains('modal-overlay'); }
  function isOpen(m) {
    if (!isModal(m)) return m.getClientRects().length > 0;          // inline form card: open while visible
    return m.classList.contains('open') || (m.style.display && m.style.display !== 'none');
  }
  function fields(m) {
    return Array.prototype.filter.call(m.querySelectorAll('input,select,textarea'), function (e) {
      return !SKIP_TYPES[(e.type || '').toLowerCase()] && !e.closest('.fh-ignore');
    });
  }
  function snap(m) {
    return fields(m).map(function (e, i) {
      var t = (e.type || '').toLowerCase();
      return [e.id || ('#' + i), (t === 'checkbox' || t === 'radio') ? !!e.checked : e.value];
    });
  }
  function same(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) return false;
    return true;
  }
  function fire(el, type) {
    var ev; try { ev = new Event(type, { bubbles: true }); } catch (e) { ev = document.createEvent('Event'); ev.initEvent(type, true, true); }
    el.dispatchEvent(ev);
  }

  function setup(m) {
    if (m.__fh) return;
    var st = m.__fh = { hist: [], idx: -1, restoring: false, timer: null, open: false, btns: null };

    function top() { return st.hist[st.idx]; }
    function refresh() {
      if (!st.btns) return;
      st.btns.undo.classList.toggle('fh-off', st.idx <= 0);
      st.btns.redo.classList.toggle('fh-off', st.idx >= st.hist.length - 1);
    }
    function push() {
      if (st.restoring) return;
      var s = snap(m);
      if (same(s, top())) { refresh(); return; }
      st.hist = st.hist.slice(0, st.idx + 1);
      st.hist.push(s);
      if (st.hist.length > MAX) st.hist.shift();
      st.idx = st.hist.length - 1;
      refresh();
    }
    function flush() { if (st.timer) { clearTimeout(st.timer); st.timer = null; push(); } }
    function apply(s) {
      st.restoring = true;
      var list = fields(m);
      function pass(events) {
        s.forEach(function (p, i) {
          var el = (p[0].charAt(0) === '#') ? list[+p[0].slice(1)] : document.getElementById(p[0]);
          if (!el || !m.contains(el)) return;
          var t = (el.type || '').toLowerCase();
          if (t === 'checkbox' || t === 'radio') { if (el.checked !== p[1]) { el.checked = p[1]; if (events) fire(el, 'change'); } }
          else if (el.value !== p[1]) { el.value = p[1]; if (events) { fire(el, 'input'); fire(el, 'change'); } }
        });
      }
      pass(true);            // set values and let the page react (dependent drop-downs etc.)
      setTimeout(function () { pass(false); }, 0);   // re-assert values after dependent lists rebuilt
      setTimeout(function () { st.restoring = false; refresh(); }, 80);
    }
    function undo() { flush(); if (st.idx > 0) { st.idx--; apply(st.hist[st.idx]); refresh(); } }
    function redo() { flush(); if (st.idx < st.hist.length - 1) { st.idx++; apply(st.hist[st.idx]); refresh(); } }

    function addButtons() {
      if (st.btns) return;
      var anchor = m.querySelector('[data-fh-save]');          // a page can mark its own Save button
      if (!anchor && !isModal(m)) anchor = m.querySelector('button[id$="_saveBtn"]');
      var all = anchor ? [] : m.querySelectorAll('[onclick]');
      for (var i = 0; i < all.length; i++) { if (/save/i.test(all[i].getAttribute('onclick') || '')) { anchor = all[i]; break; } }
      if (!anchor) { var a = m.querySelector('.actions button, .actions .btn'); anchor = a; }
      if (!anchor) return;
      var cancel = anchor.parentNode.querySelector('.btn.ghost, button.ghost, .btn.secondary');
      var tag = (cancel ? cancel.tagName : anchor.tagName).toLowerCase();
      var cls = cancel ? cancel.className : 'btn ghost';
      function mk(kind, en, ur, fn) {
        var b = document.createElement(tag);
        b.className = cls + ' fh-btn';
        if (tag === 'button') b.type = 'button';
        if (isModal(m)) { b.setAttribute('data-en', en); b.setAttribute('data-ur', ur); b.textContent = isUr() ? ur : en; }
        else { b.textContent = ur.replace(/^(\S+) (.*)$/, '$1 $2') + ' / ' + en.replace(/^\S+ /, ''); }
        b.title = kind === 'undo' ? 'Undo (Ctrl+Z) / واپس' : 'Redo (Ctrl+Y) / دوبارہ';
        b.addEventListener('click', function (e) { e.preventDefault(); fn(); });
        anchor.parentNode.insertBefore(b, anchor);
        return b;
      }
      st.btns = { undo: mk('undo', '↶ Undo', '↶ واپس', undo), redo: mk('redo', '↷ Redo', '↷ دوبارہ', redo) };
      refresh();
    }

    function onChange(e) {
      if (st.restoring || !st.open) return;
      var t = (e.target.type || '').toLowerCase();
      if (e.type === 'change' || t === 'checkbox' || t === 'radio' || e.target.tagName === 'SELECT') { flush(); push(); return; }
      if (st.timer) clearTimeout(st.timer);
      st.timer = setTimeout(function () { st.timer = null; push(); }, 350);
    }
    m.addEventListener('input', onChange, true);
    m.addEventListener('change', onChange, true);
    // anything the page filled in by itself becomes the starting point before the user edits
    function external() {
      if (!st.open || st.restoring || st.timer) return;
      var s = snap(m);
      if (!top()) { push(); return; }
      if (!same(s, top())) { st.hist = [s]; st.idx = 0; refresh(); }   // page changed the form itself (new record loaded / form cleared): start fresh
    }
    m.addEventListener('focusin', external, true);
    m.addEventListener('pointerdown', external, true);
    m.addEventListener('keydown', function (e) {
      if (!st.open || !(e.ctrlKey || e.metaKey)) return;
      var k = (e.key || '').toLowerCase();
      var tg = e.target, tt = (tg.type || '').toLowerCase();
      var textLike = (tg.tagName === 'TEXTAREA') || (tg.tagName === 'INPUT' && !/^(checkbox|radio|button|submit)$/.test(tt));
      if (textLike) return;             // the browser's own typing-undo handles text boxes
      if (k === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
    });

    function rebuild() {            // for pop-ups whose buttons/fields the page rebuilds each time it opens one
      st.btns = null; st.hist = []; st.idx = -1; if (st.timer) { clearTimeout(st.timer); st.timer = null; }
      if (!isOpen(m)) return;
      if (!st.open) watch(); else { addButtons(); setTimeout(function () { if (st.open) push(); }, 200); }
    }
    function watch() {
      var o = isOpen(m);
      if (o && st.open && st.btns && !st.btns.undo.isConnected) { st.btns = null; addButtons(); }
      if (o && !st.open) {
        st.open = true; st.hist = []; st.idx = -1; addButtons();
        setTimeout(function () { if (st.open) { push(); } }, 200);
      } else if (!o && st.open) {
        st.open = false; st.hist = []; st.idx = -1; if (st.timer) { clearTimeout(st.timer); st.timer = null; } refresh();
      }
    }
    new MutationObserver(watch).observe(m, { attributes: true, attributeFilter: ['class', 'style'] });
    if (!isModal(m)) setInterval(watch, 700);
    watch();
    st.api = { undo: undo, redo: redo, push: push, rebuild: rebuild, state: st };
  }

  function init() {
    var css = document.createElement('style');
    css.textContent = '.fh-btn.fh-off{opacity:.45;pointer-events:none}';
    document.head.appendChild(css);
    IDS.forEach(function (id) { var m = document.getElementById(id); if (m) setup(m); });
    Array.prototype.forEach.call(document.querySelectorAll('.card.entry-form'), function (c) { var b = c.querySelector('button[id$="_saveBtn"]'); if (b && b.parentNode.classList.contains('btnbar')) setup(c); });
  }
  window.__formHistory = { setup: setup };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
