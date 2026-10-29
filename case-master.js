/* case-master.js — ONE master table of Case Type -> Categories for the whole portal.
   Used by Daily Case Entry, Case Notice, Cause List Import and Lookup, so every page offers exactly the
   same case types and the same categories for each type.

   The word "Category" (زمرہ) is what older screens called "Relief Sought" / "Relief / Nature". The value is still
   stored in the old field name `relief`, so no saved record needs to change its shape.

   Live copy:  Firestore  lookupLists/caseMaster  =  { items: [ { type:'Crl.P.L.A.', categories:[...] }, ... ] }
   (Admins can edit it; if it is missing or unreadable the built-in table below is used.) */
(function(){
  'use strict';

  var TAIL = ['Restoration', 'Misc. Matter', 'Other'];
  function uniq(a){ var o = [], s = {}; a.forEach(function(x){ if(!s[x]){ s[x] = 1; o.push(x); } }); return o; }

  var DEFAULT_ITEMS = [
    { type: 'Crl.P.L.A.', categories: uniq(['Bail Before Arrest','Bail After Arrest','Cancellation of Bail','Against Acquittal','Setting Aside of Acquittal','Enhancement of Sentence','Life Imprisonment','Death Sentence','Other Sentence','Revision Petition','Supardari'].concat(TAIL)) },
    { type: 'Crl.A.',     categories: uniq(['Life Imprisonment','Death Sentence','Other Sentence','Enhancement of Sentence','Setting Aside of Acquittal'].concat(TAIL)) },
    { type: 'J.P.',       categories: ['Life Imprisonment','Death Sentence','Other Sentence','Other'] },
    { type: 'Crl.M.A.',   categories: uniq(['Compromise','Suspension of Sentence','Supardari','Life Imprisonment','Death Sentence','Other Sentence','Enhancement of Sentence','Against Acquittal'].concat(TAIL)) },
    { type: 'Crl.R.P.',   categories: uniq(['Revision Petition','Life Imprisonment','Death Sentence','Other Sentence','Enhancement of Sentence'].concat(TAIL)) },
    { type: 'Crl.S.M.R.P.', categories: uniq(['Revision Petition','Life Imprisonment','Death Sentence','Other Sentence','Enhancement of Sentence'].concat(TAIL)) },
    { type: 'C.P.L.A.',   categories: TAIL.slice() },
    { type: 'C.A.',       categories: TAIL.slice() },
    { type: 'C.M.A.',     categories: TAIL.slice() },
    { type: 'Crl.O.P.',   categories: TAIL.slice() },
    { type: 'H.R.C.',     categories: TAIL.slice() },
    { type: 'C.P.',       categories: TAIL.slice() },
    { type: 'Const.P.',   categories: TAIL.slice() },
    { type: 'Other',      categories: ['Misc. Matter','Other'] }
  ];

  /* spellings that were typed wrongly in the past -> the correct category */
  var FIX = {
    'misc. mater': 'Misc. Matter', 'misc. matter': 'Misc. Matter', 'miscellaneous / supardari': 'Supardari',
    'other sentanc': 'Other Sentence', 'compormise': 'Compromise', 'against acquital': 'Against Acquittal',
    'restroation impresment': 'Restoration'
  };

  var ITEMS = DEFAULT_ITEMS.map(function(x){ return { type: x.type, categories: x.categories.slice() }; });
  var listeners = [];
  var connected = false;

  function norm(t){ return String(t == null ? '' : t).replace(/[\s.]+/g, '').toLowerCase(); }
  function find(type){
    var n = norm(type);
    for(var i = 0; i < ITEMS.length; i++) if(norm(ITEMS[i].type) === n) return ITEMS[i];
    return null;
  }
  function fire(){ listeners.forEach(function(fn){ try { fn(); } catch(e){ console.error('CaseMaster listener', e); } }); }

  var CM = {
    /* the case types, in display order */
    types: function(){ return ITEMS.map(function(x){ return x.type; }); },
    /* the categories that belong to one case type (a type that is not in the table gets the general ones) */
    categoriesFor: function(type){
      var it = find(type);
      return (it ? it.categories : ['Misc. Matter', 'Other']).slice();
    },
    /* true when the category is empty, or belongs to this case type */
    allows: function(type, category){
      if(!category) return true;
      return CM.categoriesFor(type).indexOf(CM.fix(category)) >= 0;
    },
    /* every category of every type, no repeats (for filters that are not tied to one type) */
    allCategories: function(){
      var o = [];
      ITEMS.forEach(function(x){ x.categories.forEach(function(c){ if(o.indexOf(c) < 0) o.push(c); }); });
      return o;
    },
    /* the table's own name for a type typed in a different spelling (CRL.P. / crl.p.la ...), or '' */
    canonType: function(type){ var it = find(type); return it ? it.type : ''; },
    /* corrects a known wrong spelling of a category */
    fix: function(category){ var k = String(category == null ? '' : category).trim(); return FIX[k.toLowerCase()] || k; },
    items: function(){ return ITEMS.map(function(x){ return { type: x.type, categories: x.categories.slice() }; }); },
    defaults: function(){ return DEFAULT_ITEMS.map(function(x){ return { type: x.type, categories: x.categories.slice() }; }); },
    /* call fn now and again every time the table changes */
    onChange: function(fn){ listeners.push(fn); try { fn(); } catch(e){ console.error(e); } },
    /* replace the table in memory (used when the live copy loads) */
    setItems: function(items){
      if(!Array.isArray(items) || !items.length) return;
      var out = [];
      items.forEach(function(x){
        if(x && x.type && Array.isArray(x.categories)) out.push({ type: String(x.type), categories: x.categories.map(String) });
      });
      if(!out.length) return;
      ITEMS = out; fire();
    },
    /* start listening to the live copy in Firestore (db = firebase.firestore()) */
    connect: function(db){
      if(connected || !db) return; connected = true;
      db.collection('lookupLists').doc('caseMaster').onSnapshot(function(doc){
        if(doc.exists && doc.data() && Array.isArray(doc.data().items)) CM.setItems(doc.data().items);
      }, function(err){ console.error('caseMaster', err); });
    },
    /* save the table (Admin only; Firestore rules decide) */
    save: function(db, items, by){
      return db.collection('lookupLists').doc('caseMaster').set({
        items: items, updatedBy: by || '', updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  };

  window.CaseMaster = CM;
})();
