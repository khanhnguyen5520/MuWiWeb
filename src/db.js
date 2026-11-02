const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers
function getFilePath(filename) {
  return path.join(DATA_DIR, filename);
}

function readJson(filename, defaultData) {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    writeJson(filename, defaultData);
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultData;
  }
}

function writeJson(filename, data) {
  const filePath = getFilePath(filename);
  const tempPath = filePath + '.tmp';
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (e2) {
      console.error(`Fallback write failed for ${filename}:`, e2);
      return false;
    }
  }
}

// Initial Seed Data
const DEFAULT_SETTINGS = {
  siteName: "TechVision Solutions",
  slogan: "Giải Pháp Công Nghệ & Chuyển Đổi Số Toàn Diện",
  logoText: "TechVision",
  hotline: "1900 6868",
  phone: "0988 123 456",
  email: "contact@techvision.vn",
  address: "Tầng 12, Tòa nhà Innovation Center, 88 Cầu Giấy, Hà Nội",
  branchAddress: "Tầng 6, Bitexco Financial Tower, Quận 1, TP. Hồ Chí Minh",
  workingHours: "Thứ 2 - Thứ 6: 08:30 - 18:00 | Thứ 7: 08:30 - 12:00",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
  youtube: "https://youtube.com",
  zalo: "https://zalo.me/0988123456",
  copyrightText: "© 2026 TechVision Solutions. Bảo lưu mọi quyền.",
  metaTitle: "TechVision - Đơn vị Tư vấn & Phát triển Phần mềm, Chuyển đổi số Hàng đầu",
  metaDesc: "Cung cấp dịch vụ Thiết kế Website, Phần mềm Quản trị ERP/CRM, Digital Marketing, Hạ tầng Cloud & Đào tạo IT chuyên nghiệp."
};

