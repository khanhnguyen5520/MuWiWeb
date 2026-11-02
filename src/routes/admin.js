const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const db = require('../db');
const { upload, requireAuth } = require('../auth');

// Inject settings and counts into admin views
router.use((req, res, next) => {
  res.locals.settings = db.getSettings();
  if (req.session && req.session.user) {
    const messages = db.getMessages();
    const apps = db.getApplications();
    res.locals.unreadMessagesCount = messages.filter(m => m.status === 'unread').length;
    res.locals.newAppsCount = apps.filter(a => a.status === 'new').length;
  }
  next();
});

// LOGIN / LOGOUT
router.get('/login', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/admin');
  }
  res.render('admin/login', {
    pageTitle: 'Đăng Nhập Quản Trị Viên',
    error: req.query.error || null
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.getUserByUsername(username);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.redirect('/admin/login?error=invalid');
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role
  };

  const returnTo = req.session.returnTo || '/admin';
  delete req.session.returnTo;
  return res.redirect(returnTo);
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

// All following routes require authentication
router.use(requireAuth);

// 1. DASHBOARD
router.get('/', (req, res) => {
  const services = db.getServices();
  const jobs = db.getJobs();
  const messages = db.getMessages();
  const applications = db.getApplications();

  res.render('admin/dashboard', {
    pageTitle: 'Bảng Điều Khiển Quản Trị',
    activeTab: 'dashboard',
    stats: {
      servicesCount: services.length,
      jobsCount: jobs.length,
      messagesCount: messages.length,
      unreadMessages: messages.filter(m => m.status === 'unread').length,
      applicationsCount: applications.length,
      newApplications: applications.filter(a => a.status === 'new').length
    },
    recentMessages: messages.slice(0, 5),
    recentApplications: applications.slice(0, 5),
    services
  });
});

// 2. SỬA NỘI DUNG TRANG CHỦ
router.get('/pages/home', (req, res) => {
  const home = db.getPage('home');
  res.render('admin/edit-home', {
    pageTitle: 'Quản Lý Nội Dung Trang Chủ',
    activeTab: 'pages-home',
    home,
    success: req.query.success || null
  });
});

router.post('/pages/home', upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'aboutImage', maxCount: 1 }]), (req, res) => {
  const home = db.getPage('home');
  const body = req.body;

  // Process stats
  const stats = [];
  if (Array.isArray(body.statNumber)) {
    for (let i = 0; i < body.statNumber.length; i++) {
      if (body.statNumber[i] && body.statLabel[i]) {
        stats.push({ number: body.statNumber[i], label: body.statLabel[i] });
      }
    }
  } else if (body.statNumber) {
    stats.push({ number: body.statNumber, label: body.statLabel });
  }

  // Process about points
  let aboutPoints = [];
  if (typeof body.aboutPoints === 'string') {
    aboutPoints = body.aboutPoints.split('\n').map(s => s.trim()).filter(Boolean);
  }

  // Process Why Us items
  const whyItems = [];
  if (Array.isArray(body.whyTitle)) {
    for (let i = 0; i < body.whyTitle.length; i++) {
      if (body.whyTitle[i]) {
        whyItems.push({
          icon: body.whyIcon?.[i] || 'fa-star',
          title: body.whyTitle[i],
          desc: body.whyDesc?.[i] || ''
        });
      }
    }
  }

  // Process Steps
  const processSteps = [];
  if (Array.isArray(body.stepTitle)) {
    for (let i = 0; i < body.stepTitle.length; i++) {
      if (body.stepTitle[i]) {
        processSteps.push({
          step: body.stepNumber?.[i] || `0${i + 1}`,
          title: body.stepTitle[i],
          desc: body.stepDesc?.[i] || ''
        });
      }
    }
  }

  const updatedHome = {
    ...home,
    heroBadge: body.heroBadge || home.heroBadge,
    heroTitle: body.heroTitle || home.heroTitle,
    heroSubtitle: body.heroSubtitle || home.heroSubtitle,
    heroCtaText: body.heroCtaText || home.heroCtaText,
    heroCtaLink: body.heroCtaLink || home.heroCtaLink,
    heroSecondaryText: body.heroSecondaryText || home.heroSecondaryText,
    heroSecondaryLink: body.heroSecondaryLink || home.heroSecondaryLink,
    heroImage: req.files?.heroImage ? `/uploads/${req.files.heroImage[0].filename}` : (body.heroImageUrl || home.heroImage),
    
    aboutBadge: body.aboutBadge || home.aboutBadge,
    aboutTitle: body.aboutTitle || home.aboutTitle,
    aboutDesc: body.aboutDesc || home.aboutDesc,
    aboutImage: req.files?.aboutImage ? `/uploads/${req.files.aboutImage[0].filename}` : (body.aboutImageUrl || home.aboutImage),
    aboutPoints: aboutPoints.length ? aboutPoints : home.aboutPoints,

    stats: stats.length ? stats : home.stats,
    whyBadge: body.whyBadge || home.whyBadge,
    whyTitle: body.whyTitle_main || home.whyTitle,
    whySubtitle: body.whySubtitle || home.whySubtitle,
    whyItems: whyItems.length ? whyItems : home.whyItems,

    processBadge: body.processBadge || home.processBadge,
    processTitle: body.processTitle_main || home.processTitle,
    processSubtitle: body.processSubtitle || home.processSubtitle,
    processSteps: processSteps.length ? processSteps : home.processSteps,

    ctaTitle: body.ctaTitle || home.ctaTitle,
    ctaSubtitle: body.ctaSubtitle || home.ctaSubtitle,
    ctaButtonText: body.ctaButtonText || home.ctaButtonText,
    ctaButtonLink: body.ctaButtonLink || home.ctaButtonLink
  };

  db.savePage('home', updatedHome);
  return res.redirect('/admin/pages/home?success=saved');
});

