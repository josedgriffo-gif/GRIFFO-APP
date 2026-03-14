module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GRIFFO — Inspector SpecParts</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box }
        :root { --p: #00549F; --a: #00ADD0; --d: #005B82; --bg: #F0F4F8; --c: #FFF; --t: #0D1B2A; --m: #4A6175 }
        body { font-family: 'Montserrat', sans-serif; background: var(--bg); color: var(--t) }
        .header { background: linear-gradient(135deg, var(--d), var(--p)); padding: 14px 20px; color: #fff; display: flex; align-items: center; gap: 12px }
        .header h1 { font-size: 16px; font-weight: 800 }
        .header p { font-size: 11px; opacity: .8; margin-top: 1px }
        .header a { color: rgba(255,255,255,.7); font-size: 11px; font-weight: 600; text-decoration: none; margin-left: auto }
        .toolbar { background: var(--c); padding: 10px 14px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; border-bottom: 1px solid #e0e8f0; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,84,159,.08) }
        .toolbar input { padding: 7px 10px; border: 1.5px solid rgba(0,84,159,.2); border-radius: 8px; font-size: 12px; font-family: inherit; outline: none; width: 200px }
        .toolbar input:focus { border-color: var(--p) }
        .toolbar select { padding: 7px 10px; border: 1.5px solid rgba(0,84,159,.2); border-radius: 8px; font-size: 12px; font-family: inherit; outline: none; background: var(--c); cursor: pointer }
        .btn { padding: 7px 14px; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap }
        .btn-primary { background: var(--p); color: #fff }
        .btn-secondary { background: rgba(0,84,159,.1); color: var(--p) }
        .btn:disabled { opacity: .5; cursor: not-allowed }
        .stats { display: flex; gap: 12px; padding: 8px 14px; background: #e8f0fb; flex-wrap: wrap; font-size: 11px }
        .stat { color: var(--p); font-weight: 700 }
        .stat span { color: var(--m); font-weight: 500 }
        .table-wrap { overflow-x: scroll; -webkit-overflow-scrolling: touch; width: 100%; display: block }
        table { border-collapse: collapse; font-size: 11px; min-width: 3000px; width: max-content }
        thead { position: sticky; top: 49px; z-index: 99 }
        th { background: var(--p); color: #fff; padding: 9px 7px; text-align: left; white-space: nowrap; font-size: 9px; font-weight: 700; text-transform: none; letter-spacing: .3px; cursor: pointer; user-select: none; border-right: 1px solid rgba(255,255,255,.15) }
        th:hover { background: var(--d) }
        th.sorted { background: var(--d) }
        th.g-basic { background: #003A75 }
        th.g-flags { background: #005B82 }
        th.g-counts { background: #00ADD0 }
        th.g-attrs { background: #007a9e }
        td { padding: 7px; border-bottom: 1px solid #e8eef5; border-right: 1px solid #f0f4f8; vertical-align: middle; white-space: nowrap; max-width: 160px; overflow: hidden; text-overflow: ellipsis }
        tr:hover td { background: rgba(0,84,159,.04); cursor: pointer }
        tr:nth-child(even) td { background: #fafcff }
        .code { color: var(--p); font-weight: 800 }
        .nv { color: #ccc; font-style: italic; font-size: 10px }
        .f1 { color: #27ae60; font-weight: 700 }
        .f0 { color: #e53e3e; font-weight: 700 }
        .tag-cat { display: inline-block; padding: 2px 5px; border-radius: 4px; font-size: 9px; font-weight: 700; background: rgba(0,173,208,.15); color: var(--a) }
        .tag-ok { display: inline-block; padding: 2px 5px; border-radius: 4px; font-size: 9px; font-weight: 700; background: rgba(39,174,96,.15); color: #27ae60 }
        .loading { text-align: center; padding: 60px; color: var(--m) }
        .spinner { width: 36px; height: 36px; border: 4px solid rgba(0,84,159,.2); border-top-color: var(--p); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 14px }
        @keyframes spin { to { transform: rotate(360deg) } }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 999; display: none }
        .overlay.on { display: block }
        .panel { position: fixed; right: 0; top: 0; width: min(520px, 100vw); height: 100vh; background: var(--c); z-index: 1000; display: none; flex-direction: column; box-shadow: -4px 0 24px rgba(0,0,0,.15) }
        .panel.on { display: flex }
        .panel-hdr { background: linear-gradient(135deg, var(--d), var(--p)); padding: 14px 16px; color: #fff; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0 }
        .panel-hdr h2 { font-size: 20px; font-weight: 900 }
        .panel-close { background: rgba(255,255,255,.2); border: none; color: #fff; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 16px }
        .panel-body { padding: 16px; overflow-y: auto; flex: 1 }
        .sec { margin-bottom: 16px }
        .sec-t { font-size: 9px; font-weight: 700; color: var(--m); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #eee }
        .drow { display: flex; gap: 8px; margin-bottom: 5px; font-size: 11px }
        .dl { color: var(--m); font-weight: 600; min-width: 130px; flex-shrink: 0; font-size: 10px }
        .dv { color: var(--t); word-break: break-word }
        .pimg { width: 100%; max-height: 150px; object-fit: contain; border-radius: 8px; border: 1px solid #eee; background: #f5f5f5; margin-bottom: 6px }
        pre { font-size: 9px; background: #f8fafc; padding: 8px; border-radius: 6px; overflow-x: auto; color: #555; line-height: 1.4; max-height: 400px; overflow-y: auto }
        .footer { padding: 8px 14px; font-size: 10px; color: var(--m); border-top: 1px solid #e8eef5 }
    </style>
</head>
<body>
<div class="header">
    <div>
        <h1>Inspector SpecParts — Todos los campos originales</h1>
        <p>GRIFFO SRL · Solo uso interno · v2.0</p>
    </div>
    <a href="/">← Volver a la app</a>
</div>
<div class="toolbar">
    <button class="btn btn-primary" id="btn-load" onclick="loadCatalog()">▶ Cargar</button>
    <input type="text" id="search" placeholder="Buscar..." oninput="filterTable()" disabled>
    <select id="filter-cat" onchange="filterTable()" disabled><option value="">Todas las categorías</option></select>
    <select id="filter-prod" onchange="filterTable()" disabled><option value="">Todos los product</option></select>
    <button class="btn btn-secondary" id="btn-csv" onclick="exportCSV()" disabled>⬇ CSV completo</button>
    <span id="status" style="font-size:10px;color:var(--m);margin-left:auto"></span>
</div>
<div id="stats" class="stats" style="display:none"></div>
<div id="main"><div class="loading"><p style="color:var(--m);font-size:13px">Presioná <strong>Cargar</strong> para comenzar</p></div></div>
<div class="overlay" id="overlay" onclick="closePanel()"></div>
<div class="panel" id="panel">
    <div class="panel-hdr"><h2 id="panel-code"></h2><button class="panel-close" onclick="closePanel()">✕</button></div>
    <div class="panel-body" id="panel-body"></div>
</div>
<script>
let all=[], filt=[], attrNames=[], sortCol=null, sortAsc=true;

async function loadCatalog(){
    const btn=document.getElementById('btn-load');
    btn.disabled=true; btn.textContent='⏳ Cargando...';
    document.getElementById('main').innerHTML='<div class="loading"><div class="spinner"></div><p id="msg">Conectando...</p></div>';
    document.getElementById('stats').style.display='none';
    try{
        const r=await fetch('/api/products');
        if(!r.ok) throw new Error('HTTP '+r.status);
        const d=await r.json();
        all=d.products||[];
        if(!all.length) throw new Error('Sin productos');
        buildUI();
    }catch(e){
        document.getElementById('main').innerHTML='<div class="loading"><p style="color:#e53e3e">❌ '+e.message+'</p></div>';
        btn.disabled=false; btn.textContent='▶ Cargar';
    }
}

function buildUI(){
    filt=[...all];
    const attrSet=new Set();
    all.forEach(p=>(p.attributes||[]).forEach(a=>{ if(a.name) attrSet.add(a.name); }));
    attrNames=[...attrSet].sort();

    const cats=[...new Set(all.map(p=>p.category).filter(Boolean))].sort();
    const prods=[...new Set(all.map(p=>p.product).filter(Boolean))].sort();

    document.getElementById('stats').innerHTML=
        st('Total',all.length)+st('category',cats.length)+st('product',prods.length)+
        st('pictures>0',all.filter(p=>p.pictures&&p.pictures.length).length)+
        st('attributes>0',all.filter(p=>p.attributes&&p.attributes.length).length)+
        st('vehicles>0',all.filter(p=>p.vehicles&&p.vehicles.length).length)+
        st('links>0',all.filter(p=>p.links&&p.links.length).length)+
        st('components>0',all.filter(p=>p.components&&p.components.length).length)+
        st('is_kit=1',all.filter(p=>p.is_kit==1).length)+
        st('discontinued=1',all.filter(p=>p.discontinued==1).length)+
        st('enabled=1',all.filter(p=>p.enabled==1).length);
    document.getElementById('stats').style.display='flex';

    fillSel('filter-cat',cats);
    fillSel('filter-prod',prods);
    ['search','filter-cat','filter-prod','btn-csv'].forEach(id=>document.getElementById(id).disabled=false);
    document.getElementById('btn-load').textContent='↻ Recargar';
    document.getElementById('btn-load').disabled=false;
    document.getElementById('status').textContent=all.length+' productos';
    renderTable();
}

function st(l,v){ return \`<div class="stat">\${l}: <span>\${v}</span></div>\`; }
function fillSel(id,items){
    const sel=document.getElementById(id);
    const first=sel.options[0].text;
    sel.innerHTML=\`<option value="">\${first}</option>\`;
    items.forEach(i=>sel.innerHTML+=\`<option value="\${esc(i)}">\${esc(i)}</option>\`);
}

function filterTable(){
    const q=document.getElementById('search').value.toLowerCase().trim();
    const cat=document.getElementById('filter-cat').value;
    const prod=document.getElementById('filter-prod').value;
    filt=all.filter(p=>{
        if(cat&&p.category!==cat) return false;
        if(prod&&p.product!==prod) return false;
        if(q) return q.split(' ').every(w=>JSON.stringify(p).toLowerCase().includes(w));
        return true;
    });
    renderTable();
}

function getAttr(p,name){
    const a=(p.attributes||[]).find(a=>a.name===name);
    if(!a) return '';
    return (a.value||'')+(a.unit?' '+a.unit:'');
}

function nv(v){ return (v===null||v===undefined||v==='')?'<span class="nv">null</span>':esc(String(v)); }
function fl(v){ return (v===null||v===undefined)?'<span class="nv">null</span>':v==1?'<span class="f1">1</span>':'<span class="f0">0</span>'; }
function cnt(arr){ const n=arr?arr.length:0; return n>0?\`<strong style="color:var(--p)">\${n}</strong>\`:'<span class="nv">0</span>'; }

function renderTable(){
    const fixedCols=[
        {k:'code',l:'code',g:'g-basic'},
        {k:'product',l:'product',g:'g-basic'},
        {k:'description',l:'description',g:'g-basic'},
        {k:'category',l:'category',g:'g-basic'},
        {k:'id',l:'id',g:'g-basic'},
        {k:'slug',l:'slug',g:'g-basic'},
        {k:'safe_code',l:'safe_code',g:'g-basic'},
        {k:'brand',l:'brand',g:'g-basic'},
        {k:'observation',l:'observation',g:'g-basic'},
        {k:'updated_at',l:'updated_at',g:'g-basic'},
        {k:'is_kit',l:'is_kit',g:'g-flags'},
        {k:'oem',l:'oem',g:'g-flags'},
        {k:'national_industry',l:'national_industry',g:'g-flags'},
        {k:'discontinued',l:'discontinued',g:'g-flags'},
        {k:'enabled',l:'enabled',g:'g-flags'},
        {k:'package_weight',l:'package_weight',g:'g-basic'},
        {k:'package_length',l:'package_length',g:'g-basic'},
        {k:'package_width',l:'package_width',g:'g-basic'},
        {k:'package_height',l:'package_height',g:'g-basic'},
        {k:'_pictures',l:'pictures (n)',g:'g-counts'},
        {k:'_links',l:'links (n)',g:'g-counts'},
        {k:'_links_url',l:'links (url)',g:'g-counts'},
        {k:'_components',l:'components (n)',g:'g-counts'},
        {k:'_vehicles',l:'vehicles (n)',g:'g-counts'},
        {k:'_reference',l:'reference (n)',g:'g-counts'},
        {k:'_cross',l:'cross (n)',g:'g-counts'},
        {k:'_ean',l:'ean (n)',g:'g-counts'},
        {k:'_company_id',l:'company_id (n)',g:'g-counts'},
    ];

    let h='<div class="table-wrap"><table><thead><tr>';
    fixedCols.forEach(c=>{
        const arrow=sortCol===c.k?(sortAsc?' ▲':' ▼'):'';
        h+=\`<th class="\${c.g}\${sortCol===c.k?' sorted':''}" onclick="sortBy('\${c.k}')">\${c.l}\${arrow}</th>\`;
    });
    attrNames.forEach(a=>{
        h+=\`<th class="g-attrs" title="\${esc(a)}">\${esc(a)}</th>\`;
    });
    h+='</tr></thead><tbody>';

    filt.forEach((p,i)=>{
        h+=\`<tr onclick="showDetail(\${i})">\`;
        h+=\`<td class="code">\${esc(p.code||'')}</td>\`;
        h+=\`<td title="\${esc(p.product)}">\${esc(p.product||'')}</td>\`;
        h+=\`<td title="\${esc(p.description)}">\${esc(p.description||'')}</td>\`;
        h+=\`<td><span class="tag-cat">\${esc(p.category||'')}</span></td>\`;
        h+=\`<td>\${nv(p.id)}</td>\`;
        h+=\`<td title="\${esc(p.slug)}" style="max-width:120px">\${esc(p.slug||'')}</td>\`;
        h+=\`<td>\${nv(p.safe_code)}</td>\`;
        h+=\`<td>\${nv(p.brand)}</td>\`;
        h+=\`<td title="\${esc(p.observation)}">\${nv(p.observation)}</td>\`;
        h+=\`<td style="font-size:9px">\${nv(p.updated_at)}</td>\`;
        h+=\`<td style="text-align:center">\${fl(p.is_kit)}</td>\`;
        h+=\`<td style="text-align:center">\${fl(p.oem)}</td>\`;
        h+=\`<td style="text-align:center">\${fl(p.national_industry)}</td>\`;
        h+=\`<td style="text-align:center">\${fl(p.discontinued)}</td>\`;
        h+=\`<td style="text-align:center">\${fl(p.enabled)}</td>\`;
        h+=\`<td style="text-align:center">\${nv(p.package_weight)}</td>\`;
        h+=\`<td style="text-align:center">\${nv(p.package_length)}</td>\`;
        h+=\`<td style="text-align:center">\${nv(p.package_width)}</td>\`;
        h+=\`<td style="text-align:center">\${nv(p.package_height)}</td>\`;
        h+=\`<td style="text-align:center">\${cnt(p.pictures)}</td>\`;
        h+=\`<td style="text-align:center">\${cnt(p.links)}</td>\`;
        const linkUrl = p.links && p.links.length > 0 ? (p.links[0].url || p.links[0].link || '') : '';
        h+=\`<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis">\${linkUrl ? \`<a href="\${linkUrl}" target="_blank" style="color:var(--a);font-size:9px">\${esc(linkUrl)}</a>\` : '<span class="nv">—</span>'}</td>\`;
        h+=\`<td style="text-align:center">\${cnt(p.components)}</td>\`;
        h+=\`<td style="text-align:center">\${cnt(p.vehicles)}</td>\`;
        h+=\`<td style="text-align:center">\${cnt(p.reference)}</td>\`;
        h+=\`<td style="text-align:center">\${cnt(p.cross)}</td>\`;
        h+=\`<td style="text-align:center">\${cnt(p.ean)}</td>\`;
        h+=\`<td style="text-align:center">\${cnt(p.company_id)}</td>\`;
        attrNames.forEach(name=>{
            const av=getAttr(p,name);
            h+=\`<td>\${av?esc(av):'<span class="nv">—</span>'}</td>\`;
        });
        h+='</tr>';
    });
    h+='</tbody></table></div>';
    h+=\`<div class="footer">Mostrando \${filt.length} de \${all.length} productos · Clic en fila para ver detalle completo</div>\`;
    document.getElementById('main').innerHTML=h;
}

function sortBy(col){
    if(sortCol===col) sortAsc=!sortAsc; else{ sortCol=col; sortAsc=true; }
    filt.sort((a,b)=>{
        let va=getColVal(a,col), vb=getColVal(b,col);
        const na=parseFloat(va), nb=parseFloat(vb);
        if(!isNaN(na)&&!isNaN(nb)) return sortAsc?na-nb:nb-na;
        return sortAsc?String(va||'').localeCompare(String(vb||'')):String(vb||'').localeCompare(String(va||''));
    });
    renderTable();
}

function getColVal(p,col){
    if(col==='_links_url'){ return p.links&&p.links.length?(p.links[0].url||p.links[0].link||''):''; }
    if(col.startsWith('_')){ const k=col.slice(1); return p[k]?p[k].length:0; }
    return p[col];
}

function showDetail(i){
    const p=filt[i]; if(!p) return;
    document.getElementById('panel-code').textContent=p.code||'';
    document.getElementById('overlay').classList.add('on');
    document.getElementById('panel').classList.add('on');

    const scalarFields=['id','slug','brand','category','product','code','safe_code','description','observation',
        'package_weight','package_length','package_width','package_height',
        'is_kit','oem','national_industry','discontinued','enabled','updated_at'];

    let h='<div class="sec"><div class="sec-t">Campos escalares</div>';
    scalarFields.forEach(f=>{ h+=dr(\`<code style="font-size:9px;background:#f0f4f8;padding:1px 4px;border-radius:3px">\${f}</code>\`, nv(p[f])); });
    h+='</div>';

    if(p.pictures&&p.pictures.length){
        h+=\`<div class="sec"><div class="sec-t">pictures (\${p.pictures.length})</div>\`;
        p.pictures.forEach((pic,i)=>{
            h+=\`<div style="margin-bottom:8px">\`;
            if(pic.image_url) h+=\`<img class="pimg" src="\${pic.image_url}" onerror="this.style.display='none'">\`;
            h+=dr(\`pictures[\${i}].image_url\`,\`<a href="\${esc(pic.image_url)}" target="_blank" style="color:var(--a);font-size:9px;word-break:break-all">\${esc(pic.image_url)}</a>\`);
            h+=dr(\`pictures[\${i}].is_blueprint\`,nv(pic.is_blueprint));
            h+=dr(\`pictures[\${i}].is_box\`,nv(pic.is_box));
            h+=dr(\`pictures[\${i}].order\`,nv(pic.order));
            h+='</div>';
        });
        h+='</div>';
    }

    if(p.attributes&&p.attributes.length){
        h+=\`<div class="sec"><div class="sec-t">attributes (\${p.attributes.length})</div>\`;
        p.attributes.forEach((a,i)=>{
            h+=\`<div style="margin-bottom:4px;padding:5px 8px;background:#f0f4f8;border-radius:6px">\`;
            h+=\`<div style="font-size:10px"><code>attributes[\${i}].name</code>: <strong>\${esc(a.name||'')}</strong></div>\`;
            h+=\`<div style="font-size:10px"><code>attributes[\${i}].value</code>: \${esc(a.value||'')}</div>\`;
            h+=\`<div style="font-size:10px"><code>attributes[\${i}].unit</code>: \${nv(a.unit)}</div>\`;
            h+='</div>';
        });
        h+='</div>';
    }

    if(p.links&&p.links.length){
        h+=\`<div class="sec"><div class="sec-t">links (\${p.links.length})</div>\`;
        p.links.forEach((l,i)=>{
            const url=l.url||l.link||'';
            Object.keys(l).forEach(k=>h+=dr(\`links[\${i}].\${k}\`,k==='url'||k==='link'?\`<a href="\${esc(url)}" target="_blank" style="color:var(--a);word-break:break-all">\${esc(url)}</a>\`:nv(l[k])));
        });
        h+='</div>';
    }

    if(p.components&&p.components.length){
        h+=\`<div class="sec"><div class="sec-t">components (\${p.components.length})</div>\`;
        p.components.forEach((c,i)=>Object.keys(c).forEach(k=>h+=dr(\`components[\${i}].\${k}\`,nv(c[k]))));
        h+='</div>';
    }

    if(p.vehicles&&p.vehicles.length){
        h+=\`<div class="sec"><div class="sec-t">vehicles (\${p.vehicles.length})</div>\`;
        p.vehicles.forEach((v,i)=>{
            h+=\`<div style="margin-bottom:8px;padding:6px 8px;background:#f0f4f8;border-radius:6px">\`;
            h+=\`<div style="font-size:10px;font-weight:700;color:var(--p);margin-bottom:4px">vehicles[\${i}]</div>\`;
            Object.keys(v).forEach(k=>h+=dr(\`<code style="font-size:9px">\${k}</code>\`,nv(v[k])));
            h+='</div>';
        });
        h+='</div>';
    }

    if(p.reference&&p.reference.length){
        h+=\`<div class="sec"><div class="sec-t">reference (\${p.reference.length})</div>\`;
        p.reference.forEach((r,i)=>Object.keys(r).forEach(k=>h+=dr(\`reference[\${i}].\${k}\`,nv(r[k]))));
        h+='</div>';
    }

    if(p.cross&&p.cross.length){
        h+=\`<div class="sec"><div class="sec-t">cross (\${p.cross.length})</div>\`;
        p.cross.forEach((c,i)=>Object.keys(c).forEach(k=>h+=dr(\`cross[\${i}].\${k}\`,nv(c[k]))));
        h+='</div>';
    }

    if(p.seller&&p.seller.length){
        h+=\`<div class="sec"><div class="sec-t">seller (\${p.seller.length})</div>\`;
        p.seller.forEach((s,i)=>Object.keys(s).forEach(k=>h+=dr(\`seller[\${i}].\${k}\`,nv(s[k]))));
        h+='</div>';
    }

    h+='<div class="sec"><div class="sec-t">ean / company_id</div>';
    h+=dr('ean',p.ean&&p.ean.length?esc(p.ean.join(', ')):'<span class="nv">[]</span>');
    h+=dr('company_id',p.company_id&&p.company_id.length?esc(String(p.company_id)):'<span class="nv">[]</span>');
    h+='</div>';

    h+='<div class="sec"><div class="sec-t">JSON raw completo</div>';
    h+=\`<pre>\${esc(JSON.stringify(p,null,2))}</pre>\`;
    h+='</div>';

    document.getElementById('panel-body').innerHTML=h;
}

function dr(label,value){
    return \`<div class="drow"><div class="dl">\${label}</div><div class="dv">\${value||'<span class="nv">null</span>'}</div></div>\`;
}

function closePanel(){
    document.getElementById('panel').classList.remove('on');
    document.getElementById('overlay').classList.remove('on');
}

function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function exportCSV(){
    const fixedH=['code','product','description','category','id','slug','safe_code','brand','observation',
        'updated_at','is_kit','oem','national_industry','discontinued','enabled',
        'package_weight','package_length','package_width','package_height',
        'pictures_n','links_n','components_n','vehicles_n','reference_n','cross_n','ean_n','company_id_n'];
    const headers=[...fixedH,...attrNames.map(a=>'attr::'+a)];
    const rows=[headers];
    filt.forEach(p=>{
        const fv=[p.code||'',p.product||'',p.description||'',p.category||'',p.id||'',p.slug||'',p.safe_code||'',
            p.brand||'',p.observation||'',p.updated_at||'',p.is_kit,p.oem,p.national_industry,
            p.discontinued,p.enabled,p.package_weight,p.package_length,p.package_width,p.package_height,
            p.pictures?p.pictures.length:0,p.links?p.links.length:0,p.components?p.components.length:0,
            p.vehicles?p.vehicles.length:0,p.reference?p.reference.length:0,p.cross?p.cross.length:0,
            p.ean?p.ean.length:0,p.company_id?p.company_id.length:0];
        const av=attrNames.map(name=>getAttr(p,name));
        rows.push([...fv,...av]);
    });
    const csv=rows.map(r=>r.map(c=>'"'+String(c===null||c===undefined?'':c).replace(/"/g,'""')+'"').join(',')).join('\\n');
    const blob=new Blob(['\\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download='specparts-raw-'+new Date().toISOString().slice(0,10)+'.csv'; a.click();
    URL.revokeObjectURL(url);
}
</script>
</body>
</html>
`);
};
