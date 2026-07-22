/* Tcr3WEB MASTER v1.0 - Cache, Responsive, 100-user ready client layer */
(function(){
  'use strict';
  const VERSION = '20260712-618';
  window.TCR3_VERSION = VERSION;
  window.TCR3_PERF = {
    version: VERSION,
    targetConcurrentUsers: 100,
    mode: 'html-master-laravel-ready',
    debounce(fn, wait){let t;return function(){clearTimeout(t);const a=arguments,c=this;t=setTimeout(()=>fn.apply(c,a),wait||180)}},
    throttle(fn, wait){let last=0,t;return function(){const now=Date.now(),a=arguments,c=this;if(now-last>=(wait||120)){last=now;fn.apply(c,a)}else{clearTimeout(t);t=setTimeout(()=>{last=Date.now();fn.apply(c,a)},(wait||120)-(now-last))}}},
    idle(fn){return ('requestIdleCallback' in window)?requestIdleCallback(fn,{timeout:900}):setTimeout(fn,1)}
  };
  function setViewportClass(){
    const w=window.innerWidth,b=document.body;
    b.classList.toggle('bp-mobile',w<768);b.classList.toggle('bp-tablet',w>=768&&w<1181);b.classList.toggle('bp-1366',w>=1181&&w<=1599);b.classList.toggle('bp-wide',w>=1920);
  }
  window.addEventListener('resize',window.TCR3_PERF.throttle(setViewportClass,120),{passive:true});
  document.addEventListener('DOMContentLoaded',setViewportClass);
  document.addEventListener('click',function(e){
    const btn=e.target.closest&&e.target.closest('button,[data-once]');
    if(!btn || btn.dataset.noLock==='1') return;
    if(btn.classList.contains('js-busy')){e.preventDefault();e.stopPropagation();return;}
    btn.classList.add('js-busy');setTimeout(()=>btn.classList.remove('js-busy'),450);
  },true);
  document.addEventListener('input',function(e){
    const el=e.target;if(!el || !el.matches('input[type="search"],input[data-live-search],.picker-search input')) return;
    if(el._tcr3InputTimer) clearTimeout(el._tcr3InputTimer);
    el._tcr3InputTimer=setTimeout(()=>el.dispatchEvent(new CustomEvent('tcr3:debounced-input',{bubbles:true,detail:{value:el.value}})),160);
  },true);
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('img:not([loading])').forEach(img=>img.loading='lazy');
    document.querySelectorAll('table').forEach(t=>{if(!t.closest('.table-wrap,.grid-table-wrap,.erp-table-wrap')){const w=document.createElement('div');w.className='table-wrap';t.parentNode.insertBefore(w,t);w.appendChild(t);}});
  });
  // HTML statik olduğu için PHP time() yerine build timestamp kullanılır. Her paket değiştiğinde cache kırılır.
  window.tcr3AssetUrl=function(path){return path+(path.includes('?')?'&':'?')+'v='+encodeURIComponent(VERSION)};
})();

