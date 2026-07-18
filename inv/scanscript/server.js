const https = require('https');
const fs    = require('fs');
const path  = require('path');

const KEY  = fs.readFileSync('192.168.0.27-key.pem');
const CERT = fs.readFileSync('192.168.0.27.pem');
const LOG  = path.join(__dirname, 'scanscript.log');
const PORT = 3000;

const MIME = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

const server = https.createServer({ key: KEY, cert: CERT }, (req, res) => {
  // ── POST /log ──────────────────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/log') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      const line = new Date().toISOString() + ' ' + body.trim() + '\n';
      fs.appendFile(LOG, line, err => {
        if (err) { res.writeHead(500); res.end('log error'); return; }
        res.writeHead(200);
        res.end('ok');
      });
    });
    return;
  }

  // ── Static files ───────────────────────────────────────────────────────
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  // strip query/hash
  filePath = filePath.split('?')[0].split('#')[0];

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    const ext  = path.extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('ScanScript running at https://192.168.0.27:' + PORT);
  console.log('Log file: ' + LOG);
});
