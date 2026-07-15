/* ============================================================
   Tcr3WEB HTML Şablon - Shared JS
   - Sidebar nav config
   - Mock data
   - Helpers: format, render, modal, toast, charts
   ============================================================ */

const CURRENCY_SYMBOLS = { TRY: '₺', USD: '$', EUR: '€', GBP: '£' };
let APP_CURRENCY = localStorage.getItem('erp_currency') || 'TRY';
let APP_LANG = localStorage.getItem('erp_lang') || 'tr';
let APP_DATE_FORMAT = localStorage.getItem('erp_date_format') || 'DD.MM.YYYY';
let APP_TIME_FORMAT = localStorage.getItem('erp_time_format') || '24';
let APP_WEEK_START = localStorage.getItem('erp_week_start') || 'monday';
let APP_NUMBER_DECIMALS = Math.max(0, Math.min(4, Number(localStorage.getItem('erp_number_decimals') || 2)));
let APP_THOUSAND_SEPARATOR = localStorage.getItem('erp_thousand_separator') || '.';
let APP_DECIMAL_SEPARATOR = localStorage.getItem('erp_decimal_separator') || ',';
let APP_CURRENCY_POSITION = localStorage.getItem('erp_currency_position') || 'suffix';
let APP_PERCENT_DECIMALS = Math.max(0, Math.min(4, Number(localStorage.getItem('erp_percent_decimals') || 2)));
let APP_PAGE_LOADER_ENABLED = localStorage.getItem('erp_page_loader_enabled') !== '0';
let APP_PAGE_LOADER_DURATION = Number(localStorage.getItem('erp_page_loader_duration') || 650);
if (!Number.isFinite(APP_PAGE_LOADER_DURATION) || APP_PAGE_LOADER_DURATION < 150) APP_PAGE_LOADER_DURATION = 650;
let APP_TOAST_ENABLED = localStorage.getItem('erp_toast_enabled') !== '0';
let APP_TOAST_DURATION = Number(localStorage.getItem('erp_toast_duration') || 2500);
if (!Number.isFinite(APP_TOAST_DURATION) || APP_TOAST_DURATION < 500) APP_TOAST_DURATION = 2500;
let APP_TOAST_PROGRESS_ENABLED = localStorage.getItem('erp_toast_progress_enabled') !== '0';
let APP_TOAST_COLORED_BG = localStorage.getItem('erp_toast_colored_bg') !== '0';
let APP_TOAST_ICONS_ENABLED = localStorage.getItem('erp_toast_icons_enabled') !== '0';
let APP_TOAST_MAX = Math.max(1, Math.min(5, Number(localStorage.getItem('erp_toast_max') || 3)));
let APP_TOAST_POSITION = localStorage.getItem('erp_toast_position') || 'top-center';
const APP_ASSET_PREFIX = (() => {
  const script = document.querySelector('script[src*="assets/js/app.js"]');
  const src = script ? (script.getAttribute('src') || '') : '../assets/js/app.js';
  return src.replace(/assets\/js\/app\.js(?:\?.*)?$/, 'assets/');
})();


function tcr3LogoSvg(extraClass = '') {
  return `<svg class="tcr3-code-logo ${extraClass}" viewBox="0 0 260 86" role="img" aria-label="TCR3WEB ERP MASTER V1" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tcr3Green" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8cff3f"/>
        <stop offset="0.48" stop-color="#22c55e"/>
        <stop offset="1" stop-color="#0f7a3d"/>
      </linearGradient>
      <linearGradient id="tcr3Silver" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="0.52" stop-color="#cbd5e1"/>
        <stop offset="1" stop-color="#64748b"/>
      </linearGradient>
      <filter id="tcr3Shadow" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity=".38"/>
      </filter>
      <filter id="tcr3Glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="2.4" flood-color="#22c55e" flood-opacity=".55"/>
      </filter>
    </defs>
    <rect width="260" height="86" rx="12" fill="transparent"/>
    <g filter="url(#tcr3Shadow)">
      <path d="M16 24h54L63 33H45L39 55H28l6-22H12z" fill="url(#tcr3Green)"/>
      <path d="M45 39h30l-9 9H52l-8 24H32z" fill="url(#tcr3Silver)"/>
      <rect x="16" y="47" width="6" height="6" fill="#5eea66"/>
      <rect x="25" y="47" width="6" height="6" fill="#42d85a"/>
      <rect x="21" y="58" width="6" height="6" fill="#22c55e"/>
      <rect x="31" y="61" width="6" height="6" fill="#16a34a"/>
    </g>
    <g filter="url(#tcr3Shadow)" font-family="Inter, Arial, sans-serif" font-weight="900" font-style="italic" letter-spacing="-3">
      <text x="82" y="45" font-size="34" fill="url(#tcr3Green)">TCR3</text>
      <text x="163" y="45" font-size="34" fill="url(#tcr3Silver)">WEB</text>
    </g>
    <line x1="80" y1="55" x2="239" y2="55" stroke="url(#tcr3Green)" stroke-width="2.4" filter="url(#tcr3Glow)"/>
    <text x="130" y="74" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="800" letter-spacing="6" fill="url(#tcr3Silver)">ERP MASTER V1</text>
  </svg>`;
}

function sym() { return CURRENCY_SYMBOLS[APP_CURRENCY] || '₺'; }

function tcrGroupNumber(integerPart, separator) {
  return String(integerPart).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}
function tcrFormatNumber(n, decimals = APP_NUMBER_DECIMALS) {
  const value = Number(n || 0);
  const safeDecimals = Math.max(0, Math.min(4, Number(decimals || 0)));
  const fixed = Math.abs(value).toFixed(safeDecimals).split('.');
  const grouped = tcrGroupNumber(fixed[0], APP_THOUSAND_SEPARATOR);
  const sign = value < 0 ? '-' : '';
  return sign + grouped + (safeDecimals ? APP_DECIMAL_SEPARATOR + fixed[1] : '');
}
function fmtMoney(n, withSym = true) {
  const formatted = tcrFormatNumber(n, APP_NUMBER_DECIMALS);
  if (!withSym) return formatted;
  return APP_CURRENCY_POSITION === 'prefix' ? `${sym()} ${formatted}` : `${formatted} ${sym()}`;
}
function fmtNum(n, decimals = 0) { return tcrFormatNumber(n, decimals); }
function fmtPercent(n) { return `${tcrFormatNumber(n, APP_PERCENT_DECIMALS)}%`; }
function tcrSafeDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const raw = String(value).trim();
  let m = raw.match(/^(\d{2})[.\/-](\d{2})[.\/-](\d{4})$/);
  if (m) return new Date(Number(m[3]), Number(m[2])-1, Number(m[1]));
  m = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
  if (m) return new Date(Number(m[1]), Number(m[2])-1, Number(m[3]));
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
function fmtDate(d) {
  const date = tcrSafeDate(d);
  if (!date) return '-';
  const day=String(date.getDate()).padStart(2,'0'), month=String(date.getMonth()+1).padStart(2,'0'), year=String(date.getFullYear());
  if (APP_DATE_FORMAT === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
  if (APP_DATE_FORMAT === 'DD/MM/YYYY') return `${day}/${month}/${year}`;
  if (APP_DATE_FORMAT === 'MM/DD/YYYY') return `${month}/${day}/${year}`;
  return `${day}.${month}.${year}`;
}
function fmtDateShort(d) {
  const date = tcrSafeDate(d);
  if (!date) return '-';
  return date.toLocaleDateString(APP_LANG === 'en' ? 'en-US' : 'tr-TR', { day:'2-digit', month:'short' });
}
function fmtTime(value) {
  const date = value instanceof Date ? value : new Date(`2000-01-01T${String(value || '00:00')}`);
  if (Number.isNaN(date.getTime())) return String(value || '-');
  return date.toLocaleTimeString(APP_LANG === 'en' ? 'en-US' : 'tr-TR', APP_TIME_FORMAT === '12' ? {hour:'2-digit',minute:'2-digit',hour12:true} : {hour:'2-digit',minute:'2-digit',hour12:false});
}

function tcrParseFormattedNumber(raw) {
  let text=String(raw||'').trim().replace(/\s/g,'');
  const negative=text.startsWith('-');
  text=text.replace(/^[+-]/,'');
  const lastComma=text.lastIndexOf(','), lastDot=text.lastIndexOf('.');
  const decimalIndex=Math.max(lastComma,lastDot);
  let normalized;
  if(decimalIndex>=0 && text.length-decimalIndex-1<=4){
    normalized=text.slice(0,decimalIndex).replace(/[.,]/g,'')+'.'+text.slice(decimalIndex+1).replace(/[.,]/g,'');
  }else normalized=text.replace(/[.,]/g,'');
  const number=Number(normalized);
  return Number.isFinite(number) ? (negative?-number:number) : null;
}
function tcrFormatTextNode(node){
  if(!node || node.nodeType!==3 || !node.nodeValue || node.parentElement?.closest('script,style,textarea,input,select,option,[contenteditable="true"],.mono,code,pre')) return;
  let text=node.nodeValue;
  let changed=false;
  text=text.replace(/\b(\d{4})-(\d{2})-(\d{2})\b|\b(\d{2})[.\/-](\d{2})[.\/-](\d{4})\b/g, match=>{changed=true;return fmtDate(match)});
  text=text.replace(/([+-]?\s*[\d.,]+)\s*(₺|\$|€|£)/g,(match,num,currency)=>{
    const value=tcrParseFormattedNumber(num); if(value===null)return match; changed=true;
    const rendered=tcrFormatNumber(value,APP_NUMBER_DECIMALS);
    return APP_CURRENCY_POSITION==='prefix'?`${currency} ${rendered}`:`${rendered} ${currency}`;
  });
  text=text.replace(/([+-]?\s*[\d.,]+)\s*%/g,(match,num)=>{const value=tcrParseFormattedNumber(num);if(value===null)return match;changed=true;return fmtPercent(value)});
  if(changed) node.nodeValue=text;
}
function tcrApplyDisplayFormats(root=document.body){
  if(!root) return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode); nodes.forEach(tcrFormatTextNode);
}
function tcrInitDisplayFormats(){
  tcrApplyDisplayFormats(document.body);
  const observer=new MutationObserver(mutations=>mutations.forEach(m=>m.addedNodes.forEach(node=>{
    if(node.nodeType===3)tcrFormatTextNode(node); else if(node.nodeType===1)tcrApplyDisplayFormats(node);
  })));
  observer.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',tcrInitDisplayFormats,{once:true}); else tcrInitDisplayFormats();

/* ============================================================
   Navigation
   ============================================================ */
const NAV = [
  { section: 'Genel' },
  { id: 'dashboard', label: 'Gösterge Paneli', icon: 'dashboard', page: 'dashboard.html' },
  { id: 'sanal-pos', label: 'Sanal POS', icon: 'wallet', page: 'sanal-pos.html' },

  { section: 'Ticaret' },
  { subsection: 'Cari' },
  { id: 'cari', label: 'Cari Kartlar', icon: 'users', page: 'cari.html' },
  { id: 'cari-islemler', label: 'Cari İşlemleri', icon: 'briefcase', page: 'cari-islemler.html' },
  { id: 'cari-fisleri', label: 'Cari Fişleri', icon: 'file-text', page: 'cari-fisleri.html' },
  { id: 'cari-ekstre', label: 'Cari Ekstre', icon: 'chart', page: 'cari-ekstre.html' },
  { subsection: 'Stok' },
  { id: 'stok', label: 'Stok Kartları', icon: 'box', page: 'stok.html' },
  { id: 'stok-islemler', label: 'Stok Fişleri', icon: 'trend-up', page: 'stok-islemler.html' },
  { id: 'stok-ekstre', label: 'Stok Ekstresi', icon: 'chart', page: 'stok-ekstre.html' },

  { section: 'Satış' },
  { id: 'teklif', label: 'Teklifler', icon: 'tag', page: 'teklif.html' },
  { id: 'as', label: 'Alınan Siparişler', icon: 'inbox', page: 'as.html' },
  { id: 'satis', label: 'Satış Faturaları', icon: 'trend-up', page: 'satis.html' },
  { id: 'hizli-satis', label: 'Hızlı Satış', icon: 'cash', page: 'hizli-satis.html' },
  { id: 'sicak-satis', label: 'Sıcak Satış', icon: 'truck', page: 'sicak-satis.html' },

  { section: 'Satın Alma' },
  { id: 'vs', label: 'Verilen Siparişler', icon: 'send', page: 'vs.html' },
  { id: 'alim', label: 'Alış Faturaları', icon: 'trend-down', page: 'alim.html' },

  { section: 'Finans / Muhasebe' },
  { id: 'kasa', label: 'Kasa', icon: 'wallet', page: 'kasa.html' },
  { id: 'kasa-ekstre', label: 'Kasa Ekstresi', icon: 'chart', page: 'kasa-ekstre.html' },
  { id: 'banka', label: 'Banka', icon: 'building', page: 'banka.html' },
  { id: 'banka-ekstre', label: 'Banka Ekstresi', icon: 'chart', page: 'banka-ekstre.html' },
  { id: 'cek-karnelerim', label: 'Çek Karnelerim', icon: 'file-check', page: 'cek-karnelerim.html' },
  { id: 'cek', label: 'Çek', icon: 'file-check', page: 'cek.html' },
  { id: 'senet', label: 'Senet', icon: 'file-text', page: 'senet.html' },
  { id: 'vade', label: 'Vade Takvimi', icon: 'calendar', page: 'vade.html' },

  { section: 'Stok / Depo' },
  { id: 'depo', label: 'Depo İşlemleri', icon: 'building', page: 'depo-islemler.html' },
  { id: 'depo-operasyon', label: 'Depo Operasyonları', icon: 'truck', page: 'depo-operasyon.html' },
  { id: 'depo-hazirlik', label: 'Hazırlanacak Siparişler', icon: 'inbox', page: 'depo-hazirlik.html' },
  { id: 'depo-teslimat', label: 'Teslim Edilecekler', icon: 'send', page: 'depo-teslimat.html' },
  { id: 'depo-mal-kabul', label: 'Mal Kabul', icon: 'file-check', page: 'depo-mal-kabul.html' },
  { id: 'depo-eksik', label: 'Eksik Ürünler', icon: 'alert', page: 'depo-eksik.html' },
  { id: 'depo-tamamlanan', label: 'Tamamlanan İşlemler', icon: 'check', page: 'depo-tamamlanan.html' },

  { section: 'İnsan Kaynakları' },
  { id: 'personel', label: 'Personeller', icon: 'user-id', page: 'personel.html' },
  { id: 'maas', label: 'Maaşlar', icon: 'cash', page: 'maas.html' },
  { id: 'avans', label: 'Avanslar', icon: 'hand-coins', page: 'avans.html' },
  { id: 'takvim', label: 'İzinler / Puantaj', icon: 'clock', page: 'takvim.html' },
  { id: 'basvuru', label: 'Başvurular', icon: 'user-plus', page: 'basvuru.html' },


  { section: 'Servis' },
  { id: 'servis', label: 'Servis İşlemleri', icon: 'briefcase', page: 'servis.html' },
  { id: 'servis-talep', label: 'Servis Talepleri', icon: 'file-text', page: 'servis-talep.html' },
  { id: 'servis-havuzu', label: 'Servis Havuzu', icon: 'users', page: 'servis-havuzu.html' },
  { id: 'servis-usta', label: 'Usta Çalışma Alanı', icon: 'briefcase', page: 'servis-usta.html' },

  { section: 'Raporlar' },
  { id: 'raporlar', label: 'Raporlar', icon: 'chart', page: 'raporlar.html' },

  { section: 'Sistem' },
  { id: 'settings', label: 'Sistem Ayarları', icon: 'settings', page: 'settings.html' },
];



/* ============================================================
   Role Based Workspace
   ============================================================ */
const ROLE_KEY = 'tcr3web_active_role';
const ROLE_DEFS = {
  yonetici: { label:'Yönetici', short:'Yönetici', color:'blue', user:'Ahmet Yılmaz', initials:'AY', desc:'Tam yetki · tüm modüller' },
  muhasebe: { label:'Muhasebe', short:'Muhasebe', color:'green', user:'Muhasebe Kullanıcısı', initials:'MK', desc:'Finans, cari, kasa, banka, fatura' },
  bayi: { label:'Bayi', short:'Bayi', color:'purple', user:'Bayi Kullanıcısı', initials:'BK', desc:'Sipariş, ekstre, evrak, destek' },
  satis: { label:'Satış & Pazarlama', short:'Satış', color:'orange', user:'Satış Kullanıcısı', initials:'SK', desc:'Cari, teklif, sipariş, satış, CRM' },
  sicak_satis: { label:'Sıcak Satış', short:'Sıcak Satış', color:'amber', user:'Araç Satış Kullanıcısı', initials:'SS', desc:'Araç deposu, rota, sahada satış' },
  personel: { label:'Personel', short:'Personel', color:'cyan', user:'Personel Kullanıcısı', initials:'PK', desc:'İzin, avans, maaş, evrak' },
  depo: { label:'Depo Personeli', short:'Depo', color:'cyan', user:'Depo Personeli', initials:'DP', desc:'Hazırlık, teslimat, mal kabul ve depo operasyonları' },
  uretim: { label:'Üretim', short:'Üretim', color:'teal', user:'Üretim Kullanıcısı', initials:'ÜK', desc:'İş emirleri, sarf, üretim raporları' },
  servis: { label:'Servis', short:'Servis', color:'red', user:'Servis Kullanıcısı', initials:'SV', desc:'Servis, randevu, garanti, yedek parça, tahsilat' },
  usta: { label:'Servis Ustası', short:'Usta', color:'amber', user:'Mehmet Usta', initials:'MU', desc:'Atanan servisler, saha işlemleri, parça, fotoğraf, imza ve tahsilat' }
};
const ROLE_NAV_IDS = {
  yonetici: ['dashboard','sanal-pos','cari','cari-islemler','cari-fisleri','cari-ekstre','stok','stok-islemler','stok-ekstre','teklif','as','satis','vs','alim','kasa','kasa-ekstre','banka','banka-ekstre','cek','senet','vade','depo','personel','maas','avans','takvim','basvuru','raporlar','settings'],
  muhasebe: ['dashboard','cari','cari-islemler','cari-fisleri','satis','alim','kasa','kasa-ekstre','banka','banka-ekstre','cek','senet','vade','sanal-pos','raporlar'],
  bayi: ['dashboard','stok','as','satis','cari-islemler','raporlar'],
  satis: ['dashboard','cari','stok','teklif','as','satis','sanal-pos','raporlar'],
  sicak_satis: ['dashboard','sicak-satis','cari','cari-islemler','stok','as','satis','sanal-pos','raporlar'],
  personel: ['dashboard','personel','takvim','avans','maas','basvuru','raporlar'],
  depo: ['depo-operasyon','depo-hazirlik','depo-teslimat','depo-mal-kabul','depo-eksik','depo-tamamlanan','depo'],
  uretim: ['dashboard','stok','stok-islemler','depo','uretim','raporlar'],
  servis: ['dashboard','cari','stok','servis','servis-talep','servis-havuzu','servis-usta','satis','sanal-pos','raporlar'],
  usta: ['servis-usta','servis-havuzu']
};
const ROLE_EXTRA_NAV = {
  uretim: [{ section:'Üretim' }, { id:'uretim', label:'Üretim İşlemleri', icon:'settings', page:'uretim.html' }],
  servis: [{ section:'Servis' }, { id:'servis', label:'Servis İşlemleri', icon:'briefcase', page:'servis.html' }, { id:'servis-talep', label:'Servis Talepleri', icon:'file-text', page:'servis-talep.html' }, { id:'servis-havuzu', label:'Servis Havuzu', icon:'users', page:'servis-havuzu.html' }, { id:'servis-usta', label:'Usta Çalışma Alanı', icon:'briefcase', page:'servis-usta.html' }],
  usta: [{ section:'Saha Servisi' }, { id:'servis-usta', label:'Çalışma Alanım', icon:'briefcase', page:'servis-usta.html' }, { id:'servis-havuzu', label:'Servis Havuzu', icon:'users', page:'servis-havuzu.html' }]
};
function getActiveRole(){
  try { return localStorage.getItem(ROLE_KEY) || 'yonetici'; } catch(e) { return 'yonetici'; }
}
function setActiveRole(role){
  const next = ROLE_DEFS[role] ? role : 'yonetici';
  try { localStorage.setItem(ROLE_KEY, next); } catch(e) {}
  document.body && document.body.setAttribute('data-role', next);
  return next;
}
function roleDef(){ return ROLE_DEFS[getActiveRole()] || ROLE_DEFS.yonetici; }
function navById(id){ return NAV.find(n => n.id === id) || null; }
function roleGroup(title, ids){
  const out = [{ section:title }];
  ids.forEach(id => { const item = navById(id); if (item) out.push(item); });
  return out;
}
function getRoleNav(){
  const role = getActiveRole();
  if (role === 'yonetici') return NAV.slice();
  if (role === 'muhasebe') return [
    ...roleGroup('Genel', ['dashboard']),
    ...roleGroup('Cari / Finans', ['cari','cari-islemler','cari-fisleri','kasa','kasa-ekstre','banka','banka-ekstre','cek','senet','vade','sanal-pos']),
    ...roleGroup('Faturalar', ['satis','hizli-satis','alim']),
    ...roleGroup('Raporlar', ['raporlar'])
  ];
  if (role === 'bayi') return [
    ...roleGroup('Bayi Paneli', ['dashboard','stok','as','satis','hizli-satis','cari-islemler','raporlar'])
  ];
  if (role === 'satis') return [
    ...roleGroup('Satış Paneli', ['dashboard','cari','stok','teklif','as','satis','hizli-satis','sanal-pos','raporlar'])
  ];
  if (role === 'sicak_satis') return [
    ...roleGroup('Sıcak Satış Paneli', ['dashboard','sicak-satis','hizli-satis','cari','stok','as','satis']),
    ...roleGroup('Tahsilat / POS', ['cari-islemler','sanal-pos']),
    ...roleGroup('Raporlar', ['raporlar'])
  ];
  if (role === 'personel') return [
    ...roleGroup('Personel Paneli', ['dashboard','personel','takvim','avans','maas','basvuru','raporlar'])
  ];
  if (role === 'depo') return [
    ...roleGroup('Depo Operasyonları', ['depo-operasyon','depo-hazirlik','depo-teslimat','depo-mal-kabul','depo-eksik','depo-tamamlanan']),
    ...roleGroup('Depo Yönetimi', ['depo'])
  ];
  if (role === 'uretim') return [
    ...roleGroup('Üretim Paneli', ['dashboard','stok','stok-islemler','depo']),
    { section:'Üretim' }, { id:'uretim', label:'Üretim İşlemleri', icon:'settings', page:'uretim.html' },
    ...roleGroup('Raporlar', ['raporlar'])
  ];
  if (role === 'servis') return [
    ...roleGroup('Servis Paneli', ['dashboard','cari','stok']),
    { section:'Servis' },
    { id:'servis', label:'Servis İşlemleri', icon:'briefcase', page:'servis.html' },
    { id:'servis-talep', label:'Servis Talepleri', icon:'file-text', page:'servis-talep.html' },
    { id:'servis-havuzu', label:'Servis Havuzu', icon:'users', page:'servis-havuzu.html' },
    ...roleGroup('Tahsilat / Satış / Rapor', ['satis','sanal-pos','raporlar'])
  ];
  return NAV.slice();
}
function roleSwitch(role){
  setActiveRole(role);
  const current = (location.pathname.split('/').pop() || 'dashboard.html');
  location.href = current === 'index.html' ? 'pages/dashboard.html' : 'dashboard.html';
}
function roleClass(){ return 'role-' + getActiveRole(); }
function roleKpi(icon, label, value, meta, tone=''){
  const color = tone === 'danger' ? 'tcr-ac-red' : tone === 'warn' ? 'tcr-ac-orange' : tone === 'accent' || tone === 'success' ? 'tcr-ac-green' : tone === 'info' ? 'tcr-ac-cyan' : tone === 'purple' ? 'tcr-ac-purple' : 'tcr-ac-blue';
  return `<div class="tcr-action-card ${color}"><span class="tcr-ac-icon">${ICONS[icon]||ICONS.dashboard}</span><span class="tcr-ac-content"><span class="tcr-ac-title">${label}</span><span class="tcr-ac-desc">${value}</span></span></div>`;
}
function renderRoleDashboard(){
  const r = getActiveRole();
  const def = roleDef();
  const data = {
    yonetici: {
      title:'Yönetici Gösterge Paneli', sub:'Tüm şirket süreçleri tek yönetim ekranında.',
      quick:['Yeni Satış','Yeni Tahsilat','Stok Fişi','Rapor Al'],
      kpis:[['wallet','Toplam Kasa',fmtMoney(309900),'güncel bakiye',''],['building','Toplam Banka',fmtMoney(1501700),'4 banka hesabı','accent'],['file-check','Çek / Senet',fmtMoney(234800),'10 aktif evrak','warn'],['alert','Vade Uyarısı',fmtMoney(118000),'7 gün içinde','danger']],
      cards:[['Bekleyen Siparişler','8 açık sipariş · 3 onay bekliyor'],['Kritik Stok','2 ürün minimum stok altında'],['Aylık POS','168.400 ₺ işlem hacmi']]
    },
    muhasebe: {
      title:'Muhasebe Paneli', sub:'Tahsilat, ödeme, banka, kasa ve vade takibi.',
      quick:['Yeni Tahsilat','Yeni Ödeme','Banka Hareketi','Cari Ekstre'],
      kpis:[['wallet','Günlük Tahsilat',fmtMoney(42800),'12 işlem',''],['cash','Günlük Ödeme',fmtMoney(18600),'7 işlem','warn'],['building','Banka Durumu',fmtMoney(1501700),'4 hesap','accent'],['calendar','Yaklaşan Vade',fmtMoney(118000),'7 gün içinde','danger']],
      cards:[['Tahsilat Listesi','Bugün 12 tahsilat tamamlandı'],['Ödenmeyen Faturalar','5 açık fatura takipte'],['Vade Takvimi','3 çek / senet için uyarı var']]
    },
    bayi: {
      title:'Bayi Paneli', sub:'Sipariş, borç durumu, faturalar ve destek işlemleri.',
      quick:['Sipariş Ver','Siparişlerim','Cari Ekstre','Destek Talebi'],
      kpis:[['inbox','Siparişlerim','14','3 açık sipariş',''],['wallet','Borç Durumu',fmtMoney(84500),'limit dahilinde','warn'],['file-text','Faturalarım','9','son 30 gün','accent'],['check','Cari Limit',fmtMoney(250000),'kalan 165.500 ₺','']],
      cards:[['Ürünler','Bayi fiyatları ile ürün listesi'],['Son Ödemeler','2 ödeme sisteme işlendi'],['Destek','1 açık destek kaydı var']]
    },
    satis: {
      title:'Satış & Pazarlama Paneli', sub:'Teklif, müşteri, sipariş ve satış hedefleri.',
      quick:['Yeni Teklif','Yeni Sipariş','Cari Ziyaret','Fiyat Listesi'],
      kpis:[['tag','Bugünkü Teklif','7','2 teklif onay bekliyor',''],['inbox','Bekleyen Sipariş','8','357.500 ₺','warn'],['trend-up','Aylık Satış',fmtMoney(380300),'hedef %84','accent'],['calendar','Ziyaret Planı','5','bugünkü plan','']],
      cards:[['Teklif Dönüşümü','Bu ay %42 dönüşüm oranı'],['Aktif Müşteriler','32 cari satış takibinde'],['CRM Notları','6 hatırlatma bekliyor']]
    },
    sicak_satis: {
      title:'Sıcak Satış Paneli', sub:'Araç deposu, rota, tahsilat ve sanal POS ile sahada satış.',
      quick:['Araçtan Satış','Tahsilat Al','Sanal POS Çek','Eksik Ürün Siparişi'],
      kpis:[['truck','Araç Deposu','ARÇ-34','sabit araç deposu','accent'],['wallet','Günlük Tahsilat',fmtMoney(18450),'nakit + havale',''],['cash','Sanal POS',fmtMoney(12600),'bugünkü çekim','accent'],['calendar','Haftalık Rota','42 Cari','12 ziyaret bugün','warn']],
      cards:[['Yetki Kuralı','Sadece kendisine tanımlı carileri görür'],['Tahsilat Kuralı','Nakit, havale/EFT, çek ve sanal POS tahsilatı girebilir'],['Eksik Ürün','Araç deposunda yoksa merkezden sipariş talebi oluşturur']]
    },
    personel: {
      title:'Personel Paneli', sub:'Kişisel izin, avans, bordro ve evrak işlemleri.',
      quick:['İzin Talebi','Avans Talebi','Evraklarım','Puantajım'],
      kpis:[['clock','Kalan İzin','12 Gün','yıllık izin',''],['cash','Son Maaş',fmtMoney(42500),'Haziran bordrosu','accent'],['hand-coins','Avans Durumu',fmtMoney(5000),'1 açık talep','warn'],['file-text','Evraklarım','6','aktif belge','']],
      cards:[['Puantaj','Bu ay 22 çalışma günü'],['İzin Talepleri','1 talep onay bekliyor'],['Duyurular','2 şirket duyurusu var']]
    },
    depo: {
      title:'Depo Paneli', sub:'Stok, depo giriş/çıkış, sayım ve sevkiyat takibi.',
      quick:['Depo Girişi','Depo Çıkışı','Depo Virman','Sayım Fişi'],
      kpis:[['box','Toplam Stok','1.248','aktif ürün',''],['trend-down','Düşük Stok','18','kontrol gerekli','danger'],['building','Depo Sayısı','4','aktif depo','accent'],['send','Sevkiyat','9','hazırlanıyor','warn']],
      cards:[['Depo Hareketleri','Bugün 34 hareket işlendi'],['Depo Virman','3 depo arası transfer bekliyor'],['Sayım Fişleri','2 açık sayım var']]
    },
    uretim: {
      title:'Üretim Paneli', sub:'İş emirleri, sarf malzeme, fire ve üretim takibi.',
      quick:['Yeni İş Emri','Sarf Çıkışı','Üretim Girişi','Fire Kaydı'],
      kpis:[['settings','Açık İş Emri','11','3 acil','warn'],['box','Üretilen Miktar','2.450','bu hafta','accent'],['trend-down','Fire Oranı','%2,4','hedef altında',''],['calendar','Planlanan Üretim','7','bugünkü sıra','']],
      cards:[['İş Emirleri','11 açık üretim emri'],['Sarf Malzemeler','4 kritik hammadde uyarısı'],['Kalite Kontrol','2 ürün numune bekliyor']]
    },
    servis: {
      title:'Servis Paneli', sub:'Servis talebi, randevu, iş emri, saha servis, garanti, yedek parça ve tahsilat takibi.',
      quick:['Yeni Servis Talebi','İş Emri Ata','Randevu Planla','Sanal POS Tahsilat'],
      kpis:[['briefcase','Açık Servis','21','6 acil','warn'],['calendar','Bugünkü Randevu','8','saha planı',''],['box','Araç Parça Stoğu','38','kullanılabilir','accent'],['wallet','Servis Tahsilatı',fmtMoney(32800),'nakit + POS','accent']],
      cards:[['Servis Akışı','Talep → Randevu → İş Emri → Saha Servis → Fatura'],['Garanti İşlemleri','Cihaz seçilince garanti ve bakım sözleşmesi etiketi görünür'],['Teknisyen Planı','Araç, rota, yedek parça deposu ve dijital imza ile çalışır']]
    }
  }[r];
  const roleOptions = Object.entries(ROLE_DEFS).map(([key,val]) => `<button class="role-mini role-${key} ${key===r?'active':''}" data-role-card="${key}" onclick="roleSwitch('${key}')"><strong>${val.short}</strong><span>${val.desc}</span></button>`).join('');
  return `<div class="page-head role-page-head ${roleClass()}">
    <div><div class="breadcrumb"><a href="dashboard.html">Rol Paneli</a><span>›</span><span>${def.label}</span></div><h1 class="page-title">${data.title}</h1><div class="page-sub">${data.sub}</div></div>
    <div class="role-badge-lg">${def.label}</div>
  </div>
  <div class="role-switch-board mb-6">${roleOptions}</div>
  <div class="role-quick-actions mb-6">${data.quick.map(q=>`<button class="btn btn-primary btn-sm" onclick="toast('${q} prototip ekranı')">${ICONS.plus} ${q}</button>`).join('')}</div>
  <div class="tcr-ac-grid mb-6">${data.kpis.map(k=>roleKpi(...k)).join('')}</div>
  <div class="grid-3 mb-6">${data.cards.map(c=>`<div class="card role-card"><div class="card-head"><div class="card-title">${c[0]}</div><span class="pill">${def.short}</span></div><div class="card-body"><p class="text-mute" style="margin:0">${c[1]}</p></div></div>`).join('')}</div>
  <div class="card"><div class="card-head"><div class="card-title">Rol Yetki Özeti</div><span class="pill">HTML MASTER</span></div><div class="card-body"><div class="role-permission-list">${getRoleNav().filter(x=>x.id).map(x=>`<span>${ICONS[x.icon]||''}${x.label}</span>`).join('')}</div></div></div>`;
}

const ICONS = {
  'dashboard': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  'settings': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  'users': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  'box': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  'trend-up': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  'trend-down': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
  'wallet': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>',
  'building': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>',
  'truck': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M5 11h5"/></svg>',
  'file-check': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>',
  'file-text': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  'calendar': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  'user-id': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-6"/><path d="M19 8v6"/></svg>',
  'user-plus': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
  'clock': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  'cash': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>',
  'hand-coins': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m3 22 5-5"/><path d="M16 7a4 4 0 0 0 0-8 4 4 0 0 0 0 8z" transform="translate(2 2)"/></svg>',
  'chart': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  'menu': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  'search': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  'bell': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  'fullscreen': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
  'refresh-hard': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/><path d="M12 7v5l3 2"/></svg>',
  'sun': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  'moon': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  'plus': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  'close': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  'edit': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  'trash': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  'eye': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  'download': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  'print': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  'check': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  'arrow-up': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  'arrow-down': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
  'logout': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  'chevron-right': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  'filter': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  'mail': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  'phone': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  'map-pin': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  'briefcase': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  'alert': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  'tag': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  'inbox': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
  'send': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  'whatsapp': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  'share': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
};

// Underscore aliases so template literals can use ICONS.trend_up etc.
['trend-up','trend-down','arrow-up','arrow-down','file-check','file-text',
 'hand-coins','user-plus','map-pin','user-id','chevron-right'].forEach(k => {
  ICONS[k.replace(/-/g,'_')] = ICONS[k];
});
/* ============================================================
   Render sidebar + topbar
   ============================================================ */
function renderShell(activeId) {
  const role = roleDef();
  const nav = getRoleNav().map(item => {
    if (item.section) return `<div class="sidebar-section">${item.section}</div>`;
    if (item.subsection) return `<div class="sidebar-subsection">${item.subsection}</div>`;
    const cls = item.id === activeId ? 'nav-item active' : 'nav-item';
    const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
    return `<a href="${item.page}" class="${cls}" data-id="${item.id}" data-sidebar-nav="1">
      <span class="nav-icon">${ICONS[item.icon] || ''}</span>
      <span class="nav-text">${item.label}</span>
      ${badge}
    </a>`;
  }).join('');

  const pickerModal = `<div class="modal-backdrop picker-locked" id="pickerModal">
    <div class="modal xl picker-modal-box">
      <div class="modal-head">
        <div class="modal-title" id="picker-title">Seçim</div>
      </div>
      <div class="picker-search">
        <span>${ICONS.search}</span>
        <input type="text" id="picker-q" placeholder="Ara... (ad, kod, şehir)" oninput="filterPicker(this.value)" autocomplete="off">
        <span id="picker-count" style="font-size:12px;color:var(--text-mute);white-space:nowrap"></span>
        <div class="picker-columns-wrap">
          <button class="btn btn-light btn-sm picker-columns-btn" type="button" onclick="togglePickerColumnMenu(event)">${ICONS.eye} Kolonlar</button>
          <div class="picker-columns-menu" id="picker-columns-menu"></div>
        </div>
        <button class="btn btn-primary btn-sm picker-quick-add-btn" id="picker-quick-add-btn" type="button" onclick="openQuickAddFromPicker()" title="Hızlı ekle">${ICONS.plus} <span id="picker-quick-add-label">Ekle</span></button>
      </div>
      <div class="picker-list" id="picker-list"><div class="picker-empty">Yükleniyor…</div></div>
      <div class="modal-foot picker-foot">
        <div class="picker-foot-msg" id="picker-foot-msg"></div>
        <button class="btn btn-danger" type="button" onclick="closePickerModal()">${ICONS.close} Kapat</button>
      </div>
    </div>
  </div>`;

  const quickAddModal = `<div class="modal-backdrop quick-add-locked" id="quickAddModal">
    <div class="modal md quick-add-modal-box">
      <div class="modal-head">
        <div class="modal-title" id="quick-add-title">Hızlı Ekle</div>
        <button class="icon-btn" type="button" onclick="closeModal('quickAddModal')">${ICONS.close}</button>
      </div>
      <div class="modal-body" id="quick-add-body"></div>
      <div class="modal-foot quick-add-foot">
        <div class="modal-foot-info" id="quick-add-info">Demo HTML kayıt ekleme</div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button class="btn btn-danger" type="button" onclick="closeModal('quickAddModal')">${ICONS.close} Vazgeç</button>
          <button class="btn btn-success" type="button" onclick="saveQuickAddFromPicker()">${ICONS.save} Kaydet</button>
        </div>
      </div>
    </div>
  </div>`;

  const priceModal = `<div class="modal-backdrop" id="pricePickerModal">
    <div class="modal sm price-picker-modal">
      <div class="modal-head">
        <div class="modal-title" id="price-picker-title">Fiyat Seç</div>
        <button class="icon-btn" onclick="closePricePicker()">${ICONS.close}</button>
      </div>
      <div class="modal-body" id="price-picker-body"></div>
      <div class="modal-foot price-picker-foot">
        <div class="price-current-foot" id="price-current-foot">Mevcut Fiyat: 0,00 ₺</div>
        <button class="btn btn-danger" onclick="closePricePicker()">${ICONS.close} Kapat</button>
      </div>
    </div>
  </div>`;

  return `
    <aside class="sidebar ${roleClass()}">
      <div class="sidebar-brand">
        <div class="sidebar-brand-logo"><img class="sidebar-brand-img" src="${APP_ASSET_PREFIX}img/tcr3web-logo-clean.svg" alt="TCR3WEB ERP MASTER V1"></div>
      </div>
      <nav class="sidebar-nav">${nav}</nav>
      <div class="sidebar-foot">
        <div>v1.0 · HTML Şablon</div>
        <div style="margin-top:4px;color:var(--c-primary-500)">© 2026 Tcr3WEB</div>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <button class="icon-btn" onclick="toggleSidebar()" aria-label="Menü">
          ${ICONS.menu}
        </button>
        <button class="topbar-weather" id="topbarWeather" type="button" onclick="refreshHeaderWeather(true)" title="Profil konumuna göre hava durumunu yenile" aria-label="Profil konumuna göre hava durumunu göster">
          <span class="topbar-weather-icon" id="topbarWeatherIcon">${tcr3WeatherSvg('PARTLY_CLOUDY', true)}</span>
          <span class="topbar-weather-copy">
            <strong id="topbarWeatherPlace">Osmaniye / Bahçe</strong>
            <small id="topbarWeatherState">Hava durumu yükleniyor</small>
          </span>
          <b id="topbarWeatherTemp" class="topbar-weather-temp">--°</b>
        </button>
        <div class="topbar-spacer"></div>
        <div class="topbar-actions">
          <button class="icon-btn topbar-tool-btn pwa-open-btn" data-tool="pwa" type="button" onclick="openOrInstallTcr3App()" aria-label="Uygulamada aç" title="Uygulamada aç">
            ${ICONS.box}
          </button>
          <button class="icon-btn topbar-tool-btn" data-tool="hard-refresh" type="button" onclick="hardRefreshPage()" aria-label="Önbellek ve verileri temizle" title="Önbellek ve verileri temizle">
            ${ICONS['refresh-hard']}
          </button>
          <button class="icon-btn" aria-label="Bildirimler" style="position:relative">
            ${ICONS.bell}
            <span style="position:absolute;top:6px;right:6px;width:8px;height:8px;background:var(--c-danger-400);border-radius:50%;border:2px solid white"></span>
          </button>
          <div class="topbar-user" onclick="openUserProfileModal()" title="Kullanıcı profili">
            <div class="avatar">${role.initials}</div>
            <div class="user-info">
              <div class="user-name">${role.user}</div>
              <div class="user-role">${role.label}</div>
            </div>
          </div>
          <a href="../index.html" class="icon-btn topbar-logout-btn" aria-label="Çıkış" title="Çıkış">${ICONS.logout}</a>
        </div>
      </header>
      <main class="content" id="content"></main>
      <footer class="app-footer">
        <div class="app-footer-inner">
          <span>© 2026 Tcr3WEB · Ön Muhasebe HTML Şablonu</span>
          <div class="app-footer-links">
            <a href="raporlar.html">Raporlar</a>
            <span>·</span>
            <a href="settings.html">Ayarlar</a>
            <span>·</span>
            <span class="pill" style="font-size:11px;padding:2px 8px">HTML Şablon</span>
          </div>
        </div>
      </footer>
    </div>
    ${pickerModal}
    ${priceModal}
    <div class="page-loader-backdrop" id="pageLoader" aria-hidden="true">
      <div class="page-loader-card">
        <div class="page-loader-logo-spin"><span class="page-loader-ring"></span><img src="${APP_ASSET_PREFIX}img/tcr3web-logo-clean.svg" alt="Tcr3WEB Logo"></div>
        <div>
          <strong id="pageLoaderTitle">Yükleniyor...</strong>
          <span id="pageLoaderSub"></span>
        </div>
      </div>
    </div>
  `;
}

const TCR3_FULLSCREEN_KEY = 'tcr3web_fullscreen_preferred';
const TCR3_THEME_KEY = 'tcr3web_theme_mode';
const TCR3_APP_MODE_KEY = 'tcr3web_app_mode';

function getThemeMode() {
  try { return localStorage.getItem(TCR3_THEME_KEY) || 'light'; } catch (e) { return 'light'; }
}
function setThemeMode(mode) {
  const next = mode === 'dark' ? 'dark' : 'light';
  try { localStorage.setItem(TCR3_THEME_KEY, next); } catch (e) {}
  document.body.classList.toggle('theme-dark', next === 'dark');
  updateThemeButtonState();
}
function updateThemeButtonState() {
  const dark = getThemeMode() === 'dark';
  document.querySelectorAll('.topbar-tool-btn[data-tool="theme"]').forEach(btn => {
    btn.classList.toggle('active', dark);
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.setAttribute('title', dark ? 'Light moda geç' : 'Dark moda geç');
    const slot = btn.querySelector('.theme-icon-slot');
    if (slot) slot.innerHTML = dark ? ICONS.sun : ICONS.moon;
  });
}
function toggleThemeMode() {
  setThemeMode(getThemeMode() === 'dark' ? 'light' : 'dark');
}


function isFullscreenActive() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

function requestAppFullscreen() {
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
  if (!req) return Promise.resolve(false);
  try {
    const result = req.call(el);
    if (result && typeof result.then === 'function') return result.then(() => true).catch(() => false);
    return Promise.resolve(true);
  } catch (e) { return Promise.resolve(false); }
}

function exitAppFullscreen() {
  const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
  if (!exit) return Promise.resolve(false);
  try {
    const result = exit.call(document);
    if (result && typeof result.then === 'function') return result.then(() => true).catch(() => false);
    return Promise.resolve(true);
  } catch (e) { return Promise.resolve(false); }
}

function getAppModePreference() {
  try { return localStorage.getItem(TCR3_APP_MODE_KEY) === '1' || localStorage.getItem(TCR3_FULLSCREEN_KEY) === '1'; }
  catch (e) { return false; }
}

function setAppModePreference(enabled) {
  try {
    localStorage.setItem(TCR3_APP_MODE_KEY, enabled ? '1' : '0');
    localStorage.setItem(TCR3_FULLSCREEN_KEY, enabled ? '1' : '0');
  } catch (e) {}
  document.body.classList.toggle('app-fullscreen-mode', !!enabled);
  document.body.classList.toggle('fullscreen-preferred', !!enabled);
  syncAppModeUrl(enabled);
  updateFullscreenButtonState();
}

function syncAppModeUrl(enabled) {
  try {
    const url = new URL(window.location.href);
    if (enabled) url.searchParams.set('app', '1');
    else url.searchParams.delete('app');
    window.history.replaceState({}, '', url.toString());
  } catch (e) {}
}

function applyAppModeFromUrl() {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get('app') === '1' || url.searchParams.get('fullscreen') === '1' || url.searchParams.get('uygulama') === '1') {
      localStorage.setItem(TCR3_APP_MODE_KEY, '1');
      localStorage.setItem(TCR3_FULLSCREEN_KEY, '1');
    }
  } catch (e) {}
  const enabled = getAppModePreference();
  document.body.classList.toggle('app-fullscreen-mode', enabled);
  document.body.classList.toggle('fullscreen-preferred', enabled);
  if (enabled) syncAppModeUrl(true);
  updateFullscreenButtonState();
}

