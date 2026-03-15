module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GRIFFO — Inspector SpecParts v3.0</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box }
        :root { --p: #00549F; --a: #00ADD0; --d: #005B82; --bg: #F0F4F8; --c: #FFF; --t: #0D1B2A; --m: #4A6175 }
        body { font-family: 'Montserrat', sans-serif; background: var(--bg); color: var(--t) }
        .header { background: linear-gradient(135deg, var(--d), var(--p)); padding: 14px 20px; color: #fff; display: flex; align-items: center }
        .header h1 { font-size: 16px; font-weight: 800 }
        .header p { font-size: 11px; opacity: .8; margin-top: 1px }
        .header a { color: rgba(255,255,255,.7); font-size: 11px; font-weight: 600; text-decoration: none; margin-left: auto }
        .toolbar { background: var(--c); padding: 10px 14px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; border-bottom: 1px solid #e0e8f0; box-shadow: 0 2px 8px rgba(0,84,159,.08) }
        .toolbar input { padding: 7px 10px; border: 1.5px solid rgba(0,84,159,.2); border-radius: 8px; font-size: 12px; font-family: inherit; outline: none; width: 200px }
        .toolbar input:focus { border-color: var(--p) }
        .toolbar select { padding: 7px 10px; border: 1.5px solid rgba(0,84,159,.2); border-radius: 8px; font-size: 12px; font-family: inherit; outline: none; background: var(--c); cursor: pointer }
        .btn { padding: 7px 14px; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; font-family: inherit; cursor: pointer }
        .btn-p { background: var(--p); color: #fff }
        .btn-s { background: rgba(0,84,159,.1); color: var(--p) }
        .btn:disabled { opacity: .5 }
        .stats { display: flex; gap: 12px; padding: 8px 14px; background: #e8f0fb; flex-wrap: wrap; font-size: 11px }
        .stat { color: var(--p); font-weight: 700 }
        .stat span { color: var(--m); font-weight: 500 }
        /* TABLA CON SCROLL HORIZONTAL */
        .wrap { width: 100%; overflow-x: auto; overflow-y: visible }
        table { border-collapse: collapse; font-size: 11px; white-space: nowrap }
        th { background: var(--p); color: #fff; padding: 9px 8px; text-align: left; font-size: 9px; font-weight: 700; border-right: 1px solid rgba(255,255,255,.15); min-width: 90px; cursor: pointer; user-select: none }
        th.g1 { background: #003A75 }
        th.g2 { background: #005B82 }
        th.g3 { background: #00ADD0 }
        th.g4 { background: #007a9e }
        th:hover { opacity: .85 }
        td { padding: 7px 8px; border-bottom: 1px solid #e8eef5; border-right: 1px solid #f0f4f8; max-width: 160px; overflow: hidden; text-overflow: ellipsis }
        tr:hover td { background: rgba(0,84,159,.04); cursor: pointer }
        tr:nth-child(even) td { background: #fafcff }
        .code { color: var(--p); font-weight: 800 }
        .nv { color: #ccc; font-size: 10px }
        .f1 { color: #27ae60; font-weight: 700 }
        .f0 { color: #e53e3e; font-weight: 700 }
        .tcat { display: inline-block; padding: 2px 5px; border-radius: 4px; font-size: 9px; font-weight: 700; background: rgba(0,173,208,.15); color: var(--a) }
        .tok { display: inline-block; padding: 2px 5px; border-radius: 4px; font-size: 9px; font-weight: 700; background: rgba(39,174,96,.15); color: #27ae60 }
        .loading { text-align: center; padding: 60px; color: var(--m) }
        .spin { width: 36px; height: 36px; border: 4px solid rgba(0,84,159,.2); border-top-color: var(--p); border-radius: 50%; animation: sp 1s linear infinite; margin: 0 auto 14px }
        @keyframes sp { to { transform: rotate(360deg) } }
        .ov { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 999; display: none }
        .ov.on { display: block }
        .pan { position: fixed; right: 0; top: 0; width: min(520px,100vw); height: 100vh; background: var(--c); z-index: 1000; display: none; flex-direction: column; box-shadow: -4px 0 24px rgba(0,0,0,.15) }
        .pan.on { display: flex }
        .ph { background: linear-gradient(135deg,var(--d),var(--p)); padding: 14px 16px; color: #fff; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0 }
        .ph h2 { font-size: 20px; font-weight: 900 }
        .pc { background: rgba(255,255,255,.2); border: none; color: #fff; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 16px }
        .pb { padding: 16px; overflow-y: auto; flex: 1 }
        .sec { margin-bottom: 14px }
        .sec-t { font-size: 9px; font-weight: 700; color: var(--m); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #eee }
        .dr { display: flex; gap: 8px; margin-bottom: 4px; font-size: 11px }
        .dl { color: var(--m); font-weight: 600; min-width: 130px; flex-shrink: 0; font-size: 10px }
        .dv { color: var(--t); word-break: break-word }
        .pi { width: 100%; max-height: 150px; object-fit: contain; border-radius: 8px; border: 1px solid #eee; background: #f5f5f5; margin-bottom: 6px }
        pre { font-size: 9px; background: #f8fafc; padding: 8px; border-radius: 6px; overflow-x: auto; color: #555; line-height: 1.4; max-height: 400px; overflow-y: auto }
        .ft { padding: 8px 14px; font-size: 10px; color: var(--m); border-top: 1px solid #e8eef5 }
    </style>
</head>
<body>
<div class="header">
    <div><h1>Inspector SpecParts — Todos los campos originales</h1><p>GRIFFO SRL · Solo uso interno · v3.0</p></div>
    <a href="/">← Volver a la app</a>
</div>
<div class="toolbar">
    <button class="btn btn-p" id="btn-load" onclick="load()">▶ Cargar</button>
    <input type="text" id="search" placeholder="Buscar..." oninput="filter()" disabled>
    <select id="f-cat" onchange="filter()" disabled><option value="">Todas las categorías</option></select>
    <select id="f-prod" onchange="filter()" disabled><option value="">Todos los product</option></select>
    <button class="btn btn-s" id="btn-csv" onclick="exportCSV()" disabled>⬇ CSV</button>
    <span id="status" style="font-size:10px;color:var(--m);margin-left:auto"></span>
</div>
<div id="stats" class="stats" style="display:none"></div>
<div id="main"><div class="loading"><p style="color:var(--m)">Presioná <strong>Cargar</strong> para comenzar</p></div></div>
<div class="ov" id="ov" onclick="closePan()"></div>
<div class="pan" id="pan">
    <div class="ph"><h2 id="pan-code"></h2><button class="pc" onclick="closePan()">✕</button></div>
    <div class="pb" id="pan-body"></div>
</div>
<script>
let all=[],filt=[],attrs=[],sc=null,sa=true;

async function load(){
    const btn=document.getElementById('btn-load');
    btn.disabled=true; btn.textContent='⏳ Cargando...';
    document.getElementById('main').innerHTML='<div class="loading"><div class="spin"></div><p id="msg">Conectando...</p></div>';
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
    const as=new Set();
    all.forEach(p=>(p.attributes||[]).forEach(a=>{ if(a.name) as.add(a.name); }));
    attrs=[...as].sort();
    const cats=[...new Set(all.map(p=>p.category).filter(Boolean))].sort();
    const prods=[...new Set(all.map(p=>p.product).filter(Boolean))].sort();
    document.getElementById('stats').innerHTML=
        st('Total',all.length)+st('category',cats.length)+st('product',prods.length)+
        st('pictures>0',all.filter(p=>p.pictures&&p.pictures.length).length)+
        st('attributes>0',all.filter(p=>p.attributes&&p.attributes.length).length)+
        st('vehicles>0',all.filter(p=>p.vehicles&&p.vehicles.length).length)+
        st('links>0',all.filter(p=>p.links&&p.links.length).length)+
        st('is_kit=1',all.filter(p=>p.is_kit==1).length)+
        st('discontinued=1',all.filter(p=>p.discontinued==1).length);
    document.getElementById('stats').style.display='flex';
    fillSel('f-cat',cats); fillSel('f-prod',prods);
    ['search','f-cat','f-prod','btn-csv'].forEach(id=>document.getElementById(id).disabled=false);
    document.getElementById('btn-load').textContent='↻ Recargar';
    document.getElementById('btn-load').disabled=false;
    document.getElementById('status').textContent=all.length+' productos';
    render();
}

function st(l,v){ return \`<div class="stat">\${l}: <span>\${v}</span></div>\`; }
function fillSel(id,items){
    const sel=document.getElementById(id);
    const f=sel.options[0].text;
    sel.innerHTML=\`<option value="">\${f}</option>\`;
    items.forEach(i=>sel.innerHTML+=\`<option value="\${e(i)}">\${e(i)}</option>\`);
}

function filter(){
    const q=document.getElementById('search').value.toLowerCase().trim();
    const cat=document.getElementById('f-cat').value;
    const prod=document.getElementById('f-prod').value;
    filt=all.filter(p=>{
        if(cat&&p.category!==cat) return false;
        if(prod&&p.product!==prod) return false;
        if(q) return q.split(' ').every(w=>JSON.stringify(p).toLowerCase().includes(w));
        return true;
    });
    render();
}

function ga(p,name){ const a=(p.attributes||[]).find(a=>a.name===name); return a?(a.value||'')+(a.unit?' '+a.unit:''):''; }
function nv(v){ return (v===null||v===undefined||v==='')?'<span class="nv">null</span>':e(String(v)); }
function fl(v){ return (v===null||v===undefined)?'<span class="nv">null</span>':v==1?'<span class="f1">1</span>':'<span class="f0">0</span>'; }
function cn(arr){ const n=arr?arr.length:0; return n>0?\`<strong style="color:var(--p)">\${n}</strong>\`:'<span class="nv">0</span>'; }

const COLS=[
    {k:'code',l:'code',g:'g1'},{k:'product',l:'product',g:'g1'},{k:'description',l:'description',g:'g1'},
    {k:'category',l:'category',g:'g1'},{k:'id',l:'id',g:'g1'},{k:'slug',l:'slug',g:'g1'},
    {k:'safe_code',l:'safe_code',g:'g1'},{k:'brand',l:'brand',g:'g1'},{k:'observation',l:'observation',g:'g1'},
    {k:'updated_at',l:'updated_at',g:'g1'},{k:'is_kit',l:'is_kit',g:'g2'},{k:'oem',l:'oem',g:'g2'},
    {k:'national_industry',l:'national_industry',g:'g2'},{k:'discontinued',l:'discontinued',g:'g2'},
    {k:'enabled',l:'enabled',g:'g2'},{k:'package_weight',l:'package_weight',g:'g1'},
    {k:'package_length',l:'package_length',g:'g1'},{k:'package_width',l:'package_width',g:'g1'},
    {k:'package_height',l:'package_height',g:'g1'},{k:'_pictures',l:'pictures (n)',g:'g3'},
    {k:'_links',l:'links (n)',g:'g3'},{k:'_links_url',l:'links url',g:'g3'},
    {k:'_components',l:'components (n)',g:'g3'},{k:'_vehicles',l:'vehicles (n)',g:'g3'},
    {k:'_reference',l:'reference (n)',g:'g3'},{k:'_cross',l:'cross (n)',g:'g3'},
    {k:'_ean',l:'ean (n)',g:'g3'},{k:'_company_id',l:'company_id (n)',g:'g3'},
];

function render(){
    let h='<div class="wrap"><table><thead><tr>';
    COLS.forEach(c=>{
        const arrow=sc===c.k?(sa?' ▲':' ▼'):'';
        h+=\`<th class="\${c.g}" onclick="sortBy('\${c.k}')">\${c.l}\${arrow}</th>\`;
    });
    attrs.forEach(a=>h+=\`<th class="g4">\${e(a)}</th>\`);
    h+='</tr></thead><tbody>';

    filt.forEach((p,i)=>{
        const lu=p.links&&p.links.length?(p.links[0].url||p.links[0].link||''):'';
        h+=\`<tr onclick="showD(\${i})">\`;
        h+=\`<td class="code">\${e(p.code||'')}</td>\`;
        h+=\`<td>\${e(p.product||'')}</td>\`;
        h+=\`<td title="\${e(p.description)}">\${e(p.description||'')}</td>\`;
        h+=\`<td><span class="tcat">\${e(p.category||'')}</span></td>\`;
        h+=\`<td>\${nv(p.id)}</td>\`;
        h+=\`<td>\${e(p.slug||'')}</td>\`;
        h+=\`<td>\${nv(p.safe_code)}</td>\`;
        h+=\`<td>\${nv(p.brand)}</td>\`;
        h+=\`<td title="\${e(p.observation)}">\${nv(p.observation)}</td>\`;
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
        h+=\`<td style="text-align:center">\${cn(p.pictures)}</td>\`;
        h+=\`<td style="text-align:center">\${cn(p.links)}</td>\`;
        h+=\`<td style="max-width:200px">\${lu?\`<a href="\${e(lu)}" target="_blank" style="color:var(--a);font-size:9px" onclick="event.stopPropagation()">\${e(lu)}</a>\`:'<span class="nv">—</span>'}</td>\`;
        h+=\`<td style="text-align:center">\${cn(p.components)}</td>\`;
        h+=\`<td style="text-align:center">\${cn(p.vehicles)}</td>\`;
        h+=\`<td style="text-align:center">\${cn(p.reference)}</td>\`;
        h+=\`<td style="text-align:center">\${cn(p.cross)}</td>\`;
        h+=\`<td style="text-align:center">\${cn(p.ean)}</td>\`;
        h+=\`<td style="text-align:center">\${cn(p.company_id)}</td>\`;
        attrs.forEach(name=>{ const av=ga(p,name); h+=\`<td>\${av?e(av):'<span class="nv">—</span>'}</td>\`; });
        h+='</tr>';
    });
    h+='</tbody></table></div>';
    h+=\`<div class="ft">Mostrando \${filt.length} de \${all.length} productos · Clic en fila para ver detalle</div>\`;
    document.getElementById('main').innerHTML=h;
}

function sortBy(col){
    if(sc===col) sa=!sa; else{ sc=col; sa=true; }
    filt.sort((a,b)=>{
        let va=gcv(a,col),vb=gcv(b,col);
        const na=parseFloat(va),nb=parseFloat(vb);
        if(!isNaN(na)&&!isNaN(nb)) return sa?na-nb:nb-na;
        return sa?String(va||'').localeCompare(String(vb||'')):String(vb||'').localeCompare(String(va||''));
    });
    render();
}
function gcv(p,col){
    if(col==='_links_url') return p.links&&p.links.length?(p.links[0].url||p.links[0].link||''):'';
    if(col.startsWith('_')){ const k=col.slice(1); return p[k]?p[k].length:0; }
    return p[col];
}

function showD(i){
    const p=filt[i]; if(!p) return;
    document.getElementById('pan-code').textContent=p.code||'';
    document.getElementById('ov').classList.add('on');
    document.getElementById('pan').classList.add('on');
    const sf=['id','slug','brand','category','product','code','safe_code','description','observation',
        'package_weight','package_length','package_width','package_height',
        'is_kit','oem','national_industry','discontinued','enabled','updated_at'];
    let h='<div class="sec"><div class="sec-t">Campos escalares</div>';
    sf.forEach(f=>h+=dr(\`<code style="font-size:9px;background:#f0f4f8;padding:1px 4px;border-radius:3px">\${f}</code>\`,nv(p[f])));
    h+='</div>';
    if(p.pictures&&p.pictures.length){
        h+=\`<div class="sec"><div class="sec-t">pictures (\${p.pictures.length})</div>\`;
        p.pictures.forEach((pic,i)=>{
            if(pic.image_url) h+=\`<img class="pi" src="\${e(pic.image_url)}" onerror="this.style.display='none'">\`;
            Object.keys(pic).forEach(k=>h+=dr(\`pictures[\${i}].\${k}\`,k==='image_url'?\`<a href="\${e(pic[k])}" target="_blank" style="color:var(--a);font-size:9px;word-break:break-all">\${e(pic[k])}</a>\`:nv(pic[k])));
        });
        h+='</div>';
    }
    if(p.attributes&&p.attributes.length){
        h+=\`<div class="sec"><div class="sec-t">attributes (\${p.attributes.length})</div>\`;
        p.attributes.forEach((a,i)=>{
            h+=\`<div style="margin-bottom:4px;padding:5px 8px;background:#f0f4f8;border-radius:6px;font-size:10px">\`;
            h+=\`<div><code>attributes[\${i}].name</code>: <strong>\${e(a.name||'')}</strong></div>\`;
            h+=\`<div><code>attributes[\${i}].value</code>: \${e(a.value||'')}</div>\`;
            h+=\`<div><code>attributes[\${i}].unit</code>: \${nv(a.unit)}</div>\`;
            h+='</div>';
        });
        h+='</div>';
    }
    if(p.links&&p.links.length){
        h+=\`<div class="sec"><div class="sec-t">links (\${p.links.length})</div>\`;
        p.links.forEach((l,i)=>Object.keys(l).forEach(k=>{
            const url=l.url||l.link||'';
            h+=dr(\`links[\${i}].\${k}\`,(k==='url'||k==='link')?\`<a href="\${e(url)}" target="_blank" style="color:var(--a);word-break:break-all">\${e(url)}</a>\`:nv(l[k]));
        }));
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
    ['reference','cross','seller'].forEach(arr=>{
        if(p[arr]&&p[arr].length){
            h+=\`<div class="sec"><div class="sec-t">\${arr} (\${p[arr].length})</div>\`;
            p[arr].forEach((item,i)=>Object.keys(item).forEach(k=>h+=dr(\`\${arr}[\${i}].\${k}\`,nv(item[k]))));
            h+='</div>';
        }
    });
    h+='<div class="sec"><div class="sec-t">ean / company_id</div>';
    h+=dr('ean',p.ean&&p.ean.length?e(p.ean.join(', ')):'<span class="nv">[]</span>');
    h+=dr('company_id',p.company_id&&p.company_id.length?e(String(p.company_id)):'<span class="nv">[]</span>');
    h+='</div>';
    h+='<div class="sec"><div class="sec-t">JSON raw completo</div>';
    h+=\`<pre>\${e(JSON.stringify(p,null,2))}</pre></div>\`;
    document.getElementById('pan-body').innerHTML=h;
}

function dr(label,value){ return \`<div class="dr"><div class="dl">\${label}</div><div class="dv">\${value||'<span class="nv">null</span>'}</div></div>\`; }
function closePan(){ document.getElementById('pan').classList.remove('on'); document.getElementById('ov').classList.remove('on'); }
function e(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function exportCSV(){
    const fh=['code','product','description','category','id','slug','safe_code','brand','observation',
        'updated_at','is_kit','oem','national_industry','discontinued','enabled',
        'package_weight','package_length','package_width','package_height',
        'pictures_n','links_n','links_url','components_n','vehicles_n','reference_n','cross_n','ean_n','company_id_n'];
    const headers=[...fh,...attrs.map(a=>'attr::'+a)];
    const rows=[headers];
    filt.forEach(p=>{
        const lu=p.links&&p.links.length?(p.links[0].url||p.links[0].link||''):'';
        const fv=[p.code||'',p.product||'',p.description||'',p.category||'',p.id||'',p.slug||'',
            p.safe_code||'',p.brand||'',p.observation||'',p.updated_at||'',
            p.is_kit,p.oem,p.national_industry,p.discontinued,p.enabled,
            p.package_weight,p.package_length,p.package_width,p.package_height,
            p.pictures?p.pictures.length:0,p.links?p.links.length:0,lu,
            p.components?p.components.length:0,p.vehicles?p.vehicles.length:0,
            p.reference?p.reference.length:0,p.cross?p.cross.length:0,
            p.ean?p.ean.length:0,p.company_id?p.company_id.length:0];
        const av=attrs.map(name=>ga(p,name));
        rows.push([...fv,...av]);
    });
    const csv=rows.map(r=>r.map(c=>'"'+String(c===null||c===undefined?'':c).replace(/"/g,'""')+'"').join(',')).join('\\n');
    const blob=new Blob(['\\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download='specparts-'+new Date().toISOString().slice(0,10)+'.csv'; a.click();
    URL.revokeObjectURL(url);
}
</script>
</body>
</html>
`);
};
