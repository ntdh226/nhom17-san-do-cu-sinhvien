// ==========================================================================
// MOCK DATA CHUNG - SÀN ĐỒ CŨ SINH VIÊN
// ==========================================================================
// TODO [Tường Vy]: Đây là Database giả lập của dự án. Đọc kỹ cấu trúc:
// 1. `price` là KIỂU SỐ (Number) để thực hiện phép tính (>, <) khi lọc giá.
//    Khi render ra HTML mới dùng JS để format thêm chữ " đ".
// 2. `category` khớp 100% với ?cat= trên URL navigation (danh mục con).
// 3. `condition` khớp 100% với option value của #filterStatus trong HTML.
// 4. Dùng mảng `products` này với map() hoặc forEach() để render card.
//
// TODO [Lan Hương]: Khi thiết kế Card, nhớ chừa chỗ cho:
//    `title` (chống tràn 2 dòng), `price` (font to), `location` (chữ nhỏ).
// ==========================================================================

const products = [
  {
    id: "sp-001",
    title: "iPhone 13 Pro Max 128GB Bản VN/A",
    price: 14500000,
    category: "iphone", // khớp ?cat=iphone
    brand: "apple",
    condition: "likenew",
    location: "Ký túc xá ĐH Tây Nguyên",
    image: "assets/images/sp-001.jpg",
    description:
      "Máy còn bảo hành Apple Care 3 tháng. Pin 95%, không một vết xước. Tặng kèm ốp lưng xịn.",
    postedAt: "2026-05-25",
  },
  {
    id: "sp-002",
    title: "Laptop Dell Inspiron 15 3511 Core i5",
    price: 8500000,
    category: "dell", // khớp ?cat=dell
    brand: "dell",
    condition: "used",
    location: "Ea Kao, Đắk Lắk",
    image: "assets/images/sp-002.jpg",
    description:
      "RAM 8GB, SSD 512GB. Bàn phím êm, màn đẹp không điểm chết. Pin hơi chai nhẹ.",
    postedAt: "2026-05-24",
  },
  {
    id: "sp-003",
    title: "Tai nghe Bluetooth Sony WH-1000XM4",
    price: 4200000,
    category: "tai-nghe", // khớp ?cat=tai-nghe
    brand: "sony",
    condition: "likenew",
    location: "Trường Đại học Tây Nguyên",
    image: "assets/images/sp-003.jpg",
    description:
      "Tai nghe chống ồn chủ động, học bài ở thư viện cực tập trung. Mới mua 1 tháng.",
    postedAt: "2026-05-23",
  },
  {
    id: "sp-004",
    title: "Samsung Galaxy S22 Ultra 256GB",
    price: 11000000,
    category: "samsung", // khớp ?cat=samsung
    brand: "samsung",
    condition: "used",
    location: "Khu vực cổng trường ĐHTN",
    image: "assets/images/sp-004.jpg",
    description:
      "Bút S-Pen nhạy, camera zoom 100x chụp tài liệu trên bảng cực nét. Xước dăm nhẹ ở viền.",
    postedAt: "2026-05-22",
  },
  {
    id: "sp-005",
    title: "Macbook Air M1 2020 8GB/256GB",
    price: 13500000,
    category: "macbook", // khớp ?cat=macbook
    brand: "apple",
    condition: "likenew",
    location: "Ea Kao, Đắk Lắk",
    image: "assets/images/sp-005.jpg",
    description:
      "Gọn nhẹ cho sinh viên, pin trâu xài cả ngày không cần sạc. Ngoại hình đẹp keng.",
    postedAt: "2026-05-21",
  },
  {
    id: "sp-006",
    title: "Bàn phím cơ Logitech G Pro X TKL",
    price: 1800000,
    category: "chuot-ban-phim", // khớp ?cat=chuot-ban-phim
    brand: "logitech",
    condition: "used",
    location: "Ký túc xá ĐH Tây Nguyên",
    image: "assets/images/sp-006.jpg",
    description:
      "Blue Switch gõ đã tay, LED RGB đồng bộ. Keycap mờ nhẹ phím WASD, còn lại hoàn hảo.",
    postedAt: "2026-05-20",
  },
];

console.log("✅ [data.js] Loaded:", products.length, "sản phẩm mẫu.");
