// ==========================================================================
// MAIN.JS — Utility functions dùng chung cho toàn bộ website
// ==========================================================================

/**
 * Định dạng số tiền thành chuỗi tiền tệ Việt Nam (VND).
 * @param {number} price - Giá trị số học (Ví dụ: 14500000)
 * @returns {string} Chuỗi có dấu phân cách hàng nghìn (Ví dụ: "14.500.000 đ")
 */
function formatPrice(price) {
  if (typeof price !== "number") {
    return "0 đ";
  }
  return price.toLocaleString("vi-VN") + " đ";
}

/**
 * Render danh sách sản phẩm ra DOM theo chuẩn BEM.
 * @param {Array<Object>} productList - Mảng sản phẩm cần hiển thị
 * @param {string} containerId - ID của thẻ HTML đích (Ví dụ: "productGrid")
 */
function renderProducts(productList, containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`[Error] Container "#${containerId}" không tồn tại.`);
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
        product.condition === "likenew" ? "Mới 99% (Like New)" : "Cũ (Đã sử dụng)";

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
            <button
              class="product-card__btn-cart btn-cart u-active"
              data-product-id="${product.id}"
              aria-label="Thêm ${product.title} vào giỏ hàng"
            >
              🛒 Thêm vào giỏ
            </button>
          </div>
        </article>
      `.trim();
    })
    .join("");

  container.innerHTML = htmlCards;
}

/**
 * Trích xuất giá trị tham số từ URL.
 * @param {string} key - Tên tham số cần lấy (Ví dụ: "cat", "id")
 * @returns {string|null} Giá trị tham số, hoặc null nếu không tồn tại
 */
function getUrlParam(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

/**
 * Lọc sản phẩm theo nhiều tiêu chí linh hoạt.
 * @param {Object} filters - Đối tượng chứa các tiêu chí lọc
 * @param {string}  [filters.category]  - Mã danh mục ("iphone", "dell", "tai-nghe"...)
 * @param {string}  [filters.condition] - Tình trạng ("likenew" hoặc "used")
 * @param {number}  [filters.minPrice]  - Giá tối thiểu
 * @returns {Array<Object>} Mảng sản phẩm đã lọc
 */
function filterProducts(filters) {
  if (typeof products === "undefined") {
    console.error("[Fatal] Không tìm thấy 'products'. Kiểm tra data.js đã load trước main.js chưa.");
    return [];
  }

  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;

    if (filters.condition && filters.condition !== "all" && product.condition !== filters.condition) return false;

    if (filters.minPrice && product.price < Number(filters.minPrice)) return false;

    return true;
  });
}

console.log("✅ [main.js] Loaded: Utility functions sẵn sàng.");

// ==========================================================================
// KHỞI ĐỘNG TRANG CHỦ (Chỉ chạy trên trang chủ)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  // --- Render sản phẩm trang chủ ---
  if (currentPath === "/" || currentPath.endsWith("index.html") || currentPath === "") {
    renderProducts(products, "productGrid");
    updateProductCount(products.length);
    initFilterBar();
    initNavFilter();
  }

  // Cập nhật badge giỏ hàng khi load
  if (typeof updateCartBadge === "function") updateCartBadge();

  // --- Tìm kiếm: lọc ngay tại trang chủ thay vì chuyển trang ---
  const searchForm = document.querySelector(".header__search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const keyword = document.querySelector(".header__search-input").value.trim().toLowerCase();
      if (!keyword) return;

      const result = products.filter((p) =>
        p.title.toLowerCase().includes(keyword)
      );

      // Mở filter bar nếu đang đóng
      const filterBar = document.getElementById("filterBar");
      if (filterBar && !filterBar.classList.contains("filter-bar--open")) {
        filterBar.classList.add("filter-bar--open");
        document.getElementById("filterToggle")?.setAttribute("aria-expanded", "true");
      }

      renderProducts(result, "productGrid");
      updateProductCount(result.length);
      syncCartButtons();

      // Scroll xuống grid
      document.getElementById("productGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // --- Event delegation: nút thêm vào giỏ ---
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-cart");
    if (!btn) return;
    const productId = btn.dataset.productId;
    if (!productId || typeof addToCart !== "function") return;

    const result = addToCart(productId);
    if (result === true) {
      btn.textContent = "✅ Đã thêm";
      btn.classList.add("btn-cart--added");
      btn.disabled = true;
      showToast("Đã thêm sản phẩm vào giỏ hàng! 🎉");
    } else if (result === "exists") {
      showToast("Sản phẩm đã có trong giỏ hàng.", "warning");
    }
  });
});

/** Cập nhật số lượng kết quả hiển thị */
function updateProductCount(count) {
  const el = document.getElementById("productCount");
  if (!el) return;
  el.textContent = count > 0 ? `Hiển thị ${count} sản phẩm` : "";
}

/** Khởi động bộ lọc nâng cao trang chủ */
function initFilterBar() {
  const filterBar = document.getElementById("filterBar");
  const toggle = document.getElementById("filterToggle");
  const panel = document.getElementById("filterPanel");
  if (!filterBar || !toggle || !panel) return;

  // Toggle mở/đóng
  toggle.addEventListener("click", () => {
    const isOpen = filterBar.classList.toggle("filter-bar--open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Nút áp dụng
  document.getElementById("filterApply")?.addEventListener("click", applyFilters);

  // Nút đặt lại
  document.getElementById("filterReset")?.addEventListener("click", () => {
    document.getElementById("filterCategory").value = "";
    document.getElementById("filterCondition").value = "all";
    document.getElementById("filterLocation").value = "";
    document.getElementById("filterMinPrice").value = "";
    document.getElementById("filterMaxPrice").value = "";
    document.getElementById("filterSort").value = "newest";
    renderProducts(products, "productGrid");
    updateProductCount(products.length);
    syncCartButtons();
  });
}

/** Áp dụng bộ lọc và sắp xếp */
function applyFilters() {
  const category = document.getElementById("filterCategory").value;
  const condition = document.getElementById("filterCondition").value;
  const location = document.getElementById("filterLocation").value;
  const minPrice = parseFloat(document.getElementById("filterMinPrice").value) || 0;
  const maxPrice = parseFloat(document.getElementById("filterMaxPrice").value) || Infinity;
  const sort = document.getElementById("filterSort").value;

  let result = products.filter((p) => {
    if (category && p.category !== category) return false;
    if (condition && condition !== "all" && p.condition !== condition) return false;
    if (location && p.locationKey !== location) return false;
    if (p.price < minPrice) return false;
    if (p.price > maxPrice) return false;
    return true;
  });

  // Sắp xếp
  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  else result.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

  renderProducts(result, "productGrid");
  updateProductCount(result.length);
  syncCartButtons();
}

/** Đồng bộ trạng thái nút giỏ hàng sau khi re-render */
function syncCartButtons() {
  if (typeof getCart !== "function") return;
  const cart = getCart();
  const cartIds = cart.map((item) => item.id);
  document.querySelectorAll(".btn-cart").forEach((btn) => {
    if (cartIds.includes(btn.dataset.productId)) {
      btn.textContent = "✅ Đã thêm";
      btn.classList.add("btn-cart--added");
      btn.disabled = true;
    }
  });
}

/** Click vào link danh mục trong nav → lọc tại chỗ, không chuyển trang */
function initNavFilter() {
  document.querySelectorAll(".nav-filter").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = link.dataset.filterCat;

      // Gán vào select của filter bar
      const filterCategory = document.getElementById("filterCategory");
      if (filterCategory) filterCategory.value = cat || "";

      // Reset các filter khác
      const cond = document.getElementById("filterCondition");
      const loc = document.getElementById("filterLocation");
      const minP = document.getElementById("filterMinPrice");
      const maxP = document.getElementById("filterMaxPrice");
      const sort = document.getElementById("filterSort");
      if (cond) cond.value = "all";
      if (loc) loc.value = "";
      if (minP) minP.value = "";
      if (maxP) maxP.value = "";
      if (sort) sort.value = "newest";

      // Lọc
      const result = cat ? products.filter((p) => p.category === cat) : [...products];
      result.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

      // Mở filter bar để thấy bộ lọc đang active
      const filterBar = document.getElementById("filterBar");
      if (filterBar && !filterBar.classList.contains("filter-bar--open")) {
        filterBar.classList.add("filter-bar--open");
        document.getElementById("filterToggle")?.setAttribute("aria-expanded", "true");
      }

      renderProducts(result, "productGrid");
      updateProductCount(result.length);
      syncCartButtons();

      // Scroll xuống grid
      document.getElementById("productGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
