
// ===============================
// CHECKOUT.JS – TC DESIGNS (FINAL)
// ===============================

// 🔥 USAR CARRITO GLOBAL
// Revisar si hay un carrito temporal de "Comprar Ahora"
let cart = window.cart || [];
const checkoutCart = sessionStorage.getItem("checkoutCart");

if (checkoutCart) {
  cart = JSON.parse(checkoutCart);
  // Limpiar para que no interfiera en próximas visitas
  sessionStorage.removeItem("checkoutCart");
}

// ===== ELEMENTOS
const cartContainer = document.getElementById("checkout-cart-items");
const subtotalEl = document.getElementById("checkout-subtotal");
const shippingEl = document.getElementById("checkout-shipping");
const totalEl = document.getElementById("checkout-total");

// 🔥 MÉTODOS DE ENVÍO (BOX)
const shippingBox = document.getElementById("checkout-shipping-box");
const shippingPriceEl = document.getElementById("shipping-price");

const payBtn = document.getElementById("payNow");
const toggleOrderBtn = document.getElementById("toggleOrder");
const orderAside = document.querySelector(".checkout-right");

const countryInput = document.getElementById("Country");
const zipInput = document.getElementById("zip");

// ===============================
// MOSTRAR / OCULTAR PEDIDO (MÓVIL)
// ===============================
if (toggleOrderBtn && orderAside) {
  toggleOrderBtn.addEventListener("click", () => {
    orderAside.classList.toggle("show");

    toggleOrderBtn.textContent = orderAside.classList.contains("show")
      ? "OCULTAR PEDIDO"
      : "MOSTRAR PEDIDO";
  });
}

// ===============================
// RENDER DEL CARRITO
// ===============================
function renderCheckoutCart() {
  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  if (!cart.length) {
    cartContainer.innerHTML =
      "<p class='muted'>Tu carrito está vacío</p>";
    subtotalEl.textContent = "$0";
    shippingEl.textContent = "—";
    totalEl.textContent = "$0";

    if (shippingBox) shippingBox.classList.add("hidden");
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const price = Number(item.precio || 0);
    const qty = Number(item.qty || 1);
    const image = item.imagen || "";

    subtotal += price * qty;

    cartContainer.innerHTML += `
      <div class="checkout-item">
        <img src="${image}" alt="${item.nombre}">
        <div class="checkout-item-info">
          <p class="name">${item.nombre}</p>
          <span class="qty">x${qty}</span>
        </div>
        <div class="checkout-item-price">
          $${(price * qty).toFixed(2)}
        </div>
      </div>
    `;
  });

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = "—";
  totalEl.textContent = `$${subtotal.toFixed(2)}`;

  if (shippingBox) shippingBox.classList.add("hidden");
}





















document.addEventListener("DOMContentLoaded", () => {
  const mobileToggleBtn = document.getElementById("mobile-toggle-order");
  const orderDetail = document.getElementById("order-detail");
  const mobileTotal = document.getElementById("mobile-order-total");
  const mobileCartItems = document.getElementById("mobile-cart-items");

  function updateMobileTotal() {
    const subtotalEl = document.getElementById("checkout-subtotal");
    const shippingEl = document.getElementById("checkout-shipping");
    const totalEl = document.getElementById("checkout-total");

    if (!subtotalEl || !totalEl) return;

    const subtotal = subtotalEl.textContent || "$0";
    const shipping = shippingEl.textContent || "—";
    const total = totalEl.textContent || "$0";

    mobileTotal.textContent = total;

    const mobileSubtotal = document.getElementById("mobile-subtotal");
    const mobileShipping = document.getElementById("mobile-shipping");
    const mobileTotalEl = document.getElementById("mobile-total");

    if (mobileSubtotal) mobileSubtotal.textContent = subtotal;
    if (mobileShipping) mobileShipping.textContent = shipping;
    if (mobileTotalEl) mobileTotalEl.textContent = total;

    // Clonar items
    const desktopItems = document.getElementById("checkout-cart-items");
    if (desktopItems) mobileCartItems.innerHTML = desktopItems.innerHTML;
  }

  // Abrir/cerrar con flecha
  mobileToggleBtn.addEventListener("click", () => {
    orderDetail.classList.toggle("show");
    const icon = mobileToggleBtn.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-chevron-down");
      icon.classList.toggle("fa-chevron-up");
    }
  });

  renderCheckoutCart();
  updateMobileTotal();
});



























// ===============================
// ENVÍO SEGÚN PAÍS + CP (CON DELAY)
// ===============================
let envioTimeout = null;

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function codigoPostalValido(pais, cp) {
  if (pais.includes("mexico") || pais === "mx") {
    return /^[0-9]{5}$/.test(cp);
  }

  if (
    pais.includes("united states") ||
    pais.includes("usa") ||
    pais.includes("eeuu")
  ) {
    return /^[0-9]{5}(-[0-9]{4})?$/.test(cp);
  }

  return cp.length >= 4;
}