function setFullscreenPreference(enabled) { setAppModePreference(enabled); }
function getFullscreenPreference() { return getAppModePreference(); }

function updateFullscreenButtonState() {
  const preferred = getAppModePreference();
  const active = isFullscreenActive();
  document.querySelectorAll('.topbar-tool-btn[data-tool="fullscreen"]').forEach(btn => {
    btn.classList.toggle('active', preferred || active);
    btn.setAttribute('aria-pressed', preferred ? 'true' : 'false');
    btn.setAttribute('title', preferred ? 'Uygulama modundan çık' : 'Uygulamada aç');
    btn.setAttribute('aria-label', preferred ? 'Uygulama modundan çık' : 'Uygulamada aç');
  });
}

function toggleFullscreenMode() {
  const willEnable = !getAppModePreference();
  setAppModePreference(willEnable);
  if (willEnable) {
    // Gerçek browser fullscreen sayfa değişiminde korunmaz; kalıcı olan app=1 uygulama modudur.
    requestAppFullscreen().finally(updateFullscreenButtonState);
  } else {
    if (isFullscreenActive()) exitAppFullscreen().finally(updateFullscreenButtonState);
    else updateFullscreenButtonState();
  }
}

function reApplyFullscreenBeforeNavigation() {
  if (!getAppModePreference()) return Promise.resolve(false);
  if (isFullscreenActive()) return Promise.resolve(true);
  return requestAppFullscreen().then(ok => { updateFullscreenButtonState(); return ok; });
}

function appModeHref(href) {
  if (!href || !getAppModePreference()) return href;
  try {
    const url = new URL(href, window.location.href);
    url.searchParams.set('app', '1');
    return url.pathname.split('/').pop() + url.search + url.hash;
  } catch (e) {
    return href + (href.includes('?') ? '&' : '?') + 'app=1';
  }
}

// 792: Fullscreen tercihi sayfa geçişlerinde hatırlanır.
// Tarayıcı güvenliği nedeniyle yeni sayfa yüklenince gerçek fullscreen ancak sonraki kullanıcı tıklamasında yeniden istenebilir.
document.addEventListener('fullscreenchange', updateFullscreenButtonState);
document.addEventListener('webkitfullscreenchange', updateFullscreenButtonState);
document.addEventListener('msfullscreenchange', updateFullscreenButtonState);
document.addEventListener('DOMContentLoaded', function(){
  // PWA kurulum modu tarayıcı fullscreen API'sinden bağımsızdır.
  document.body.classList.toggle('theme-dark', getThemeMode() === 'dark');
  updateFullscreenButtonState();
  updateThemeButtonState();
  updatePwaOpenButtonState();
});
window.addEventListener('pageshow', function(){ updateThemeButtonState(); updatePwaOpenButtonState(); });


const TCR3_WEATHER_CACHE_KEY = 'tcr3web_header_weather_profile_v2';
const TCR3_PROFILE_KEY = 'tcr3web_user_profile_v1';
const TCR3_GOOGLE_API_KEY = 'tcr3web_google_maps_api_key';

function tcr3WeatherSvg(type, isDay) {
  const t=String(type||'').toUpperCase();
  const base='viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  if (t.includes('THUNDER')) return `<svg ${base}><path d="M17.5 16H9a7 7 0 1 1 6.7-9H17a4.5 4.5 0 1 1 .5 9Z"/><path d="m13 12-3 5h4l-3 5"/></svg>`;
  if (t.includes('SNOW')||t.includes('ICE')||t.includes('SLEET')) return `<svg ${base}><path d="M17.5 16H9a7 7 0 1 1 6.7-9H17a4.5 4.5 0 1 1 .5 9Z"/><path d="M8 20h.01M12 20h.01M16 20h.01"/></svg>`;
  if (t.includes('RAIN')||t.includes('DRIZZLE')||t.includes('SHOWERS')) return `<svg ${base}><path d="M17.5 16H9a7 7 0 1 1 6.7-9H17a4.5 4.5 0 1 1 .5 9Z"/><path d="m8 19-1 2m5-2-1 2m5-2-1 2"/></svg>`;
  if (t.includes('FOG')||t.includes('HAZE')||t.includes('MIST')) return `<svg ${base}><path d="M4 14h16M5 18h14M8 10h8M10 6h4"/></svg>`;
  if (t==='CLEAR') return isDay===false ? `<svg ${base}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>` : `<svg ${base}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
  return `<svg ${base}><path d="M17.5 19H9a7 7 0 1 1 6.7-9H17a4.5 4.5 0 1 1 .5 9Z"/><path d="M8 9a4 4 0 0 1 7.6-1.7"/></svg>`;
}

function getTcr3UserProfile() {
  const roleId = localStorage.getItem('tcr3web_active_role') || 'yonetici';
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(TCR3_PROFILE_KEY) || '{}') || {}; } catch(e) {}
  return { il:'Osmaniye', ilce:'Bahçe', ...(stored[roleId] || {}) };
}

function saveTcr3UserProfile(profile) {
  const roleId = localStorage.getItem('tcr3web_active_role') || 'yonetici';
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(TCR3_PROFILE_KEY) || '{}') || {}; } catch(e) {}
  stored[roleId] = { il:String(profile.il || '').trim(), ilce:String(profile.ilce || '').trim() };
  localStorage.setItem(TCR3_PROFILE_KEY, JSON.stringify(stored));
  localStorage.removeItem(TCR3_WEATHER_CACHE_KEY);
}

function openUserProfileModal() {
  const p = getTcr3UserProfile();
  const body = `<div class="profile-location-form"><div class="form-group"><label>İkamet İli</label><input id="profileResidenceCity" class="form-control" value="${escapeHtml(p.il)}" placeholder="Örn. Osmaniye"></div><div class="form-group"><label>İkamet İlçesi</label><input id="profileResidenceDistrict" class="form-control" value="${escapeHtml(p.ilce)}" placeholder="Örn. Bahçe"></div><div class="profile-location-note">Hava durumu bu bilgiler üzerinden gösterilir. Cihaz konumu kullanılmaz.</div></div>`;
  if (typeof showConfirmModal === 'function') {
    showConfirmModal({title:'Kullanıcı Profili',message:body,icon:'user',confirmText:'Kaydet',cancelText:'Vazgeç',allowHtml:true,onConfirm:function(){const il=document.getElementById('profileResidenceCity'),ilce=document.getElementById('profileResidenceDistrict');if(!il?.value.trim()||!ilce?.value.trim()){toast('İkamet ili ve ilçesi zorunludur','error');return false;}saveTcr3UserProfile({il:il.value,ilce:ilce.value});refreshHeaderWeather(true);toast('Profil konumu güncellendi','success');}});
  }
}

function setHeaderWeather(place, state, temp, type, isDay, error) {
  const root=document.getElementById('topbarWeather'),iconEl=document.getElementById('topbarWeatherIcon'),placeEl=document.getElementById('topbarWeatherPlace'),stateEl=document.getElementById('topbarWeatherState'),tempEl=document.getElementById('topbarWeatherTemp');
  if(!root||!iconEl||!placeEl||!stateEl||!tempEl)return;
  placeEl.textContent=place||'Profil konumu yok'; stateEl.textContent=state||'Hava durumu alınamadı'; tempEl.textContent=Number.isFinite(Number(temp))?Math.round(Number(temp))+'°':'--°'; iconEl.innerHTML=tcr3WeatherSvg(type,isDay);
  root.title=((place||'Profil konumu yok')+' · '+(state||'Hava durumu alınamadı')).trim();
  root.classList.toggle('weather-error',!!error); root.classList.toggle('weather-ready',!error&&Number.isFinite(Number(temp)));
}

async function geocodeTcr3ProfileLocation(il, ilce, apiKey) {
  const address=[ilce,il,'Türkiye'].filter(Boolean).join(', ');
  const url=`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&language=tr&region=tr&key=${encodeURIComponent(apiKey)}`;
  const response=await fetch(url,{cache:'no-store'}); if(!response.ok)throw new Error('Yer bilgisi alınamadı');
  const data=await response.json(); if(data.status!=='OK'||!data.results?.length)throw new Error(data.error_message||'Profil konumu bulunamadı');
  return data.results[0].geometry.location;
}

async function loadTcr3Weather(latitude, longitude, apiKey) {
  const url=`https://weather.googleapis.com/v1/currentConditions:lookup?key=${encodeURIComponent(apiKey)}&location.latitude=${encodeURIComponent(latitude)}&location.longitude=${encodeURIComponent(longitude)}&unitsSystem=METRIC&languageCode=tr`;
  const response=await fetch(url,{cache:'no-store'}); if(!response.ok)throw new Error('Hava durumu alınamadı');
  const data=await response.json();
  return {temp:data?.temperature?.degrees,type:data?.weatherCondition?.type||'PARTLY_CLOUDY',state:data?.weatherCondition?.description?.text||'Hava durumu',isDay:!!data?.isDaytime};
}

function readTcr3WeatherCache(profile, allowExpired) {
  try {const cache=JSON.parse(localStorage.getItem(TCR3_WEATHER_CACHE_KEY)||'null');if(!cache||cache.il!==profile.il||cache.ilce!==profile.ilce)return null;if(!allowExpired&&Date.now()-cache.time>30*60*1000)return null;return cache;} catch(e){return null;}
}
function writeTcr3WeatherCache(value){try{localStorage.setItem(TCR3_WEATHER_CACHE_KEY,JSON.stringify({...value,time:Date.now()}));}catch(e){}}

async function refreshHeaderWeather(force) {
  const profile=getTcr3UserProfile(),place=`${profile.il} / ${profile.ilce}`,apiKey=(localStorage.getItem(TCR3_GOOGLE_API_KEY)||'').trim();
  const cached=!force&&readTcr3WeatherCache(profile,false); if(cached){setHeaderWeather(place,cached.state,cached.temp,cached.type,cached.isDay,false);return;}
  const last=readTcr3WeatherCache(profile,true);
  if(!apiKey){if(last){setHeaderWeather(place,last.state,last.temp,last.type,last.isDay,false);}else{setHeaderWeather(place,'Google API anahtarı girilmeli',null,'PARTLY_CLOUDY',true,true);}return;}
  setHeaderWeather(place,'Hava durumu yükleniyor',last?.temp,last?.type,last?.isDay,false);
  try {const point=await geocodeTcr3ProfileLocation(profile.il,profile.ilce,apiKey);const weather=await loadTcr3Weather(point.lat,point.lng,apiKey);setHeaderWeather(place,weather.state,weather.temp,weather.type,weather.isDay,false);writeTcr3WeatherCache({il:profile.il,ilce:profile.ilce,...weather});}
  catch(e){if(last)setHeaderWeather(place,last.state,last.temp,last.type,last.isDay,false);else setHeaderWeather(place,'Hava durumu alınamadı',null,'PARTLY_CLOUDY',true,true);}
}


let TCR3_DEFERRED_INSTALL_PROMPT = null;
let TCR3_PWA_PROMPT_WAITERS = [];
const TCR3_PWA_BUILD = '20260711-699';

function getTcr3BaseUrl() {
  const here = new URL(window.location.href);
  const pageIndex = here.pathname.lastIndexOf('/pages/');
  const basePath = pageIndex >= 0 ? here.pathname.slice(0, pageIndex + 1) : here.pathname.replace(/[^/]*$/, '');
  return new URL(basePath, here.origin);
}

function getTcr3HttpsUrl() {
  const u = new URL(window.location.href);
  if (u.protocol === 'http:' && !['localhost','127.0.0.1'].includes(u.hostname)) u.protocol = 'https:';
  return u.href;
}

function registerTcr3Pwa() {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return Promise.resolve(null);
  const baseUrl = getTcr3BaseUrl();
  const swUrl = new URL('sw.js?v=' + encodeURIComponent(TCR3_PWA_BUILD), baseUrl).href;
  return navigator.serviceWorker.register(swUrl, { scope: baseUrl.pathname, updateViaCache:'none' })
    .then(reg => {
      try { reg.update(); } catch(e) {}
      return navigator.serviceWorker.ready;
    })
    .catch(() => null);
}

function isTcr3Standalone() {
  return (window.matchMedia && (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches || window.matchMedia('(display-mode: minimal-ui)').matches)) ||
    window.navigator.standalone === true || document.referrer.indexOf('android-app://') === 0;
}

function isTcr3Android() { return /android/i.test(navigator.userAgent || ''); }
function isTcr3IOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent || ''); }
function isTcr3SamsungBrowser() { return /samsungbrowser/i.test(navigator.userAgent || ''); }

function updatePwaOpenButtonState() {
  document.querySelectorAll('.pwa-open-btn').forEach(btn => {
    const installed = isTcr3Standalone();
    const ready = !!TCR3_DEFERRED_INSTALL_PROMPT;
    btn.classList.toggle('active', installed);
    btn.classList.toggle('install-ready', ready);
    btn.setAttribute('title', installed ? 'Uygulama modunda açık' : (ready ? 'Uygulamayı yükle' : 'Uygulamada aç'));
    btn.setAttribute('aria-label', installed ? 'Uygulama modunda açık' : 'Uygulamada aç');
  });
}

function openOrInstallTcr3App() {
  if (isTcr3Standalone()) {
    updatePwaOpenButtonState();
    toast('Tcr3WEB uygulama olarak açık');
    return;
  }
  toast('Tcr3WEB uygulamasını bu cihaza kurmak istiyor musunuz?', 'confirm', { confirm:true, onConfirm:startTcr3PwaInstall });
}

function waitForTcr3InstallPrompt(timeoutMs) {
  timeoutMs = timeoutMs || 3500;
  if (TCR3_DEFERRED_INSTALL_PROMPT) return Promise.resolve(TCR3_DEFERRED_INSTALL_PROMPT);
  return new Promise(resolve => {
    const waiter = { resolve };
    TCR3_PWA_PROMPT_WAITERS.push(waiter);
    setTimeout(() => {
      const i = TCR3_PWA_PROMPT_WAITERS.indexOf(waiter);
      if (i >= 0) TCR3_PWA_PROMPT_WAITERS.splice(i, 1);
      resolve(TCR3_DEFERRED_INSTALL_PROMPT);
    }, timeoutMs);
  });
}

function showTcr3LegacyInstallHelp() {
  if (isTcr3IOS()) {
    toast('Safari Paylaş menüsünü açıp “Ana Ekrana Ekle” seçeneğine dokunun', 'info');
  } else if (isTcr3SamsungBrowser()) {
    toast('Samsung Internet menüsünden “Sayfayı ekle” → “Ana ekran” seçeneğini kullanın', 'info');
  } else if (isTcr3Android()) {
    toast('Tarayıcı menüsünden “Uygulamayı yükle” veya “Ana ekrana ekle” seçeneğini kullanın', 'info');
  } else {
    toast('Tarayıcı menüsünden “Uygulamayı yükle” seçeneğini kullanın', 'info');
  }
}

async function startTcr3PwaInstall() {
  if (isTcr3Standalone()) { updatePwaOpenButtonState(); toast('Tcr3WEB uygulama olarak açık'); return; }

  if (!window.isSecureContext) {
    const httpsUrl = getTcr3HttpsUrl();
    if (location.protocol === 'http:' && httpsUrl !== location.href) {
      toast('PWA güvenli bağlantı ister. HTTPS adresi açılsın mı?', 'confirm', {
        confirm:true,
        onConfirm:function(){ window.location.href = httpsUrl; }
      });
    } else {
      showTcr3LegacyInstallHelp();
    }
    return;
  }

  await registerTcr3Pwa();
  const availablePrompt = TCR3_DEFERRED_INSTALL_PROMPT || await waitForTcr3InstallPrompt(3000);
  if (availablePrompt) {
    const promptEvent = availablePrompt;
    TCR3_DEFERRED_INSTALL_PROMPT = null;
    document.body.classList.remove('pwa-install-ready');
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      toast(choice && choice.outcome === 'accepted' ? 'Tcr3WEB uygulaması kuruluyor' : 'PWA kurulumu iptal edildi', choice && choice.outcome === 'accepted' ? 'success' : 'warning');
    } catch (e) { showTcr3LegacyInstallHelp(); }
    updatePwaOpenButtonState();
    return;
  }
  showTcr3LegacyInstallHelp();
}

window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  TCR3_DEFERRED_INSTALL_PROMPT = e;
  document.body.classList.add('pwa-install-ready');
  TCR3_PWA_PROMPT_WAITERS.splice(0).forEach(w => w.resolve(e));
  updatePwaOpenButtonState();
});
window.addEventListener('appinstalled', function() {
  TCR3_DEFERRED_INSTALL_PROMPT = null;
  document.body.classList.add('pwa-installed');
  updatePwaOpenButtonState();
  toast('Tcr3WEB uygulaması kuruldu', 'success');
});
window.addEventListener('online', function(){ registerTcr3Pwa(); });
registerTcr3Pwa();
function hardRefreshPage() {
  toast('Uygulama önbelleği ve cihazda tutulan geçici veriler temizlensin mi?', 'confirm', {
    confirm: true,
    onConfirm: runTcr3HardReset
  });
}

