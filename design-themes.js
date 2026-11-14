/* design-themes.js — whole-portal designs (layout + style), chosen with one click.
   8 designs: classic (the existing look, keeps the 🎨 colour picker), govt, court, tiles,
   command, glass, register, board. The choice is saved in this browser (localStorage
   "cmpDesign"). Only the Super Admin chooses the design, from the Control Panel; it is saved in
   Firestore lookupLists/portalDesign and applies to every user and every page. Only looks change: no data,
   no page logic and no print/PDF output is touched (all rules are @media screen).
   It is loaded on the Camp Office suite pages by /pwa.js; remove those loader lines from
   /pwa.js to take it out again. */
(function(){
  'use strict';
  var KEY = 'cmpDesign';
  var DESIGNS = [
    {id:'classic',  en:'Classic Sidebar',   ur:'موجودہ انداز',          c:['#17294a','#2A5A84','#F6F5F1']},
    {id:'govt',     en:'Government Portal', ur:'سرکاری پورٹل، سبز',     c:['#0b4032','#13624b','#f3f8f5']},
    {id:'court',    en:'Court Notice Board',ur:'عدالتی انداز',           c:['#161616','#7a5a12','#ffffff']},
    {id:'tiles',    en:'Tile Launcher',     ur:'رنگین ٹائل',             c:['#1b2a41','#2d89ef','#eef1f6']},
    {id:'command',  en:'Command Center',    ur:'گہرا، رات کا',           c:['#070b10','#4f9cf9','#111a24']},
    {id:'glass',    en:'Glass Modern',      ur:'جدید شیشے جیسا',         c:['#6366f1','#ec4899','#eef0f8']},
    {id:'register', en:'Office Register',   ur:'دفتری رجسٹر',            c:['#5b4a2a','#8c1d1d','#efe6cf']},
    {id:'board',    en:'Case Board',        ur:'کیس بورڈ، ٹیل',          c:['#134e4a','#0f766e','#f4f5f7']}
  ];
  function valid(id){ for(var i=0;i<DESIGNS.length;i++) if(DESIGNS[i].id===id) return true; return false; }
  function ls(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lset(k,v){ try{ if(v===null) localStorage.removeItem(k); else localStorage.setItem(k,v); }catch(e){} }
  /* cmpDesign = look in use, cmpDesignOffice = the design chosen by the Super Admin
     (cached copy of lookupLists/portalDesign). Personal choices are no longer used. */
  lset('cmpDesignOwn', null);
  function nameOf(id){ for(var i=0;i<DESIGNS.length;i++) if(DESIGNS[i].id===id) return (i+1)+'. '+DESIGNS[i].en; return id; }
  function pick(){ var office = ls('cmpDesignOffice'); return valid(office) ? office : 'classic'; }
  var current = pick();
  var isSuper = false, officeUser = null;
  var root = document.documentElement;
  root.setAttribute('data-design', current);

  /* ---------- styles (screen only, so printing is never affected) ---------- */
  var TOPNAV = ['govt','court','tiles','glass','register','board'];
  function sel(list, rule){ return list.map(function(d){ return 'html[data-design="'+d+'"] '+rule; }).join(','); }
  var css = '@media screen{' +
  /* hide the colour picker when a fixed-colour design is active */
  'html[data-design]:not([data-design="classic"]) .theme-switch-wrap,html[data-design]:not([data-design="classic"]) #themeBtn2{display:none!important}' +

  /* ---- shared: sidebar becomes a top menu on wide screens (phones keep the slide-out menu) ---- */
  '@media (min-width:961px){' +
    sel(TOPNAV,'.app-shell')+'{flex-direction:column}' +
    sel(TOPNAV,'.sidebar')+'{position:sticky;top:0;width:auto!important;height:auto;max-height:none;flex-direction:row;align-items:center;flex-wrap:wrap;overflow:visible;z-index:60;transform:none}' +
    sel(TOPNAV,'.sidebar-head')+'{border:0;padding:8px 12px}' +
    sel(TOPNAV,'.sidebar-collapse-btn')+'{display:none}' +
    sel(TOPNAV,'.sidebar-nav')+'{display:flex;flex-wrap:wrap;align-items:center;gap:2px;padding:6px;flex:1;min-width:0}' +
    sel(TOPNAV,'.sidebar-nav .nav-item,.sidebar-nav .nav-group-head')+'{width:auto;margin:0;padding:7px 10px;font-size:12px;white-space:nowrap}' +
    sel(TOPNAV,'.nav-group')+'{position:relative}' +
    sel(TOPNAV,'.nav-group-head .chev')+'{transform:rotate(90deg);margin-left:4px}' +
    sel(TOPNAV,'.nav-submenu')+'{position:absolute;top:100%;left:0;min-width:210px;max-height:none!important;overflow:visible;display:none;padding:6px;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.25);z-index:80;background:var(--sidebar-bg)}' +
    sel(TOPNAV,'.nav-group:hover .nav-submenu')+','+sel(TOPNAV,'.nav-group:focus-within .nav-submenu')+'{display:block}' +
    sel(TOPNAV,'.sidebar-foot')+'{flex-direction:row;border:0;padding:6px 10px;gap:2px}' +
    sel(TOPNAV,'.sidebar-foot .label')+'{display:none}' +
    sel(TOPNAV,'.sidebar-foot a')+'{padding:7px 8px}' +
  '}' +

  /* ---- 2 Government Portal ---- */
  'html[data-design="govt"] body{--navy:#13624b;--navy2:#1b7d5e;--navy3:#0b4032;--gold:#C9A227;--gold-light:#ddbb52;--gold-deep:#9c7d1e;--bg:#f3f8f5;--card:#fff;--border:#d6e7de;--text:#1d2b26;--muted:#557068;--radius-lg:6px;--radius-sm:4px;--sidebar-bg:#0b4032;--sidebar-bg2:#0b4032;--sidebar-text:#e6f3ed;--sidebar-muted:#a9cbbd;--topbar-grad-angle:90deg;--accent-stripe-height:3px;--accent-stripe-color:#C9A227;font-family:"Noto Sans","Segoe UI",Tahoma,Arial,sans-serif}' +
  'html[data-design="govt"] .sidebar{border-bottom:3px solid #C9A227}' +
  'html[data-design="govt"] .nav-item.active,html[data-design="govt"] .nav-subitem.active{background:#C9A227!important;color:#0b4032!important}' +

  /* ---- 3 Court Notice Board ---- */
  'html[data-design="court"] body{--navy:#2b261d;--navy2:#3a3226;--navy3:#141414;--gold:#7a5a12;--gold-light:#a07a26;--gold-deep:#5c430c;--bg:#fbfaf7;--card:#fff;--border:#e6e1d6;--text:#1c1c1c;--muted:#5f5a50;--radius-lg:8px;--radius-sm:5px;--sidebar-bg:#ffffff;--sidebar-bg2:#ffffff;--sidebar-text:#1c1c1c;--sidebar-muted:#5f5a50;--font-head:Georgia,"Times New Roman",serif;--topbar-grad-angle:110deg;--accent-stripe-height:3px;--accent-stripe-color:#7a5a12}' +
  'html[data-design="court"] .sidebar{box-shadow:0 2px 10px rgba(0,0,0,.08)}' +
  'html[data-design="court"] .sidebar-head{border-bottom-color:#e6e1d6}' +
  'html[data-design="court"] .nav-item:hover,html[data-design="court"] .nav-group-head:hover,html[data-design="court"] .nav-subitem:hover{background:#f5efe0}' +
  'html[data-design="court"] .nav-item.active,html[data-design="court"] .nav-subitem.active{background:#fbf5e6!important;color:#5c430c!important;box-shadow:inset 0 -2px 0 #7a5a12}' +
  'html[data-design="court"] .sidebar-collapse-btn{color:#1c1c1c;border-color:#ddd}' +
  'html[data-design="court"] h1,html[data-design="court"] h2,html[data-design="court"] h3{font-family:Georgia,"Times New Roman",serif}' +

  /* ---- 4 Tile Launcher ---- */
  'html[data-design="tiles"] body{--navy:#2b5797;--navy2:#2d89ef;--navy3:#1b2a41;--gold:#e3a21a;--gold-light:#f0bd4f;--gold-deep:#b07c10;--bg:#eef1f6;--card:#fff;--border:#d9dfe9;--text:#1b2433;--muted:#5b6678;--radius-lg:0px;--radius-sm:0px;--sidebar-bg:#1b2a41;--sidebar-bg2:#1b2a41;--sidebar-text:#fff;--sidebar-muted:#c9d3e3;--topbar-grad-angle:90deg;font-family:"Segoe UI",Tahoma,Arial,sans-serif}' +
  '@media (min-width:961px){' +
    'html[data-design="tiles"] .sidebar-nav{gap:4px}' +
    'html[data-design="tiles"] .sidebar-nav>.nav-item,html[data-design="tiles"] .sidebar-nav>.nav-group>.nav-group-head{min-height:44px;border-radius:0;color:#fff}' +
    'html[data-design="tiles"] .sidebar-nav>*:nth-child(10n+1)>.nav-group-head,html[data-design="tiles"] .sidebar-nav>.nav-item:nth-child(10n+1){background:#2d89ef}' +
    'html[data-design="tiles"] .sidebar-nav>*:nth-child(10n+2)>.nav-group-head,html[data-design="tiles"] .sidebar-nav>.nav-item:nth-child(10n+2){background:#00a300}' +
    'html[data-design="tiles"] .sidebar-nav>*:nth-child(10n+3)>.nav-group-head,html[data-design="tiles"] .sidebar-nav>.nav-item:nth-child(10n+3){background:#da532c}' +
    'html[data-design="tiles"] .sidebar-nav>*:nth-child(10n+4)>.nav-group-head,html[data-design="tiles"] .sidebar-nav>.nav-item:nth-child(10n+4){background:#9f00a7}' +
    'html[data-design="tiles"] .sidebar-nav>*:nth-child(10n+5)>.nav-group-head,html[data-design="tiles"] .sidebar-nav>.nav-item:nth-child(10n+5){background:#00aba9}' +
    'html[data-design="tiles"] .sidebar-nav>*:nth-child(10n+6)>.nav-group-head,html[data-design="tiles"] .sidebar-nav>.nav-item:nth-child(10n+6){background:#b91d47}' +
    'html[data-design="tiles"] .sidebar-nav>*:nth-child(10n+7)>.nav-group-head,html[data-design="tiles"] .sidebar-nav>.nav-item:nth-child(10n+7){background:#603cba}' +
    'html[data-design="tiles"] .sidebar-nav>*:nth-child(10n+8)>.nav-group-head,html[data-design="tiles"] .sidebar-nav>.nav-item:nth-child(10n+8){background:#1e7145}' +
    'html[data-design="tiles"] .sidebar-nav>*:nth-child(10n+9)>.nav-group-head,html[data-design="tiles"] .sidebar-nav>.nav-item:nth-child(10n+9){background:#2b5797}' +
    'html[data-design="tiles"] .sidebar-nav>*:nth-child(10n+10)>.nav-group-head,html[data-design="tiles"] .sidebar-nav>.nav-item:nth-child(10n+10){background:#b07c10}' +
    'html[data-design="tiles"] .sidebar-nav>.nav-item.active{outline:3px solid #fff;outline-offset:-3px}' +
  '}' +

  /* ---- 5 Command Center (dark, icon rail) ---- */
  'html[data-design="command"] body{--navy:#4f9cf9;--navy2:#2f6fbf;--navy3:#0a0f15;--gold:#f0b44c;--gold-light:#f5c776;--gold-deep:#c48a28;--bg:#0b1016;--card:#111a24;--border:#1f2b3a;--text:#dfe7f1;--muted:#8797ab;--radius-lg:12px;--radius-sm:8px;--sidebar-bg:#070b10;--sidebar-bg2:#070b10;--sidebar-text:#c9d4e2;--sidebar-muted:#7b8ba0;--topbar-grad-angle:90deg;color-scheme:dark}' +
  'html[data-design="command"] .topbar,html[data-design="command"] .topbar2{background:#0f161f!important;border-bottom:1px solid #1f2b3a}' +
  'html[data-design="command"] input,html[data-design="command"] select,html[data-design="command"] textarea{background:#0d151e;color:#dfe7f1;border-color:#2a3a4d}' +
  'html[data-design="command"] table{color:#dfe7f1}' +
  '@media (min-width:961px){' +
    'html[data-design="command"] .sidebar{width:64px!important;border-right:1px solid #18222e}' +
    'html[data-design="command"] .sidebar .label,html[data-design="command"] .sidebar-brand span,html[data-design="command"] .nav-group-head .chev,html[data-design="command"] .sidebar-collapse-btn{display:none}' +
    'html[data-design="command"] .sidebar-head{justify-content:center;padding:12px 6px}' +
    'html[data-design="command"] .nav-item,html[data-design="command"] .nav-group-head,html[data-design="command"] .sidebar-foot a{justify-content:center;padding:10px 0;font-size:16px}' +
    'html[data-design="command"] .nav-item.active{background:#13263b;color:#5fb0ff}' +
    'html[data-design="command"] .nav-submenu{padding-left:0}' +
    'html[data-design="command"] .nav-subitem span:not(.ico){display:none}' +
    'html[data-design="command"] .nav-subitem{justify-content:center}' +
  '}' +

  /* ---- 6 Glass Modern ---- */
  'html[data-design="glass"] body{--navy:#4f46e5;--navy2:#6366f1;--navy3:#312e81;--gold:#db2777;--gold-light:#ec4899;--gold-deep:#9d174d;--bg:#eef0f8;--card:rgba(255,255,255,.66);--border:rgba(255,255,255,.85);--text:#1e1b3a;--muted:#5b5a7a;--radius-lg:18px;--radius-sm:10px;--sidebar-bg:rgba(255,255,255,.55);--sidebar-bg2:rgba(255,255,255,.55);--sidebar-text:#1e1b3a;--sidebar-muted:#5b5a7a;--topbar-grad-angle:120deg;background:radial-gradient(circle at 12% 18%,#c7d2fe 0,transparent 38%),radial-gradient(circle at 88% 8%,#fbcfe8 0,transparent 34%),radial-gradient(circle at 72% 92%,#a7f3d0 0,transparent 40%),#eef0f8;background-repeat:no-repeat;background-attachment:fixed;min-height:100vh}' +
  'html[data-design="glass"] .sidebar{-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.8)}' +
  'html[data-design="glass"] .nav-item:hover,html[data-design="glass"] .nav-group-head:hover,html[data-design="glass"] .nav-subitem:hover{background:rgba(99,102,241,.1)}' +
  'html[data-design="glass"] .nav-item.active,html[data-design="glass"] .nav-subitem.active{background:#1e1b3a!important;color:#fff!important;border-radius:999px}' +
  'html[data-design="glass"] .sidebar-collapse-btn{color:#1e1b3a;border-color:rgba(30,27,58,.2)}' +
  'html[data-design="glass"] .search-box,html[data-design="glass"] .modal-panel,html[data-design="glass"] .card,html[data-design="glass"] .stat-card{-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 8px 30px rgba(60,50,120,.08)}' +
  'html[data-design="glass"] .nav-submenu{background:rgba(255,255,255,.95)}' +
  '@media (prefers-reduced-transparency:reduce){html[data-design="glass"] body{--card:#fff;--sidebar-bg:#fff;--sidebar-bg2:#fff}}' +

  /* ---- 7 Office Register ---- */
  'html[data-design="register"] body{--navy:#5b4a2a;--navy2:#6f5c36;--navy3:#3d311c;--gold:#8c1d1d;--gold-light:#a83a3a;--gold-deep:#6b1414;--bg:#efe6cf;--card:#fbf7ea;--border:#c9b88a;--text:#2d2617;--muted:#6b5f45;--radius-lg:3px;--radius-sm:2px;--sidebar-bg:#d9c99d;--sidebar-bg2:#d9c99d;--sidebar-text:#2d2617;--sidebar-muted:#5a4c2c;--font-head:"Courier New",Courier,monospace;--topbar-grad-angle:90deg}' +
  'html[data-design="register"] .sidebar{border-bottom:1px solid #b9a671}' +
  'html[data-design="register"] .sidebar-nav .nav-item,html[data-design="register"] .sidebar-nav .nav-group-head{font-family:"Courier New",Courier,monospace;font-weight:700}' +
  'html[data-design="register"] .nav-item.active,html[data-design="register"] .nav-subitem.active{background:#fbf7ea!important;color:#2d2617!important;border:1px solid #b9a671;border-bottom-color:#fbf7ea}' +
  'html[data-design="register"] .nav-item:hover,html[data-design="register"] .nav-group-head:hover{background:#e8d9ad}' +
  'html[data-design="register"] .sidebar-collapse-btn{color:#2d2617;border-color:#b9a671}' +
  '@media (min-width:961px){html[data-design="register"] .sidebar-nav .nav-item,html[data-design="register"] .sidebar-nav .nav-group-head{border-radius:8px 8px 0 0}}' +
  'html[data-design="register"] h1,html[data-design="register"] h2,html[data-design="register"] h3{font-family:"Courier New",Courier,monospace;letter-spacing:.02em}' +
  'html[data-design="register"] .nav-submenu{background:#fbf7ea}' +
  'html[data-design="register"] .nav-subitem{color:#2d2617}' +

  /* ---- 8 Case Board ---- */
  'html[data-design="board"] body{--navy:#0f766e;--navy2:#14958b;--navy3:#134e4a;--gold:#0c66e4;--gold-light:#388bff;--gold-deep:#0055cc;--bg:#f4f5f7;--card:#fff;--border:#dfe1e6;--text:#172b4d;--muted:#626f86;--radius-lg:8px;--radius-sm:6px;--sidebar-bg:#134e4a;--sidebar-bg2:#134e4a;--sidebar-text:#e6fffb;--sidebar-muted:#9fd8d0;--topbar-grad-angle:90deg}' +
  'html[data-design="board"] .nav-item.active,html[data-design="board"] .nav-subitem.active{background:#5eead4!important;color:#134e4a!important}' +
  'html[data-design="board"] .search-box,html[data-design="board"] .modal-panel{box-shadow:0 1px 1px rgba(9,30,66,.2),0 0 1px rgba(9,30,66,.3)}' +

  /* ---- design picker ---- */
  '.cmpd-btn{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:999px;height:32px;padding:0 12px;cursor:pointer;font-size:13px;font-family:inherit;white-space:nowrap}' +
  '.cmpd-btn:focus-visible,.cmpd-card:focus-visible,.cmpd-x:focus-visible{outline:2px solid #2563eb;outline-offset:2px}' +
  '.cmpd-ov{position:fixed;inset:0;background:rgba(10,14,26,.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px}' +
  '.cmpd-pn{background:#fff;color:#18212d;border-radius:14px;max-width:760px;width:100%;max-height:90vh;overflow:auto;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.35);font-family:"Segoe UI",Tahoma,Arial,sans-serif}' +
  '.cmpd-hd{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}' +
  '.cmpd-hd b{font-size:16px}' +
  '.cmpd-x{background:#eef1f5;border:0;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:16px}' +
  '.cmpd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}' +
  '.cmpd-card{border:2px solid #e2e6ec;border-radius:12px;background:#fff;padding:0;cursor:pointer;text-align:left;font-family:inherit;color:#18212d;overflow:hidden}' +
  '.cmpd-card[aria-pressed="true"]{border-color:#2563eb}' +
  '.cmpd-sw{display:flex;height:40px}.cmpd-sw i{flex:1}' +
  '.cmpd-t{padding:8px 10px;display:grid;gap:2px}' +
  '.cmpd-t b{font-size:13px}' +
  '.cmpd-t span{font-size:12.5px;color:#5b6676;direction:rtl;text-align:right}' +
  '.cmpd-note{font-size:12px;color:#5b6676;margin-top:12px;line-height:1.6}' +
  '.cmpd-office{margin-top:12px;padding:10px 12px;background:#f3f6fa;border-radius:10px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:13px}' +
  '.cmpd-act{border:1px solid #c9d3e0;background:#fff;color:#18212d;border-radius:8px;padding:6px 10px;cursor:pointer;font:inherit;font-size:12.5px}' +
  '.cmpd-act.pri{background:#2563eb;color:#fff;border-color:#2563eb}' +
  '.cmpd-msg{font-size:12px;color:#1f7a3f;width:100%}.cmpd-msg.err{color:#b42318}' +
  '}';
  var st = document.createElement('style');
  st.id = 'cmp-design-css';
  st.textContent = css;
  (document.head || root).appendChild(st);

  /* ---------- apply ---------- */
  var savedTheme = null;
  function applyBodyBits(){
    if(!document.body) return;
    /* Command Center reuses each page's own "night" colour rules */
    if(current==='command'){
      if(savedTheme===null) savedTheme = document.body.getAttribute('data-theme') || '';
      document.body.setAttribute('data-theme','night');
    } else if(savedTheme!==null){
      var t=''; try{ t=localStorage.getItem('cmpTheme')||''; }catch(e){}
      if(t) document.body.setAttribute('data-theme', t); else document.body.removeAttribute('data-theme');
      savedTheme = null;
    }
    /* icon-only links need a tooltip */
    var links = document.querySelectorAll('.sidebar .nav-item, .sidebar .nav-group-head, .sidebar-foot a, .sidebar .nav-subitem');
    for(var i=0;i<links.length;i++){ if(!links[i].title) links[i].title = (links[i].textContent||'').trim(); }
  }
  function setDesign(id){
    if(!valid(id)) return;
    current = id;
    root.setAttribute('data-design', id);
    lset(KEY, id);
    applyBodyBits();
    var cards = document.querySelectorAll('.cmpd-card');
    for(var i=0;i<cards.length;i++) cards[i].setAttribute('aria-pressed', cards[i].getAttribute('data-id')===id ? 'true':'false');
    try{ window.dispatchEvent(new CustomEvent('cmp-design-change',{detail:{design:id}})); }catch(e){}
  }

  /* ---------- picker ---------- */
  function openPicker(){
    if(document.getElementById('cmpdOverlay')) return;
    var ov = document.createElement('div');
    ov.className='cmpd-ov'; ov.id='cmpdOverlay';
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('aria-label','Choose a design');
    var h = '<div class="cmpd-pn"><div class="cmpd-hd"><b>Portal design / پورٹل کا ڈیزائن</b><button class="cmpd-x" type="button" aria-label="Close">✕</button></div><div class="cmpd-grid">';
    for(var i=0;i<DESIGNS.length;i++){
      var d=DESIGNS[i];
      h += '<button type="button" class="cmpd-card" data-id="'+d.id+'" aria-pressed="'+(d.id===current?'true':'false')+'"><span class="cmpd-sw"><i style="background:'+d.c[0]+'"></i><i style="background:'+d.c[1]+'"></i><i style="background:'+d.c[2]+'"></i></span><span class="cmpd-t"><b>'+(i+1)+'. '+d.en+'</b><span>'+d.ur+'</span></span></button>';
    }
    h += '</div><div class="cmpd-office" id="cmpdOffice"></div><div class="cmpd-note">Click a design to apply it for every user, on every page and system. Printing and PDFs are not affected. / کسی ڈیزائن پر کلک کریں تو وہ ہر صارف کے لیے، ہر صفحے اور سسٹم پر لگ جائے گا۔ پرنٹ اور PDF پر کوئی اثر نہیں۔</div></div>';
    ov.innerHTML = h;
    document.body.appendChild(ov);
    function close(){ if(ov.parentNode) ov.parentNode.removeChild(ov); document.removeEventListener('keydown', onKey); }
    function onKey(e){ if(e.key==='Escape') close(); }
    document.addEventListener('keydown', onKey);
    ov.addEventListener('click', function(e){
      if(e.target===ov || e.target.closest('.cmpd-x')) return close();
      var c = e.target.closest('.cmpd-card');
      if(c){ if(isSuper) saveOffice(c.getAttribute('data-id')); else drawOffice('Only the Super Admin can change the design. / ڈیزائن صرف Super Admin بدل سکتا ہے۔', true); }
    });
    drawOffice();
    var first = ov.querySelector('.cmpd-card[aria-pressed="true"]') || ov.querySelector('.cmpd-card');
    if(first) first.focus();
  }
  /* ---------- office default (Admin / Super Admin sets it for everyone) ---------- */
  function drawOffice(msg, err){
    var st = document.getElementById('cmpdCardStat');
    if(st) st.textContent = 'Now: ' + nameOf(current) + ' / ابھی: ' + nameOf(current);
    var box = document.getElementById('cmpdOffice'); if(!box) return;
    var h = '<span>Design for everyone / سب کے لیے ڈیزائن: <b>'+nameOf(current)+'</b></span>';
    if(msg) h += '<span class="cmpd-msg'+(err?' err':'')+'">'+msg+'</span>';
    box.innerHTML = h;
  }
  function mountControlPanel(){
    if(!isSuper || !/control-panel\.html$/.test(location.pathname || '') || document.getElementById('cmpdCard')) return;
    var grid = document.querySelector('.cp-sec .cp-grid'); if(!grid) return;
    var c = document.createElement('div');
    c.className = 'md-card cp-card'; c.id = 'cmpdCard';
    c.innerHTML = '<h4>Portal design / پورٹل کا ڈیزائن</h4><p>Layout and style of the whole portal and every system, for all users. Only the Super Admin can change it. / پورے پورٹل اور تمام سسٹمز کا ڈیزائن، سب صارفین کے لیے۔ اسے صرف Super Admin بدل سکتا ہے۔</p><div class="cp-stat" id="cmpdCardStat"></div><div class="cp-act"><button class="mdb" type="button" id="cmpdCardBtn">🖼️ Choose design / ڈیزائن چنیں</button></div>';
    grid.insertBefore(c, grid.firstChild);
    document.getElementById('cmpdCardBtn').addEventListener('click', openPicker);
    drawOffice();
  }
  function db(){ try{ return (window.firebase && firebase.apps && firebase.apps.length) ? firebase.firestore() : null; }catch(e){ return null; } }
  function saveOffice(id){
    var d = db(); if(!d || !officeUser){ drawOffice('Not signed in. / سائن اِن نہیں۔', true); return; }
    d.collection('lookupLists').doc('portalDesign').set({ design:id, updatedBy: officeUser.email || '', updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge:true })
      .then(function(){ lset('cmpDesignOffice', id); setDesign(id); drawOffice('Saved: every user now sees "'+nameOf(id)+'". / محفوظ ہو گیا، اب سب کو یہی ڈیزائن نظر آئے گا۔'); })
      .catch(function(e){ drawOffice('Could not save: '+((e&&e.code)||'error')+' / محفوظ نہیں ہوا', true); });
  }
  function syncOffice(){
    var tries = 0;
    (function wait(){
      if(!(window.firebase && firebase.apps && firebase.apps.length && firebase.auth)){ if(++tries < 60) setTimeout(wait, 500); return; }
      firebase.auth().onAuthStateChanged(function(u){
        officeUser = u || null; if(!u) return;
        var d = db(); if(!d) return;
        d.collection('lookupLists').doc('portalDesign').get().then(function(doc){
          var o = doc && doc.exists ? (doc.data()||{}).design : null;
          if(!valid(o)) o = 'classic';
          lset('cmpDesignOffice', o);
          if(o!==current) setDesign(o);
          drawOffice();
        }).catch(function(){});
        d.collection('users').doc(u.uid).get().then(function(doc){
          var x = doc && doc.exists ? doc.data()||{} : {};
          var r = x.roleV2 || (x.role==='admin' ? 'admin' : '');
          isSuper = (r==='super_admin');
          mountControlPanel();
          drawOffice();
        }).catch(function(){});
      });
    })();
  }

  window.cmpDesign = { list: DESIGNS.map(function(d){ return {id:d.id,en:d.en,ur:d.ur}; }), get: function(){ return current; }, set: setDesign, open: openPicker };

  /* other tabs/pages in this browser follow a change */
  window.addEventListener('storage', function(e){ if(e.key===KEY && valid(e.newValue) && e.newValue!==current){ current=e.newValue; root.setAttribute('data-design', current); applyBodyBits(); } });

  function ready(){ applyBodyBits(); syncOffice(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