function calcularEnvio() {
  if (!zipInput || !countryInput) return;

  const cp = zipInput.value.trim();
  const pais = normalizarTexto(countryInput.value);

  clearTimeout(envioTimeout);

  if (!cp) {
    shippingEl.textContent = "—";
    actualizarTotal(0);
    if (shippingBox) shippingBox.classList.add("hidden");
    return;
  }

  if (!codigoPostalValido(pais, cp)) {
    shippingEl.textContent = "Código postal inválido";
    actualizarTotal(0);
    if (shippingBox) shippingBox.classList.add("hidden");
    return;
  }

  shippingEl.textContent = "Calculando…";
  if (shippingBox) shippingBox.classList.add("hidden");

  envioTimeout = setTimeout(() => {
    let envio = 0;

    if (pais.includes("mexico") || pais === "mx") {
      envio = 200;
    } else if (
      pais.includes("united states") ||
      pais.includes("usa") ||
      pais.includes("eeuu")
    ) {
      envio = 450;
    } else {
      envio = 600;
    }

    shippingEl.textContent = `$${envio}`;
    actualizarTotal(envio);

    // 🔥 MOSTRAR MÉTODO DE ENVÍO
    if (shippingBox && shippingPriceEl) {
      shippingPriceEl.textContent = `$${envio}`;
      shippingBox.classList.remove("hidden");
    }
  }, 800);
}

function actualizarTotal(envio) {
  const subtotal =
    parseFloat(subtotalEl.textContent.replace("$", "")) || 0;

  totalEl.textContent = `$${(subtotal + envio).toFixed(2)}`;
}

if (zipInput) {
  zipInput.addEventListener("input", calcularEnvio);
}

// ===============================
// WHATSAPP CHECKOUT
// ===============================
if (payBtn) {
  payBtn.addEventListener("click", () => {
    if (!cart.length) {
      customAlert("Tu carrito está vacío");
      return;
    }

    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const country = document.getElementById("Country").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const street = document.getElementById("street").value.trim();
    const colony = document.getElementById("colony").value.trim();
    const references = document.getElementById("references").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();

    if (!email || !phone) {
      customAlert("Completa tus datos de contacto");
      return;
    }











    if (!email || !phone) {
      customAlert("Completa tu correo y teléfono");
      return;
    }

    // 🔥 VALIDACIÓN NUEVA (AQUÍ EXACTO)
    if (
      !country ||
      !firstName ||
      !lastName ||
      !street ||
      !colony ||
      !zip ||
      !city ||
      !state
    ) {
      customAlert("Por favor completa todos los datos de envío");
      return;
    }















    
    let subtotal = 0;
    let pedidoTexto = "";

    cart.forEach(item => {
      const price = Number(item.precio || 0);
      const qty = Number(item.qty || 1);
      subtotal += price * qty;
      pedidoTexto += `${item.nombre} x${qty}%0A`;
    });

    const envioTexto = shippingEl.textContent || "Por confirmar";
    const envioNumero = envioTexto.includes("$")
      ? Number(envioTexto.replace("$", ""))
      : 0;

    const totalEstimado = subtotal + envioNumero;

    let message =
      `*VAGANCIA MAZATLAN* %0A%0A` +
      `*PEDIDO:*%0A` +
      `${pedidoTexto}%0A` +
      `*TOTAL ESTIMADO: ${totalEstimado}*%0A` +
      `Gorras $${subtotal} | Envío ${envioTexto}%0A%0A` +
      `*DATOS DE ENTREGA:*%0A` +
      `${firstName} ${lastName}%0A` +
      `${street}%0A` +
      `${colony ? colony + "%0A" : ""}` +
      `${city}, ${state}%0A` +
      `${country}%0A` +
      `CP: ${zip}%0A` +
      `${references ? "Referencias: " + references : ""}%0A%0A` +
      `%0A*CONTACTO:*%0A` +
      `Email: ${email}%0A` +
      `Tel: ${phone}`;

    const phoneNumber = "52TU_NUMERO_AQUI"; // ← TU NÚMERO
    const url = `https://wa.me/${6691233019}?text=${message}`;

    // Abrir WhatsApp
    window.open(url, "_blank");

    // Limpiar carrito
    window.cart = [];
    localStorage.setItem("cart", JSON.stringify([]));
    renderCheckoutCart();

    // Esperar 5 segundos y luego ir a la página de agradecimiento
    setTimeout(() => {
      window.location.href = "thankyou.html";
    }, 2500);


  });
}


// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", renderCheckoutCart);
renderCheckoutCart();






















