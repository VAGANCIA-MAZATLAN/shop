// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVsAPnrHUgdstSAVpEVwLAveJ_QGBwdew",
  authDomain: "tc-designs-f9ed9.firebaseapp.com",
  projectId: "tc-designs-f9ed9",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