// 3. SỬA NỘI DUNG TRANG LIÊN HỆ
router.get('/pages/contact', (req, res) => {
  const contact = db.getPage('contact');
  const settings = db.getSettings();
  res.render('admin/edit-contact', {
    pageTitle: 'Quản Lý Nội Dung Trang Liên Hệ',
    activeTab: 'pages-contact',
    contact,
    settings,
    success: req.query.success || null
  });
});

router.post('/pages/contact', (req, res) => {
  const contact = db.getPage('contact');
  const settings = db.getSettings();
  const body = req.body;

  const updatedContact = {
    ...contact,
    heroBadge: body.heroBadge || contact.heroBadge,
    heroTitle: body.heroTitle || contact.heroTitle,
    heroSubtitle: body.heroSubtitle || contact.heroSubtitle,
    formTitle: body.formTitle || contact.formTitle,
    formSubtitle: body.formSubtitle || contact.formSubtitle,
    infoTitle: body.infoTitle || contact.infoTitle
  };
  db.savePage('contact', updatedContact);

  // Update contact information in settings
  db.saveSettings({
    hotline: body.hotline || settings.hotline,
    phone: body.phone || settings.phone,
    email: body.email || settings.email,
    address: body.address || settings.address,
    branchAddress: body.branchAddress || settings.branchAddress,
    workingHours: body.workingHours || settings.workingHours,
    mapIframe: body.mapIframe || settings.mapIframe
  });

  return res.redirect('/admin/pages/contact?success=saved');
});

// 4. SỬA NỘI DUNG TRANG TUYỂN DỤNG
router.get('/pages/recruitment', (req, res) => {
  const recruitment = db.getPage('recruitment');
  res.render('admin/edit-recruitment', {
    pageTitle: 'Quản Lý Nội Dung Tuyển Dụng',
    activeTab: 'pages-recruitment',
    recruitment,
    success: req.query.success || null
  });
});

