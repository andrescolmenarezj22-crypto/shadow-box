/* auth.js — Autenticacion (Google + Correo) y sincronizacion con Firestore */

var Auth = (function () {
  "use strict";

  var user = null;
  var db = null;
  var auth = null;
  var listeners = [];

  function isReady() {
    return typeof firebase !== "undefined" &&
           typeof FIREBASE_CONFIG !== "undefined" &&
           FIREBASE_CONFIG.apiKey !== "TU_API_KEY";
  }

  function init() {
    if (!isReady()) return false;
    auth = firebase.auth();
    db = firebase.firestore();
    try { db.enablePersistence({ synchronizeTabs: true }); } catch (e) {}
    auth.onAuthStateChanged(function (u) {
      user = u;
      listeners.forEach(function (fn) { fn(user); });
    });
    return true;
  }

  function onAuthChange(fn) { listeners.push(fn); if (user !== null) fn(user); }
  function getUser() { return user; }
  function isLoggedIn() { return !!user; }

  /* ---- Login con Google ---- */
  function loginGoogle() {
    if (!auth) return Promise.reject("No Firebase");
    var provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider);
  }

  /* ---- Login con correo ---- */
  function loginEmail(email, pass) {
    if (!auth) return Promise.reject("No Firebase");
    return auth.signInWithEmailAndPassword(email, pass);
  }

  /* ---- Registro con correo ---- */
  function registerEmail(email, pass, displayName) {
    if (!auth) return Promise.reject("No Firebase");
    return auth.createUserWithEmailAndPassword(email, pass).then(function (cred) {
      if (displayName) return cred.user.updateProfile({ displayName: displayName });
    });
  }

  /* ---- Recuperar contrasena ---- */
  function resetPassword(email) {
    if (!auth) return Promise.reject("No Firebase");
    return auth.sendPasswordResetEmail(email);
  }

  /* ---- Cerrar sesion ---- */
  function logout() {
    if (!auth) return Promise.resolve();
    return auth.signOut();
  }

  /* ---- Firestore: Guardar datos del usuario ---- */
  function saveUserData(data) {
    if (!db || !user) return Promise.resolve();
    return db.collection("users").doc(user.uid).set(data, { merge: true });
  }

  /* ---- Firestore: Cargar datos del usuario ---- */
  function loadUserData() {
    if (!db || !user) return Promise.resolve(null);
    return db.collection("users").doc(user.uid).get().then(function (doc) {
      return doc.exists ? doc.data() : null;
    });
  }

  /* ---- Sincronizar todo el estado local a Firestore ---- */
  function syncToCloud() {
    if (!isLoggedIn()) return Promise.resolve();
    var data = {};
    try {
      data.settings = JSON.parse(localStorage.getItem("sb_settings") || "{}");
      data.habits = JSON.parse(localStorage.getItem("mg_habits") || "{}");
      data.finance = JSON.parse(localStorage.getItem("mg_finance") || "{}");
      data.schedule = JSON.parse(localStorage.getItem("mg_schedule") || "{}");
      data.custom = JSON.parse(localStorage.getItem("sb_custom") || "[]");
      data.lastSync = Date.now();
    } catch (e) {}
    return saveUserData(data);
  }

  /* ---- Cargar desde Firestore y aplicar al localStorage ---- */
  function syncFromCloud() {
    if (!isLoggedIn()) return Promise.resolve(false);
    return loadUserData().then(function (data) {
      if (!data) return false;
      var changed = false;
      ["settings", "habits", "finance", "schedule"].forEach(function (key) {
        var lsKey = key === "settings" ? "sb_settings" :
                    key === "habits" ? "mg_habits" :
                    key === "finance" ? "mg_finance" :
                    key === "schedule" ? "mg_schedule" : key;
        if (data[key] && Object.keys(data[key]).length > 0) {
          var local = localStorage.getItem(lsKey);
          var localObj;
          try { localObj = JSON.parse(local || "{}"); } catch (e) { localObj = {}; }
          var cloudObj = data[key];
          var cloudTime = data.lastSync || 0;
          var localTime = data._localTimes && data._localTimes[key] || 0;
          if (cloudTime >= localTime || Object.keys(localObj).length === 0) {
            localStorage.setItem(lsKey, JSON.stringify(cloudObj));
            changed = true;
          }
        }
      });
      if (data.custom && Array.isArray(data.custom) && data.custom.length > 0) {
        localStorage.setItem("sb_custom", JSON.stringify(data.custom));
        changed = true;
      }
      return changed;
    });
  }

  /* ---- Wrapper para guardar con sync automatico ---- */
  function saveAndSync(lsKey, value) {
    localStorage.setItem(lsKey, typeof value === "string" ? value : JSON.stringify(value));
    if (isLoggedIn()) {
      var fieldMap = {
        sb_settings: "settings",
        mg_habits: "habits",
        mg_finance: "finance",
        mg_schedule: "schedule",
        sb_custom: "custom"
      };
      var field = fieldMap[lsKey];
      if (field) {
        var data = {};
        data[field] = typeof value === "string" ? JSON.parse(value) : value;
        data.lastSync = Date.now();
        saveUserData(data).catch(function () {});
      }
    }
  }

  return {
    init: init,
    isReady: isReady,
    isLoggedIn: isLoggedIn,
    getUser: getUser,
    onAuthChange: onAuthChange,
    loginGoogle: loginGoogle,
    loginEmail: loginEmail,
    registerEmail: registerEmail,
    resetPassword: resetPassword,
    logout: logout,
    syncToCloud: syncToCloud,
    syncFromCloud: syncFromCloud,
    saveAndSync: saveAndSync
  };
})();
