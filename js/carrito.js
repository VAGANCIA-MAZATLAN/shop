
// =========================
// ELEMENTOS
// =========================
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartSubtotal = document.getElementById("cart-subtotal");

// =========================
// ABRIR / CERRAR
// =========================
function openCart() {
  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
}

function closeCart() {
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
}

cartOverlay.addEventListener("click", closeCart);

// =========================
// ESTADO DEL CARRITO
// =========================
window.cart = JSON.parse(localStorage.getItem("cart")) || [];


// =========================
// AGREGAR PRODUCTO
// =========================
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += product.qty;
  } else {
    cart.push(product);
  }

  saveCart();
  renderCart();
}

// =========================
// RENDER
// =========================
function renderCart() {
  cartItems.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.precio * item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">

        <img src="${item.imagen}" alt="${item.nombre}">

        <div class="cart-info">
          <strong>${item.nombre}</strong>

          <div class="cart-qty">
            <button onclick="changeQty(${index}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>

          <span class="cart-price">$${item.precio}</span>

          <button class="cart-remove" onclick="removeItem(${index})">
            Quitar
          </button>
        </div>
      </div>
    `;
  });

  cartSubtotal.textContent = `$${subtotal}`;
}










































function changeQty(index, amount) {
  const item = cart[index];

  obtenerStock(item.id, (stock) => {
    if (item.qty + amount > stock) {
      customAlert(
        `SOLO PUDIMOS AGREGAR ${stock} GORRA(S) PORQUE NOS QUEDAMOS SIN STOCK`
      );
      return;
    }

    item.qty += amount;

    if (item.qty <= 0) {
      cart.splice(index, 1);
    }

    saveCart();
    renderCart();
  });
}






























// =========================
// ELIMINAR
// =========================
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}












function actualizarCatalogo() {
  document.querySelectorAll(".producto-card").forEach(card => {
    const id = card.dataset.id;
    const btn = card.querySelector(".producto-carrito");

    if (!btn) return;

    if (productoEnCarrito(id)) {
      btn.classList.add("hidden");
    } else {
      btn.classList.remove("hidden");
    }
  });
}






















// =========================
// GUARDAR
// =========================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", renderCart);









































































function cantidadEnCarrito(productId) {
  const item = cart.find(p => p.id === productId);
  return item ? item.qty : 0;
}

document.dispatchEvent(new Event("cartUpdated"));





























document.dispatchEvent(new Event("cartUpdated"));































































document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.querySelector(".cart-checkout");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      if (cart.length === 0) {
        customAlert("TU CARRITO ESTÁ VACÍO");
        return;
      }

      // 🔹 Verificar stock de cada producto
      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const stock = await obtenerStockAsync(item.id);

        if (item.qty > stock) {
          customAlert(
            `Solo puede adquirir ${stock} unidad/es de ${item.nombre.toUpperCase()} debido a que no hay más stock`
          );

          // Ajustar la cantidad en el carrito
          item.qty = stock;
          saveCart();
          renderCart();

          return; // Detener checkout para que el usuario vea la alerta
        }
      }

      // Si todo está bien, continuar al checkout
      window.location.href = "checkout.html";
    });

  }
});


























// Convierte la función callback a Promise para usar await
function obtenerStockAsync(productId) {
  return new Promise((resolve) => {
    obtenerStock(productId, (stock) => resolve(stock));
  });
}