router.post('/pages/recruitment', upload.single('heroImage'), (req, res) => {
  const recruitment = db.getPage('recruitment');
  const body = req.body;

  // Process perks
  const perks = [];
  if (Array.isArray(body.perkTitle)) {
    for (let i = 0; i < body.perkTitle.length; i++) {
      if (body.perkTitle[i]) {
        perks.push({
          icon: body.perkIcon?.[i] || 'fa-gift',
          title: body.perkTitle[i],
          desc: body.perkDesc?.[i] || ''
        });
      }
    }
  }

  const updatedRecruitment = {
    ...recruitment,
    heroBadge: body.heroBadge || recruitment.heroBadge,
    heroTitle: body.heroTitle || recruitment.heroTitle,
    heroSubtitle: body.heroSubtitle || recruitment.heroSubtitle,
    heroImage: req.file ? `/uploads/${req.file.filename}` : (body.heroImageUrl || recruitment.heroImage),
    cultureTitle: body.cultureTitle || recruitment.cultureTitle,
    cultureDesc: body.cultureDesc || recruitment.cultureDesc,
    perks: perks.length ? perks : recruitment.perks
  };

  db.savePage('recruitment', updatedRecruitment);
  return res.redirect('/admin/pages/recruitment?success=saved');
});

// 5. QUẢN LÝ DỊCH VỤ (5 TRANG DỊCH VỤ)
router.get('/services', (req, res) => {
  const services = db.getServices();
  res.render('admin/services-list', {
    pageTitle: 'Quản Lý Dịch Vụ',
    activeTab: 'services',
    services,
    success: req.query.success || null
  });
});

router.get('/services/new', (req, res) => {
  res.render('admin/service-edit', {
    pageTitle: 'Thêm Dịch Vụ Mới',
    activeTab: 'services',
    service: {
      id: '',
      title: '',
      slug: '',
      shortDesc: '',
      icon: 'fa-cube',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      priceNote: '',
      order: 1,
      active: true,
      features: [],
      contentHtml: ''
    },
    isNew: true
  });
});

