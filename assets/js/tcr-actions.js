(function (w, d) {
  'use strict';

  const svg = (body) => `<svg class="lucide lucide-action" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
  const ICON = {
    view: svg('<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>'),
    edit: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
    copy: svg('<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'),
    print: svg('<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>'),
    pdf: svg('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"/><polyline points="14 2 14 8 20 8"/><path d="M8 15h1a2 2 0 0 0 0-4H8v6"/><path d="M13 17v-6h1.5a2.5 2.5 0 0 1 0 5H13"/><path d="M18 11h3"/><path d="M18 14h2"/>'),
    delete: svg('<path d="M3 6h18"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><path d="M19 6l-1 14c0 1-1 2-2 2H8c-1 0-2-1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>'),
    approve: svg('<path d="M20 6 9 17l-5-5"/>'),
    cancel: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
    depot: svg('<path d="M3 21V8l9-5 9 5v13"/><path d="M13 13h4v8h-4z"/><path d="M7 13h2v2H7z"/><path d="M7 17h2v2H7z"/>'),
    collect: svg('<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M2 10h20"/><path d="M12 13v4"/><path d="M10 15h4"/>'),
    payment: svg('<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>'),
    document: svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/>'),
    search: svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
    save: svg('<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>'),
    add: svg('<path d="M5 12h14"/><path d="M12 5v14"/>'),
    prices: svg('<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
    request: svg('<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h7.78a2 2 0 0 0 1.95-1.57L20.05 7H5.12"/><path d="M12 9v4"/><path d="M10 11h4"/>'),
    close: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>')
  };

  const ACTIONS = {
    view:{label:'Görüntüle', tone:'blue', icon:'view'}, edit:{label:'Düzenle', tone:'green', icon:'edit'},
    copy:{label:'Kopyala', tone:'purple', icon:'copy'}, print:{label:'Yazdır', tone:'turquoise', icon:'print'},
    pdf:{label:'PDF İndir', tone:'slate', icon:'pdf'}, delete:{label:'Sil', tone:'red', icon:'delete'},
    approve:{label:'Onayla', tone:'green', icon:'approve'}, cancel:{label:'İptal', tone:'red', icon:'cancel'},
    depot:{label:'Depo Durumu', tone:'cyan', icon:'depot'}, collect:{label:'Tahsilat', tone:'green', icon:'collect'},
    payment:{label:'Ödeme', tone:'red', icon:'payment'}, document:{label:'Evrak', tone:'navy', icon:'document'},
    search:{label:'Ara', tone:'blue', icon:'search'}, save:{label:'Kaydet', tone:'green', icon:'save'},
    add:{label:'Ekle', tone:'blue', icon:'add'}, prices:{label:'Fiyatlar', tone:'purple', icon:'prices'},
    request:{label:'Talep', tone:'amber', icon:'request'}, close:{label:'Kapat', tone:'red', icon:'close'}
  };

  const aliases = [
    [/görüntüle|gör|detay|incele/i,'view'], [/düzenle|güncelle/i,'edit'], [/kopyala/i,'copy'],
    [/yazdır/i,'print'], [/pdf/i,'pdf'], [/sil|kaldır|çöp/i,'delete'], [/onay/i,'approve'],
    [/iptal|vazgeç/i,'cancel'], [/depo/i,'depot'], [/tahsilat/i,'collect'], [/ödeme/i,'payment'],
    [/evrak|belge/i,'document'], [/ara|seç/i,'search'], [/kaydet/i,'save'], [/ekle|yeni/i,'add'],
    [/fiyat/i,'prices'], [/talep|satın alma/i,'request'], [/kapat/i,'close']
  ];

  function clean(value, fallback='') {
    if (value === undefined || value === null) return fallback;
    const s = String(value).trim();
    return (!s || /^(undefined|null|nan)$/i.test(s)) ? fallback : s;
  }
  function infer(el) {
    const explicit = clean(el.dataset.action || el.dataset.tcrAction).toLowerCase();
    if (ACTIONS[explicit]) return explicit;
    const haystack = [el.getAttribute('title'), el.getAttribute('aria-label'), el.textContent, el.className, el.getAttribute('onclick')].map(v=>clean(v)).join(' ');
    for (const [rx,key] of aliases) if (rx.test(haystack)) return key;
    return '';
  }
  function iconHtml(key){ const action=ACTIONS[key]; return ICON[action?.icon] || ''; }
  function ensureTooltip(el, label){
    const title = clean(el.getAttribute('title'), label);
    el.setAttribute('title', title);
    el.setAttribute('aria-label', clean(el.getAttribute('aria-label'), title));
  }
  function repairUndefined(el, actionKey) {
    if (!/undefined|null|nan/i.test(el.innerHTML)) return;
    const def = ACTIONS[actionKey] || {label:'İşlem', icon:'view'};
    el.innerHTML = `${ICON[def.icon] || ''}<span class="tcr-action-label">${def.label}</span>`;
  }
  function enhance(el, options={}) {
    if (!el || el.nodeType !== 1 || el.matches('.tab,.slider-dot,.slider-prev,.slider-next,.role-chip,.role-mini')) return el;
    const key = options.action || infer(el);
    repairUndefined(el,key);
    if (!key || !ACTIONS[key]) {
      if (/undefined|null|nan/i.test(el.textContent || '')) el.textContent = 'İşlem';
      return el;
    }
    const def = ACTIONS[key];
    el.dataset.tcrAction = key;
    el.classList.add('tcr-action','tcr-action-'+def.tone);
    ensureTooltip(el, options.title || def.label);
    const iconOnly = options.iconOnly ?? (el.classList.contains('icon-btn') || el.classList.contains('icon-only') || el.hasAttribute('data-icon-only'));
    const hasSvg = !!el.querySelector('svg');
    if (!hasSvg) el.insertAdjacentHTML('afterbegin', iconHtml(key));
    if (iconOnly) {
      el.classList.add('tcr-action-icon-only');
      [...el.childNodes].forEach(n => { if(n.nodeType===3 && n.textContent.trim()) n.remove(); });
      const labels=el.querySelectorAll('.tcr-action-label'); labels.forEach(x=>x.remove());
    } else if (!clean(el.textContent)) {
      el.insertAdjacentHTML('beforeend', `<span class="tcr-action-label">${def.label}</span>`);
    }
    return el;
  }
  function normalizeTableAction(el) {
    if (!el || el.closest('.tcr-column-selector-wrap,.tcr-table-pagination-footer')) return;
    const cell = el.closest('td.tcr-action-column, td:last-child');
    if (!cell || !cell.closest('table.data')) return;
    const inferred = infer(el);
    if (inferred && ACTIONS[inferred]) {
      enhance(el, { action: inferred, iconOnly: true });
      return;
    }
    // Existing semantic classes are preserved; otherwise use the standard blue outline.
    const classText = String(el.className || '');
    let tone = 'blue';
    if (/danger|delete|remove|cancel|red/i.test(classText)) tone = 'red';
    else if (/success|approve|save|collect|green/i.test(classText)) tone = 'green';
    else if (/warning|edit|amber|yellow/i.test(classText)) tone = 'amber';
    else if (/info|cyan|turquoise/i.test(classText)) tone = 'cyan';
    else if (/purple|violet/i.test(classText)) tone = 'purple';
    else if (/secondary|slate|gray|grey/i.test(classText)) tone = 'slate';
    el.classList.add('tcr-action','tcr-action-'+tone,'tcr-action-icon-only');
    const title = clean(el.getAttribute('title') || el.getAttribute('aria-label') || el.textContent, 'İşlem');
    ensureTooltip(el, title);
  }
  function enhanceAll(root=d) {
    root.querySelectorAll('button.btn, a.btn, button.icon-btn, a.icon-btn, button.mini-action, a.mini-action, .tcr-table-action, [data-action], [data-tcr-action]').forEach(el=>enhance(el));
    root.querySelectorAll('table.data td.tcr-action-column button, table.data td.tcr-action-column a, table.data td:last-child button, table.data td:last-child a').forEach(normalizeTableAction);
  }
  function create(action, opts={}) {
    const def=ACTIONS[action] || ACTIONS.view;
    const tag=opts.href?'a':'button';
    const attrs=[`class="${clean(opts.className,'btn btn-sm')} tcr-action tcr-action-${def.tone}${opts.iconOnly?' tcr-action-icon-only':''}"`,`data-tcr-action="${action}"`,`title="${clean(opts.title,def.label)}"`,`aria-label="${clean(opts.title,def.label)}"`];
    if(tag==='a') attrs.push(`href="${opts.href}"`); else attrs.push(`type="${clean(opts.type,'button')}"`);
    if(opts.onclick) attrs.push(`onclick="${opts.onclick.replace(/"/g,'&quot;')}"`);
    return `<${tag} ${attrs.join(' ')}>${iconHtml(action)}${opts.iconOnly?'':`<span class="tcr-action-label">${clean(opts.label,def.label)}</span>`}</${tag}>`;
  }

  const api={ACTIONS, ICON, clean, infer, enhance, enhanceAll, create};
  w.TCRActions=api;
  w.tcrActionButton=create;

  function boot(){ enhanceAll(d); }
  if(d.readyState==='loading') d.addEventListener('DOMContentLoaded',boot); else boot();
  new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{ if(n.nodeType!==1)return; if(n.matches?.('button,a')) enhance(n); enhanceAll(n); }))).observe(d.documentElement,{childList:true,subtree:true});
})(window,document);
