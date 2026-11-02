const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Uploads directory: On Vercel / AWS Lambda the root /var/task is read-only, so use os.tmpdir()
const UPLOADS_DIR = isVercel
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '..', 'public', 'uploads');

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Warning: Could not create upload directory:', err.message);
}

// Multer Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      cb(null, UPLOADS_DIR);
    } catch (err) {
      cb(null, os.tmpdir());
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to ensure user is logged in
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  return res.redirect('/admin/login');
}

// Global view variables helper
function injectGlobals(req, res, next) {
  res.locals.currentUser = req.session ? req.session.user : null;
  res.locals.path = req.path;
  next();
}

module.exports = {
  upload,
  requireAuth,
  injectGlobals
};
