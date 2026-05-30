document.addEventListener("DOMContentLoaded", () => {

  // Validate 1 trường: trả về true nếu hợp lệ, false nếu không
  function validateField(id, errorMsg, condition) {
    const field   = document.getElementById(id);
    const errorEl = document.getElementById(`${id}-error`);
    if (!field || !errorEl) return true;
    const valid = condition(field.value);
    errorEl.textContent = valid ? "" : errorMsg;
    field.classList.toggle("form-control--error", !valid);
    return valid;
  }

  // Validate radio tình trạng
  function validateCondition() {
    const errorEl = document.getElementById("condition-error");
    const checked = [...document.querySelectorAll('input[name="condition"]')].some((r) => r.checked);
    if (errorEl) errorEl.textContent = checked ? "" : "Vui lòng chọn tình trạng thiết bị.";
    return checked;
  }

  // Cập nhật preview realtime khi người dùng gõ
  function updatePreview(resetImg = false) {
    const title = document.getElementById("title")?.value || "Tên sản phẩm";
    const price = document.getElementById("price")?.value || "0";
    const desc  = document.getElementById("description")?.value || "Mô tả sản phẩm...";

    const el = (id) => document.getElementById(id);
    if (el("preview-title")) el("preview-title").textContent = title;
    if (el("preview-price")) el("preview-price").textContent = formatPrice(Number(price));
    if (el("preview-desc"))  el("preview-desc").textContent  = desc;

    if (resetImg) {
      const placeholder = document.querySelector(".preview-card__img-placeholder");
      if (placeholder) placeholder.innerHTML = "📷";
    }
  }

  // Lắng nghe input realtime
  ["title", "price", "description"].forEach((id) =>
    document.getElementById(id)?.addEventListener("input", () => updatePreview())
  );

  // Preview ảnh khi chọn file
  const imageInput   = document.getElementById("image");
  const imgPlaceholder = document.querySelector(".preview-card__img-placeholder");
  imageInput?.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file || !imgPlaceholder) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      imgPlaceholder.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width:100%;height:100%;object-fit:cover;">`;
    };
    reader.readAsDataURL(file);
  });

  // Submit form — validate rồi hiện thông báo
  document.getElementById("dangTinForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const valid =
      validateField("title",       "Tiêu đề phải có ít nhất 10 ký tự.",     (v) => v.trim().length >= 10) &
      validateField("category",    "Vui lòng chọn danh mục.",                (v) => v !== "") &
      validateField("brand",       "Vui lòng chọn hãng sản xuất.",           (v) => v !== "") &
      validateCondition() &
      validateField("price",       "Giá bán phải lớn hơn 0.",                (v) => v !== "" && Number(v) > 0) &
      validateField("location",    "Vui lòng chọn khu vực.",                 (v) => v !== "") &
      validateField("description", "Mô tả phải có ít nhất 20 ký tự.",        (v) => v.trim().length >= 20);

    if (valid) {
      alert("✅ Đăng tin thành công! Tin của bạn đang chờ duyệt.");
      e.target.reset();
      document.querySelectorAll(".form-error").forEach((el) => (el.textContent = ""));
      updatePreview(true);
    }
  });

  updatePreview();
  console.log("✅ [dang_tin.js] Loaded.");
});
