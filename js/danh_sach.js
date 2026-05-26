document.addEventListener("DOMContentLoaded", () => {
  // BƯỚC 1: Hàm renderWithCount(list)
  function renderWithCount(list) {
    renderProducts(list, "productGrid");

    const resultCount = document.getElementById("resultCount");
    if (resultCount) {
      resultCount.textContent =
        list.length > 0 ? `Tìm thấy ${list.length} sản phẩm` : "";
    }
  }

  // BƯỚC 2: Render mặc định khi vào trang
  const catFromUrl = getUrlParam("cat");
  // Thêm vào sau dòng const catFromUrl = getUrlParam('cat');
const searchFromUrl = getUrlParam('search');

if (searchFromUrl) {
    const searchInput = document.getElementById('searchKeyword');
    if (searchInput) searchInput.value = searchFromUrl;
    const filtered = products.filter(p =>
        p.title.toLowerCase().includes(searchFromUrl.toLowerCase())
    );
    renderWithCount(filtered);
} else if (catFromUrl) {
    const filterCategory = document.getElementById("filterCategory");
    if (filterCategory) {
      filterCategory.value = catFromUrl;
    }
    const filtered = filterProducts({ category: catFromUrl });
    renderWithCount(filtered);
  } else {
    renderWithCount(products);
  }

  // BƯỚC 3: Lắng nghe submit form bộ lọc
  const filterForm = document.getElementById("filterForm");
  if (filterForm) {
    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const keyword = document
        .getElementById("searchKeyword")
        .value.trim()
        .toLowerCase();
      const category = document.getElementById("filterCategory").value;
      const brand = document.getElementById("filterBrand").value;
      const priceMin = document.getElementById("filterPriceMin").value;
      const priceMax = document.getElementById("filterPriceMax").value;
      const condition = document.getElementById("filterCondition").value;
      const location = document.getElementById("filterLocation").value;
      const sort = document.getElementById("filterSort").value;

      let result = [...products];

      if (keyword) {
        result = result.filter((p) => p.title.toLowerCase().includes(keyword));
      }
      if (category) {
        result = result.filter((p) => p.category === category);
      }
      if (brand) {
        result = result.filter((p) => p.brand === brand);
      }
      if (priceMin) {
        result = result.filter((p) => p.price >= Number(priceMin));
      }
      if (priceMax) {
        result = result.filter((p) => p.price <= Number(priceMax));
      }
      if (condition && condition !== "all") {
        result = result.filter((p) => p.condition === condition);
      }

      if (location) {
        result = result.filter((p) => p.locationKey === location);
      }

      if (sort === "price-asc") {
        result.sort((a, b) => a.price - b.price);
      } else if (sort === "price-desc") {
        result.sort((a, b) => b.price - a.price);
      } else {
        result.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
      }

      renderWithCount(result);

      document
        .querySelector(".product-showroom")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // BƯỚC 4: Lắng nghe click nút Xóa bộ lọc
  const btnReset = document.getElementById("btnReset");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      renderWithCount(products);
    });
  }

  console.log("✅ [danh_sach.js] Loaded: Bộ lọc nâng cao sẵn sàng.");
});
