# 📱 Sàn Giao Dịch Đồ Điện Tử Cũ Sinh Viên

> Đồ án môn Thiết kế và Lập trình Web — Nhóm 17

## 🔗 Link Demo

**[https://nhom17-san-do-cu-sinhvien.vercel.app](https://nhom17-san-do-cu-sinhvien.vercel.app)**

---

## 👥 Thành viên nhóm

| Họ tên | Vai trò | Nhiệm vụ |
|---|---|---|
| Ngô Thị Diệu Hiền | Frontend Architect (Nhóm trưởng) | HTML Semantic, CSS Grid/Flexbox, Design System, GitHub |
| Siu Đặng Lan Hương | UI/UX Developer | UI Components, Animation, Responsive Design |
| Nguyễn Lý Tường Vy | JavaScript Engineer | Logic bộ lọc, Validate form, Render động |

---

## 🎯 Tính năng chính

### Bộ lọc tìm kiếm nâng cao
- Tìm kiếm theo từ khóa
- Lọc theo danh mục, khoảng giá, tình trạng thiết bị
- Sắp xếp theo mới nhất / giá tăng / giá giảm
- Bộ lọc accordion — thu gọn / mở rộng mượt mà
- Nút xóa bộ lọc nhanh

### Trang đăng tin
- Form đầy đủ 8 trường thông tin
- Validate realtime từng trường
- Xem trước sản phẩm realtime (tiêu đề, giá, mô tả, ảnh)
- Upload và preview ảnh sản phẩm

### Tính năng khác
- Giỏ hàng với badge số lượng
- Navigation 2 cấp dropdown
- Responsive 3 breakpoint: desktop / tablet / mobile

---

## 🛠 Công nghệ sử dụng

- **HTML5 Semantic** — Cấu trúc chuẩn, Accessibility, SEO
- **CSS3** — Grid, Flexbox, Custom Properties, Media Queries, Transitions
- **JavaScript ES6+** — DOM manipulation, Array methods, URLSearchParams, FileReader API
- **Git & GitHub** — Quản lý phiên bản, Pull Request workflow
- **Vercel** — Deploy website tĩnh

---

## 📁 Cấu trúc thư mục

```
san_do_cu_cntt/
├── assets/
│   └── images/        Ảnh sản phẩm mẫu
├── css/
│   ├── base.css       Design system: biến màu, reset, utility classes
│   ├── index.css      Layout trang chủ
│   └── dang_tin.css   Layout trang đăng tin
├── js/
│   ├── data.js        Mock data 6 sản phẩm
│   ├── main.js        Utility functions + logic trang chủ
│   └── dang_tin.js    Validate form + preview realtime
├── pages/
│   └── dang_tin.html  Trang đăng tin
└── index.html         Trang chủ + danh sách + bộ lọc
```

---

## 🚀 Hướng dẫn chạy local

```bash
git clone https://github.com/ntdh226/nhom17-san-do-cu-sinhvien.git
cd nhom17-san-do-cu-sinhvien
# Mở index.html bằng trình duyệt hoặc dùng Live Server trên VSCode
```

---

## 📌 Ghi chú

- Dữ liệu sản phẩm được giả lập trong `js/data.js`
- Không sử dụng framework hay thư viện ngoài
- Ảnh sản phẩm lưu trong `assets/images/`