/* 661 — Durum renkli sekmeler ve arama temizleme butonu */
(function tcrTabAndSearchEnhancements(){
  'use strict';

  const brushSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.06 11.9 8.07-8.07a2.83 2.83 0 1 1 4 4l-8.07 8.07"/><path d="M7.07 14.94c-1.88 0-3.14 1.1-3.14 2.77 0 1.28-.78 2.23-1.93 2.23 1.33 1.33 3.3 2.06 5.07 2.06 2.76 0 5-1.58 5-4.53 0-1.4-.72-2.53-2-2.53z"/></svg>';

  function normalizeText(value){
    return String(value || '').toLocaleLowerCase('tr-TR').replace(/\s+/g,' ').trim();
  }

  function tabTone(label){
    const text = normalizeText(label);

    // Risk / kapanış durumları
    if (/karşılıksız|karsiliksiz|protesto|protestolu|iptal|red|reddedildi|başarısız|hata|pasif|silindi/.test(text)) return 'danger';
    if (/avukat|hukuk|takipte/.test(text)) return 'neutral';

    // Bekleme / taslak durumları
    if (/onay bek|bekleyen|bekliyor|taslak|askıda|beklemede|süresi geçti|vade/.test(text)) return 'warning';

    // Olumlu / tamamlanan durumlar
    if (/tahsil edildi|ödendi|onaylandı|kabul|tamamlandı|aktif|başarılı|teslim alındı|kapatılan|kapalı/.test(text)) return 'success';

    // Açık süreçler
    if (/tahsile verildi|açık|görüşmede|işlemde|devam|hazırlanıyor|yolda/.test(text)) return 'info';

    // Evrak yönü ve özel durumlar
    if (/portföy|portfoy|dönüştürüldü|özel|usta|servis/.test(text)) return 'purple';
    if (/alınan|alinan|müşteri|giriş/.test(text)) return 'success';
    if (/verilen|çıkış|cikis/.test(text)) return 'warning';

    // Genel sekmeler
    if (/yeni|tümü|tumu|genel/.test(text)) return 'primary';
    return 'neutral';
  }

  function enhanceTabs(root){
    const tabLists = root.matches?.('.tabs') ? [root] : Array.from(root.querySelectorAll?.('.tabs') || []);
    tabLists.forEach(list => list.classList.add('tcr-status-tabs'));

    const tabs = root.matches?.('.tab,[role="tab"]') ? [root] : Array.from(root.querySelectorAll?.('.tabs .tab, [role="tab"]') || []);
    tabs.forEach(tab => {
      const owner = tab.closest?.('.tabs');
      if (owner) owner.classList.add('tcr-status-tabs');
      if (tab.dataset.tcrToneReady !== '1') {
        tab.dataset.tcrToneReady = '1';
        tab.classList.add('tcr-tab-tone-' + tabTone(tab.textContent));
      }
      tab.setAttribute('role', tab.getAttribute('role') || 'tab');
      tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
      tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
    });
  }

  function isSearchInput(input){
    if (!input || input.type === 'hidden' || input.disabled) return false;
    const placeholder = normalizeText(input.getAttribute('placeholder'));
    const cls = String(input.className || '').toLowerCase();
    return input.type === 'search' || /(^|\s)(ara|arama|search)(?=\s|[.!?…,:;]|$)/.test(placeholder) || /(^|[-_\s])(search|arama)([-_\s]|$)/.test(cls);
  }

  function dispatchSearchEvents(input){
    input.dispatchEvent(new Event('input', { bubbles:true }));
    input.dispatchEvent(new Event('change', { bubbles:true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles:true, key:'Backspace' }));
  }

  function enhanceSearchInput(input){
    if (document.body.classList.contains('tcr-cari-clean') || document.body.classList.contains('tcr-cari-master')) return;
    if (!isSearchInput(input) || input.dataset.tcrClearReady === '1') return;
    if (input.closest('.modal,[role="dialog"]') && !input.closest('.evrak-search')) return;

    const wrapper = input.closest('.toolbar-search, .input-icon, .search-box, .filter-search') || input;
    const parent = wrapper.parentElement;
    if (!parent || parent.querySelector(':scope > .tcr-search-clear-btn')) {
      input.dataset.tcrClearReady = '1';
      return;
    }
    if (Array.from(parent.querySelectorAll(':scope > button, :scope > .btn')).some(btn => /temizle/i.test(btn.textContent || ''))) {
      input.dataset.tcrClearReady = '1';
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tcr-search-clear-btn';
    button.title = 'Aramayı temizle';
    button.setAttribute('aria-label','Aramayı temizle');
    button.innerHTML = brushSvg;
    button.addEventListener('click', () => {
      input.value = '';
      dispatchSearchEvents(input);
      input.focus({ preventScroll:true });
    });

    // Arama ve Temizle mobil/tablette daima aynı satırda kalır.
    const group = document.createElement('div');
    group.className = 'tcr-search-action-group';
    const label = document.createElement('label');
    label.className = 'tcr-responsive-label';
    label.textContent = input.getAttribute('data-label') || input.getAttribute('aria-label') || 'Arama';
    const row = document.createElement('div');
    row.className = 'tcr-search-action-row';
    parent.insertBefore(group, wrapper);
    group.appendChild(label);
    group.appendChild(row);
    const pageSize = Array.from(parent.children).find(el => el.classList?.contains('tcr-table-page-size'));
    if (pageSize) row.appendChild(pageSize);
    row.appendChild(wrapper);
    row.appendChild(button);
    input.dataset.tcrClearReady = '1';
  }

  function enhanceSearches(root){
    const inputs = root.matches?.('input') ? [root] : Array.from(root.querySelectorAll?.('input') || []);
    inputs.forEach(enhanceSearchInput);
  }

  function cleanControlLabel(text, fallback){
    const value = String(text || '').replace(/^Tüm\s+/i,'').replace(/\s+Seçiniz$/i,'').trim();
    return value || fallback;
  }

  function enhanceToolbarLabels(root){
    if (document.body.classList.contains('tcr-cari-master')) return;
    const toolbars = root.matches?.('.toolbar,.finance-toolbar,.filter-toolbar,.table-toolbar')
      ? [root]
      : Array.from(root.querySelectorAll?.('.toolbar,.finance-toolbar,.filter-toolbar,.table-toolbar') || []);

    toolbars.forEach(toolbar => {
      toolbar.querySelectorAll('select.filter-select, select.form-input').forEach(select => {
        if (select.dataset.tcrMobileLabelReady === '1' || select.closest('.tcr-filter-field')) return;
        const field = document.createElement('div');
        field.className = 'tcr-filter-field';
        const label = document.createElement('label');
        label.className = 'tcr-responsive-label';
        label.textContent = select.getAttribute('data-label') || select.getAttribute('aria-label') || cleanControlLabel(select.options?.[0]?.textContent, 'Seçim');
        select.parentNode.insertBefore(field, select);
        field.appendChild(label);
        field.appendChild(select);
        select.dataset.tcrMobileLabelReady = '1';
      });

      toolbar.querySelectorAll('input.form-input:not([type="hidden"]):not([type="search"])').forEach(input => {
        if (input.dataset.tcrMobileLabelReady === '1' || input.closest('.tcr-search-action-group,.tcr-filter-field')) return;
        const field = document.createElement('div');
        field.className = 'tcr-filter-field';
        const label = document.createElement('label');
        label.className = 'tcr-responsive-label';
        label.textContent = input.getAttribute('data-label') || input.getAttribute('aria-label') || input.getAttribute('placeholder') || 'Alan';
        input.parentNode.insertBefore(field, input);
        field.appendChild(label);
        field.appendChild(input);
        input.dataset.tcrMobileLabelReady = '1';
      });
    });
  }

  function enhance(root){
    if (!root || root.nodeType !== 1) return;
    enhanceTabs(root);
    enhanceSearches(root);
    enhanceToolbarLabels(root);
  }

  function init(){
    enhance(document.documentElement);
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => mutation.addedNodes.forEach(node => enhance(node)));
    });
    observer.observe(document.body, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();

/* TCR3WEB — Ana liste tabloları kolon seçimi standardı (620) */
(() => {
  'use strict';

  const PAGE_EXCLUDES = new Set([
    'dashboard.html', 'settings.html', 'action-button-standard.html'
  ]);
  const HEADER_EXCLUDES = /^(işlem|işlemler|aksiyon|aksiyonlar)$/i;
  let tableCounter = 0;
  let scheduled = false;

  const settingsIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/>
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.15.37.36.7.6 1 .3.3.7.5 1.1.5H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51.5Z"/>
    </svg>`;

  function currentPage() {
    return (location.pathname.split('/').pop() || '').toLowerCase();
  }

  function isEligibleTable(table) {
    if (!(table instanceof HTMLTableElement)) return false;
    if (!table.matches('#content table.data')) return false;
    if (table.dataset.noColumnSelector === 'true' || table.closest('[data-no-column-selector="true"]')) return false;
    if (PAGE_EXCLUDES.has(currentPage()) || currentPage().includes('-form')) return false;
    if (table.closest('.modal, [role="dialog"], .picker-modal, .document-preview-modal')) return false;
    if (table.classList.contains('tcr-column-managed')) return false;
    if (table.querySelector('.cari-column-selector-head')) return false;
    const row = table.tHead?.rows?.[0];
    return !!row && row.cells.length > 1;
  }

  function tableKey(table) {
    if (table.dataset.tcrColumnKey) return table.dataset.tcrColumnKey;
    const page = currentPage().replace(/\.html$/, '') || 'page';
    const explicit = table.id ? table.id.replace(/[^a-z0-9_-]/gi, '-') : `table-${++tableCounter}`;
    table.dataset.tcrColumnKey = `tcrColumns:${page}:${explicit}`;
    return table.dataset.tcrColumnKey;
  }

  function headerLabel(th, index) {
    const clone = th.cloneNode(true);
    clone.querySelectorAll('button, input, svg, .sort-icon, .tcr-sort-icon').forEach(el => el.remove());
    const text = (clone.textContent || '').replace(/\s+/g, ' ').trim();
    return text || `Kolon ${index + 1}`;
  }

  function loadState(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; }
    catch (_) { return {}; }
  }

  function saveState(key, state) {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch (_) {}
  }

  function ensureBodyCells(table) {
    const expected = table.tHead?.rows?.[0]?.cells.length || 0;
    if (!expected) return;
    Array.from(table.tBodies).forEach(tbody => {
      Array.from(tbody.rows).forEach(row => {
        if (row.querySelector(':scope > td.tcr-column-selector-cell')) return;
        if (row.cells.length === expected - 1) {
          const td = document.createElement('td');
          td.className = 'tcr-column-selector-cell';
          td.setAttribute('aria-hidden', 'true');
          row.appendChild(td);
        }
      });
    });
  }

  function applyVisibility(table, colIndex, visible) {
    const headRow = table.tHead?.rows?.[0];
    if (headRow?.cells[colIndex]) headRow.cells[colIndex].classList.toggle('tcr-col-hidden', !visible);
    Array.from(table.tBodies).forEach(tbody => {
      Array.from(tbody.rows).forEach(row => {
        if (row.cells[colIndex]) row.cells[colIndex].classList.toggle('tcr-col-hidden', !visible);
      });
    });
  }

  function closeAll(except) {
    document.querySelectorAll('.tcr-column-selector-menu.open').forEach(menu => {
      if (menu !== except) {
        menu.classList.remove('open');
        menu.previousElementSibling?.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function findActionColumn(table, headRow) {
    const rows = Array.from(table.tBodies || []).flatMap(tbody => Array.from(tbody.rows)).slice(0, 10);
    let detected = -1;
    Array.from(headRow.cells).forEach((th, index) => {
      const label = headerLabel(th, index).toLocaleLowerCase('tr-TR');
      const labelled = /^(işlem|işlemler|aksiyon|aksiyonlar)$/.test(label);
      const cells = rows.map(row => row.cells[index]).filter(Boolean);
      const actionCount = cells.filter(cell => cell.querySelector('button, a.btn, .icon-btn, .actions, .table-actions, .action-buttons, .row-actions, .finance-actions')).length;
      const inferred = cells.length > 0 && actionCount >= Math.max(1, Math.ceil(cells.length * .6));
      if (labelled || inferred) detected = index;
    });
    return detected;
  }

  function markActionCells(table, index) {
    if (index < 0) return;
    const headRow = table.tHead?.rows?.[0];
    const th = headRow?.cells?.[index];
    if (th) {
      th.classList.add('tcr-action-column');
      th.dataset.sort = 'off';
    }
    Array.from(table.tBodies || []).forEach(tbody => {
      Array.from(tbody.rows).forEach(row => {
        const cell = row.cells[index];
        if (!cell) return;
        cell.classList.add('tcr-action-column');
        const directElements = Array.from(cell.children);
        const hasActionWrap = directElements.some(el => el.matches('.actions,.table-actions,.action-buttons,.row-actions,.finance-actions,.tcr-action-buttons'));
        if (!hasActionWrap && directElements.length > 1 && directElements.every(el => el.matches('button,a,.btn,.icon-btn,.tcr-action,.tcr-table-action'))) {
          const wrap = document.createElement('div');
          wrap.className = 'tcr-action-buttons';
          directElements.forEach(el => wrap.appendChild(el));
          cell.appendChild(wrap);
        }
      });
    });
  }

  function findTableToolbar(table) {
    const scope = table.closest('.card-body, .panel-body, .content-card, section') || table.parentElement;
    let toolbar = scope?.querySelector(':scope > .toolbar, :scope > .tcr-table-toolbar, .toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'toolbar tcr-table-generated-toolbar';
      const wrap = table.closest('.table-wrap') || table;
      wrap.parentElement.insertBefore(toolbar, wrap);
    }
    return toolbar;
  }

  function enhance(table) {
    if (!isEligibleTable(table)) return;
    const headRow = table.tHead.rows[0];
    const originalHeaders = Array.from(headRow.cells);
    const actionIndex = findActionColumn(table, headRow);
    const candidates = originalHeaders
      .map((th, index) => ({ th, index, label: headerLabel(th, index) }))
      .filter(x => x.index !== actionIndex && x.label && !HEADER_EXCLUDES.test(x.label) && !x.th.querySelector('input[type="checkbox"]'));
    if (!candidates.length) return;

    table.classList.add('tcr-column-managed');
    const key = tableKey(table);
    const state = loadState(key);
    const wrap = document.createElement('div');
    wrap.className = 'tcr-column-selector-wrap';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tcr-column-selector-btn';
    button.title = 'Kolon Seç';
    button.setAttribute('aria-label', 'Kolon Seç');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = settingsIcon;
    const menu = document.createElement('div');
    menu.className = 'tcr-column-selector-menu';

    candidates.forEach(({ index, label }) => {
      const id = `${key.replace(/[^a-z0-9]/gi, '-')}-${index}`;
      const checked = state[index] !== false;
      const item = document.createElement('label');
      item.setAttribute('for', id);
      item.innerHTML = `<input id="${id}" type="checkbox" ${checked ? 'checked' : ''}><span>${label}</span>`;
      const input = item.querySelector('input');
      input.addEventListener('change', () => {
        const current = loadState(key);
        current[index] = input.checked;
        saveState(key, current);
        applyVisibility(table, index, input.checked);
      });
      menu.appendChild(item);
      applyVisibility(table, index, checked);
    });

    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const opening = !menu.classList.contains('open');
      closeAll(menu);
      menu.classList.toggle('open', opening);
      button.setAttribute('aria-expanded', String(opening));
    });
    menu.addEventListener('click', event => event.stopPropagation());
    wrap.append(button, menu);

    const toolbar = findTableToolbar(table);
    let controls = toolbar.querySelector('.tcr-table-header-controls');
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'tcr-table-header-controls';
      toolbar.appendChild(controls);
    }
    controls.appendChild(wrap);
    markActionCells(table, actionIndex);
  }

  function scan() {
    scheduled = false;
    document.querySelectorAll('#content table.data').forEach(enhance);
  }

  function scheduleScan() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(scan);
  }

  document.addEventListener('click', () => closeAll());
  document.addEventListener('DOMContentLoaded', scheduleScan);
  window.addEventListener('load', scheduleScan);
  new MutationObserver(scheduleScan).observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(scheduleScan, 0);
  setTimeout(scheduleScan, 250);
})();


/* 599 · Ekstre sayfalarında otomatik arama/temizle kontrolü üretme */
(function(){
  const isEkstre=/-ekstre\.html$/i.test(location.pathname);
  if(!isEkstre)return;
  document.documentElement.classList.add('tcr-ekstre-page');
  const clean=()=>{
    document.querySelectorAll('.tcr-search-action-group,.tcr-search-action-row,.toolbar-search,.search-box,.filter-search').forEach(el=>el.remove());
    document.querySelectorAll('.ekstre-filter-card .tcr-search-clear-btn').forEach(el=>el.remove());
  };
  clean();
  new MutationObserver(clean).observe(document.documentElement,{childList:true,subtree:true});
})();

/* 581 — Cari mobil/tablet Metro menüleri ve Export açılır menüsü */
(function(){
  const svg=(name)=>({
    menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    userPlus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>',
    card:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h4M7 13h7"/></svg>',
    receipt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6"/></svg>',
    cashIn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16v10H4z"/><path d="M8 12h8M12 8v8"/></svg>',
    cashOut:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16v10H4z"/><path d="M8 12h8"/></svg>',
    export:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v7h14v-7"/></svg>',
    whatsapp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 21l2.1-5.1A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 8.5c.5 3 2 4.5 5 5"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    sms:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>',
    pdf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 14h6M9 18h4"/></svg>',
    chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V9M10 19V5M16 19v-8M22 19H2"/></svg>'
  }[name]||'');

  function openSidebar(){
    if(typeof window.toggleSidebar==='function'){ window.toggleSidebar(); return; }
    const app=document.querySelector('.app');
    if(app){app.classList.toggle('mobile-open');document.body.classList.toggle('sidebar-open-lock',app.classList.contains('mobile-open'));}
  }
  function addItem(nav,{label,icon,cls='is-info',href,onClick}){
    const el=href?document.createElement('a'):document.createElement('button');
    if(href) el.href=href; else el.type='button';
    el.className=cls; el.innerHTML=svg(icon)+'<span>'+label+'</span>';
    if(onClick) el.addEventListener('click',onClick);
    nav.appendChild(el);
  }
  function closeExport(){document.querySelector('.tcr-export-popover')?.classList.remove('show');}
  function showExport(anchor){
    let pop=document.querySelector('.tcr-export-popover');
    if(!pop){
      pop=document.createElement('div'); pop.className='tcr-export-popover';
      pop.innerHTML=`<button data-export="whatsapp">${svg('whatsapp')}<span>WhatsApp</span></button><button data-export="mail">${svg('mail')}<span>E-posta</span></button><button data-export="sms">${svg('sms')}<span>SMS</span></button><button data-export="pdf">${svg('pdf')}<span>PDF</span></button>`;
      pop.addEventListener('click',e=>{
        const b=e.target.closest('button[data-export]'); if(!b)return;
        const names={whatsapp:'WhatsApp paylaşımı',mail:'E-posta gönderimi',sms:'SMS gönderimi',pdf:'PDF çıktısı'};
        if(typeof toast==='function') toast(names[b.dataset.export]+' hazırlandı','success');
        closeExport();
      });
      document.body.appendChild(pop);
      document.addEventListener('click',e=>{if(!e.target.closest('.tcr-export-popover,.tcr-export-trigger')) closeExport();});
    }
    pop.classList.toggle('show');
  }
  function init(){
    const page=(location.pathname.split('/').pop()||'').toLowerCase();
    if(!/^cari(?:-|\.)/.test(page))return;
    document.body.classList.add('tcr-cari-module');
    document.querySelectorAll('.tcr-metro-actions').forEach(n=>n.remove());
    const nav=document.createElement('nav'); nav.className='tcr-metro-actions'; nav.setAttribute('aria-label','Cari hızlı işlem menüsü');
    if(page==='cari.html'){
      addItem(nav,{label:'Menü',icon:'menu',onClick:openSidebar});
      addItem(nav,{label:'Yeni Cari',icon:'userPlus',cls:'is-primary',href:'cari-form.html'});
      addItem(nav,{label:'Cari Ekstre',icon:'chart',href:'cari-ekstre.html'});
      addItem(nav,{label:'Export',icon:'export',cls:'is-info tcr-export-trigger',onClick:e=>showExport(e.currentTarget)});
    }else if(page==='cari-islemler.html'){
      addItem(nav,{label:'Cari Kart',icon:'card',href:'cari.html'});
      addItem(nav,{label:'Yeni Tahsilat',icon:'cashIn',cls:'is-primary',onClick:()=>window.openCariIslemModal&&openCariIslemModal('tahsilat')});
      addItem(nav,{label:'Yeni Ödeme',icon:'cashOut',cls:'is-danger',onClick:()=>window.openCariIslemModal&&openCariIslemModal('odeme')});
      addItem(nav,{label:'Export',icon:'export',cls:'is-info tcr-export-trigger',onClick:e=>showExport(e.currentTarget)});
    }else{
      addItem(nav,{label:'Cari Kart',icon:'card',href:'cari.html'});
      addItem(nav,{label:'Yeni Cari',icon:'userPlus',cls:'is-primary',href:'cari-form.html'});
      addItem(nav,{label:'Cari Ekstre',icon:'chart',href:'cari-ekstre.html'});
      addItem(nav,{label:'Export',icon:'export',cls:'is-info tcr-export-trigger',onClick:e=>showExport(e.currentTarget)});
    }
    document.body.appendChild(nav);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('load',()=>{if(!document.querySelector('.tcr-metro-actions'))init();});
})();


/* 544 · Kolon menüsü viewport'a sabitlenir; tablo genişliği değişmez. */
document.addEventListener('click',function(e){
  const btn=e.target.closest('.tcr-column-selector-btn');
  if(!btn) return;
  requestAnimationFrame(function(){
    const menu=btn.parentElement?.querySelector('.tcr-column-selector-menu');
    if(!menu||!menu.classList.contains('open')||window.innerWidth<=767) return;
    const r=btn.getBoundingClientRect();
    menu.style.top=Math.min(window.innerHeight-440,r.bottom+8)+'px';
    menu.style.right=Math.max(16,window.innerWidth-r.right)+'px';
    menu.style.left='auto';
  });
},true);
