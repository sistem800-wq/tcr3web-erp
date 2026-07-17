/* TCR3WEB MASTER DataTable Framework - 711
   Ortak sıralama + sayfalama altyapısı. */
(function (window, document) {
  'use strict';

  const SELECTOR = 'table.data:not([data-tcr-sort="off"])';
  const collator = new Intl.Collator('tr-TR', { numeric: true, sensitivity: 'base' });
  const ICONS = {
    none: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>',
    asc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>',
    desc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
  };

  function cleanText(value) {
    return String(value == null ? '' : value)
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function cellText(cell) {
    if (!cell) return '';
    if (cell.dataset.sortValue != null) return cleanText(cell.dataset.sortValue);
    const field = cell.querySelector('input:not([type="hidden"]), select, textarea');
    if (field) {
      if (field.tagName === 'SELECT') return cleanText(field.options[field.selectedIndex]?.text || field.value);
      return cleanText(field.value);
    }
    return cleanText(cell.textContent);
  }

  function parseDate(value) {
    const v = cleanText(value);
    let m = v.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
    if (m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0)).getTime();
    m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{2}))?$/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)).getTime();
    return NaN;
  }

  function parseNumber(value) {
    let v = cleanText(value);
    if (!v) return NaN;
    v = v.replace(/₺|TL|TRY|%|adet|ad\.|lt|kg|gr|mt|m²|m3|saat|gün/gi, '').trim();
    v = v.replace(/[^\d,.-]/g, '');
    if (!v || v === '-' || v === '.' || v === ',') return NaN;
    const comma = v.lastIndexOf(',');
    const dot = v.lastIndexOf('.');
    if (comma > dot) v = v.replace(/\./g, '').replace(',', '.');
    else if (dot > comma && comma !== -1) v = v.replace(/,/g, '');
    else if (comma !== -1) v = v.replace(',', '.');
    return Number(v);
  }

  function inferType(rows, index, explicit) {
    if (explicit) return explicit;
    const samples = rows.slice(0, 12).map(row => cellText(row.cells[index])).filter(Boolean);
    if (!samples.length) return 'text';
    const dateCount = samples.filter(v => Number.isFinite(parseDate(v))).length;
    if (dateCount / samples.length >= .75) return 'date';
    const numberCount = samples.filter(v => Number.isFinite(parseNumber(v))).length;
    if (numberCount / samples.length >= .75) return 'number';
    return 'text';
  }

  function isActionHeader(th) {
    const name = cleanText(th.textContent).toLocaleLowerCase('tr-TR');
    return /^(işlem|işlemler|aksiyon|seç|sec|#)$/.test(name) || th.dataset.sort === 'off';
  }

  function isSortable(th, table) {
    if (!th || th.colSpan > 1 || isActionHeader(th)) return false;
    const index = th.cellIndex;
    const rows = Array.from(table.tBodies).flatMap(tb => Array.from(tb.rows));
    if (!rows.length) return false;
    const cells = rows.map(r => r.cells[index]).filter(Boolean);
    if (!cells.length) return false;
    const actionCells = cells.filter(c => c.querySelector('button, .btn, [data-action], input[type="checkbox"], input[type="radio"]')).length;
    return actionCells / cells.length < .6;
  }

  function storageKey(table) {
    const page = location.pathname.split('/').pop() || 'index';
    const id = table.id || table.dataset.tableKey || String(Array.from(document.querySelectorAll(SELECTOR)).indexOf(table));
    return 'tcr3:table-sort:' + page + ':' + id;
  }

  function indicator(th, state) {
    let el = th.querySelector('.tcr-sort-indicator');
    if (!el) {
      el = document.createElement('span');
      el.className = 'tcr-sort-indicator';
      th.appendChild(el);
    }
    el.innerHTML = ICONS[state] || ICONS.none;
  }

  function clearHeaders(table, except) {
    table.querySelectorAll('thead th[data-tcr-sortable="true"]').forEach(th => {
      if (th !== except) {
        th.setAttribute('aria-sort', 'none');
        indicator(th, 'none');
      }
    });
  }

  function sortTable(table, index, direction, save) {
    const bodies = Array.from(table.tBodies);
    if (!bodies.length) return;
    const th = table.tHead?.rows[table.tHead.rows.length - 1]?.cells[index];
    if (!th) return;
    clearHeaders(table, th);

    if (direction === 'none') {
      bodies.forEach(body => {
        Array.from(body.rows)
          .sort((a, b) => (+a.dataset.tcrOriginalIndex || 0) - (+b.dataset.tcrOriginalIndex || 0))
          .forEach(row => body.appendChild(row));
      });
      th.setAttribute('aria-sort', 'none');
      indicator(th, 'none');
      if (save !== false) localStorage.removeItem(storageKey(table));
      updatePagination(table, table._tcrPagination?.page || 1);
      return;
    }

    const allRows = bodies.flatMap(body => Array.from(body.rows));
    const type = inferType(allRows, index, th.dataset.sortType);
    bodies.forEach(body => {
      const rows = Array.from(body.rows);
      rows.sort((a, b) => {
        const av = cellText(a.cells[index]);
        const bv = cellText(b.cells[index]);
        let result = 0;
        if (type === 'date') {
          const an = parseDate(av), bn = parseDate(bv);
          result = (Number.isNaN(an) ? Infinity : an) - (Number.isNaN(bn) ? Infinity : bn);
        } else if (type === 'number') {
          const an = parseNumber(av), bn = parseNumber(bv);
          result = (Number.isNaN(an) ? Infinity : an) - (Number.isNaN(bn) ? Infinity : bn);
        } else result = collator.compare(av, bv);
        if (result === 0) result = (+a.dataset.tcrOriginalIndex || 0) - (+b.dataset.tcrOriginalIndex || 0);
        return direction === 'desc' ? -result : result;
      });
      rows.forEach(row => body.appendChild(row));
    });
    th.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');
    indicator(th, direction);
    if (save !== false) localStorage.setItem(storageKey(table), JSON.stringify({ index, direction }));
    updatePagination(table, table._tcrPagination?.page || 1);
  }

  function nextDirection(th) {
    const current = th.getAttribute('aria-sort');
    return current === 'ascending' ? 'desc' : current === 'descending' ? 'none' : 'asc';
  }


  function pageStorageKey(table) {
    return storageKey(table).replace('table-sort', 'table-page-size');
  }

  function visibleRows(table) {
    return Array.from(table.tBodies).flatMap(body => Array.from(body.rows)).filter(row => {
      return row.dataset.tcrExternalHidden !== '1' && row.style.display !== 'none' && !row.hidden;
    });
  }

  function allRows(table) {
    return Array.from(table.tBodies).flatMap(body => Array.from(body.rows));
  }

  function updatePagination(table, requestedPage) {
    const state = table._tcrPagination;
    if (!state) return;
    const rows = allRows(table);
    const candidates = rows.filter(row => row.dataset.tcrFilterHidden !== '1');
    const size = state.size === 'all' ? Math.max(candidates.length, 1) : Number(state.size || 10);
    const pages = Math.max(1, Math.ceil(candidates.length / size));
    state.page = Math.min(Math.max(1, requestedPage || state.page || 1), pages);
    const start = (state.page - 1) * size;
    const end = state.size === 'all' ? candidates.length : start + size;

    let visibleIndex = 0;
    rows.forEach(row => {
      if (row.dataset.tcrFilterHidden === '1') {
        row.hidden = true;
        return;
      }
      const show = visibleIndex >= start && visibleIndex < end;
      row.hidden = !show;
      visibleIndex += 1;
    });

    if (state.info) {
      const first = candidates.length ? start + 1 : 0;
      const last = Math.min(end, candidates.length);
      state.info.textContent = `${first}-${last} / ${candidates.length} kayıt`;
    }
    if (state.pageText) state.pageText.textContent = `${state.page} / ${pages}`;
    if (state.prev) state.prev.disabled = state.page <= 1;
    if (state.next) state.next.disabled = state.page >= pages;
  }

  function findToolbar(table) {
    const wrap = table.closest('.table-wrap') || table.parentElement;
    const body = table.closest('.card-body, .panel-body, .content-card, section') || wrap?.parentElement;
    if (!body) return null;
    const toolbars = Array.from(body.querySelectorAll(':scope > .toolbar, :scope > * > .toolbar'));
    return toolbars.find(toolbar => {
      const nextTable = toolbar.parentElement?.querySelector('table.data');
      return nextTable === table || body.querySelector('table.data') === table;
    }) || toolbars[0] || null;
  }

  const SIDEBAR_PAGE_FILES = new Set([
    'dashboard.html','sanal-pos.html','cari.html','cari-islemler.html','cari-fisleri.html',
    'stok.html','stok-islemler.html','teklif.html','as.html','satis.html','hizli-satis.html',
    'sicak-satis.html','vs.html','alim.html','kasa.html','banka.html','cek.html','senet.html',
    'vade.html','depo-islemler.html','depo-operasyon.html','depo-hazirlik.html',
    'depo-teslimat.html','depo-mal-kabul.html','depo-eksik.html','depo-tamamlanan.html',
    'personel.html','maas.html','avans.html','takvim.html','basvuru.html','servis.html',
    'servis-talep.html','servis-havuzu.html','servis-usta.html','raporlar.html','settings.html'
  ]);

  function shouldCreatePagination(table) {
    if (document.body.classList.contains('tcr-cari-clean')) return false;
    if (!table || table.dataset.tcrPagination === 'off') return false;
    if (table.closest('.modal, .modal-backdrop, [role=\"dialog\"], .picker-modal-box, .quick-add-modal-box')) return false;
    const pageFile = (location.pathname.split('/').pop() || '').toLowerCase();
    return SIDEBAR_PAGE_FILES.has(pageFile);
  }

  function createPagination(table) {
    if (table._tcrPagination || !shouldCreatePagination(table)) return;
    const savedSize = '10';

    const control = document.createElement('div');
    control.className = 'tcr-table-page-size';
    control.innerHTML = '<span class="tcr-table-page-size-label">Göster</span><select class="tcr-table-page-size-select" aria-label="Sayfa başına kayıt"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option><option value="250">250</option><option value="all">Hepsi</option></select>';
    const select = control.querySelector('select');
    select.value = savedSize;

    let toolbar = findToolbar(table);
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'toolbar tcr-table-generated-toolbar';
      const wrap = table.closest('.table-wrap') || table;
      wrap.parentElement.insertBefore(toolbar, wrap);
    }

    let controls = toolbar.querySelector('.tcr-table-header-controls');
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'tcr-table-header-controls';
      toolbar.appendChild(controls);
    }

    control.classList.add('tcr-table-page-size--toolbar');
    const columnSelector = controls.querySelector('.cari-column-selector-wrap, .tcr-column-selector-wrap');
    if (columnSelector) controls.insertBefore(control, columnSelector);
    else controls.appendChild(control);

    const footer = document.createElement('div');
    footer.className = 'tcr-table-pagination-footer';
    footer.innerHTML = '<div class="tcr-table-pagination-buttons"><button type="button" class="tcr-table-page-btn tcr-prev" title="Önceki sayfa" aria-label="Önceki sayfa"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button><span class="tcr-table-page-text"></span><button type="button" class="tcr-table-page-btn tcr-next" title="Sonraki sayfa" aria-label="Sonraki sayfa"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button></div><span class="tcr-table-pagination-info"></span>';
    const wrap = table.closest('.table-wrap') || table.parentElement;
    wrap.insertAdjacentElement('afterend', footer);

    table._tcrPagination = {
      size: savedSize,
      page: 1,
      select,
      info: footer.querySelector('.tcr-table-pagination-info'),
      pageText: footer.querySelector('.tcr-table-page-text'),
      prev: footer.querySelector('.tcr-prev'),
      next: footer.querySelector('.tcr-next'),
      control
    };
    select.addEventListener('change', () => {
      table._tcrPagination.size = select.value;
      table._tcrPagination.page = 1;
      updatePagination(table, 1);
    });
    table._tcrPagination.prev.addEventListener('click', () => updatePagination(table, table._tcrPagination.page - 1));
    table._tcrPagination.next.addEventListener('click', () => updatePagination(table, table._tcrPagination.page + 1));
    updatePagination(table, 1);
  }

  function defaultDescColumn(headerRow) {
    const priority = [
      /^kayıt no$/i, /^işlem no$/i, /^sipariş no$/i, /^belge no$/i,
      /^fiş no$/i, /^servis no$/i, /^evrak no$/i, /^fatura no$/i,
      /^teklif no$/i, /^çek no$/i, /^senet no$/i, /^kod$/i, /^no$/i
    ];
    const cells = Array.from(headerRow.cells);
    for (const pattern of priority) {
      const index = cells.findIndex(th => pattern.test(cleanText(th.textContent)) && th.dataset.tcrSortable === 'true');
      if (index >= 0) return index;
    }
    return -1;
  }

  function initTable(table) {
    if (!table || table.dataset.tcrTableReady === '1') return;
    const headerRow = table.tHead?.rows[table.tHead.rows.length - 1];
    if (!headerRow || !table.tBodies.length) return;
    table.dataset.tcrTableReady = '1';
    table.classList.add('tcr-sortable');
    Array.from(table.tBodies).forEach(body => Array.from(body.rows).forEach((row, i) => {
      if (row.dataset.tcrOriginalIndex == null) row.dataset.tcrOriginalIndex = String(i);
    }));

    Array.from(headerRow.cells).forEach(th => {
      if (!isSortable(th, table)) return;
      th.dataset.tcrSortable = 'true';
      th.tabIndex = 0;
      th.setAttribute('role', 'button');
      th.setAttribute('aria-sort', 'none');
      th.title = (cleanText(th.textContent) || 'Sütun') + ' sütununu sırala';
      indicator(th, 'none');
      const activate = () => sortTable(table, th.cellIndex, nextDirection(th), true);
      th.addEventListener('click', e => {
        if (e.target.closest('button,a,input,select,textarea')) return;
        activate();
      });
      th.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });
    });

    createPagination(table);

    if (table._tcrPagination) {
      const index = defaultDescColumn(headerRow);
      if (index >= 0) sortTable(table, index, 'desc', false);
      updatePagination(table, 1);
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey(table)) || 'null');
        if (saved && Number.isInteger(saved.index) && /^(asc|desc)$/.test(saved.direction)) {
          const savedTh = headerRow.cells[saved.index];
          if (savedTh?.dataset.tcrSortable === 'true') sortTable(table, saved.index, saved.direction, false);
        }
      } catch (_) {}
    }
  }

  function parseBalanceValue(text) {
    const raw = String(text || '').replace(/\s/g, '').replace(/₺|TRY|TL/gi, '');
    if (!/[0-9]/.test(raw)) return NaN;
    let normalized = raw;
    const comma = normalized.lastIndexOf(',');
    const dot = normalized.lastIndexOf('.');
    if (comma > dot) normalized = normalized.replace(/\./g, '').replace(',', '.');
    else if (dot > comma) normalized = normalized.replace(/,/g, '');
    normalized = normalized.replace(/[^0-9+\-.]/g, '');
    return Number(normalized);
  }

  function applyBalanceColors(table) {
    const head = table.tHead?.rows[table.tHead.rows.length - 1];
    if (!head || !table.tBodies.length) return;
    const balanceIndexes = Array.from(head.cells).reduce((out, th, index) => {
      const label = cleanText(th.textContent).toLocaleLowerCase('tr-TR');
      if (label.includes('bakiye')) out.push(index);
      return out;
    }, []);
    Array.from(table.tBodies).forEach(body => Array.from(body.rows).forEach(row => {
      const rowText = cleanText(row.textContent).toLocaleLowerCase('tr-TR');
      const explicitDebit = /borçlu|borç bakiye/.test(rowText);
      const explicitCredit = /alacaklı|alacak bakiye/.test(rowText);
      const dataBalance = row.dataset.bakiye != null ? Number(row.dataset.bakiye) : NaN;
      balanceIndexes.forEach(index => {
        const cell = row.cells[index]; if (!cell) return;
        cell.classList.remove('tcr-balance-debit','tcr-balance-credit','tcr-balance-neutral','text-danger','text-success');
        let type = '';
        if (explicitDebit && !explicitCredit) type = 'debit';
        else if (explicitCredit && !explicitDebit) type = 'credit';
        else {
          const amount = Number.isFinite(dataBalance) ? dataBalance : parseBalanceValue(cell.textContent);
          /* Cari bakiye standardı: pozitif borçlu, negatif alacaklı. */
          if (Number.isFinite(amount)) type = amount > 0 ? 'debit' : amount < 0 ? 'credit' : 'neutral';
        }
        if (type) cell.classList.add('tcr-balance-' + type);
      });
      Array.from(row.cells).forEach(cell => {
        const text = cleanText(cell.textContent).toLocaleLowerCase('tr-TR');
        if (text === 'borçlu') { cell.classList.remove('tcr-balance-credit'); cell.classList.add('tcr-balance-debit'); }
        if (text === 'alacaklı') { cell.classList.remove('tcr-balance-debit'); cell.classList.add('tcr-balance-credit'); }
      });
    }));
  }

  function applyMobileTwoRow(table) {
    if (!table || table.dataset.tcrMobileRows === 'off') return;
    const head = table.tHead?.rows[table.tHead.rows.length - 1];
    if (!head || !table.tBodies.length) return;

    const headers = Array.from(head.cells).map((th, index) => {
      const clone = th.cloneNode(true);
      clone.querySelectorAll('.tcr-sort-indicator,.tcr-column-selector-wrap,button,svg').forEach(el => el.remove());
      const text = cleanText(clone.textContent).trim();
      return text || (index === head.cells.length - 1 ? 'İşlemler' : 'Bilgi');
    });

    table.classList.add('tcr-mobile-two-row');
    Array.from(table.tBodies).forEach(body => Array.from(body.rows).forEach(row => {
      const cells = Array.from(row.cells).filter(cell => getComputedStyle(cell).display !== 'none');
      if (!cells.length) return;
      const isEmpty = cells.length === 1 && (cells[0].colSpan > 1 || /kayıt bulunamadı|veri yok|sonuç yok/i.test(cleanText(cells[0].textContent)));
      row.classList.toggle('tcr-mobile-empty-row', isEmpty);
      if (isEmpty) return;
      row.style.setProperty('--tcr-mobile-columns', String(Math.max(1, Math.ceil(cells.length / 2))));
      cells.forEach(cell => {
        const index = cell.cellIndex;
        const label = headers[index] || 'Bilgi';
        cell.dataset.tcrMobileLabel = label;
        const key = label.toLocaleLowerCase('tr-TR')
          .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
          .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        if (key) cell.dataset.col = key;
      });

      /* Mobil tablo standardı: işlem butonu 2'den fazlaysa işlemler alanı
         kaydın üçüncü satırına tam genişlikte taşınır. */
      const actionCell = cells.find(cell => cell.classList.contains('tcr-action-column'));
      if (actionCell) {
        const actionButtons = Array.from(actionCell.querySelectorAll('button, a, .btn, .icon-btn, .mini-action, .tcr-action, .tcr-table-action'))
          .filter((button, index, list) => list.indexOf(button) === index && getComputedStyle(button).display !== 'none');
        const hasExtraActions = actionButtons.length > 2;
        row.classList.toggle('tcr-mobile-actions-third-row', hasExtraActions);
        actionCell.classList.toggle('tcr-mobile-action-expanded', hasExtraActions);
      } else {
        row.classList.remove('tcr-mobile-actions-third-row');
      }
    }));
  }

  function markActionColumns(table) {
    const head = table.tHead?.rows[table.tHead.rows.length - 1];
    if (!head) return;
    const rows = Array.from(table.tBodies || []).flatMap(body => Array.from(body.rows));
    Array.from(head.cells).forEach((th, index) => {
      const label = cleanText(th.textContent).toLocaleLowerCase('tr-TR');
      const labelledAction = /^(işlem|işlemler|aksiyon|aksiyonlar)$/.test(label);
      const sample = rows.slice(0, 8).map(row => row.cells[index]).filter(Boolean);
      const actionCellCount = sample.filter(cell => cell.querySelector('button, a.btn, .icon-btn, .actions, .table-actions, .action-buttons, .row-actions, .finance-actions')).length;
      const inferredAction = !th.classList.contains('tcr-column-selector-head') && sample.length > 0 && actionCellCount >= Math.max(1, Math.ceil(sample.length * 0.6));
      if (!labelledAction && !inferredAction) return;
      th.classList.add('tcr-action-column');
      if (!cleanText(th.textContent)) th.setAttribute('aria-label', 'İşlemler');
      rows.forEach(row => { if (row.cells[index]) row.cells[index].classList.add('tcr-action-column'); });
    });
  }

  function init(root) {
    const scope = root && root.querySelectorAll ? root : document;
    if (scope.matches?.(SELECTOR)) { initTable(scope); applyBalanceColors(scope); markActionColumns(scope); applyMobileTwoRow(scope); }
    scope.querySelectorAll(SELECTOR).forEach(table => { initTable(table); applyBalanceColors(table); markActionColumns(table); applyMobileTwoRow(table); });
  }

  let scheduled = false;
  function scheduleInit() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; init(document); });
  }

  document.addEventListener('DOMContentLoaded', scheduleInit);
  window.addEventListener('load', scheduleInit);
  new MutationObserver(scheduleInit).observe(document.documentElement, { childList: true, subtree: true });

  window.TCRTable = { init, sort: sortTable, paginate: updatePagination, refresh(table) { updatePagination(table, 1); } };
})(window, document);
