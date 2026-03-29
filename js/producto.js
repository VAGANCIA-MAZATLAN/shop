let isAnimating = false;

// =========================
// PRODUCTO INDIVIDUAL
// =========================

// Obtener ID del producto desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Buscar producto en el catálogo
const producto = productos.find(p => p.id === id);

// Elementos DOM
const img = document.getElementById("producto-imagen");
const dotsContainer = document.getElementById("galeria-dots");

const nombreEl = document.getElementById("producto-nombre");
const precioEl = document.getElementById("producto-precio");
const marcaEl = document.getElementById("producto-marca");
const descripcionEl = document.getElementById("producto-descripcion");

const btnLeft = document.querySelector(".arrow.left");
const btnRight = document.querySelector(".arrow.right");

let index = 0;
let cantidad = 1;

// =========================
// RENDER PRODUCTO
// =========================
if (producto) {


  
document.title = `${producto.nombre}`;

  nombreEl.textContent = producto.nombre;
  precioEl.textContent = `$${producto.precio}`;
  marcaEl.textContent = producto.marca;
  descripcionEl.innerHTML = producto.descripcion.replace(/\n/g, "<br>");

  img.src = producto.imagenes[index];

  // 🔥 PRELOAD IMÁGENES (EVITA FLASH)
  producto.imagenes.forEach(src => {
    const imgPreload = new Image();
    imgPreload.src = src;
  });

  crearDots();
  actualizarDots();




}

// =========================
// GALERÍA
// =========================

function actualizarImagen() {
  img.src = producto.imagenes[index];
  actualizarDots();
}

// =========================
// DOTS
// =========================
function crearDots() {
  dotsContainer.innerHTML = "";

  producto.imagenes.forEach((_, i) => {
    const dot = document.createElement("span");

    dot.addEventListener("click", () => {
      index = i;
      actualizarImagen();
    });

    dotsContainer.appendChild(dot);
  });
}

function actualizarDots() {
  const dots = dotsContainer.querySelectorAll("span");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// =========================
// CANTIDAD
// =========================
const cantidadEl = document.getElementById("cantidad");

document.getElementById("mas").addEventListener("click", () => {
  obtenerStock(producto.id, (stock) => {
    const enCarrito = cantidadEnCarrito(producto.id);
    const disponible = stock - enCarrito;

    if (cantidad < disponible) {
      cantidad++;
      cantidadEl.textContent = cantidad;
    } else {
      customAlert(`Solo quedan ${disponible} unidad/es disponibles`);
    }
  });
});

document.getElementById("menos").addEventListener("click", () => {
  if (cantidad > 1) {
    cantidad--;
    cantidadEl.textContent = cantidad;
  }
});


document.getElementById("menos").addEventListener("click", () => {
  if (cantidad > 1) {
    cantidad--;
    cantidadEl.textContent = cantidad;
  }
});

// =========================
// AGREGAR AL CARRITO
// =========================
const btnCarrito = document.querySelector(".btn-carrito");

btnCarrito.addEventListener("click", () => {
  if (!producto) return;

  obtenerStock(producto.id, (stock) => {

    const yaEnCarrito = cantidadEnCarrito(producto.id);
    const disponible = stock - yaEnCarrito;

    // ❌ YA NO HAY DISPONIBLE
    if (disponible <= 0) {
      customAlert("NOS QUEDAMOS SIN STOCK PARA ESTA GORRA");
      bloquearCompra();
      return;
    }

    // ❌ QUIERE MÁS DE LO DISPONIBLE
    if (cantidad > disponible) {
      customAlert(
        `SOLO PUDIMOS AGREGAR ${disponible} GORRA(S) PORQUE NOS QUEDAMOS SIN STOCK`
      );

      addToCart({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagenes[0],
        qty: disponible
      });

      bloquearCompra();
      openCart();
      return;
    }

    // ✅ TODO BIEN
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagenes[0],
      qty: cantidad
    });

    // 🔥 SI YA NO QUEDA STOCK, BLOQUEAR
    if (disponible - cantidad <= 0) {
      bloquearCompra();
    }

    openCart();
  });
});













// =========================
const btnComprarAhora = document.querySelector(".btn-comprar");

btnComprarAhora.addEventListener("click", () => {
  if (!producto) return;

  obtenerStock(producto.id, (stock) => {

    const enCarrito = cantidadEnCarrito(producto.id);
    const disponible = stock - enCarrito;

    if (disponible <= 0) {
      customAlert("SIN STOCK DISPONIBLE");
      return;
    }

    const qtyFinal = Math.min(cantidad, disponible);

    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagenes[0],
      qty: qtyFinal
    });

    // 🔥 ANIMACIÓN PAGE TRANSITION
    const transition = document.getElementById("page-transition");
    if (transition) {
      transition.classList.add("show");
      setTimeout(() => {
        window.location.href = "checkout.html";
      }, 1200); // dura lo mismo que la animación CSS
    } else {
      window.location.href = "checkout.html";
    }

  });
});




















































