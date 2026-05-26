// ==========================================================================
// UTILITY FUNCTIONS CHUNG (MAIN.JS) - FRONTEND ARCHITECT LAYER
// ==========================================================================
// Quy định hệ thống: File này chứa lõi xử lý logic dùng chung cho toàn bộ website.
// Tường Vy và Lan Hương kế thừa các hàm dưới đây,
// tuyệt đối không tự viết lại logic định dạng hoặc bóc tách chuỗi thủ công.
// ==========================================================================

/**
 * Hàm 1: Định dạng số tiền thành chuỗi tiền tệ Việt Nam (VND).
 * @param {number} price - Giá trị số học cần định dạng (Ví dụ: 14500000)
 * @returns {string} Chuỗi tiền tệ có dấu phân cách hàng nghìn (Ví dụ: "14.500.000 đ")
 */
function formatPrice(price) {
  if (typeof price !== "number") {
    return "0 đ";
  }
  return price.toLocaleString("vi-VN") + " đ";
}

/**
 * Hàm 2: Render danh sách sản phẩm ra màn hình DOM theo chuẩn BEM.
 * @param {Array<Object>} productList - Mảng các đối tượng sản phẩm cần hiển thị
 * @param {string} containerId - ID của thẻ HTML đích (Ví dụ: "productGrid")
 * @returns {void}
 */
function renderProducts(productList, containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(
      `[Error] Container "#${containerId}" không tồn tại trên trang này.`,
    );
    return;
  }

  if (!productList || productList.length === 0) {
    container.innerHTML = `
            <div class="product-showroom__empty">
                <p class="product-showroom__empty-title">🔍 Không tìm thấy sản phẩm phù hợp.</p>
                <small class="product-showroom__empty-sub">Vui lòng điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm.</small>
            </div>
        `;
    return;
  }

  const isSubPage = window.location.pathname.includes("/pages/");
  const pagePrefix = isSubPage ? "" : "pages/";
  const assetPrefix = isSubPage ? "../" : "";

  const htmlCards = productList
    .map((product) => {
      const detailUrl = `${pagePrefix}chi-tiet.html?id=${product.id}`;
      const imageUrl = `${assetPrefix}${product.image}`;
      const conditionText =
        product.condition === "likenew"
          ? "Mới 99% (Like New)"
          : "Cũ (Đã sử dụng)";

      return `
            <article class="product-card u-hover-card">
                <a href="${detailUrl}" class="product-card__image-link">
                    <img src="${imageUrl}" alt="${product.title}" class="product-card__img product-card__image">
                </a>
                <div class="product-card__content">
                    <h3 class="product-card__title">
                        <a href="${detailUrl}">${product.title}</a>
                    </h3>
                    <p class="product-price">${formatPrice(product.price)}</p>
                    <p class="product-meta">Tình trạng: ${conditionText} | Khu vực: ${product.location}</p>
                </div>
            </article>
        `.trim();
    })
    .join("");

  container.innerHTML = htmlCards;
}

/**
 * Hàm 3: Trích xuất giá trị tham số từ URL.
 * @param {string} key - Tên tham số cần lấy (Ví dụ: "cat", "id")
 * @returns {string|null} Giá trị tham số, hoặc null nếu không tồn tại
 */
function getUrlParam(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

/**
 * Hàm 4: Lọc sản phẩm theo nhiều tiêu chí linh hoạt.
 * @param {Object} filters - Đối tượng chứa các tiêu chí lọc
 * @param {string} [filters.category] - Mã danh mục ("iphone", "dell", "tai-nghe"...)
 * @param {string} [filters.condition] - Tình trạng ("likenew" hoặc "used")
 * @param {number} [filters.minPrice] - Giá tối thiểu (người dùng nhập "giá từ")
 * @returns {Array<Object>} Mảng sản phẩm đã lọc
 */
function filterProducts(filters) {
  if (typeof products === "undefined") {
    console.error(
      "[Fatal] Không tìm thấy 'products'. Kiểm tra data.js đã load trước main.js chưa.",
    );
    return [];
  }

  return products.filter((product) => {
    // Tiêu chí 1: Danh mục
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Tiêu chí 2: Tình trạng
    if (
      filters.condition &&
      filters.condition !== "all" &&
      product.condition !== filters.condition
    ) {
      return false;
    }

    // Tiêu chí 3: Giá từ (minPrice) — người dùng nhập giá tối thiểu
    if (filters.minPrice && product.price < Number(filters.minPrice)) {
      return false;
    }

    return true;
  });
}

console.log("✅ [main.js] Loaded: Utility functions sẵn sàng.");

// ==========================================================================
// KHỞI ĐỘNG TRANG CHỦ (Chỉ chạy trên trang chủ)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  if (
    currentPath === "/" ||
    currentPath.endsWith("index.html") ||
    currentPath === ""
  ) {
    const productGridId = "productGrid";

    // Việc 1: Render toàn bộ sản phẩm mặc định khi DOM vừa load xong
    renderProducts(products, productGridId);

    // Việc 2: Lắng nghe sự kiện submit của form bộ lọc
    const filterForm = document.getElementById("filterForm");
    if (filterForm) {
      filterForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const priceValue = document.getElementById("filterPrice").value;
        const statusValue = document.getElementById("filterStatus").value;

        const filters = {};

        // minPrice vì label là "Khoảng giá từ" — lọc sản phẩm có giá >= giá nhập vào
        if (priceValue) {
          filters.minPrice = Number(priceValue);
        }

        // Bỏ qua lọc condition nếu người dùng chọn "Tất cả"
        if (statusValue && statusValue !== "all") {
          filters.condition = statusValue;
        }

        const filteredProducts = filterProducts(filters);
        renderProducts(filteredProducts, productGridId);

        // Cuộn mượt xuống khu vực sản phẩm để người dùng thấy kết quả
        const showroomSection = document.querySelector(".product-showroom");
        if (showroomSection) {
          showroomSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".header__search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const keyword = document
        .querySelector(".header__search-input")
        .value.trim();
      if (keyword) {
        // Chuyển sang trang danh sách với từ khóa tìm kiếm
        const isSubPage = window.location.pathname.includes("/pages/");
        const prefix = isSubPage ? "" : "pages/";
        window.location.href = `${prefix}danh_sach.html?search=${encodeURIComponent(keyword)}`;
      }
    });
  }
});