async function runTcr3HardReset() {
  const resetButton = document.querySelector('[data-tool="hard-refresh"]');
  if (resetButton) {
    resetButton.disabled = true;
    resetButton.classList.add('is-loading');
  }

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
    }

    if (window.indexedDB && typeof indexedDB.databases === 'function') {
      const databases = await indexedDB.databases();
      await Promise.all((databases || []).filter(db => db && db.name).map(db => new Promise(resolve => {
        const request = indexedDB.deleteDatabase(db.name);
        request.onsuccess = request.onerror = request.onblocked = () => resolve();
      })));
    }

    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}

    try {
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (!name) return;
        document.cookie = `${name}=; Max-Age=0; path=/`;
      });
    } catch (e) {}
  } catch (e) {
    console.warn('Tcr3WEB hard reset cleanup warning:', e);
  }

  const url = new URL(window.location.href);
  url.searchParams.set('_reset', Date.now().toString());
  window.location.replace(url.toString());
}

function ensurePageLoader() {
  let loader = document.getElementById('pageLoader');
  if (!loader) {
    loader = document.createElement('div');
    loader.className = 'page-loader-backdrop';
    loader.id = 'pageLoader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML = `
      <div class="page-loader-card" role="status" aria-live="polite">
        <div class="page-loader-logo-spin">
          <span class="page-loader-ring"></span>
          <img src="${APP_ASSET_PREFIX}img/tcr3web-logo-clean.svg" alt="Tcr3WEB Logo">
        </div>
        <div class="page-loader-text">
          <strong id="pageLoaderTitle">Sayfa</strong>
          <span id="pageLoaderSub">Yükleniyor...</span>
        </div>
      </div>`;
  }
  if (loader.parentElement !== document.body) document.body.appendChild(loader);
  return loader;
}

function showPageLoader(sectionName = '') {
  if (!APP_PAGE_LOADER_ENABLED) return;
  const loader = ensurePageLoader();
  const cleanName = String(sectionName || '').replace(/\s+/g, ' ').trim();
  const title = document.getElementById('pageLoaderTitle');
  const sub = document.getElementById('pageLoaderSub');
  if (title) title.textContent = cleanName || 'Sayfa';
  if (sub) sub.textContent = 'Yükleniyor...';

  loader.style.display = 'flex';
  loader.setAttribute('aria-hidden', 'false');
  loader.classList.add('open');
  document.body.classList.add('page-loader-active');
}
function hidePageLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.classList.remove('open');
    loader.setAttribute('aria-hidden', 'true');
    loader.style.display = 'none';
  }
  document.body.classList.remove('page-loader-active');
}
function getSidebarNavTitle(el) {
  return (el?.dataset?.title || el?.querySelector?.('.nav-text')?.textContent || el?.textContent || '').trim();
}
function isSidebarNavLink(el) {
  return !!(el && el.matches && el.matches('a.nav-item[href]') && (el.closest('.sidebar') || el.closest('.sidebar-nav') || el.dataset.sidebarNav === '1'));
}
const TCR3_SIDEBAR_SCROLL_KEY = 'tcr3web_sidebar_scroll_v1';
function saveSidebarScrollPosition() {
  const nav = document.querySelector('.sidebar-nav');
  if (!nav) return;
  try { sessionStorage.setItem(TCR3_SIDEBAR_SCROLL_KEY, String(Math.max(0, nav.scrollTop || 0))); } catch (e) {}
}
function restoreSidebarScrollPosition() {
  const nav = document.querySelector('.sidebar-nav');
  if (!nav) return;
  let saved = null;
  try { saved = sessionStorage.getItem(TCR3_SIDEBAR_SCROLL_KEY); } catch (e) {}
  if (saved === null || saved === '') return;
  const top = Math.max(0, Number(saved) || 0);
  nav.scrollTop = top;
  requestAnimationFrame(() => { nav.scrollTop = top; });
  setTimeout(() => { nav.scrollTop = top; }, 80);
}
function handleSidebarNav(event, el) {
  if (!isSidebarNavLink(el)) return;
  const href = el.getAttribute('href') || '';
  if (!href || href === '#' || href.startsWith('javascript:') || el.classList.contains('active')) {
    closeMobileSidebar();
    return;
  }

  if (event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) return;
    event.preventDefault();
    event.stopPropagation();
  }

  saveSidebarScrollPosition();
  const sectionName = getSidebarNavTitle(el);
  const fullscreenAttempt = getAppModePreference() && !isFullscreenActive() ? requestAppFullscreen() : Promise.resolve(false);
  closeMobileSidebar();

  requestAnimationFrame(() => {
    Promise.resolve(fullscreenAttempt).finally(() => {
      updateFullscreenButtonState();
      showPageLoader(sectionName);
      const duration = Math.max(150, Math.min(5000, Number(APP_PAGE_LOADER_DURATION || 650)));
      setTimeout(() => { window.location.href = appModeHref(href); }, duration);
    });
  });
}

// 709: Mobil/tablet sidebar navigasyonu.
// Kaydırma ile dokunma kesin olarak ayrılır. Dokunmatik cihazlarda native/ghost click
// kullanılmaz; sayfa yalnızca sabit ve kısa bir TAP tamamlandığında açılır.
const TCR_SIDEBAR_TAP_MOVE_LIMIT = 7;
const TCR_SIDEBAR_TAP_MAX_DURATION = 700;
let tcrSidebarTouch = null;
let tcrSidebarSuppressClickUntil = 0;

function cancelSidebarTouchNavigation() {
  if (tcrSidebarTouch) tcrSidebarTouch.moved = true;
  tcrSidebarSuppressClickUntil = Math.max(tcrSidebarSuppressClickUntil, Date.now() + 900);
}

document.addEventListener('touchstart', function(e){
  const link = e.target.closest && e.target.closest('a.nav-item[href]');
  if (!isSidebarNavLink(link) || !e.touches || e.touches.length !== 1) {
    tcrSidebarTouch = null;
    return;
  }

  const t = e.touches[0];
  const nav = link.closest('.sidebar-nav');
  tcrSidebarTouch = {
    link: link,
    identifier: t.identifier,
    startX: t.clientX,
    startY: t.clientY,
    startTime: Date.now(),
    startScrollTop: nav ? nav.scrollTop : 0,
    moved: false
  };

  // Dokunmatik etkileşimden sonra tarayıcının oluşturduğu click her durumda bastırılır.
  tcrSidebarSuppressClickUntil = Date.now() + 1200;
}, { capture: true, passive: true });

document.addEventListener('touchmove', function(e){
  if (!tcrSidebarTouch || !e.touches) return;
  const t = Array.from(e.touches).find(x => x.identifier === tcrSidebarTouch.identifier) || e.touches[0];
  if (!t) return cancelSidebarTouchNavigation();

  const dx = Math.abs(t.clientX - tcrSidebarTouch.startX);
  const dy = Math.abs(t.clientY - tcrSidebarTouch.startY);
  const nav = tcrSidebarTouch.link.closest('.sidebar-nav');
  const scrollDelta = nav ? Math.abs(nav.scrollTop - tcrSidebarTouch.startScrollTop) : 0;

  if (dx > TCR_SIDEBAR_TAP_MOVE_LIMIT || dy > TCR_SIDEBAR_TAP_MOVE_LIMIT || scrollDelta > 1) {
    cancelSidebarTouchNavigation();
  }
}, { capture: true, passive: true });

// Bazı mobil tarayıcılarda touchmove geç gelebilir veya hiç gelmeyebilir.
// Sidebar'ın gerçek scroll olayı da navigasyonu iptal eder.
document.addEventListener('scroll', function(e){
  if (!tcrSidebarTouch) return;
  const target = e.target;
  if (target && target.matches && target.matches('.sidebar-nav')) cancelSidebarTouchNavigation();
}, true);

document.addEventListener('touchend', function(e){
  const state = tcrSidebarTouch;
  tcrSidebarTouch = null;
  tcrSidebarSuppressClickUntil = Date.now() + 1000;
  if (!state) return;

  const changed = e.changedTouches && Array.from(e.changedTouches).find(x => x.identifier === state.identifier);
  const nav = state.link.closest('.sidebar-nav');
  const scrollDelta = nav ? Math.abs(nav.scrollTop - state.startScrollTop) : 0;
  const duration = Date.now() - state.startTime;
  const endX = changed ? changed.clientX : state.startX;
  const endY = changed ? changed.clientY : state.startY;
  const dx = Math.abs(endX - state.startX);
  const dy = Math.abs(endY - state.startY);
  const releasedOnSameLink = changed && document.elementFromPoint
    ? !!(document.elementFromPoint(endX, endY)?.closest?.('a.nav-item[href]') === state.link)
    : true;

  if (state.moved || scrollDelta > 1 || dx > TCR_SIDEBAR_TAP_MOVE_LIMIT || dy > TCR_SIDEBAR_TAP_MOVE_LIMIT || duration > TCR_SIDEBAR_TAP_MAX_DURATION || !releasedOnSameLink) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  // Yalnızca gerçek TAP burada navigasyon üretir.
  e.preventDefault();
  e.stopPropagation();
  handleSidebarNav(e, state.link);
}, { capture: true, passive: false });

document.addEventListener('touchcancel', function(e){
  tcrSidebarTouch = null;
  tcrSidebarSuppressClickUntil = Date.now() + 1000;
  if (e.cancelable) e.preventDefault();
}, { capture: true, passive: false });

document.addEventListener('click', function(e){
  const link = e.target.closest && e.target.closest('a.nav-item[href]');
  if (!isSidebarNavLink(link)) return;

  // Dokunmatik etkileşimden üretilen click hiçbir zaman navigasyon yapmaz.
  if (Date.now() < tcrSidebarSuppressClickUntil) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return;
  }

  // Mouse/trackpad tıklamaları normal çalışır.
  handleSidebarNav(e, link);
}, true);

function toggleSidebar() {
  const app = document.getElementById('app');
  if (!app) return;
  if (window.matchMedia('(max-width: 1180px)').matches) {
    app.classList.toggle('mobile-open');
    document.body.classList.toggle('sidebar-open-lock', app.classList.contains('mobile-open'));
  } else {
    app.classList.toggle('collapsed');
  }
}
function closeMobileSidebar() {
  const app = document.getElementById('app');
  if (app) app.classList.remove('mobile-open');
  document.body.classList.remove('sidebar-open-lock');
}

/* ============================================================
   Modal
   ============================================================ */
let tcrModalScrollX = 0;
let tcrModalScrollY = 0;
let tcrModalScrollLocked = false;
let tcrModalPreviousScrollBehavior = '';

function tcrLockPageScroll() {
  if (tcrModalScrollLocked) return;

  tcrModalScrollX = window.scrollX || document.documentElement.scrollLeft || 0;
  tcrModalScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  tcrModalPreviousScrollBehavior = document.documentElement.style.scrollBehavior || '';

  const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
  document.documentElement.style.scrollBehavior = 'auto';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${tcrModalScrollY}px`;
  document.body.style.left = `-${tcrModalScrollX}px`;
  document.body.style.right = '0';
  document.body.style.width = '100%';
  if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.body.classList.add('modal-open');
  tcrModalScrollLocked = true;
}

function tcrUnlockPageScroll() {
  if (document.querySelector('.modal-backdrop.open')) return;
  if (!tcrModalScrollLocked) return;

  const restoreX = tcrModalScrollX;
  const restoreY = tcrModalScrollY;

  document.body.classList.remove('modal-open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.paddingRight = '';

  // Modal kapanırken odaklanan elemanın sayfayı kaydırmasını engelle.
  window.scrollTo(restoreX, restoreY);
  requestAnimationFrame(() => window.scrollTo(restoreX, restoreY));
  setTimeout(() => window.scrollTo(restoreX, restoreY), 60);

  document.documentElement.style.scrollBehavior = tcrModalPreviousScrollBehavior;
  tcrModalScrollLocked = false;
}

function openModal(id) {
  closeMobileSidebar();
  const m = document.getElementById(id);
  if (!m) return;

  tcrLockPageScroll();
  m.classList.add('open');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
  requestAnimationFrame(tcrUnlockPageScroll);
}
function modalHtml(id, title, body, foot, size = '') {
  return `<div class="modal-backdrop" id="${id}">
    <div class="modal ${size}">
      <div class="modal-head">
        <div class="modal-title">${title}</div>
        <button class="icon-btn" onclick="closeModal('${id}')">${ICONS.close}</button>
      </div>
      <div class="modal-body">${body}</div>
      ${foot ? `<div class="modal-foot">${foot}</div>` : ''}
    </div>
  </div>`;
}

/* ============================================================
   Toast
   ============================================================ */
function toastSvgIcon(name) {
  const common = 'width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  const icons = {
    success: `<svg ${common}><circle cx="12" cy="12" r="10"/><path d="m8 12 2.7 2.7L16.5 9"/></svg>`,
    danger: `<svg ${common}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
    warning: `<svg ${common}><path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
    info: `<svg ${common}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    confirm: `<svg ${common}><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"/><path d="M12 18h.01"/></svg>`,
    close: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg>`
  };
  return icons[name] || icons.info;
}
function operationMeta(type = '', msg = '') {
  const text = (msg || '').toLocaleLowerCase('tr-TR');
  let t = type || '';
  if (!t) {
    if (/sil|iptal|red|redded|hata|bulunamadı|boş olamaz/.test(text)) t = 'danger';
    else if (/uyarı|bekle|seçin|hazır değil|prototip|sıfırla/.test(text)) t = 'warning';
    else if (/indir|yazdır|rapor|dışa aktar|pdf|mail|sms|whatsapp|paylaş/.test(text)) t = 'info';
    else t = 'success';
  }
  if (t === 'error') t = 'danger';
  if (t === 'warn') t = 'warning';
  const map = {
    success: { title: 'İşlem Tamamlandı', icon: toastSvgIcon('success'), btn: 'btn-success', cls: 'success', hint: 'İşlem başarıyla tamamlandı.' },
    danger:  { title: 'İşlem Başarısız', icon: toastSvgIcon('danger'), btn: 'btn-danger', cls: 'danger', hint: 'İşlem sonucunu kontrol edin.' },
    warning: { title: 'Dikkat', icon: toastSvgIcon('warning'), btn: 'btn-warning', cls: 'warning', hint: 'Devam etmeden önce bilgileri kontrol edin.' },
    info:    { title: 'Bilgilendirme', icon: toastSvgIcon('info'), btn: 'btn-info', cls: 'info', hint: 'İlgili işlem hazırlandı.' },
    confirm: { title: 'Onay Bekleniyor', icon: toastSvgIcon('confirm'), btn: 'btn-primary', cls: 'confirm', hint: 'İşleme devam etmek için seçim yapın.' }
  };
  return map[t] || map.success;
}
let operationModalTimer = null;
function ensureOperationModal() {
  let m = document.getElementById('operationModal');
  if (m) return m;
  const div = document.createElement('div');
  div.innerHTML = modalHtml('operationModal', 'İşlem Tamamlandı', `
    <div class="operation-result">
      <div class="operation-result-icon success" id="operationResultIcon"></div>
      <h3 id="operationResultTitle">İşlem Tamamlandı</h3>
      <p id="operationResultMessage">İşlem başarıyla tamamlandı.</p>
      <small id="operationResultHint">Tcr3WEB HTML MASTER</small>
    </div>
  `, `<button class="btn btn-success" id="operationResultButton" onclick="closeModal('operationModal')">Tamam</button>`);
  document.body.appendChild(div.firstElementChild);
  const modal = document.getElementById('operationModal');
  const box = modal ? modal.querySelector('.modal') : null;
  if (box) box.classList.add('operation-dialog');
  return modal;
}
function isSilentNotification(msg = '', type = '', opts = {}) {
  if (opts && opts.silent === true) return true;
  const text = String(msg || '').toLocaleLowerCase('tr-TR');
  const normalizedType = type === 'error' ? 'danger' : type === 'warn' ? 'warning' : type;
  if (normalizedType === 'warning' || normalizedType === 'danger' || normalizedType === 'confirm' || opts.confirm === true) return false;
  return /(ürün|stok|cari|depo|banka|kasa|personel|barkod|evrak|fiyat|satır|kalem).*(seçildi|eklendi|hazırlandı)|seçim tamamlandı|kalemlere eklendi|satır eklendi|fiyat seçildi|evrak seçildi/.test(text);
}
function silentHighlight(el) {
  if (!el) return;
  el.classList.remove('silent-highlight');
  void el.offsetWidth;
  el.classList.add('silent-highlight');
  setTimeout(() => el.classList.remove('silent-highlight'), 1100);
}
function ensureToastContainer() {
  let wrap = document.getElementById('tcrToastContainer');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'tcrToastContainer';
    wrap.className = `tcr-toast-container tcr-toast-${APP_TOAST_POSITION}`;
    wrap.setAttribute('aria-live', 'polite');
    wrap.setAttribute('aria-atomic', 'true');
    document.body.appendChild(wrap);
  }
  return wrap;
}
function toast(msg, type = '', options = {}) {
  const opts = (typeof options === 'object' && options) ? options : {};
  if (!APP_TOAST_ENABLED && opts.force !== true && type !== 'confirm' && opts.confirm !== true) return;
  if (isSilentNotification(msg, type, opts)) return;
  const meta = operationMeta(type, msg);
  const requiresConfirm = opts.confirm === true || type === 'confirm';

  if (requiresConfirm) {
    ensureOperationModal();
    const modal = document.getElementById('operationModal');
    const title = document.getElementById('operationResultTitle');
    const message = document.getElementById('operationResultMessage');
    const hint = document.getElementById('operationResultHint');
    const icon = document.getElementById('operationResultIcon');
    const foot = modal.querySelector('.modal-foot');
    const headTitle = modal.querySelector('.modal-title');
    if (operationModalTimer) { clearTimeout(operationModalTimer); operationModalTimer = null; }
    if (headTitle) headTitle.textContent = meta.title;
    if (title) title.textContent = meta.title;
    if (message) message.textContent = msg || meta.hint;
    if (hint) hint.textContent = 'İşleme devam etmek için seçim yapın.';
    if (icon) { icon.className = `operation-result-icon ${meta.cls}`; icon.innerHTML = meta.icon; }
    if (foot) {
      foot.innerHTML = `<button class="btn btn-danger" onclick="closeModal('operationModal')">Hayır</button><button class="btn btn-success" id="operationResultButton">Evet</button>`;
      const yesBtn = foot.querySelector('#operationResultButton');
      yesBtn.onclick = function(){ closeModal('operationModal'); if (typeof opts.onConfirm === 'function') opts.onConfirm(); };
    }
    openModal('operationModal');
    return;
  }

  const normalizedType = type === 'error' ? 'danger' : type === 'warn' ? 'warning' : (type || 'info');
  const wrap = ensureToastContainer();
  while (wrap.children.length >= APP_TOAST_MAX) wrap.firstElementChild.remove();
  const item = document.createElement('div');
  item.className = `tcr-toast tcr-toast-${normalizedType}${APP_TOAST_COLORED_BG ? ' has-colored-bg' : ''}`;
  item.setAttribute('role', 'status');
  const typeDefaultDuration = normalizedType === 'danger' ? 5000 : normalizedType === 'warning' ? 3000 : normalizedType === 'info' ? 2500 : 2000;
  const duration = Math.max(500, Math.min(15000, Number(opts.duration || APP_TOAST_DURATION || typeDefaultDuration)));
  item.style.setProperty('--toast-duration', `${duration}ms`);
  item.innerHTML = `
    <div class="tcr-toast-icon" aria-hidden="true">${APP_TOAST_ICONS_ENABLED ? meta.icon : ''}</div>
    <div class="tcr-toast-copy">
      <strong class="tcr-toast-title">${meta.title || 'Bilgilendirme'}</strong>
      <span class="tcr-toast-message"></span>
    </div>
    <button type="button" class="tcr-toast-close" aria-label="Kapat">${toastSvgIcon('close')}</button>
    ${APP_TOAST_PROGRESS_ENABLED && opts.progress !== false ? '<div class="tcr-toast-progress" aria-hidden="true"><span></span></div>' : ''}`;
  item.querySelector('.tcr-toast-message').textContent = msg || meta.hint || '';
  const close = () => {
    if (item.classList.contains('is-leaving')) return;
    item.classList.add('is-leaving');
    setTimeout(() => item.remove(), 220);
  };
  item.querySelector('.tcr-toast-close').addEventListener('click', close);
  wrap.appendChild(item);
  setTimeout(close, duration);
}

function showActionModal(type, title, message, onConfirm) {
  const confirm = type === 'confirm';
  toast(message || title || 'İşlem hazırlandı.', type || 'info', {
    confirm: confirm,
    onConfirm: typeof onConfirm === 'function' ? onConfirm : null
  });
  const modal = document.getElementById('operationModal');
  const titleEl = document.getElementById('operationResultTitle');
  const headTitle = modal ? modal.querySelector('.modal-title') : null;
  if (titleEl && title) titleEl.textContent = title;
  if (headTitle && title) headTitle.textContent = title;
}

function normalizeActionButtons(scope = document) {
  const buttons = scope.querySelectorAll('button.btn, a.btn');
  buttons.forEach(btn => {
    const text = (btn.textContent || '').trim().toLocaleLowerCase('tr-TR');
    if (btn.dataset.colorFixed === '1') return;
    const startsWithNew = /^yeni(?:\s|$)/.test(text);
    btn.classList.toggle('tcr-new-action', startsWithNew);
    if (startsWithNew) {
      btn.classList.remove('btn-primary','btn-ghost','btn-danger','btn-info','btn-warning');
      btn.classList.add('btn-success');
    } else if (/kaydet|oluştur|onayla|kabul|gönder|öde|tahsil|teslim|ciro/.test(text)) {
      btn.classList.remove('btn-primary','btn-ghost','btn-danger','btn-info','btn-warning');
      btn.classList.add('btn-success');
    } else if (/sil|vazgeç|iptal|reddet|red|kapat/.test(text)) {
      btn.classList.remove('btn-primary','btn-ghost','btn-success','btn-info','btn-warning');
      btn.classList.add('btn-danger');
    } else if (/yazdır|indir|dışa aktar|pdf|mail|e-posta|sms|whatsapp|paylaş|rapor/.test(text)) {
      btn.classList.remove('btn-primary','btn-ghost','btn-success','btn-danger','btn-warning');
      btn.classList.add('btn-info');
    } else if (/filtre|hesapla|test|yenile|sıfırla|taslak/.test(text)) {
      btn.classList.remove('btn-primary','btn-ghost','btn-success','btn-danger','btn-info');
      btn.classList.add('btn-warning');
    }
  });
}

/* ============================================================
   Charts (SVG)
   ============================================================ */
function lineChart(data, opts = {}) {
  const w = 600, h = 240, pad = 30;
  const max = Math.max(...data.map(d => d.value)) * 1.15 || 1;
  const min = 0;
  const stepX = (w - pad * 2) / (data.length - 1);
  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((d.value - min) / (max - min)) * (h - pad * 2);
    return { x, y, ...d };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${path} L ${points[points.length-1].x} ${h-pad} L ${points[0].x} ${h-pad} Z`;
  const labels = points.map(p => `<text x="${p.x}" y="${h - 8}" text-anchor="middle" font-size="10" fill="#8a93a6">${p.label}</text>`).join('');
  const dots = points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="white" stroke="#2c4670" stroke-width="2"/>`).join('');
  const grid = [0.25, 0.5, 0.75, 1].map(f => {
    const y = h - pad - f * (h - pad * 2);
    return `<line x1="${pad}" y1="${y}" x2="${w-pad}" y2="${y}" stroke="#eef0f4" stroke-dasharray="3 3"/>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" class="line-chart" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="lg-${opts.id||'a'}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${opts.color||'#2c4670'}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${opts.color||'#2c4670'}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${grid}
    <path d="${area}" fill="url(#lg-${opts.id||'a'})"/>
    <path d="${path}" fill="none" stroke="${opts.color||'#2c4670'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
    ${labels}
  </svg>`;
}

function donutChart(segments, size = 180) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 70, cx = 90, cy = 90, stroke = 28;
  let offset = 0;
  const circ = 2 * Math.PI * r;
  const arcs = segments.map((s, i) => {
    const frac = s.value / total;
    const dash = frac * circ;
    const arc = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${stroke}" stroke-dasharray="${dash} ${circ - dash}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt"/>`;
    offset += dash;
    return arc;
  }).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 180 180">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#eef0f4" stroke-width="${stroke}"/>
    ${arcs}
    <text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="11" fill="#8a93a6">Toplam</text>
    <text x="${cx}" y="${cy+14}" text-anchor="middle" font-size="18" font-weight="700" fill="#142544">${opts_label(total)}</text>
  </svg>`;
}
function opts_label(v) { return fmtMoney(v).replace(/\s+/g,' '); }

function barChart(data, accent = false) {
  const max = Math.max(...data.map(d => d.value)) * 1.1 || 1;
  return `<div class="chart">${data.map(d => {
    const h = (d.value / max) * 100;
    return `<div class="chart-bar">
      <div class="chart-bar-fill ${accent ? 'accent' : ''}" style="height:${h}%" title="${d.label}: ${fmtMoney(d.value, false)}"></div>
      <div class="chart-bar-label">${d.label}</div>
    </div>`;
  }).join('')}</div>`;
}

function heroSlider(slides) {
  const id = 'hs' + Date.now();
  const slidesHtml = slides.map(sl => `
    <div class="slider-slide${sl.theme?' '+sl.theme:''}">
      <div class="slider-icon-wrap">${ICONS[sl.icon]||''}</div>
      <div class="slider-body">
        <div class="slider-label">${sl.label}</div>
        <div class="slider-title">${sl.title}</div>
        <div class="slider-desc">${sl.desc}</div>
      </div>
      ${sl.metric?`<div class="slider-metric"><div class="slider-metric-value">${sl.metric}</div><div class="slider-metric-label">${sl.metricLabel||''}</div></div>`:''}
    </div>`).join('');
  const dotsHtml = slides.map((_,i)=>`<button class="slider-dot${i===0?' active':''}"></button>`).join('');
  setTimeout(() => {
    const el = document.getElementById(id);
    if (!el) return;
    let cur = 0;
    const track = el.querySelector('.slider-track');
    const dots = [...el.querySelectorAll('.slider-dot')];
    function to(n) {
      cur = ((n%slides.length)+slides.length)%slides.length;
      track.style.transform = `translateX(-${cur*100}%)`;
      dots.forEach((d,i) => d.classList.toggle('active', i===cur));
    }
    let timer = setInterval(()=>to(cur+1), 4500);
    el.querySelector('.slider-prev').onclick = () => { clearInterval(timer); to(cur-1); timer=setInterval(()=>to(cur+1),4500); };
    el.querySelector('.slider-next').onclick = () => { clearInterval(timer); to(cur+1); timer=setInterval(()=>to(cur+1),4500); };
    dots.forEach((d,i) => { d.onclick = () => { clearInterval(timer); to(i); timer=setInterval(()=>to(cur+1),4500); }; });
    el.addEventListener('mouseenter', () => clearInterval(timer));
    el.addEventListener('mouseleave', () => { timer=setInterval(()=>to(cur+1),4500); });
  }, 0);
  return `<div class="hero-slider" id="${id}">
    <div class="slider-track">${slidesHtml}</div>
    <button class="slider-prev">&lsaquo;</button>
    <button class="slider-next">&rsaquo;</button>
    <div class="slider-nav">${dotsHtml}</div>
  </div>`;
}

/* ============================================================
   Mock Data
   ============================================================ */
const MOCK = {
  cari: [
    { id: 1000, kod: 'CR1000', ad: 'Marmara Tekstil A.Ş.', tip: 'Müşteri', yetkili: 'Mehmet Demir', telefon: '0212 555 11 22', email: 'info@marmaratekstil.com', sehir: 'İstanbul', bakiye: 145000, risk: 0, vade: 30, sonSatisGun: 11, sonTahsilatGun: 60, sonAlimGun: null, sonOdemeGun: null, durum: 'Aktif' },
    { id: 999, kod: 'CR0999', ad: 'Ege Lojistik Ltd. Şti.', tip: 'Müşteri', yetkili: 'Ayşe Kaya', telefon: '0232 444 33 22', email: 'ayse@egelojistik.com', sehir: 'İzmir', bakiye: -28500, risk: 1, vade: 45, sonSatisGun: 4, sonTahsilatGun: 18, sonAlimGun: null, sonOdemeGun: null, durum: 'Aktif' },
    { id: 998, kod: 'CR0998', ad: 'Anadolu Hırdavat San.', tip: 'Müşteri', yetkili: 'Hasan Yıldız', telefon: '0312 333 22 11', email: 'hasan@anadoluhirdavat.com', sehir: 'Ankara', bakiye: 67800, risk: 0, vade: 30, sonSatisGun: 2, sonTahsilatGun: 27, sonAlimGun: null, sonOdemeGun: null, durum: 'Aktif' },
    { id: 997, kod: 'CR0997', ad: 'Yıldız Plastik A.Ş.', tip: 'Tedarikçi', yetkili: 'Fatma Şahin', telefon: '0216 222 11 33', email: 'fatma@yildizplastik.com', sehir: 'İstanbul', bakiye: -89000, risk: 0, vade: 60, sonSatisGun: null, sonTahsilatGun: null, sonAlimGun: 7, sonOdemeGun: 22, durum: 'Aktif' },
    { id: 996, kod: 'CR0996', ad: 'Akdeniz Gıda Ltd.', tip: 'Müşteri', yetkili: 'Ali Çelik', telefon: '0242 111 22 33', email: 'ali@akdenizgida.com', sehir: 'Antalya', bakiye: 12300, risk: 0, vade: 30, sonSatisGun: 39, sonTahsilatGun: 75, sonAlimGun: null, sonOdemeGun: null, durum: 'Pasif' },
    { id: 995, kod: 'CR0995', ad: 'Karadeniz Mobilya A.Ş.', tip: 'Müşteri', yetkili: 'Zeynep Arslan', telefon: '0361 444 55 66', email: 'zeynep@kardmobilya.com', sehir: 'Trabzon', bakiye: 95000, risk: 2, vade: 15, sonSatisGun: 1, sonTahsilatGun: 14, sonAlimGun: null, sonOdemeGun: null, durum: 'Aktif' },
    { id: 994, kod: 'CR0994', ad: 'Marmara Kimya San.', tip: 'Tedarikçi', yetkili: 'Osman Türk', telefon: '0212 666 77 88', email: 'osman@marmarakimya.com', sehir: 'İstanbul', bakiye: -45000, risk: 0, vade: 45, sonSatisGun: null, sonTahsilatGun: null, sonAlimGun: 3, sonOdemeGun: 16, durum: 'Aktif' },
    { id: 993, kod: 'CR0993', ad: 'Erciyes Yapı Market', tip: 'Müşteri', yetkili: 'Emine Demir', telefon: '0352 999 88 77', email: 'emine@erciyesyapi.com', sehir: 'Kayseri', bakiye: 32000, risk: 0, vade: 30, sonSatisGun: 9, sonTahsilatGun: 31, sonAlimGun: null, sonOdemeGun: null, durum: 'Aktif' },
  ],
  stok: [
    { id: 1000, kod: 'ST1000', ad: 'Plastik Ham Madde PP', kategori: 'Hammadde', birim: 'kg', miktar: 4500, min: 1000, alisFiyat: 10.80, fiyat: 12.50, sonSatisFiyat: 12.20, kdv: 20, depo: 'Ana Depo' },
    { id: 999, kod: 'ST0999', ad: 'Karton Koli 40x30x30', kategori: 'Ambalaj', birim: 'adet', miktar: 850, min: 500, alisFiyat: 7.30, fiyat: 8.75, sonSatisFiyat: 8.40, kdv: 20, depo: 'Ana Depo' },
    { id: 998, kod: 'ST0998', ad: 'Endüstriyel Yağ 20L', kategori: 'Kimyasal', birim: 'lt', miktar: 120, min: 50, alisFiyat: 210.00, fiyat: 245.00, sonSatisFiyat: 238.00, kdv: 20, depo: 'Kimya Depo' },
    { id: 997, kod: 'ST0997', ad: 'Çelik Profil 6m', kategori: 'Metal', birim: 'mt', miktar: 320, min: 100, alisFiyat: 162.00, fiyat: 185.00, sonSatisFiyat: 179.50, kdv: 20, depo: 'Metal Depo' },
    { id: 996, kod: 'ST0996', ad: 'Vida 6mm Paket', kategori: 'Sarf', birim: 'paket', miktar: 45, min: 100, alisFiyat: 19.75, fiyat: 24.90, sonSatisFiyat: 23.60, kdv: 20, depo: 'Ana Depo' },
    { id: 995, kod: 'ST0995', ad: 'Elektrik Kablosu 2.5mm', kategori: 'Elektrik', birim: 'mt', miktar: 1200, min: 200, alisFiyat: 11.90, fiyat: 14.20, sonSatisFiyat: 13.80, kdv: 20, depo: 'Ana Depo' },
    { id: 994, kod: 'ST0994', ad: 'Boya Akrilik 5L Beyaz', kategori: 'Kimyasal', birim: 'kutu', miktar: 65, min: 30, alisFiyat: 278.00, fiyat: 320.00, sonSatisFiyat: 310.00, kdv: 20, depo: 'Kimya Depo' },
    { id: 993, kod: 'ST0993', ad: 'İş Eldiveni Mavi', kategori: 'Sarf', birim: 'çift', miktar: 240, min: 100, alisFiyat: 15.20, fiyat: 18.50, sonSatisFiyat: 18.00, kdv: 20, depo: 'Ana Depo' },
  ],
  satis: [
    { id: 1000, no: 'S20261000', cari: 'Marmara Tekstil A.Ş.', tarih: '2026-07-01', tutar: 145000, durum: 'Faturalandı', odeme: 'Ödendi' },
    { id: 999, no: 'S20260999', cari: 'Anadolu Hırdavat San.', tarih: '2026-07-02', tutar: 67800, durum: 'İrsaliye', odeme: 'Açık' },
    { id: 998, no: 'S20260998', cari: 'Akdeniz Gıda Ltd.', tarih: '2026-07-02', tutar: 12300, durum: 'Sipariş', odeme: 'Açık' },
    { id: 997, no: 'S20260997', cari: 'Karadeniz Mobilya A.Ş.', tarih: '2026-07-03', tutar: 95000, durum: 'Faturalandı', odeme: 'Vadeli' },
    { id: 996, no: 'S20260996', cari: 'Erciyes Yapı Market', tarih: '2026-07-03', tutar: 32000, durum: 'Faturalandı', odeme: 'Ödendi' },
    { id: 995, no: 'S20260995', cari: 'Marmara Tekstil A.Ş.', tarih: '2026-07-04', tutar: 28500, durum: 'Sipariş', odeme: 'Açık' },
  ],
  alim: [
    { id: 1000, no: 'A20261000', cari: 'Yıldız Plastik A.Ş.', tarih: '2026-07-01', tutar: 89000, durum: 'Faturalandı', odeme: 'Vadeli' },
    { id: 999, no: 'A20260999', cari: 'Marmara Kimya San.', tarih: '2026-07-02', tutar: 45000, durum: 'İrsaliye', odeme: 'Açık' },
    { id: 998, no: 'A20260998', cari: 'Yıldız Plastik A.Ş.', tarih: '2026-07-03', tutar: 22000, durum: 'Sipariş', odeme: 'Açık' },
    { id: 997, no: 'A20260997', cari: 'Marmara Kimya San.', tarih: '2026-07-03', tutar: 18700, durum: 'Faturalandı', odeme: 'Ödendi' },
  ],
  kasa: [
    { id: 1, ad: 'Merkez Kasa', kod: 'KASA01', bakiye: 245800, tur: 'TL' },
    { id: 2, ad: 'Şube Kasa - İzmir', kod: 'KASA02', bakiye: 45200, tur: 'TL' },
    { id: 3, ad: 'Şube Kasa - Ankara', kod: 'KASA03', bakiye: 18900, tur: 'TL' },
  ],
  kasaHareket: [
    { id: 1, tarih: '2026-07-04', aciklama: 'Marmara Tekstil - Tahsilat', tip: 'Tahsilat', tutar: 145000, kasa: 'Merkez Kasa' },
    { id: 2, tarih: '2026-07-04', aciklama: 'Ofis kira ödemesi', tip: 'Ödeme', tutar: -25000, kasa: 'Merkez Kasa' },
    { id: 3, tarih: '2026-07-03', aciklama: 'Erciyes Yapı Market - Tahsilat', tip: 'Tahsilat', tutar: 32000, kasa: 'Merkez Kasa' },
    { id: 4, tarih: '2026-07-03', aciklama: 'Personel maaş ödemesi', tip: 'Ödeme', tutar: -89000, kasa: 'Merkez Kasa' },
    { id: 5, tarih: '2026-07-02', aciklama: 'Banka virmanı (Ziraat)', tip: 'Virman', tutar: 50000, kasa: 'Merkez Kasa' },
    { id: 6, tarih: '2026-07-02', aciklama: 'Anadolu Hırdavat - Tahsilat', tip: 'Tahsilat', tutar: 67800, kasa: 'Merkez Kasa' },
    { id: 7, tarih: '2026-07-01', aciklama: 'Şube devir - İzmir', tip: 'Devir', tutar: 45200, kasa: 'Şube Kasa - İzmir' },
  ],
  banka: [
    { id: 1, banka: 'Ziraat Bankası', iban: 'TR12 0001 0001 0001 0001 0001 01', hesap: 'MAAŞ', bakiye: 485200, tur: 'TL' },
    { id: 2, banka: 'İş Bankası', iban: 'TR34 0006 4000 0006 4000 0006 40', hesap: 'CARİ', bakiye: 892500, tur: 'TL' },
    { id: 3, banka: 'Garanti BBVA', iban: 'TR56 0006 2000 0006 2000 0006 20', hesap: 'VERGİ', bakiye: 124000, tur: 'TL' },
  ],
  bankaHareket: [
    { id: 1, tarih: '2026-07-04', aciklama: 'Müşteri EFT - Marmara Tekstil', tip: 'Giriş', tutar: 145000, banka: 'İş Bankası - CARİ' },
    { id: 2, tarih: '2026-07-04', aciklama: 'Vergi dairesi ödemesi', tip: 'Çıkış', tutar: -42000, banka: 'Garanti BBVA - VERGİ' },
    { id: 3, tarih: '2026-07-03', aciklama: 'Personel maaşları', tip: 'Çıkış', tutar: -89000, banka: 'Ziraat - MAAŞ' },
    { id: 4, tarih: '2026-07-03', aciklama: 'Tedarikçi ödemesi - Yıldız Plastik', tip: 'Çıkış', tutar: -45000, banka: 'İş Bankası - CARİ' },
    { id: 5, tarih: '2026-07-02', aciklama: 'Kasa virmanı', tip: 'Giriş', tutar: 50000, banka: 'Ziraat - MAAŞ' },
  ],
  cek: [
    { id: 1000, no: 'CK1000', tip: 'Alınan', keşideci: 'Marmara Tekstil A.Ş.', banka: 'İş Bankası', tutar: 75000, vade: '2026-07-15', durum: 'Portföyde', lehtar: 'Bizim Şirket' },
    { id: 999, no: 'CK0999', tip: 'Alınan', keşideci: 'Anadolu Hırdavat', banka: 'Ziraat', tutar: 32000, vade: '2026-07-20', durum: 'Tahsile Verildi', lehtar: 'Bizim Şirket' },
    { id: 998, no: 'CK0998', tip: 'Verilen', keşideci: 'Bizim Şirket', banka: 'İş Bankası', tutar: 45000, vade: '2026-07-10', durum: 'Portföyde', lehtar: 'Yıldız Plastik' },
    { id: 997, no: 'CK0997', tip: 'Alınan', keşideci: 'Karadeniz Mobilya', banka: 'Garanti', tutar: 95000, vade: '2026-08-01', durum: 'Portföyde', lehtar: 'Bizim Şirket' },
    { id: 996, no: 'CK0996', tip: 'Verilen', keşideci: 'Bizim Şirket', banka: 'Ziraat', tutar: 28000, vade: '2026-07-12', durum: 'Ciro Edildi', lehtar: 'Marmara Kimya' },
    { id: 995, no: 'CK0995', tip: 'Alınan', keşideci: 'Erciyes Yapı Market', banka: 'İş Bankası', tutar: 18000, vade: '2026-06-25', durum: 'Tahsil Edildi', lehtar: 'Bizim Şirket' },
    { id: 994, no: 'CK0994', tip: 'Alınan', keşideci: 'Akdeniz Gıda', banka: 'Ziraat', tutar: 12300, vade: '2026-06-20', durum: 'Protesto', lehtar: 'Bizim Şirket' },
  ],
  senet: [
    { id: 1000, no: 'SN1000', tip: 'Alınan', borclu: 'Marmara Tekstil A.Ş.', tutar: 60000, vade: '2026-07-25', durum: 'Portföyde' },
    { id: 999, no: 'SN0999', tip: 'Alınan', borclu: 'Anadolu Hırdavat', tutar: 27800, vade: '2026-08-05', durum: 'Portföyde' },
    { id: 998, no: 'SN0998', tip: 'Verilen', borclu: 'Bizim Şirket', tutar: 35000, vade: '2026-07-18', durum: 'Portföyde' },
    { id: 997, no: 'SN0997', tip: 'Alınan', borclu: 'Karadeniz Mobilya', tutar: 45000, vade: '2026-08-15', durum: 'Tahsile Verildi' },
    { id: 996, no: 'SN0996', tip: 'Verilen', borclu: 'Bizim Şirket', tutar: 22000, vade: '2026-07-08', durum: 'Ciro Edildi' },
    { id: 995, no: 'SN0995', tip: 'Alınan', borclu: 'Erciyes Yapı Market', tutar: 15000, vade: '2026-06-28', durum: 'Tahsil Edildi' },
  ],
  personel: [
    { id: 1, ad: 'Ahmet Yılmaz', tc: '12345678901', departman: 'Yönetim', unvan: 'Genel Müdür', giris: '2018-03-01', maas: 85000, izin: 21, durum: 'Aktif', telefon: '0532 111 22 33', email: 'ahmet@sirket.com' },
    { id: 2, ad: 'Ayşe Kaya', tc: '23456789012', departman: 'Muhasebe', unvan: 'Mali İşler Müdürü', giris: '2019-06-15', maas: 55000, izin: 14, durum: 'Aktif', telefon: '0532 222 33 44', email: 'ayse@sirket.com' },
    { id: 3, ad: 'Mehmet Demir', tc: '34567890123', departman: 'Satış', unvan: 'Satış Temsilcisi', giris: '2020-09-01', maas: 35000, izin: 7, durum: 'Aktif', telefon: '0532 333 44 55', email: 'mehmet@sirket.com' },
    { id: 4, ad: 'Fatma Şahin', tc: '45678901234', departman: 'İK', unvan: 'İK Uzmanı', giris: '2021-01-10', maas: 42000, izin: 11, durum: 'Aktif', telefon: '0532 444 55 66', email: 'fatma@sirket.com' },
    { id: 5, ad: 'Ali Çelik', tc: '56789012345', departman: 'Depo', unvan: 'Depo Sorumlusu', giris: '2019-11-20', maas: 32000, izin: 4, durum: 'Aktif', telefon: '0532 555 66 77', email: 'ali@sirket.com' },
    { id: 6, ad: 'Zeynep Arslan', tc: '67890123456', departman: 'Satış', unvan: 'Satış Temsilcisi', giris: '2022-04-05', maas: 33000, izin: 9, durum: 'Aktif', telefon: '0532 666 77 88', email: 'zeynep@sirket.com' },
    { id: 7, ad: 'Osman Türk', tc: '78901234567', departman: 'Üretim', unvan: 'Operatör', giris: '2020-02-15', maas: 28000, izin: 2, durum: 'İzinli', telefon: '0532 777 88 99', email: 'osman@sirket.com' },
    { id: 8, ad: 'Emine Demir', tc: '89012345678', departman: 'Muhasebe', unvan: 'Muhasebe Uzmanı', giris: '2021-07-01', maas: 38000, izin: 6, durum: 'Aktif', telefon: '0532 888 99 00', email: 'emine@sirket.com' },
  ],
  basvuru: [
    { id: 1, ad: 'Kerim Aslan', pozisyon: 'Satış Temsilcisi', tarih: '2026-07-01', deneyim: 5, durum: 'Görüşmede', telefon: '0533 111 22 33', email: 'kerim@email.com', not: 'Mülakat 8 Temmuz planlandı' },
    { id: 2, ad: 'Selin Aydın', pozisyon: 'Muhasebe Uzmanı', tarih: '2026-07-02', deneyim: 7, durum: 'Yeni', telefon: '0533 222 33 44', email: 'selin@email.com', not: 'Özgeçmiş inceleniyor' },
    { id: 3, ad: 'Burak Yıldırım', pozisyon: 'Depo Sorumlusu', tarih: '2026-07-02', deneyim: 3, durum: 'Kabul', telefon: '0533 333 44 55', email: 'burak@email.com', not: 'İş teklifi yapıldı, kabul etti' },
    { id: 4, ad: 'Deniz Kaya', pozisyon: 'İK Uzmanı', tarih: '2026-06-28', deneyim: 4, durum: 'Red', telefon: '0533 444 55 66', email: 'deniz@email.com', not: 'Deneyim yetersiz' },
    { id: 5, ad: 'Merve Şen', pozisyon: 'Satış Temsilcisi', tarih: '2026-07-03', deneyim: 2, durum: 'Yeni', telefon: '0533 555 66 77', email: 'merve@email.com', not: '' },
  ],
  maas: [
    { id: 1, personel: 'Ahmet Yılmaz', brut: 85000, net: 61250, sgk: 12750, vergi: 9350, damga: 650, mesai: 0, prim: 5000, avans: 0, ay: 'Temmuz 2026', durum: 'Ödendi' },
    { id: 2, personel: 'Ayşe Kaya', brut: 55000, net: 39600, sgk: 8250, vergi: 6050, damga: 425, mesai: 0, prim: 2000, avans: 5000, ay: 'Temmuz 2026', durum: 'Ödendi' },
    { id: 3, personel: 'Mehmet Demir', brut: 35000, net: 25200, sgk: 5250, vergi: 3850, damga: 275, mesai: 2500, prim: 8000, avans: 0, ay: 'Temmuz 2026', durum: 'Ödendi' },
    { id: 4, personel: 'Fatma Şahin', brut: 42000, net: 30240, sgk: 6300, vergi: 4620, damga: 330, mesai: 0, prim: 1500, avans: 0, ay: 'Temmuz 2026', durum: 'Bekliyor' },
    { id: 5, personel: 'Ali Çelik', brut: 32000, net: 23040, sgk: 4800, vergi: 3520, damga: 250, mesai: 1800, prim: 0, avans: 3000, ay: 'Temmuz 2026', durum: 'Bekliyor' },
    { id: 6, personel: 'Zeynep Arslan', brut: 33000, net: 23760, sgk: 4950, vergi: 3630, damga: 260, mesai: 0, prim: 4500, avans: 0, ay: 'Temmuz 2026', durum: 'Bekliyor' },
    { id: 7, personel: 'Osman Türk', brut: 28000, net: 20160, sgk: 4200, vergi: 3080, damga: 220, mesai: 3200, prim: 0, avans: 0, ay: 'Temmuz 2026', durum: 'İzinli' },
    { id: 8, personel: 'Emine Demir', brut: 38000, net: 27360, sgk: 5700, vergi: 4180, damga: 300, mesai: 0, prim: 1000, avans: 2000, ay: 'Temmuz 2026', durum: 'Bekliyor' },
  ],
  avans: [
    { id: 1, personel: 'Ayşe Kaya', tutar: 5000, tarih: '2026-06-20', durum: 'Kapalı', odeme: 'Kasa', dusum: 'Temmuz maaşından', aciklama: 'Kira ödemesi için' },
    { id: 2, personel: 'Ali Çelik', tutar: 3000, tarih: '2026-06-25', durum: 'Kapalı', odeme: 'Banka', dusum: 'Temmuz maaşından', aciklama: 'Acil ihtiyaç' },
    { id: 3, personel: 'Emine Demir', tutar: 2000, tarih: '2026-07-01', durum: 'Açık', odeme: 'Kasa', dusum: 'Ağustos maaşından', aciklama: 'Tatil avansı' },
    { id: 4, personel: 'Mehmet Demir', tutar: 8000, tarih: '2026-07-02', durum: 'Onay Bekliyor', odeme: '-', dusum: 'Ağustos maaşından', aciklama: 'Araç onarımı' },
    { id: 5, personel: 'Zeynep Arslan', tutar: 4500, tarih: '2026-07-03', durum: 'Onay Bekliyor', odeme: '-', dusum: 'Ağustos maaşından', aciklama: 'Sağlık gideri' },
  ],
  devam: [
    { personel: 'Ahmet Yılmaz', gun: 22, gelmedi: 0, gec: 0, mesai: 5, izin: 0 },
    { personel: 'Ayşe Kaya', gun: 21, gelmedi: 1, gec: 2, mesai: 8, izin: 0 },
    { personel: 'Mehmet Demir', gun: 20, gelmedi: 2, gec: 3, mesai: 12, izin: 1 },
    { personel: 'Fatma Şahin', gun: 22, gelmedi: 0, gec: 0, mesai: 3, izin: 0 },
    { personel: 'Ali Çelik', gun: 19, gelmedi: 3, gec: 1, mesai: 6, izin: 2 },
    { personel: 'Zeynep Arslan', gun: 21, gelmedi: 1, gec: 0, mesai: 4, izin: 1 },
    { personel: 'Osman Türk', gun: 0, gelmedi: 22, gec: 0, mesai: 0, izin: 22 },
    { personel: 'Emine Demir', gun: 22, gelmedi: 0, gec: 1, mesai: 2, izin: 0 },
  ],
  as: [
    { id: 1000, no: 'AS20261000', cari: 'Marmara Tekstil A.Ş.', tarih: '2026-07-04', termin: '2026-07-18', tutar: 85000, urunler: 4, durum: 'Onaylandı' },
    { id: 999, no: 'AS20260999', cari: 'Anadolu Hırdavat San.', tarih: '2026-07-04', termin: '2026-07-20', tutar: 42500, urunler: 2, durum: 'Yeni' },
    { id: 998, no: 'AS20260998', cari: 'Karadeniz Mobilya A.Ş.', tarih: '2026-07-03', termin: '2026-07-17', tutar: 120000, urunler: 7, durum: 'Onaylandı' },
    { id: 997, no: 'AS20260997', cari: 'Erciyes Yapı Market', tarih: '2026-07-03', termin: '2026-07-15', tutar: 28000, urunler: 3, durum: 'Dönüştürüldü' },
    { id: 996, no: 'AS20260996', cari: 'Akdeniz Gıda Ltd.', tarih: '2026-07-02', termin: '2026-07-12', tutar: 15000, urunler: 2, durum: 'İptal' },
    { id: 995, no: 'AS20260995', cari: 'Marmara Tekstil A.Ş.', tarih: '2026-07-01', termin: '2026-07-14', tutar: 67000, urunler: 5, durum: 'Onaylandı' },
  ],
  vs: [
    { id: 1000, no: 'VS20261000', cari: 'Yıldız Plastik A.Ş.', tarih: '2026-07-04', termin: '2026-07-22', tutar: 58000, urunler: 3, durum: 'Bekliyor' },
    { id: 999, no: 'VS20260999', cari: 'Marmara Kimya San.', tarih: '2026-07-03', termin: '2026-07-18', tutar: 32000, urunler: 2, durum: 'Onaylandı' },
    { id: 998, no: 'VS20260998', cari: 'Yıldız Plastik A.Ş.', tarih: '2026-07-02', termin: '2026-07-16', tutar: 91000, urunler: 6, durum: 'Teslim Alındı' },
    { id: 997, no: 'VS20260997', cari: 'Marmara Kimya San.', tarih: '2026-07-01', termin: '2026-07-10', tutar: 24500, urunler: 2, durum: 'Teslim Alındı' },
    { id: 996, no: 'VS20260996', cari: 'Yıldız Plastik A.Ş.', tarih: '2026-06-30', termin: '2026-07-08', tutar: 12000, urunler: 1, durum: 'İptal' },
  ],
  teklif: [
    { id: 1000, no: 'TK20261000', cari: 'Anadolu Hırdavat San.', tarih: '2026-07-04', gecerlilik: '2026-07-18', tutar: 145000, urunler: 8, durum: 'Açık' },
    { id: 999, no: 'TK20260999', cari: 'Ege Lojistik Ltd. Şti.', tarih: '2026-07-03', gecerlilik: '2026-07-17', tutar: 78500, urunler: 5, durum: 'Kabul Edildi' },
    { id: 998, no: 'TK20260998', cari: 'Marmara Tekstil A.Ş.', tarih: '2026-07-02', gecerlilik: '2026-07-16', tutar: 210000, urunler: 12, durum: 'Açık' },
    { id: 997, no: 'TK20260997', cari: 'Akdeniz Gıda Ltd.', tarih: '2026-07-01', gecerlilik: '2026-07-08', tutar: 35000, urunler: 4, durum: 'Reddedildi' },
    { id: 996, no: 'TK20260996', cari: 'Erciyes Yapı Market', tarih: '2026-06-29', gecerlilik: '2026-07-06', tutar: 55000, urunler: 6, durum: 'Süresi Geçti' },
    { id: 995, no: 'TK20260995', cari: 'Karadeniz Mobilya A.Ş.', tarih: '2026-06-28', gecerlilik: '2026-07-05', tutar: 89000, urunler: 7, durum: 'Kabul Edildi' },
  ],
};

/* ============================================================
   MASTER V2 - Genişletilmiş Demo / Mock Veri Seti
   Tüm liste modüllerinde dolu ekran ve gerçekçi veri yoğunluğu.
   ============================================================ */
(function expandMasterMockData(){
  const targetByKey = {
    cari: 36, stok: 42, satis: 32, alim: 28, kasa: 12, kasaHareket: 40,
    banka: 12, bankaHareket: 36, cek: 28, senet: 28, personel: 30,
    maas: 30, avans: 26, devam: 30, as: 34, vs: 30, teklif: 34,
    basvuru: 28
  };
  const cities = ['İstanbul','Ankara','İzmir','Bursa','Antalya','Konya','Kayseri','Samsun','Trabzon','Gaziantep','Adana','Eskişehir'];
  const firms = ['Atlas','Kuzey','Nova','Vizyon','Doruk','Mavi','Pera','Eksen','Rota','Ahenk','Başkent','Delta'];
  const sectors = ['Endüstri','Yapı','Lojistik','Tekstil','Gıda','Makine','Plastik','Kimya','Elektrik','Mobilya'];
  const people = ['Ahmet Yıldız','Ayşe Demir','Mehmet Kaya','Zeynep Şahin','Ali Arslan','Elif Çelik','Hasan Koç','Emine Aydın','Murat Akın','Selin Öz'];
  const products = ['Galvaniz Profil','Endüstriyel Temizleyici','Kablo Kanalı','Rulman Seti','Ambalaj Filmi','Koruyucu Eldiven','Akrilik Boya','Paslanmaz Vida','Hidrolik Yağ','Karton Kutu'];
  const depots = ['Ana Depo','Metal Depo','Kimya Depo','Şube Depo','Araç Deposu'];

  function cloneRecord(base, index, key){
    const r = {...base};
    const seq = 1001 + index;
    r.id = seq;
    if ('kod' in r) r.kod = (key==='cari'?'CR':key==='stok'?'ST':key==='kasa'?'KS':'KD') + String(seq).padStart(4,'0');
    if ('no' in r) {
      const prefix = key==='satis'?'S':key==='alim'?'A':key==='cek'?'CK':key==='senet'?'SN':key==='as'?'AS':key==='vs'?'VS':key==='teklif'?'TK':'EV';
      r.no = prefix + '2026' + String(seq).padStart(4,'0');
    }
    if (key==='cari') {
      r.ad = firms[index%firms.length]+' '+sectors[(index*3)%sectors.length]+' '+(index%3===0?'A.Ş.':'Ltd. Şti.');
      r.yetkili = people[index%people.length]; r.sehir=cities[index%cities.length];
      r.telefon='0'+(212+(index%8)*10)+' 5'+String(10+index%89).padStart(2,'0')+' '+String(10+index%89).padStart(2,'0')+' '+String(20+index%79).padStart(2,'0');
      r.email='info'+seq+'@ornekfirma.com'; r.bakiye=((index%5)-2)*12500; r.risk=index%7===0?2:index%5===0?1:0; r.durum=index%11===0?'Pasif':'Aktif';
    }
    if (key==='stok') {
      r.ad=products[index%products.length]+' '+(index+1); r.kategori=['Metal','Kimyasal','Elektrik','Sarf','Ambalaj'][index%5];
      r.birim=['adet','kg','mt','lt','paket'][index%5]; r.miktar=25+(index*37)%4800; r.min=50+(index%5)*25;
      r.alisFiyat=18+(index*11.7)%540; r.fiyat=Number((r.alisFiyat*1.22).toFixed(2)); r.sonSatisFiyat=Number((r.fiyat*.97).toFixed(2)); r.depo=depots[index%depots.length];
    }
    if (['satis','alim','as','vs','teklif'].includes(key)) {
      r.cari=firms[index%firms.length]+' '+sectors[index%sectors.length]+' Ltd. Şti.';
      r.tarih=`2026-07-${String(1+(index%28)).padStart(2,'0')}`; r.tutar=12500+((index*17350)%245000); if ('urunler' in r) r.urunler=1+(index%12);
      if ('termin' in r) r.termin=`2026-08-${String(1+(index%27)).padStart(2,'0')}`;
      if ('gecerlilik' in r) r.gecerlilik=`2026-08-${String(1+(index%27)).padStart(2,'0')}`;
    }
    if (key==='kasa') { r.ad=['Merkez','Şube','Saha','Mağaza'][index%4]+' Kasa '+(index+1); r.bakiye=15000+(index*28750)%350000; r.tur=index%5===0?'USD':'TL'; }
    if (key==='banka') { r.banka=['Ziraat Bankası','İş Bankası','Garanti BBVA','Yapı Kredi','Akbank'][index%5]; r.hesap=['CARİ','POS','MAAŞ','VERGİ'][index%4]; r.bakiye=85000+(index*96500)%1800000; }
    if (key==='kasaHareket' || key==='bankaHareket') { r.tarih=`2026-07-${String(1+(index%28)).padStart(2,'0')}`; r.aciklama=(index%2?'Müşteri tahsilatı - ':'Tedarikçi ödemesi - ')+firms[index%firms.length]; r.tutar=(index%3===0?-1:1)*(2500+(index*3750)%95000); }
    if (key==='cek') { r.keşideci=firms[index%firms.length]+' '+sectors[index%sectors.length]; r.tutar=10000+(index*8500)%160000; r.vade=`2026-${String(7+(index%3)).padStart(2,'0')}-${String(1+(index%27)).padStart(2,'0')}`; }
    if (key==='senet') { r.borclu=firms[index%firms.length]+' '+sectors[index%sectors.length]; r.tutar=9000+(index*7200)%140000; r.vade=`2026-${String(7+(index%3)).padStart(2,'0')}-${String(1+(index%27)).padStart(2,'0')}`; }
    if (key==='personel') { r.ad=people[index%people.length]+' '+(index+1); r.departman=['Satış','Muhasebe','Depo','Servis','Üretim','İK'][index%6]; r.unvan=['Uzman','Sorumlu','Teknisyen','Temsilci','Operatör'][index%5]; r.maas=28000+(index%12)*3500; }
    if (key==='maas') { r.personel=people[index%people.length]+' '+(index+1); r.brut=30000+(index%10)*4000; r.net=Math.round(r.brut*.72); r.sgk=Math.round(r.brut*.15); r.vergi=Math.round(r.brut*.11); }
    if (key==='avans') { r.personel=people[index%people.length]+' '+(index+1); r.tutar=1500+(index%8)*1250; r.tarih=`2026-07-${String(1+(index%28)).padStart(2,'0')}`; }
    if (key==='devam') { r.personel=people[index%people.length]+' '+(index+1); r.gun=18+(index%5); r.gelmedi=index%4; r.gec=index%3; r.mesai=(index*2)%14; }
    if (key==='basvuru') { r.ad=people[index%people.length]+' '+(index+1); r.pozisyon=['Satış Uzmanı','Depo Operatörü','Servis Teknisyeni','Muhasebe Uzmanı'][index%4]; r.tarih=`2026-07-${String(1+(index%28)).padStart(2,'0')}`; r.deneyim=1+(index%12); }
    return r;
  }

  Object.entries(targetByKey).forEach(([key,target])=>{
    const arr=MOCK[key]; if(!Array.isArray(arr) || !arr.length || arr.length>=target) return;
    const originals=arr.slice();
    for(let i=arr.length;i<target;i++) arr.push(cloneRecord(originals[i%originals.length],i,key));
  });
})();

/* ============================================================
   Context return buttons
   ============================================================ */
const TCR_RETURN_PAGES = {
  'kasa-ekstre': { href:'kasa.html', label:'Kasaya Dön' },
  'banka-ekstre': { href:'banka.html', label:'Bankaya Dön' },
  'cari-ekstre': { href:'cari.html', label:'Cari Kartlara Dön' },
  'stok-ekstre': { href:'stok.html', label:'Stok Kartlarına Dön' },
  'cek-karnelerim': { href:'banka.html', label:'Bankaya Dön' },
  'cari-form': { href:'cari.html', label:'Cari Kartlara Dön' },
  'cari-fis-form': { href:'cari-fisleri.html', label:'Cari Fişlerine Dön' },
  'stok-form': { href:'stok.html', label:'Stok Kartlarına Dön' },
  'stok-fis-form': { href:'stok-islemler.html', label:'Stok Fişlerine Dön' },
  'teklif-form': { href:'teklif.html', label:'Tekliflere Dön' },
  'as-form': { href:'as.html', label:'Alınan Siparişlere Dön' },
  'vs-form': { href:'vs.html', label:'Verilen Siparişlere Dön' },
  'satis-form': { href:'satis.html', label:'Satış Faturalarına Dön' },
  'alim-form': { href:'alim.html', label:'Alış Faturalarına Dön' },
  'servis-talep-form': { href:'servis-talep.html', label:'Servis Taleplerine Dön' },
  'depo-hazirlik': { href:'depo-operasyon.html', label:'Depo Operasyonlarına Dön' },
  'depo-teslimat': { href:'depo-operasyon.html', label:'Depo Operasyonlarına Dön' },
  'depo-mal-kabul': { href:'depo-operasyon.html', label:'Depo Operasyonlarına Dön' },
  'depo-eksik': { href:'depo-operasyon.html', label:'Depo Operasyonlarına Dön' },
  'depo-tamamlanan': { href:'depo-operasyon.html', label:'Depo Operasyonlarına Dön' },
  'depo-akis': { href:'depo-operasyon.html', label:'Depo Operasyonlarına Dön' }
};
const TCR_BACK_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/><path d="M9 12h10"/></svg>';
function tcrContextReturn(activeId, fallbackHref){
  const target=fallbackHref || TCR_RETURN_PAGES[activeId]?.href || 'dashboard.html';
  const ref=document.referrer || '';
  try{
    if(ref && new URL(ref).origin===location.origin && !ref.endsWith(location.pathname.split('/').pop())){history.back();return;}
  }catch(e){}
  location.href=target;
}
function injectContextReturnButton(activeId,root){
  const cfg=TCR_RETURN_PAGES[activeId]; if(!cfg||!root)return;
  const actions=root.querySelector('.page-head .page-actions'); if(!actions||actions.querySelector('[data-context-return]'))return;
  const btn=document.createElement('button');
  btn.type='button'; btn.className='btn btn-ghost tcr-context-return'; btn.dataset.contextReturn='1';
  btn.innerHTML=TCR_BACK_ICON+' '+cfg.label;
  btn.addEventListener('click',()=>tcrContextReturn(activeId,cfg.href));
  actions.prepend(btn);
}

/* ============================================================
   Page bootstrap helper
   ============================================================ */
function bootPage(activeId, renderFn) {
  const _navForTitle = getRoleNav();
  document.title = 'Tcr3WEB · ' + ((_navForTitle.find(n => n.id === activeId)||NAV.find(n=>n.id===activeId))?.label || 'Prototip');
  document.body.setAttribute('data-role', getActiveRole());
  const app = document.getElementById('app');
  app.innerHTML = renderShell(activeId);
  restoreSidebarScrollPosition();
  setTimeout(() => refreshHeaderWeather(false), 80);
  const content = document.getElementById('content');
  content.innerHTML = (activeId === 'dashboard') ? renderRoleDashboard() : renderFn();
  injectContextReturnButton(activeId, content);
  normalizeActionButtons(content);
  if (window.afterRender) window.afterRender();
}

/* ============================================================
   Print / Share helpers
   ============================================================ */
function printDoc() {
  window.print();
}

function shareWhatsApp(docNo, docType, amount, party) {
  const sym = CURRENCY_SYMBOLS[APP_CURRENCY] || '₺';
  const amtStr = Number(amount||0).toLocaleString('tr-TR', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' ' + sym;
  const text = `*${docType}* ${docNo}\nTaraf: ${party}\nTutar: ${amtStr}\n\nTcr3WEB - HTML Şablon`;
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

/* ============================================================
   Picker modal — searchable cari / stok selector
   ============================================================ */
let _pickerTarget = null; // { displayId, hiddenId, type, onSelect? }
let _pickerData = [];
let _pickerKeyboardItems = [];
let _pickerKeyboardIndex = 0;

const RISK_LABELS = ['Normal', 'Dikkat', 'Riskli'];
const RISK_COLORS = ['var(--c-accent-500)', 'var(--c-warn-400)', 'var(--c-danger-400)'];

const PICKER_COLUMNS = {
  cari: [
    { key:'avatar', label:'Kod', width:'44px', required:true },
    { key:'name', label:'Cari Ünvan', width:'1fr', required:true },
    { key:'tip', label:'Tip / Şehir', width:'120px' },
    { key:'bakiye', label:'Bakiye', width:'110px' },
    { key:'risk', label:'Risk', width:'80px' },
    { key:'vade', label:'Vade', width:'70px' },
    { key:'action', label:'Seç', width:'68px', required:true },
  ],
  stok: [
    { key:'avatar', label:'Kod', width:'44px', required:true },
    { key:'name', label:'Ürün', width:'1.15fr', required:true },
    { key:'kategori', label:'Kategori', width:'100px' },
    { key:'alis', label:'Alış Fiyatı', width:'94px' },
    { key:'satis', label:'Satış Fiyatı', width:'98px' },
    { key:'sonSatis', label:'Son Satış', width:'110px' },
    { key:'miktar', label:'Stok Miktarı', width:'98px' },
    { key:'stok', label:'Stok', width:'72px' },
    { key:'action', label:'İşlem', width:'142px', required:true },
  ]
};
let _pickerVisibleColumns = {
  cari: { avatar:true, name:true, tip:true, bakiye:true, risk:true, vade:true, action:true },
  stok: { avatar:true, name:true, kategori:true, alis:true, satis:true, sonSatis:true, miktar:true, stok:true, action:true }
};
function pickerGridStyle(type) {
  const defs = PICKER_COLUMNS[type === 'stok' ? 'stok' : 'cari'];
  const visible = _pickerVisibleColumns[type === 'stok' ? 'stok' : 'cari'];
  return defs.filter(c => visible[c.key]).map(c => c.width).join(' ');
}
function pcol(type, key, html, extra='') {
  const t = type === 'stok' ? 'stok' : 'cari';
  if (!_pickerVisibleColumns[t][key]) return '';
  return `<div class="pcol-${key} ${extra}">${html}</div>`;
}
function renderPickerColumnMenu(type) {
  const menu = document.getElementById('picker-columns-menu');
  if (!menu) return;
  const t = type === 'stok' ? 'stok' : 'cari';
  menu.innerHTML = PICKER_COLUMNS[t].filter(c => !c.required).map(c => `
    <label class="picker-col-check">
      <input type="checkbox" ${_pickerVisibleColumns[t][c.key] ? 'checked' : ''} onchange="setPickerColumn('${t}','${c.key}',this.checked)">
      <span>${c.label}</span>
    </label>`).join('');
}
function togglePickerColumnMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById('picker-columns-menu');
  if (menu) menu.classList.toggle('open');
}
function setPickerColumn(type, key, checked) {
  _pickerVisibleColumns[type][key] = checked;
  renderPickerList(_pickerData.filter(item => {
    const q = document.getElementById('picker-q')?.value?.toLowerCase() || '';
    if (!q) return true;
    return item.ad.toLowerCase().includes(q) || String(item.kod||item.id).toLowerCase().includes(q) || (item.sehir||'').toLowerCase().includes(q);
  }));
}

function updatePickerQuickAddButton(type) {
  const btn = document.getElementById('picker-quick-add-btn');
  const label = document.getElementById('picker-quick-add-label');
  if (!btn || !label) return;
  const isStock = type === 'stok';
  btn.style.display = (type === 'stok' || type === 'cari' || type === 'musteri' || type === 'tedarikci') ? 'inline-flex' : 'none';
  label.textContent = isStock ? 'Stok Ekle' : 'Cari Ekle';
  btn.title = isStock ? 'Hızlı Stok Ekle' : 'Hızlı Cari Ekle';
}

function openQuickAddFromPicker() {
  const type = _pickerTarget?.type === 'stok' ? 'stok' : 'cari';
  const title = document.getElementById('quick-add-title');
  const body = document.getElementById('quick-add-body');
  const info = document.getElementById('quick-add-info');
  if (!body) return;
  if (title) title.textContent = type === 'stok' ? 'Hızlı Stok Ekle' : 'Hızlı Cari Ekle';
  if (info) info.textContent = type === 'stok' ? 'Yeni stok demo listeye eklenir.' : 'Yeni cari demo listeye eklenir.';
  if (type === 'stok') {
    body.innerHTML = `
      <div class="quick-add-grid">
        <label class="form-field"><span>Stok Adı</span><input id="qa-stok-ad" class="form-control" placeholder="Örn. Yeni Ürün"></label>
        <label class="form-field"><span>Stok Kodu</span><input id="qa-stok-kod" class="form-control" placeholder="Otomatik"></label>
        <label class="form-field"><span>Kategori</span><select id="qa-stok-kategori" class="form-control"><option>Hammadde</option><option>Ambalaj</option><option>Kimyasal</option><option>Metal</option><option>Sarf</option><option>Elektrik</option></select></label>
        <label class="form-field"><span>Birim</span><select id="qa-stok-birim" class="form-control"><option>adet</option><option>kg</option><option>mt</option><option>lt</option><option>paket</option><option>kutu</option></select></label>
        <label class="form-field"><span>Mevcut Stok</span><input id="qa-stok-miktar" type="number" class="form-control" value="0"></label>
        <label class="form-field"><span>Satış Fiyatı</span><input id="qa-stok-fiyat" type="number" class="form-control" value="0"></label>
      </div>`;
  } else {
    body.innerHTML = `
      <div class="quick-add-grid">
        <label class="form-field"><span>Cari Ünvan</span><input id="qa-cari-ad" class="form-control" placeholder="Örn. Yeni Cari"></label>
        <label class="form-field"><span>Cari Kodu</span><input id="qa-cari-kod" class="form-control" placeholder="Otomatik"></label>
        <label class="form-field"><span>Tip</span><select id="qa-cari-tip" class="form-control"><option>Müşteri</option><option>Tedarikçi</option></select></label>
        <label class="form-field"><span>Yetkili</span><input id="qa-cari-yetkili" class="form-control" placeholder="Yetkili kişi"></label>
        <label class="form-field"><span>Telefon</span><input id="qa-cari-telefon" class="form-control" placeholder="05xx xxx xx xx"></label>
        <label class="form-field"><span>Şehir</span><input id="qa-cari-sehir" class="form-control" placeholder="Şehir"></label>
      </div>`;
  }
  openModal('quickAddModal');
  setTimeout(() => body.querySelector('input')?.focus(), 80);
}

function saveQuickAddFromPicker() {
  const type = _pickerTarget?.type === 'stok' ? 'stok' : 'cari';
  if (type === 'stok') {
    const ad = document.getElementById('qa-stok-ad')?.value?.trim();
    if (!ad) return notify('Stok adı zorunludur', 'warning');
    const next = MOCK.stok.length + 1001;
    const kod = document.getElementById('qa-stok-kod')?.value?.trim() || ('ST' + String(next).padStart(4,'0'));
    const rec = {
      id: next, kod, ad,
      kategori: document.getElementById('qa-stok-kategori')?.value || 'Sarf',
      birim: document.getElementById('qa-stok-birim')?.value || 'adet',
      miktar: Number(document.getElementById('qa-stok-miktar')?.value || 0),
      min: 10,
      alisFiyat: Number(document.getElementById('qa-stok-fiyat')?.value || 0),
      fiyat: Number(document.getElementById('qa-stok-fiyat')?.value || 0),
      sonSatisFiyat: Number(document.getElementById('qa-stok-fiyat')?.value || 0),
      kdv: 20,
      depo: 'Ana Depo'
    };
    MOCK.stok.unshift(rec);
    _pickerData = MOCK.stok;
    renderPickerList(_pickerData);
    document.getElementById('picker-count').textContent = _pickerData.length + ' kayıt';
    setPickerSelectedInfo('stok', rec);
  } else {
    const ad = document.getElementById('qa-cari-ad')?.value?.trim();
    if (!ad) return notify('Cari ünvan zorunludur', 'warning');
    const next = MOCK.cari.length + 1001;
    const kod = document.getElementById('qa-cari-kod')?.value?.trim() || ('CR' + String(next).padStart(4,'0'));
    const rec = {
      id: next, kod, ad,
      tip: document.getElementById('qa-cari-tip')?.value || 'Müşteri',
      yetkili: document.getElementById('qa-cari-yetkili')?.value || '',
      telefon: document.getElementById('qa-cari-telefon')?.value || '',
      email: '',
      sehir: document.getElementById('qa-cari-sehir')?.value || '',
      bakiye: 0, risk: 0, vade: 30, durum: 'Aktif'
    };
    MOCK.cari.unshift(rec);
    if (_pickerTarget?.type === 'musteri') _pickerData = MOCK.cari.filter(c => c.tip === 'Müşteri');
    else if (_pickerTarget?.type === 'tedarikci') _pickerData = MOCK.cari.filter(c => c.tip === 'Tedarikçi');
    else _pickerData = MOCK.cari;
    renderPickerList(_pickerData);
    document.getElementById('picker-count').textContent = _pickerData.length + ' kayıt';
    setPickerSelectedInfo('cari', rec);
  }
  closeModal('quickAddModal');
}
document.addEventListener('click', function(e){
  const wrap = e.target.closest && e.target.closest('.picker-columns-wrap');
  if (!wrap) document.getElementById('picker-columns-menu')?.classList.remove('open');
});

function openPickerFor(type, displayId, hiddenId, onSelect, options = {}) {
  _pickerTarget = { type, displayId, hiddenId, onSelect, ...options };
  const titles = {
    musteri: 'Müşteri Seç',
    tedarikci: 'Tedarikçi Seç',
    cari: 'Cari Kart Seç',
    stok: 'Ürün / Stok Seç',
    kasa: 'Kasa Seç',
    banka: 'Banka Hesabı Seç',
  };
  document.getElementById('picker-title').textContent = titles[type] || 'Seçim';
  document.getElementById('picker-q').value = '';
  updatePickerQuickAddButton(type);
  setPickerFooterMessage('');

  if (type === 'musteri') {
    _pickerData = MOCK.cari.filter(c => c.tip === 'Müşteri');
  } else if (type === 'tedarikci') {
    _pickerData = MOCK.cari.filter(c => c.tip === 'Tedarikçi');
  } else if (type === 'cari') {
    _pickerData = MOCK.cari;
  } else if (type === 'stok') {
    _pickerData = MOCK.stok;
  } else if (type === 'kasa') {
    _pickerData = (MOCK.kasa || []).map(x => ({
      id:x.id, kod:x.kod || ('KASA'+x.id), ad:x.ad, tip:'Kasa', sehir:x.tur || 'TL',
      bakiye:Number(x.bakiye||0), risk:0, vade:0, durum:'Aktif', yetkili:'Kasa Hesabı'
    }));
  } else if (type === 'banka') {
    _pickerData = (MOCK.banka || []).map(x => ({
      id:x.id, kod:'BNK'+String(x.id).padStart(3,'0'), ad:(x.banka+' - '+x.hesap), tip:'Banka', sehir:x.tur || 'TL',
      bakiye:Number(x.bakiye||0), risk:0, vade:0, durum:'Aktif', yetkili:x.iban || ''
    }));
  } else {
    _pickerData = [];
  }

  renderPickerColumnMenu(type);
  renderPickerList(_pickerData);
  const countEl = document.getElementById('picker-count');
  if (countEl) countEl.textContent = _pickerData.length + ' kayıt';
  openModal('pickerModal');
  setTimeout(() => document.getElementById('picker-q').focus(), 80);
}


// Eski sayfalarda kullanılan kısa çağrı için uyumluluk.
function openPicker(type, displayId, hiddenId, onSelect) {
  return openPickerFor(type, displayId, hiddenId, onSelect);
}


function getActiveCariIdForPicker() {
  const ids = ['sf-cari-val','af-cari-val','asf-cari-val','tkf-cari-val','vsf-cari-val','df-cari-val','fis-cari-val','cari-id'];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.value) return el.value;
  }
  return '';
}
function getCustomerLastSalePrice(stokItem) {
  const base = Number(stokItem.sonSatisFiyat || stokItem.fiyat || 0);
  const cariId = getActiveCariIdForPicker();
  if (!cariId) return base;
  const seed = String(cariId + (stokItem.kod || stokItem.id)).split('').reduce((a,ch)=>a+ch.charCodeAt(0),0);
  const factor = 0.96 + ((seed % 9) / 100); // demo: seçili cariye göre küçük fiyat farkı
  return +(base * factor).toFixed(2);
}


function getStockSalePrice(stokItem) {
  return Number(stokItem?.fiyat || stokItem?.sonSatisFiyat || stokItem?.alisFiyat || 0);
}

function openPickerStockPrices(kod, event) {
  if (event) event.stopPropagation();
  const stokItem = (MOCK.stok || []).find(x => (x.kod || String(x.id)) === kod);
  if (!stokItem) return notify('Stok kaydı bulunamadı', 'warning');
  _activePricePicker = null;
  const title = document.getElementById('price-picker-title');
  const body = document.getElementById('price-picker-body');
  const footCurrent = document.getElementById('price-current-foot');
  const sale = getStockSalePrice(stokItem);
  const last = getCustomerLastSalePrice(stokItem);
  const priceRows = [
    { key:'alis', label:'Alış Fiyatı', value:Number(stokItem.alisFiyat || 0), note:'Tedarikçi maliyeti', meta:'Son alış bilgisi' },
    { key:'satis', label:'Satış Fiyatı', value:sale, note:'Liste satış fiyatı', meta:'Standart fiyat' },
    { key:'son', label:'Son Satış', value:last, note:'Seçili cariye göre', meta:'Müşteri son satış' },
    { key:'bayi', label:'Bayi Fiyatı', value:Number(sale * 0.94), note:'Bayi liste fiyatı', meta:'BAYİ-1' },
    { key:'ozel', label:'Özel Fiyat', value:Number(sale * 0.88), note:'Özel/mutabakatlı fiyat', meta:'Geçerlilik · 31.12.2026' },
    { key:'kampanya', label:'Kampanya', value:Number(sale * 0.91), note:'Dönemsel fiyat', meta:'Demo kampanya' },
  ].map(x => ({...x, value:+x.value.toFixed(2)}));
  if (title) title.textContent = 'Fiyat Merkezi';
  if (footCurrent) footCurrent.innerHTML = `<span>Liste Satış</span><b>${fmtMoney(sale)}</b>`;
  if (body) {
    body.innerHTML = `
      ${renderPriceCenterProduct(stokItem)}
      ${renderPriceHistory(stokItem)}
      <div class="price-center-section-title">Fiyat Seçenekleri</div>
      <div class="price-option-grid read-only">
        ${priceRows.map(o => `
          <div class="price-option price-view-only price-kind-${o.key}">
            <span class="price-option-icon">₺</span>
            <span class="price-option-text">
              <strong>${o.label}</strong>
              <small>${o.note}</small>
              <small class="price-option-meta">${o.meta || ''}</small>
            </span>
            <b>${fmtMoney(o.value)}</b>
          </div>
        `).join('')}
      </div>`;
  }
  openModal('pricePickerModal');
}

function isPassiveCariBlocked(item) {
  if (!item || item.durum !== 'Pasif') return false;
  return !!(_pickerTarget && _pickerTarget.blockPassive === true && ['musteri','tedarikci','cari'].includes(_pickerTarget.type));
}

function passiveCariNotice(item) {
  const name = item?.ad ? `: ${item.ad}` : '';
  setPickerFooterMessage(`<span style="color:var(--c-danger-600);font-weight:800">Bu hesap pasif${name}</span> <span class="picker-foot-sep">•</span> Sipariş ve fatura işlemlerinde seçilemez.`);
  notify('Bu hesap pasif. Sipariş ve fatura işlemlerinde seçilemez.', 'warning');
}

function renderPickerList(items) {
  const el = document.getElementById('picker-list');
  if (!el) return;
  _pickerKeyboardItems = Array.isArray(items) ? items : [];
  if (_pickerKeyboardIndex < 0) _pickerKeyboardIndex = 0;
  if (_pickerKeyboardIndex >= _pickerKeyboardItems.length) _pickerKeyboardIndex = Math.max(0, _pickerKeyboardItems.length - 1);
  if (!items.length) {
    el.innerHTML = '<div class="picker-empty">Sonuç bulunamadı</div>';
    return;
  }
  const type = _pickerTarget?.type;
  const isStok = type === 'stok';
  const grid = pickerGridStyle(isStok ? 'stok' : 'cari');

  const header = isStok
    ? `<div class="picker-table-head" style="grid-template-columns:${grid}">
        ${pcol('stok','avatar','')}${pcol('stok','name','Ürün')}${pcol('stok','kategori','Kategori')}${pcol('stok','alis','Alış Fiyatı','txt-r')}${pcol('stok','satis','Satış Fiyatı','txt-r')}${pcol('stok','sonSatis','Son Satış','txt-r')}${pcol('stok','miktar','Stok Miktarı','txt-r')}${pcol('stok','stok','Stok','txt-r')}${pcol('stok','action','')}
      </div>`
    : `<div class="picker-table-head" style="grid-template-columns:${grid}">
        ${pcol('cari','avatar','')}${pcol('cari','name','Cari Ünvan')}${pcol('cari','tip','Tip / Şehir')}${pcol('cari','bakiye','Bakiye','txt-r')}${pcol('cari','risk','Risk')}${pcol('cari','vade','Vade')}${pcol('cari','action','')}
      </div>`;

  const rows = items.map((item, index) => {
    const kbClass = index === _pickerKeyboardIndex ? ' keyboard-active' : '';
    const id = item.kod || String(item.id);
    const safeName = (item.ad || '').replace(/'/g, "\\'");
    const safeId   = id.replace(/'/g, "\\'");

    if (isStok) {
      const low = item.miktar < item.min;
      const pct = Math.min(100, (item.miktar / (item.min * 3)) * 100);
      const lvlColor = low ? 'var(--c-danger-400)' : pct < 50 ? 'var(--c-warn-400)' : 'var(--c-accent-500)';
      const katColors = { Hammadde:'#2c4670', Ambalaj:'#168a55', Kimyasal:'#e6a93c', Metal:'#c93838', Sarf:'#5d6678', Elektrik:'#8a93a6' };
      const bg = katColors[item.kategori] || '#5d6678';
      const initials = item.ad.substring(0, 2).toUpperCase();
      return `<div class="picker-row${kbClass}" data-picker-index="${index}" style="grid-template-columns:${grid}" onclick="selectPicker('${safeId}','${safeName}')">
        ${pcol('stok','avatar',`<div class="picker-row-avatar" style="background:${bg}20;color:${bg}">${initials}</div>`)}
        ${pcol('stok','name',`<div class="picker-row-name"><div class="picker-row-title">${item.ad}</div><div class="picker-row-sub mono">${item.kod} · ${item.depo}</div></div>`)}
        ${pcol('stok','kategori',`<span class="picker-badge" style="background:${bg}18;color:${bg}">${item.kategori}</span>`)}
        ${pcol('stok','alis',`<span style="font-weight:700;font-size:13px;color:var(--text-strong)">${fmtMoney(item.alisFiyat || item.fiyat)}</span>`,'txt-r')}
        ${pcol('stok','satis',`<span style="font-weight:800;font-size:13px;color:var(--c-accent-700)">${fmtMoney(item.fiyat || item.sonSatisFiyat || 0)}</span><div style="font-size:10px;color:var(--text-mute)">liste</div>`,'txt-r')}
        ${pcol('stok','sonSatis',`<span style="font-weight:700;font-size:13px;color:var(--c-primary-700)">${fmtMoney(getCustomerLastSalePrice(item))}</span><div style="font-size:10px;color:var(--text-mute)">seçili cari</div>`,'txt-r')}
        ${pcol('stok','miktar',`<span style="font-weight:600;font-size:13px">${fmtNum(item.miktar)}</span><span style="font-size:11px;color:var(--text-mute)"> ${item.birim}</span>`,'txt-r')}
        ${pcol('stok','stok',`<div style="display:flex;align-items:center;gap:5px;justify-content:flex-end"><div style="width:40px;height:5px;border-radius:3px;background:var(--c-nu-200);overflow:hidden"><div style="width:${pct}%;height:100%;background:${lvlColor}"></div></div><span style="font-size:11px;font-weight:600;color:${lvlColor}">${low?'Düşük':'OK'}</span></div>`,'txt-r')}
        ${pcol('stok','action',`<div class="picker-action-group"><button class="btn btn-primary btn-sm picker-sel-btn" onclick="event.stopPropagation();selectPicker('${safeId}','${safeName}')">Seç</button><button class="btn btn-ghost btn-sm picker-price-btn" title="Tüm fiyatları gör" onclick="openPickerStockPrices('${safeId}', event)">₺ Fiyatlar</button></div>`)}
      </div>`;
    } else {
      const risk = item.risk || 0;
      const bakiye = item.bakiye || 0;
      const bakiyeColor = bakiye < 0 ? 'var(--c-danger-400)' : bakiye > 0 ? 'var(--c-accent-600)' : 'var(--text-mute)';
      const tipColor = item.tip === 'Müşteri' ? 'var(--c-primary-500)' : 'var(--c-warn-400)';
      const words = item.ad.trim().split(' ');
      const initials = words.length >= 2 ? words[0][0] + words[1][0] : item.ad.substring(0, 2);
      const passiveBlocked = isPassiveCariBlocked(item);
      const rowClick = passiveBlocked ? `passiveCariNoticeById('${safeId}')` : `selectPicker('${safeId}','${safeName}')`;
      const actionHtml = passiveBlocked
        ? `<button class="btn btn-outline-danger btn-sm picker-sel-btn picker-passive-btn" title="Bu hesap pasif; sipariş ve fatura işlemlerinde seçilemez" onclick="event.stopPropagation();passiveCariNoticeById('${safeId}')">Hesap Pasif</button>`
        : `<button class="btn btn-primary btn-sm picker-sel-btn" onclick="event.stopPropagation();selectPicker('${safeId}','${safeName}')">Seç</button>`;
      return `<div class="picker-row${kbClass}${passiveBlocked?' picker-row-passive':''}" data-picker-index="${index}" style="grid-template-columns:${grid}" onclick="${rowClick}">
        ${pcol('cari','avatar',`<div class="picker-row-avatar" style="background:${tipColor}20;color:${tipColor}">${initials.toUpperCase()}</div>`)}
        ${pcol('cari','name',`<div class="picker-row-name"><div class="picker-row-title">${item.ad}</div><div class="picker-row-sub">${item.yetkili || ''}${passiveBlocked?' · Bu hesap pasif':''}</div></div>`)}
        ${pcol('cari','tip',`<span class="picker-badge" style="background:${tipColor}18;color:${tipColor}">${item.tip}</span><span style="font-size:12px;color:var(--text-mute);margin-left:5px">${item.sehir||''}</span>`)}
        ${pcol('cari','bakiye',`<div style="font-size:13px;font-weight:700;color:${bakiyeColor}">${fmtMoney(Math.abs(bakiye))}${bakiye<0?'<div style="font-size:10px;color:var(--text-mute)">Borçlu</div>':bakiye>0?'<div style="font-size:10px;color:var(--text-mute)">Alacaklı</div>':''}</div>`,'txt-r')}
        ${pcol('cari','risk',`<span class="picker-badge" style="background:${risk===0?'var(--c-accent-100)':risk===1?'var(--c-warn-100)':'var(--c-danger-100)'};color:${RISK_COLORS[risk]}">${RISK_LABELS[risk]}</span>`)}
        ${pcol('cari','vade',`<span style="font-size:12px;color:var(--text-mute)">${item.vade} gün${item.durum==='Pasif'?'<br><span style="color:var(--c-danger-500);font-weight:800">Pasif</span>':''}</span>`)}
        ${pcol('cari','action',actionHtml)}
      </div>`;
    }
  }).join('');

  el.innerHTML = header + rows;
}
function passiveCariNoticeById(id) {
  const rec = MOCK.cari.find(c => (c.kod || String(c.id)) === id);
  passiveCariNotice(rec);
}

function filterPicker(q) {
  const lq = q.toLowerCase();
  const filtered = lq
    ? _pickerData.filter(item => item.ad.toLowerCase().includes(lq) || String(item.kod||item.id).toLowerCase().includes(lq) || (item.sehir||'').toLowerCase().includes(lq))
    : _pickerData;
  _pickerKeyboardIndex = 0;
  const countEl = document.getElementById('picker-count');
  if (countEl) countEl.textContent = filtered.length + ' kayıt';
  renderPickerList(filtered);
}

function isPickerKeyboardReady() {
  const picker = document.getElementById('pickerModal');
  if (!picker || !picker.classList.contains('open')) return false;
  if (document.getElementById('quickAddModal')?.classList.contains('open')) return false;
  if (document.getElementById('pricePickerModal')?.classList.contains('open')) return false;
  return !!document.getElementById('picker-q');
}
function focusPickerSearch(moveEnd = true) {
  const q = document.getElementById('picker-q');
  if (!q) return null;
  q.focus();
  if (moveEnd) {
    const len = q.value.length;
    try { q.setSelectionRange(len, len); } catch(e) {}
  }
  return q;
}
function repaintPickerKeyboardActive() {
  document.querySelectorAll('#picker-list .picker-row.keyboard-active').forEach(r => r.classList.remove('keyboard-active'));
  const row = document.querySelector(`#picker-list .picker-row[data-picker-index="${_pickerKeyboardIndex}"]`);
  if (row) {
    row.classList.add('keyboard-active');
    row.scrollIntoView({ block:'nearest' });
  }
}
function selectActivePickerRow() {
  const item = _pickerKeyboardItems[_pickerKeyboardIndex];
  if (!item) return;
  const id = item.kod || String(item.id);
  selectPicker(id, item.ad || '');
}
document.addEventListener('keydown', function(e) {
  if (!isPickerKeyboardReady()) return;
  const q = document.getElementById('picker-q');
  const active = document.activeElement;
  const tag = active ? active.tagName : '';
  const activeIsSearch = active === q;
  const activeIsEditable = active && (active.isContentEditable || ['INPUT','TEXTAREA','SELECT'].includes(tag));
  const activeIsCheckbox = active && tag === 'INPUT' && active.type === 'checkbox';
  if (activeIsEditable && !activeIsSearch && !activeIsCheckbox) return;
  if (e.altKey || e.metaKey) return;

  if (e.ctrlKey && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    q.focus();
    q.select();
    return;
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (_pickerKeyboardItems.length) {
      _pickerKeyboardIndex = Math.min(_pickerKeyboardItems.length - 1, _pickerKeyboardIndex + 1);
      repaintPickerKeyboardActive();
    }
    return;
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (_pickerKeyboardItems.length) {
      _pickerKeyboardIndex = Math.max(0, _pickerKeyboardIndex - 1);
      repaintPickerKeyboardActive();
    }
    return;
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    selectActivePickerRow();
    return;
  }
  if (e.key === 'Backspace' && !activeIsSearch) {
    e.preventDefault();
    q.value = q.value.slice(0, -1);
    focusPickerSearch();
    filterPicker(q.value);
    return;
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    focusPickerSearch();
    return;
  }
  if (!e.ctrlKey && e.key && e.key.length === 1 && !activeIsSearch) {
    e.preventDefault();
    q.value += e.key;
    focusPickerSearch();
    filterPicker(q.value);
  }
});

