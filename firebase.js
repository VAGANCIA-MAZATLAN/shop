// 🔥 CONFIGURACIÓN FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAVsAPnrHUgdstSAVpEVwLAveJ_QGBwdew",
  authDomain: "tc-designs-f9ed9.firebaseapp.com",
  projectId: "tc-designs-f9ed9",
  storageBucket: "tc-designs-f9ed9.firebasestorage.app",
  messagingSenderId: "938316691839",
  appId: "1:938316691839:web:db3c90e4fb791a4c6e024a",
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Firestore
const db = firebase.firestore();
