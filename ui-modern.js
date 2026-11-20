/*! ui-modern.js — one look for the whole portal (Dashboard, Lookup, Cause List, Inspection, Scanning, Daily Cases,
    Case Notices, Bill Register, Weekly Court Roster, Record Section …).
    1. Cards, panels, modals, buttons and form boxes get the same rounded corners, soft shadows and focus ring
       (screen only: printing / PDF / Excel are never touched).
    2. The emoji icons of the side menu, page headings, tabs and buttons are swapped for the same clean line icons
       the Dashboard uses, so every page shows one icon set.
    Loaded on every page by /camp-office-suite/design-themes.js.  To take it out: remove the loader at the end of that file. */
(function(){
  'use strict';
  if(window.__cmpUiModern) return; window.__cmpUiModern = true;
  var SPRITE = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"cmp-ui-icons\" style=\"position:absolute;width:0;height:0;overflow:hidden\" aria-hidden=\"true\"><symbol id=\"ic-home\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 11l9-7 9 7\"/><path d=\"M5 10v10h5v-6h4v6h5V10\"/></symbol><symbol id=\"ic-grid\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"/></symbol><symbol id=\"ic-search\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-4-4\"/></symbol><symbol id=\"ic-import\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3v11\"/><path d=\"M8 10l4 4 4-4\"/><path d=\"M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4\"/></symbol><symbol id=\"ic-clipcheck\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"4\" width=\"14\" height=\"17\" rx=\"2\"/><path d=\"M9 4V3h6v1\"/><path d=\"M9 13l2 2 4-4\"/></symbol><symbol id=\"ic-scan\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3\"/><path d=\"M4 12h16\"/></symbol><symbol id=\"ic-folder\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/></symbol><symbol id=\"ic-list\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 6h11M9 12h11M9 18h11\"/><circle cx=\"4.5\" cy=\"6\" r=\"1\"/><circle cx=\"4.5\" cy=\"12\" r=\"1\"/><circle cx=\"4.5\" cy=\"18\" r=\"1\"/></symbol><symbol id=\"ic-mail\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M3 7l9 6 9-6\"/></symbol><symbol id=\"ic-book\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z\"/><path d=\"M4 21V5\"/><path d=\"M8 7h7\"/></symbol><symbol id=\"ic-archive\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"4\" rx=\"1\"/><path d=\"M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8\"/><path d=\"M10 12h4\"/></symbol><symbol id=\"ic-receipt\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 3h12v18l-3-2-3 2-3-2-3 2z\"/><path d=\"M9 8h6M9 12h6M9 16h3\"/></symbol><symbol id=\"ic-calendar\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/></symbol><symbol id=\"ic-calclock\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/><path d=\"M12 13v3l2 1\"/></symbol><symbol id=\"ic-image\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><circle cx=\"9\" cy=\"10\" r=\"2\"/><path d=\"M21 17l-5-5-9 8\"/></symbol><symbol id=\"ic-chart\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 20V4\"/><path d=\"M4 20h16\"/><path d=\"M8 16v-5M12 16V8M16 16v-3\"/></symbol><symbol id=\"ic-gear\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z\"/></symbol><symbol id=\"ic-users\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20a6.5 6.5 0 0 1 13 0\"/><path d=\"M16 4.5a3.5 3.5 0 0 1 0 7\"/><path d=\"M18 14a6.5 6.5 0 0 1 3.5 6\"/></symbol><symbol id=\"ic-usercheck\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20a6.5 6.5 0 0 1 13 0\"/><path d=\"M16 11l2 2 4-4\"/></symbol><symbol id=\"ic-sliders\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0\"/><circle cx=\"16\" cy=\"6\" r=\"2\"/><circle cx=\"10\" cy=\"12\" r=\"2\"/><circle cx=\"18\" cy=\"18\" r=\"2\"/></symbol><symbol id=\"ic-database\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><ellipse cx=\"12\" cy=\"5\" rx=\"8\" ry=\"3\"/><path d=\"M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5\"/><path d=\"M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3\"/></symbol><symbol id=\"ic-flag\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 21V4\"/><path d=\"M5 4h11l-2 4 2 4H5\"/></symbol><symbol id=\"ic-history\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 12a9 9 0 1 0 3-6.7\"/><path d=\"M3 4v5h5\"/><path d=\"M12 8v4l3 2\"/></symbol><symbol id=\"ic-chat\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z\"/><path d=\"M8.5 12h.01M12 12h.01M15.5 12h.01\"/></symbol><symbol id=\"ic-bot\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"8\" width=\"16\" height=\"12\" rx=\"3\"/><path d=\"M12 4v4\"/><circle cx=\"12\" cy=\"3\" r=\"1\"/><path d=\"M9 13v1M15 13v1\"/><path d=\"M9.5 17h5\"/></symbol><symbol id=\"ic-save\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3v12\"/><path d=\"M7 10l5 5 5-5\"/><ellipse cx=\"12\" cy=\"19\" rx=\"8\" ry=\"2\"/></symbol><symbol id=\"ic-listcheck\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 6h10M10 12h10M10 18h10\"/><path d=\"M3 6l1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17\"/></symbol><symbol id=\"ic-info\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v6M12 7.5h.01\"/></symbol><symbol id=\"ic-phone\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z\"/></symbol><symbol id=\"ic-help\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14\"/><path d=\"M12 17.5h.01\"/></symbol><symbol id=\"ic-scale\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3v18M7 21h10\"/><path d=\"M5 7h14\"/><path d=\"M5 7l-3 6a3 3 0 0 0 6 0z\"/><path d=\"M19 7l-3 6a3 3 0 0 0 6 0z\"/></symbol><symbol id=\"ic-hourglass\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 3h12M6 21h12\"/><path d=\"M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9\"/></symbol><symbol id=\"ic-gavel\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 4l6 6\"/><path d=\"M11 7l6 6\"/><path d=\"M12.5 5.5l5 5-3 3-5-5z\"/><path d=\"M10 11L3 18l2 2 7-7\"/><path d=\"M13 21h8\"/></symbol><symbol id=\"ic-arrowup\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 17L17 7\"/><path d=\"M8 7h9v9\"/></symbol><symbol id=\"ic-menu\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 6h16M4 12h16M4 18h16\"/></symbol><symbol id=\"ic-print\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9V3h12v6\"/><rect x=\"3\" y=\"9\" width=\"18\" height=\"8\" rx=\"2\"/><path d=\"M6 14h12v7H6z\"/></symbol><symbol id=\"ic-eye\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></symbol><symbol id=\"ic-plus\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 5v14M5 12h14\"/></symbol><symbol id=\"ic-edit\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 20h4L19 9l-4-4L4 16z\"/><path d=\"M14 6l4 4\"/></symbol><symbol id=\"ic-trash\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 7h16\"/><path d=\"M9 7V4h6v3\"/><path d=\"M6 7l1 13h10l1-13\"/></symbol><symbol id=\"ic-lock\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M8 11V8a4 4 0 0 1 8 0v3\"/></symbol><symbol id=\"ic-bell\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 16V11a6 6 0 0 1 12 0v5l2 2H4z\"/><path d=\"M10 20a2 2 0 0 0 4 0\"/></symbol><symbol id=\"ic-refresh\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 12a8 8 0 1 1-2.3-5.7\"/><path d=\"M20 4v5h-5\"/></symbol><symbol id=\"ic-download\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3v12\"/><path d=\"M7 10l5 5 5-5\"/><path d=\"M4 19h16\"/></symbol><symbol id=\"ic-upload\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 21V9\"/><path d=\"M7 14l5-5 5 5\"/><path d=\"M4 5h16\"/></symbol><symbol id=\"ic-file\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 3h8l4 4v14H6z\"/><path d=\"M14 3v4h4\"/><path d=\"M9 13h6M9 17h6\"/></symbol><symbol id=\"ic-check\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12l5 5L19 7\"/></symbol><symbol id=\"ic-camera\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 8h3l2-3h6l2 3h3v11H4z\"/><circle cx=\"12\" cy=\"13\" r=\"3.5\"/></symbol><symbol id=\"ic-money\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"2.5\"/><path d=\"M6 9v.01M18 15v.01\"/></symbol><symbol id=\"ic-calc\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M8 7h8\"/><path d=\"M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01M16 18h.01\"/></symbol><symbol id=\"ic-box\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 7l9-4 9 4-9 4z\"/><path d=\"M3 7v10l9 4 9-4V7\"/><path d=\"M12 11v10\"/></symbol><symbol id=\"ic-alert\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3l10 18H2z\"/><path d=\"M12 10v5M12 18v.01\"/></symbol><symbol id=\"ic-link\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1\"/><path d=\"M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1\"/></symbol><symbol id=\"ic-pin\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2\"/></symbol><symbol id=\"ic-key\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"8\" cy=\"14\" r=\"4\"/><path d=\"M11 11l9-9M17 5l3 3\"/></symbol><symbol id=\"ic-logout\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 4h4v16h-4\"/><path d=\"M10 8l-4 4 4 4\"/><path d=\"M6 12h10\"/></symbol><symbol id=\"ic-clock\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/></symbol><symbol id=\"ic-globe\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18\"/></symbol></svg>";
  /* the same polish for every design, except the ones that are square (tiles, register) or dark (command) on purpose */
  var P = 'html:not([data-design="tiles"]):not([data-design="register"]):not([data-design="command"]) ', PN = 'html:not([data-design]) ';
  function both(sel){ return sel.split(',').map(function(s){ s = s.trim(); return P + s + ',' + PN + s; }).join(','); }
  var TOPNAV = ['govt', 'court', 'tiles', 'glass', 'register', 'board'];
  var css = '@media screen{' +
    /* every screen size: hidden duplicates stay hidden, the short group names only show in the top menu */
    '.mi-dup,.sidebar-foot>a.mi-dup,.sidebar-foot>button.mi-dup{display:none!important}.mi-ls{display:none}.mi-maint-on::after{content:\"ON\";margin-inline-start:auto;background:#b3261e;color:#fff;font:700 10px/1 system-ui,sans-serif;padding:3px 6px;border-radius:6px}' +
    ':root{--m-r:12px;--m-r-sm:8px;--m-sh:0 1px 2px rgba(15,23,42,.05),0 3px 12px rgba(15,23,42,.06);--m-sh-h:0 2px 6px rgba(15,23,42,.07),0 10px 26px rgba(15,23,42,.10);--m-line:rgba(15,23,42,.10);--m-focus:0 0 0 3px rgba(42,90,132,.20)}' +
    /* icons */
    '.gi{width:1.15em;height:1.15em;display:inline-block;vertical-align:-0.2em;flex:none}' +
    '.mi{display:inline-flex;align-items:center;margin-inline-end:.38em;vertical-align:-0.12em}.mi .gi{width:1.1em;height:1.1em}' +
    'button .mi:only-child,.btn .mi:only-child{margin:0}' +
    /* cards and panels */
    both('.card,.panel,.gate-card,.md-card,.cl-card,.stat-card,.search-box,.last-backup-box,.ai-box,.form-card,.box') + '{border-radius:var(--m-r)!important;box-shadow:var(--m-sh)!important}' +
    both('.card:hover,.md-card:hover,.cl-card:hover,.stat-card:hover') + '{box-shadow:var(--m-sh-h)!important}' +
    both('.card,.md-card,.cl-card,.stat-card') + '{transition:box-shadow .18s ease,transform .18s ease}' +
    both('.modal-panel,.modal,.fullscreen-overlay .card') + '{border-radius:14px!important;box-shadow:0 24px 60px rgba(15,23,42,.28)!important}' +
    /* top bar and side menu */
    both('.topbar') + '{box-shadow:0 1px 0 var(--m-line),0 4px 14px rgba(15,23,42,.05)}' +
    both('.sidebar .nav-item,.sidebar .nav-subitem,.sidebar .nav-group-head') + '{border-radius:var(--m-r-sm)}' +
    both('.sidebar .ico') + '{display:inline-flex;align-items:center;justify-content:center}' +
    /* buttons and form boxes */
    both('.btn,button.primary,button.secondary,button.danger,button.ghost') + '{border-radius:var(--m-r-sm)!important;transition:box-shadow .15s ease,transform .15s ease,background-color .15s ease}' +
    both('.btn:not(:disabled):hover') + '{box-shadow:0 2px 8px rgba(15,23,42,.12)}' +
    both('.btn:not(:disabled):active') + '{transform:translateY(1px)}' +
    both('button:focus-visible,.btn:focus-visible,a:focus-visible') + '{outline:2px solid #2A5A84;outline-offset:2px}' +
    both('.main-col input[type=text],.main-col input[type=search],.main-col input[type=date],.main-col input[type=month],.main-col input[type=number],.main-col input[type=email],.main-col input[type=tel],.main-col input:not([type]),.main-col select,.main-col textarea') + '{border-radius:var(--m-r-sm)}' +
    both('.main-col input:focus,.main-col select:focus,.main-col textarea:focus') + '{box-shadow:var(--m-focus);outline:none}' +
    both('.badge,.chip,.role-chip,.pill') + '{border-radius:999px}' +
    /* tables: easier to read, same look everywhere (colours of each page stay) */
    both('.main-col table') + '{font-variant-numeric:tabular-nums}' +
    both('.main-col table tbody tr:hover > td') + '{background-image:linear-gradient(rgba(42,90,132,.05),rgba(42,90,132,.05))}' +
    both('.tbl-wrap,.table-wrap,.table-scroll,.tw') + '{border-radius:var(--m-r);box-shadow:var(--m-sh)}' +
    both('.main-col h1,.main-col h2') + '{letter-spacing:-.01em}' +
    /* designs that turn the side menu into a top menu (wide screens): the side menu's bottom space (kept clear of the
       floating bars) must not become an empty band, and the menu stays one compact row */
    '@media (min-width:961px){' + TOPNAV.map(function(d){ return 'html[data-design="' + d + '"] .sidebar,html[data-design="' + d + '"] #sidebar'; }).join(',') + '{padding-bottom:0!important;min-height:0!important}' +
      TOPNAV.map(function(d){ return 'html[data-design="' + d + '"] .sidebar-nav'; }).join(',') + '{gap:0!important;padding:4px 6px!important}' +
      TOPNAV.map(function(d){ return 'html[data-design="' + d + '"] .sidebar-nav>.nav-item,html[data-design="' + d + '"] .sidebar-nav>.nav-group>.nav-group-head'; }).join(',') + '{padding:7px 10px!important;font-size:13.5px!important;white-space:nowrap}' +
      TOPNAV.map(function(d){ return 'html[data-design="' + d + '"] .sidebar-head'; }).join(',') + '{padding:6px 10px!important}' +
      '.mi-more .nav-submenu{right:0;left:auto!important;min-width:230px}.mi-more .nav-submenu>.nav-item{display:flex!important;width:100%;white-space:nowrap}.mi-more .nav-submenu>.nav-item>.ico{display:inline-flex!important}' +
      '.mi-maint-on::after{content:\"ON\";margin-inline-start:auto;background:#b3261e;color:#fff;font:700 10px/1 system-ui,sans-serif;padding:3px 6px;border-radius:6px}.mi-ls{display:none}.mi-topnav .mi-ls{display:inline}.mi-topnav .mi-lf{display:none}.mi-topnav .mi-grp.mi-grp-active>.nav-group-head{background:rgba(255,255,255,.16)!important;border-radius:8px}.mi-grp .nav-submenu>.nav-subitem{white-space:nowrap}.mi-grp:not(.mi-grp-active)>.nav-group-head{opacity:1}' +
      '.mi-dup,.mi-topnav .sidebar-foot>.mi-dup,.sidebar-foot>a.mi-dup,.sidebar-foot>button.mi-dup{display:none!important}#miFiltersBtn{display:inline-flex;align-items:center;gap:6px}#miFiltersBtn svg{width:16px;height:16px}' +
      '.mi-topnav .sidebar-foot{display:flex!important;align-items:center!important;gap:4px!important;padding:0 0 0 10px!important;margin-left:6px!important;border-left:1px solid rgba(255,255,255,.18)!important;border-top:0!important}.mi-topnav .sidebar-foot>a,.mi-topnav .sidebar-foot>button{width:34px!important;height:34px!important;min-width:34px;padding:0!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:10px!important;background:transparent!important;border:1px solid transparent!important;transition:background .15s,border-color .15s,transform .15s}.mi-topnav .sidebar-foot>a:hover,.mi-topnav .sidebar-foot>button:hover,.mi-topnav .sidebar-foot>a:focus-visible{background:rgba(255,255,255,.16)!important;border-color:rgba(255,255,255,.28)!important;transform:translateY(-1px)}.mi-topnav .sidebar-foot>.mi-out:hover{background:rgba(239,68,68,.28)!important;border-color:rgba(254,202,202,.5)!important}.mi-topnav .sidebar-foot .ico{margin:0!important;display:inline-flex!important}.mi-topnav .sidebar-foot .ico svg{width:18px;height:18px}#mi-tip{position:fixed;z-index:2147483000;left:0;top:0;max-width:260px;background:#0f172a;color:#fff;padding:7px 11px;border-radius:9px;font:600 12.5px/1.35 system-ui,Segoe UI,Arial,sans-serif;box-shadow:0 8px 24px rgba(15,23,42,.28);pointer-events:none;opacity:0;transform:translateY(-4px);transition:opacity .12s,transform .12s}#mi-tip.on{opacity:1;transform:none}#mi-tip::before{content:"";position:absolute;top:-5px;left:calc(var(--ax,50%) - 5px);width:10px;height:10px;background:#0f172a;transform:rotate(45deg)}#mi-tip b{display:block;font-weight:700;white-space:nowrap}#mi-tip small{display:block;margin-top:2px;font-weight:500;opacity:.8;direction:rtl;text-align:right;font-family:"Noto Nastaliq Urdu","Jameel Noori Nastaleeq",Tahoma,serif;font-size:12px;line-height:1.9}#mi-tip .u{font-family:"Noto Nastaliq Urdu","Jameel Noori Nastaleeq",Tahoma,serif;font-weight:600}@media print{#mi-tip{display:none!important}}' +
      '.mi-chip-top .topbar .right-controls{display:flex;align-items:center;gap:10px}.mi-chip-top .topbar .user-chip-sm{background:rgba(255,255,255,.12)!important;border:1px solid rgba(255,255,255,.28)!important;color:#fff!important;box-shadow:none!important;padding:3px 4px 3px 12px!important;border-radius:999px!important;font-size:12px!important;display:inline-flex;align-items:center;gap:8px;margin:0!important}.mi-chip-top .topbar .user-chip-sm *{color:inherit!important}.mi-chip-top .topbar .user-chip-sm>*:last-child{background:rgba(255,255,255,.92)!important;color:#0f4f4a!important;border-radius:999px!important;padding:2px 9px!important}.heading-icon{opacity:.35;font-size:.8em;transition:opacity .15s}.brand:hover .heading-icon,.heading-icon:focus{opacity:.9}' +
      '@media screen and (min-width:961px){nav.sidenav{flex-wrap:wrap!important;overflow:visible!important;gap:5px!important;padding:7px 12px!important;position:static!important;border-bottom:1px solid #e3e8ee!important;box-shadow:0 2px 6px rgba(15,23,42,.05)}nav.sidenav>.tab-btn{padding:5px 11px!important;border:1px solid #dfe5ec!important;border-radius:999px!important;font-size:12.5px!important;line-height:1.3!important;background:#f7f9fb!important;color:#334155!important;white-space:nowrap;margin:0!important;transition:background .15s,border-color .15s}nav.sidenav>.tab-btn:hover{background:#eef4f3!important;border-color:#b9d3cf!important}nav.sidenav>.tab-btn.active{background:var(--primary,#0f766e)!important;border-color:var(--primary,#0f766e)!important;color:#fff!important;box-shadow:0 1px 3px rgba(15,118,110,.35)}nav.sidenav>.tab-btn.active *{color:#fff!important}nav.sidenav>.tab-btn .dot{display:none!important}}' +
      TOPNAV.map(function(d){ return 'html[data-design="' + d + '"] .sidebar-foot'; }).join(',') + '{padding:4px 8px!important;margin-left:auto}' +
    '}' +
    /* laptops: the top menu keeps to one line by showing the words without the small icons */
    '@media (min-width:961px) and (max-width:1365px){' + TOPNAV.map(function(d){ return 'html[data-design="' + d + '"] .sidebar-nav>.nav-item>.ico,html[data-design="' + d + '"] .sidebar-nav>.nav-group>.nav-group-head>.ico'; }).join(',') + '{display:none!important}}' +
  '}';
  function addCss(){ if(document.getElementById('cmp-ui-modern-css')) return; var s = document.createElement('style'); s.id = 'cmp-ui-modern-css'; s.textContent = css; (document.head || document.documentElement).appendChild(s); }
  addCss();

  /* ---------- one icon set ---------- */
  function addSprite(){
    if(!document.body || document.getElementById('cmp-ui-icons')) return;
    var d = document.createElement('div'); d.innerHTML = SPRITE; var svg = d.firstChild;
    /* the Dashboard has its own copy of the first icons — keep only the ones it lacks */
    Array.prototype.slice.call(svg.querySelectorAll('symbol')).forEach(function(sy){ if(document.getElementById(sy.id)) sy.remove(); });
    document.body.insertBefore(svg, document.body.firstChild);
  }
  function svg(id){ return '<svg class="gi" aria-hidden="true" focusable="false"><use href="#' + id + '"/></svg>'; }
  /* side menu: by link first (same as the Dashboard), then by label */
  var BYHREF = {'index.html':'ic-grid','camp-office-suite':'ic-grid','lookup.html':'ic-search','cause-list.html':'ic-import','inspection.html':'ic-clipcheck','scanning.html':'ic-scan',
    'case-entry.html':'ic-list','case-notice.html':'ic-mail','register-desk.html':'ic-book','record-section-system':'ic-archive','bill-register-system':'ic-receipt','weekly-court-roster':'ic-calendar',
    'gallery.html':'ic-image','#reports':'ic-chart','employee-directory.html':'ic-users','control-panel.html':'ic-sliders','master-data.html':'ic-database','result-list.html':'ic-flag','activity-log.html':'ic-history',
    'chat-system.html':'ic-chat','ai-assistant.html':'ic-bot','backup-center.html':'ic-save','shared-dropdown-manager.html':'ic-listcheck','about.html':'ic-info','contact-us.html':'ic-phone','help.html':'ic-help',
    'maintenance.html':'ic-lock','user-approvals.html':'ic-usercheck'};
  var BYLABEL = [[/dashboard/i,'ic-grid'],[/lookup/i,'ic-search'],[/cause list/i,'ic-import'],[/inspection/i,'ic-clipcheck'],[/scann/i,'ic-scan'],[/case management/i,'ic-folder'],[/daily case/i,'ic-list'],[/notice/i,'ic-mail'],[/register desk/i,'ic-book'],[/record section/i,'ic-archive'],
    [/bill register/i,'ic-receipt'],[/roster/i,'ic-calendar'],[/gallery/i,'ic-image'],[/report/i,'ic-chart'],[/employee/i,'ic-users'],[/users|setting/i,'ic-gear'],[/control panel/i,'ic-sliders'],[/master data/i,'ic-database'],[/result/i,'ic-flag'],[/activity/i,'ic-history'],
    [/chat/i,'ic-chat'],[/assistant/i,'ic-bot'],[/backup/i,'ic-save'],[/dropdown/i,'ic-listcheck'],[/about/i,'ic-info'],[/contact/i,'ic-phone'],[/help/i,'ic-help'],[/maintenance/i,'ic-lock'],[/approv/i,'ic-usercheck']];
  /* emoji at the start of headings, tabs and buttons */
  var EMO = {'🏠':'ic-home','🔎':'ic-search','🔍':'ic-search','📥':'ic-download','📤':'ic-upload','⬇':'ic-download','⬆':'ic-upload','📠':'ic-scan','📁':'ic-folder','📂':'ic-folder','🗂':'ic-folder','📋':'ic-list','📨':'ic-mail','✉':'ic-mail','📧':'ic-mail',
    '📚':'ic-book','📖':'ic-book','📒':'ic-book','📕':'ic-book','🗄':'ic-archive','🗃':'ic-archive','🧾':'ic-receipt','📅':'ic-calendar','🗓':'ic-calendar','📆':'ic-calendar','🖼':'ic-image','📊':'ic-chart','📈':'ic-chart','📉':'ic-chart',
    '⚙':'ic-gear','🛠':'ic-gear','🔧':'ic-gear','👥':'ic-users','👤':'ic-users','💬':'ic-chat','🤖':'ic-bot','💾':'ic-save','ℹ':'ic-info','📞':'ic-phone','☎':'ic-phone','❓':'ic-help','⚖':'ic-scale','⏳':'ic-hourglass','⌛':'ic-hourglass',
    '🖨':'ic-print','👁':'ic-eye','➕':'ic-plus','✏':'ic-edit','✎':'ic-edit','📝':'ic-edit','🗑':'ic-trash','🔒':'ic-lock','🔐':'ic-lock','🔓':'ic-lock','🔔':'ic-bell','🔄':'ic-refresh','↻':'ic-refresh','🔃':'ic-refresh',
    '📄':'ic-file','📃':'ic-file','📑':'ic-file','✅':'ic-check','✔':'ic-check','☑':'ic-check','📷':'ic-camera','📸':'ic-camera','💰':'ic-money','💵':'ic-money','🧮':'ic-calc','📦':'ic-box','⚠':'ic-alert','🔗':'ic-link','📌':'ic-pin','📍':'ic-pin','🔑':'ic-key','🚪':'ic-logout','🕒':'ic-clock','⏰':'ic-clock','🌐':'ic-globe','🏛':'ic-scale','🏁':'ic-flag','🚩':'ic-flag'};
  var EMO_RE = new RegExp('^\\s*(' + Object.keys(EMO).map(function(k){ return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).sort(function(a, b){ return b.length - a.length; }).join('|') + ')\\uFE0F?\\s*');
  function hrefKey(a){
    var h = (a && a.getAttribute && a.getAttribute('href')) || ''; if(!h || h === '#') return '';
    if(h.indexOf('#reports') >= 0) return '#reports';
    /* full address, so "index.html" inside the Bill Register means the Bill Register, not the Dashboard */
    var u; try{ u = new URL(h, location.href); }catch(e){ return ''; }
    var seg = u.pathname.split('/').filter(Boolean), last = seg[seg.length - 1] || '';
    if(!last || last === 'index.html') return seg.length > (last ? 1 : 0) ? seg[seg.length - (last ? 2 : 1)] : '';
    return last;
  }
  function doMenu(rootEl){
    Array.prototype.forEach.call(rootEl.querySelectorAll('.sidebar .ico'), function(ic){
      if(ic.querySelector('svg')) return;
      var host = ic.closest('a,button,.nav-group-head,.nav-item,.nav-subitem') || ic.parentNode, t = (ic.textContent || '').trim();
      if(t === '←' || t === '→'){ ic.innerHTML = svg('ic-home'); return; }
      var id = BYHREF[hrefKey(host)];
      var lab = host && host.querySelector('.label'); lab = lab ? (lab.getAttribute('data-en') || lab.textContent || '') : '';
      if(!id) for(var i = 0; i < BYLABEL.length; i++) if(BYLABEL[i][0].test(lab)){ id = BYLABEL[i][1]; break; }
      if(!id){ var mm = t.match(EMO_RE); if(mm) id = EMO[mm[1]]; }
      if(id){ ic.innerHTML = svg(id); ic.setAttribute('data-mi', id); }
    });
  }
  var TARGETS = 'h1,h2,h3,h4,summary,button,a.btn,.btn,.tab,.tab-btn,[role=tab],.et-tab,.card-title,.section-title';
  function firstText(el){
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n;
    while((n = w.nextNode())){ if(n.nodeValue.trim()) return n; }
    return null;
  }
  function doEmoji(rootEl){
    var list = rootEl.matches && rootEl.matches(TARGETS) ? [rootEl] : [];
    list = list.concat(Array.prototype.slice.call(rootEl.querySelectorAll(TARGETS)));
    list.forEach(function(el){
      if(el.closest('.sidebar,.theme-picker,.theme-switch-wrap,[contenteditable],[data-noicon],.no-iconize,#a11y-root')) return;
      var tn = firstText(el); if(!tn) return;
      var m = tn.nodeValue.match(EMO_RE); if(!m) return;
      var sp = document.createElement('span'); sp.className = 'mi'; sp.innerHTML = svg(EMO[m[1]]);
      tn.nodeValue = tn.nodeValue.slice(m[0].length);
      tn.parentNode.insertBefore(sp, tn);
    });
  }
  /* ---------- ONE menu in 5 groups on every page (Overview · Cases & Hearings · Desks & Registers · Admin · Support) ----------
     Existing menu links are MOVED into the groups (so their page code, ids and click handlers keep working);
     links a page does not have are added. Nothing is lost: any unknown old link goes into Support. */
  var SUITE = 'https://cmpofficepgp.org/camp-office-suite/';
  /* [match key (hrefKey), href, English, Urdu, icon, role ('', 'admin', 'super'), element id to match] */
  var GROUPS = [
    ['overview', 'Overview & Search', 'جائزہ و تلاش', 'Overview', 'جائزہ', 'ic-grid', '', [
      ['camp-office-suite', 'index.html', 'Dashboard', 'ڈیش بورڈ', 'ic-grid'],
      ['lookup.html', 'lookup.html', 'Lookup', 'تلاش', 'ic-search'],
      ['#reports', 'https://cmpofficepgp.org/bill-register-system/#reports', 'Reports', 'رپورٹس', 'ic-chart']]],
    ['cases', 'Case & Hearing Operations', 'کیس و سماعت', 'Cases & Hearings', 'کیس و سماعت', 'ic-scale', '', [
      ['case-entry.html', 'case-entry.html', 'Daily Cases', 'یومیہ کیسز', 'ic-list'],
      ['case-notice.html', 'case-notice.html', 'Case Notices', 'کیس نوٹسز', 'ic-mail'],
      ['cause-list.html', 'cause-list.html', 'Cause List Import', 'کاز لسٹ امپورٹ', 'ic-import'],
      ['weekly-court-roster', 'https://cmpofficepgp.org/weekly-court-roster/', 'Weekly Court Roster', 'ویکلی کورٹ روسٹر', 'ic-calendar']]],
    ['desks', 'Desks & Registers', 'ڈیسک و رجسٹر', 'Desks & Registers', 'ڈیسک و رجسٹر', 'ic-book', '', [
      ['register-desk.html', 'register-desk.html', 'Register Desk', 'رجسٹر ڈیسک', 'ic-book'],
      ['record-section-system', 'https://cmpofficepgp.org/record-section-system/', 'Record Section', 'ریکارڈ سیکشن', 'ic-archive'],
      ['inspection.html', 'inspection.html', 'Inspection Desk', 'انسپیکشن ڈیسک', 'ic-clipcheck'],
      ['scanning.html', 'scanning.html', 'Scanning Desk', 'اسکین ڈیسک', 'ic-scan'],
      ['bill-register-system', 'https://cmpofficepgp.org/bill-register-system/', 'Bill Register', 'بل رجسٹر', 'ic-receipt'],
      ['employee-directory.html', 'employee-directory.html', 'Employee Directory', 'ایمپلائی ڈائریکٹری', 'ic-users']]],
    ['admin', 'Administration & Settings', 'انتظامیہ و ترتیبات', 'Admin', 'انتظامیہ', 'ic-gear', 'admin', [
      ['user-approvals', 'index.html#user-approvals', 'User Approvals', 'یوزر منظوری', 'ic-usercheck', 'admin', 'openAdminPanelBtn'],
      ['control-panel.html', 'control-panel.html', 'Control Panel', 'کنٹرول پینل', 'ic-sliders', 'super', 'controlPanelLink'],
      ['master-data.html', 'master-data.html', 'Master Data', 'ماسٹر ڈیٹا', 'ic-database', 'admin', 'masterDataLink'],
      ['result-list.html', 'result-list.html', 'Result List', 'نتیجہ کی فہرست', 'ic-flag', 'admin', 'resultListLink'],
      ['shared-dropdown-manager.html', 'shared-dropdown-manager.html', 'Shared Dropdown Lists', 'مشترکہ ڈراپ ڈاؤن فہرستیں', 'ic-listcheck', 'admin'],
      ['activity-log.html', 'activity-log.html', 'Activity Log', 'سرگرمی لاگ', 'ic-history', 'admin', 'activityLogLink'],
      ['backup-center.html', 'backup-center.html', 'Backup Center', 'بیک اپ سینٹر', 'ic-save', 'admin'],
      ['maintenance.html', 'maintenance.html', 'Maintenance', 'مینٹیننس', 'ic-lock', 'super']]],
    ['support', 'Support & Info', 'معاونت و معلومات', 'Support', 'معاونت', 'ic-help', '', [
      ['chat-system.html', 'chat-system.html', 'Team Chat', 'ٹیم چیٹ', 'ic-chat'],
      ['ai-assistant.html', 'ai-assistant.html', 'AI Assistant', 'اے آئی اسسٹنٹ', 'ic-bot'],
      ['gallery.html', 'gallery.html', 'Gallery', 'گیلری', 'ic-image'],
      ['help.html', 'help.html', 'Help', 'مدد', 'ic-help'],
      ['about.html', 'about.html', 'About', 'ہمارے بارے میں', 'ic-info'],
      ['contact-us.html', 'contact-us.html', 'Contact Us', 'رابطہ', 'ic-phone']]]
  ];
  function inSuite(){ return /\/camp-office-suite\//.test(location.pathname); }
  function linkFor(h){ return /^https?:/.test(h) ? h : (inSuite() ? h : SUITE + h); }
  function isUrNow(){ return (document.documentElement.getAttribute('lang') || '').indexOf('ur') === 0; }
  function labelOf(el){ var l = el.querySelector('[data-en]'); return ((l && l.getAttribute('data-en')) || el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  /* old addresses that now live in the suite (case-notice-system) or were retired (daily-case-management-system, archived) */
  var ALIAS = {'camp-office-gallery': 'gallery.html', 'case-notice-system': 'case-notice.html'}, RETIRED = ['daily-case-management-system'];
  function keyOf(el){ if(el.id === 'openAdminPanelBtn') return 'user-approvals'; var k = hrefKey(el); return ALIAS[k] || k; }
  function isAdminNow(){ var t = ''; Array.prototype.forEach.call(document.querySelectorAll('#currentUserRole,.role-badge,.role-chip,[id$="UserRole"],.user-chip,.user-chip-sm'), function(e){ t += ' ' + e.textContent; }); return /admin|ایڈمن/i.test(t); }
  function mkItem(it){
    var a = document.createElement('a'); a.className = 'nav-subitem'; a.href = linkFor(it[1]); a.setAttribute('data-mi-added', '1');
    if(it[5]) a.setAttribute('data-mi-role', it[5]);
    a.innerHTML = '<span class="ico">' + svg(it[4]) + '</span><span data-en="' + it[2] + '" data-ur="' + it[3] + '">' + (isUrNow() ? it[3] : it[2]) + '</span>';
    return a;
  }
  function asSub(el, it){
    el.classList.remove('nav-item'); el.classList.add('nav-subitem');
    var lab = el.querySelector('.label'); if(lab) lab.classList.remove('label');
    if(!el.querySelector('.ico')){ var s = document.createElement('span'); s.className = 'ico'; s.innerHTML = svg(it[4]); el.insertBefore(s, el.firstChild); }
    return el;
  }
  function unifyNav(){
    try{
      var nav = document.querySelector('#sidebar .sidebar-nav, .sidebar .sidebar-nav'); if(!nav || nav.getAttribute('data-mi-unified')) return;
      nav.setAttribute('data-mi-unified', '2');
      var old = Array.prototype.slice.call(nav.children);
      var pool = Array.prototype.slice.call(nav.querySelectorAll('a[href], button.nav-subitem, button.nav-item, #openAdminPanelBtn'));
      var used = [];
      var here = location.pathname.replace(/index\.html$/, '');
      GROUPS.forEach(function(g){
        var grp = document.createElement('div'); grp.className = 'nav-group mi-grp'; grp.setAttribute('data-mi-grp', g[0]); if(g[6]) grp.setAttribute('data-mi-role', g[6]);
        grp.innerHTML = '<button type="button" class="nav-group-head" aria-expanded="false" title="' + g[1] + ' · ' + g[2] + '"><span class="ico">' + svg(g[5]) + '</span>' +
          '<span class="label"><span class="mi-lf" data-en="' + g[1] + '" data-ur="' + g[2] + '">' + (isUrNow() ? g[2] : g[1]) + '</span><span class="mi-ls" data-en="' + g[3] + '" data-ur="' + g[4] + '">' + (isUrNow() ? g[4] : g[3]) + '</span></span><span class="chev">›</span></button><div class="nav-submenu"></div>';
        var sub = grp.querySelector('.nav-submenu');
        g[7].forEach(function(it){
          var f = null;
          for(var i = 0; i < pool.length && !f; i++){ var el = pool[i]; if(used.indexOf(el) >= 0) continue; if((it[6] && el.id === it[6]) || keyOf(el) === it[0] || labelOf(el) === it[2].toLowerCase()) f = el; }
          if(it[0] === 'camp-office-suite' && !f){ for(var j = 0; j < pool.length && !f; j++){ if(used.indexOf(pool[j]) < 0 && labelOf(pool[j]) === 'dashboard') f = pool[j]; } }
          var node = f ? asSub(f, it) : mkItem(it); if(f){ used.push(f); if(f.tagName === 'A' && ALIAS[hrefKey(f)]) f.setAttribute('href', linkFor(it[1])); }
          if(it[5] && !node.getAttribute('data-mi-role')) node.setAttribute('data-mi-role', it[5]);
          sub.appendChild(node);
        });
        nav.appendChild(grp);
      });
      /* anything the page had that is not in the list stays reachable under Support */
      var sup = nav.querySelector('[data-mi-grp="support"] .nav-submenu');
      pool.forEach(function(el){ if(used.indexOf(el) < 0 && !el.closest('.mi-grp') && (el.getAttribute('href') || el.id)){ var h = el.getAttribute('href') || ''; if((h === '#' && /dashboard/.test(labelOf(el))) || RETIRED.indexOf(hrefKey(el)) >= 0) return; sup.appendChild(asSub(el, [0,0,0,0,'ic-link'])); } });
      old.forEach(function(o){ if(o.parentNode !== nav || o.closest('.mi-grp')) return; o.classList.add('mi-dup'); o.setAttribute('aria-hidden', 'true'); });
      Array.prototype.forEach.call(nav.querySelectorAll('.mi-grp'), function(g){
        var act = Array.prototype.some.call(g.querySelectorAll('.nav-subitem'), function(a){ if(a.classList.contains('active')) return true; var h = a.getAttribute('href'); if(!h || h === '#') return false; try{ var u = new URL(h, location.href); if(u.hash === '#reports') return location.hash === '#reports'; if(u.hash) return false; return u.pathname.replace(/index\.html$/, '') === here; }catch(e){ return false; } });
        if(act){ g.classList.add('mi-grp-active'); if(!isTopnav()) g.classList.add('open'); }
        g.querySelector('.nav-group-head').addEventListener('click', function(ev){ ev.stopPropagation(); var o = !g.classList.contains('open'); Array.prototype.forEach.call(nav.querySelectorAll('.mi-grp.open'), function(x){ if(x !== g && isTopnav()) x.classList.remove('open'); }); g.classList.toggle('open', o); this.setAttribute('aria-expanded', o); });
      });
      document.addEventListener('click', function(ev){ if(isTopnav() && !ev.target.closest('.mi-grp')) Array.prototype.forEach.call(nav.querySelectorAll('.mi-grp.open'), function(x){ x.classList.remove('open'); }); });
      /* Dashboard: the User Approvals link from other pages opens the approvals dialog */
      /* index.html#user-approvals: the Dashboard opens the approvals panel itself once the sign-in is checked (Admin / Super Admin only) */
    }catch(e){ if(window.console) console.warn('ui-modern nav', e); }
  }
  /* who sees the Admin group / admin items that this page did not have before */
  function navRoles(){
    var adm = isAdminNow(), sup = isSuper();
    /* pages without a role chip (e.g. Weekly Court Roster) use the role last seen for the same signed-in email (menu only; each page still checks access) */
    try{ var em = ''; Array.prototype.some.call(document.querySelectorAll('.user-chip,.user-chip-sm,#currentUserEmail,[id$="UserEmail"]'), function(e){ var m = (e.textContent || '').match(/[\w.+-]+@[\w.-]+/); if(m){ em = m[0].toLowerCase(); return true; } });
      var t = ''; Array.prototype.forEach.call(document.querySelectorAll('#currentUserRole,.role-badge,.role-chip,[id$="UserRole"],.user-chip,.user-chip-sm'), function(e){ t += ' ' + e.textContent; });
      var known = /admin|ایڈمن|data entry|viewer|user|صارف/i.test(t.replace(/[\w.+-]+@[\w.-]+/g, ''));
      if(em && known) localStorage.setItem('miNavRole', JSON.stringify({e: em, a: adm, s: sup}));
      else if(em){ var sv = JSON.parse(localStorage.getItem('miNavRole') || 'null'); if(sv && sv.e === em){ adm = !!sv.a; sup = !!sv.s; } } }catch(e){}
    Array.prototype.forEach.call(document.querySelectorAll('.mi-grp [data-mi-added][data-mi-role]'), function(a){ var r = a.getAttribute('data-mi-role'); a.classList.toggle('mi-dup', r === 'super' ? !sup : !adm); });
    Array.prototype.forEach.call(document.querySelectorAll('.mi-grp'), function(g){
      var any = Array.prototype.some.call(g.querySelectorAll('.nav-submenu > *'), function(a){ return !a.classList.contains('mi-dup') && !a.classList.contains('hidden') && a.style.display !== 'none'; });
      g.classList.toggle('mi-dup', !any || (g.getAttribute('data-mi-role') === 'admin' && !adm));
    });
  }
  /* ---------- page header: name/role chip goes into the header bar; an empty page title gets the page name ---------- */
  function tidyHeader(){
    try{
      if(window.innerWidth >= 700){
        var ub = document.querySelector('.userbar-ce'), ch = ub && ub.querySelector('.user-chip-sm'), rc = document.querySelector('.topbar .right-controls');
        if(ub && ch && rc && ub.children.length === 1 && !rc.contains(ch)){ rc.insertBefore(ch, rc.firstChild); ub.style.display = 'none'; document.documentElement.classList.add('mi-chip-top'); }
      }
      Array.prototype.forEach.call(document.querySelectorAll('.page-heading-text'), function(h){
        if(!(h.textContent || '').trim()){ var nm = (document.title || '').split(/[|—–-]/)[0].trim(); if(nm) h.textContent = nm; }
      });
    }catch(e){}
  }
  /* ---------- small icons at the right of the top menu: right icon, neat button, name + work on mouse-over ---------- */
  var FOOT = [[/maint/i,'ic-lock','Maintenance','مینٹیننس','پورٹل بند / کھولنا'],[/chat/i,'ic-chat','Team Chat','ٹیم چیٹ','عملے کے ساتھ پیغامات'],
    [/assistant|\bai\b/i,'ic-bot','AI Assistant','اے آئی اسسٹنٹ','سوال پوچھیں، مدد لیں'],[/backup/i,'ic-save','Backup Center','بیک اپ سینٹر','ڈیٹا کا بیک اپ اور ریسٹور'],
    [/install/i,'ic-download','Install App','ایپ انسٹال کریں','پورٹل کو ایپ کی طرح انسٹال کریں'],[/logout|log out|sign out|لاگ آؤٹ/i,'ic-logout','Log out','لاگ آؤٹ','پورٹل سے باہر نکلیں'],
    [/portal|home|dashboard/i,'ic-home','Portal Home','پورٹل','مین صفحہ / ڈیش بورڈ'],[/roster/i,'ic-calendar','Weekly Court Roster','ویکلی کورٹ روسٹر','ہفتہ وار روسٹر'],
    [/help/i,'ic-help','Help','مدد','رہنمائی'],[/about/i,'ic-info','About','ہمارے بارے میں',''],[/contact/i,'ic-phone','Contact','رابطہ','']];
  var tipEl = null;
  function tipShow(el){
    var d = el.__miTip; if(!d) return;
    if(!tipEl){ tipEl = document.createElement('div'); tipEl.id = 'mi-tip'; tipEl.setAttribute('role', 'tooltip'); document.body.appendChild(tipEl); }
    tipEl.innerHTML = '<b>' + d[2] + ' · <span class="u">' + d[3] + '</span></b>' + (d[4] ? '<small>' + d[4] + '</small>' : '');
    tipEl.className = 'on';
    var r = el.getBoundingClientRect(), w = tipEl.offsetWidth;
    var x = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    tipEl.style.left = x + 'px'; tipEl.style.top = (r.bottom + 10) + 'px';
    tipEl.style.setProperty('--ax', (r.left + r.width / 2 - x) + 'px');
  }
  function tipHide(){ if(tipEl) tipEl.className = ''; }
  function footFix(){
    try{
      document.documentElement.classList.toggle('mi-topnav', isTopnav());
      Array.prototype.forEach.call(document.querySelectorAll('.sidebar-foot > a, .sidebar-foot > button'), function(el){
        var lab = el.querySelector('.label'); lab = ((lab && (lab.getAttribute('data-en') || lab.textContent)) || el.textContent || '').trim();
        var key = lab + ' ' + (el.getAttribute('href') || '') + ' ' + (el.id || '');
        var d = null; for(var i = 0; i < FOOT.length; i++){ if(FOOT[i][0].test(key)){ d = FOOT[i]; break; } }
        if(!d) d = [null, null, lab.replace(/^[^\w؀-ۿ]+/, ''), '', ''];
        if(d[1]){ var ic = el.querySelector('.ico'); if(ic && ic.getAttribute('data-mi') !== d[1]){ ic.innerHTML = svg(d[1]); ic.setAttribute('data-mi', d[1]); } }
        if(/logout|log out|sign out/i.test(key)) el.classList.add('mi-out');
        el.__miTip = d;
        if(!el.getAttribute('aria-label')) el.setAttribute('aria-label', d[2] + (d[3] ? ' / ' + d[3] : ''));
        if(el.hasAttribute('title')){ el.setAttribute('data-mi-title', el.getAttribute('title')); el.removeAttribute('title'); }
        if(!el.__miTipOn){ el.__miTipOn = 1;
          el.addEventListener('mouseenter', function(){ if(document.documentElement.classList.contains('mi-topnav')) tipShow(el); });
          el.addEventListener('focus', function(){ if(document.documentElement.classList.contains('mi-topnav')) tipShow(el); });
          el.addEventListener('mouseleave', tipHide); el.addEventListener('blur', tipHide); el.addEventListener('click', tipHide);
        }
      });
    }catch(e){}
  }
  window.addEventListener('scroll', tipHide, true);
  /* ---------- one clean set of controls: doubled / unneeded buttons are hidden on screen (nothing is deleted) ---------- */
  function visEl(el){ return !!(el && el.offsetParent !== null); }
  function footHas(re){ return Array.prototype.some.call(document.querySelectorAll('.sidebar-foot > a, .sidebar-foot > button'), function(a){ return visEl(a) && re.test((a.textContent || '') + ' ' + (a.getAttribute('href') || '')); }); }
  function isSuper(){ var t = ''; Array.prototype.forEach.call(document.querySelectorAll('#currentUserRole,.role-badge,.role-chip,[id$="UserRole"],.user-chip,.user-chip-sm'), function(e){ t += ' ' + e.textContent; }); return /super\s*admin|سپر ایڈمن/i.test(t); }
  function dup(el){ if(el) el.classList.add('mi-dup'); }
  function pageHelpBtn(){ return document.querySelector('#btnHelp, #helpBtn, nav.sidenav .tab-btn[data-tab="help"]'); }
  function addHelpIcon(){
    var f = document.querySelector('.sidebar-foot'); if(!f || f.querySelector('[data-mi-help]')) return;
    if(Array.prototype.some.call(f.querySelectorAll('a[href]'), function(x){ return /help\.html/.test(x.getAttribute('href')); })) return;
    var a = document.createElement('a'); a.href = SUITE + 'help.html'; a.setAttribute('data-mi-help', '1');
    a.innerHTML = '<span class="ico">' + svg('ic-help') + '</span><span class="label" data-en="Help" data-ur="مدد">Help / مدد</span>';
    a.addEventListener('click', function(e){ var b = pageHelpBtn(); if(b){ e.preventDefault(); b.click(); } });
    var out = f.querySelector('[data-cg-logout]'); f.insertBefore(a, out || null);
  }
  function filtersToggle(){
    var box = document.getElementById('ceFilters'), act = document.querySelector('#caseListSection .ce-actions'); if(!box || !act || document.getElementById('miFiltersBtn')) return;
    var chips = document.getElementById('ceChips'), open = false;
    try{ open = localStorage.getItem('miCeFilters') === '1'; }catch(e){}
    var b = document.createElement('button'); b.type = 'button'; b.id = 'miFiltersBtn'; b.className = 'btn ghost';
    function sync(){ box.classList.toggle('mi-dup', !open); if(chips) chips.classList.toggle('mi-dup', !open); b.innerHTML = svg('ic-sliders') + ' <span>' + (open ? 'Hide filters · فلٹر بند' : 'Filters · فلٹر') + '</span>'; b.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    b.addEventListener('click', function(){ open = !open; try{ localStorage.setItem('miCeFilters', open ? '1' : '0'); }catch(e){} sync(); });
    act.insertBefore(b, act.children[1] || null); sync();
  }
  function tidyButtons(){
    try{
      addHelpIcon(); filtersToggle();
      var outOk = footHas(/logout|log out|لاگ آؤٹ/i), homeOk = footHas(/portal|home|camp-office-suite\/?$/i), sup = isSuper();
      var onDash = /\/camp-office-suite\/?(index\.html)?$/.test(location.pathname);
      Array.prototype.forEach.call(document.querySelectorAll('button, a, select'), function(el){
        if(el.closest('.sidebar-foot, .sidebar-nav, .modal, .modal-overlay, [role=dialog]') || el.classList.contains('mi-dup')) return;
        var t = (el.textContent || '').replace(/\s+/g, ' ').trim(), id = el.id || '';
        if(outOk && (/^(mainSignOut|logoutBtn|signOutBtn)$/.test(id) || (/^(log ?out|sign ?out)$/i.test(t) && el.closest('.userbar,.userbar-ce,.topbar,header,.tool-strip,.right-controls')))) return dup(el);
        if(homeOk && el.tagName === 'A' && /^home$/i.test(t)) return dup(el);
        if(!onDash && /اشتہارات\s*\/\s*Ads/.test(t)) return dup(el);
        if(/^(btnHelp|helpBtn)$/.test(id)) return dup(el);
        if(id === 'themeSwitcher' && el.tagName === 'SELECT') return dup(el);
        if(t === '☰' && el.tagName === 'BUTTON' && isTopnav() && el.closest('.topbar,header')) return dup(el);
        if(!sup && (id === 'btnBackup' || id === 'btnRestore' || /^(backup \(save file\)|restore from file)$/i.test(t))) return dup(el);
      });
      if(!sup){ var dm = document.getElementById('brDataMenu'); if(dm) dup(dm); Array.prototype.forEach.call(document.querySelectorAll('#pageHeadingBox .heading-icon'), dup); }
      Array.prototype.forEach.call(document.querySelectorAll('#chatMinBtn, #a11y-min'), dup);
      /* one sign-out: in the top menu it is the icon at the right; with the side menu (smaller screens) the page's own
         header Sign Out button is used and the one at the bottom of the side menu is hidden */
      var hdrOut = document.querySelector('#mainSignOut, #logoutBtn, #signOutBtn'), footOut = document.querySelector('.sidebar-foot [data-cg-logout]');
      if(hdrOut && footOut){ var tn = isTopnav(); footOut.classList.toggle('mi-dup', !tn); hdrOut.classList.toggle('mi-dup', tn); }
      /* User Approvals on the Dashboard opens the panel; the address then shows #user-approvals so the page can be reopened or bookmarked */
      var ua = document.getElementById('openAdminPanelBtn');
      if(ua && !ua.__miUa){ ua.__miUa = true; ua.title = 'User Approvals — approve accounts, roles, permissions / یوزر منظوری'; ua.addEventListener('click', function(){ try{ history.replaceState(null, '', '#user-approvals'); }catch(e){} }); }
      /* quick search (top bar) and Lookup explain each other */
      var gs = document.getElementById('globalSearch'); if(gs) gs.title = 'Quick search: first matches only. Press Enter (or All results) to open the full Lookup page with filters, print and export. / فوری تلاش؛ مکمل تلاش کے لیے Enter دبائیں';
      Array.prototype.forEach.call(document.querySelectorAll('.mi-grp a[href$="lookup.html"]'), function(a){ a.title = 'Lookup — full search & filter of Daily Cases, Case Notices, rosters, scans and jail reports / مکمل تلاش و فلٹر'; });
      /* while the portal is closed (red Maintenance strip), the menu's Maintenance item says so too */
      var mOn = !!document.querySelector('.cg-ro[href*="maintenance.html"]');
      Array.prototype.forEach.call(document.querySelectorAll('.mi-grp a[href$="maintenance.html"]'), function(a){ a.classList.toggle('mi-maint-on', mOn); });
      Array.prototype.forEach.call(document.querySelectorAll('.sidebar-foot > a, .sidebar-foot > button'), function(a){ if(a.hasAttribute('data-cg-logout') || a.hasAttribute('data-mi-help') || /help\.html/.test(a.getAttribute('href') || '')) return; dup(a); });
      navRoles();
    }catch(e){}
  }
  /* Lookup page: words typed in the Dashboard quick search arrive here (sessionStorage, 10 minutes) */
  function lookupHandoff(){
    if(!/\/lookup\.html$/.test(location.pathname)) return;
    var h = null; try{ h = JSON.parse(sessionStorage.getItem('miLookup') || 'null'); sessionStorage.removeItem('miLookup'); }catch(e){}
    if(!h || !h.q || Date.now() - h.t > 600000) return;
    var tab = h.tab === 'notices' ? 'notices' : 'cases', n = 0;
    (function tryFill(){
      var tb = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)), f = document.getElementById('f_' + tab + '_q');
      if(tb && tb.getAttribute('aria-selected') !== 'true' && !tb.classList.contains('active')) tb.click();
      f = document.getElementById('f_' + tab + '_q');
      if(f && f.offsetParent !== null){ f.value = h.q; f.dispatchEvent(new Event('input', {bubbles: true})); f.dispatchEvent(new Event('change', {bubbles: true})); f.focus(); return; }
      if(++n < 20) setTimeout(tryFill, 500);
    })();
  }
  try{ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lookupHandoff); else lookupHandoff(); }catch(e){}
  /* ---------- one language at a time: shared labels written "English / اردو" (sign-out chip, maintenance strip,
     accessibility button and panel, side-menu foot) show only the language chosen with the اردو / English button ---------- */
  var BI_SEL = '#a11y-root, #cg-dock, .cg-ro, [data-cg-pause], .sidebar-foot, #topbar2';
  function biLang(){ if(document.body && /(^|\s)lang-ur(\s|$)/.test(document.body.className)) return 'ur'; var l = (document.documentElement.getAttribute('lang') || '').slice(0, 2).toLowerCase(); if(l === 'ur' || l === 'en') return l; try{ return localStorage.getItem('cmpLang') === 'ur' ? 'ur' : 'en'; }catch(e){ return 'en'; } }
  function biPick(s, lang){
    var i = s.indexOf(' / '); if(i < 0) return s;
    var L = s.slice(0, i), R = s.slice(i + 3), AR = /[\u0600-\u06FF]/, LA = /[A-Za-z]/, en, ur;
    if(LA.test(L) && !AR.test(L) && AR.test(R)){ en = L; ur = R; }
    else if(AR.test(L) && LA.test(R) && !AR.test(R)){ ur = L; en = R; }
    else return s;
    var lead = /^[^A-Za-z\u0600-\u06FF]*/;
    var pE = (en.match(lead) || [''])[0], pU = (ur.match(lead) || [''])[0];
    return lang === 'ur' ? ((pU ? '' : pE) + ur.replace(/\s+$/, '')) : ((pE || !pU ? '' : pU) + en.replace(/\s+$/, ''));
  }
  function biRun(){
    try{
      var lang = biLang();
      Array.prototype.forEach.call(document.querySelectorAll(BI_SEL), function(box){
        var w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null), n;
        while((n = w.nextNode())){
          if(n.__biLast !== n.data) n.__biO = n.data;          /* new or rewritten by its page: remember the full text */
          if(n.__biO.indexOf(' / ') < 0) continue;
          var v = biPick(n.__biO, lang); if(n.data !== v) n.data = v; n.__biLast = n.data;
        }
        Array.prototype.forEach.call(box.querySelectorAll('[title],[aria-label]'), function(el){
          ['title', 'aria-label'].forEach(function(at){
            var cur = el.getAttribute(at); if(!cur) return;
            var key = '__bi_' + at; if(el[key + 'L'] !== cur) el[key] = cur;
            var v = biPick(el[key], lang); if(v !== cur) el.setAttribute(at, v); el[key + 'L'] = v;
          });
        });
      });
    }catch(e){}
  }
  var biT = null; function biSoon(){ clearTimeout(biT); biT = setTimeout(biRun, 120); }
  try{ new MutationObserver(biSoon).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']}); }catch(e){}
  /* the Dashboard marks Urdu with a class on <body> */
  function biBody(){ try{ if(document.body) new MutationObserver(biSoon).observe(document.body, {attributes: true, attributeFilter: ['class']}); biSoon(); }catch(e){} }
  if(document.body) biBody(); else document.addEventListener('DOMContentLoaded', biBody);
  try{ setInterval(biRun, 20000); }catch(e){}   /* the sign-out chip rewrites its own text every minute */
  var tidyT = null; function tidySoon(){ clearTimeout(tidyT); tidyT = setTimeout(tidyButtons, 250); }
  /* ---------- top-menu designs: whatever does not fit on one line goes into a "More" menu ---------- */
  var moreBusy = false;
  function isTopnav(){ var d = document.documentElement.getAttribute('data-design'); return TOPNAV.indexOf(d) >= 0 && window.innerWidth >= 961; }
  function fitTopNav(){
    if(moreBusy) return; var nav = document.querySelector('.sidebar-nav'); if(!nav) return;
    moreBusy = true;
    try{
      var more = nav.querySelector('.nav-group.mi-more'), moved;
      if(more){ moved = Array.prototype.slice.call(more.querySelectorAll('.nav-submenu > [data-mi-idx]')); moved.sort(function(a, b){ return a.getAttribute('data-mi-idx') - b.getAttribute('data-mi-idx'); }); moved.forEach(function(n){ nav.insertBefore(n, more); }); }
      if(!isTopnav()){ if(more) more.style.display = 'none'; return; }
      Array.prototype.forEach.call(nav.children, function(c, i){ if(!c.classList.contains('mi-more') && !c.hasAttribute('data-mi-idx')) c.setAttribute('data-mi-idx', i); });
      if(!more){
        more = document.createElement('div'); more.className = 'nav-group mi-more';
        more.innerHTML = '<button type="button" class="nav-group-head"><span class="ico">' + svg('ic-menu') + '</span><span class="label">More · مزید</span><span class="chev">›</span></button><div class="nav-submenu"></div>';
      }
      nav.appendChild(more); more.style.display = '';
      var sub = more.querySelector('.nav-submenu');
      function wraps(){ var kids = Array.prototype.filter.call(nav.children, function(c){ return c.offsetParent !== null; }); if(kids.length < 2) return false; var t = kids[0].offsetTop; return kids.some(function(c){ return c.offsetTop > t + 6; }); }
      var guard = 0;
      while(wraps() && guard++ < 40){
        var cands = Array.prototype.filter.call(nav.children, function(c){ return c !== more && c.classList.contains('nav-item') && !c.classList.contains('active'); });
        if(!cands.length) break;
        var last = cands[cands.length - 1]; sub.insertBefore(last, sub.firstChild);
      }
      if(!sub.children.length) more.style.display = 'none';
    } finally { moreBusy = false; lastFit = Date.now(); footFix(); }
  }
  var lastFit = 0;
  var fitT = null, navRO = null; function fitSoon(){ clearTimeout(fitT); fitT = setTimeout(fitTopNav, 150); }
  /* the menu is measured again when it first appears (after sign-in) or changes size for any other reason */
  function watchNav(){ var nav = document.querySelector('.sidebar-nav'); if(!nav || navRO || !window.ResizeObserver) return; navRO = new ResizeObserver(function(){ if(Date.now() - lastFit > 500) fitSoon(); }); navRO.observe(nav); }
  window.addEventListener('resize', function(){ fitSoon(); tidySoon(); });
  new MutationObserver(fitSoon).observe(document.documentElement, {attributes: true, attributeFilter: ['data-design']});
  function run(rootEl){ try{ addSprite(); doMenu(rootEl); doEmoji(rootEl); }catch(e){ if(window.console) console.warn('ui-modern', e); } }
  var pending = [], timer = null;
  function flush(){
    timer = null; var roots = pending; pending = [];
    roots.forEach(function(r){ if(r.isConnected) run(r); });
  }
  function start(){
    unifyNav(); tidyHeader(); setTimeout(tidyHeader, 2500); run(document.body); footFix(); setTimeout(footFix, 1500); tidyButtons(); setTimeout(tidyButtons, 1500); setTimeout(tidyButtons, 4000); watchNav(); fitSoon(); setTimeout(fitTopNav, 1200);
    new MutationObserver(function(ms){
      if(Date.now() - lastFit > 500 && ms.some(function(m){ return m.target && m.target.closest && m.target.closest('.sidebar-nav'); })) fitSoon();
      if(ms.some(function(m){ return m.target && m.target.closest && m.target.closest('.sidebar-foot'); })) setTimeout(footFix, 60);
      ms.forEach(function(m){ Array.prototype.forEach.call(m.addedNodes, function(n){ if(n.nodeType === 1 && n.id !== 'cmp-ui-icons') pending.push(n); else if(n.nodeType === 3 && n.parentNode && n.parentNode.nodeType === 1) pending.push(n.parentNode); }); });
      if(pending.length && !timer) timer = setTimeout(flush, 120);
      if(ms.some(function(m){ return m.addedNodes && m.addedNodes.length; })){ tidySoon(); biSoon(); }
    }).observe(document.body, {childList: true, subtree: true});
  }
  /* one employee record: Employee Directory and Bill Register keep each other up to date (Super Admin only) */
  if(/employee-directory\.html|\/bill-register-system\//.test(location.pathname)){ var es = document.createElement('script'); es.src = '/camp-office-suite/emp-sync.js?v=1'; es.defer = true; (document.head || document.documentElement).appendChild(es); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