function setPickerFooterMessage(html) {
  const el = document.getElementById('picker-foot-msg');
  if (el) el.innerHTML = html || '<span class="picker-foot-default">Seçim yapıldığında son seçilen kayıt burada görünür.</span>';
}
function setPickerSelectedInfo(type, rec) {
  if (!rec) return setPickerFooterMessage('');
  if (type === 'stok') {
    setPickerFooterMessage(`<span class="picker-foot-label">Son Eklenen Ürün:</span> <span class="ok">${rec.ad}</span> <span class="picker-foot-sep">•</span> <span class="picker-foot-label">Mevcut Stok:</span> <strong>${fmtNum(rec.miktar)} ${rec.birim || ''}</strong> <span class="picker-foot-sep">•</span> <span class="picker-foot-label">Fiyat:</span> <strong>${fmtMoney(getCustomerLastSalePrice(rec))}</strong>`);
    return;
  }
  const bakiye = Number(rec.bakiye || 0);
  const bakiyeText = bakiye < 0 ? 'Borçlu' : bakiye > 0 ? 'Alacaklı' : 'Nötr';
  setPickerFooterMessage(`<span class="picker-foot-label">Son Seçilen Cari:</span> <span class="ok">${rec.ad}</span> <span class="picker-foot-sep">•</span> <span class="picker-foot-label">Bakiye:</span> <strong>${fmtMoney(Math.abs(bakiye))} ${bakiyeText}</strong> <span class="picker-foot-sep">•</span> <span class="picker-foot-label">Risk:</span> <strong>${RISK_LABELS[rec.risk || 0]}</strong>`);
}
function closePickerModal() {
  closeModal('pickerModal');
  setPickerFooterMessage('');
  _pickerTarget = null;
}

