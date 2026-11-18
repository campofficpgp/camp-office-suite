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
  /* ---------- one menu on every page: add the main links a page is missing (never removes or re-orders) ---------- */
  var SUITE = 'https://cmpofficepgp.org/camp-office-suite/';
  var CANON = [['index.html','camp-office-suite','Dashboard','ڈیش بورڈ','ic-grid'],['lookup.html','lookup.html','Lookup','تلاش','ic-search'],
    ['cause-list.html','cause-list.html','Cause List Import','کاز لسٹ امپورٹ','ic-import'],['inspection.html','inspection.html','Inspection Desk','انسپیکشن ڈیسک','ic-clipcheck'],
    ['scanning.html','scanning.html','Scanning Desk','اسکین ڈیسک','ic-scan'],['#case','#case'],
    ['https://cmpofficepgp.org/bill-register-system/','bill-register-system','Bill Register','بل رجسٹر','ic-receipt'],
    ['https://cmpofficepgp.org/weekly-court-roster/','weekly-court-roster','Weekly Court Roster','ویکلی کورٹ روسٹر','ic-calendar'],
    ['gallery.html','gallery.html','Gallery','گیلری','ic-image'],['https://cmpofficepgp.org/bill-register-system/#reports','#reports','Reports','رپورٹس','ic-chart']];
  var CASESUB = [['case-entry.html','case-entry.html','Daily Cases','یومیہ کیسز','ic-list'],['case-notice.html','case-notice.html','Case Notices','کیس نوٹسز','ic-mail'],
    ['register-desk.html','register-desk.html','Register Desk','رجسٹر ڈیسک','ic-book'],['https://cmpofficepgp.org/record-section-system/','record-section-system','Record Section','ریکارڈ سیکشن','ic-archive']];
  function inSuite(){ return /\/camp-office-suite\//.test(location.pathname); }
  function linkFor(c){ return /^https?:/.test(c[0]) ? c[0] : (inSuite() ? c[0] : SUITE + c[0]); }
  function isUrNow(){ return (document.documentElement.getAttribute('lang') || '').indexOf('ur') === 0; }
  function findIn(box, c){
    var as = box.querySelectorAll('a[href]');
    for(var i = 0; i < as.length; i++){
      var k = hrefKey(as[i]); if(k === c[1]) return as[i];
      var lb = as[i].querySelector('[data-en]'); lb = lb ? lb.getAttribute('data-en') : (as[i].textContent || '').trim();
      if(lb && lb.toLowerCase() === c[2].toLowerCase()) return as[i];
    }
    return null;
  }
  function mk(c, cls){
    var a = document.createElement('a'); a.className = cls; a.href = linkFor(c); a.setAttribute('data-mi-added', '1');
    var tx = isUrNow() ? c[3] : c[2];
    a.innerHTML = '<span class="ico">' + svg(c[4]) + '</span><span ' + (cls === 'nav-item' ? 'class="label" ' : '') + 'data-en="' + c[2] + '" data-ur="' + c[3] + '">' + tx + '</span>';
    if(cls === 'nav-item'){ a.setAttribute('data-en-l', c[2]); a.setAttribute('data-ur-l', c[3]); }
    return a;
  }
  function topOf(nav, el){ while(el && el.parentNode !== nav) el = el.parentNode; return el; }
  function unifyNav(){
    try{
      var nav = document.querySelector('#sidebar .sidebar-nav, .sidebar .sidebar-nav'); if(!nav || nav.getAttribute('data-mi-unified')) return;
      nav.setAttribute('data-mi-unified', '1');
      var caseGrp = null, ce = findIn(nav, CASESUB[0]); if(ce) caseGrp = ce.closest('.nav-group');
      var prev = null;
      CANON.forEach(function(c){
        if(c[0] === '#case'){ if(caseGrp && caseGrp.parentNode === nav) prev = caseGrp; return; }
        var f = findIn(nav, c);
        if(f){ var tp = topOf(nav, f); if(tp && !tp.classList.contains('mi-more')) prev = tp; return; }
        var a = mk(c, 'nav-item');
        if(prev && prev.parentNode === nav) nav.insertBefore(a, prev.nextSibling); else nav.insertBefore(a, nav.firstChild);
        prev = a;
      });
      if(caseGrp){
        var sub = caseGrp.querySelector('.nav-submenu'), sp = null;
        if(sub) CASESUB.forEach(function(c){
          var f = findIn(sub, c);
          if(f){ sp = f; return; }
          var a = mk(c, 'nav-subitem');
          if(sp && sp.parentNode === sub) sub.insertBefore(a, sp.nextSibling); else sub.insertBefore(a, sub.firstChild);
          sp = a;
        });
      }
    }catch(e){ if(window.console) console.warn('ui-modern nav', e); }
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
    } finally { moreBusy = false; lastFit = Date.now(); }
  }
  var lastFit = 0;
  var fitT = null, navRO = null; function fitSoon(){ clearTimeout(fitT); fitT = setTimeout(fitTopNav, 150); }
  /* the menu is measured again when it first appears (after sign-in) or changes size for any other reason */
  function watchNav(){ var nav = document.querySelector('.sidebar-nav'); if(!nav || navRO || !window.ResizeObserver) return; navRO = new ResizeObserver(function(){ if(Date.now() - lastFit > 500) fitSoon(); }); navRO.observe(nav); }
  window.addEventListener('resize', fitSoon);
  new MutationObserver(fitSoon).observe(document.documentElement, {attributes: true, attributeFilter: ['data-design']});
  function run(rootEl){ try{ addSprite(); doMenu(rootEl); doEmoji(rootEl); }catch(e){ if(window.console) console.warn('ui-modern', e); } }
  var pending = [], timer = null;
  function flush(){
    timer = null; var roots = pending; pending = [];
    roots.forEach(function(r){ if(r.isConnected) run(r); });
  }
  function start(){
    unifyNav(); tidyHeader(); setTimeout(tidyHeader, 2500); run(document.body); watchNav(); fitSoon(); setTimeout(fitTopNav, 1200);
    new MutationObserver(function(ms){
      if(Date.now() - lastFit > 500 && ms.some(function(m){ return m.target && m.target.closest && m.target.closest('.sidebar-nav'); })) fitSoon();
      ms.forEach(function(m){ Array.prototype.forEach.call(m.addedNodes, function(n){ if(n.nodeType === 1 && n.id !== 'cmp-ui-icons') pending.push(n); else if(n.nodeType === 3 && n.parentNode && n.parentNode.nodeType === 1) pending.push(n.parentNode); }); });
      if(pending.length && !timer) timer = setTimeout(flush, 120);
    }).observe(document.body, {childList: true, subtree: true});
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
