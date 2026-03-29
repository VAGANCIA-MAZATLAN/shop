function show(){
    document.querySelector('.hamburger').classList.toggle('open')
    document.querySelector('.navigation').classList.toggle('active')
}


// APARICIÓN DE HEADER //
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const triggerPoint = window.innerHeight * 0.125; // 12.5vh

  if (window.scrollY > triggerPoint) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});












document.addEventListener("DOMContentLoaded", () => {

  const transition = document.getElementById("page-transition");
  if (!transition) return;

  // ===== Animación al hacer click en links =====
  document.querySelectorAll("a[href]").forEach(link => {

    const href = link.getAttribute("href");

    /* ===== LINKS QUE NO DEBEN ANIMAR ===== */
    if (!href || href.startsWith("#") || href.startsWith("http") ||
        href.startsWith("mailto") || href.startsWith("tel")) return;

    // ❌ catalogo → producto (click en gorra)
    if (link.closest(".catalogo-grid")) return;

    // ❌ producto → catalogo (tachita)
    if (link.classList.contains("cerrar-producto")) return;

    /* ===== LINKS QUE SÍ ANIMAN ===== */
    link.addEventListener("click", e => {
      e.preventDefault();

      transition.classList.add("show"); // animación de salida

      setTimeout(() => {
        window.location.href = href;
      }, 500); // tiempo de la animación
    });

  });



function animatePageTransitionAndGo(url) {
    const transition = document.getElementById("page-transition");
    if (!transition) {
      window.location.href = url;
      return;
    }
    transition.classList.add("show"); // animación de salida
    setTimeout(() => {
      window.location.href = url;
    }, 500); // tiempo de la animación
  }

  // Botón "Comprar ahora" en producto
  const btnComprarAhora = document.querySelector(".btn-comprar");
  if (btnComprarAhora) {
    btnComprarAhora.addEventListener("click", () => {
      // tu lógica de stock ya existente
      // ...

      animatePageTransitionAndGo("checkout.html");
    });
  }

  // Botón "Finalizar pedido" en carrito
  const btnFinalizar = document.querySelector(".cart-checkout");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      if (cart.length === 0) {
        customAlert("TU CARRITO ESTÁ VACÍO");
        return;
      }
      animatePageTransitionAndGo("checkout.html");
    });
  }

});









(function() {
  window.customAlert = function(message) {
    const modal = document.getElementById("customAlert");
    const content = modal.querySelector(".modal-content");
    modal.querySelector(".alert-message").textContent = message;

    // Abrir modal
    modal.classList.remove("hide"); // quitar clase hide por si quedó
    modal.classList.add("show");

    // Botón de aceptar
    modal.querySelector("#alertBtn").onclick = function() {
      // iniciar animación de salida
      modal.classList.remove("show");
      modal.classList.add("hide");

      // esperar duración de transición de salida
      setTimeout(() => {
        modal.classList.remove("hide");
      }, 500); // coincide con transition de salida
    };
  };
})();


document.querySelectorAll(".faq-box").forEach(box => {
  box.addEventListener("click", () => {

    const item = box.parentElement;

    document.querySelectorAll(".faq-item").forEach(i => {
      if (i !== item) i.classList.remove("active");
    });

    item.classList.toggle("active");

  });
});