const DEFAULT_PAGES = {
  home: {
    heroBadge: "🚀 Tiên phong Công nghệ & Sáng tạo Số",
    heroTitle: "Bứt Phá Tăng Trưởng Cùng Giải Pháp Công Nghệ Đột Phá",
    heroSubtitle: "Chúng tôi đồng hành cùng doanh nghiệp xây dựng phần mềm hiện đại, tối ưu hóa quy trình vận hành và kiến tạo trải nghiệm khách hàng vượt trội.",
    heroCtaText: "Khám Phá Dịch Vụ",
    heroCtaLink: "/dich-vu",
    heroSecondaryText: "Nhận Tư Vấn Miễn Phí",
    heroSecondaryLink: "/lien-he",
    heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    stats: [
      { number: "10+", label: "Năm kinh nghiệm thực chiến" },
      { number: "500+", label: "Dự án bàn giao xuất sắc" },
      { number: "99%", label: "Khách hàng hài lòng & gia hạn" },
      { number: "50+", label: "Kỹ sư & chuyên gia công nghệ" }
    ],
    aboutBadge: "Về Chúng Tôi",
    aboutTitle: "Đối Tác Chiến Lược Tin Cậy Trong Kỷ Nguyên Số",
    aboutDesc: "TechVision Solutions là đơn vị tiên phong cung cấp hệ sinh thái giải pháp số toàn diện. Với năng lực chuyên môn sâu rộng cùng tinh thần tận tâm, chúng tôi biến ý tưởng của bạn thành các sản phẩm công nghệ có giá trị thực tiễn cao.",
    aboutImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&q=80",
    aboutPoints: [
      "Kiến trúc phần mềm chuẩn quốc tế, bảo mật cao và dễ dàng mở rộng",
      "Đội ngũ kỹ sư giàu kinh nghiệm thực chiến tại các tập đoàn lớn",
      "Phương pháp Agile / Scrum minh bạch, báo cáo tiến độ trực quan",
      "Chính sách bảo hành, bảo trì trọn đời và hỗ trợ kỹ thuật 24/7"
    ],
    whyBadge: "Tại Sao Chọn Chúng Tôi",
    whyTitle: "Giá Trị Khác Biệt Tạo Nên Thương Hiệu Uy Tín",
    whySubtitle: "Mỗi giải pháp chúng tôi tạo ra đều xuất phát từ sự thấu hiểu sâu sắc nhu cầu kinh doanh của khách hàng.",
    whyItems: [
      {
        icon: "fa-shield-halved",
        title: "Bảo Mật Cấp Doanh Nghiệp",
        desc: "Tuân thủ nghiêm ngặt các tiêu chuẩn an toàn thông tin ISO 27001 và mã hóa dữ liệu đa tầng."
      },
      {
        icon: "fa-bolt-lightning",
        title: "Triển Khai Thần Tốc",
        desc: "Quy trình phát triển chuẩn hóa giúp rút ngắn thời gian bàn giao sản phẩm từ 30% đến 50%."
      },
      {
        icon: "fa-chart-line",
        title: "Tối Ưu Hóa Chi Phí & ROI",
        desc: "Đầu tư thông minh, loại bỏ chi phí thừa, mang lại hiệu quả tức thì cho hoạt động kinh doanh."
      },
      {
        icon: "fa-headset",
        title: "Hỗ Trợ Kỹ Thuật 24/7",
        desc: "Đội ngũ chuyên viên sẵn sàng tiếp nhận và giải quyết mọi sự cố với SLA phản hồi dưới 15 phút."
      }
    ],
    processBadge: "Quy Trình Làm Việc",
    processTitle: "4 Bước Đơn Giản & Hiệu Quả",
    processSubtitle: "Quy trình làm việc chuyên nghiệp, rõ ràng từng giai đoạn để đem lại sản phẩm hoàn hảo nhất.",
    processSteps: [
      {
        step: "01",
        title: "Khảo Sát & Tư Vấn",
        desc: "Lắng nghe mục tiêu, phân tích nghiệp vụ và xây dựng giải pháp tối ưu cho doanh nghiệp."
      },
      {
        step: "02",
        title: "Thiết Kế & Lập Kế Hoạch",
        desc: "Phác thảo kiến trúc hệ thống, xây dựng giao diện UI/UX trực quan và lộ trình chi tiết."
      },
      {
        step: "03",
        title: "Lập Trình & Kiểm Thử",
        desc: "Viết mã nguồn chuẩn hóa, kiểm thử tính năng và hiệu năng liên tục qua các chu kỳ Agile."
      },
      {
        step: "04",
        title: "Bàn Giao & Vận Hành",
        desc: "Triển khai hệ thống lên môi trường thực tế, đào tạo người dùng và cam kết hỗ trợ dài hạn."
      }
    ],
    ctaTitle: "Sẵn Sàng Chuyển Đổi Số Cùng Đội Ngũ TechVision?",
    ctaSubtitle: "Liên hệ ngay hôm nay để nhận báo giá chi tiết và tư vấn giải pháp hoàn toàn miễn phí từ các chuyên gia hàng đầu.",
    ctaButtonText: "Nhận Tư Vấn Ngay",
    ctaButtonLink: "/lien-he"
  },
  recruitment: {
    heroBadge: "Gia Nhập TechVision",
    heroTitle: "Cùng Kiến Tạo Tương Lai Công Nghệ Đột Phá",
    heroSubtitle: "Chúng tôi luôn tìm kiếm những tài năng đam mê công nghệ, khao khát thử thách và sẵn sàng tạo nên sự khác biệt cùng TechVision.",
    heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
    cultureTitle: "Môi Trường & Văn Hóa Làm Việc Tuyệt Vời",
    cultureDesc: "Tại TechVision, con người là tài sản quý giá nhất. Chúng tôi xây dựng môi trường cởi mở, sáng tạo và tôn trọng giá trị cá nhân của mỗi thành viên.",
    perks: [
      {
        icon: "fa-sack-dollar",
        title: "Thu Nhập Hấp Dẫn & Thưởng Dự Án",
        desc: "Lương cạnh tranh theo năng lực, thưởng hiệu quả công việc, thưởng nóng dự án và review lương 2 lần/năm."
      },
      {
        icon: "fa-graduation-cap",
        title: "Đào Tạo & Chứng Chỉ Quốc Tế",
        desc: "Tài trợ 100% chi phí thi các chứng chỉ AWS, GCP, PMP, Scrum Master cùng các khóa đào tạo nội bộ."
      },
      {
        icon: "fa-heart-pulse",
        title: "Chăm Sóc Sức Khỏe Toàn Diện",
        desc: "Gói bảo hiểm sức khỏe VIP, khám sức khỏe định kỳ hàng năm và câu lạc bộ thể thao sau giờ làm việc."
      },
      {
        icon: "fa-plane-departure",
        title: "Du Lịch & Teambuilding Nghỉ Dưỡng",
        desc: "Chuyến du lịch nghỉ dưỡng 5 sao thường niên, hoạt động teambuilding sôi nổi và tiệc công ty hoành tráng."
      },
      {
        icon: "fa-laptop-code",
        title: "Trang Bị Thiết Bị Đỉnh Cao",
        desc: "Cấp mới Macbook Pro hoặc máy tính cấu hình cao cùng màn hình 4K cho toàn bộ nhân sự kỹ thuật."
      },
      {
        icon: "fa-clock",
        title: "Linh Hoạt & Cân Bằng Cuộc Sống",
        desc: "Thời gian làm việc linh hoạt, chính sách Hybrid Work (kết hợp làm tại văn phòng và Remote) tiện lợi."
      }
    ]
  },
  contact: {
    heroBadge: "Kết Nối Với Chúng Tôi",
    heroTitle: "Chúng Tôi Luôn Lắng Nghe & Sẵn Sàng Hỗ Trợ",
    heroSubtitle: "Dù bạn cần tư vấn giải pháp mới hay muốn hợp tác kinh doanh, hãy để lại thông tin, chuyên gia của chúng tôi sẽ liên hệ trong vòng 30 phút.",
    formTitle: "Gửi Yêu Cầu Tư Vấn",
    formSubtitle: "Vui lòng điền thông tin bên dưới, chuyên viên của chúng tôi sẽ gọi lại tư vấn chi tiết cho bạn.",
    infoTitle: "Thông Tin Trụ Sở Chính"
  }
};

