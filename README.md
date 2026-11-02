# TECHVISION SOLUTIONS - WEBSITE DOANH NGHIỆP & HỆ THỐNG QUẢN TRỊ CMS

Dự án website chuyên nghiệp và hệ thống quản trị nội dung (Admin CMS) được xây dựng hoàn chỉnh trên nền tảng **Node.js, Express, EJS và Bootstrap 5**.

---

## 🌟 CÁC TRANG & CHỨC NĂNG CHÍNH

### 1. Phía Khách Hàng (Public Website)
- **Trang Chủ (`/`)**:
  - Hero banner công nghệ, câu kêu gọi hành động (CTA), số liệu thống kê sinh động.
  - Khối Giới thiệu công ty (Về chúng tôi, Tầm nhìn, Ưu điểm).
  - Khối hiển thị nổi bật **5 Dịch Vụ Chủ Lực** (hình ảnh, icon, mô tả, nút dẫn tới từng trang con).
  - Khối Tại sao chọn chúng tôi (4 giá trị cốt lõi).
  - Khối Quy trình làm việc 4 bước chuẩn Agile.
  - Danh sách tin tuyển dụng mới nhất.
  - Form nhận tư vấn nhanh trực tuyến.
- **Trang Dịch Vụ Tổng Quan (`/dich-vu`)**:
  - Giới thiệu tổng quan hệ sinh thái giải pháp.
  - Danh sách chi tiết 5 dịch vụ với hình ảnh, tính năng và báo giá.
- **5 Trang Con Dịch Vụ Chuyên Sâu**:
  1. `/dich-vu/thiet-ke-website-phan-mem`: Thiết kế Website & Phần mềm theo yêu cầu
  2. `/dich-vu/chuyen-doi-so-erp-crm`: Giải pháp Chuyển đổi số & Quản trị ERP / CRM
  3. `/dich-vu/marketing-online-seo`: Digital Marketing & SEO Tổng thể Đột phá
  4. `/dich-vu/ha-tang-cloud-bao-mat`: Điện toán Đám mây & Bảo mật An ninh mạng
  5. `/dich-vu/tu-van-dao-tao-it`: Tư vấn Chuyển giao Công nghệ & Đào tạo IT Doanh nghiệp
  - *Mỗi trang con có:* Banner tiêu đề, ảnh đại diện, danh sách tính năng, nội dung bài viết chuyên sâu (định dạng HTML), sidebar chuyển hướng nhanh giữa 5 dịch vụ và form gửi yêu cầu riêng cho dịch vụ đó.
- **Trang Tuyển Dụng (`/tuyen-dung`)**:
  - Giới thiệu văn hóa công ty & 6 chế độ đãi ngộ phúc lợi hấp dẫn.
  - Danh sách các vị trí đang mở tuyển dụng (Senior Fullstack Developer, Digital Marketing, UI/UX Designer, Tư vấn B2B,...).
  - Xem chi tiết từng việc làm (`/tuyen-dung/:id`) với mô tả, yêu cầu, quyền lợi.
  - Form nộp hồ sơ ứng tuyển trực tuyến có đính kèm file CV (PDF, DOC).
- **Trang Liên Hệ (`/lien-he`)**:
  - Thông tin trụ sở chính, chi nhánh, hotline, email, giờ làm việc.
  - Form liên hệ trực tuyến cho khách hàng gửi lời nhắn.
  - Tích hợp bản đồ Google Maps nhúng.

---

### 2. Trang Quản Trị Hệ Thống (Admin CMS - `/admin`)
- **Đăng nhập an toàn (`/admin/login`)**:
  - Mật khẩu được mã hóa bằng **Bcrypt**.
  - **Tài khoản mặc định:**
    - Tên đăng nhập: `admin`
    - Mật khẩu: `admin123`
- **Dashboard Thống kê (`/admin`)**:
  - Thống kê số lượng dịch vụ, số tin tuyển dụng, số thư liên hệ mới và hồ sơ CV mới nhận.
  - Danh sách thư liên hệ và đơn ứng tuyển gần nhất.
- **Chỉnh sửa Trang Chủ (`/admin/pages/home`)**:
  - Thay đổi tiêu đề Hero, slogan, ảnh banner (hỗ trợ upload ảnh mới từ máy tính).
  - Tùy chỉnh các chỉ số thống kê (500+ dự án, 10+ năm kinh nghiệm,...).
  - Thay đổi nội dung Giới thiệu, Ưu điểm và 4 bước quy trình.
- **Chỉnh sửa 5 Trang Dịch Vụ (`/admin/services`)**:
  - Danh sách 5 dịch vụ con với biểu tượng, mức giá, trạng thái bật/tắt, thứ tự sắp xếp.
  - Trình soạn thảo văn bản trực quan **Quill WYSIWYG Editor** (in đậm, nghiêng, tiêu đề H2/H3, bullet points, hình ảnh, link).
  - Upload ảnh đại diện dịch vụ hoặc nhập URL ảnh.
  - Chỉnh sửa danh sách tính năng nổi bật (features).
  - Thêm mới dịch vụ hoặc xóa dịch vụ theo ý muốn.
- **Chỉnh sửa Trang Tuyển Dụng & Tin Tuyển Dụng (`/admin/pages/recruitment` & `/admin/jobs`)**:
  - Sửa nội dung văn hóa công ty, ảnh banner tuyển dụng, các mục phúc lợi.
  - Quản lý danh sách tin tuyển dụng: Thêm, sửa, xóa, mở/đóng tuyển vị trí.