// rules_version = '2';
//service cloud.firestore {
//  match /databases/{database}/documents {
//    match /usuarios/{userId} {
//      allow read, write: if request.auth != null && request.auth.uid == userId;
//    }
//  }
//}



// =========================
// STOCK VISUAL + CONTROL
// =========================
const stockEl = document.getElementById("producto-stock");

let stockActual = 0;

if (producto && stockEl) {
  obtenerStock(producto.id, (stock) => {
    stockActual = stock;

    stockEl.classList.remove("stock-ok", "stock-low", "stock-out");

    if (stock <= 0) {
      stockEl.textContent = "SIN STOCK";
      stockEl.classList.add("stock-out");
      bloquearCompra();
    } 
    else if (stock <= 14) {
      stockEl.textContent = "POCO STOCK DISPONIBLE";
      stockEl.classList.add("stock-low");
    } 
    else {
      stockEl.textContent = "STOCK DISPONIBLE";
      stockEl.classList.add("stock-ok");
    }
  });
}

// =========================
// BLOQUEAR BOTONES
// =========================
function bloquearCompra() {
  const btnComprar = document.querySelector(".btn-comprar");
  const btnCarrito = document.querySelector(".btn-carrito");

  if (btnComprar) btnComprar.disabled = true;
  if (btnCarrito) btnCarrito.disabled = true;

  if (btnComprar) btnComprar.style.opacity = "0.4";
  if (btnCarrito) btnCarrito.style.opacity = "0.4";
}
























































function desbloquearCompra() {
  const btnComprar = document.querySelector(".btn-comprar");
  const btnCarrito = document.querySelector(".btn-carrito");

  if (btnComprar) {
    btnComprar.disabled = false;
    btnComprar.style.opacity = "1";
  }

  if (btnCarrito) {
    btnCarrito.disabled = false;
    btnCarrito.style.opacity = "1";
  }
}

function revisarStockProducto() {
  if (!producto) return;

  obtenerStock(producto.id, (stock) => {
    const enCarrito = cantidadEnCarrito(producto.id);
    const disponible = stock - enCarrito;

    if (disponible <= 0) {
      bloquearCompra();
    } else {
      desbloquearCompra();
    }
  });
}

















































































// ALERTA PERSONALIZADA


function customAlert(mensaje) {
  const alerta = document.createElement("div");
  alerta.className = "alerta-stock";
  alerta.textContent = mensaje;

  document.body.appendChild(alerta);

  setTimeout(() => alerta.classList.add("mostrar"), 50);

  setTimeout(() => {
    alerta.classList.remove("mostrar");
    setTimeout(() => alerta.remove(), 300);
  }, 3500);
}

































function actualizarEstadoBotonCarrito(idProducto) {
  const btn = document.querySelector(".btn-carrito");
  if (!btn) return;

  const carrito = JSON.parse(localStorage.getItem("cart")) || [];
  const enCarrito = carrito.some(p => p.id === idProducto);

  btn.classList.toggle("disabled", enCarrito);
}






































// =========================
// SWIPE FINAL SIN FLASH REAL
// =========================

let startX = 0;
let currentX = 0;
let isDragging = false;
let moved = false;
let nextIndex = null; // 🔥 NUEVO

const container = document.querySelector(".producto-galeria");

// CLON
const imgClone = img.cloneNode();
imgClone.style.position = "absolute";
imgClone.style.top = "0";
imgClone.style.left = "0";
imgClone.style.width = "100%";
imgClone.style.pointerEvents = "none";
imgClone.style.opacity = "0";

container.appendChild(imgClone);

// RESET
function resetImages() {
  img.style.transition = "none";
  imgClone.style.transition = "none";

  img.style.transform = "translateX(0)";
  imgClone.style.transform = "translateX(0)";

  imgClone.style.opacity = "0";
}

// START
img.addEventListener("touchstart", (e) => {
  if (isAnimating) return;

  startX = e.touches[0].clientX;
  currentX = startX;

  isDragging = true;
  moved = false;

  nextIndex = null; // 🔥 RESET IMPORTANTE

  resetImages();
});

// MOVE
img.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  currentX = e.touches[0].clientX;
  const diff = currentX - startX;

  if (Math.abs(diff) < 15) return;

  moved = true;

  imgClone.style.opacity = "1";

  img.style.transform = `translateX(${diff}px)`;

  // 🔥 SOLO calcular UNA vez (CLAVE)
  if (nextIndex === null) {
    if (diff < 0) {
      nextIndex = (index + 1) % producto.imagenes.length;
    } else {
      nextIndex = (index - 1 + producto.imagenes.length) % producto.imagenes.length;
    }

    imgClone.src = producto.imagenes[nextIndex];
  }

  // mover clone
  if (diff < 0) {
    imgClone.style.transform = `translateX(${diff + container.offsetWidth}px)`;
  } else {
    imgClone.style.transform = `translateX(${diff - container.offsetWidth}px)`;
  }
});

