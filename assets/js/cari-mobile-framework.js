/* TCR3WEB ERP 600 MASTER CLEAN - Cari Mobile/Tablet Framework */
(function(){
'use strict';
const NS='cmf';
function qsa(s,r=document){return Array.from(r.querySelectorAll(s))}
function labelTables(root=document){
 qsa('table.data:not([data-cmf-ready])',root).forEach(table=>{
  const headers=qsa('thead th',table).map(th=>th.textContent.trim());
  table.classList.add('cmf-card-table'); table.dataset.cmfReady='1';
  qsa('tbody tr',table).forEach(row=>qsa(':scope > td',row).forEach((td,i)=>{
   td.dataset.cmfLabel=headers[i]||'';
   if(i===0) td.classList.add('cmf-primary');
   if(i===headers.length-1 || /işlem/i.test(headers[i]||'')) td.classList.add('cmf-actions');
  }));
 });
}
function cleanToolbar(root=document){
 qsa('.toolbar:not([data-cmf-toolbar])',root).forEach(toolbar=>{
  toolbar.dataset.cmfToolbar='1';
  const search=toolbar.querySelector('input[type="search"],input[placeholder*="ara" i]');
  if(!search)return;
  let size=toolbar.querySelector('.cmf-page-size');
  if(!size){size=document.createElement('select');size.className='filter-select cmf-page-size';size.innerHTML='<option>10</option><option>25</option><option>50</option><option>100</option><option>250</option><option value="all">Hepsi</option>';toolbar.insertBefore(size,toolbar.firstChild)}
  if(!toolbar.querySelector('.cmf-clear')){const b=document.createElement('button');b.type='button';b.className='btn btn-ghost cmf-clear';b.title='Temizle';b.setAttribute('aria-label','Aramayı temizle');b.innerHTML='⌫';b.onclick=()=>{search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));search.focus()};toolbar.appendChild(b)}
 });
}
function modalFix(root=document){qsa('.picker-modal-box,.picker-modal',root).forEach(x=>x.classList.add('cmf-picker'))}
function init(root=document){document.body.classList.add('cmf-ready');labelTables(root);cleanToolbar(root);modalFix(root)}
function boot(){init();const target=document.getElementById('app')||document.body;new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)init(n)}))).observe(target,{childList:true,subtree:true});window.addEventListener('resize',()=>document.body.classList.toggle('cmf-mobile',innerWidth<768),{passive:true});document.body.classList.toggle('cmf-mobile',innerWidth<768)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.TCR3CariFramework={init,labelTables,cleanToolbar};
})();
