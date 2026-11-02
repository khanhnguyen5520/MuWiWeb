const http = require('http');

async function testVercelSimulation() {
  console.log('--- Testing Vercel Environment Simulation ---');
  process.env.VERCEL = '1';

  // Test loading api/index.js
  const app = require('./api/index.js');
  if (typeof app !== 'function') {
    throw new Error('api/index.js did not export an Express application!');
  }
  console.log('[PASS] api/index.js successfully loaded and exported Express app');

  // Start HTTP server using the exported app on port 3999
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(3999, resolve));
  console.log('[PASS] Server listening on port 3999 in Vercel mode');

  const routes = [
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

  for (const route of routes) {
    const res = await new Promise((resolve, reject) => {
      http.get(`http://localhost:3999${route}`, resp => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => resolve({ status: resp.statusCode, body: data }));
      }).on('error', reject);
    });

    if (res.status === 200) {
      console.log(`[PASS] ${route} -> Status: 200 OK`);
    } else {
      console.error(`[FAIL] ${route} -> Status: ${res.status}`);
      process.exit(1);
    }
  }

  // Test Admin auth check redirection
  const adminRes = await new Promise((resolve, reject) => {
    http.get(`http://localhost:3999/admin`, resp => {
      resolve({ status: resp.statusCode, location: resp.headers.location });
    }).on('error', reject);
  });

  if (adminRes.status === 302 && adminRes.location === '/admin/login') {
    console.log('[PASS] /admin redirects to /admin/login (302)');
  } else {
    console.error('[FAIL] /admin redirection failed:', adminRes);
    process.exit(1);
  }

  // Close server
  await new Promise(resolve => server.close(resolve));
  console.log('\n🎉 ALL VERCEL SIMULATION TESTS PASSED COMPLETELY!\n');
}

testVercelSimulation().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});

