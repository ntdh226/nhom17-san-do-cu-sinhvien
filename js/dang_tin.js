document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------------------
  // BƯỚC 1: Hàm validateField(id, errorMessage, condition)
  // Nhiệm vụ: kiểm tra 1 trường, hiện thông báo lỗi nếu không hợp lệ
  // ------------------------------------------------------------------
  function validateField(id, errorMessage, condition) {
    const field = document.getElementById(id);
    const errorEl = document.getElementById(`${id}-error`);
    if (!field || !errorEl) return true;

    if (condition(field.value)) {
      // Hợp lệ — xóa thông báo lỗi, xóa class lỗi
      errorEl.textContent = "";
      field.classList.remove("form-control--error");
      return true;
    } else {
      // Không hợp lệ — hiện thông báo lỗi đỏ ngay dưới trường
      errorEl.textContent = errorMessage;
      field.classList.add("form-control--error");
      return false;
    }
  }

  // ------------------------------------------------------------------
  // BƯỚC 2: Hàm validateCondition()
  // Nhiệm vụ: kiểm tra radio tình trạng đã chọn chưa
  // ------------------------------------------------------------------
  function validateCondition() {
    const radios = document.querySelectorAll('input[name="condition"]');
    const errorEl = document.getElementById("condition-error");
    const isChecked = [...radios].some((r) => r.checked);
    if (!errorEl) return true;

    if (isChecked) {
      errorEl.textContent = "";
      return true;
    } else {
      errorEl.textContent = "Vui lòng chọn tình trạng thiết bị.";
      return false;
    }
  }

  // ------------------------------------------------------------------
  // BƯỚC 3: Lắng nghe submit #dangTinForm
  // Nhiệm vụ: validate tất cả trường, nếu hợp lệ hiện thông báo thành công
  // ------------------------------------------------------------------
  const dangTinForm = document.getElementById("dangTinForm");
  if (dangTinForm) {
    dangTinForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validate từng trường — gọi validateField()
      const isTitle = validateField(
        "title",
        "Tiêu đề không được trống và phải có ít nhất 10 ký tự.",
        (val) => val.trim().length >= 10,
      );
      const isCategory = validateField(
        "category",
        "Vui lòng chọn danh mục sản phẩm.",
        (val) => val !== "",
      );
      const isBrand = validateField(
        "brand",
        "Vui lòng chọn hãng sản xuất.",
        (val) => val !== "",
      );
      const isCondition = validateCondition();

      const isPrice = validateField(
        "price",
        "Giá bán phải là số và phải lớn hơn 0.",
        (val) => val !== "" && Number(val) > 0,
      );
      const isLocation = validateField(
        "location",
        "Vui lòng chọn khu vực.",
        (val) => val !== "",
      );
      const isDescription = validateField(
        "description",
        "Mô tả không được trống và phải có ít nhất 20 ký tự.",
        (val) => val.trim().length >= 20,
      );

      // Nếu tất cả hợp lệ → thông báo thành công
      const allValid =
        isTitle &&
        isCategory &&
        isBrand &&
        isCondition &&
        isPrice &&
        isLocation &&
        isDescription;

      if (allValid) {
    alert('✅ Đăng tin thành công! Tin của bạn đang chờ duyệt.');
    dangTinForm.reset();
    document.querySelectorAll('.form-error').forEach((el) => {
        el.textContent = '';
    });
    updatePreview(); // Reset preview về mặc định
}
    });
  }

  // ------------------------------------------------------------------
  // BƯỚC 4: Preview realtime
  // Nhiệm vụ: khi người dùng gõ → cập nhật khung preview bên phải
  // ------------------------------------------------------------------
  function updatePreview() {
    const title = document.getElementById("title")?.value || "Tên sản phẩm";
    const price = document.getElementById("price")?.value || "0";
    const description =
      document.getElementById("description")?.value || "Mô tả sản phẩm...";

    const previewTitle = document.getElementById("preview-title");
    const previewPrice = document.getElementById("preview-price");
    const previewDesc = document.getElementById("preview-desc");

    if (previewTitle) previewTitle.textContent = title;
    if (previewPrice) previewPrice.textContent = formatPrice(Number(price));
    if (previewDesc) previewDesc.textContent = description;
  }

  // Lắng nghe input realtime trên 3 trường
  ["title", "price", "description"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", updatePreview);
  });

  // Gọi lần đầu để hiện giá trị mặc định
  updatePreview();

  // Preview ảnh khi người dùng chọn file
const imageInput = document.getElementById('image');
const imgPlaceholder = document.querySelector('.preview-card__img-placeholder');

if (imageInput && imgPlaceholder) {
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imgPlaceholder.innerHTML = `
                    <img src="${e.target.result}" 
                         alt="Preview" 
                         style="width:100%; height:100%; object-fit:cover;">
                `;
            };
            reader.readAsDataURL(file);
        }
    });
}

  console.log("✅ [dang_tin.js] Loaded: Validate form sẵn sàng.");
});