function selectPicker(id, ad) {
  if (!_pickerTarget) return;
  if (_pickerTarget.type !== 'stok') {
    const selectedCari = MOCK.cari.find(c => (c.kod || String(c.id)) === id);
    if (isPassiveCariBlocked(selectedCari)) {
      passiveCariNotice(selectedCari);
      return;
    }
  }
  const disp = document.getElementById(_pickerTarget.displayId);
  const hidden = document.getElementById(_pickerTarget.hiddenId);
  if (disp) {
    if (['INPUT','TEXTAREA','SELECT'].includes(disp.tagName)) disp.value = ad;
    else disp.textContent = ad;
  }
  if (hidden) hidden.value = id;
  silentHighlight(disp && disp.closest ? (disp.closest('.form-group') || disp) : disp);

  if (_pickerTarget.type === 'stok') {
    const rec = MOCK.stok.find(c => (c.kod || String(c.id)) === id);
    if (rec) setPickerSelectedInfo('stok', rec);
  } else {
    const rec = MOCK.cari.find(c => (c.kod || String(c.id)) === id);
    if (rec) {
      setPickerSelectedInfo('cari', rec);
      const bakiyeEl = document.getElementById('sum-cari-bakiye');
      const riskEl   = document.getElementById('sum-cari-risk');
      if (bakiyeEl) {
        const bakiyeColor = rec.bakiye < 0 ? 'var(--c-danger-400)' : 'var(--c-accent-600)';
        bakiyeEl.innerHTML = `<span style="color:${bakiyeColor};font-weight:700">${fmtMoney(Math.abs(rec.bakiye))}</span>${rec.bakiye<0?' <small style="color:var(--text-mute)">(Borçlu)</small>':rec.bakiye>0?' <small style="color:var(--text-mute)">(Alacaklı)</small>':''}`;
      }
      if (riskEl) {
        riskEl.innerHTML = `<span style="color:${RISK_COLORS[rec.risk||0]};font-weight:600">${RISK_LABELS[rec.risk||0]}</span>`;
      }
    }
  }

  if (_pickerTarget.onSelect) {
    const result = _pickerTarget.onSelect(id, ad);
    if (result === false) return;
  }
  if (_pickerTarget.keepOpen) {
    // Stok çoklu seçim modunda modal açık kalır; kullanıcı Kapat'a basana kadar seçim döngüsü sürer.
    return;
  }
  closeModal('pickerModal');
  _pickerTarget = null;
}

