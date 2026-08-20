/* auth.js — Registro e inicio de sesion local (usuario + contrasena) */

var Auth = (function () {
  "use strict";

  var USERS_KEY = "sb_users";
  var SESSION_KEY = "sb_session";
  var currentUser = null;
  var listeners = [];

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch (e) { return null; }
  }
  function saveSession(s) {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  }

  /* Hash simple de contrasena (djb2 + salt) */
  function hashPass(pass, salt) {
    salt = salt || "yc2024";
    var str = salt + pass + salt;
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & 0x7FFFFFFF;
    }
    /* Segunda pasada para mayor entropia */
    var hash2 = 0x12345678;
    for (var j = 0; j < str.length; j++) {
      hash2 = ((hash2 << 7) ^ hash2) + str.charCodeAt(j);
      hash2 = hash2 & 0x7FFFFFFF;
    }
    return hash.toString(36) + "_" + hash2.toString(36);
  }

  /* Registrar nuevo usuario */
  function register(username, pass) {
    username = (username || "").trim().toLowerCase();
    if (!username || !pass) throw new Error("Ingresa usuario y contrasena");
    if (username.length < 3) throw new Error("Minimo 3 caracteres");
    if (pass.length < 4) throw new Error("Contrasena minimo 4 caracteres");
    if (!/^[a-z0-9_]+$/.test(username)) throw new Error("Solo minusculas, numeros y _");

    var users = getUsers();
    if (users[username]) throw new Error("Este usuario ya existe");

    var hash = hashPass(pass);
    users[username] = {
      hash: hash,
      created: Date.now(),
      displayName: username
    };
    saveUsers(users);

    currentUser = { username: username, displayName: username };
    saveSession(currentUser);
    notifyListeners();
    return currentUser;
  }

  /* Iniciar sesion */
  function login(username, pass) {
    username = (username || "").trim().toLowerCase();
    if (!username || !pass) throw new Error("Ingresa usuario y contrasena");

    var users = getUsers();
    var user = users[username];
    if (!user) throw new Error("Usuario no encontrado");

    var hash = hashPass(pass);
    if (user.hash !== hash) throw new Error("Contrasena incorrecta");

    currentUser = { username: username, displayName: user.displayName || username };
    saveSession(currentUser);
    notifyListeners();
    return currentUser;
  }

  /* Cerrar sesion */
  function logout() {
    currentUser = null;
    saveSession(null);
    notifyListeners();
  }

  /* Obtener usuario actual */
  function getUser() { return currentUser; }
  function isLoggedIn() { return !!currentUser; }

  /* Escuchar cambios de sesion */
  function onAuthChange(fn) {
    listeners.push(fn);
    fn(currentUser);
  }
  function notifyListeners() {
    listeners.forEach(function (fn) { fn(currentUser); });
  }

  /* Restaurar sesion al iniciar */
  function restoreSession() {
    var s = getSession();
    if (s && s.username) {
      var users = getUsers();
      if (users[s.username]) {
        currentUser = s;
      } else {
        saveSession(null);
      }
    }
  }

  /* Prefijo de almacenamiento por usuario */
  function key(name) {
    if (!currentUser) return "sb_default_" + name;
    return "sb_user_" + currentUser.username + "_" + name;
  }

  /* Guardar datos del usuario */
  function saveData(lsKey, value) {
    localStorage.setItem(key(lsKey), typeof value === "string" ? value : JSON.stringify(value));
  }

  /* Cargar datos del usuario */
  function loadData(lsKey) {
    try {
      var v = localStorage.getItem(key(lsKey));
      return v ? JSON.parse(v) : null;
    } catch (e) { return null; }
  }

  /* Guardar con alias */
  function saveAndSync(lsKey, value) {
    saveData(lsKey, value);
  }

  return {
    init: function () { restoreSession(); },
    isLoggedIn: isLoggedIn,
    getUser: getUser,
    onAuthChange: onAuthChange,
    register: register,
    login: login,
    logout: logout,
    saveAndSync: saveAndSync,
    loadData: loadData,
    saveData: saveData,
    key: key
  };
})();
