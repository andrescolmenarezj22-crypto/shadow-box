/* auth.js — Registro simple: solo usuario, sin contrasena */

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

  /* Registrar nuevo usuario (solo nombre) */
  function register(username) {
    username = (username || "").trim().toLowerCase();
    if (!username) throw new Error("Escribe un nombre de usuario");
    if (username.length < 2) throw new Error("Minimo 2 caracteres");
    if (!/^[a-z0-9_]+$/.test(username)) throw new Error("Solo minusculas, numeros y _");

    var users = getUsers();
    if (users[username]) throw new Error("Este usuario ya existe");

    users[username] = { created: Date.now(), displayName: username };
    saveUsers(users);

    currentUser = { username: username, displayName: username };
    saveSession(currentUser);
    notifyListeners();
    return currentUser;
  }

  /* Iniciar sesion (solo nombre) */
  function login(username) {
    username = (username || "").trim().toLowerCase();
    if (!username) throw new Error("Escribe tu usuario");

    var users = getUsers();
    if (!users[username]) throw new Error("Usuario no encontrado. Crea una cuenta.");

    currentUser = { username: username, displayName: users[username].displayName || username };
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

  function getUser() { return currentUser; }
  function isLoggedIn() { return !!currentUser; }

  function onAuthChange(fn) {
    listeners.push(fn);
    fn(currentUser);
  }
  function notifyListeners() {
    listeners.forEach(function (fn) { fn(currentUser); });
  }

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

  function key(name) {
    if (!currentUser) return "sb_default_" + name;
    return "sb_user_" + currentUser.username + "_" + name;
  }

  function saveData(lsKey, value) {
    localStorage.setItem(key(lsKey), typeof value === "string" ? value : JSON.stringify(value));
  }

  function loadData(lsKey) {
    try {
      var v = localStorage.getItem(key(lsKey));
      return v ? JSON.parse(v) : null;
    } catch (e) { return null; }
  }

  function saveAndSync(lsKey, value) { saveData(lsKey, value); }

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