/* ============================================================
   Evrak / Resim yönetimi (HTML demo - localStorage)
   - Veritabanı / Supabase bağlantısı yok
   - Onay öncesi önizleme
   - Gereksiz dosya silme
   - Yükleme esnasında dosya bazlı progressbar
   ============================================================ */
const EKLER_STORE_KEY = 'tcr3web_demo_ekler_v2';
let _eklerPendingCounter = 0;
let _eklerPending = {};

function readEklerStore() {
  try { return JSON.parse(localStorage.getItem(EKLER_STORE_KEY) || '{}'); }
  catch(e) { return {}; }
}
function writeEklerStore(store) { localStorage.setItem(EKLER_STORE_KEY, JSON.stringify(store || {})); }
function eklerKey(entityType, entityId) { return `${entityType}::${entityId}`; }
function eklerDateText(v) { return v ? fmtDate(v) : fmtDate(new Date().toISOString()); }
function eklerResolveListEl(input, entityType, entityId) {
  const byDefault = document.getElementById(`ekl-${entityType}-${entityId}-list`);
  if (byDefault) return byDefault;
  const manager = input && input.closest ? input.closest('.evrak-manager,.ekler-panel') : null;
  if (manager) {
    const list = manager.querySelector('.ekler-list');
    if (list) return list;
  }
  const visibleLists = Array.from(document.querySelectorAll('.modal-backdrop.open .ekler-list, .modal-backdrop.show .ekler-list, .modal-backdrop.active .ekler-list, .modal-backdrop[style*="display: block"] .ekler-list, .ekler-list'));
  return visibleLists.find(x => x.offsetParent !== null) || null;
}
function fmtBytes(n) {
  if (!n) return '0 B';
  if (n < 1024) return n + ' B';
  if (n < 1048576) return Math.round(n / 1024) + ' KB';
  return (n / 1048576).toFixed(1) + ' MB';
}
function eklerFileIcon(type) {
  const t = (type || '').toLowerCase();
  if (t.startsWith('image/')) return '<div class="ek-icon img">IMG</div>';
  if (t.includes('pdf')) return '<div class="ek-icon pdf">PDF</div>';
  if (t.includes('word') || t.includes('doc')) return '<div class="ek-icon doc">DOC</div>';
  if (t.includes('excel') || t.includes('sheet') || t.includes('xls')) return '<div class="ek-icon xls">XLS</div>';
  return '<div class="ek-icon file">DOS</div>';
}
function eklerThumb(f) {
  if ((f.type || f.dosya_tipi || '').startsWith('image/') && (f.url || f.dataUrl)) {
    return `<img src="${f.url || f.dataUrl}" class="ek-thumb" alt="${f.name || f.dosya_adi}">`;
  }
  return eklerFileIcon(f.type || f.dosya_tipi);
}
function eklerDownloadUrl(f) { return f.downloadUrl || f.dataUrl || f.url || ''; }
function eklerSafeName(name) { return String(name || 'evrak').replace(/[<>:\"/\\|?*]+/g, '-').trim() || 'evrak'; }
function eklerReadAsDataUrl(file) {
  return new Promise(resolve => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
function eklerDownloadAction(id, entityType, entityId, listId) {
  const store = readEklerStore();
  const row = (store[eklerKey(entityType, entityId)] || []).find(f => f.id === id);
  if (!row) return toast('Dosya bulunamadı', 'error');
  const href = eklerDownloadUrl(row);
  if (!href) return toast('Bu demo dosyada indirme verisi yok', 'warning');
  const a = document.createElement('a');
  a.href = href;
  a.download = eklerSafeName(row.name);
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast('İndirme hazırlandı', 'success');
}
function eklerRename(id, entityType, entityId, listId) {
  const store = readEklerStore();
  const key = eklerKey(entityType, entityId);
  const rows = store[key] || [];
  const row = rows.find(f => f.id === id);
  if (!row) return;
  const next = prompt('Yeni evrak adı', row.name || '');
  if (next === null) return;
  const clean = next.trim();
  if (!clean) return toast('Evrak adı boş olamaz', 'warning');
  row.name = clean;
  writeEklerStore(store);
  initEkler(entityType, entityId, listId);
  toast('Evrak adı değiştirildi', 'success');
}
function eklerRenamePending(pendingId, fileId) {
  const p = _eklerPending[pendingId];
  if (!p) return;
  const f = p.files.find(x => x.id === fileId);
  if (!f) return;
  const next = prompt('Yeni evrak adı', f.name || '');
  if (next === null) return;
  const clean = next.trim();
  if (!clean) return toast('Evrak adı boş olamaz', 'warning');
  f.name = clean;
  renderPendingEkler(pendingId);
}
function eklerDownloadPending(pendingId, fileId) {
  const p = _eklerPending[pendingId];
  if (!p) return;
  const f = p.files.find(x => x.id === fileId);
  if (!f || !f.url) return toast('Dosya hazır değil', 'warning');
  const a = document.createElement('a');
  a.href = f.url;
  a.download = eklerSafeName(f.name);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function eklerSelectedIds(listId) {
  const root = document.getElementById(listId);
  if (!root) return [];
  return Array.from(root.querySelectorAll('.ek-file-check:checked')).map(x => x.dataset.fileId).filter(Boolean);
}
function eklerUpdateSelection(listId) {
  const count = eklerSelectedIds(listId).length;
  document.querySelectorAll(`[data-ekler-selected-count="${listId}"]`).forEach(el => {
    el.textContent = count ? `${count} evrak seçildi` : 'Seçili evrak yok';
  });
}
function eklerFindRows(entityType, entityId, ids) {
  const store = readEklerStore();
  const rows = store[eklerKey(entityType, entityId)] || [];
  return rows.filter(f => ids.includes(f.id));
}
function eklerDownloadSelected(entityType, entityId, listId) {
  const ids = eklerSelectedIds(listId);
  if (!ids.length) return toast('İndirmek için en az bir evrak seçin', 'warning');
  const rows = eklerFindRows(entityType, entityId, ids);
  rows.forEach((row, i) => {
    const href = eklerDownloadUrl(row);
    if (!href) return;
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = href;
      a.download = eklerSafeName(row.name);
      document.body.appendChild(a);
      a.click();
      a.remove();
    }, i * 180);
  });
  toast(rows.length + ' evrak için indirme hazırlandı', 'success');
}
function eklerWhatsappSelected(entityType, entityId, listId) {
  const ids = eklerSelectedIds(listId);
  if (!ids.length) return toast('WhatsApp göndermek için en az bir evrak seçin', 'warning');
  const rows = eklerFindRows(entityType, entityId, ids);
  const names = rows.map(f => '• ' + (f.name || 'Evrak')).join('%0A');
  const msg = `Tcr3WEB Evrak Paylaşımı%0A${names}%0A%0ANot: HTML demo sürümünde dosyalar yerel önizleme olarak hazırlanır.`;
  window.open('https://wa.me/?text=' + msg, '_blank');
  toast('WhatsApp paylaşım ekranı açıldı', 'success');
}
function eklerPanel(entityType, entityId) {
  const pid = `ekl-${entityType}-${entityId}`;
  const listId = `${pid}-list`;
  return `<div class="ekler-panel instrument-ekler-panel">
    <label class="ekler-zone">
      <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" style="display:none" onchange="eklerUpload(this,'${entityType}','${entityId}')">
      <span class="ekler-zone-icon">${ICONS.download}</span>
      <span class="ekler-zone-text">Dosya Seç / Sürükle</span>
    </label>
    <div class="ekler-list instrument-document-list" id="${listId}"><div class="ekler-empty">Yükleniyor…</div></div>
  </div>`;
}
function renderEklerRows(rows, listId, entityType, entityId) {
  if (!rows.length) return '<div class="ekler-empty">Henüz evrak eklenmemiş.</div>';
  const instrumentMode = /^(ekl-(cek-yeni|senet-yeni)-|ciro-evrak-)/.test(String(listId || ''));
  if (instrumentMode) {
    return rows.map(f => {
      const url = eklerDownloadUrl(f);
      const safeUrl = url || '#';
      return `<div class="instrument-file-row" data-file-id="${f.id}" data-file-name="${(f.name || '').toLowerCase()}">
        <div class="instrument-file-thumb">${eklerThumb(f)}</div>
        <div class="instrument-file-main">
          <div class="instrument-file-name" title="${f.name}">${f.name}</div>
          <div class="instrument-file-meta">${fmtBytes(f.size)} · ${eklerDateText(f.date)}</div>
        </div>
        <div class="instrument-file-actions instrument-file-actions-icons">
          <button type="button" class="btn btn-ghost btn-sm icon-only${url ? '' : ' disabled'}" data-icon-only="true" title="Gör" aria-label="Gör" ${url ? `onclick="openDocumentPreview('${safeUrl.replace(/'/g, "\\'")}','${String(f.name||'Evrak').replace(/'/g, "\\'")}','${String(f.type||'').replace(/'/g, "\\'")}' )"` : 'disabled'}>${ICONS.eye}</button>
          <a href="${safeUrl}" download="${eklerSafeName(f.name)}" class="btn btn-primary btn-sm icon-only${url ? '' : ' disabled'}" data-icon-only="true" title="İndir" aria-label="İndir">${ICONS.download}</a>
          <button type="button" class="btn btn-danger btn-sm icon-only" data-icon-only="true" onclick="eklerDelete('${f.id}','${entityType}','${entityId}','${listId}')" title="Sil" aria-label="Sil">${ICONS.trash}</button>
        </div>
      </div>`;
    }).join('');
  }
  return rows.map(f => `<div class="ek-item instrument-ek-card" data-file-id="${f.id}" data-file-name="${(f.name || '').toLowerCase()}">
    <label class="ek-select instrument-ek-select" title="Seç"><input type="checkbox" class="ek-file-check" data-file-id="${f.id}" onchange="eklerUpdateSelection('${listId}')"><span>Seç</span></label>
    <div class="instrument-ek-preview">${eklerThumb(f)}</div>
    <div class="instrument-ek-info">
      <div class="ek-item-name" title="${f.name}">${f.name}</div>
      <div class="ek-item-meta">${fmtBytes(f.size)} · ${eklerDateText(f.date)}</div>
    </div>
    <div class="ek-item-actions instrument-ek-actions">
      ${(f.type || '').startsWith('image/') && eklerDownloadUrl(f) ? `<a href="${eklerDownloadUrl(f)}" target="_blank" class="icon-btn" title="Önizle">${ICONS.eye}</a>` : ''}
      <button class="icon-btn" onclick="eklerRename('${f.id}','${entityType}','${entityId}','${listId}')" title="İsim değiştir">${ICONS.edit}</button>
      <button class="icon-btn is-danger" onclick="eklerDelete('${f.id}','${entityType}','${entityId}','${listId}')" title="Sil">${ICONS.trash}</button>
    </div>
  </div>`).join('');
}
function initEkler(entityType, entityId, listId) {
  const lid = listId || `ekl-${entityType}-${entityId}-list`;
  const el = document.getElementById(lid);
  if (!el) return;
  const store = readEklerStore();
  const rows = store[eklerKey(entityType, entityId)] || [];
  el.innerHTML = renderEklerRows(rows, lid, entityType, entityId);
}
async function eklerUpload(input, entityType, entityId) {
  const files = Array.from(input.files || []);
  if (!files.length) return Promise.resolve();
  const listEl = eklerResolveListEl(input, entityType, entityId);
  if (!listEl) return Promise.resolve();
  const listId = listEl.id || (`ekl-auto-${Date.now()}`);
  listEl.id = listId;
  const pendingId = 'pend-' + (++_eklerPendingCounter);
  const pendingFiles = await Promise.all(files.map(async (file, index) => {
    const type = file.type || 'application/octet-stream';
    return {
      id: `${pendingId}-${index}`,
      file,
      name: file.name,
      size: file.size,
      type,
      url: URL.createObjectURL(file),
      dataUrl: await eklerReadAsDataUrl(file),
      progress: 0
    };
  }));
  _eklerPending[pendingId] = { entityType, entityId, listId, files: pendingFiles };
  renderPendingEkler(pendingId);
  input.value = '';
  return Promise.resolve();
}
function renderPendingEkler(pendingId) {
  const p = _eklerPending[pendingId];
  if (!p) return;
  const el = document.getElementById(p.listId);
  if (!el) return;
  const existingStore = readEklerStore();
  const existing = existingStore[eklerKey(p.entityType, p.entityId)] || [];
  const instrumentMode = /^(ekl-(cek-yeni|senet-yeni)-|ciro-evrak-)/.test(String(p.listId || ''));

  if (instrumentMode) {
    const pendingHtml = `<div class="instrument-pending-box" id="${pendingId}">
      <div class="instrument-pending-list">
        ${p.files.map(f => `<div class="instrument-file-row is-pending" data-pending-file="${f.id}">
          <div class="instrument-file-thumb">${eklerThumb(f)}</div>
          <div class="instrument-file-main">
            <div class="instrument-file-name" title="${f.name}">${f.name}</div>
            <div class="instrument-file-meta">${fmtBytes(f.size)} · Onay bekliyor</div>
            <div class="ek-progress"><span style="width:${f.progress}%"></span></div>
          </div>
          <div class="instrument-file-actions instrument-file-actions-icons">
            ${f.url ? `<button type="button" class="btn btn-ghost btn-sm icon-only" data-icon-only="true" title="Gör" aria-label="Gör" onclick="openDocumentPreview('${String(f.url).replace(/'/g, "\\'")}','${String(f.name||'Evrak').replace(/'/g, "\\'")}','${String(f.type||'').replace(/'/g, "\\'")}')">${ICONS.eye}</button>` : `<button class="btn btn-ghost btn-sm icon-only" data-icon-only="true" disabled title="Gör" aria-label="Gör">${ICONS.eye}</button>`}
            ${f.url ? `<button class="btn btn-primary btn-sm icon-only" data-icon-only="true" onclick="eklerDownloadPending('${pendingId}','${f.id}')" title="İndir" aria-label="İndir">${ICONS.download}</button>` : `<button class="btn btn-primary btn-sm icon-only" data-icon-only="true" disabled title="İndir" aria-label="İndir">${ICONS.download}</button>`}
            <button type="button" class="btn btn-danger btn-sm icon-only" data-icon-only="true" onclick="eklerRemovePendingFile('${pendingId}','${f.id}')" title="Sil" aria-label="Sil">${ICONS.trash}</button>
          </div>
        </div>`).join('')}
      </div>
      <div class="instrument-pending-footer">
        <button class="btn btn-danger btn-sm" onclick="eklerCancelPending('${pendingId}')">Vazgeç</button>
        <button class="btn btn-success btn-sm" onclick="eklerConfirmPending('${pendingId}')">${ICONS.check} Yüklemeyi Onayla</button>
      </div>
    </div>`;
    el.innerHTML = pendingHtml + (existing.length ? renderEklerRows(existing, p.listId, p.entityType, p.entityId) : '');
    return;
  }

  const pendingHtml = `<div class="ek-pending-box" id="${pendingId}">
    <div class="ek-pending-head">
      <div><b>Yükleme önizlemesi</b><small>Onaylamadan önce gereksiz dosyaları silebilirsiniz.</small></div>
      <div class="ek-pending-actions">
        <button class="btn btn-danger btn-sm" onclick="eklerCancelPending('${pendingId}')">Vazgeç</button>
        <button class="btn btn-primary btn-sm" onclick="eklerConfirmPending('${pendingId}')">${ICONS.check} Yüklemeyi Onayla</button>
      </div>
    </div>
    ${p.files.map(f => `<div class="ek-item ek-pending-item" data-pending-file="${f.id}">
      <label class="ek-select" title="Onay bekliyor"><input type="checkbox" checked disabled></label>
      <div class="ek-item-left">${eklerThumb(f)}<div>
        <div class="ek-item-name" title="${f.name}">${f.name}</div>
        <div class="ek-item-meta">${fmtBytes(f.size)} · Onay bekliyor</div>
        <div class="ek-progress"><span style="width:${f.progress}%"></span></div>
      </div></div>
      <div class="ek-item-actions">
        ${(f.type || '').startsWith('image/') && f.url ? `<a href="${f.url}" target="_blank" class="icon-btn" style="width:28px;height:28px" title="Önizle">${ICONS.eye}</a>` : ''}
        ${f.url ? `<button class="icon-btn" style="width:28px;height:28px" onclick="eklerDownloadPending('${pendingId}','${f.id}')" title="İndir">${ICONS.download}</button>` : ''}
        <button class="icon-btn" style="width:28px;height:28px" onclick="eklerRenamePending('${pendingId}','${f.id}')" title="İsim değiştir">${ICONS.edit}</button>
        <button class="icon-btn" style="width:28px;height:28px;color:var(--c-danger-400)" onclick="eklerRemovePendingFile('${pendingId}','${f.id}')" title="Listeden çıkar">${ICONS.trash}</button>
      </div>
    </div>`).join('')}
  </div>`;
  el.innerHTML = pendingHtml + (existing.length ? renderEklerRows(existing, p.listId, p.entityType, p.entityId) : '');
}
function eklerRemovePendingFile(pendingId, fileId) {
  const p = _eklerPending[pendingId];
  if (!p) return;
  p.files = p.files.filter(f => f.id !== fileId);
  if (!p.files.length) return eklerCancelPending(pendingId);
  renderPendingEkler(pendingId);
}
function eklerCancelPending(pendingId) {
  const p = _eklerPending[pendingId];
  if (!p) return;
  p.files.forEach(f => { if (f.url) URL.revokeObjectURL(f.url); });
  delete _eklerPending[pendingId];
  initEkler(p.entityType, p.entityId, p.listId);
}
function eklerConfirmPending(pendingId) {
  const p = _eklerPending[pendingId];
  if (!p || !p.files.length) return;
  const totalSteps = 18;
  let step = 0;
  const timer = setInterval(() => {
    step++;
    p.files.forEach((f, i) => {
      f.progress = Math.min(100, Math.round((step / totalSteps) * 100 - i * 3));
      if (f.progress < 0) f.progress = 0;
    });
    renderPendingEkler(pendingId);
    if (step >= totalSteps) {
      clearInterval(timer);
      const store = readEklerStore();
      const key = eklerKey(p.entityType, p.entityId);
      const now = new Date().toISOString();
      const newRows = p.files.map(f => ({
        id: 'ek-' + Date.now() + '-' + Math.random().toString(16).slice(2),
        name: f.name,
        size: f.size,
        type: f.type,
        date: now,
        url: f.type && f.type.startsWith('image/') ? (f.dataUrl || f.url || '') : '',
        dataUrl: f.dataUrl || '',
        downloadUrl: f.dataUrl || f.url || '',
        demo: true
      }));
      store[key] = [...newRows, ...(store[key] || [])];
      writeEklerStore(store);
      delete _eklerPending[pendingId];
      initEkler(p.entityType, p.entityId, p.listId);
      toast(newRows.length + ' evrak eklendi', 'success');
    }
  }, 70);
}
function eklerDelete(id, entityType, entityId, listId) {
  if (!confirm('Bu evrak silinsin mi?')) return;
  const store = readEklerStore();
  const key = eklerKey(entityType, entityId);
  store[key] = (store[key] || []).filter(f => f.id !== id);
  writeEklerStore(store);
  initEkler(entityType, entityId, listId);
  toast('Evrak silindi');
}
function filterEvrakList(input, listId) {
  const q = (input.value || '').toLowerCase();
  const root = document.getElementById(listId);
  if (!root) return;
  root.querySelectorAll('.ek-item').forEach(row => {
    const name = (row.dataset.fileName || row.textContent || '').toLowerCase();
    row.style.display = name.includes(q) ? '' : 'none';
  });
}

/* ============================================================
   Form page helpers — editable line items
   ============================================================ */
let _fmlRowCounter = 0;

function getActiveCariFieldForLines() {
  const ids = ['sf-cari-val','af-cari-val','asf-cari-val','tkf-cari-val','vsf-cari-val','df-cari-val','fis-cari-val','cari-id'];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
}

function requireCariBeforeStockSelection() {
  const cariEl = getActiveCariFieldForLines();
  if (!cariEl) return true; // stok/depo gibi cari zorunlu olmayan formlar
  if (!cariEl.value) {
    toast('Önce cari seçiniz', 'warn');
    const wrap = cariEl.closest('.picker-field-wrap');
    if (wrap) {
      wrap.classList.add('picker-field-warning');
      setTimeout(() => wrap.classList.remove('picker-field-warning'), 1300);
      wrap.scrollIntoView({ behavior:'smooth', block:'center' });
    }
    return false;
  }
  return true;
}

function lockActiveCariSelection(lock = true) {
  const cariEl = getActiveCariFieldForLines();
  if (!cariEl) return;
  const wrap = cariEl.closest('.picker-field-wrap');
  if (!wrap) return;
  const btn = wrap.querySelector('.picker-trigger, button');
  const display = wrap.querySelector('.picker-display');
  wrap.classList.toggle('cari-selection-locked', !!lock);
  if (btn) {
    btn.disabled = !!lock;
    btn.title = lock ? 'Kalem eklendiği için cari değiştirilemez' : '';
  }
  if (display) display.title = lock ? 'Kalem eklendiği için cari değiştirilemez' : '';
}

function refreshCariLockByLines(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const hasSelectedProduct = Array.from(tbody.querySelectorAll('.fml-stok-id')).some(el => !!el.value);
  lockActiveCariSelection(hasSelectedProduct);
}



/* ============================================================
   Ticari belge ↔ depo akışı yardımcıları
   ------------------------------------------------------------
   Teklif: depo hareketi oluşturmaz.
   Sipariş: stok kontrol / rezervasyon önerisi gösterir.
   İrsaliye: depo, raf/lot ve çıkış miktarı kesinleşir.
   Fatura: mali belge; stok hareketi irsaliyeden geldiyse tekrar düşmez.
   ============================================================ */
const ROLE_DEPOT_RULES = {
  satis: { primary:'Araç Deposu', fallback:'Merkez Depo', label:'Pazarlamacı Araç Deposu', note:'Araç deposunda olmayan miktar otomatik sipariş/transfer ihtiyacına düşer.' },
  depo: { primary:'Ana Depo', fallback:'Merkez Depo', label:'Depo Kullanıcı Deposu', note:'Kaynak depo yetkiye göre seçilir; eksik miktar diğer depolardan karşılanır.' },
  yonetici: { primary:'Ana Depo', fallback:'Merkez Depo', label:'Yönetici Depo Görünümü', note:'Tüm depolar görüntülenebilir.' }
};
function getRoleDepotRule(){
  return ROLE_DEPOT_RULES[getActiveRole()] || ROLE_DEPOT_RULES.yonetici;
}
function getStockDepotAvailability(stokItem){
  if (!stokItem) return [];
  const code = String(stokItem.kod || stokItem.id || '');
  const base = Number(stokItem.miktar || 0);
  if (code.includes('ST0998') || (stokItem.ad||'').includes('Endüstriyel')) {
    return [
      { depo:'Araç Deposu', miktar:7, roleDepot:true },
      { depo:'Merkez Depo', miktar:3 },
      { depo:'B Deposu', miktar:18 }
    ];
  }
  if (getActiveRole() === 'satis') {
    const vehicle = Math.max(0, Math.min(base, Math.round(base * .35)));
    return [
      { depo:'Araç Deposu', miktar:vehicle, roleDepot:true },
      { depo:stokItem.depo || 'Ana Depo', miktar:Math.max(0, base-vehicle) },
      { depo:'B Deposu', miktar:Math.max(0, Math.round(base * .18)) }
    ];
  }
  return [
    { depo:stokItem.depo || 'Ana Depo', miktar:base },
    { depo:'Merkez Depo', miktar:Math.max(0, Math.round(base * .30)) },
    { depo:'B Deposu', miktar:Math.max(0, Math.round(base * .18)) }
  ].filter((x,i,a)=>x.depo && a.findIndex(y=>y.depo===x.depo)===i);
}
function getStockDepotSplit(stokItem, requestedQty){
  if (!stokItem) return [];
  const qty = Number(requestedQty ?? stokItem.miktar ?? 0);
  const availability = getStockDepotAvailability(stokItem);
  let need = Math.max(0, qty);
  const out = [];
  availability.forEach(d => {
    if (need <= 0) return;
    const take = Math.min(need, Number(d.miktar||0));
    if (take > 0) { out.push({ depo:d.depo, miktar:take, roleDepot:!!d.roleDepot }); need -= take; }
  });
  if (need > 0) out.push({ depo:'Eksik Sipariş', miktar:need, missing:true });
  return out.length ? out : [{ depo: availability[0]?.depo || 'Ana Depo', miktar: 0 }];
}
function getRowRequestedQty(row){
  return Number(row?.querySelector('.fml-miktar')?.value || 0);
}
function getCommercialFlowMode(){
  const p = location.pathname.toLowerCase();
  if (p.includes('teklif')) return 'teklif';
  if (p.includes('satis-form')) return 'irsaliye';
  if (p.includes('alim-form')) return 'fatura';
  if (p.includes('as-form') || p.includes('vs-form')) return 'siparis';
  return 'ticari';
}
function renderStockFlowCell(stokItem, requestedQty, selectedDepot){
  const mode = getCommercialFlowMode();
  if (!stokItem) return '<span class="stock-flow-muted">Ürün seçilmedi</span>';
  if (mode === 'teklif') {
    return `<div class="stock-flow-cell"><span class="stock-flow-badge info">Teklif</span><small>Depo hareketi yok</small></div>`;
  }
  const qty = Number(requestedQty || 0) || 1;
  const splits = selectedDepot ? [{ depo:selectedDepot, miktar:qty }] : getStockDepotSplit(stokItem, qty);
  const total = splits.reduce((a,x)=>a+Number(x.miktar||0),0);
  const depoText = splits.map(x => `${x.depo}: ${fmtNum(x.miktar)} ${stokItem.birim||''}`).join(' · ');
  const missing = splits.some(x=>x.missing);
  const cls = missing ? 'danger' : (splits.length > 1 ? 'warn' : 'ok');
  const label = missing ? 'Eksik Sipariş' : (mode === 'siparis' ? (splits.length > 1 ? 'Depoya bölündü' : 'Kontrol') : mode === 'irsaliye' ? 'Çıkış' : mode === 'fatura' ? 'Mali' : 'Stok');
  const sub = mode === 'fatura' ? 'Stok hareketi irsaliye ile' : depoText;
  return `<div class="stock-flow-cell"><span class="stock-flow-badge ${cls}">${label}: ${fmtNum(total)} ${stokItem.birim||''}</span><small>${sub}</small></div>`;
}
function updateStockFlowCell(row, stokItem){
  const cell = row?.querySelector('.fml-stock-flow');
  if (!cell) return;
  const selectedDepot = row?.dataset?.depo || '';
  const qty = getRowRequestedQty(row);
  if (stokItem && row?.dataset?.depoSplit === '1') {
    const unit = stokItem.birim || '';
    const isMissing = row.dataset.depoMissing === '1';
    cell.innerHTML = `<div class="stock-flow-cell stock-flow-split-summary">
      <span class="stock-flow-badge ok">Kontrol: ${fmtNum(qty)} ${unit}</span>
      ${isMissing ? `<span class="stock-flow-badge danger">Eksik Sipariş: ${fmtNum(qty)} ${unit}</span>` : `<small>${selectedDepot}: ${fmtNum(qty)} ${unit}</small>`}
      <small class="stock-flow-split-note">Depoya bölündü</small>
    </div>`;
    refreshLineActionButtons(row, row.closest('tbody')?.id || '');
    return;
  }
  cell.innerHTML = renderStockFlowCell(stokItem, qty, selectedDepot);
  refreshLineActionButtons(row, row.closest('tbody')?.id || '');
}

function refreshLineActionButtons(row, tbodyId){
  if (!row) return;
  const stack = row.querySelector('.fml-action-stack');
  if (!stack) return;
  let btn = stack.querySelector('.fml-purchase-order-btn');
  const shouldShow = row.dataset.depoMissing === '1';
  if (shouldShow && !btn) {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-danger btn-xs fml-purchase-order-btn';
    btn.title = 'Eksik kalan ürün miktarı için satınalma talebi oluşturur. Talep, Satınalma modülündeki Talep Listesine eklenir; yetkili onayından sonra mal alım siparişine dönüştürülebilir.';
    btn.setAttribute('aria-label', 'Satınalma talebi oluştur');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 2-1.6L21 7H6"/><path d="M14 10h4"/><path d="M16 8v4"/></svg><span class="visually-hidden">Talep</span>`;
    btn.onclick = function(){ createPurchaseOrderFromMissingLine(row.id, tbodyId); };
    const del = stack.querySelector('.fml-delete-btn');
    stack.insertBefore(btn, del || null);
  } else if (!shouldShow && btn) {
    btn.remove();
  }
}

function createPurchaseOrderFromMissingLine(rowId, tbodyId){
  const row = document.getElementById(rowId);
  const stokItem = getLineStockItem(rowId);
  if (!row || !stokItem || row.dataset.depoMissing !== '1') {
    toast('Mal alım siparişi oluşturulacak eksik kalem bulunamadı', 'warn');
    return;
  }
  const qty = getRowRequestedQty(row);
  row.dataset.purchaseOrderCreated = '1';
  const btn = row.querySelector('.fml-purchase-order-btn');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('is-created');
    btn.title = 'Bu eksik kalem için satınalma talebi oluşturuldu.';
    btn.innerHTML = `${ICONS.check || ICONS.plus || ''}<span class="visually-hidden">Talep oluşturuldu</span>`;
  }
  toast(`${stokItem.ad || stokItem.kod} için ${fmtNum(qty)} ${stokItem.birim || ''} mal alım siparişi oluşturuldu`, 'success');
}
function renderDepotFlowPanel(kind='siparis'){
  const map = {
    teklif: {title:'Teklif Depo Mantığı', icon:'tag', note:'Teklif aşamasında depo seçilmez. Sadece ürün, fiyat ve teklif şartları hazırlanır.', steps:['Stok hareketi oluşmaz','Rezervasyon yapılmaz','Siparişe dönünce stok kontrolü başlar']},
    siparis: {title:'Sipariş Depo Akışı', icon:'inbox', note:'Sipariş kaydında stok düşmez; ürünlerin hangi depolardan karşılanabileceği gösterilir.', steps:['Stok kontrol / rezervasyon','Toplama listesi oluştur','Gerekirse depo virman önerisi']},
    irsaliye: {title:'İrsaliye Depo Akışı', icon:'send', note:'İrsaliyede depo kesinleşir ve stok çıkışı burada oluşur.', steps:['Depo / raf / lot kesinleşir','Aynı ürün farklı depolardan ayrı satır olabilir','Faturada tekrar stok düşmez']},
    fatura: {title:'Fatura Depo Akışı', icon:'file-text', note:'Fatura mali belgedir. İrsaliyeden geliyorsa stok hareketi tekrar oluşturulmaz.', steps:['Cari, fiyat, KDV ve toplam kesinleşir','Depo bilgisi referans olarak kalır','Muhasebe kaydı oluşur']}
  };
  const x = map[kind] || map.siparis;
  return `<div class="card depot-flow-card">
    <div class="card-head"><div class="card-title">${ICONS[x.icon]||''} ${x.title}</div></div>
    <div class="card-body">
      <p>${x.note}</p>
      <ul>${x.steps.map(s=>`<li>${s}</li>`).join('')}</ul>
      ${kind === 'siparis' ? renderSalesDepotOrderPanel() : ''}
    </div>
  </div>`;
}
function renderSalesDepotOrderPanel(){
  const rule = getRoleDepotRule();
  if (!['satis','yonetici','depo'].includes(getActiveRole())) return '';
  return `<div class="sales-depot-panel">
    <div><strong>${rule.label}</strong><small>${rule.note}</small></div>
    <div class="sales-depot-row"><span>Kullanılacak Depo</span><b>${rule.primary}</b></div>
    <div class="sales-depot-row"><span>Eksik tamamlanacak</span><b>${rule.fallback}</b></div>
    <div class="sales-depot-actions">
      <button class="btn btn-ghost btn-sm" onclick="splitAllLinesByDepot(document.querySelector('.form-line-table tbody')?.id||'')">Depoya göre böl</button>
      <button class="btn btn-primary btn-sm" onclick="createMissingOrderFromVehicleDepot(document.querySelector('.form-line-table tbody')?.id||'')">Eksik için sipariş</button>
    </div>
  </div>`;
}

function openLineStockPicker(rowId, tbodyId) {
  if (!requireCariBeforeStockSelection()) return;
  openPickerFor('stok', rowId + '-name', rowId + '-stokid', function(id, ad){
    fmlStokSecById(id, rowId, tbodyId);
  });
}

function syncSplitCommercialFields(row, tbodyId, sourceField) {
  if (!row) return;

  // Depoya bölünen aynı ürün kalemlerinde yalnızca birim fiyat ortak tutulur.
  // İskonto tutarı ve iskonto türü her depo satırında bağımsız değiştirilebilir.
  if (sourceField !== 'price') {
    calcFormTotals(tbodyId);
    return;
  }

  const group = row.dataset.splitGroup || '';
  if (!group) { calcFormTotals(tbodyId); return; }
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const source = row.querySelector('.fml-fiyat');
  if (!source) { calcFormTotals(tbodyId); return; }

  tbody.querySelectorAll('tr[data-split-group="' + group + '"]').forEach(function(linkedRow){
    if (linkedRow === row) return;
    const target = linkedRow.querySelector('.fml-fiyat');
    if (target) target.value = source.value;
  });
  calcFormTotals(tbodyId);
}

function addFormLine(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const rowId = 'fml-row-' + (++_fmlRowCounter);
  const first = MOCK.stok[0] || {};
  const tr = document.createElement('tr');
  tr.id = rowId;
  tr.className = 'fml-row';
  tr.innerHTML = `
    <td class="fml-col-check"><input type="checkbox" class="fml-copy-check" title="Kopyalamak için seç"></td>
    <td class="fml-col-product">
      <div class="fml-product-cell">
        <div class="fml-product-wrap">
          <span class="picker-display fml-stok-name" id="${rowId}-name">Seçiniz...</span>
          <input type="hidden" class="fml-stok-id" id="${rowId}-stokid">
          <button type="button" class="btn btn-ghost btn-sm fml-icon-btn" onclick="openLineStockPicker('${rowId}','${tbodyId}')">${ICONS.search}</button>
        </div>
        <div class="fml-stock-flow">${renderStockFlowCell(null)}</div><div class="fml-depot-actions"><button type="button" class="mini-link" onclick="splitLineByDepot('${rowId}','${tbodyId}')">Depoya göre böl</button></div>
      </div>
    </td>
    <td class="num fml-col-qty-unit">
      <div class="fml-two-line-field fml-qty-unit-wrap">
        <input class="form-input fml-miktar" type="number" value="1" min="0" aria-label="Miktar" oninput="calcFormTotals('${tbodyId}');updateStockFlowCell(this.closest('tr'), getLineStockItem(this.closest('tr')?.id))">
        <input class="form-input fml-birim" value="${first.birim||'adet'}" readonly aria-label="Birim">
      </div>
    </td>
    <td class="num fml-col-price">
      <div class="fml-two-line-field fml-price-wrap">
        <input class="form-input fml-fiyat" type="number" value="0" step="0.01" aria-label="Birim fiyat" oninput="syncSplitCommercialFields(this.closest('tr'),'${tbodyId}','price')">
        <button type="button" class="btn btn-outline-primary btn-sm fml-sub-action fml-price-action" title="Ürünün alış, satış, bayi ve özel fiyatlarını görüntüle ve seç" onclick="openLinePricePicker('${rowId}','${tbodyId}')">${ICONS.tag}<span>Fiyatlar</span></button>
      </div>
    </td>
    <td class="num fml-col-disc"><div class="fml-two-line-field fml-discount-wrap"><input class="form-input fml-iskonto" type="number" value="0" min="0" step="0.01" aria-label="Satır iskontosu" oninput="calcFormTotals('${tbodyId}')"><select class="form-input fml-iskonto-tip" aria-label="İskonto türü" onchange="calcFormTotals('${tbodyId}')"><option value="tl" selected>İskonto TL</option><option value="percent">İskonto %</option></select></div></td>
    <td class="fml-col-vat"><select class="form-input fml-kdv" onchange="calcFormTotals('${tbodyId}')"><option value="1">1</option><option value="10">10</option><option value="20" selected>20</option></select></td>
    <td class="num strong fml-total">0,00</td>
    <td class="num fml-actions"><div class="fml-action-stack"><button type="button" class="btn btn-outline-info btn-xs fml-depot-status-btn" onclick="openLineDepotStatus('${rowId}','${tbodyId}')" title="Ürünün tüm depolardaki mevcut, ayrılmış ve kullanılabilir stok miktarlarını görüntüle" aria-label="Depo durumunu görüntüle">${ICONS.inbox || ICONS.box || ''}<span class="visually-hidden">Depo</span></button><button class="icon-btn fml-delete-btn" onclick="deleteFormLine(this,'${tbodyId}')" title="Kaldır">${ICONS.trash}</button></div></td>
  `;
  tbody.appendChild(tr);
  refreshLineActionButtons(tr, tbodyId);
  calcFormTotals(tbodyId);
  return rowId;
}



function ensureLineDepotStatusModal(){
  let modal = document.getElementById('lineDepotStatusModal');
  if (modal) return modal;
  const wrap = document.createElement('div');
  wrap.innerHTML = modalHtml('lineDepotStatusModal', 'Ürün Depo Durumu', `
    <div id="lineDepotStatusBody" class="line-depot-status-body"></div>
  `, `<button class="btn btn-ghost" onclick="closeModal('lineDepotStatusModal')">Kapat</button>`, 'lg');
  modal = wrap.firstElementChild;
  document.body.appendChild(modal);
  return modal;
}

function openLineDepotStatus(rowId, tbodyId){
  const row = document.getElementById(rowId);
  const stokItem = getLineStockItem(rowId);
  if (!row || !stokItem) { toast('Depo durumunu görmek için önce ürün seçiniz', 'warn'); return; }
  ensureLineDepotStatusModal();
  const requested = getRowRequestedQty(row) || 1;
  const depots = getStockDepotAvailability(stokItem);
  const totalStock = depots.reduce((sum, d) => sum + Number(d.miktar || 0), 0);
  const missing = Math.max(0, requested - totalStock);
  const selectedDepot = row.dataset.depo || '';
  const body = document.getElementById('lineDepotStatusBody');
  if (!body) return;
  body.innerHTML = `
    <div class="line-depot-product-head">
      <div><small>Stok Kodu</small><b>${stokItem.kod || stokItem.id || '-'}</b></div>
      <div class="line-depot-product-main"><small>Ürün</small><strong>${stokItem.ad || '-'}</strong></div>
      <div><small>İstenen</small><b>${fmtNum(requested)} ${stokItem.birim || ''}</b></div>
    </div>
    <div class="line-depot-summary-grid">
      <div class="line-depot-summary available"><span>Toplam Depo Stoku</span><b>${fmtNum(totalStock)} ${stokItem.birim || ''}</b></div>
      <div class="line-depot-summary reserved"><span>Karşılanabilir</span><b>${fmtNum(Math.min(requested,totalStock))} ${stokItem.birim || ''}</b></div>
      <div class="line-depot-summary ${missing > 0 ? 'missing' : 'complete'}"><span>${missing > 0 ? 'Eksik Sipariş' : 'Durum'}</span><b>${missing > 0 ? fmtNum(missing) + ' ' + (stokItem.birim || '') : 'Tam Karşılanır'}</b></div>
    </div>
    <div class="line-depot-table-wrap">
      <table class="data line-depot-table">
        <thead><tr><th>Depo</th><th class="num">Mevcut</th><th class="num">Karşılanacak</th><th>Durum</th></tr></thead>
        <tbody>${depots.map(d => {
          const take = Math.min(Number(d.miktar||0), requested);
          const active = selectedDepot && selectedDepot === d.depo;
          return `<tr class="${active ? 'is-selected-depot' : ''}"><td><b>${d.depo}</b>${d.roleDepot ? '<small class="block text-mute">Yetkili depo</small>' : ''}</td><td class="num">${fmtNum(d.miktar)} ${stokItem.birim||''}</td><td class="num">${fmtNum(take)} ${stokItem.birim||''}</td><td><span class="badge ${Number(d.miktar||0)>0?'badge-success':'badge-danger'}">${Number(d.miktar||0)>0?'Stok Var':'Stok Yok'}</span></td></tr>`;
        }).join('')}${missing > 0 ? `<tr class="line-depot-missing-row"><td><b>Eksik Sipariş</b></td><td class="num">-</td><td class="num strong">${fmtNum(missing)} ${stokItem.birim||''}</td><td><span class="badge badge-danger">Tedarik Gerekli</span></td></tr>` : ''}</tbody>
      </table>
    </div>
    <div class="line-depot-modal-actions">
      <button class="btn btn-outline-info" onclick="splitLineByDepot('${rowId}','${tbodyId}');closeModal('lineDepotStatusModal')">${ICONS.inbox || ''} Depoya Göre Böl</button>
      ${missing > 0 ? `<button class="btn btn-danger" onclick="toast('${fmtNum(missing)} ${stokItem.birim||''} için satınalma/tedarik talebi oluşturuldu','success');closeModal('lineDepotStatusModal')">${ICONS.plus || ''} Eksik İçin Sipariş</button>` : ''}
    </div>`;
  openModal('lineDepotStatusModal');
}

function splitLineByDepot(rowId, tbodyId) {
  const row = document.getElementById(rowId);
  const stokItem = getLineStockItem(rowId);
  if (!row || !stokItem) { toast('Önce ürün seçiniz', 'warn'); return; }
  if (row.dataset.depoSplit === '1' || row.dataset.depo) {
    toast('Bu kalem daha önce depoya bölünmüş. Tekrar bölünemez.', 'warn');
    return;
  }
  const requested = getRowRequestedQty(row);
  const splits = getStockDepotSplit(stokItem, requested);
  if (splits.length <= 1) { updateStockFlowCell(row, stokItem); toast('Bu ürün için tek depo yeterli', 'info'); return; }
  const baseData = getFormLineData(row) || {};
  const splitGroup = row.dataset.splitGroup || ('split-' + Date.now() + '-' + Math.random().toString(36).slice(2,8));
  splits.forEach((sp, i) => {
    let targetRow = row;
    let targetRowId = rowId;
    if (i > 0) {
      targetRowId = addFormLine(tbodyId);
      targetRow = document.getElementById(targetRowId);
      applyFormLineData(targetRowId, tbodyId, baseData);
    }
    targetRow.dataset.depo = sp.depo;
    targetRow.dataset.splitGroup = splitGroup;
    targetRow.dataset.depoSplit = '1';
    targetRow.dataset.depoMissing = sp.missing ? '1' : '0';
    targetRow.dataset.depoNeedOrder = (getActiveRole() === 'satis' && sp.depo !== getRoleDepotRule().primary) ? '1' : '0';
    const qtyEl = targetRow.querySelector('.fml-miktar');
    if (qtyEl) qtyEl.value = sp.miktar;
    updateStockFlowCell(targetRow, stokItem);
    targetRow.classList.toggle('fml-missing-depot', !!sp.missing);
    targetRow.classList.toggle('fml-need-order', targetRow.dataset.depoNeedOrder === '1');
    refreshLineActionButtons(targetRow, tbodyId);
    const splitBtn = targetRow.querySelector('.fml-depot-actions .mini-link');
    if (splitBtn) {
      splitBtn.disabled = true;
      splitBtn.classList.add('is-disabled');
      splitBtn.textContent = 'Depoya bölündü';
      splitBtn.title = 'Bu kalem tekrar depoya bölünemez';
      const splitActions = splitBtn.closest('.fml-depot-actions');
      if (splitActions) splitActions.hidden = true;
    }
  });
  calcFormTotals(tbodyId);
  toast(splits.length + ' depo kaydı oluşturuldu', 'success', { silent:true });
}

function splitAllLinesByDepot(tbodyId){
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  Array.from(tbody.querySelectorAll('tr')).forEach(row => splitLineByDepot(row.id, tbodyId));
}

function createMissingOrderFromVehicleDepot(tbodyId){
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const missingRows = Array.from(tbody.querySelectorAll('tr')).filter(r => r.dataset.depoMissing === '1' || r.dataset.depoNeedOrder === '1');
  if (!missingRows.length) { toast('Araç deposu için eksik ürün yok', 'info'); return; }
  toast(missingRows.length + ' satır için araç deposuna ikmal siparişi/transfer önerisi oluşturuldu', 'success');
}

function deleteFormLine(btn, tbodyId) {
  if (!confirm('Bu kalem silinsin mi?')) return;
  const tr = btn.closest('tr');
  if (tr) tr.remove();
  calcFormTotals(tbodyId);
  refreshCariLockByLines(tbodyId);
  toast('Kalem silindi', 'success');
}


const FML_CLIPBOARD_KEY = 'tcr3web_fml_clipboard';

function getFormLineData(row) {
  if (!row) return null;
  const stokId = row.querySelector('.fml-stok-id')?.value || '';
  const stokName = row.querySelector('.fml-stok-name')?.textContent?.trim() || '';
  if (!stokId) return null;
  return {
    stokId,
    stokName,
    miktar: row.querySelector('.fml-miktar')?.value || '1',
    birim: row.querySelector('.fml-birim')?.value || 'adet',
    fiyat: row.querySelector('.fml-fiyat')?.value || '0',
    iskonto: row.querySelector('.fml-iskonto')?.value || '0',
    iskontoTip: row.querySelector('.fml-iskonto-tip')?.value || 'tl',
    kdv: row.querySelector('.fml-kdv')?.value || '20'
  };
}

function applyFormLineData(rowId, tbodyId, data) {
  const row = document.getElementById(rowId);
  if (!row || !data) return;
  const nameEl = document.getElementById(rowId + '-name');
  const hiddenEl = document.getElementById(rowId + '-stokid');
  if (nameEl) nameEl.textContent = data.stokName || data.stokId;
  if (hiddenEl) hiddenEl.value = data.stokId;
  row.classList.add('fml-product-selected');
  const searchBtn = row.querySelector('.fml-product-wrap .fml-icon-btn');
  if (searchBtn) searchBtn.style.display = 'none';
  const set = (sel, val) => { const el = row.querySelector(sel); if (el) el.value = val; };
  set('.fml-miktar', data.miktar || '1');
  set('.fml-birim', data.birim || 'adet');
  set('.fml-fiyat', data.fiyat || '0');
  set('.fml-iskonto', data.iskonto || '0');
  set('.fml-iskonto-tip', data.iskontoTip || 'tl');
  set('.fml-kdv', data.kdv || '20');
  const stokItem = MOCK.stok.find(x => (x.kod || String(x.id)) === data.stokId);
  updateStockFlowCell(row, stokItem);
  lockActiveCariSelection(true);
  calcFormTotals(tbodyId);
}


function toggleAllFormLineChecks(master) {
  const table = master?.closest('table');
  const tbody = table?.querySelector('tbody');
  if (!tbody) return;
  tbody.querySelectorAll('.fml-copy-check').forEach(cb => cb.checked = master.checked);
}

function copySelectedFormLines(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => row.querySelector('.fml-copy-check')?.checked);
  const data = rows.map(getFormLineData).filter(Boolean);
  if (!data.length) {
    toast('Kopyalamak için ürün seçiniz', 'warn');
    return;
  }
  localStorage.setItem(FML_CLIPBOARD_KEY, JSON.stringify(data));
  toast(data.length + ' ürün kopyalandı', 'success', { silent: true });
}

function pasteCopiedFormLines(tbodyId) {
  if (!requireCariBeforeStockSelection()) return;
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  let data = [];
  try { data = JSON.parse(localStorage.getItem(FML_CLIPBOARD_KEY) || '[]'); } catch(e) { data = []; }
  if (!Array.isArray(data) || !data.length) {
    toast('Yapıştırılacak ürün bulunamadı', 'warn');
    return;
  }
  const existing = Array.from(tbody.querySelectorAll('.fml-stok-id')).map(el => el.value).filter(Boolean);
  const dupCount = data.filter(x => existing.includes(x.stokId)).length;
  if (dupCount && !confirm(dupCount + ' ürün bu belgede zaten var. Yine de yapıştırılsın mı?')) return;
  data.forEach(item => {
    const rowId = addFormLine(tbodyId);
    applyFormLineData(rowId, tbodyId, item);
  });
  toast(data.length + ' ürün yapıştırıldı', 'success', { silent: true });
}

function openStockMultiPicker(tbodyId) {
  if (!requireCariBeforeStockSelection()) return;
  openPickerFor('stok', '', '', function(id, ad) {
    addStockFromPickerToLines(tbodyId, id, ad);
  });
  if (_pickerTarget) _pickerTarget.keepOpen = true;
}

function addStockFromPickerToLines(tbodyId, kod, ad) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const exists = Array.from(tbody.querySelectorAll('.fml-stok-id')).some(el => el.value === kod);
  if (exists && !confirm('Bu ürün kalemlerde zaten var. Tekrar eklemek istiyor musunuz?')) {
    return;
  }
  const rowId = addFormLine(tbodyId);
  if (!rowId) return;
  const nameEl = document.getElementById(rowId + '-name');
  const hiddenEl = document.getElementById(rowId + '-stokid');
  if (nameEl) nameEl.textContent = ad || kod;
  if (hiddenEl) hiddenEl.value = kod;
  const miktarEl = document.querySelector(`#${rowId} .fml-miktar`);
  if (miktarEl) miktarEl.value = 1;
  fmlStokSecById(kod, rowId, tbodyId);
  silentHighlight(document.getElementById(rowId));
}

function fmlStokSecById(kod, rowId, tbodyId) {
  const s = MOCK.stok.find(x => (x.kod || String(x.id)) === kod);
  if (!s) return;
  const row = document.getElementById(rowId);
  if (!row) return;
  const fi = row.querySelector('.fml-fiyat');
  const bi = row.querySelector('.fml-birim');
  const nameEl = document.getElementById(rowId + '-name');
  const hiddenEl = document.getElementById(rowId + '-stokid');
  if (nameEl) nameEl.textContent = s.ad || kod;
  if (hiddenEl) hiddenEl.value = kod;
  row.classList.add('fml-product-selected');
  const searchBtn = row.querySelector('.fml-product-wrap .fml-icon-btn');
  if (searchBtn) searchBtn.style.display = 'none';
  const isAlimForm = /alim|as-form/.test(location.pathname);
  if (fi) fi.value = isAlimForm ? (s.alisFiyat || s.fiyat) : getCustomerLastSalePrice(s);
  if (bi) bi.value = s.birim || 'adet';
  updateStockFlowCell(row, s);
  lockActiveCariSelection(true);
  calcFormTotals(tbodyId);
}

function getLineStockItem(rowId) {
  const row = document.getElementById(rowId);
  const stokId = row?.querySelector('.fml-stok-id')?.value || '';
  return MOCK.stok.find(x => (x.kod || String(x.id)) === stokId) || null;
}

function getLinePriceOptions(stokItem) {
  if (!stokItem) return [];
  const last = getCustomerLastSalePrice(stokItem);
  return [
    { key: 'alis', label: 'Alış Fiyatı', value: Number(stokItem.alisFiyat || stokItem.fiyat || 0), note: 'tedarikçi maliyeti', meta: 'Son alış · 14.05.2026' },
    { key: 'musteri', label: 'Müşteri Fiyatı', value: Number(last || stokItem.sonSatisFiyat || stokItem.fiyat || 0), note: 'seçili cariye göre', meta: 'Son satış · 07.07.2026' },
    { key: 'bayi', label: 'Bayi Fiyatı', value: Number((stokItem.fiyat || 0) * 0.94), note: 'liste fiyatı indirimi', meta: 'Fiyat listesi · BAYİ-1' },
    { key: 'ozel', label: 'Özel Fiyat', value: Number((stokItem.fiyat || 0) * 0.88), note: 'manuel özel fiyat', meta: 'Geçerlilik · 31.12.2026' },
  ].map(x => ({ ...x, value: +x.value.toFixed(2) }));
}


function getLinePriceHistory(stokItem) {
  const cariler = MOCK.cari || [];
  const base = Number(stokItem.fiyat || stokItem.sonSatisFiyat || 0);
  return cariler.slice(0, 8).map((c, i) => {
    const seed = String((stokItem.kod || stokItem.id) + c.kod).split('').reduce((a,ch)=>a+ch.charCodeAt(0),0);
    const factor = 0.86 + ((seed % 28) / 100);
    return {
      cari: c.ad,
      tarih: `2026-0${(i%6)+1}-${String(10+i).padStart(2,'0')}`,
      fiyat: +(base * factor).toFixed(2)
    };
  }).sort((a,b)=>a.fiyat-b.fiyat);
}

function renderPriceCenterProduct(stokItem) {
  return `<div class="price-center-product">
    <div class="price-center-product-main">
      <div class="price-center-product-icon">${(stokItem.ad || 'S').trim().charAt(0).toUpperCase()}</div>
      <div>
        <div class="price-picker-name">${stokItem.ad || '-'}</div>
        <div class="price-picker-meta">${stokItem.kod || '-'} · Depo: ${stokItem.depo || '-'}</div>
      </div>
    </div>
    <div class="price-center-stock">
      <small>Mevcut Stok</small>
      <strong>${fmtNum(stokItem.miktar)} ${stokItem.birim || ''}</strong>
    </div>
  </div>`;
}

function renderPriceHistory(stokItem) {
  const hist = getLinePriceHistory(stokItem);
  if (!hist.length) return '';
  const low = hist[0];
  const high = hist[hist.length - 1];
  return `<div class="price-history-grid">
    <div class="price-history-card low">
      <div class="price-history-top"><span>↓</span><small>En Düşük Fiyat</small></div>
      <strong>${fmtMoney(low.fiyat)}</strong>
      <span>${low.cari}</span>
      <em>${low.tarih}</em>
    </div>
    <div class="price-history-card high">
      <div class="price-history-top"><span>↑</span><small>En Yüksek Fiyat</small></div>
      <strong>${fmtMoney(high.fiyat)}</strong>
      <span>${high.cari}</span>
      <em>${high.tarih}</em>
    </div>
  </div>`;
}

let _activePricePicker = null;
function openLinePricePicker(rowId, tbodyId) {
  const row = document.getElementById(rowId);
  if (!row) return;
  const stokItem = getLineStockItem(rowId);
  if (!stokItem) {
    toast('Önce ürün seçiniz', 'warn');
    return;
  }
  _activePricePicker = { rowId, tbodyId };
  const title = document.getElementById('price-picker-title');
  const body = document.getElementById('price-picker-body');
  const footCurrent = document.getElementById('price-current-foot');
  if (title) title.textContent = 'Fiyat Seç · ' + (stokItem.ad || stokItem.kod);
  if (body) {
    const current = Number(row.querySelector('.fml-fiyat')?.value || 0);
    if (footCurrent) footCurrent.innerHTML = `<span>Mevcut Fiyat</span><b>${fmtMoney(current)}</b>`;
    body.innerHTML = `
      ${renderPriceCenterProduct(stokItem)}
      ${renderPriceHistory(stokItem)}
      <div class="price-center-section-title">Fiyat Seçenekleri</div>
      <div class="price-option-grid">
        ${getLinePriceOptions(stokItem).map(o => `
          <button type="button" class="price-option ${Math.abs(current-o.value)<0.001?'active':''} price-kind-${o.key}" onclick="selectLinePrice(${o.value})">
            <span class="price-option-icon">₺</span>
            <span class="price-option-text">
              <strong>${o.label}</strong>
              <small>${o.note}</small>
              <small class="price-option-meta">${o.meta || ''}</small>
            </span>
            <b>${fmtMoney(o.value)}</b>
          </button>
        `).join('')}
      </div>`;
  }
  openModal('pricePickerModal');
}

function selectLinePrice(value) {
  if (!_activePricePicker) return;
  const row = document.getElementById(_activePricePicker.rowId);
  const input = row?.querySelector('.fml-fiyat');
  if (input) input.value = Number(value || 0).toFixed(2);
  syncSplitCommercialFields(row, _activePricePicker.tbodyId, 'price');
  closePricePicker();
}

function closePricePicker() {
  closeModal('pricePickerModal');
  _activePricePicker = null;
}

function calcFormTotals(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  // Ürün fiyatları KDV DAHİL kabul edilir.
  // Genel Toplam = KDV dahil net tutar
  // KDV = KDV dahil net tutarın içinden ayrıştırılan KDV payı
  let ara = 0, satirIskontoT = 0, kdvT = 0;

  tbody.querySelectorAll('tr').forEach(row => {
    const miktar = parseFloat(row.querySelector('.fml-miktar')?.value || 0);
    const fiyat  = parseFloat(row.querySelector('.fml-fiyat')?.value  || 0);
    const iskVal = parseFloat(row.querySelector('.fml-iskonto')?.value || 0);
    const iskTip = row.querySelector('.fml-iskonto-tip')?.value || 'tl';
    const kdvOran = parseFloat(row.querySelector('.fml-kdv')?.value || 20) / 100;

    const brutKdvDahil = miktar * fiyat;
    const satirIskonto = Math.min(brutKdvDahil, iskTip === 'tl' ? iskVal : (brutKdvDahil * iskVal / 100));
    const netKdvDahil = Math.max(0, brutKdvDahil - satirIskonto);
    const satirKdv = kdvOran > 0 ? (netKdvDahil - (netKdvDahil / (1 + kdvOran))) : 0;

    ara += brutKdvDahil;
    satirIskontoT += satirIskonto;
    kdvT += satirKdv;

    const td = row.querySelector('.fml-total');
    if (td) td.textContent = fmtMoney(netKdvDahil, false);
  });

  const araSonrasi = Math.max(0, ara - satirIskontoT);
  const genelIskontoVal = parseFloat(document.getElementById('genel-iskonto')?.value || 0);
  const genelIskontoTip = document.getElementById('genel-iskonto-tip')?.value || 'tl';
  const genelIskontoT = Math.min(araSonrasi, genelIskontoTip === 'tl' ? genelIskontoVal : (araSonrasi * genelIskontoVal / 100));
  const genel = Math.max(0, araSonrasi - genelIskontoT);

  // Genel iskonto KDV dahil toplamdan düşüldüğü için KDV payını da aynı oranda azalt.
  if (araSonrasi > 0 && genelIskontoT > 0) {
    kdvT = kdvT * (genel / araSonrasi);
  }

  const toplamIskonto = satirIskontoT + genelIskontoT;
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = fmtMoney(v); };
  set(tbodyId + '-ara',  ara);
  set(tbodyId + '-iskonto',  toplamIskonto);
  set(tbodyId + '-kdv',  kdvT);
  set(tbodyId + '-genel', genel);
  set('sum-ara',   ara);
  set('sum-satir-iskonto', satirIskontoT);
  set('sum-genel-iskonto', genelIskontoT);
  set('sum-kdv',   kdvT);
  set('sum-genel', genel);
}

