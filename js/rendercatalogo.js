function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function cantidadEnCarrito(id) {
  return obtenerCarrito()
    .filter(p => p.id === id)
    .reduce((acc, p) => acc + p.qty, 0);
}

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("productos-container");
  if (!container) return;

  productos.forEach(producto => {

    const card = document.createElement("div");
    card.className = "producto-card";

    card.innerHTML = `
      <div class="producto-imagen hover-swap"
        onclick="location.href='producto.html?id=${producto.id}'">

        <img class="img-front" src="${producto.imgFront}">
        <img class="img-back" src="${producto.imgBack}">

        <button class="producto-carrito">
          <i class="fa-solid fa-cart-shopping"></i>
        </button>
      </div>

      <h2 class="producto-nombre">${producto.nombre}</h2>
      <p class="producto-precio">$${producto.precio}</p>

      <a href="producto.html?id=${producto.id}" class="btn_1 producto-btn">
        Ver Producto
      </a>
    `;

    container.appendChild(card);

    const btnCarrito = card.querySelector(".producto-carrito");

    // 🔥 VALIDAR STOCK Y CARRITO
    obtenerStock(producto.id, (stock) => {

      const enCarrito = cantidadEnCarrito(producto.id);

      if (stock <= 0 || enCarrito >= stock) {
        btnCarrito.classList.add("disabled");
      }
    });

        // 🔥 AGREGADO (NO QUITA NADA)
    const btnComprar = card.querySelector(".producto-btn");

    obtenerStock(producto.id, (stock) => {
      if (stock <= 0) {
        btnComprar.textContent = "AGOTADO";
        btnComprar.removeAttribute("href");
        btnComprar.style.opacity = "0.5";
        btnComprar.style.pointerEvents = "none";
      }
    });

    // CLICK CARRITO
    btnCarrito.addEventListener("click", (e) => {
      e.stopPropagation();

      obtenerStock(producto.id, (stock) => {

        const enCarrito = cantidadEnCarrito(producto.id);

        if (enCarrito >= stock) {
          customAlert("NOS QUEDAMOS SIN STOCK PARA ESTA GORRA");
          btnCarrito.classList.add("disabled");
          return;
        }

        addToCart({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imgFront,
          qty: 1
        });

        btnCarrito.classList.add("disabled");
        openCart();
      });

    });

  });

});






































document.addEventListener("cartUpdated", () => {
  document.querySelectorAll(".producto-card").forEach(card => {
    const id = card.querySelector(".producto-carrito")
      ?.closest(".producto-card")
      ?.querySelector(".producto-carrito");

    if (!id) return;

    obtenerStock(id, (stock) => {
      const enCarrito = cantidadEnCarrito(id);
      if (enCarrito < stock) {
        card.querySelector(".producto-carrito")
          .classList.remove("disabled");
      }
    });
  });
});















