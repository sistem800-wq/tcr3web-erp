/* TCR3WEB ERP 600 MASTER CLEAN FINAL
   Shared Cari responsive framework. Compatible with server-rendered Laravel 12 Blade/Livewire rows. */
(function(){
  'use strict';
  const page=(location.pathname.split('/').pop()||'').replace(/\.html$/,'');
  const supported=new Set(['cari','cari-islemler','cari-fisleri','cari-fis-form','cari-ekstre']);
  if(!supported.has(page)) return;

  document.documentElement.classList.add('tcr-cari-clean');
  document.body.classList.add('tcr-cari-clean','tcr-page-'+page);

  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));

  function markTables(root=document){
    qa('table.data, table[data-mobile-cards], #cariFisTable',root).forEach(table=>{
      table.classList.add('tcr-mobile-cards');
      table.dataset.tcrPagination='off';
      const headers=qa('thead th',table).map(th=>th.textContent.trim());
      qa('tbody tr',table).forEach(row=>{
        Array.from(row.cells).forEach((cell,index)=>{
          const label=cell.dataset.label || headers[index] || '';
          cell.dataset.label=label;
          if(/^(işlem|işlemler)$/i.test(label)||cell.querySelector('.icon-btn,.table-actions,.actions')) cell.classList.add('tcr-action-column');
          if(/^(cari|ünvan|cari \/ içerik|açıklama)$/i.test(label)) cell.dataset.mobileSpan='2';

          const normalized=label.toLocaleLowerCase('tr-TR').replace(/\s+/g,' ').trim();
          cell.classList.remove('tcr-mobile-primary','tcr-mobile-status','tcr-mobile-title','tcr-mobile-secondary','tcr-mobile-extra');
          if(/^(kod|cari kod|işlem no|fiş no|hareket no|belge no|stok kodu|sipariş no|teklif no|fatura no)$/.test(normalized)){
            cell.classList.add('tcr-mobile-primary');
          }else if(normalized==='durum'){
            cell.classList.add('tcr-mobile-status');
          }else if(/^(ünvan|cari|cari \/ içerik|stok|stok adı|açıklama)$/.test(normalized)){
            cell.classList.add('tcr-mobile-title');
          }else if(/^(tip|şehir|tarih|vade|bakiye|tutar|kasa \/ banka \/ portföy|kasa \/ banka \/ pos|borç|alacak)$/.test(normalized)){
            cell.classList.add('tcr-mobile-secondary');
          }else if(!cell.classList.contains('tcr-action-column')){
            cell.classList.add('tcr-mobile-extra');
          }
        });
      });
    });
  }

  function resetFilters(toolbar){
    qa('input',toolbar).forEach(el=>{el.value='';el.dispatchEvent(new Event('input',{bubbles:true}));});
    qa('select:not(.tcr-page-size)',toolbar).forEach(el=>{el.selectedIndex=0;el.dispatchEvent(new Event('change',{bubbles:true}));});
    applyPageSize(toolbar);
  }

  function applyPageSize(toolbar){
    const select=q('.tcr-page-size',toolbar);
    const table=q('table',toolbar.closest('.card')||document);
    if(!select||!table) return;
    const visible=qa('tbody tr',table).filter(row=>row.dataset.filterHidden!=='1' && getComputedStyle(row).display!=='none');
    const max=select.value==='all'?Infinity:Number(select.value||10);
    visible.forEach((row,index)=>{row.hidden=index>=max;});
  }

  function standardizeToolbar(root=document){
    qa('.toolbar',root).forEach(toolbar=>{
      if(toolbar.dataset.cleanToolbar==='1') return;
      toolbar.dataset.cleanToolbar='1';
      toolbar.classList.add('tcr-mobile-toolbar');
      qa('.tcr-search-action-group,.tcr-table-page-size,.tcr-responsive-label',toolbar).forEach(x=>x.remove());

      let size=q('.tcr-page-size',toolbar);
      if(!size){
        size=document.createElement('select');
        size.className='filter-select tcr-page-size';
        size.setAttribute('aria-label','Kayıt sayısı');
        size.innerHTML='<option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option><option value="250">250</option><option value="all">Hepsi</option>';
        toolbar.prepend(size);
      }

      let clear=q('.tcr-toolbar-clear',toolbar);
      if(!clear){
        clear=document.createElement('button');
        clear.type='button';
        clear.className='btn btn-ghost tcr-toolbar-clear';
        clear.title='Filtreleri temizle';
        clear.setAttribute('aria-label','Filtreleri temizle');
        clear.innerHTML='<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 18 18"/><path d="M10 6h10"/><path d="M19 6v10.5a2.5 2.5 0 0 1-2.5 2.5H9"/></svg>';
        toolbar.append(clear);
      }
      clear.onclick=()=>resetFilters(toolbar);
      size.onchange=()=>applyPageSize(toolbar);
      requestAnimationFrame(()=>applyPageSize(toolbar));
    });
  }

  function markPicker(root=document){
    qa('.modal',root).forEach(modal=>{
      const text=(modal.textContent||'').toLocaleLowerCase('tr-TR');
      if(text.includes('cari seç')||text.includes('cari hesap seç')){
        modal.classList.add('tcr-cari-picker-clean');
        modal.setAttribute('data-bs-backdrop','static');
        modal.setAttribute('data-bs-keyboard','false');
      }
    });
  }

  function cleanupLegacy(root=document){
    qa('.tcr-search-action-group,.tcr-table-generated-toolbar,.tcr-table-pagination-footer',root).forEach(x=>x.remove());
    qa('table.tcr-mobile-cards td',root).forEach(td=>['left','right','top','bottom','position','transform'].forEach(prop=>td.style.removeProperty(prop)));
  }

  function enhance(root=document){markTables(root);standardizeToolbar(root);markPicker(root);cleanupLegacy(root);}
  const boot=()=>enhance(document);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();

  let scheduled=false;
  new MutationObserver(()=>{
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;enhance(document);});
  }).observe(document.documentElement,{childList:true,subtree:true});

  window.TCRMobileTablet={refresh:boot,applyPageSize};
})();