router.post('/services/new', upload.single('image'), (req, res) => {
  const body = req.body;
  const slug = body.slug ? slugify(body.slug, { lower: true, strict: true }) : slugify(body.title, { lower: true, strict: true });
  
  let features = [];
  if (typeof body.features === 'string') {
    features = body.features.split('\n').map(f => f.trim()).filter(Boolean);
  }

  const newService = {
    title: body.title,
    slug: slug,
    shortDesc: body.shortDesc || '',
    icon: body.icon || 'fa-cube',
    image: req.file ? `/uploads/${req.file.filename}` : (body.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80'),
    priceNote: body.priceNote || '',
    order: parseInt(body.order) || 1,
    active: body.active === 'on' || body.active === true || body.active === 'true',
    features: features,
    contentHtml: body.contentHtml || ''
  };

  db.saveService(newService);
  return res.redirect('/admin/services?success=created');
});

router.get('/services/edit/:id', (req, res) => {
  const service = db.getServiceById(req.params.id);
  if (!service) {
    return res.redirect('/admin/services');
  }
  res.render('admin/service-edit', {
    pageTitle: `Chỉnh Sửa Dịch Vụ: ${service.title}`,
    activeTab: 'services',
    service,
    isNew: false,
    success: req.query.success || null
  });
});

router.post('/services/edit/:id', upload.single('image'), (req, res) => {
  const service = db.getServiceById(req.params.id);
  if (!service) {
    return res.redirect('/admin/services');
  }

  const body = req.body;
  const slug = body.slug ? slugify(body.slug, { lower: true, strict: true }) : service.slug;

  let features = [];
  if (typeof body.features === 'string') {
    features = body.features.split('\n').map(f => f.trim()).filter(Boolean);
  }

  const updatedService = {
    id: service.id,
    title: body.title || service.title,
    slug: slug,
    shortDesc: body.shortDesc || service.shortDesc,
    icon: body.icon || service.icon,
    image: req.file ? `/uploads/${req.file.filename}` : (body.imageUrl || service.image),
    priceNote: body.priceNote !== undefined ? body.priceNote : service.priceNote,
    order: parseInt(body.order) || service.order,
    active: body.active === 'on' || body.active === true || body.active === 'true',
    features: features.length ? features : service.features,
    contentHtml: body.contentHtml !== undefined ? body.contentHtml : service.contentHtml
  };

  db.saveService(updatedService);
  return res.redirect(`/admin/services/edit/${service.id}?success=saved`);
});

router.post('/services/delete/:id', (req, res) => {
  db.deleteService(req.params.id);
  return res.redirect('/admin/services?success=deleted');
});

// 6. QUẢN LÝ VỊ TRÍ TUYỂN DỤNG (JOBS)
router.get('/jobs', (req, res) => {
  const jobs = db.getJobs();
  res.render('admin/jobs-list', {
    pageTitle: 'Quản Lý Vị Trí Tuyển Dụng',
    activeTab: 'jobs',
    jobs,
    success: req.query.success || null
  });
});

router.get('/jobs/new', (req, res) => {
  res.render('admin/job-edit', {
    pageTitle: 'Đăng Tin Tuyển Dụng Mới',
    activeTab: 'jobs',
    job: {
      id: '',
      title: '',
      department: '',
      location: 'Hà Nội',
      salary: 'Thỏa thuận',
      type: 'Toàn thời gian',
      experience: '1 - 2 năm kinh nghiệm',
      deadline: '',
      active: true,
      description: '',
      requirements: [],
      benefits: []
    },
    isNew: true
  });
});

router.post('/jobs/new', (req, res) => {
  const body = req.body;
  let requirements = [];
  if (typeof body.requirements === 'string') {
    requirements = body.requirements.split('\n').map(r => r.trim()).filter(Boolean);
  }
  let benefits = [];
  if (typeof body.benefits === 'string') {
    benefits = body.benefits.split('\n').map(b => b.trim()).filter(Boolean);
  }

  const newJob = {
    title: body.title,
    department: body.department,
    location: body.location,
    salary: body.salary,
    type: body.type,
    experience: body.experience,
    deadline: body.deadline,
    active: body.active === 'on' || body.active === true,
    description: body.description,
    requirements,
    benefits
  };

  db.saveJob(newJob);
  return res.redirect('/admin/jobs?success=created');
});

router.get('/jobs/edit/:id', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) return res.redirect('/admin/jobs');

  res.render('admin/job-edit', {
    pageTitle: `Chỉnh Sửa Tuyển Dụng: ${job.title}`,
    activeTab: 'jobs',
    job,
    isNew: false,
    success: req.query.success || null
  });
});

router.post('/jobs/edit/:id', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) return res.redirect('/admin/jobs');

  const body = req.body;
  let requirements = [];
  if (typeof body.requirements === 'string') {
    requirements = body.requirements.split('\n').map(r => r.trim()).filter(Boolean);
  }
  let benefits = [];
  if (typeof body.benefits === 'string') {
    benefits = body.benefits.split('\n').map(b => b.trim()).filter(Boolean);
  }

  const updatedJob = {
    id: job.id,
    title: body.title || job.title,
    department: body.department || job.department,
    location: body.location || job.location,
    salary: body.salary || job.salary,
    type: body.type || job.type,
    experience: body.experience || job.experience,
    deadline: body.deadline || job.deadline,
    active: body.active === 'on' || body.active === true || body.active === 'true',
    description: body.description || job.description,
    requirements: requirements.length ? requirements : job.requirements,
    benefits: benefits.length ? benefits : job.benefits
  };

  db.saveJob(updatedJob);
  return res.redirect(`/admin/jobs/edit/${job.id}?success=saved`);
});

router.post('/jobs/delete/:id', (req, res) => {
  db.deleteJob(req.params.id);
  return res.redirect('/admin/jobs?success=deleted');
});

// 7. TIN NHẮN LIÊN HỆ
router.get('/messages', (req, res) => {
  const messages = db.getMessages();
  res.render('admin/messages', {
    pageTitle: 'Hộp Thư Liên Hệ Khách Hàng',
    activeTab: 'messages',
    messages,
    success: req.query.success || null
  });
});

