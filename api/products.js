const https = require('https');
const zlib = require('zlib');

function specpartsGet(path, token) {
  return new Promise(function(resolve, reject) {
    https.get({
      hostname: 'external-api.specparts.ai',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    }, function(apiRes) {
      var chunks = [];
      apiRes.on('data', function(c) { chunks.push(c); });
      apiRes.on('end', function() {
        var buf = Buffer.concat(chunks);
        var encoding = apiRes.headers['content-encoding'];
        if (encoding === 'gzip') {
          zlib.gunzip(buf, function(err, result) {
            if (err) {
              try { resolve(JSON.parse(buf.toString('utf8'))); }
              catch(e) { reject(new Error('Decompress failed')); }
            } else {
              try { resolve(JSON.parse(result.toString('utf8'))); }
              catch(e) { reject(new Error('JSON parse failed')); }
            }
          });
        } else {
          try { resolve(JSON.parse(buf.toString('utf8'))); }
          catch(e) { reject(new Error('JSON parse failed')); }
        }
      });
    }).on('error', reject);
  });
}

var cachedProducts = null;
var cacheTime = 0;
var CACHE_DURATION = 30 * 60 * 1000;

async function loadProducts() {
  if (cachedProducts && (Date.now() - cacheTime) < CACHE_DURATION) {
    return cachedProducts;
  }

  var tokenResp = await fetch('https://auth.specparts.ai/oauth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SPECPARTS_CLIENT_ID,
      client_secret: process.env.SPECPARTS_CLIENT_SECRET
    })
  });

  if (!tokenResp.ok) throw new Error('Auth failed');

  var tokenData = await tokenResp.json();
  var token = tokenData.access_token;

  var allProducts = [];
  var page = 1;
  var totalPages = 1;

  while (page <= totalPages) {
    var path = '/part/list?lang=1&limit=100&page=' + page + '&brand[]=GRIFFO&output=v1';
    var data = await specpartsGet(path, token);
    if (data && data.data) {
      allProducts = allProducts.concat(data.data);
      if (data.paging) totalPages = data.paging.pages || 1;
    } else { break; }
    page++;
  }

  var filtered = allProducts.filter(function(p) {
    var prod = (p.product || '').toUpperCase();
    if (prod === 'FUELLE SEMIEJE') return false;
    return true;
  });

  cachedProducts = filtered;
  cacheTime = Date.now();
  return filtered;
}

module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    var products = await loadProducts();
    return res.status(200).json({ total: products.length, products: products });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