- **Chỉnh sửa Trang Liên Hệ (`/admin/pages/contact`)**:
  - Thay đổi Hotline, SĐT kỹ thuật, Email, Địa chỉ trụ sở, Giờ làm việc, mã nhúng Google Maps iframe.
- **Hộp Thư Liên Hệ Khách Hàng (`/admin/messages`)**:
  - Xem các liên hệ khách hàng gửi về kèm SĐT, Email, Dịch vụ yêu cầu.
  - Đánh dấu trạng thái (Chưa đọc / Đã xem / Đã liên hệ lại) hoặc xóa tin nhắn.
- **Quản Lý Hồ Sơ Ứng Tuyển (`/admin/applications`)**:
  - Xem danh sách ứng viên, vị trí ứng tuyển, ghi chú.
  - Bấm tải trực tiếp file CV đính kèm của ứng viên.
  - Quản lý trạng thái: Hồ sơ mới -> Đã phỏng vấn -> Trúng tuyển / Từ chối.
- **Cài Đặt Hệ Thống (`/admin/settings`)**:
  - Tên website, Slogan, Logo (upload ảnh hoặc dùng Logo Text).
  - Các liên kết mạng xã hội (Facebook, LinkedIn, YouTube, Zalo).
  - Cấu hình SEO Meta Title & Meta Description.
- **Tài Khoản & Đổi Mật Khẩu (`/admin/profile`)**:
  - Cập nhật họ tên, email quản trị viên.
  - Đổi mật khẩu mới an toàn.

---

## 📁 CẤU TRÚC THƯ MỤC SOURCE CODE

```
DemoWeb1/
├── data/                      # Cơ sở dữ liệu JSON (tự động khởi tạo & lưu trữ)
│   ├── pages.json             # Nội dung các trang (Trang chủ, Liên hệ, Tuyển dụng)
│   ├── services.json          # Dữ liệu chi tiết 5 trang dịch vụ con
│   ├── jobs.json              # Dữ liệu các vị trí tuyển dụng
│   ├── settings.json          # Cài đặt chung của website & SEO
│   ├── messages.json          # Thư liên hệ của khách hàng
│   ├── applications.json      # Hồ sơ CV ứng tuyển nộp về
│   └── users.json             # Tài khoản Admin (mật khẩu hash bcrypt)
├── public/                    # Tài nguyên tĩnh
│   ├── css/
│   │   ├── style.css          # CSS giao diện người dùng (hiện đại, responsive)
│   │   └── admin.css          # CSS giao diện quản trị viên
│   ├── js/
│   │   ├── main.js            # JS phía người dùng (navbar scroll, tương tác)
│   │   └── admin.js           # JS trang admin (Quill editor, dynamic add, preview)
│   └── uploads/               # Thư mục lưu ảnh upload & file CV
├── src/
│   ├── db.js                  # Module thao tác và lưu trữ dữ liệu JSON
│   ├── auth.js                # Middleware xác thực đăng nhập & cấu hình upload Multer
│   └── routes/
│       ├── web.js             # Router các trang công khai
│       └── admin.js           # Router hệ thống quản trị admin
├── views/                     # Template giao diện EJS
│   ├── partials/
│   │   ├── header.ejs         # Header & Navbar công khai (Menu dropdown 5 dịch vụ)
│   │   ├── footer.ejs         # Footer công khai
│   │   ├── admin-header.ejs   # Header trang admin
│   │   ├── admin-sidebar.ejs  # Thanh menu sidebar quản trị
│   │   └── admin-footer.ejs   # Footer trang admin
│   ├── home.ejs               # Trang chủ
│   ├── services.ejs           # Trang tổng quan dịch vụ
│   ├── service-detail.ejs     # Chi tiết 5 trang dịch vụ con
│   ├── recruitment.ejs        # Trang tuyển dụng
│   ├── job-detail.ejs         # Chi tiết tin tuyển dụng & form nộp CV
│   ├── contact.ejs            # Trang liên hệ & bản đồ
│   ├── 404.ejs                # Trang báo lỗi 404
│   └── admin/
│       ├── login.ejs          # Trang đăng nhập admin
│       ├── dashboard.ejs      # Dashboard thống kê
│       ├── edit-home.ejs      # Sửa nội dung trang chủ
│       ├── edit-contact.ejs   # Sửa nội dung trang liên hệ
│       ├── edit-recruitment.ejs # Sửa nội dung trang tuyển dụng
│       ├── services-list.ejs  # Danh sách dịch vụ
│       ├── service-edit.ejs   # Sửa dịch vụ (WYSIWYG)
│       ├── jobs-list.ejs      # Danh sách việc làm
│       ├── job-edit.ejs       # Thêm / sửa việc làm
│       ├── messages.ejs       # Quản lý hộp thư khách hàng
│       ├── applications.ejs   # Quản lý hồ sơ ứng viên
│       ├── settings.ejs       # Cài đặt website
│       └── profile.ejs        # Đổi mật khẩu admin
├── api/
│   └── index.js               # Entry point Serverless Function cho Vercel
├── vercel.json                # Cấu hình routing và bundle tài nguyên cho Vercel
├── package.json
├── server.js                  # File khởi động máy chủ Express
└── README.md
```

---
