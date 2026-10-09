/*! Camp Office — sidebar collapse/open button (◧) for every system. Safe to load more than once. */
(function () {
  'use strict';
  if (window.__campSidebarFix) return;
  window.__campSidebarFix = true;
  var KEY = 'cmpSidebarCollapsed';
  function css() {
    if (document.getElementById('cmp-sbfix-css')) return;
    var s = document.createElement('style'); s.id = 'cmp-sbfix-css';
    s.textContent =
      '.sidebar.collapsed{width:68px;}' +
      '.sidebar.collapsed .label,.sidebar.collapsed .sidebar-brand span,.sidebar.collapsed .chev,.sidebar.collapsed .nav-submenu,.sidebar.collapsed .sidebar-foot .label{display:none !important;}' +
      '.sidebar.collapsed .sidebar-head{flex-direction:column;gap:8px;padding-left:6px;padding-right:6px;}' +
      '.sidebar.collapsed .nav-item,.sidebar.collapsed .nav-group-head{justify-content:center;}' +
      '.sidebar-collapse-btn{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:var(--sidebar-text,#fff);width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:13px;flex:none;}' +
      '@media (max-width:960px){' +
      '.sidebar.collapsed{width:250px;}' +
      '.sidebar.collapsed .label,.sidebar.collapsed .sidebar-brand span,.sidebar.collapsed .chev,.sidebar.collapsed .sidebar-foot .label{display:inline !important;}' +
      '.sidebar.collapsed .nav-submenu{display:block !important;}' +
      '.sidebar.collapsed .sidebar-head{flex-direction:row;padding-left:12px;padding-right:12px;}' +
      '.sidebar.collapsed .nav-item,.sidebar.collapsed .nav-group-head{justify-content:flex-start;}' +
      '.sidebar-collapse-btn{display:none;}}';
    document.head.appendChild(s);
  }
  function init() {
    var b = document.getElementById('sidebarCollapseBtn'), sb = document.getElementById('sidebar');
    if (!sb) return;
    if (!b) {                       // some pages (e.g. Weekly Court Roster) have no button at all: add one
      var head = sb.querySelector('.sidebar-head'); if (!head) return;
      b = document.createElement('button'); b.type = 'button'; b.id = 'sidebarCollapseBtn'; b.className = 'sidebar-collapse-btn'; b.textContent = '◧';
      head.appendChild(b);
    }
    if (b.getAttribute('data-sbfix')) return;
    b.setAttribute('data-sbfix', '1');
    css();
    b.setAttribute('aria-label', 'Collapse or open the side menu / سائیڈ مینو بند یا کھولیں');
    try { if (localStorage.getItem(KEY) === '1' && window.innerWidth > 960) sb.classList.add('collapsed'); } catch (e) {}
    function sync() { b.setAttribute('aria-expanded', sb.classList.contains('collapsed') ? 'false' : 'true'); b.title = sb.classList.contains('collapsed') ? 'Open menu / مینو کھولیں' : 'Collapse menu / مینو بند کریں'; }
    sync();
    var before = null;
    b.addEventListener('click', function () { before = sb.classList.contains('collapsed'); }, true);
    b.addEventListener('click', function () {
      // if the page's own code already toggled it, leave it; otherwise toggle here
      setTimeout(function () {
        if (before !== null && sb.classList.contains('collapsed') === before) sb.classList.toggle('collapsed');
        try { localStorage.setItem(KEY, sb.classList.contains('collapsed') ? '1' : '0'); } catch (e) {}
        sync(); before = null;
      }, 0);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