router.post('/messages/:id/status', (req, res) => {
  const { status } = req.body;
  db.updateMessageStatus(req.params.id, status);
  return res.redirect('/admin/messages?success=updated');
});

router.post('/messages/:id/delete', (req, res) => {
  db.deleteMessage(req.params.id);
  return res.redirect('/admin/messages?success=deleted');
});

// 8. HỒ SƠ ỨNG TUYỂN (APPLICATIONS)
router.get('/applications', (req, res) => {
  const applications = db.getApplications();
  res.render('admin/applications', {
    pageTitle: 'Quản Lý Hồ Sơ Ứng Tuyển',
    activeTab: 'applications',
    applications,
    success: req.query.success || null
  });
});

router.post('/applications/:id/status', (req, res) => {
  const { status } = req.body;
  db.updateApplicationStatus(req.params.id, status);
  return res.redirect('/admin/applications?success=updated');
});

router.post('/applications/:id/delete', (req, res) => {
  db.deleteApplication(req.params.id);
  return res.redirect('/admin/applications?success=deleted');
});

// 9. CÀI ĐẶT HỆ THỐNG
router.get('/settings', (req, res) => {
  const settings = db.getSettings();
  res.render('admin/settings', {
    pageTitle: 'Cài Đặt Hệ Thống & Giao Diện',
    activeTab: 'settings',
    settings,
    success: req.query.success || null
  });
});

router.post('/settings', upload.single('logoFile'), (req, res) => {
  const body = req.body;
  const current = db.getSettings();

  const updatedSettings = {
    ...current,
    siteName: body.siteName || current.siteName,
    slogan: body.slogan || current.slogan,
    logoText: body.logoText || current.logoText,
    logoUrl: req.file ? `/uploads/${req.file.filename}` : (body.logoUrl || current.logoUrl || ''),
    hotline: body.hotline || current.hotline,
    phone: body.phone || current.phone,
    email: body.email || current.email,
    address: body.address || current.address,
    branchAddress: body.branchAddress || current.branchAddress,
    workingHours: body.workingHours || current.workingHours,
    facebook: body.facebook || current.facebook,
    linkedin: body.linkedin || current.linkedin,
    youtube: body.youtube || current.youtube,
    zalo: body.zalo || current.zalo,
    copyrightText: body.copyrightText || current.copyrightText,
    metaTitle: body.metaTitle || current.metaTitle,
    metaDesc: body.metaDesc || current.metaDesc
  };

  db.saveSettings(updatedSettings);
  return res.redirect('/admin/settings?success=saved');
});

// 10. TÀI KHOẢN ADMIN & ĐỔI MẬT KHẨU
router.get('/profile', (req, res) => {
  const user = db.getUserByUsername(req.session.user.username);
  res.render('admin/profile', {
    pageTitle: 'Thông Tin Tài Khoản & Bảo Mật',
    activeTab: 'profile',
    user,
    success: req.query.success || null,
    error: req.query.error || null
  });
});

router.post('/profile', (req, res) => {
  const { fullName, email } = req.body;
  const updatedUser = db.updateUserProfile(req.session.user.username, { fullName, email });
  if (updatedUser) {
    req.session.user.fullName = updatedUser.fullName;
    req.session.user.email = updatedUser.email;
  }
  return res.redirect('/admin/profile?success=profile_updated');
});

router.post('/profile/password', (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = db.getUserByUsername(req.session.user.username);

  if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return res.redirect('/admin/profile?error=wrong_current_password');
  }

  if (newPassword !== confirmPassword) {
    return res.redirect('/admin/profile?error=password_mismatch');
  }

  if (newPassword.length < 6) {
    return res.redirect('/admin/profile?error=password_too_short');
  }

  db.updatePassword(user.username, newPassword);
  return res.redirect('/admin/profile?success=password_changed');
});

module.exports = router;