const DEFAULT_SERVICES = [
  {
    id: "serv-1",
    slug: "thiet-ke-website-phan-mem",
    title: "Thiết kế Website & Phần mềm theo yêu cầu",
    shortDesc: "Xây dựng website chuẩn SEO, web application hiện đại, sàn thương mại điện tử và phần mềm nghiệp vụ chuyên sâu với trải nghiệm người dùng hoàn hảo.",
    icon: "fa-laptop-code",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    order: 1,
    active: true,
    priceNote: "Từ 15.000.000 VNĐ",
    features: [
      "Giao diện độc quyền thiết kế riêng theo nhận diện thương hiệu",
      "Tối ưu 100% Responsive trên Mobile, Tablet và Desktop",
      "Tối ưu điểm số Google PageSpeed và chuẩn SEO Onpage",
      "Trang quản trị (CMS) thông minh, dễ dàng cập nhật nội dung",
      "Tích hợp cổng thanh toán trực tuyến, vận chuyển tự động",
      "Bảo hành bảo trì trọn đời và sao lưu dữ liệu định kỳ"
    ],
    contentHtml: `
      <h3>Giải Pháp Thiết Kế Website & Phần Mềm May Đo Cao Cấp</h3>
      <p>Trong thời đại số hóa hiện nay, website không chỉ là bộ mặt của doanh nghiệp trên Internet mà còn là cỗ máy sinh lời và kênh tiếp cận khách hàng tiềm năng mạnh mẽ nhất. TechVision cung cấp giải pháp thiết kế website và phát triển phần mềm theo yêu cầu đáp ứng hoàn hảo mọi quy chuẩn công nghệ mới nhất.</p>
      
      <h4>Ưu điểm nổi bật của dịch vụ:</h4>
      <ul>
        <li><strong>Thiết kế UX/UI độc quyền:</strong> Nghiên cứu hành vi người dùng (User Persona) để tạo ra trải nghiệm mượt mà, gia tăng tỷ lệ chuyển đổi đơn hàng.</li>
        <li><strong>Công nghệ tiên tiến:</strong> Sử dụng các nền tảng và framework hiện đại nhất như Node.js, React, Next.js, Vue, Laravel, đảm bảo tốc độ vượt trội.</li>
        <li><strong>Chuẩn hóa SEO toàn diện:</strong> Cấu trúc website thân thiện với thuật toán tìm kiếm của Google, giúp từ khóa dễ dàng thăng hạng.</li>
        <li><strong>An toàn & Bảo mật:</strong> Tích hợp chứng chỉ bảo mật SSL, tường lửa phòng chống tấn công DDoS, mã hóa dữ liệu khách hàng.</li>
      </ul>

      <h4>Các lĩnh vực chúng tôi chuyên sâu:</h4>
      <ul>
        <li>Website giới thiệu tập đoàn, công ty và tổ chức.</li>
        <li>Hệ thống sàn thương mại điện tử (E-commerce) đa tính năng.</li>
        <li>Hệ thống học trực tuyến (LMS), booking đặt lịch, sàn bất động sản.</li>
        <li>Ứng dụng Web App quản lý nội bộ và cổng thông tin Portal.</li>
      </ul>

      <p>Hãy liên hệ với chúng tôi ngay hôm nay để nhận bản phân tích và demo giao diện miễn phí cho dự án của bạn!</p>
    `
  },
  {
    id: "serv-2",
    slug: "chuyen-doi-so-erp-crm",
    title: "Giải pháp Chuyển đổi số & Quản trị ERP / CRM",
    shortDesc: "Số hóa toàn diện quy trình kinh doanh, quản lý quan hệ khách hàng, kho bãi, chuỗi cung ứng, nhân sự và tài chính trên một nền tảng quản trị tập trung.",
    icon: "fa-cubes-stacked",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    order: 2,
    active: true,
    priceNote: "Tư vấn & Báo giá theo module",
    features: [
      "Tự động hóa luồng phê duyệt và quy trình làm việc giữa các phòng ban",
      "Quản lý thông tin & lịch sử chăm sóc khách hàng 360 độ (CRM)",
      "Quản lý kho hàng thông minh, cảnh báo tồn kho và chuỗi cung ứng",
      "Quản trị tài chính kế toán, dòng tiền và hóa đơn điện tử",
      "Dashboard báo cáo thông minh theo thời gian thực (Real-time Analytics)",
      "Đồng bộ đa nền tảng và phân quyền truy cập bảo mật cao"
    ],
    contentHtml: `
      <h3>Hệ Thống Quản Trị Doanh Nghiệp Toàn Diện ERP & CRM</h3>
      <p>Chuyển đổi số không còn là sự lựa chọn mà là con đường bắt buộc để doanh nghiệp tồn tại và bứt phá trong bối cảnh cạnh tranh khốc liệt. Hệ thống ERP & CRM của TechVision giúp đồng bộ hóa mọi mắt xích vận hành của tổ chức.</p>
      
      <h4>Phân hệ giải pháp cốt lõi:</h4>
      <ul>
        <li><strong>Quản lý Khách hàng (CRM):</strong> Lưu trữ hồ sơ khách hàng tập trung, theo dõi hành trình mua hàng, tự động chăm sóc và nhắc lịch hẹn.</li>
        <li><strong>Quản lý Bán hàng & Phân phối:</strong> Quản lý đơn hàng, báo giá, hợp đồng và chính sách chiết khấu linh hoạt.</li>
        <li><strong>Quản trị Chuỗi cung ứng & Kho vận:</strong> Theo dõi nhập xuất tồn kho bằng mã vạch / QR Code, dự báo nhu cầu nhập hàng tự động.</li>
        <li><strong>Quản lý Nhân sự & Tiền lương (HRM):</strong> Chấm công thông minh, tính lương tự động, đánh giá KPI và quản lý hồ sơ nhân viên.</li>
        <li><strong>Báo cáo Điều hành (Business Intelligence):</strong> Biểu đồ trực quan giúp ban lãnh đạo đưa ra quyết định nhanh chóng, chính xác.</li>
      </ul>

      <h4>Lợi ích thực tế mang lại:</h4>
      <p>Cắt giảm tới 40% chi phí vận hành thủ công, loại bỏ 90% sai sót giấy tờ và tăng tốc độ xử lý đơn hàng lên gấp 3 lần.</p>
    `
  },
  {
    id: "serv-3",
    slug: "marketing-online-seo",
    title: "Digital Marketing & SEO Tổng thể Đột phá",
    shortDesc: "Chiến lược tiếp thị số đa kênh toàn diện, tối ưu hóa công cụ tìm kiếm đưa từ khóa lên top bền vững, gia tăng tỉ lệ chuyển đổi đơn hàng vượt bậc.",
    icon: "fa-bullhorn",
    image: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=1200&q=80",
    order: 3,
    active: true,
    priceNote: "Từ 10.000.000 VNĐ / tháng",
    features: [
      "Nghiên cứu thị trường sâu rộng và chân dung khách hàng mục tiêu",
      "SEO Tổng thể hàng trăm từ khóa lên TOP Google bền vững",
      "Quản trị & tối ưu chiến dịch quảng cáo Google Ads, Facebook, TikTok",
      "Sáng tạo nội dung Content Marketing & kịch bản Video Viral hấp dẫn",
      "Xây dựng hệ thống phễu tiếp thị chuyển đổi tự động (Marketing Automation)",
      "Báo cáo chỉ số ROI, CPA, CTR minh bạch và cập nhật hàng tuần"
    ],
    contentHtml: `
      <h3>Chiến Lược Digital Marketing Đột Phá Doanh Số</h3>
      <p>Sở hữu sản phẩm tốt là chưa đủ, bạn cần đưa sản phẩm đó đến đúng khách hàng có nhu cầu vào đúng thời điểm. Dịch vụ Digital Marketing của TechVision kết hợp giữa chiến lược tiếp thị dữ liệu (Data-driven Marketing) và sự sáng tạo không giới hạn.</p>

      <h4>Dịch vụ của chúng tôi bao gồm:</h4>
      <ul>
        <li><strong>Dịch vụ SEO Tổng thể:</strong> Tối ưu cấu trúc On-page, xây dựng Entity uy tín và nội dung chuyên sâu giúp website trụ vững trên trang nhất Google mà không sợ biến động thuật toán.</li>
        <li><strong>Quảng cáo trả phí hiệu năng cao (Performance Ads):</strong> Thiết lập và tối ưu chiến dịch quảng cáo Google Tìm kiếm, Google Shopping, Facebook Ads, TikTok Ads với chi phí trên mỗi chuyển đổi (CPA) thấp nhất.</li>
        <li><strong>Sản xuất Nội dung & Truyền thông Xã hội:</strong> Xây dựng kênh Fanpage, TikTok triệu view, bài viết PR báo chí và thiết kế ấn phẩm đồ họa chuyên nghiệp.</li>
        <li><strong>Chăm sóc & Nuôi dưỡng Khách hàng (Email / Zalo ZNS):</strong> Tự động gửi thông điệp cá nhân hóa tới từng nhóm đối tượng khách hàng.</li>
      </ul>

      <p>Chúng tôi cam kết số lượng từ khóa lên TOP và doanh số chuyển đổi thực tế bằng hợp đồng rõ ràng.</p>
    `
  },
  {
    id: "serv-4",
    slug: "ha-tang-cloud-bao-mat",
    title: "Điện toán Đám mây & Bảo mật An ninh mạng",
    shortDesc: "Tư vấn thiết kế hạ tầng Cloud hiện đại (AWS, GCP, Azure), tối ưu chi phí server, sao lưu dữ liệu tự động và giám sát an toàn thông tin 24/7.",
    icon: "fa-cloud-arrow-up",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80",
    order: 4,
    active: true,
    priceNote: "Tùy quy mô hạ tầng",
    features: [
      "Di chuyển hệ thống lên Cloud (AWS, Azure, GCP) mượt mà không gián đoạn",
      "Thiết lập kiến trúc High Availability chịu tải hàng triệu người dùng",
      "Tối ưu chi phí hạ tầng Cloud tiết kiệm từ 20% đến 45% mỗi tháng",
      "Triển khai tường lửa ứng dụng web WAF, chống DDoS chuyên sâu",
      "Hệ thống sao lưu tự động & kế hoạch khắc phục thảm họa (Disaster Recovery)",
      "Giám sát hệ thống và cảnh báo bất thường 24/7 theo thời gian thực"
    ],
    contentHtml: `
      <h3>Hạ Tầng Cloud Ổn Định, Linh Hoạt & An Toàn Tuyệt Đối</h3>
      <p>Dữ liệu là huyết mạch của doanh nghiệp. Hạ tầng đám mây không chỉ giúp doanh nghiệp linh hoạt mở rộng quy mô mà còn bảo vệ tài nguyên số trước các mối đe dọa an ninh mạng ngày càng tinh vi.</p>

      <h4>Năng lực giải pháp Cloud & Security:</h4>
      <ul>
        <li><strong>Cloud Migration:</strong> Lên kế hoạch và thực thi chuyển đổi hệ thống từ máy chủ vật lý lên đám mây với downtime bằng 0.</li>
        <li><strong>DevOps & CI/CD Automation:</strong> Tự động hóa quy trình đóng gói, kiểm thử và triển khai ứng dụng, rút ngắn chu kỳ phát hành tính năng mới.</li>
        <li><strong>Bảo mật & Phòng thủ Không gian mạng:</strong> Quét lỗ hổng bảo mật định kỳ, kiểm thử xâm nhập (Penetration Testing), thiết lập chính sách bảo mật Zero Trust.</li>
        <li><strong>Quản lý & Tối ưu Chi phí FinOps:</strong> Rà soát tài nguyên nhàn rỗi, đề xuất phương án cấu hình tối ưu chi phí cloud hàng tháng.</li>
      </ul>

      <p>Đội ngũ kỹ sư đạt các chứng chỉ cao cấp nhất của AWS, Google Cloud và Microsoft sẽ luôn túc trực bảo vệ hệ thống của bạn.</p>
    `
  },
  {
    id: "serv-5",
    slug: "tu-van-dao-tao-it",
    title: "Tư vấn Chuyển giao Công nghệ & Đào tạo IT Doanh nghiệp",
    shortDesc: "Cung cấp chuyên gia công nghệ đồng hành, đào tạo nâng cao kỹ năng số cho đội ngũ nội bộ, tư vấn kiến trúc phần mềm và thẩm định công nghệ.",
    icon: "fa-chalkboard-user",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    order: 5,
    active: true,
    priceNote: "Thiết kế riêng theo nhu cầu",
    features: [
      "Đánh giá mức độ trưởng thành số và hiện trạng công nghệ doanh nghiệp",
      "Xây dựng khung kiến trúc công nghệ phù hợp với chiến lược 5 năm",
      "Đào tạo kỹ năng ứng dụng Trí tuệ nhân tạo (AI Tools) gia tăng năng suất",
      "Đào tạo văn hóa an toàn thông tin & phòng chống lừa đảo trực tuyến cho nhân sự",
      "Tư vấn lựa chọn giải pháp phần mềm phù hợp tránh lãng phí ngân sách",
      "Cung cấp chuyên gia CTO / IT Director cố vấn định kỳ"
    ],
    contentHtml: `
      <h3>Đồng Hành Cùng Doanh Nghiệp Nâng Cao Năng Lực Công Nghệ</h3>
      <p>Công nghệ thay đổi mỗi ngày, nếu đội ngũ nhân sự không kịp thời cập nhật sẽ tạo nên rào cản lớn cho sự phát triển. TechVision mang đến dịch vụ đào tạo thực chiến và cố vấn công nghệ cấp cao cho ban lãnh đạo.</p>

      <h4>Chương trình đào tạo & Chuyển giao:</h4>
      <ul>
        <li><strong>Ứng dụng AI & Tự động hóa:</strong> Hướng dẫn nhân viên văn phòng, marketing, kinh doanh làm chủ các công cụ AI (ChatGPT, Midjourney, Make, Zapier) nâng cao hiệu suất làm việc gấp 3 lần.</li>
        <li><strong>Nhận thức An toàn Thông tin Doanh nghiệp:</strong> Phòng tránh các hình thức tấn công Phishing, Ransomware và bảo vệ thông tin mật của công ty.</li>
        <li><strong>Thẩm định Công nghệ & Giải pháp:</strong> Hỗ trợ ban giám đốc đánh giá năng lực của các nhà cung cấp phần mềm bên ngoài, tránh rủi ro "mua hớ" giải pháp không phù hợp.</li>
        <li><strong>Chuyển giao Công nghệ & Mã nguồn:</strong> Đào tạo đội ngũ IT nội bộ tiếp quản, bảo trì và phát triển tiếp hệ thống sau khi nghiệm thu dự án.</li>
      </ul>

      <p>Mỗi khóa đào tạo đều được thiết kế theo đúng bài toán đặc thù của doanh nghiệp bạn với phương pháp học qua thực hành 100%.</p>
    `
  }
];