/* ============================================================
   Tcr3WEB Selection Field Standard
   Seçim alanlarında sadece mercek değil, alanın kendisi de seçim modalını açar.
   ============================================================ */
document.addEventListener('click', function(e){
  const display = e.target.closest && e.target.closest('.picker-display');
  if (!display) return;

  // Kalemlerde ürün daha önce seçildiyse ürün adı ve birim kilitlidir, tekrar seçim açılmaz.
  const lineRow = display.closest('.fml-row');
  if (lineRow && lineRow.classList.contains('fml-product-selected')) return;

  const wrap = display.closest('.picker-field-wrap, .fml-product-wrap');
  if (!wrap || wrap.classList.contains('cari-selection-locked')) return;

  const btn = wrap.querySelector('.picker-trigger, .fml-icon-btn, button');
  if (btn && !btn.disabled && btn.style.display !== 'none') {
    e.preventDefault();
    e.stopPropagation();
    btn.click();
  }
}, true);



// 794: Tablet ve mobilde sidebar artık dar ikon şeridi değil, overlay menüdür.
document.addEventListener('click', function(e){
  const app = document.getElementById('app');
  if (!app || !app.classList.contains('mobile-open')) return;
  if (!window.matchMedia('(max-width: 1180px)').matches) return;
  const inSidebar = e.target.closest && e.target.closest('.sidebar');
  const isMenuButton = e.target.closest && e.target.closest('.topbar > .icon-btn:first-child');
  if (!inSidebar && !isMenuButton) closeMobileSidebar();
}, false);

