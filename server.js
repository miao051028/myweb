const http = require('http');
const fs = require('fs');
const path = require('path');
const localtunnel = require('localtunnel');

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, urlPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain;charset=utf-8' });
      res.end('404 - File not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const ct = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ct + ';charset=utf-8' });
    res.end(data);
  });
});

server.listen(PORT, async () => {
  console.log('\n========================================');
  console.log('  三下乡 · 文化云游 服务器已启动');
  console.log('  本地访问: http://localhost:' + PORT);
  console.log('========================================\n');

  try {
    const tunnel = await localtunnel({ port: PORT });
    console.log('----------------------------------------');
    console.log('  🌐 公网访问链接:');
    console.log('  ' + tunnel.url);
    console.log('----------------------------------------');
    console.log('\n  💡 提示:');
    console.log('  1. 手机/其他设备可用此公网链接访问');
    console.log('  2. 首次打开需点击页面中央 "Click to continue"');
    console.log('  3. 关闭此窗口后公网链接将失效');
    console.log('  4. 如需永久链接，请使用 Gitee Pages 部署\n');

    tunnel.on('close', () => console.log('公网隧道已关闭'));
    tunnel.on('error', (err) => console.log('隧道错误:', err.message));
  } catch (e) {
    console.log('⚠️  公网链接创建失败:', e.message);
    console.log('   本地服务器仍可使用: http://localhost:' + PORT + '\n');
  }

  console.log('按 Ctrl+C 停止服务...\n');
});

