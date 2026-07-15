const DOP_STORE='tcr3web_depo_operasyon_v1';
const DOP_DEFAULT={warehouse:'Merkez Depo',orders:[
{id:'AS-2026-0148',customer:'Akdeniz Yapı',deadline:'10.07.2026 16:30',warehouse:'Merkez Depo',status:'Hazırlanıyor',items:[{name:'Çelik Profil 6m',shelf:'A-12',barcode:'8690001001123',qty:12,prepared:8,unit:'mt'},{name:'Endüstriyel Yağ 20L',shelf:'B-04',barcode:'8690001002120',qty:6,prepared:6,unit:'adet'}]},
{id:'AS-2026-0149',customer:'Mavi Teknik',deadline:'10.07.2026 17:15',warehouse:'Merkez Depo',status:'Bekliyor',items:[{name:'Elektrik Kablosu 2.5mm',shelf:'C-08',barcode:'8690001003127',qty:100,prepared:0,unit:'mt'}]},
{id:'AS-2026-0150',customer:'Atlas Endüstri',deadline:'11.07.2026 10:00',warehouse:'Araç Deposu',status:'Kısmi Hazır',items:[{name:'Boya Akrilik 5L Beyaz',shelf:'R-03',barcode:'8690001004124',qty:14,prepared:9,unit:'kutu'}]},
{id:'AS-2026-0151',customer:'Kuzey İnşaat',deadline:'11.07.2026 12:30',warehouse:'Merkez Depo',status:'Hazır',items:[{name:'Karton Koli 40x30x30',shelf:'D-16',barcode:'8690001005121',qty:80,prepared:80,unit:'adet'}]}
],receipts:[{id:'VS-2026-0068',supplier:'Anadolu Metal',warehouse:'Merkez Depo',date:'10.07.2026',items:4,status:'Bekliyor'},{id:'VS-2026-0069',supplier:'Petro Kimya',warehouse:'Kimya Depo',date:'10.07.2026',items:3,status:'Kontrol'}],completed:[]};
function dopLoad(){try{return JSON.parse(localStorage.getItem(DOP_STORE))||structuredClone(DOP_DEFAULT)}catch(e){return structuredClone(DOP_DEFAULT)}}
function dopSave(x){localStorage.setItem(DOP_STORE,JSON.stringify(x))}
let DOP=dopLoad();
function dopSetWarehouse(w){DOP.warehouse=w;dopSave(DOP);location.reload()}
function dopOrderProgress(o){const q=o.items.reduce((a,i)=>a+i.qty,0),p=o.items.reduce((a,i)=>a+i.prepared,0);return {q,p,pct:q?Math.round(p/q*100):0}}
function dopStatusClass(s){return s==='Hazır'||s==='Tamamlandı'?'green':s==='Kısmi Hazır'||s==='Kontrol'?'amber':s==='Eksik'?'red':'cyan'}
function dopStart(id){const o=DOP.orders.find(x=>x.id===id);if(o){o.status='Hazırlanıyor';dopSave(DOP);toast('Hazırlama işlemi başlatıldı','success');setTimeout(()=>location.reload(),300)}}
function dopPrepare(id){const o=DOP.orders.find(x=>x.id===id);if(!o)return;o.items.forEach(i=>i.prepared=i.qty);o.status='Hazır';dopSave(DOP);toast('Sipariş tamamen hazırlandı','success');setTimeout(()=>location.reload(),300)}
function dopMissing(id){const o=DOP.orders.find(x=>x.id===id);if(o){o.status='Eksik';dopSave(DOP);toast('Eksik ürün bildirimi oluşturuldu','error');setTimeout(()=>location.reload(),300)}}
function dopDeliver(id){const i=DOP.orders.findIndex(x=>x.id===id);if(i<0)return;const o=DOP.orders[i];o.status='Teslim Edildi';DOP.completed.unshift({...o,completedAt:new Date().toLocaleString('tr-TR')});DOP.orders.splice(i,1);dopSave(DOP);toast('Teslim işlemi tamamlandı','success');setTimeout(()=>location.reload(),300)}
function dopReceive(id){const r=DOP.receipts.find(x=>x.id===id);if(r){r.status='Tamamlandı';DOP.completed.unshift({...r,type:'Mal Kabul',completedAt:new Date().toLocaleString('tr-TR')});dopSave(DOP);toast('Mal kabul tamamlandı','success');setTimeout(()=>location.reload(),300)}}
function dopReset(){localStorage.removeItem(DOP_STORE);location.reload()}
