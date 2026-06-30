const http = require('http');
const url = require('url');
const db = require('./database/db');

let botInstance = null;
let PORT = parseInt(process.env.API_PORT) || 3005;

function setBot(client) {
  botInstance = client;
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

function json(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function stripName(n) { if (!n) return null; const i = n.indexOf('|'); return i > 0 ? n.substring(0,i).trim() : n; }

const KORUMA_HTML = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Koruma Dashboard</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI','Inter',sans-serif;background:#0b0e14;color:#e1e7ed;min-height:100vh;display:flex;flex-direction:column}
nav{background:#141920;border-bottom:1px solid #252d38;padding:14px 32px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
nav h1{font-size:18px;font-weight:700}
nav h1 span{color:#4b9eff}
.status{display:flex;align-items:center;gap:10px;font-size:13px}
.dot{width:9px;height:9px;border-radius:50%;display:inline-block}
.dot.on{background:#34d399;box-shadow:0 0 10px #34d39966}
.dot.off{background:#f87171;box-shadow:0 0 10px #f8717166}
.dot.busy{background:#fbbf24;box-shadow:0 0 10px #fbbf2466}
.ping{color:#6b7a8a;font-size:12px;background:#1a232e;padding:3px 10px;border-radius:12px}
.container{flex:1;display:flex;overflow:hidden}
.sidebar{width:240px;background:#141920;border-right:1px solid #252d38;flex-shrink:0;display:flex;flex-direction:column;overflow-y:auto}
.sidebar .head{font-size:10px;color:#6b7a8a;text-transform:uppercase;letter-spacing:1px;padding:20px 20px 8px;font-weight:600}
.sidebar a{display:flex;align-items:center;gap:10px;padding:10px 20px;color:#8899aa;text-decoration:none;font-size:13px;transition:all .15s;border-left:3px solid transparent}
.sidebar a:hover{color:#e1e7ed;background:#1a232e}
.sidebar a.active{color:#4b9eff;background:#1a232e;border-left-color:#4b9eff;font-weight:600}
.sidebar .bot-info{margin-top:auto;padding:16px 20px;border-top:1px solid #252d38;font-size:12px;color:#6b7a8a}
.main{flex:1;padding:24px 32px;overflow-y:auto}
.page{display:none}.page.active{display:block;animation:fade .25s ease}
@keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.select-bar{background:#141920;border:1px solid #252d38;border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:20px}
.select-bar select{background:#0b0e14;color:#e1e7ed;border:1px solid #252d38;border-radius:6px;padding:8px 12px;font-size:13px;min-width:260px;cursor:pointer}
.select-bar select:focus{outline:none;border-color:#4b9eff}
.badge{background:#1a232e;border:1px solid #252d38;border-radius:16px;padding:3px 12px;font-size:11px;color:#6b7a8a}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;margin-top:12px}
.card{background:#141920;border:1px solid #252d38;border-radius:10px;padding:14px 16px}
.card h3{font-size:13px;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:7px}
.card p{font-size:11px;color:#6b7a8a;margin-bottom:10px;line-height:1.5}
.row{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.row label{font-size:13px}
.tgl{position:relative;display:inline-block;width:38px;height:20px;cursor:pointer;flex-shrink:0}
.tgl input{opacity:0;width:0;height:0}
.sl{position:absolute;inset:0;background:#252d38;border-radius:20px;transition:.2s}
.sl:before{content:'';position:absolute;height:14px;width:14px;left:3px;bottom:3px;background:#6b7a8a;border-radius:50%;transition:.2s}
.tgl input:checked+.sl{background:#2563eb}
.tgl input:checked+.sl:before{background:#fff;transform:translateX(18px)}
.sub-input{margin-top:6px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.sub-input label{font-size:11px;color:#6b7a8a}
.sub-input input{background:#0b0e14;border:1px solid #252d38;border-radius:5px;color:#e1e7ed;padding:4px 8px;font-size:12px;width:70px}
.sub-input input:focus{outline:none;border-color:#4b9eff}
input[type=text]{background:#0b0e14;border:1px solid #252d38;border-radius:6px;color:#e1e7ed;padding:6px 10px;font-size:13px}
input:focus{outline:none;border-color:#4b9eff}
.btn{background:#1a232e;border:1px solid #252d38;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer;color:#e1e7ed;transition:all .15s;white-space:nowrap}
.btn:hover{background:#252d38}
.btn-blue{background:#2563eb;border-color:#2563eb;color:#fff}
.btn-blue:hover{background:#3b82f6}
.btn-red{background:#dc2626;border-color:#dc2626;color:#fff}
.btn-red:hover{background:#ef4444}
.tabs{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
.tab{background:#1a232e;border:1px solid #252d38;border-radius:6px;padding:7px 14px;font-size:12px;cursor:pointer;color:#8899aa;transition:all .15s}
.tab:hover{background:#252d38;color:#e1e7ed}
.tab.active{background:#2563eb;border-color:#2563eb;color:#fff}
.wl-area{background:#141920;border:1px solid #252d38;border-radius:10px;padding:16px;margin-top:10px}
.wl-area h3{font-size:13px;margin-bottom:8px;display:flex;align-items:center;gap:7px}
.wl-row{display:flex;gap:8px;margin-bottom:8px}
.wl-row input{flex:1}
.wl-list{display:flex;flex-wrap:wrap;gap:5px}
.wl-chip{background:#1a232e;border:1px solid #252d38;border-radius:14px;padding:3px 8px;font-size:11px;display:flex;align-items:center;gap:5px}
.wl-chip .del{cursor:pointer;color:#f87171;font-weight:700;font-size:13px;line-height:1}
.log-input{display:flex;gap:8px;align-items:center}
.log-input input{flex:1}
.nuke-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
.toast{position:fixed;bottom:24px;right:24px;background:#1a232e;border:1px solid #252d38;border-radius:8px;padding:10px 18px;font-size:13px;box-shadow:0 8px 24px #00000066;transform:translateY(100px);opacity:0;transition:all .3s;z-index:999}
.toast.show{transform:translateY(0);opacity:1}
.toast.ok{border-color:#34d399}
.toast.err{border-color:#f87171}
.loading{text-align:center;padding:50px 0;color:#6b7a8a}
.spin{width:28px;height:28px;border:3px solid #252d38;border-top-color:#4b9eff;border-radius:50%;animation:sp .7s linear infinite;margin:0 auto 10px}
@keyframes sp{to{transform:rotate(360deg)}}
.hidden{display:none!important}
@media(max-width:700px){.sidebar{width:60px}.sidebar .head,.sidebar a span{display:none}.sidebar a{justify-content:center;padding:12px}.main{padding:16px}.select-bar select{min-width:auto;flex:1}}
</style>
</head>
<body>
<nav>
  <h1>🛡️ <span>Koruma</span> Dashboard</h1>
  <div class="status">
    <span class="dot off" id="sDot"></span>
    <span id="sText">Yükleniyor...</span>
    <span class="ping" id="sPing">—</span>
    <button class="btn" onclick="init()" style="font-size:11px">⟳</button>
  </div>
</nav>
<div class="container">
  <div class="sidebar">
    <div class="head">Koruma</div>
    <a href="#" class="active" data-page="dashboard" onclick="switchPage('dashboard')"><span>📊</span><span>Genel</span></a>
    <a href="#" data-page="mesaj" onclick="switchPage('mesaj')"><span>💬</span><span>Mesaj Koruması</span></a>
    <a href="#" data-page="nuke" onclick="switchPage('nuke')"><span>🛡️</span><span>Anti-Nuke</span></a>
    <a href="#" data-page="log" onclick="switchPage('log')"><span>📋</span><span>Log & Whitelist</span></a>
    <div class="bot-info" id="botInfo">Bot bağlantısı bekleniyor...</div>
  </div>
  <div class="main">
    <div class="select-bar">
      <select id="guildSelect" onchange="selectGuild(this.value)">
        <option value="">— Sunucu Seç —</option>
      </select>
      <span class="badge" id="gCount">0</span>
      <span id="gInfo" style="font-size:12px;color:#6b7a8a"></span>
    </div>

    <!-- GENEL -->
    <div class="page active" id="page-dashboard">
      <div class="loading" id="dashLoading"><div class="spin"></div><div>Koruma durumu yükleniyor...</div></div>
      <div id="dashContent" class="hidden">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:20px" id="dashStats"></div>
        <div style="background:#141920;border:1px solid #252d38;border-radius:10px;padding:16px" id="dashDetail"></div>
      </div>
    </div>

    <!-- MESAJ -->
    <div class="page" id="page-mesaj">
      <div class="loading" id="msgLoading"><div class="spin"></div></div>
      <div class="grid" id="msgGrid" class="hidden"></div>
    </div>

    <!-- ANTI-NUKE -->
    <div class="page" id="page-nuke">
      <div class="loading" id="nukeLoading"><div class="spin"></div></div>
      <div class="nuke-grid" id="nukeGrid" class="hidden"></div>
    </div>

    <!-- LOG & WHITELIST -->
    <div class="page" id="page-log">
      <div style="max-width:600px">
        <div class="card" style="margin-bottom:10px">
          <h3>📋 Log Kanalı</h3>
          <p>Koruma olaylarının loglanacağı kanal ID'si.</p>
          <div class="log-input"><input type="text" id="logInput" placeholder="Kanal ID"><button class="btn btn-blue" onclick="setLog()">Kaydet</button></div>
        </div>
        <div class="wl-area">
          <h3>⬜ Whitelist</h3>
          <p style="font-size:11px;color:#6b7a8a;margin-bottom:10px">Whitelist'teki ID'lere sahip kullanıcı/roller korumadan muaftır.</p>
          <div class="wl-row"><input type="text" id="wlInput" placeholder="Kullanıcı veya Rol ID" onkeydown="if(event.key==='Enter')addWl()"><button class="btn btn-blue" onclick="addWl()">Ekle</button></div>
          <div class="wl-list" id="wlList"></div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="toast" id="toast"></div>
<script>
const API = '';
let gList = [], curGuild = null, curSet = null;

function $(id){return document.getElementById(id)}

function toast(msg, type='ok'){
  const t=$('toast'); t.textContent=msg; t.className='toast '+type;
  setTimeout(()=>t.classList.add('show'),10); setTimeout(()=>t.classList.remove('show'),2500);
}

async function api(path, opts={}){
  try{
    const r = await fetch(API + path, {...opts, headers:{'Content-Type':'application/json',...opts.headers}});
    if(!r.ok){const e=await r.json().catch(()=>({})); throw new Error(e.error||r.statusText)}
    return await r.json()
  }catch(e){toast(e.message,'err'); throw e}
}

async function init(){
  try{
    const s = await api('/status');
    const dot=$('sDot'), txt=$('sText'), ping=$('sPing');
    dot.className='dot '+(s.status==='online'?'on':'off');
    txt.textContent=s.status==='online'?'Çevrimiçi':'Çevrimdışı';
    ping.textContent=s.ping+' ms';
    $('botInfo').innerHTML='🤖 '+(s.username||'Infermus League')+'<br><span style="font-size:10px">'+s.guildCount+' sunucu</span>';
    await loadGuilds();
  }catch{
    $('sDot').className='dot off'; $('sText').textContent='Bağlantı Yok';
    $('botInfo').innerHTML='⚠️ API bağlanamadı<br><span style="font-size:10px">port 3005</span>';
  }
}

async function loadGuilds(){
  try{
    const d = await api('/guilds'); gList = d.guilds||[];
    const sel=$('guildSelect'); sel.innerHTML='<option value="">— Sunucu Seç —</option>';
    for(const g of gList){
      const o=document.createElement('option'); o.value=g.id;
      o.textContent=g.name+' ('+g.memberCount+' üye)'; sel.appendChild(o)
    }
    $('gCount').textContent=gList.length+' sunucu'
  }catch{}
}

async function selectGuild(id){
  if(!id){curGuild=null;curSet=null;showPage('dashboard');$('gInfo').textContent='';return}
  curGuild=id; $('gInfo').textContent='';
  try{
    const d = await api('/settings?guildId='+id); curSet = d.settings||{};
    const g = gList.find(x=>x.id===id);
    if(g) $('gInfo').textContent='👤 '+g.memberCount+' üye • ID: '+g.id;
    renderAll()
  }catch{toast('Ayarlar alınamadı','err')}
}

function renderAll(){
  renderDash(); renderMsg(); renderNuke(); renderLog();
  switchPage('dashboard')
}

function switchPage(p){
  document.querySelectorAll('.sidebar a').forEach(a=>a.classList.toggle('active',a.dataset.page===p));
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  const pg=$('page-'+p); if(pg)pg.classList.add('active')
}

function renderDash(){
  if(!curGuild||!curSet){$('dashLoading').classList.remove('hidden');$('dashContent').classList.add('hidden');return}
  $('dashLoading').classList.add('hidden');$('dashContent').classList.remove('hidden');
  const s=curSet, g=gList.find(x=>x.id===curGuild);
  const features=[
    {k:'kufur',l:'Küfür Filtresi',e:'🤬'},{k:'link',l:'Link Engel',e:'🔗'},
    {k:'reklam',l:'Reklam Engel',e:'📢'},{k:'flood',l:'Flood',e:'🌊'},
    {k:'caps',l:'Caps',e:'🔠'},{k:'mention',l:'Mention',e:'👥'},{k:'resim',l:'Resim Engel',e:'🖼️'},
    {k:'antiNuke',l:'Anti-Nuke',e:'☢️'},{k:'antiKanal',l:'Kanal Koruma',e:'📁'},
    {k:'antiRol',l:'Rol Koruma',e:'🏷️'},{k:'antiBan',l:'Ban Koruma',e:'🔨'},
    {k:'antiBot',l:'Bot Koruma',e:'🤖'},{k:'antiWebhook',l:'Webhook Koruma',e:'🪝'}
  ];
  let on=0, total=features.length;
  for(const f of features){
    const v=s[f.k]; if(v===true||v?.enabled===true) on++
  }
  let html='<div class="stat" style="background:#141920;border:1px solid #252d38;border-radius:10px;padding:16px;text-align:center"><div style="font-size:10px;color:#6b7a8a;text-transform:uppercase;letter-spacing:.5px">Aktif Koruma</div><div style="font-size:32px;font-weight:700;margin-top:4px;color:'+(on===0?'#f87171':on===total?'#34d399':'#fbbf24')+'">'+on+'/'+total+'</div></div>';
  html+='<div class="stat" style="background:#141920;border:1px solid #252d38;border-radius:10px;padding:16px;text-align:center"><div style="font-size:10px;color:#6b7a8a;text-transform:uppercase;letter-spacing:.5px">Log Kanalı</div><div style="font-size:16px;font-weight:600;margin-top:4px;color:#8899aa">'+(s.logKanal?'✅ Ayarlandı':'❌ Ayarlanmamış')+'</div></div>';
  html+='<div class="stat" style="background:#141920;border:1px solid #252d38;border-radius:10px;padding:16px;text-align:center"><div style="font-size:10px;color:#6b7a8a;text-transform:uppercase;letter-spacing:.5px">Whitelist</div><div style="font-size:16px;font-weight:600;margin-top:4px;color:#8899aa">'+(s.whitelist?.length||0)+' ID</div></div>';
  html+='<div class="stat" style="background:#141920;border:1px solid #252d38;border-radius:10px;padding:16px;text-align:center"><div style="font-size:10px;color:#6b7a8a;text-transform:uppercase;letter-spacing:.5px">Sunucu</div><div style="font-size:16px;font-weight:600;margin-top:4px;color:#8899aa">'+(g?g.name:'—')+'</div></div>';
  $('dashStats').innerHTML=html;
  let det='<h3 style="font-size:14px;font-weight:600;margin-bottom:10px">⚙️ Hızlı Ayarlar</h3><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px">';
  for(const f of features){
    const v=s[f.k]; const en=v===true||v?.enabled===true;
    det+='<div class="row" style="background:#1a232e;border-radius:6px;padding:8px 10px;margin:0"><label>'+f.e+' '+f.l+'</label><label class="tgl"><input type="checkbox" '+(en?'checked':'')+' onchange="tog(\''+f.k+'\',this.checked)"><span class="sl"></span></label></div>'
  }
  det+='</div>'; $('dashDetail').innerHTML=det
}

function msgCard(key, label, emoji, desc, subs){
  const v=curSet[key]; const en=v===true||v?.enabled===true;
  let html='<div class="card"><h3>'+emoji+' '+label+'</h3><p>'+desc+'</p><div class="row"><label>Aktif</label><label class="tgl"><input type="checkbox" '+(en?'checked':'')+' onchange="tog(\''+key+'\',this.checked)"><span class="sl"></span></label></div>';
  if(subs){
    const defs={flood:{limit:4,time:5000},caps:{minLen:10,ratio:0.7},mention:{max:5}};
    html+='<div class="sub-input">';
    for(const s of subs){
      const sv=v?.[s]??defs[key]?.[s]??'';
      const lb=s==='limit'?'Limit':s==='time'?'Ms':s==='minLen'?'Min':s==='ratio'?'Oran':s==='max'?'Max':'';
      html+='<label>'+lb+'</label><input type="text" value="'+sv+'" onchange="upd(\''+key+'\',\''+s+'\',this.value)">'
    }
    html+='</div>'
  }
  return html+'</div>'
}

function renderMsg(){
  if(!curSet){$('msgLoading').classList.remove('hidden');$('msgGrid').classList.add('hidden');return}
  $('msgLoading').classList.add('hidden');$('msgGrid').classList.remove('hidden');
  const items=[
    {k:'kufur',l:'Küfür Filtresi',e:'🤬',d:'Küfür/yasaklı kelime içeren mesajları siler ve cezalandırır.'},
    {k:'link',l:'Link Engel',e:'🔗',d:'HTTP/HTTPS linklerini ve domain adreslerini engeller.'},
    {k:'reklam',l:'Reklam Engel',e:'📢',d:'Discord davet linklerini ve reklam amaçlı mesajları engeller.'},
    {k:'flood',l:'Flood Koruması',e:'🌊',d:'Belirtilen sürede limit üzeri mesaj gönderimini engeller.',s:['limit','time']},
    {k:'caps',l:'Caps Koruması',e:'🔠',d:'Belirtilen orandan fazla büyük harf içeren mesajları algılar.',s:['minLen','ratio']},
    {k:'mention',l:'Mention Koruması',e:'👥',d:'Bir mesajda maksimum etiket sayısını sınırlar.',s:['max']},
    {k:'resim',l:'Resim Engel',e:'🖼️',d:'Tüm resim/ek gönderimlerini engeller.'}
  ];
  $('msgGrid').innerHTML=items.map(x=>msgCard(x.k,x.l,x.e,x.d,x.s)).join('')
}

function renderNuke(){
  if(!curSet){$('nukeLoading').classList.remove('hidden');$('nukeGrid').classList.add('hidden');return}
  $('nukeLoading').classList.add('hidden');$('nukeGrid').classList.remove('hidden');
  const items=[
    {k:'antiNuke',l:'Anti-Nuke',e:'☢️',d:'Toplu kanal/rol/sunucu değişikliklerini algılar ve engeller.',s:['maxAction','timeWindow']},
    {k:'antiKanal',l:'Kanal Koruması',e:'📁',d:'Kanal oluşturma/silme işlemlerini engeller.'},
    {k:'antiRol',l:'Rol Koruması',e:'🏷️',d:'Rol oluşturma/silme işlemlerini engeller.'},
    {k:'antiBan',l:'Ban Koruması',e:'🔨',d:'Yetkisiz ban işlemlerini tespit eder ve geri alır.'},
    {k:'antiBot',l:'Bot Koruması',e:'🤖',d:'Sunucuya yetkisiz bot eklenmesini kickleyerek engeller.'},
    {k:'antiWebhook',l:'Webhook Koruması',e:'🪝',d:'Webhook oluşturulmasını tespit eder ve siler.'}
  ];
  $('nukeGrid').innerHTML=items.map(x=>msgCard(x.k,x.l,x.e,x.d,x.s)).join('')
}

function renderLog(){
  if(!curSet)return;
  $('logInput').value=curSet.logKanal||'';
  const list=curSet.whitelist||[];
  const el=$('wlList');
  if(!list.length){el.innerHTML='<span style="color:#6b7a8a;font-size:12px">Henüz kimse whitelistte değil.</span>';return}
  el.innerHTML=list.map(id=>'<span class="wl-chip">'+id+'<span class="del" onclick="rmWl(\''+id+'\')">×</span></span>').join('')
}

async function tog(key,en){
  let v; const s=curSet;
  if(typeof s[key]==='object'&&s[key]!==null) v={...s[key],enabled:en};
  else v=en;
  s[key]=v;
  try{await api('/settings',{method:'POST',body:JSON.stringify({guildId:curGuild,key,value:v})});renderAll()}catch{}
}

async function upd(key,sub,val){
  let n=isNaN(Number(val))?val:Number(val);
  let v=curSet[key]; if(typeof v!=='object'||v===null) v={enabled:false};
  v[sub]=n; curSet[key]=v;
  try{await api('/settings',{method:'POST',body:JSON.stringify({guildId:curGuild,key,value:v})});toast(key+'.'+sub+' güncellendi')}catch{}
}

async function setLog(){
  const val=$('logInput').value.trim()||null; curSet.logKanal=val;
  try{await api('/settings',{method:'POST',body:JSON.stringify({guildId:curGuild,key:'logKanal',value:val})});toast(val?'Log kanalı ayarlandı':'Temizlendi')}catch{}
}

async function addWl(){
  const inp=$('wlInput'), id=inp.value.trim(); if(!id)return;
  const list=curSet.whitelist||[];
  if(list.includes(id)){toast('Zaten whitelistte','err');return}
  list.push(id); curSet.whitelist=list;
  try{await api('/settings',{method:'POST',body:JSON.stringify({guildId:curGuild,key:'whitelist',value:list})});inp.value='';renderLog();toast(id+' eklendi')}catch{}
}

async function rmWl(id){
  const list=(curSet.whitelist||[]).filter(x=>x!==id); curSet.whitelist=list;
  try{await api('/settings',{method:'POST',body:JSON.stringify({guildId:curGuild,key:'whitelist',value:list})});renderLog();toast(id+' çıkarıldı')}catch{}
}

init()
</script>
</body>
</html>
`;

function startServer() {
  const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    const parsed = url.parse(req.url, true);
    const path = parsed.pathname;

    // GET /status
    if (path === '/status' && req.method === 'GET') {
      if (!botInstance) return json(res, 503, { status: 'offline', error: 'Bot not ready' });
      return json(res, 200, {
        status: botInstance.isReady() ? 'online' : 'connecting',
        ping: botInstance.ws?.ping || 0,
        guildCount: botInstance.guilds?.cache?.size || 0,
        memberCount: botInstance.guilds?.cache?.reduce((a, g) => a + g.memberCount, 0) || 0,
        uptime: process.uptime(),
        commands: botInstance.commands?.size || 0,
        readyAt: botInstance.readyAt?.toISOString() || null,
        username: botInstance.user?.username || null,
        discriminator: botInstance.user?.discriminator || null,
        avatar: botInstance.user?.displayAvatarURL() || null,
      });
    }

    // GET /guilds
    else if (path === '/guilds' && req.method === 'GET') {
      if (!botInstance) return json(res, 503, { status: 'offline' });
      const guilds = botInstance.guilds.cache.map(g => ({
        id: g.id, name: g.name, memberCount: g.memberCount,
        icon: g.iconURL({ size: 64 }), ownerId: g.ownerId,
      }));
      return json(res, 200, { guilds });
    }

    // GET /settings?guildId=X
    else if (path === '/settings' && req.method === 'GET') {
      const guildId = parsed.query.guildId;
      if (!guildId) return json(res, 400, { error: 'guildId required' });
      const config = db.get(`guard.${guildId}`);
      const def = {
        kufur: { enabled: false },
        link: { enabled: false },
        reklam: { enabled: false },
        caps: { enabled: false, minLen: 10, ratio: 0.7 },
        flood: { enabled: false, limit: 4, time: 5000 },
        mention: { enabled: false, max: 5 },
        resim: { enabled: false },
        antiNuke: { enabled: false, maxAction: 3, timeWindow: 10000 },
        antiKanal: { enabled: false },
        antiRol: { enabled: false },
        antiBan: { enabled: false },
        antiBot: { enabled: false },
        antiWebhook: { enabled: false },
        logKanal: null,
        whitelist: [],
      };
      const merged = { ...def };
      if (config && typeof config === 'object') {
        for (const k of Object.keys(def)) {
          if (config[k] === undefined || config[k] === null) continue;
          if (typeof config[k] === 'object' && typeof def[k] === 'object' && def[k] !== null && config[k] !== null) {
            merged[k] = { ...def[k], ...config[k] };
          } else {
            merged[k] = config[k];
          }
        }
      }
      return json(res, 200, { guildId, settings: merged });
    }

    // POST /settings
    else if (path === '/settings' && req.method === 'POST') {
      const body = await readBody(req);
      const { guildId, key, value } = body;
      if (!guildId || !key) return json(res, 400, { error: 'guildId and key required' });
      let config = db.get(`guard.${guildId}`) || {};
      config[key] = value;
      db.set(`guard.${guildId}`, config);
      db.save();
      return json(res, 200, { ok: true, guildId, key, value });
    }

    // GET /admin/users
    else if (path === '/admin/users' && req.method === 'GET') {
      const allUsers = db.getAllUsers();
      const kayitGecmisi = db.get('kayitGecmisi', {});
      const userRoles = {};
      for (const gid of Object.keys(kayitGecmisi)) {
        for (const [uid, info] of Object.entries(kayitGecmisi[gid])) {
          if (!userRoles[uid]) userRoles[uid] = info.role;
        }
      }
      const list = Object.entries(allUsers).map(([id, u]) => {
        let name = u.name || null;
        if (name) { const idx = name.indexOf('|'); if (idx > 0) name = name.substring(0, idx).trim(); }
        return {
          id, name, balance: u.balance || 0,
          bankBalance: u.bankBalance || 0, value: u.value || 0,
          position: u.position || '', country: u.country || '',
          goals: u.goals || 0, assists: u.assists || 0,
          squad: u.squad || null, role: userRoles[id] || null,
        };
      });
      return json(res, 200, { users: list, total: list.length });
    }

    // GET /admin/user?userId=X
    else if (path === '/admin/user' && req.method === 'GET') {
      const userId = parsed.query.userId;
      if (!userId) return json(res, 400, { error: 'userId required' });
      const userData = db.get(`users.${userId}`);
      if (!userData) return json(res, 404, { error: 'User not found' });
      const kayitGecmisi = db.get('kayitGecmisi', {});
      let userRole = null;
      for (const gid of Object.keys(kayitGecmisi)) {
        if (kayitGecmisi[gid][userId]) { userRole = kayitGecmisi[gid][userId].role; break; }
      }
      let name = userData.name || null;
      if (name) { const idx = name.indexOf('|'); if (idx > 0) name = name.substring(0, idx).trim(); }
      const warns = db.get(`uyarilar.${userId}`, []);
      const blacklisted = db.get('settings.karaliste', []).includes(userId);
      return json(res, 200, { user: { ...userData, id: userId, name, role: userRole }, warns, blacklisted });
    }

    // POST /admin/user-update
    else if (path === '/admin/user-update' && req.method === 'POST') {
      const body = await readBody(req);
      const { userId, key, value } = body;
      if (!userId || !key) return json(res, 400, { error: 'userId and key required' });
      const userData = db.get(`users.${userId}`);
      if (!userData) return json(res, 404, { error: 'User not found' });
      const keys = key.split('.');
      let current = userData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]] || typeof current[keys[i]] !== 'object') current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      db.set(`users.${userId}`, userData);
      return json(res, 200, { ok: true, userId, key, value });
    }

    // GET /admin/blacklist
    else if (path === '/admin/blacklist' && req.method === 'GET') {
      const list = db.get('settings.karaliste', []);
      return json(res, 200, { blacklist: list });
    }

    // POST /admin/blacklist
    else if (path === '/admin/blacklist' && req.method === 'POST') {
      const body = await readBody(req);
      const { userId, action } = body;
      if (!userId || !action) return json(res, 400, { error: 'userId and action (add/remove) required' });
      let list = db.get('settings.karaliste', []);
      if (action === 'add') {
        if (!list.includes(userId)) list.push(userId);
      } else if (action === 'remove') {
        list = list.filter(id => id !== userId);
      }
      db.set('settings.karaliste', list);
      return json(res, 200, { ok: true, userId, action, blacklist: list });
    }

    // GET /admin/warns?userId=X
    else if (path === '/admin/warns' && req.method === 'GET') {
      const userId = parsed.query.userId;
      if (!userId) return json(res, 400, { error: 'userId required' });
      const warns = db.get(`uyarilar.${userId}`, []);
      return json(res, 200, { userId, warns });
    }

    // POST /admin/warn
    else if (path === '/admin/warn' && req.method === 'POST') {
      const body = await readBody(req);
      const { userId, reason } = body;
      if (!userId || !reason) return json(res, 400, { error: 'userId and reason required' });
      const warns = db.get(`uyarilar.${userId}`, []);
      warns.push({ reason, date: new Date().toISOString(), by: 'Panel' });
      db.set(`uyarilar.${userId}`, warns);
      return json(res, 200, { ok: true, userId, warns });
    }

    // GET /admin/invites?guildId=X
    else if (path === '/admin/invites' && req.method === 'GET') {
      const guildId = parsed.query.guildId;
      if (!guildId) return json(res, 400, { error: 'guildId required' });
      const allUsers = db.getAllUsers();
      const invites = db.get(`davetler.${guildId}`, {});
      const sorted = Object.entries(invites)
        .map(([userId, count]) => ({ userId, name: (allUsers[userId]?.name) || null, count: typeof count === 'object' ? (count.total || count.gercek || 0) : count }))
        .sort((a, b) => b.count - a.count);
      return json(res, 200, { guildId, invites: sorted });
    }

    // GET /admin/guild-config?guildId=X
    else if (path === '/admin/guild-config' && req.method === 'GET') {
      const guildId = parsed.query.guildId;
      if (!guildId) return json(res, 400, { error: 'guildId required' });
      const config = {
        guard: db.get(`guard.${guildId}`, {}),
        roller: db.get(`roller.${guildId}`, {}),
        kayit: db.get(`kayit.${guildId}`, {}),
        degerKanal: db.get(`degerKanal.${guildId}`, ''),
        degerYetkilisiRol: db.get(`degerYetkilisiRol.${guildId}`, ''),
        macSonucuKanal: db.get(`macSonucuKanal.${guildId}`, ''),
        bilgiYetkilisiRol: db.get(`bilgiYetkilisiRol.${guildId}`, ''),
        hosgeldin: db.get(`hosgeldin.${guildId}`, {}),
        evler: db.get(`evler.${guildId}`, {}),
        araclar: db.get(`araclar.${guildId}`, {}),
        koruma: db.get(`koruma.${guildId}`, {}),
        botkoruma: db.get(`botkoruma.${guildId}`, {}),
        kayitSayac: db.get(`kayitSayac.${guildId}`, 0),
        istatistik: db.get(`istatistik.${guildId}`, {}),
      };
      return json(res, 200, { guildId, config });
    }

    // POST /admin/guild-config
    else if (path === '/admin/guild-config' && req.method === 'POST') {
      const body = await readBody(req);
      const { guildId, key, value } = body;
      if (!guildId || !key) return json(res, 400, { error: 'guildId and key required' });
      db.set(`${key}.${guildId}`, value);
      db.save();
      return json(res, 200, { ok: true, guildId, key, value });
    }

    // GET /admin/stats
    else if (path === '/admin/stats' && req.method === 'GET') {
      const allUsers = db.getAllUsers();
      const totalUsers = Object.keys(allUsers).length;
      let totalBalance = 0, totalBank = 0, totalValue = 0;
      for (const u of Object.values(allUsers)) {
        totalBalance += u.balance || 0;
        totalBank += u.bankBalance || 0;
        totalValue += u.value || 0;
      }
      const guardCount = Object.keys(db.get('guard', {})).length;
      const warnCount = Object.keys(db.get('uyarilar', {})).length;
      const matchCount = Object.keys(db.get('matches', {})).length;
      const query = db.get('koruma', {});
      return json(res, 200, {
        totalUsers, totalBalance, totalBank, totalValue,
        guardGuilds: guardCount, totalWarns: warnCount,
        totalMatches: matchCount, guildCount: botInstance?.guilds?.cache?.size || 0,
        memberCount: botInstance?.guilds?.cache?.reduce((a, g) => a + g.memberCount, 0) || 0,
        commands: botInstance?.commands?.size || 0,
        uptime: process.uptime(),
      });
    }

    // GET /admin/backup
    else if (path === '/admin/backup' && req.method === 'GET') {
      const allData = db.getAll();
      res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="elektro-backup.json"' });
      res.end(JSON.stringify(allData, null, 2));
    }

    // GET /admin/guild-detail?guildId=X
    else if (path === '/admin/guild-detail' && req.method === 'GET') {
      const guildId = parsed.query.guildId;
      if (!guildId) return json(res, 400, { error: 'guildId required' });
      if (!botInstance) return json(res, 503, { error: 'Bot not ready' });
      const guild = botInstance.guilds.cache.get(guildId);
      if (!guild) return json(res, 404, { error: 'Guild not found' });
      const channels = guild.channels.cache.map(c => ({ id: c.id, name: c.name, type: c.type, position: c.position }));
      const roles = guild.roles.cache.map(r => ({ id: r.id, name: r.name, color: r.color, position: r.position, memberCount: r.members.size }));
      const memberCount = guild.memberCount;
      const botCount = guild.members.cache.filter(m => m.user.bot).size;
      return json(res, 200, {
        id: guild.id, name: guild.name, icon: guild.iconURL({ size: 128 }),
        ownerId: guild.ownerId, memberCount, botCount, humanCount: memberCount - botCount,
        channels: channels.sort((a,b) => a.position - b.position),
        roles: roles.sort((a,b) => b.position - a.position),
      });
    }

    // GET /admin/top-users?type=X&limit=X
    else if (path === '/admin/top-users' && req.method === 'GET') {
      const type = parsed.query.type || 'balance';
      const limit = Math.min(parseInt(parsed.query.limit) || 10, 50);
      const allUsers = db.getAllUsers();
      const kayitGecmisi = db.get('kayitGecmisi', {});
      const userRoles = {};
      for (const gid of Object.keys(kayitGecmisi)) {
        for (const [uid, info] of Object.entries(kayitGecmisi[gid])) {
          if (!userRoles[uid]) userRoles[uid] = info.role;
        }
      }
      const validTypes = { balance:'balance', bankBalance:'bankBalance', value:'value', goals:'goals', assists:'assists' };
      const key = validTypes[type] || 'balance';
      const list = Object.entries(allUsers)
        .map(([id, u]) => {
          let name = u.name || null;
          if (name) { const idx = name.indexOf('|'); if (idx > 0) name = name.substring(0, idx).trim(); }
          return { id, name, value: u[key] || 0, role: userRoles[id] || null };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
      return json(res, 200, { type: key, users: list });
    }

    // GET /admin/players?search=X&sort=X&order=X
    else if (path === '/admin/players' && req.method === 'GET') {
      const search = (parsed.query.search || '').toLowerCase();
      const sort = parsed.query.sort || 'value';
      const order = parsed.query.order || 'desc';
      const allUsers = db.getAllUsers();
      const kayitGecmisi = db.get('kayitGecmisi', {});
      const userRoles = {};
      for (const gid of Object.keys(kayitGecmisi)) {
        for (const [uid, info] of Object.entries(kayitGecmisi[gid])) {
          if (!userRoles[uid]) userRoles[uid] = info.role;
        }
      }
      let list = Object.entries(allUsers).map(([id, u]) => {
        let name = u.name || null;
        if (name) { const idx = name.indexOf('|'); if (idx > 0) name = name.substring(0, idx).trim(); }
        return {
        id, name,
        value: u.value || 0, goals: u.goals || 0, assists: u.assists || 0,
        balance: u.balance || 0, bankBalance: u.bankBalance || 0,
        squad: u.squad || null, position: u.position || null,
        country: u.country || null,
        matchStats: u.matchStats || { mac:0, gol:0, asist:0, sarikart:0, kirmizikart:0 },
        skills: u.skills || {},
        trainings: (u.trainings || []).length,
        valueCount: u.valueCount || 0,
        role: userRoles[id] || null,
      }});
      if (search) list = list.filter(p => (p.name||'').toLowerCase().includes(search) || p.id.includes(search));
      const validSorts = { value:'value', goals:'goals', assists:'assists', name:'name', balance:'balance' };
      const sk = validSorts[sort] || 'value';
      list.sort((a, b) => {
        const va = a[sk] ?? 0, vb = b[sk] ?? 0;
        if (typeof va === 'string') return order === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
        return order === 'asc' ? va - vb : vb - va;
      });
      return json(res, 200, { players: list.slice(0, 200), total: list.length });
    }

    // GET /admin/matches
    else if (path === '/admin/matches' && req.method === 'GET') {
      const allUsers = db.getAllUsers();
      const all = db.get('matches', {});
      const list = Object.entries(all).map(([id, m]) => {
        const match = { id, ...m };
        if (match.goals) {
          match.goals = match.goals.map(g => ({
            ...g,
            userName: g.userId ? (allUsers[g.userId]?.name || allUsers[g.userId.split('_')[0]]?.name || null) : null
          }));
        }
        return match;
      });
      list.sort((a, b) => (b.startTime||'').localeCompare(a.startTime||''));
      return json(res, 200, { matches: list });
    }

    // GET /admin/vehicles?guildId=X
    else if (path === '/admin/vehicles' && req.method === 'GET') {
      const guildId = parsed.query.guildId;
      if (!guildId) return json(res, 400, { error: 'guildId required' });
      const allUsers = db.getAllUsers();
      const all = db.get(`araclar.${guildId}`, {});
      const list = [];
      for (const [userId, vehicles] of Object.entries(all)) {
        for (const v of vehicles) list.push({ userId, userName: (allUsers[userId]?.name) || null, ...v });
      }
      return json(res, 200, { guildId, vehicles: list });
    }

    // GET /admin/houses?guildId=X
    else if (path === '/admin/houses' && req.method === 'GET') {
      const guildId = parsed.query.guildId;
      if (!guildId) return json(res, 400, { error: 'guildId required' });
      const allUsers = db.getAllUsers();
      const all = db.get(`evler.${guildId}`, {});
      const list = [];
      for (const [userId, houses] of Object.entries(all)) {
        for (const h of houses) list.push({ userId, userName: (allUsers[userId]?.name) || null, ...h });
      }
      return json(res, 200, { guildId, houses: list });
    }

    // POST /admin/guild-leave
    else if (path === '/admin/guild-leave' && req.method === 'POST') {
      const body = await readBody(req);
      const { guildId } = body;
      if (!guildId) return json(res, 400, { error: 'guildId required' });
      if (!botInstance) return json(res, 503, { error: 'Bot not ready' });
      const guild = botInstance.guilds.cache.get(guildId);
      if (!guild) return json(res, 404, { error: 'Guild not found' });
      await guild.leave();
      return json(res, 200, { ok: true, guildId, name: guild.name });
    }

    // GET /restart
    else if (path === '/restart' && req.method === 'GET') {
      json(res, 200, { message: 'Restarting...' });
      setTimeout(() => process.exit(1), 500);
    }

    // GET /admin/tournaments
    else if (path === '/admin/tournaments' && req.method === 'GET') {
      const all = db.get('turnuva', {});
      const list = Object.entries(all).map(([id, t]) => {
        const name = t.isim || t.name || 'İsimsiz Turnuva';
        const teams = t.takimlar || [];
        const fixtures = t.fikstur || [];
        const played = fixtures.filter(f => f.oynandi).length;
        return { id, name, aktif: !!t.aktif, teamCount: teams.length, fixtureCount: fixtures.length, playedMatches: played, teams, fixtures };
      });
      return json(res, 200, { tournaments: list });
    }

    // GET /admin/rpg
    else if (path === '/admin/rpg' && req.method === 'GET') {
      const allUsers = db.getAllUsers();
      const all = db.get('rpg', {});
      const list = Object.entries(all).map(([id, c]) => ({
        userId: id, userName: stripName(allUsers[id]?.name),
        level: c.level||1, xp: c.xp||0, hp: c.hp||100, maxHp: c.maxHp||100,
        atk: c.atk||10, def: c.def||5, gold: c.gold||0,
        potions: c.potions||0, location: c.location||'koy',
        weapon: c.weapon||null, armor: c.armor||null, pet: c.pet||null,
        highestFloor: c.highestFloor||0,
        stats: c.stats||{won:0,lost:0,goldEarned:0,goldSpent:0,monstersKilled:0},
        powers: c.powers||[],
      }));
      return json(res, 200, { characters: list, total: list.length });
    }

    // GET /admin/training
    else if (path === '/admin/training' && req.method === 'GET') {
      const allUsers = db.getAllUsers();
      const all = db.get('antreman', {});
      const list = Object.entries(all).map(([id, count]) => ({
        userId: id, userName: stripName(allUsers[id]?.name), count
      })).sort((a, b) => b.count - a.count);
      return json(res, 200, { training: list, total: list.length });
    }

    // GET /admin/giveaways
    else if (path === '/admin/giveaways' && req.method === 'GET') {
      const allUsers = db.getAllUsers();
      const all = db.get('cekiliş', {});
      const list = Object.entries(all).map(([id, g]) => ({
        id, prize: g.prize||'—', channelId: g.channelId||'',
        endTime: g.endTime||null, hostId: g.hostId||'',
        hostName: stripName(allUsers[g.hostId]?.name),
        winnerCount: g.winnerCount||1, entrantCount: (g.entrants||[]).length,
        ended: !!g.ended,
      }));
      return json(res, 200, { giveaways: list });
    }

    // GET /admin/trivia
    else if (path === '/admin/trivia' && req.method === 'GET') {
      const all = db.get('trivia', {});
      const list = Object.entries(all).map(([id, t]) => ({
        id, idx: t.idx||0, odul: t.odul||0,
        dogruCevap: t.dogruCevap||null,
        secenekler: t.secenekler||[], cevaplandi: !!t.cevaplandi,
      }));
      return json(res, 200, { trivia: list });
    }

    // GET /admin/snipe?guildId=X
    else if (path === '/admin/snipe' && req.method === 'GET') {
      const guildId = parsed.query.guildId;
      if (!guildId) return json(res, 400, { error: 'guildId required' });
      const channels = db.get(`snipe.${guildId}`, {});
      const list = Object.entries(channels).map(([chId, msg]) => ({
        channelId: chId, content: msg.content||'',
        author: msg.author||'', authorId: msg.authorId||'',
        avatar: msg.avatar||'', deletedAt: msg.deletedAt||null,
      }));
      return json(res, 200, { guildId, snipe: list });
    }

    // GET /admin/registration-history?guildId=X
    else if (path === '/admin/registration-history' && req.method === 'GET') {
      const guildId = parsed.query.guildId;
      if (!guildId) return json(res, 400, { error: 'guildId required' });
      const all = db.get(`kayitGecmisi.${guildId}`, {});
      const allUsers = db.getAllUsers();
      const list = Object.entries(all).map(([userId, info]) => ({
        userId, userName: stripName(allUsers[userId]?.name),
        registeredName: stripName(info.name)||'', role: info.role||'',
        kayitEden: info.kayitEden||'',
        kayitEdenName: stripName(allUsers[info.kayitEden]?.name),
        timestamp: info.timestamp||null,
      }));
      list.sort((a, b) => (b.timestamp||'').localeCompare(a.timestamp||''));
      return json(res, 200, { guildId, history: list, total: list.length });
    }

    // POST /api/send-message — Send DM to user
    else if (path === '/api/send-message' && req.method === 'POST') {
      const body = await readBody(req);
      const { userId, message } = body;
      if (!userId || !message) return json(res, 400, { error: 'userId and message required' });
      if (!botInstance) return json(res, 503, { error: 'Bot not ready' });
      try {
        const user = await botInstance.users.fetch(userId);
        await user.send(message);
        return json(res, 200, { ok: true, userId });
      } catch (e) {
        return json(res, 500, { error: e.message });
      }
    }

    // GET /api/guild-members?guildId=X — List members of a guild
    else if (path === '/api/guild-members' && req.method === 'GET') {
      const guildId = parsed.query.guildId;
      if (!guildId) return json(res, 400, { error: 'guildId required' });
      if (!botInstance) return json(res, 503, { error: 'Bot not ready' });
      const guild = botInstance.guilds.cache.get(guildId);
      if (!guild) return json(res, 404, { error: 'Guild not found' });
      const members = guild.members.cache.map(m => ({
        id: m.id, username: m.user.username, displayName: m.displayName,
        bot: m.user.bot, joinedAt: m.joinedAt,
        roles: m.roles.cache.map(r => ({ id: r.id, name: r.name })),
      }));
      return json(res, 200, { guildId, guildName: guild.name, members, total: members.length });
    }

    // GET /api/guild-channels?guildId=X — List channels of a guild
    else if (path === '/api/guild-channels' && req.method === 'GET') {
      const guildId = parsed.query.guildId;
      if (!guildId) return json(res, 400, { error: 'guildId required' });
      if (!botInstance) return json(res, 503, { error: 'Bot not ready' });
      const guild = botInstance.guilds.cache.get(guildId);
      if (!guild) return json(res, 404, { error: 'Guild not found' });
      const channels = guild.channels.cache
        .filter(c => c.type === 0) // text channels
        .map(c => ({ id: c.id, name: c.name }));
      return json(res, 200, { guildId, guildName: guild.name, channels });
    }

    // POST /api/send-channel-message — Send message to a channel
    else if (path === '/api/send-channel-message' && req.method === 'POST') {
      const body = await readBody(req);
      const { channelId, message } = body;
      if (!channelId || !message) return json(res, 400, { error: 'channelId and message required' });
      if (!botInstance) return json(res, 503, { error: 'Bot not ready' });
      try {
        const channel = await botInstance.channels.fetch(channelId);
        await channel.send(message);
        return json(res, 200, { ok: true, channelId });
      } catch (e) {
        return json(res, 500, { error: e.message });
      }
    }

    // GET /koruma — Koruma Dashboard
    else if (path === '/koruma' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(KORUMA_HTML);
    }

    else {
      json(res, 404, { error: 'Not found' });
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[API] Status server running on port ${PORT}`);
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      PORT++;
      console.log(`[API] Port ${PORT - 1} in use, trying ${PORT}`);
      server.listen(PORT, '0.0.0.0');
    } else {
      console.error('[API] Server error:', e.message);
    }
  });
}

module.exports = { setBot, startServer };