// END
img.addEventListener("touchend", () => {
  if (!isDragging) return;
  isDragging = false;

  if (!moved) {
    resetImages();
    return;
  }

  const diff = currentX - startX;

  img.style.transition = "transform 0.3s ease";
  imgClone.style.transition = "transform 0.3s ease";

  if (nextIndex === null) {
    resetImages();
    return;
  }  

  if (Math.abs(diff) > 30 && !isAnimating) {

  isAnimating = true;

    let nextIndex;

    if (diff < 0) {
      nextIndex = (index + 1) % producto.imagenes.length;

      img.style.transform = "translateX(-100%)";
    } else {
      nextIndex = (index - 1 + producto.imagenes.length) % producto.imagenes.length;

      img.style.transform = "translateX(100%)";
    }

    imgClone.style.transform = "translateX(0)";

    // 🔥 CLAVE: usar el clone como imagen final
    setTimeout(() => {

      index = nextIndex;

      img.src = producto.imagenes[index];

      resetImages();
      actualizarDots();

      isAnimating = false; // 🔥 desbloquea

    }, 300);

  } else {
    resetImages();
  }
});

// BOTONES (PC)
btnLeft.addEventListener("click", () => {
  index = (index - 1 + producto.imagenes.length) % producto.imagenes.length;
  img.src = producto.imagenes[index];
  actualizarDots();
});

btnRight.addEventListener("click", () => {
  index = (index + 1) % producto.imagenes.length;
  img.src = producto.imagenes[index];
  actualizarDots();
});










































// ========================= IMAGENES EN GRANDE //

// =========================
// VISOR IMAGENES (EXTRA)
// =========================

const visor = document.getElementById("visor-overlay");
const visorImg = document.getElementById("visor-img");
const visorThumbs = document.getElementById("visor-thumbs");
const visorClose = document.getElementById("visor-close");

// ABRIR VISOR AL HACER CLICK EN IMAGEN
img.addEventListener("click", (e) => {
  // 🔥 SI SE ESTÁ HACIENDO SWIPE, NO ABRIR
  if (isDragging || moved) return;

  abrirVisor();
});

function abrirVisor() {
  visor.classList.add("active");
  crearMiniaturas();
  actualizarVisor();
}

// CERRAR
visorClose.addEventListener("click", () => {
  visor.classList.remove("active");
  resetZoom();
});

// CREAR MINIATURAS
function crearMiniaturas() {
  visorThumbs.innerHTML = "";

  producto.imagenes.forEach((src, i) => {
    const thumb = document.createElement("img");
    thumb.src = src;

    thumb.addEventListener("click", () => {
      index = i;
      actualizarVisor();
    });

    visorThumbs.appendChild(thumb);
  });
}

// ACTUALIZAR IMAGEN GRANDE
function actualizarVisor() {
  visorImg.src = producto.imagenes[index];

  const thumbs = visorThumbs.querySelectorAll("img");
  thumbs.forEach((t, i) => {
    t.classList.toggle("active", i === index);
  });

  resetZoom();
}

// =========================
// ZOOM + DRAG
// =========================

let scale = 1;
let posX = 0;
let posY = 0;
let isDraggingZoom = false;
let startXZoom = 0;
let startYZoom = 0;

// ZOOM CON SCROLL (PC)
visorImg.addEventListener("wheel", (e) => {
  e.preventDefault();

  scale += e.deltaY * -0.005;

  
  scale = Math.min(Math.max(1, scale), 4);

  aplicarTransform();
});



// DRAG
visorImg.addEventListener("mousedown", (e) => {
  isDraggingZoom = true;
  startXZoom = e.clientX - posX;
  startYZoom = e.clientY - posY;
});



window.addEventListener("mousemove", (e) => {
  if (!isDraggingZoom) return;

  posX = e.clientX - startXZoom;
  posY = e.clientY - startYZoom;

  aplicarTransform();
});

window.addEventListener("mouseup", () => {
  isDraggingZoom = false;
});

// TOUCH (MÓVIL)
visorImg.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  isDraggingZoom = true;
  startXZoom = touch.clientX - posX;
  startYZoom = touch.clientY - posY;
});

visorImg.addEventListener("touchmove", (e) => {
  if (!isDraggingZoom) return;

  const touch = e.touches[0];
  posX = touch.clientX - startXZoom;
  posY = touch.clientY - startYZoom;

  aplicarTransform();
});

visorImg.addEventListener("touchend", () => {
  isDraggingZoom = false;
});

// APPLY TRANSFORM
function aplicarTransform() {
  visorImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}

// RESET
function resetZoom() {
  scale = 1;
  posX = 0;
  posY = 0;
  aplicarTransform();
}


































// Cerrar con picarle afuera //
visor.addEventListener("click", (e) => {
  const clickedInsideContent =
    e.target.closest(".visor-main") ||
    e.target.closest(".visor-thumbs") ||
    e.target.closest(".visor-close");

  if (!clickedInsideContent) {
    visor.classList.remove("active");
    resetZoom();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && visor.classList.contains("active")) {
    visor.classList.remove("active");
    resetZoom();
  }
});