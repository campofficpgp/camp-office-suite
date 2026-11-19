/*! Camp Office — one employee record for the Employee Directory and the Bill Register (emp-sync.js)
   The 22 employees live in two places: Firestore "employees" (Employee Directory: profile, CNIC, account) and
   appData_bill/shared.employees (Bill Register: pay slips, BM-26, TR-22). This keeps the two the same, field by field.
   How: a 3-way check against the last value both agreed on (kept in appData_bill/empSync). If only one side changed,
   that change is copied to the other side. If both changed to different values, nothing is overwritten and the
   difference is listed for the Super Admin. Runs only for a signed-in Super Admin (the only role that can read CNIC /
   account in both places); for everyone else it does nothing. Nothing is ever deleted. */
(function(){
  'use strict';
  if(window.__cmpEmpSync) return; window.__cmpEmpSync = true;
  /* [Bill Register field, Directory field, label] */
  var F = [['name','name','Name'],['designation','designation','Designation'],['bps','scale','BPS'],['soName','father','Father name'],
    ['dob','dob','Date of birth'],['gpf','gpf','GPF No'],['bank','bank','Bank'],['department','department','Department'],
    ['status','status','Status'],['mobile','mobile','Mobile']];
  var S = [['cnic','cnic','CNIC'],['account','account','Account No']];   /* Bill Register keeps these in employeeSensitive/{empId} */
  function nv(v){ v = String(v == null ? '' : v).replace(/\s+/g, ' ').trim(); return (v === '—' || v === '-') ? '' : v; }
  /* "0324-5006422" and "03245006422" are the same number: spaces, dashes and dots never count as a difference */
  function same(a, b){ function k(v){ return nv(v).toLowerCase().replace(/[\s.\-]/g, ''); } return k(a) === k(b); }
  var busy = false, again = false, timer = null, last = null;
  window.CmpEmpSync = { lastResult: function(){ return last; }, runNow: function(){ return run(); } };

  function note(msg){
    try{
      var d = document.getElementById('cmp-empsync-note');
      if(!d){ d = document.createElement('div'); d.id = 'cmp-empsync-note';
        d.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:2147482000;max-width:360px;background:#0f172a;color:#fff;padding:10px 14px;border-radius:10px;font:600 12.5px/1.5 system-ui,Segoe UI,Arial,sans-serif;box-shadow:0 8px 24px rgba(15,23,42,.3);transition:opacity .3s';
        document.body.appendChild(d); }
      d.innerHTML = msg; d.style.opacity = '1';
      clearTimeout(d.__t); d.__t = setTimeout(function(){ d.style.opacity = '0'; }, 7000);
    }catch(e){}
  }

  function run(){
    if(busy){ again = true; return Promise.resolve(); }
    var fb = window.firebase; if(!fb || !fb.firestore || !fb.auth || !fb.auth().currentUser) return Promise.resolve();
    var db = fb.firestore(), shared = db.collection('appData_bill').doc('shared'), baseRef = db.collection('appData_bill').doc('empSync');
    busy = true;
    var who = fb.auth().currentUser.email || '';
    return Promise.all([db.collection('employeeSensitive').get(), db.collection('employees').get(), baseRef.get()]).then(function(r){
      var sens = {}; r[0].docs.forEach(function(d){ sens[d.id] = d.data(); });
      var edDocs = {}; r[1].docs.forEach(function(d){ var x = d.data(); if(x.pers != null) edDocs[String(x.pers)] = d; });
      var base = (r[2].exists && r[2].data().base) || {};
      var edUpd = {}, brUpd = {}, sensUpd = {}, conflicts = [], copied = [], newBase = JSON.parse(JSON.stringify(base));
      return db.runTransaction(function(tx){
        return tx.get(shared).then(function(snap){
          var st = snap.data() || {}, emps = JSON.parse(JSON.stringify(st.employees || []));
          edUpd = {}; brUpd = {}; sensUpd = {}; conflicts = []; copied = []; newBase = JSON.parse(JSON.stringify(base));
          emps.forEach(function(b){
            var pers = String(b.persNo || ''); if(!pers || !edDocs[pers]) return;
            var e = edDocs[pers].data(), o = newBase[pers] = newBase[pers] || {}, sv = sens[b.id] || {};
            function one(bVal, eVal, key, label, setB, setE){
              if(same(bVal, eVal)){ o[key] = nv(bVal); return; }
              var had = Object.prototype.hasOwnProperty.call(o, key), ob = o[key];
              var useE = null;
              if(!had){ if(!nv(bVal)) useE = true; else if(!nv(eVal)) useE = false; }
              else if(same(bVal, ob)) useE = true; else if(same(eVal, ob)) useE = false;
              /* safety: a sync never blanks a filled field (an old browser tab saving an empty value must not wipe data) */
              if(useE === true && !nv(eVal) && nv(bVal)) useE = false; else if(useE === false && !nv(bVal) && nv(eVal)) useE = true;
              if(useE === null){ conflicts.push(b.name + ' — ' + label + ': Bill Register "' + nv(bVal) + '" / Directory "' + nv(eVal) + '"'); return; }
              if(useE){ setB(nv(eVal)); o[key] = nv(eVal); copied.push(b.name + ' · ' + label + ' → Bill Register'); }
              else { setE(nv(bVal)); o[key] = nv(bVal); copied.push(b.name + ' · ' + label + ' → Directory'); }
            }
            F.forEach(function(f){
              one(b[f[0]], e[f[1]], f[0], f[2], function(v){ b[f[0]] = v; brUpd[pers] = 1; }, function(v){ (edUpd[pers] = edUpd[pers] || {})[f[1]] = v; });
            });
            S.forEach(function(f){
              one(sv[f[0]], e[f[1]], f[0], f[2], function(v){ (sensUpd[b.id] = sensUpd[b.id] || Object.assign({cnic: sv.cnic || '', account: sv.account || ''}, {}))[f[0]] = v; }, function(v){ (edUpd[pers] = edUpd[pers] || {})[f[1]] = v; });
            });
          });
          if(Object.keys(brUpd).length) tx.update(shared, {employees: emps});
          return true;
        });
      }).then(function(){
        var nothing = !Object.keys(edUpd).length && !Object.keys(sensUpd).length && !Object.keys(brUpd).length &&
          JSON.stringify(newBase) === JSON.stringify(base) && JSON.stringify(conflicts) === JSON.stringify((r[2].exists && r[2].data().conflicts) || []);
        if(nothing){ last = {copied: [], conflicts: conflicts, at: new Date().toISOString()}; return; }
        var batch = db.batch(), n = 0;
        Object.keys(edUpd).forEach(function(pers){ var u = edUpd[pers]; u.updatedAt = fb.firestore.FieldValue.serverTimestamp(); u.updatedBy = who + ' (sync)'; batch.update(edDocs[pers].ref, u); n++; });
        Object.keys(sensUpd).forEach(function(id){ batch.set(db.collection('employeeSensitive').doc(id), sensUpd[id], {merge: true}); n++; });
        batch.set(baseRef, {base: newBase, at: fb.firestore.FieldValue.serverTimestamp(), by: who, conflicts: conflicts}, {merge: false}); n++;
        return batch.commit().then(function(){
          last = {copied: copied, conflicts: conflicts, at: new Date().toISOString()};
          if(copied.length) note('🔄 Employee record synced (Directory ⇄ Bill Register):<br>' + copied.slice(0, 6).join('<br>') + (copied.length > 6 ? '<br>… +' + (copied.length - 6) + ' more' : ''));
          if(conflicts.length) note('⚠ ' + conflicts.length + ' employee field(s) differ in both places — please choose the right value:<br>' + conflicts.slice(0, 4).join('<br>'));
        });
      });
    }).catch(function(err){ last = {error: String(err && err.message || err)}; /* not a Super Admin, or offline: do nothing */ })
      .then(function(){ busy = false; if(again){ again = false; soon(); } });
  }
  function soon(){ clearTimeout(timer); timer = setTimeout(run, 2500); }
  function start(){
    var fb = window.firebase; if(!fb || !fb.auth || !fb.firestore){ return setTimeout(start, 1500); }
    fb.auth().onAuthStateChanged(function(u){
      if(!u) return;
      var db = fb.firestore();
      soon();
      try{ db.collection('employees').onSnapshot(function(){ soon(); }, function(){}); }catch(e){}
      try{ db.collection('appData_bill').doc('shared').onSnapshot(function(){ soon(); }, function(){}); }catch(e){}
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
