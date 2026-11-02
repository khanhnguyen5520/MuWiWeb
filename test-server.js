const http = require('http');
const app = require('./server.js');

async function runTests() {
  const PORT = 3888;
  const server = app.listen(PORT);

  // Wait 500ms
  await new Promise(r => setTimeout(r, 500));

  const endpoints = [
    '/',
    '/dich-vu',
    '/dich-vu/thiet-ke-website-phan-mem',
    '/dich-vu/chuyen-doi-so-erp-crm',
    '/dich-vu/marketing-online-seo',
    '/dich-vu/ha-tang-cloud-bao-mat',
    '/dich-vu/tu-van-dao-tao-it',
    '/tuyen-dung',
    '/lien-he',
    '/admin/login'
  ];

  let failed = 0;

  for (const ep of endpoints) {
    try {
      const res = await new Promise((resolve, reject) => {
        http.get(`http://localhost:${PORT}${ep}`, (resp) => {
          let data = '';
          resp.on('data', chunk => data += chunk);
          resp.on('end', () => resolve({ status: resp.statusCode, body: data }));
        }).on('error', reject);
      });

      if (res.status === 200) {
        console.log(`[PASS] ${ep} - Status: ${res.status}`);
      } else {
        console.error(`[FAIL] ${ep} - Status: ${res.status}`);
        failed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${ep}:`, err.message);
      failed++;
    }
  }

  // Also test admin redirect when not logged in
  try {
    const res = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}/admin`, (resp) => {
        resolve({ status: resp.statusCode, location: resp.headers.location });
      }).on('error', reject);
    });
    if (res.status === 302 && res.location === '/admin/login') {
      console.log(`[PASS] /admin correctly redirects unauthenticated user to /admin/login (302)`);
    } else {
      console.error(`[FAIL] /admin expected redirect to /admin/login, got:`, res);
      failed++;
    }
  } catch (err) {
    console.error(`[ERROR] /admin:`, err.message);
    failed++;
  }

  server.close();

  if (failed === 0) {
    console.log('\n🎉 TẤT CẢ CÁC TRANG ĐÃ TEST THÀNH CÔNG VÀ HOẠT ĐỘNG HOÀN HẢO!');
  } else {
    console.error(`\n❌ Có ${failed} bài kiểm tra thất bại!`);
  }

  process.exit(failed === 0 ? 0 : 1);
}

runTests();