const DEFAULT_JOBS = [
  {
    id: "job-1",
    title: "Senior Fullstack Developer (Node.js & React/Vue)",
    department: "Phòng Phát triển Phần mềm",
    location: "Hà Nội / Hybrid",
    salary: "25 - 45 triệu VNĐ",
    type: "Toàn thời gian",
    experience: "Từ 3 năm kinh nghiệm",
    deadline: "30/11/2026",
    active: true,
    description: "Tham gia thiết kế kiến trúc và phát triển các hệ thống phần mềm doanh nghiệp quy mô lớn, tối ưu hóa hiệu năng và mở rộng hệ thống microservices.",
    requirements: [
      "Có ít nhất 3 năm kinh nghiệm lập trình với Node.js, Express / NestJS và ReactJS hoặc VueJS",
      "Thành thạo cơ sở dữ liệu quan hệ (PostgreSQL, MySQL) và NoSQL (MongoDB, Redis)",
      "Hiểu biết tốt về kiến trúc RESTful API, Microservices và thiết kế hệ thống có khả năng mở rộng cao",
      "Kinh nghiệm làm việc với Docker, CI/CD và các dịch vụ đám mây AWS là một lợi thế lớn",
      "Tinh thần trách nhiệm cao, kỹ năng giải quyết vấn đề tốt và làm việc nhóm hiệu quả"
    ],
    benefits: [
      "Mức lương cạnh tranh, thưởng dự án theo quý và thưởng tháng 13, 14",
      "Được cấp Macbook Pro mới 100% khi nhận việc",
      "Gói bảo hiểm sức khỏe Bảo Việt VIP cho bản thân và người thân",
      "Du lịch nghỉ dưỡng 5 sao 1-2 lần/năm, teambuilding định kỳ",
      "Hỗ trợ kinh phí thi các chứng chỉ quốc tế và đào tạo chuyên sâu"
    ]
  },
  {
    id: "job-2",
    title: "Chuyên Viên Digital Marketing & Performance Ads",
    department: "Phòng Truyền thông & Tiếp thị",
    location: "Hà Nội / TP.HCM",
    salary: "15 - 28 triệu VNĐ + Hoa hồng",
    type: "Toàn thời gian",
    experience: "Từ 2 năm kinh nghiệm",
    deadline: "25/11/2026",
    active: true,
    description: "Lên kế hoạch và trực tiếp vận hành các chiến dịch quảng cáo đa kênh (Google Ads, Facebook Ads, TikTok Ads), tối ưu tỷ lệ chuyển đổi và quản lý ngân sách tiếp thị.",
    requirements: [
      "Tối thiểu 2 năm kinh nghiệm chạy quảng cáo Performance (Google, Meta, TikTok) ngân sách từ 100 triệu/tháng",
      "Khả năng phân tích số liệu nhạy bén qua Google Analytics 4, Tag Manager và Looker Studio",
      "Có tư duy sáng tạo nội dung, hiểu tâm lý khách hàng B2B và B2C",
      "Chủ động, tích cực cập nhật các xu hướng và thuật toán quảng cáo mới",
      "Kỹ năng lập báo cáo rõ ràng và tư duy tối ưu chi phí theo ROI"
    ],
    benefits: [
      "Lương cứng hấp dẫn + thưởng phần trăm doanh số theo chiến dịch không giới hạn",
      "Môi trường năng động, trẻ trung, tự do đề xuất ý tưởng sáng tạo",
      "Được tài trợ ngân sách test thử các kênh và mô hình tiếp thị mới",
      "Đầy đủ chế độ BHXH, du lịch hàng năm, phụ cấp ăn trưa và gửi xe"
    ]
  },
  {
    id: "job-3",
    title: "UI/UX Designer Chuyên Nghiệp",
    department: "Phòng Thiết kế Sáng tạo",
    location: "Hà Nội / Hybrid",
    salary: "18 - 30 triệu VNĐ",
    type: "Toàn thời gian",
    experience: "Từ 2 năm kinh nghiệm",
    deadline: "15/12/2026",
    active: true,
    description: "Nghiên cứu hành vi người dùng, xây dựng User Flow, Wireframe và thiết kế giao diện UI/UX hoàn chỉnh cho các dự án Web App, Mobile App và Portal doanh nghiệp.",
    requirements: [
      "Thành thạo công cụ Figma, Adobe Creative Cloud, prototyping và xây dựng Design System chuẩn mực",
      "Có Portfolio các dự án thực tế ấn tượng (bắt buộc gửi kèm khi ứng tuyển)",
      "Hiểu biết về Responsive Design, Grid system, Accessibility và các nguyên lý UX cơ bản",
      "Khả năng làm việc chặt chẽ cùng đội ngũ lập trình Frontend để hiện thực hóa bản thiết kế",
      "Gu thẩm mỹ hiện đại, tinh tế và khả năng bắt kịp xu hướng thiết kế quốc tế"
    ],
    benefits: [
      "Môi trường sáng tạo, thiết bị màn hình đồ họa chuyên dụng 4K",
      "Thưởng năng suất theo từng dự án thiết kế hoàn thành xuất sắc",
      "Thời gian làm việc linh hoạt, hỗ trợ 2 ngày Remote/tháng",
      "Chế độ đãi ngộ vượt trội, văn hóa tôn trọng sự khác biệt cá nhân"
    ]
  },
  {
    id: "job-4",
    title: "Chuyên Viên Tư Vấn Giải Pháp Công Nghệ B2B",
    department: "Phòng Kinh doanh Doanh nghiệp",
    location: "Hà Nội / TP.HCM",
    salary: "12 - 20 triệu VNĐ + % Doanh số cao",
    type: "Toàn thời gian",
    experience: "Từ 1 năm kinh nghiệm",
    deadline: "20/12/2026",
    active: true,
    description: "Tiếp cận khách hàng doanh nghiệp, tư vấn các giải pháp thiết kế website, chuyển đổi số ERP/CRM và dịch vụ Cloud của công ty, đàm phán và ký kết hợp đồng.",
    requirements: [
      "Có ít nhất 1 năm kinh nghiệm kinh doanh B2B hoặc tư vấn bán hàng trong lĩnh vực CNTT / Phần mềm",
      "Giao tiếp lưu loát, kỹ năng thuyết trình, đàm phán và thuyết phục khách hàng tốt",
      "Đam mê kinh doanh, chịu được áp lực doanh số và có tinh thần cầu tiến",
      "Khả năng đọc hiểu tài liệu giải pháp kỹ thuật cơ bản",
      "Ngoại hình sáng sủa, tác phong chuyên nghiệp"
    ],
    benefits: [
      "Chính sách hoa hồng lũy tiến cực kỳ cạnh tranh, thu nhập trung bình 30 - 60 triệu/tháng",
      "Được cung cấp data khách hàng tiềm năng đã có nhu cầu từ bộ phận Marketing",
      "Đào tạo kỹ năng bán hàng B2B chuyên nghiệp từ các chuyên gia",
      "Cơ hội thăng tiến lên Trưởng nhóm / Trưởng phòng Kinh doanh sau 6 tháng"
    ]
  }
];

