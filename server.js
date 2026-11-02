const express = require('express');
const path = require('path');
const os = require('os');
const session = require('express-session');
const { injectGlobals } = require('./src/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));

// Static files & uploads (support both local public/uploads and Vercel /tmp/uploads)
const tmpUploads = path.join(os.tmpdir(), 'uploads');
app.use('/uploads', express.static(tmpUploads));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(
  session({
    secret: 'techvision_secret_key_super_secure_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true
    }
  })
);

// Global view variables
app.use(injectGlobals);

// Routes
const webRoutes = require('./src/routes/web');
const adminRoutes = require('./src/routes/admin');

app.use('/admin', adminRoutes);
app.use('/', webRoutes);

// 404 Handler
app.use((req, res) => {
  const db = require('./src/db');
  res.status(404).render('404', {
    pageTitle: 'Không Tìm Thấy Trang (404)',
    settings: db.getSettings(),
    navServices: db.getActiveServices()
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Lỗi ứng dụng:', err);
  res.status(500).send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h2>Đã xảy ra lỗi máy chủ!</h2>
      <p style="color: red;">${err.message || 'Lỗi không xác định'}</p>
      <a href="/" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px;">Về Trang Chủ</a>
    </div>
  `);
});

module.exports = app;

if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Website đã khởi chạy thành công!`);
    console.log(`🌐 Trang công khai: http://localhost:${PORT}`);
    console.log(`🛡️  Trang quản trị: http://localhost:${PORT}/admin`);
    console.log(`🔑 Tài khoản mặc định: admin  |  Mật khẩu: admin123`);
    console.log(`=======================================================`);
  });
}

