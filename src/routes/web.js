const express = require('express');
const router = express.Router();
const db = require('../db');
const { upload } = require('../auth');

// Middleware to inject site settings and services list into all views
router.use((req, res, next) => {
  res.locals.settings = db.getSettings();
  res.locals.navServices = db.getActiveServices();
  next();
});

// 1. TRANG CHỦ
router.get('/', (req, res) => {
  const homeData = db.getPage('home');
  const services = db.getActiveServices();
  const jobs = db.getActiveJobs().slice(0, 3); // Lấy 3 tin tuyển dụng mới nhất
  res.render('home', {
    pageTitle: 'Trang Chủ',
    home: homeData,
    services,
    jobs
  });
});

// 2. TRANG TỔNG QUAN DỊCH VỤ
router.get('/dich-vu', (req, res) => {
  const services = db.getActiveServices();
  res.render('services', {
    pageTitle: 'Dịch Vụ & Giải Pháp Doanh Nghiệp',
    services
  });
});

// 3. CHI TIẾT 5 TRANG DỊCH VỤ CON
router.get('/dich-vu/:slug', (req, res) => {
  const slug = req.params.slug;
  const service = db.getServiceBySlug(slug);
  if (!service) {
    return res.status(404).render('404', { pageTitle: 'Không Tìm Thấy Trang Dịch Vụ' });
  }

  // Danh sách các dịch vụ khác (để hiển thị ở sidebar)
  const allServices = db.getActiveServices();
  const otherServices = allServices.filter(s => s.id !== service.id);

  res.render('service-detail', {
    pageTitle: service.title,
    service,
    otherServices
  });
});

// 4. TRANG TUYỂN DỤNG
router.get('/tuyen-dung', (req, res) => {
  const recruitmentData = db.getPage('recruitment');
  const jobs = db.getActiveJobs();
  res.render('recruitment', {
    pageTitle: 'Cơ Hội Nghề Nghiệp & Tuyển Dụng',
    recruitment: recruitmentData,
    jobs,
    success: req.query.success || null
  });
});

// Chi tiết tin tuyển dụng
router.get('/tuyen-dung/:id', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) {
    return res.status(404).render('404', { pageTitle: 'Không Tìm Thấy Tin Tuyển Dụng' });
  }
  const otherJobs = db.getActiveJobs().filter(j => j.id !== job.id);
  res.render('job-detail', {
    pageTitle: job.title,
    job,
    otherJobs
  });
});

// Xử lý nộp CV ứng tuyển
router.post('/tuyen-dung/ung-tuyen', upload.single('cv'), (req, res) => {
  const { fullName, email, phone, jobId, jobTitle, note } = req.body;
  const cvPath = req.file ? `/uploads/${req.file.filename}` : '';

  db.addApplication({
    fullName,
    email,
    phone,
    jobId: jobId || '',
    jobTitle: jobTitle || 'Ứng tuyển chung',
    cvPath,
    note
  });

  return res.redirect('/tuyen-dung?success=applied#apply-form');
});

// 5. TRANG LIÊN HỆ
router.get('/lien-he', (req, res) => {
  const contactData = db.getPage('contact');
  res.render('contact', {
    pageTitle: 'Liên Hệ Với Chúng Tôi',
    contact: contactData,
    success: req.query.success || null
  });
});

// Xử lý gửi form liên hệ
router.post('/lien-he', (req, res) => {
  const { name, email, phone, service, subject, message } = req.body;
  
  db.addMessage({
    name,
    email,
    phone,
    service: service || 'Tư vấn chung',
    subject: subject || 'Khách hàng gửi liên hệ từ website',
    message: message || ''
  });

  return res.redirect('/lien-he?success=sent#contact-form');
});

// Xử lý form đăng ký nhận tư vấn nhanh (từ trang chủ hoặc footer)
router.post('/gui-tu-van', (req, res) => {
  const { name, phone, email, service, message } = req.body;
  db.addMessage({
    name,
    phone,
    email: email || '',
    service: service || 'Đăng ký tư vấn nhanh',
    subject: `Khách hàng đăng ký tư vấn [${service || 'Dịch vụ'}]`,
    message: message || 'Yêu cầu gọi lại tư vấn chi tiết'
  });

  // Trả về JSON nếu là Ajax hoặc redirect
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.json({ success: true, message: 'Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại sớm nhất.' });
  }
  return res.redirect('/?success=consultation#consultation-form');
});

module.exports = router;