window.addEventListener('resize', function(){
  const app = document.getElementById('app');
  if (!app) return;
  if (!window.matchMedia('(max-width: 1180px)').matches) {
    app.classList.remove('mobile-open');
    document.body.classList.remove('sidebar-open-lock');
  }
});


/* ============================================================
   749 - Tcr3WEB Modül Bazlı Kayıt Erişim / Kilit Standardı
   ============================================================ */
const TCR3_LOCK_DEFAULTS = {
  'dashboard':5,'cari':5,'cari-islemler':5,'cari-fisleri':5,'stok':5,'stok-islemler':5,
  'satis':5,'satis-form':5,'alim':5,'alim-form':5,'teklif':7,'teklif-form':7,
  'as':7,'as-form':7,'vs':7,'vs-form':7,'kasa':3,'banka':3,'cek':10,'senet':10,
  'depo-islemler':5,'depo-akis':5,'servis':30,'servis-talep':30,'servis-havuzu':30,'servis-usta':30,
  'sanal-pos':3,'uretim':7,'personel':30,'avans':5,'maas':30,'vade':5,'raporlar':30
};
function getLockPolicies(){
  try { return Object.assign({}, TCR3_LOCK_DEFAULTS, JSON.parse(localStorage.getItem('tcr3_lock_policies')||'{}')); }
  catch(e){ return Object.assign({}, TCR3_LOCK_DEFAULTS); }
}
function getCurrentModuleKey(){
  const file=(location.pathname.split('/').pop()||'dashboard.html').replace('.html','');
  return file || 'dashboard';
}
function parseTrDate(text){
  if(!text) return null;
  const s=String(text).trim();
  let m=s.match(/\b(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})\b/);
  if(m) return new Date(Number(m[3]),Number(m[2])-1,Number(m[1]));
  m=s.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if(m) return new Date(Number(m[1]),Number(m[2])-1,Number(m[3]));
  return null;
}
function daysBetweenToday(d){
  const a=new Date(); a.setHours(0,0,0,0); const b=new Date(d); b.setHours(0,0,0,0);
  return Math.floor((a-b)/86400000);
}
function findRowDate(row){
  const cells=[...row.cells];
  for(const c of cells){ const d=parseTrDate(c.textContent); if(d) return d; }
  return null;
}
function lockedActionText(btn){
  return [btn.textContent,btn.title,btn.getAttribute('aria-label'),btn.dataset.action,btn.name,btn.id]
    .filter(Boolean).join(' ').toLocaleLowerCase('tr-TR');
}
function isRestrictedLockedAction(btn){
  const t=lockedActionText(btn);
  return /düzenle|duzenle|edit|iptal|cancel/.test(t);
}
function ensureLockTooltip(){
  let t=document.getElementById('recordLockTooltip');
  if(!t){ t=document.createElement('div'); t.id='recordLockTooltip'; t.className='record-lock-tooltip'; document.body.appendChild(t); }
  return t;
}
function bindStateDot(dot){
  if(dot.dataset.bound) return; dot.dataset.bound='1';
  const tip=ensureLockTooltip();
  dot.addEventListener('mouseenter',()=>{
    tip.innerHTML=dot.dataset.tip||''; const r=dot.getBoundingClientRect();
    tip.style.left=Math.min(window.innerWidth-295,Math.max(12,r.left-8))+'px';
    tip.style.top=Math.min(window.innerHeight-120,r.bottom+10)+'px'; tip.classList.add('show');
  });
  dot.addEventListener('mouseleave',()=>tip.classList.remove('show'));
}
function applyRecordLockStandard(){
  const moduleKey=getCurrentModuleKey(); const policies=getLockPolicies(); const days=Number(policies[moduleKey]??5);
  document.querySelectorAll('table.data').forEach(table=>{
    if(
      table.dataset.recordLockApplied ||
      table.closest('#tab-kilit') ||
      table.dataset.noRecordLock === 'true' ||
      table.id === 'ekstreTable' ||
      table.closest('.modal') ||
      table.classList.contains('hareket-urun-table') ||
      table.classList.contains('stok-detail-line-table')
    ) return;
    const scope = table.closest('.card, .modal, section, main') || table.parentElement;
    const sectionTitle = scope?.querySelector('.card-title, .fis-section-title, .text-soft, h2, h3, h4')?.textContent || '';
    const isLineItemsTable = table.classList.contains('form-line-table') || /kalemler|kalemleri|ürün kalemleri|sipariş kalemleri|teklif kalemleri|fatura kalemleri|cari hesap kalemleri/i.test(sectionTitle.trim());
    if(isLineItemsTable){
      table.querySelectorAll('.record-state-head,.record-state-cell').forEach(el=>el.remove());
      return;
    }
    const headRow=table.tHead?.rows?.[0]; if(!headRow) return;
    const th=document.createElement('th'); th.className='record-state-head'; th.textContent='Durum'; headRow.insertBefore(th,headRow.firstElementChild);
    [...(table.tBodies[0]?.rows||[])].forEach(row=>{
      const date=findRowDate(row); const age=date?daysBetweenToday(date):0; const locked=days>0 && date && age>=days;
      const td=document.createElement('td'); td.className='record-state-cell';
      const dot=document.createElement('span'); dot.className='record-state-dot '+(locked?'is-locked':'is-open');
      const dateText=date?date.toLocaleDateString('tr-TR'):'Tarih bilgisi bulunamadı';
      dot.dataset.tip=locked
        ? `<strong style="color:#dc2626">Kilitli Kayıt</strong><br>İşlem süresi doldu.<br>İşlem tarihi: ${dateText}<br>Kilit süresi: ${days} gün<br>Geçen süre: ${age} gün`
        : `<strong style="color:#16a34a">İşlem Yapılabilir</strong><br>İşlem tarihi: ${dateText}<br>Kilit süresi: ${days} gün${date?`<br>Kalan süre: ${Math.max(0,days-age)} gün`:''}`;
      dot.setAttribute('aria-label',locked?'Kilitli kayıt':'İşlem yapılabilir'); td.appendChild(dot); row.insertBefore(td,row.firstElementChild); bindStateDot(dot);
      if(locked){
        row.classList.add('is-record-locked');
        row.querySelectorAll('button,a.btn').forEach(btn=>{
          if(isRestrictedLockedAction(btn)){
            btn.classList.add('record-action-blocked');
            btn.setAttribute('aria-disabled','true');
            btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();toast('Günü geçmiş kayıtlarda düzenleme ve iptal işlemleri kapalıdır.','error')},true);
          }
        });
      }
    });
    table.dataset.recordLockApplied='1';
  });
}
const tcr3LockObserver=new MutationObserver(()=>requestAnimationFrame(applyRecordLockStandard));
document.addEventListener('DOMContentLoaded',()=>{tcr3LockObserver.observe(document.body,{childList:true,subtree:true});setTimeout(applyRecordLockStandard,80)});
window.applyRecordLockStandard=applyRecordLockStandard;

/* 743 - MASTER panel/KPI semantik renk standardı */
(function(){
  const palette=['cyan','blue','purple','teal','orange','indigo','green','amber'];
  const semanticRules=[
    ['red',/(iptal|risk|kritik|acil|hata|gecik|geçik|borç|odeme|ödeme|çıkış|iade|eksik|düşük|kilit)/i],
    ['green',/(tamam|onay|aktif|tahsilat|giriş|başar|müşteri|satış|kasa|ödenen|mevcut)/i],
    ['orange',/(bekle|uyarı|vade|senet|servis|randevu|sayım|alış|parça)/i],
    ['purple',/(stok|ürün|üretim|kopya|personel|maaş|bordro)/i],
    ['cyan',/(depo|banka|pos|ödeme linki|akış|sevkiyat|virman)/i],
    ['teal',/(teklif|rapor|analiz|özet|performans)/i],
    ['indigo',/(sipariş|iş emri|plan|takvim|proje)/i],
    ['blue',/(çek|cari|tedarik|toplam|genel|kayıt|evrak|fatura)/i]
  ];
  function semanticColor(el,fallback){
    const text=(el.innerText||el.textContent||'').replace(/\s+/g,' ').trim();
    for(const [color,re] of semanticRules) if(re.test(text)) return color;
    return fallback||'cyan';
  }
  function isKpi(el){
    return el.matches('.kpi,.kpi-card,.mini-action,.pos-kpi,[class*="kpi-"]') ||
      !!el.closest('.kpi-grid,.erp-kpi-grid,.erp-mini-kpi-grid,.kpi-card-grid,.pos-kpi-grid,.service-kpi-grid-pro,.service-request-kpis');
  }
  function applyKpis(root=document){
    const selector='.kpi,.kpi-card,.mini-action,.pos-kpi,.kpi-grid > .card,.erp-kpi-grid > .card,.erp-mini-kpi-grid > .card,.kpi-card-grid > .card,.service-kpi-grid-pro > .kpi,.service-request-kpis > .kpi';
    root.querySelectorAll(selector).forEach((el,i)=>{
      if(el.dataset.erpSemanticKpi) return;
      const color=semanticColor(el,palette[i%palette.length]);
      el.classList.add('erp-status-kpi','erp-kpi-'+color);
      el.dataset.erpSemanticKpi='1';
    });
  }
  function applyPanels(root=document){
    const selector='.card:not(.kpi):not(.kpi-card):not(.mini-action):not(.pos-kpi):not([class*="kpi-"]),.service-panel,.form-page-card,.filter-box,.filter-card,.toolbar-card,.summary-card,.report-card,.dashboard-card,.widget-card,.table-card,.pos-panel,.table-wrap,.data-table-wrap,.table-container,.list-table-wrap,.service-table-wrap,.hs-cart-table';
    const groups=new Map();
    root.querySelectorAll(selector).forEach(el=>{
      if(isKpi(el) || el.closest('.kpi,.kpi-card,.mini-action,.pos-kpi')) return;
      if(el.parentElement && el.parentElement.closest('.card,.service-panel,.form-page-card,.table-card,.pos-panel') && /table-wrap|table-container|data-table-wrap|list-table-wrap|service-table-wrap/.test(el.className)) return;
      const parent=el.parentElement||document.body;
      if(!groups.has(parent)) groups.set(parent,[]);
      groups.get(parent).push(el);
    });
    groups.forEach(items=>items.forEach((el,i)=>{
      if(el.dataset.erpSemanticPanel) return;
      const fallback=items.length>1?palette[i%palette.length]:'cyan';
      const color=semanticColor(el,fallback);
      el.classList.add('erp-color-panel','erp-color-'+color);
      el.dataset.erpSemanticPanel='1';
    }));
  }
  function applyAll(){applyKpis();applyPanels()}
  document.addEventListener('DOMContentLoaded',()=>setTimeout(applyAll,60));
  const obs=new MutationObserver(()=>requestAnimationFrame(applyAll));
  document.addEventListener('DOMContentLoaded',()=>obs.observe(document.body,{childList:true,subtree:true}));
  window.applyErpSemanticColors=applyAll;
})();


/* ============================================================
   741 - MASTER Yazdır / PDF İşlem Standardı
   Yazdır: her zaman yeni pencere + otomatik yazıcı penceresi
   PDF: doğrudan geçerli PDF dosyası indirir
   ============================================================ */
function tcr3ActionLabel(el){
  return [el?.textContent,el?.title,el?.getAttribute?.('aria-label'),el?.dataset?.action,el?.name,el?.id]
    .filter(Boolean).join(' ').trim().toLocaleLowerCase('tr-TR');
}
function tcr3PrintableContent(){
  const source=document.querySelector('#content') || document.querySelector('main') || document.body;
  const clone=source.cloneNode(true);
  clone.querySelectorAll('button,.page-actions,.topbar,.sidebar,.mobile-bottom-nav,.no-print,script,style').forEach(x=>x.remove());
  clone.querySelectorAll('input,select,textarea').forEach(el=>{
    const span=document.createElement('span');
    span.textContent=el.tagName==='SELECT'?(el.options[el.selectedIndex]?.text||''):(el.value||'');
    el.replaceWith(span);
  });
  return clone.innerHTML;
}
function printDoc(){
  const win=window.open('','_blank','noopener,noreferrer,width=1100,height=800');
  if(!win){ toast('Yazdırma penceresi tarayıcı tarafından engellendi.','error'); return; }
  const styles=[...document.querySelectorAll('link[rel="stylesheet"],style')].map(n=>n.outerHTML).join('\n');
  const title=(document.querySelector('.page-title')?.textContent||document.title||'Tcr3WEB Belge').trim();
  win.document.open();
  win.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${title}</title>${styles}<style>body{background:#fff!important;padding:24px!important}.app,.main{display:block!important;margin:0!important}.card{break-inside:avoid}button,.btn,.page-actions{display:none!important}@page{size:auto;margin:12mm}</style></head><body><div class="print-document"><h1 style="font:800 22px Arial;margin:0 0 18px">${title}</h1>${tcr3PrintableContent()}</div><script>window.addEventListener('load',function(){setTimeout(function(){window.focus();window.print();},250)});<\/script></body></html>`);
  win.document.close();
}
function tcr3PdfEscape(s){ return String(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)').replace(/[\r\n]+/g,' '); }
function tcr3DownloadPdf(){
  const title=(document.querySelector('.page-title')?.textContent||document.title||'Tcr3WEB Belge').trim();
  const raw=(document.querySelector('#content')||document.body).innerText.replace(/\s+/g,' ').trim();
  const text=(title+' — '+raw).slice(0,3500);
  const words=text.split(' '); const lines=[]; let line='';
  words.forEach(w=>{ const test=(line+' '+w).trim(); if(test.length>88){ lines.push(line); line=w; } else line=test; }); if(line) lines.push(line);
  const commands=['BT','/F1 10 Tf','45 800 Td'];
  lines.slice(0,48).forEach((ln,i)=>{ if(i) commands.push('0 -15 Td'); commands.push('('+tcr3PdfEscape(ln)+') Tj'); });
  commands.push('ET'); const stream=commands.join('\n');
  const objs=[];
  objs[1]='<< /Type /Catalog /Pages 2 0 R >>';
  objs[2]='<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
  objs[3]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>';
  objs[4]='<< /Length '+stream.length+' >>\nstream\n'+stream+'\nendstream';
  objs[5]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  let pdf='%PDF-1.4\n'; const offsets=[0];
  for(let i=1;i<=5;i++){ offsets[i]=pdf.length; pdf+=i+' 0 obj\n'+objs[i]+'\nendobj\n'; }
  const xref=pdf.length; pdf+='xref\n0 6\n0000000000 65535 f \n';
  for(let i=1;i<=5;i++) pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
  pdf+='trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF';
  const blob=new Blob([new TextEncoder().encode(pdf)],{type:'application/pdf'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download=(title.toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/gi,'-').replace(/^-|-$/g,'')||'tcr3web-belge')+'.pdf';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1500);
  toast('PDF dosyası indirildi.','success');
}
document.addEventListener('click',function(e){
  const el=e.target.closest('button,a.btn,a[data-action]'); if(!el) return;
  const label=tcr3ActionLabel(el);
  if(/pdf/.test(label)){
    e.preventDefault(); e.stopImmediatePropagation(); tcr3DownloadPdf(); return;
  }
  if(/yazdır|yazdir|print/.test(label)){
    e.preventDefault(); e.stopImmediatePropagation(); printDoc();
  }
},true);
window.printDoc=printDoc;
window.tcr3DownloadPdf=tcr3DownloadPdf;

/* 735 - Kalem tablolarında Durum sütunu kaldırma standardı */
(function(){
  function isLineItemsTable(table){
    if (!table) return false;
    if (table.classList.contains('form-line-table')) return true;
    const scope = table.closest('.card, .modal, section, main') || table.parentElement;
    const title = scope?.querySelector('.card-title, .fis-section-title, .text-soft, h2, h3, h4')?.textContent || '';
    return /kalemler|kalemleri|ürün kalemleri|sipariş kalemleri|teklif kalemleri|cari hesap kalemleri/i.test(title.trim());
  }

  function removeStatusColumn(table){
    if (!isLineItemsTable(table)) return;
    const headerCells = Array.from(table.querySelectorAll('thead tr:first-child > th'));
    const statusIndex = headerCells.findIndex(th => /^durum$/i.test((th.textContent || '').trim()));
    if (statusIndex < 0) return;

    table.querySelectorAll('tr').forEach(row => {
      const cells = Array.from(row.children).filter(el => /^(TH|TD)$/.test(el.tagName));
      const cell = cells[statusIndex];
      if (cell) cell.remove();
    });

    const colgroup = table.querySelector('colgroup');
    if (colgroup?.children?.[statusIndex]) colgroup.children[statusIndex].remove();
    table.dataset.lineStatusColumnRemoved = '1';
  }

  function normalizeLineItemTables(root){
    const tables = root?.matches?.('table') ? [root] : Array.from(root?.querySelectorAll?.('table') || []);
    tables.forEach(removeStatusColumn);
  }

  function init(){
    normalizeLineItemTables(document);
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) normalizeLineItemTables(node);
      }));
    });
    observer.observe(document.body, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();

/* MASTER V2 - Statik liste ekranlarında geniş demo kayıt görünümü */
(function masterStaticMockExpander(){
  function stripIds(node){
    node.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
    node.querySelectorAll('input,select,textarea').forEach(el=>{ el.removeAttribute('name'); el.tabIndex=-1; });
  }
  function varyText(node, n){
    const cells=node.querySelectorAll('td');
    if(cells.length){
      const first=cells[0];
      first.innerHTML=first.innerHTML.replace(/(\d{2,})/g,m=>String(Number(m)+n));
      if(cells[1]) cells[1].innerHTML=cells[1].innerHTML.replace(/(\d{2,})/g,m=>String(Number(m)+n));
    }
  }
  function expandTables(){
    const page=(location.pathname.split('/').pop()||'').toLowerCase();
    if(page.includes('-form') || page==='settings.html' || page==='dashboard.html') return;
    document.querySelectorAll('table tbody').forEach(tbody=>{
      if(tbody.closest('.modal') || tbody.querySelector('input,select,textarea')) return;
      const rows=[...tbody.children].filter(r=>r.tagName==='TR' && !r.classList.contains('empty-row'));
      if(!rows.length || rows.length>=18) return;
      const target=Math.min(24, Math.max(18, rows.length*3));
      for(let i=rows.length;i<target;i++){
        const c=rows[i%rows.length].cloneNode(true); stripIds(c); varyText(c,i+1); tbody.appendChild(c);
      }
    });
  }
  function expandCards(){
    const page=(location.pathname.split('/').pop()||'').toLowerCase();
    const selectors= page==='servis-usta.html' ? ['.usta-service-card','.technician-job-card','.service-mobile-card'] :
      page==='servis-havuzu.html' ? ['.service-pool-card','.pool-service-card'] :
      page.startsWith('depo-') ? ['.depo-order-card','.warehouse-task-card'] : [];
    selectors.forEach(sel=>{
      const cards=[...document.querySelectorAll(sel)]; if(!cards.length || cards.length>=12) return;
      const parent=cards[0].parentElement; if(!parent) return;
      for(let i=cards.length;i<12;i++){ const c=cards[i%cards.length].cloneNode(true); stripIds(c); varyText(c,i+1); parent.appendChild(c); }
    });
  }
  window.addEventListener('load',()=>setTimeout(()=>{expandTables();expandCards();},180));
})();

/* ============================================================
   Formatted native date inputs
   - Görünür alan klavyeden yazılabilir.
   - Sağdaki SVG takvim düğmesi native calendar picker açar.
   - Native değer ISO (YYYY-MM-DD) olarak tutulur.
   ============================================================ */
function tcrSyncDateDisplay(nativeInput, displayInput) {
  if (!nativeInput || !displayInput) return;
  displayInput.value = nativeInput.value ? fmtDate(nativeInput.value) : '';
  displayInput.dataset.lastValidValue = displayInput.value;
}

function tcrDatePartsToIso(day, month, year) {
  const d = Number(day), m = Number(month), y = Number(year);
  if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y)) return '';
  if (y < 1000 || y > 9999 || m < 1 || m > 12 || d < 1 || d > 31) return '';
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return '';
  return `${String(y).padStart(4,'0')}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function tcrDateMaskMeta() {
  const format = String(APP_DATE_FORMAT || 'DD.MM.YYYY').toUpperCase();
  const separator = format.includes('/') ? '/' : format.includes('-') ? '-' : '.';
  return { format, separator };
}

function tcrFormatDateDigits(raw) {
  const { format, separator } = tcrDateMaskMeta();
  const digits = String(raw || '').replace(/\D/g, '').slice(0, 8);
  if (!digits) return '';

  if (format === 'YYYY-MM-DD') {
    const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean);
    return parts.join(separator);
  }

  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join(separator);
}

function tcrParseDateText(raw) {
  const text = String(raw || '').trim();
  if (!text) return '';
  let m;

  /* Ayraçsız 8 haneli giriş de kabul edilir: 10102026 */
  const digits = text.replace(/\D/g, '');
  if (digits.length === 8) {
    if (String(APP_DATE_FORMAT).toUpperCase() === 'YYYY-MM-DD') {
      return tcrDatePartsToIso(digits.slice(6, 8), digits.slice(4, 6), digits.slice(0, 4));
    }
    if (String(APP_DATE_FORMAT).toUpperCase() === 'MM/DD/YYYY') {
      return tcrDatePartsToIso(digits.slice(2, 4), digits.slice(0, 2), digits.slice(4, 8));
    }
    return tcrDatePartsToIso(digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8));
  }

  /* ISO her zaman kabul edilir. */
  m = text.match(/^(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})$/);
  if (m) return tcrDatePartsToIso(m[3], m[2], m[1]);

  m = text.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/);
  if (!m) return '';

  const first = Number(m[1]), second = Number(m[2]), year = Number(m[3]);
  if (String(APP_DATE_FORMAT).toUpperCase() === 'MM/DD/YYYY') return tcrDatePartsToIso(second, first, year);
  return tcrDatePartsToIso(first, second, year);
}

function tcrInitFormattedDateInput(input) {
  if (!input || input.dataset.tcrDateReady === '1' || input.type !== 'date') return;
  input.dataset.tcrDateReady = '1';

  const wrap = document.createElement('div');
  wrap.className = 'tcr-date-input-wrap';

  const display = document.createElement('input');
  display.type = 'text';
  display.className = `${input.className} tcr-date-display`;
  display.setAttribute('aria-label', input.getAttribute('aria-label') || input.id || 'Tarih');
  display.setAttribute('autocomplete', 'off');
  display.setAttribute('inputmode', 'numeric');
  display.placeholder = APP_DATE_FORMAT || 'DD.MM.YYYY';

  const pickerButton = document.createElement('button');
  pickerButton.type = 'button';
  pickerButton.className = 'tcr-date-picker-btn';
  pickerButton.setAttribute('aria-label', 'Takvimi aç');
  pickerButton.setAttribute('title', 'Takvimi aç');
  pickerButton.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`;

  input.parentNode.insertBefore(wrap, input);
  wrap.appendChild(display);
  wrap.appendChild(input);
  wrap.appendChild(pickerButton);
  input.classList.add('tcr-date-native');
  input.classList.remove('form-input');

  const sync = () => {
    tcrSyncDateDisplay(input, display);
    display.dataset.isoValue = input.value || '';
    display.classList.remove('is-invalid');
  };

  const commitTypedValue = ({ restoreOnError = true } = {}) => {
    const raw = display.value.trim();
    if (!raw) {
      input.value = '';
      display.dataset.isoValue = '';
      display.dataset.lastValidValue = '';
      display.classList.remove('is-invalid');
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    const iso = tcrParseDateText(raw);
    if (!iso) {
      display.classList.add('is-invalid');
      if (typeof toast === 'function') toast('Geçersiz tarih. Lütfen sistem tarih formatına uygun bir tarih girin.', 'danger', { duration: 3500 });
      if (restoreOnError) display.value = display.dataset.lastValidValue || '';
      return false;
    }
    input.value = iso;
    sync();
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  };

  const openPicker = () => {
    /* Önce klavyeden girilen geçerli değeri native input'a aktar. */
    if (display.value.trim() && !commitTypedValue({ restoreOnError: false })) return;
    try {
      input.focus({ preventScroll: true });
      if (typeof input.showPicker === 'function') input.showPicker();
      else input.click();
    } catch (error) {
      input.click();
    }
  };

  input.addEventListener('change', sync);
  input.addEventListener('input', sync);
  pickerButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openPicker();
  });
  display.addEventListener('input', (event) => {
    display.classList.remove('is-invalid');
    const current = display.value;
    const caretAtEnd = display.selectionStart === current.length;
    const formatted = tcrFormatDateDigits(current);
    if (current !== formatted) display.value = formatted;
    if (caretAtEnd) {
      const end = display.value.length;
      try { display.setSelectionRange(end, end); } catch (e) {}
    }
  });
  display.addEventListener('blur', () => commitTypedValue());
  display.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitTypedValue();
      display.blur();
    }
    if (event.key === 'Escape') {
      display.value = display.dataset.lastValidValue || '';
      display.classList.remove('is-invalid');
      display.blur();
    }
    if (event.altKey && event.key === 'ArrowDown') {
      event.preventDefault();
      openPicker();
    }
  });
  sync();
}

function tcrInitFormattedDateInputs(root = document) {
  if (!root) return;
  if (root.matches?.('input[type="date"]')) tcrInitFormattedDateInput(root);
  root.querySelectorAll?.('input[type="date"]').forEach(tcrInitFormattedDateInput);
}

function tcrStartFormattedDateInputs() {
  tcrInitFormattedDateInputs(document);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) tcrInitFormattedDateInputs(node);
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.setInterval(() => {
    document.querySelectorAll('.tcr-date-input-wrap .tcr-date-native').forEach((nativeInput) => {
      const displayInput = nativeInput.parentElement?.querySelector('.tcr-date-display');
      if (!displayInput || document.activeElement === displayInput) return;
      const current = nativeInput.value || '';
      if (displayInput.dataset.isoValue !== current) {
        tcrSyncDateDisplay(nativeInput, displayInput);
        displayInput.dataset.isoValue = current;
      }
    });
  }, 250);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tcrStartFormattedDateInputs, { once: true });
} else {
  tcrStartFormattedDateInputs();
}


/* 633 · Evrakları indirmeden uygulama içinde görüntüleme */
function ensureDocumentPreviewModal(){
  let modal=document.getElementById('tcrDocumentPreviewModal');
  if(modal) return modal;
  modal=document.createElement('div');
  modal.id='tcrDocumentPreviewModal';
  modal.className='tcr-doc-preview-overlay';
  modal.setAttribute('aria-hidden','true');
  modal.innerHTML=`<div class="tcr-doc-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="tcrDocPreviewTitle">
    <div class="tcr-doc-preview-header">
      <div>
        <strong id="tcrDocPreviewTitle">Evrak Önizleme</strong>
        <small id="tcrDocPreviewMeta"></small>
      </div>
      <button type="button" class="tcr-doc-preview-close" onclick="closeDocumentPreview()" title="Kapat" aria-label="Kapat">${ICONS.x || '×'}</button>
    </div>
    <div class="tcr-doc-preview-body" id="tcrDocPreviewBody"></div>
    <div class="tcr-doc-preview-footer">
      <a id="tcrDocPreviewDownload" class="btn btn-primary" download>${ICONS.download || ''} İndir</a>
      <button type="button" class="btn btn-danger" onclick="closeDocumentPreview()">Kapat</button>
    </div>
  </div>`;
  modal.addEventListener('click',e=>{if(e.target===modal)closeDocumentPreview();});
  document.body.appendChild(modal);
  return modal;
}
function openDocumentPreview(url,name,type){
  if(!url || url==='#') return toast('Bu evrak için önizleme bulunamadı','warning');
  const modal=ensureDocumentPreviewModal();
  const body=modal.querySelector('#tcrDocPreviewBody');
  const title=modal.querySelector('#tcrDocPreviewTitle');
  const meta=modal.querySelector('#tcrDocPreviewMeta');
  const download=modal.querySelector('#tcrDocPreviewDownload');
  const safeName=name||'Evrak';
  const mime=String(type||'').toLowerCase();
  title.textContent=safeName;
  meta.textContent=mime || 'Evrak önizlemesi';
  download.href=url;
  download.download=safeName;
  if(mime.startsWith('image/') || /^data:image\//i.test(url) || /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(url)){
    body.innerHTML=`<img class="tcr-doc-preview-image" src="${url}" alt="${safeName.replace(/"/g,'&quot;')}">`;
  }else if(mime==='application/pdf' || /^data:application\/pdf/i.test(url) || /\.pdf(\?|#|$)/i.test(url)){
    body.innerHTML=`<iframe class="tcr-doc-preview-frame" src="${url}" title="${safeName.replace(/"/g,'&quot;')}"></iframe>`;
  }else{
    body.innerHTML=`<div class="tcr-doc-preview-unsupported"><div>${ICONS.file || ICONS.file_text || ''}</div><strong>${safeName}</strong><p>Bu dosya türü tarayıcı içinde doğrudan önizlenemiyor.</p><a class="btn btn-primary" href="${url}" download="${safeName.replace(/"/g,'&quot;')}">${ICONS.download || ''} Dosyayı İndir</a></div>`;
  }
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden','false');
  document.documentElement.classList.add('tcr-preview-open');
  document.body.classList.add('tcr-preview-open');
}
function closeDocumentPreview(){
  const modal=document.getElementById('tcrDocumentPreviewModal');
  if(!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  const body=modal.querySelector('#tcrDocPreviewBody');
  if(body) body.innerHTML='';
  document.documentElement.classList.remove('tcr-preview-open');
  document.body.classList.remove('tcr-preview-open');
}
document.addEventListener('keydown',e=>{if(e.key==='Escape' && document.getElementById('tcrDocumentPreviewModal')?.classList.contains('is-open')) closeDocumentPreview();});
