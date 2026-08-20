/* firebase-config.js — Configuracion de Firebase */
/* Pega aqui tu configuracion de Firebase Console > Project Settings > Web app */

var FIREBASE_CONFIG = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

/* Inicializar Firebase */
if (typeof firebase !== "undefined" && FIREBASE_CONFIG.apiKey !== "TU_API_KEY") {
  firebase.initializeApp(FIREBASE_CONFIG);
}
