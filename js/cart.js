// ==========================================================================
// CART.JS — Quản lý giỏ hàng (lưu trong sessionStorage)
// ==========================================================================

const CART_KEY = "sando_cart";

/** Lấy giỏ hàng từ storage */
function getCart() {
  try {
    return JSON.parse(sessionStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

/** Lưu giỏ hàng vào storage */
function saveCart(cart) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/** Thêm sản phẩm vào giỏ (nếu chưa có) */
function addToCart(productId) {
  const product = (typeof products !== "undefined" ? products : []).find(
    (p) => p.id === productId
  );
  if (!product) return false;

  const cart = getCart();
  const already = cart.find((item) => item.id === productId);
  if (already) return "exists";

  cart.push({ id: product.id, title: product.title, price: product.price });
  saveCart(cart);
  updateCartBadge();
  return true;
}

/** Cập nhật badge số lượng trên icon giỏ hàng */
function updateCartBadge() {
  const cart = getCart();
  const count = cart.length;

  // Tìm hoặc tạo badge
  let badge = document.querySelector(".header__cart-badge");
  const cartIcon = document.querySelector(".header__cart-icon");
  if (!cartIcon) return;

  if (!badge) {
    badge = document.createElement("span");
    badge.className = "header__cart-badge";
    // Wrap cart icon để position badge
    const wrapper = document.querySelector(".header__cart-wrapper");
    if (!wrapper) {
      cartIcon.style.position = "relative";
      cartIcon.parentNode.insertBefore(
        Object.assign(document.createElement("span"), {
          className: "header__cart-wrapper",
        }),
        cartIcon
      );
      cartIcon.parentNode
        .querySelector(".header__cart-wrapper")
        .appendChild(cartIcon);
    }
    cartIcon.parentNode.appendChild(badge);
  }

  if (count > 0) {
    badge.textContent = count;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

/** Hiện toast thông báo */
function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.style.cssText =
      "position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `cart-toast cart-toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add("cart-toast--show"));

  setTimeout(() => {
    toast.classList.remove("cart-toast--show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

console.log("✅ [cart.js] Loaded: Giỏ hàng sẵn sàng.");
