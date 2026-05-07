// =========================
// OBTENER STOCK FIRESTORE
// =========================
function obtenerStock(productId, callback) {
  const ref = firebase.firestore()
    .collection("caps")
    .doc(productId);

  ref.get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        callback(data.stock || 0);
      } else {
        callback(0);
      }
    })
    .catch(err => {
      console.error("🔥 Error Firestore:", err);
      callback(0);
    });
}