const DEFAULT_USERS = [
  {
    id: "user-1",
    username: "admin",
    // bcrypt hash of "admin123"
    passwordHash: bcrypt.hashSync("admin123", 10),
    fullName: "Quản Trị Viên Hệ Thống",
    email: "admin@techvision.vn",
    role: "admin",
    createdAt: new Date().toISOString()
  }
];

// Database API
const db = {
  // Settings
  getSettings() {
    return readJson('settings.json', DEFAULT_SETTINGS);
  },
  saveSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    writeJson('settings.json', updated);
    return updated;
  },

  // Pages content (home, contact, recruitment)
  getPages() {
    return readJson('pages.json', DEFAULT_PAGES);
  },
  getPage(pageName) {
    const pages = this.getPages();
    return pages[pageName] || null;
  },
  savePage(pageName, data) {
    const pages = this.getPages();
    pages[pageName] = { ...pages[pageName], ...data };
    writeJson('pages.json', pages);
    return pages[pageName];
  },

  // Services (5 services)
  getServices() {
    return readJson('services.json', DEFAULT_SERVICES);
  },
  getActiveServices() {
    const services = this.getServices();
    return services.filter(s => s.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  },
  getServiceById(id) {
    const services = this.getServices();
    return services.find(s => s.id === id);
  },
  getServiceBySlug(slug) {
    const services = this.getServices();
    return services.find(s => s.slug === slug);
  },
  saveService(serviceData) {
    const services = this.getServices();
    if (serviceData.id) {
      const idx = services.findIndex(s => s.id === serviceData.id);
      if (idx !== -1) {
        services[idx] = { ...services[idx], ...serviceData, updatedAt: new Date().toISOString() };
      } else {
        services.push({ ...serviceData, createdAt: new Date().toISOString() });
      }
    } else {
      serviceData.id = 'serv-' + Date.now();
      serviceData.createdAt = new Date().toISOString();
      services.push(serviceData);
    }
    writeJson('services.json', services);
    return serviceData;
  },
  deleteService(id) {
    let services = this.getServices();
    services = services.filter(s => s.id !== id);
    writeJson('services.json', services);
    return true;
  },

  // Jobs
  getJobs() {
    return readJson('jobs.json', DEFAULT_JOBS);
  },
  getActiveJobs() {
    const jobs = this.getJobs();
    return jobs.filter(j => j.active !== false);
  },
  getJobById(id) {
    const jobs = this.getJobs();
    return jobs.find(j => j.id === id);
  },
  saveJob(jobData) {
    const jobs = this.getJobs();
    if (jobData.id) {
      const idx = jobs.findIndex(j => j.id === jobData.id);
      if (idx !== -1) {
        jobs[idx] = { ...jobs[idx], ...jobData, updatedAt: new Date().toISOString() };
      } else {
        jobs.push({ ...jobData, createdAt: new Date().toISOString() });
      }
    } else {
      jobData.id = 'job-' + Date.now();
      jobData.createdAt = new Date().toISOString();
      jobs.push(jobData);
    }
    writeJson('jobs.json', jobs);
    return jobData;
  },
  deleteJob(id) {
    let jobs = this.getJobs();
    jobs = jobs.filter(j => j.id !== id);
    writeJson('jobs.json', jobs);
    return true;
  },

  // Contact Messages
  getMessages() {
    return readJson('messages.json', []);
  },
  addMessage(msg) {
    const messages = this.getMessages();
    const newMsg = {
      id: 'msg-' + Date.now(),
      name: msg.name || '',
      email: msg.email || '',
      phone: msg.phone || '',
      service: msg.service || 'Tư vấn chung',
      subject: msg.subject || 'Khách hàng liên hệ qua website',
      message: msg.message || '',
      createdAt: new Date().toISOString(),
      status: 'unread'
    };
    messages.unshift(newMsg);
    writeJson('messages.json', messages);
    return newMsg;
  },
  updateMessageStatus(id, status) {
    const messages = this.getMessages();
    const item = messages.find(m => m.id === id);
    if (item) {
      item.status = status;
      writeJson('messages.json', messages);
    }
    return item;
  },
  deleteMessage(id) {
    let messages = this.getMessages();
    messages = messages.filter(m => m.id !== id);
    writeJson('messages.json', messages);
    return true;
  },

  // Job Applications
  getApplications() {
    return readJson('applications.json', []);
  },
  addApplication(app) {
    const applications = this.getApplications();
    const newApp = {
      id: 'app-' + Date.now(),
      fullName: app.fullName || '',
      email: app.email || '',
      phone: app.phone || '',
      jobId: app.jobId || '',
      jobTitle: app.jobTitle || 'Chung',
      cvPath: app.cvPath || '',
      note: app.note || '',
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    applications.unshift(newApp);
    writeJson('applications.json', applications);
    return newApp;
  },
  updateApplicationStatus(id, status) {
    const applications = this.getApplications();
    const item = applications.find(a => a.id === id);
    if (item) {
      item.status = status;
      writeJson('applications.json', applications);
    }
    return item;
  },
  deleteApplication(id) {
    let applications = this.getApplications();
    applications = applications.filter(a => a.id !== id);
    writeJson('applications.json', applications);
    return true;
  },

  // Users & Auth
  getUsers() {
    return readJson('users.json', DEFAULT_USERS);
  },
  getUserByUsername(username) {
    const users = this.getUsers();
    return users.find(u => u.username === username);
  },
  updatePassword(username, newPassword) {
    const users = this.getUsers();
    const user = users.find(u => u.username === username);
    if (user) {
      user.passwordHash = bcrypt.hashSync(newPassword, 10);
      user.updatedAt = new Date().toISOString();
      writeJson('users.json', users);
      return true;
    }
    return false;
  },
  updateUserProfile(username, data) {
    const users = this.getUsers();
    const user = users.find(u => u.username === username);
    if (user) {
      if (data.fullName) user.fullName = data.fullName;
      if (data.email) user.email = data.email;
      writeJson('users.json', users);
      return user;
    }
    return null;
  }
};

// Initialize files if not exist
db.getSettings();
db.getPages();
db.getServices();
db.getJobs();
db.getUsers();
db.getMessages();
db.getApplications();

module.exports = db;

