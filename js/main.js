// ==========================================================================
// MAIN.JS — Utility functions dùng chung cho toàn bộ website
// ==========================================================================

const cart = [];

// Cập nhật badge số lượng trên icon giỏ hàng
function updateCartBadge() {
  const cartIcon = document.querySelector(".header__cart-icon");
  if (!cartIcon) return;
  let badge = cartIcon.querySelector(".cart-badge");
  if (cart.length === 0) {
    badge?.remove();
    return;
  }
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "cart-badge";
    cartIcon.appendChild(badge);
  }
  badge.textContent = cart.length;
}

// Thêm sản phẩm vào giỏ, đổi trạng thái nút 1.5 giây
function addToCart(productId, btn) {
  cart.push(productId);
  updateCartBadge();
  btn.textContent = "Đã thêm ✓";
  btn.classList.add("added");
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = "Thêm vào giỏ";
    btn.classList.remove("added");
    btn.disabled = false;
  }, 1500);
}

// Định dạng giá tiền VNĐ: 14500000 → "14.500.000 đ"
function formatPrice(price) {
  return typeof price === "number"
    ? price.toLocaleString("vi-VN") + " đ"
    : "0 đ";
}

// Cập nhật dòng đếm kết quả
function updateResultCount(count) {
  const el = document.getElementById("resultCount");
  if (el) el.textContent = count > 0 ? `Tìm thấy ${count} sản phẩm` : "";
}

// Render danh sách sản phẩm vào container, kèm nút giỏ hàng
function renderProducts(productList, containerId) {
  const container = document.getElementById(containerId);
  if (!container)
    return console.error(`[Error] "#${containerId}" không tồn tại.`);

  if (!productList?.length) {
    container.innerHTML = `
      <div class="product-showroom__empty">
        <p class="product-showroom__empty-title">🔍 Không tìm thấy sản phẩm phù hợp.</p>
        <small>Vui lòng điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm.</small>
      </div>`;
    return;
  }

  const isSubPage = window.location.pathname.includes("/pages/");
  const pagePrefix = isSubPage ? "" : "pages/";
  const assetPrefix = isSubPage ? "../" : "";

  container.innerHTML = productList
    .map(
      (p) => `
    <article class="product-card u-hover-card">
      <a href="${pagePrefix}chi-tiet.html?id=${p.id}">
        <img src="${assetPrefix}${p.image}" alt="${p.title}" class="product-card__img product-card__image">
      </a>
      <div class="product-card__content">
        <h3 class="product-card__title"><a href="${pagePrefix}chi-tiet.html?id=${p.id}">${p.title}</a></h3>
        <p class="product-price">${formatPrice(p.price)}</p>
        <p class="product-meta">${p.condition === "likenew" ? "Mới 99%" : "Đã dùng"} · ${p.location}</p>
      </div>
      <div class="product-card__footer">
        <button class="btn-add-cart" data-id="${p.id}">Thêm vào giỏ</button>
      </div>
    </article>`,
    )
    .join("");

  container.querySelectorAll(".btn-add-cart").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(btn.dataset.id, btn);
    }),
  );
}

// Áp dụng bộ lọc và sắp xếp lên mảng products
function applyFilters() {
  const get = (id) => document.getElementById(id)?.value ?? "";
  const keyword = get("searchKeyword").trim().toLowerCase();
  const category = get("filterCategory");
  const priceMin = get("filterPriceMin");
  const priceMax = get("filterPriceMax");
  const condition = get("filterCondition");
  const sort = get("filterSort");

  let result = products.filter((p) => {
    if (keyword && !p.title.toLowerCase().includes(keyword)) return false;
    if (category && p.category !== category) return false;
    if (priceMin && p.price < Number(priceMin)) return false;
    if (priceMax && p.price > Number(priceMax)) return false;
    if (condition && condition !== "all" && p.condition !== condition)
      return false;
    return true;
  });

  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (!sort || sort === "newest")
    result.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

  return result;
}

console.log("✅ [main.js] Loaded.");

// ==========================================================================
// KHỞI ĐỘNG
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const isHomePage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname.endsWith("/");

  // --- Trang chủ ---
  if (isHomePage) {
    const params = new URLSearchParams(window.location.search);
    const catFromUrl = params.get("cat");
    const searchFromUrl = params.get("search");

    // Điền sẵn input nếu vào từ URL có params
    if (searchFromUrl) {
      const el = document.getElementById("searchKeyword");
      if (el) el.value = searchFromUrl;
    } else if (catFromUrl) {
      const el = document.getElementById("filterCategory");
      if (el) el.value = catFromUrl;
    }

    const initialList = applyFilters();
    renderProducts(initialList, "productGrid");
    updateResultCount(initialList.length);

    // Toggle panel bộ lọc
    const filterToggle = document.getElementById("filterToggle");
    const filterPanel = document.getElementById("filterPanel");
    filterToggle?.addEventListener("click", () => {
      const open = filterPanel.classList.toggle("is-open");
      filterToggle.classList.toggle("is-open", open);
    });

    // Submit / reset / sort
    const filterForm = document.getElementById("filterForm");
    filterForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const result = applyFilters();
      renderProducts(result, "productGrid");
      updateResultCount(result.length);
      filterPanel?.classList.remove("is-open");
      filterToggle?.classList.remove("is-open");
      document
        .querySelector(".product-showroom")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("btnReset")?.addEventListener("click", () => {
      renderProducts(products, "productGrid");
      updateResultCount(products.length);
    });

    document
      .getElementById("filterSort")
      ?.addEventListener("change", () =>
        filterForm?.dispatchEvent(new Event("submit")),
      );
  }

  // --- Tìm kiếm từ header (áp dụng mọi trang) ---
  document
    .querySelector(".header__search-form")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      const keyword = document
        .querySelector(".header__search-input")
        ?.value.trim();
      if (keyword) {
        const base = window.location.pathname.includes("/pages/")
          ? "../index.html"
          : "index.html";
        window.location.href = `${base}?search=${encodeURIComponent(keyword)}`;
      }
    });
});
