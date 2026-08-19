/* ===========================================================================
   0% LUCK 100% HARD — MODO GUERRA
   Motor de la app: HOY, entrenamiento militar, shadow box, hábitos y ajustes
   =========================================================================== */

(function () {
  "use strict";

  /* ---------------- Estado y ajustes ---------------- */
  const $ = (id) => document.getElementById(id);

  /* Imágenes características por técnica (recortadas de las ilustraciones) */
  const POSE_IMG = {
    guardia:  "images/guardia.png",
    jab:      "images/jab.png",
    cross:    "images/jabcross.png",
    hook:     "images/hook.png",
    uppercut: "images/uppercut.png",
    defensa:  "images/defensa.png",
    bob:      "images/bob.png",
    footwork: "images/footwork.png"
  };

  /* Figura para una técnica: imagen propia si existe, si no SVG articulado */
  function figureHTML(type) {
    const img = POSE_IMG[type];
    return img ? '<img src="' + img + '" alt="' + type + '">' : figureSVG(type);
  }

  const DEFAULTS = { vol: 0.9, voice: true, vibe: true, alarms: true, war: false, accent: "rojo", noglow: false };
  let settings = Object.assign({}, DEFAULTS);
  try {
    const saved = JSON.parse(localStorage.getItem("sb_settings") || "{}");
    Object.assign(settings, DEFAULTS, saved);
  } catch (e) {}

  function applyWar() {
    document.body.classList.toggle("war-mode", !!settings.war);
    const b = $("btnWar");
    if (b) {
      b.textContent = settings.war ? "⚡ ON" : "⚡";
      b.style.borderColor = settings.war ? "var(--red)" : "";
      b.style.color = settings.war ? "var(--red-bright)" : "";
      b.style.boxShadow = settings.war ? "var(--glow-soft)" : "";
    }
  }

  /* ---------------- Color de detalles (Ajustes) ---------------- */
  const ACCENT_BASES = {
    rojo: "#ff1f1f", azul: "#2f7bff", verde: "#2ee05a",
    cian: "#18e0d0", morado: "#b44bff", naranja: "#ff7a1f", rosa: "#ff4bc0",
    fantasia: "#c9a52c"
  };
  function hexRgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function mix(c, t, k) {
    return "rgb(" + Math.round(c[0] + (t[0] - c[0]) * k) + "," + Math.round(c[1] + (t[1] - c[1]) * k) + "," + Math.round(c[2] + (t[2] - c[2]) * k) + ")";
  }
  function rgbaOf(h, a) {
    const c = hexRgb(h);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
  }
  function applyAccent() {
    const base = ACCENT_BASES[settings.accent] || ACCENT_BASES.rojo;
    const c = hexRgb(base), W = [255, 255, 255], K = [0, 0, 0];
    const set = (k, v) => document.documentElement.style.setProperty(k, v);
    set("--red", "rgb(" + c.join(",") + ")");
    set("--red-hot", mix(c, W, .28));
    set("--red-soft", mix(c, W, .5));
    set("--red-bright", mix(c, W, .12));
    set("--blood", mix(c, K, .55));
    set("--blood2", mix(c, K, .32));
    set("--blood-deep", mix(c, K, .72));
    set("--line", mix(c, K, .86));
    set("--text", mix(c, W, .82));
    set("--text-dim", mix(c, W, .55));
    set("--grad1", mix(c, K, .72));
    set("--grad1b", mix(c, K, .78));
    set("--grad4", mix(c, K, .9));
    set("--grad5", mix(c, K, .95));
    set("--tint", rgbaOf(base, .4));
    set("--tint2", rgbaOf(base, .6));
    set("--tint3", rgbaOf(base, .6));
    set("--tint4", rgbaOf(base, .25));
    set("--bg-glow", rgbaOf(base, .28));
    set("--bg-glow2", rgbaOf(base, .2));
    set("--glow-text", "0 0 5px var(--red), 0 0 12px var(--red), 0 0 26px var(--red), 0 0 55px var(--blood2), 0 0 110px var(--blood), 0 0 200px var(--blood-deep)");
    set("--glow-box", "0 0 8px var(--red), 0 0 22px var(--red), 0 0 50px var(--blood2), 0 0 100px var(--blood), inset 0 0 18px var(--tint3)");
    set("--glow-soft", "0 0 6px var(--red), 0 0 26px var(--blood2)");
  }

  function applyNoGlow() {
    document.body.classList.toggle("no-glow", !!settings.noglow);
  }

  let customBlocks = [];
  try {
    customBlocks = JSON.parse(localStorage.getItem("sb_custom") || "[]");
  } catch (e) { customBlocks = []; }

  const S = {
    mode: "routine",
    routineName: "",
    segs: [],
    idx: 0,
    remaining: 0,
    segEnd: 0,
    running: false,
    paused: false,
    done: false,
    lastSec: -1
  };

  /* ---------------- Audio (Web Audio API) ---------------- */
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function playBeep(freq, dur, gain, delay, type) {
    if (!settings.alarms) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    delay = delay || 0;
    dur = dur || 0.12;
    gain = (gain || 0.5) * settings.vol;
    const t0 = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(gain, 0.001), t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.06);
  }

  function alarmWork() { playBeep(740, 0.14, 0.55); playBeep(1180, 0.22, 0.55, 0.18); }
  function alarmRest() { playBeep(660, 0.14, 0.5); playBeep(440, 0.24, 0.5, 0.18); }
  function alarmTick(sec) { playBeep(sec <= 3 ? 1320 : 880, 0.06, 0.45); }
  function alarmFinish() {
    [880, 1040, 1318, 1568].forEach(function (f, i) { playBeep(f, 0.2, 0.6, i * 0.16); });
  }

  /* ---------------- Voz ---------------- */
  function speak(text) {
    if (!settings.voice || !("speechSynthesis" in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "es-ES";
      u.rate = 0.98;
      const voices = speechSynthesis.getVoices().filter((v) => /es/i.test(v.lang));
      if (voices.length) u.voice = voices[0];
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ---------------- Vibración ---------------- */
  function vibrate(pattern) {
    if (!settings.vibe || !navigator.vibrate) return;
    try { navigator.vibrate(pattern); } catch (e) {}
  }

  /* ---------------- Flash / Toast ---------------- */
  function flash() {
    const el = $("flashOverlay");
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
    document.body.classList.remove("shake");
    void document.body.offsetWidth;
    document.body.classList.add("shake");
  }

  let toastTimer = null;
  function toast(msg) {
    const el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------------- Navegación ---------------- */
  const VIEWS = ["home", "military", "schedule", "shadow", "library", "routine", "training", "custom", "habits", "settings"];
  const NAV_FOR = { library: "shadow", routine: "shadow", custom: "shadow", schedule: "home" };

  function go(view) {
    if (view !== "training" && S.running) { engineStop(); S.paused = false; }
    VIEWS.forEach((v) => $(`view-${v}`).classList.toggle("active", v === view));
    document.querySelectorAll("#bottomNav .nav-btn").forEach((b) => {
      const key = NAV_FOR[view] || view;
      b.classList.toggle("active", b.dataset.nav === key);
    });
    $("btnBack").classList.toggle("hidden", !(view === "library" || view === "routine" || view === "custom" || view === "schedule"));
    if (view === "home") renderHome();
    window.scrollTo(0, 0);
  }

  document.querySelectorAll("#bottomNav .nav-btn").forEach((b) => {
    b.addEventListener("click", () => go(b.dataset.nav));
  });

  $("btnBack").addEventListener("click", () => go("home"));

  /* ---------------- Fechas / días ---------------- */
  const DAY_KEYS = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  const DAY_NAMES = { lunes: "LUNES", martes: "MARTES", miercoles: "MIÉRCOLES", jueves: "JUEVES", viernes: "VIERNES", sabado: "SÁBADO", domingo: "DOMINGO" };

  function dateKey(d) {
    d = d || new Date();
    const m = ("0" + (d.getMonth() + 1)).slice(-2);
    const dd = ("0" + d.getDate()).slice(-2);
    return d.getFullYear() + "-" + m + "-" + dd;
  }

  function dayKeyOf(d) { return DAY_KEYS[d.getDay()]; }

  function mondayOf(d) {
    const x = new Date(d);
    const diff = (x.getDay() + 6) % 7;
    x.setDate(x.getDate() - diff);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function hmMin(t) { const p = t.split(":"); return (+p[0]) * 60 + (+p[1]); }

  /* ---------------- HOY ---------------- */
  function renderHome() {
    const now = new Date();
    const dk = dayKeyOf(now);
    const d = MODO_GUERRA.plan[dk];
    const nombre = DAY_NAMES[dk];

    $("todayTitle").textContent = "HOY · " + nombre;
    const fechas = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    $("todaySub").textContent = fechas[now.getDay()] + " " + now.getDate() + "/" + (now.getMonth() + 1) + " · MODO GUERRA";

    let hero = "";
    if (d.trote) {
      hero +=
        '<div class="hero-figure">' +
          '<div class="figure-wrap">' + figureHTML("guardia") + '</div>' +
          '<div class="hero-body">' +
            "<h3>🏃 TROTE SUAVE · 30 MIN</h3>" +
            "<p>Hoy es Sábado de resistencia. Trote suave + 3 rondas de sombra.</p>" +
            '<button class="btn primary big" data-start="' + dk + '">▶ EMPEZAR TROTE</button>' +
          "</div>" +
        "</div>";
    } else if (d.descanso) {
      hero +=
        '<div class="hero-figure">' +
          '<div class="figure-wrap">' + figureHTML("guardia") + '</div>' +
          '<div class="hero-body">' +
            "<h3>😌 DESCANSÓ ACTIVO</h3>" +
            "<p>Caminar, estirar y respirar. El cuerpo se recupera para la semana.</p>" +
            '<button class="btn primary big" data-start="' + dk + '">▶ EMPEZAR RECUPERACIÓN</button>' +
          "</div>" +
        "</div>";
    } else {
      hero +=
        '<div class="hero-figure">' +
          '<div class="figure-wrap">' + figureHTML("guardia") + '</div>' +
          '<div class="hero-badge">ENTRENAMIENTO MILITAR · ' + d.emoji + " " + nombre + "</div></div>" +
          '<div class="hero-body">' +
            "<h3>HOY TOCA ENTRENAR</h3>" +
            '<div class="mini-grid">' +
              '<div><b>Abdominales</b><span>x' + d.ab + "</span></div>" +
              '<div><b>Flexiones</b><span>x' + d.fl + "</span></div>" +
              '<div><b>Sentadillas salto</b><span>x' + d.ss + "</span></div>" +
              '<div><b>Plancha</b><span>' + d.pl + " s</span></div>" +
              '<div><b>Mountain climbers</b><span>x' + d.mc + "</span></div>" +
              '<div><b>Cuerda</b><span>' + d.cu + " min</span></div>" +
              '<div><b>Jumping jacks</b><span>x' + d.jj + "</span></div>" +
              '<div><b>Saltos laterales</b><span>x' + d.sl + "</span></div>" +
            "</div>" +
            '<p style="margin:8px 0 0; font-size:12px; color:var(--text-dim);">+ 3 rondas de shadow box para cerrar la sesión</p>' +
            '<button class="btn primary big" data-start="' + dk + '">▶ EMPEZAR ENTRENAMIENTO</button>' +
          "</div>" +
        "</div>";
    }

    const habits = loadHabits();
    const hoy = habits[dateKey(now)] || {};
    const doneCount = HABITS.filter((h) => hoy[h.key]).length;
    hero +=
      '<div class="today-strip">' +
        '<button id="todayHabits" class="btn secondary" style="flex:1;">✅ HÁBITOS HOY: ' + doneCount + "/" + HABITS.length + "</button>" +
        '<button id="todayPlan" class="btn secondary">💪 PLAN SEMANAL</button>' +
      "</div>";

    $("homeHero").innerHTML = hero;
    const startBtn = document.querySelector('#homeHero [data-start]');
    if (startBtn) startBtn.addEventListener("click", () => startTraining({ mode: "military", name: "ENTRENAMIENTO " + nombre, blocks: militaryBlocks(dk) }));
    $("todayHabits").addEventListener("click", () => go("habits"));
    $("todayPlan").addEventListener("click", () => go("military"));

    renderSchedule();
  }

  function renderSchedule() {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const items = getDaySchedule(dayKeyOf(now));
    const html = items.map((it, i) => {
      const start = hmMin(it.t);
      const end = it.until ? hmMin(it.until) : (i + 1 < items.length ? hmMin(items[i + 1].t) : 1440);
      const active = nowMin >= start && nowMin < end;
      return (
        '<div class="sched-row' + (active ? " active" : "") + '">' +
          '<span class="sched-time">' + it.t + '</span>' +
          '<span class="sched-emoji">' + it.emoji + "</span>" +
          '<div class="sched-txt"><b>' + it.title + "</b><span>" + it.desc + "</span></div>" +
          (active ? '<span class="sched-now">AHORA</span>' : "") +
        "</div>"
      );
    }).join("");
    $("scheduleList").innerHTML = html;
  }

  /* ---------------- ENTRENAMIENTO MILITAR (plan semanal) ---------------- */
  function renderMilitary() {
    const keys = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    const today = dayKeyOf(new Date());
    $("militaryGrid").innerHTML = keys.map((k) => {
      const d = MODO_GUERRA.plan[k];
      let detail = "";
      if (d.trote) detail = '<div class="day-detail"><span>🏃 Trote suave · 30 min</span></div>';
      else if (d.descanso) detail = '<div class="day-detail"><span>😌 Descanso activo · caminar y estirar</span></div>';
      else {
        detail = '<div class="day-detail"><span>Ab x' + d.ab + "</span><span>Fl x" + d.fl + "</span><span>Sent salto x" + d.ss + "</span><span>Plancha " + d.pl + 's</span><span>MC x' + d.mc + "</span><span>Cuerda " + d.cu + ' min</span><span>JJ x' + d.jj + "</span><span>Saltos x" + d.sl + "</span></div>";
      }
      return (
        '<div class="day-card' + (today === k ? " today" : "") + '" data-day="' + k + '">' +
          '<div class="day-head"><h3>' + d.emoji + " " + DAY_NAMES[k] + "</h3>" +
            (today === k ? '<span class="day-tag">HOY</span>' : "") + "</div>" +
          detail +
          '<button class="btn primary small" data-start-day="' + k + '">▶ EMPEZAR</button>' +
        "</div>"
      );
    }).join("");
    $("militaryGrid").querySelectorAll("[data-start-day]").forEach((b) => {
      b.addEventListener("click", () => startTraining({ mode: "military", name: "ENTRENAMIENTO " + DAY_NAMES[b.dataset.startDay], blocks: militaryBlocks(b.dataset.startDay) }));
    });
  }

  /* ---------------- SHADOW BOX ---------------- */
  function renderShadow() {
    const today = dayKeyOf(new Date());
    const d = MODO_GUERRA.plan[today];
    let note = "";
    if (d.descanso) {
      note = '<div class="note-warn">😌 Hoy es descanso activo. La sombra es opcional: muévete suave.</div>';
    } else if (d.trote) {
      note = '<div class="note-info">🏃 Sábado de resistencia. Añade sombra al terminar el trote.</div>';
    } else {
      note = '<div class="note-info">💪 Hoy toca entrenamiento militar. La sombra de la sesión ya incluye 3 rondas.</div>';
    }
    $("shadowNote").innerHTML = note;

    const rg = $("routineGrid");
    rg.innerHTML = Object.keys(ROUTINES).map((key) => {
      const r = ROUTINES[key];
      const blocks = routineBlocks(key);
      const total = routineTotal(blocks);
      return (
        '<div class="routine-card" data-rt="' + key + '">' +
          '<div class="card-figure">' + figureHTML(blocks[0].type) + "</div>" +
          "<h3>" + r.emoji + " " + r.name + "</h3>" +
          "<p>" + r.desc + "</p>" +
          '<div class="card-meta">' +
            '<span>⏱ ' + fmtTime(total) + '</span>' +
            '<span>🥊 ' + blocks.length + ' ejercicios</span>' +
          "</div>" +
        "</div>"
      );
    }).join("");
    rg.querySelectorAll(".routine-card").forEach((card) => {
      card.addEventListener("click", () => { go("routine"); showRoutine(card.dataset.rt); });
    });

    const tg = $("techniqueGrid");
    tg.innerHTML = TECHNIQUES.map((t) =>
      '<div class="tech-card" data-tech="' + t.key + '">' +
        '<div class="card-figure">' + figureHTML(t.key) + "</div>" +
        "<h3>" + t.name + "</h3>" +
        "<p>" + t.desc + "</p>" +
      "</div>"
    ).join("");
    tg.querySelectorAll(".tech-card").forEach((card) => {
      card.addEventListener("click", () => { go("library"); showLibrary(card.dataset.tech); });
    });

    $("customMini").innerHTML = customBlocks.length
      ? "<p style='color:var(--text-dim); font-size:13px;'>Tu rutina tiene <b>" + customBlocks.length + "</b> ejercicio(s) guardado(s).</p>"
      : "<p style='color:var(--text-dim); font-size:13px;'>Aún no tienes ejercicios guardados.</p>";
  }

  $("btnCustomGo").addEventListener("click", () => go("custom"));

  /* ---------------- Edición de horario (por día) ---------------- */
  let schedDay = dayKeyOf(new Date());
  const DAY_ORDER = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

  function saveSchedModel() {
    const store = loadScheduleStore();
    store[schedDay] = getEditableSchedule(schedDay);
    localStorage.setItem("mg_schedule", JSON.stringify(store));
  }

  function renderSchedTabs() {
    const today = dayKeyOf(new Date());
    $("schedDayTabs").innerHTML = DAY_ORDER.map((k) =>
      '<button class="sched-tab' + (schedDay === k ? " active" : "") + '" data-sday="' + k + '">' +
        (today === k ? "• " : "") + DAY_NAMES[k].charAt(0) +
      "</button>"
    ).join("");
    $("schedDayTabs").querySelectorAll("[data-sday]").forEach((b) => {
      b.addEventListener("click", () => { schedDay = b.dataset.sday; renderSchedTabs(); renderSchedEdit(); });
    });
  }

  function renderSchedEdit() {
    const items = getDaySchedule(schedDay);
    const el = $("schedEditList");
    el.innerHTML =
      '<div class="sched-edit-head"><b>' + DAY_NAMES[schedDay] + '</b><span>' + items.length + " bloques</span></div>" +
      items.map((it, i) =>
        '<div class="sched-edit-row">' +
          '<div class="sched-edit-fields">' +
            '<input type="time" class="se-time" data-idx="' + i + '" data-f="t" value="' + toTimeInput(it.t) + '">' +
            '<input class="se-emoji" data-idx="' + i + '" data-f="emoji" maxlength="4" value="' + escHtml(it.emoji) + '">' +
            '<input class="se-title" data-idx="' + i + '" data-f="title" placeholder="Actividad" value="' + escHtml(it.title) + '">' +
            '<input class="se-desc" data-idx="' + i + '" data-f="desc" placeholder="Descripción (opcional)" value="' + escHtml(it.desc || "") + '">' +
            '<input type="time" class="se-until" data-idx="' + i + '" data-f="until" value="' + toTimeInput(it.until || "") + '" title="Hora de fin (opcional)">' +
          "</div>" +
          '<div class="sched-edit-actions">' +
            '<button data-up="' + i + '" title="Subir">▲</button>' +
            '<button data-down="' + i + '" title="Bajar">▼</button>' +
            '<button data-del="' + i + '" title="Eliminar">✕</button>' +
          "</div>" +
        "</div>"
      ).join("");

    el.querySelectorAll("input[data-idx]").forEach((inp) => {
      inp.addEventListener("input", onSchedInput);
      inp.addEventListener("change", onSchedInput);
    });
    el.querySelectorAll("[data-up]").forEach((b) => b.addEventListener("click", () => moveSchedItem(Number(b.dataset.up), -1)));
    el.querySelectorAll("[data-down]").forEach((b) => b.addEventListener("click", () => moveSchedItem(Number(b.dataset.down), 1)));
    el.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => {
      getEditableSchedule(schedDay).splice(Number(b.dataset.del), 1);
      saveSchedModel();
      renderSchedEdit();
      toast("Bloque eliminado");
    }));
  }

  function onSchedInput(e) {
    const inp = e.target;
    const model = getEditableSchedule(schedDay);
    const idx = Number(inp.dataset.idx);
    model[idx][inp.dataset.f] = inp.value;
    saveSchedModel();
  }

  function moveSchedItem(i, dir) {
    const model = getEditableSchedule(schedDay);
    const j = i + dir;
    if (j < 0 || j >= model.length) return;
    const tmp = model[i]; model[i] = model[j]; model[j] = tmp;
    saveSchedModel();
    renderSchedEdit();
  }

  $("schedAdd").addEventListener("click", () => {
    const model = getEditableSchedule(schedDay);
    let t = "20:00";
    const last = model[model.length - 1];
    if (last && last.t) {
      const m = hmMin(last.t) + 60;
      t = toTimeInput((Math.floor(m / 60) % 24) + ":" + (m % 60));
    }
    model.push({ t: t, emoji: "⭐", title: "Nueva actividad", desc: "" });
    saveSchedModel();
    renderSchedEdit();
    toast("Bloque añadido");
  });

  $("schedReset").addEventListener("click", () => {
    const store = loadScheduleStore();
    delete store[schedDay];
    localStorage.setItem("mg_schedule", JSON.stringify(store));
    renderSchedEdit();
    toast("Horario de " + DAY_NAMES[schedDay].toLowerCase() + " restaurado");
  });

  $("btnEditSchedule").addEventListener("click", () => go("schedule"));

  /* ---------------- Biblioteca de técnicas ---------------- */
  function showLibrary(key) {
    const t = TECHNIQUES.find((x) => x.key === key) || TECHNIQUES[0];
    $("libTitle").textContent = "🥊 " + t.name;
    $("libFigure").innerHTML = '<div class="figure-ring"></div><div class="figure-wrap">' + figureHTML(t.key) + "</div>";
    $("libBody").innerHTML =
      "<p style='color:var(--text); line-height:1.6; font-size:15px;'>" + t.desc + "</p>" +
      "<p style='color:var(--text-dim); font-size:13px;'>Practica durante 1 minuto siguiendo la figura y las pistas de voz.</p>";
    $("libPractice").dataset.type = t.key;
  }
  $("libPractice").addEventListener("click", () => {
    const key = $("libPractice").dataset.type || "guardia";
    const t = TECHNIQUES.find((x) => x.key === key);
    startTraining({ mode: "practice", name: t.name, blocks: [{ name: t.name, type: key, dur: 60, rest: 0, cue: t.desc }] });
  });

  /* ---------------- Detalle de rutina ---------------- */
  function showRoutine(key) {
    const r = ROUTINES[key];
    const blocks = routineBlocks(key);
    const total = routineTotal(blocks);
    $("routineTitle").textContent = r.emoji + " " + r.name;
    $("routineDesc").textContent = r.desc;
    const restTotal = blocks.reduce((a, b) => a + b.rest, 0);
    $("routineSummary").innerHTML =
      "<div><b>" + fmtTime(total) + "</b><br>Tiempo total</div>" +
      "<div><b>" + blocks.length + "</b><br>Ejercicios</div>" +
      "<div><b>" + fmtTime(restTotal) + "</b><br>Descanso</div>" +
      "<div><b>" + Math.round(blocks.length / (total / 60)) + "</b><br>Ejercicios/min</div>";
    $("routinePlan").innerHTML = blocks.map((b, i) =>
      '<div class="plan-row"><span class="plan-idx">' + (i + 1) + "</span>" +
      "<b>" + b.name + "</b>" +
      '<span class="plan-time">⏱ ' + fmtTime(b.dur) + (b.rest ? " · descanso " + fmtTime(b.rest) : "") + "</span></div>"
    ).join("");
    $("btnStart").dataset.routine = key;
  }

  $("btnStart").addEventListener("click", () => {
    const key = $("btnStart").dataset.routine;
    startTraining({ mode: "routine", name: ROUTINES[key].name, blocks: routineBlocks(key) });
  });

  /* ---------------- Personalizada ---------------- */
  function saveCustom() {
    localStorage.setItem("sb_custom", JSON.stringify(customBlocks));
    renderCustom();
    renderShadow();
  }

  function renderCustom() {
    const el = $("customList");
    if (!customBlocks.length) {
      el.innerHTML = "<p style='color:var(--text-dim);'>Aún no tienes ejercicios. Añade algunos abajo.</p>";
      return;
    }
    el.innerHTML = customBlocks.map((b, i) =>
      '<div class="custom-row">' +
        '<div class="cr-fig">' + figureHTML(b.type) + "</div>" +
        '<div class="cr-info"><b>' + b.name + '</b><span>' + fmtTime(b.dur) + " trabajo · " + fmtTime(b.rest) + " descanso</span></div>" +
        '<button data-del="' + i + '" title="Eliminar">✕</button>' +
      "</div>"
    ).join("");
    el.querySelectorAll("button[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => { customBlocks.splice(Number(btn.dataset.del), 1); saveCustom(); });
    });
  }

  $("customAdd").addEventListener("click", () => {
    const type = $("customType").value;
    const dur = Math.max(5, Number($("customDur").value) || 60);
    const rest = Math.max(0, Number($("customRest").value) || 20);
    const t = TECHNIQUES.find((x) => x.key === type);
    customBlocks.push({ name: t.name, type: type, dur: dur, rest: rest, cue: t.desc });
    saveCustom();
  });

  $("customStart").addEventListener("click", () => {
    if (!customBlocks.length) { toast("Añade al menos un ejercicio"); return; }
    startTraining({ mode: "custom", name: "MI RUTINA", blocks: customBlocks.map((b) => ({ name: b.name, type: b.type, dur: b.dur, rest: b.rest, cue: b.cue })) });
  });

  /* ---------------- Hábitos y finanzas ---------------- */
  function loadHabits() {
    try { return JSON.parse(localStorage.getItem("mg_habits") || "{}"); } catch (e) { return {}; }
  }

  function renderHabits() {
    const store = loadHabits();
    const key = dateKey();
    const day = store[key] || {};

    const done = HABITS.filter((h) => day[h.key]).length;

    $("habitsList").innerHTML =
      '<div class="habit-progress"><b>' + done + "/" + HABITS.length + "</b><span>hábitos de hoy</span></div>" +
      HABITS.map((h) =>
        '<div class="habit-row' + (day[h.key] ? " done" : "") + '" data-habit="' + h.key + '">' +
          '<span class="habit-emoji">' + h.emoji + "</span>" +
          "<b>" + h.label + "</b>" +
          '<span class="habit-check">' + (day[h.key] ? "✓" : "") + "</span>" +
        "</div>"
      ).join("") +
      '<p style="color:var(--text-dim); font-size:12px; margin-top:8px;">Toca cada hábito al completarlo.</p>';

    $("habitsList").querySelectorAll("[data-habit]").forEach((row) => {
      row.addEventListener("click", () => {
        const store2 = loadHabits();
        const key2 = dateKey();
        const day2 = store2[key2] || {};
        day2[row.dataset.habit] = !day2[row.dataset.habit];
        store2[key2] = day2;
        localStorage.setItem("mg_habits", JSON.stringify(store2));
        renderHabits();
        renderHome();
      });
    });

    /* semana */
    const monday = mondayOf(new Date());
    const weekHtml = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const k = dateKey(d);
      const st = store[k] || {};
      const c = HABITS.filter((h) => st[h.key]).length;
      const isToday = k === dateKey();
      weekHtml.push(
        '<div class="week-cell' + (isToday ? " today" : "") + '">' +
          "<b>" + DAY_NAMES[dayKeyOf(d)].charAt(0) + "</b>" +
          "<span>" + d.getDate() + "</span>" +
          '<i style="background:' + (c >= HABITS.length ? "#ff1f1f" : c >= 5 ? "#8a0000" : "#2a0000") + '">' + c + "/10</i>" +
        "</div>"
      );
    }
    $("habitsWeek").innerHTML = '<div class="week-grid">' + weekHtml.join("") + "</div>";

    /* objetivos */
    $("goalsList").innerHTML = GOALS.map((g) =>
      '<div class="goal-row' + (day["g_" + g.key] ? " done" : "") + '" data-goal="' + g.key + '">' +
        "<b>" + g.label + "</b>" +
        '<span class="habit-check">' + (day["g_" + g.key] ? "✓" : "") + "</span>" +
      "</div>"
    ).join("");
    $("goalsList").querySelectorAll("[data-goal]").forEach((row) => {
      row.addEventListener("click", () => {
        const store2 = loadHabits();
        const key2 = dateKey();
        const day2 = store2[key2] || {};
        day2["g_" + row.dataset.goal] = !day2["g_" + row.dataset.goal];
        store2[key2] = day2;
        localStorage.setItem("mg_habits", JSON.stringify(store2));
        renderHabits();
      });
    });

    renderFinance();
  }

  function loadFinance() {
    try { return JSON.parse(localStorage.getItem("mg_finance") || "{}"); } catch (e) { return {}; }
  }

  function renderFinance() {
    const f = loadFinance();
    const ingresos = Number(f.ingresos) || 0;
    const gastos = (["alimentacion", "transporte", "servicios", "otros"]).reduce((a, c) => a + (Number(f[c]) || 0), 0);
    const balance = ingresos - gastos;
    const ahorro = Math.round(ingresos * 0.1);

    $("financeBody").innerHTML =
      '<div class="fin-grid">' +
        '<div class="fin-card"><b>INGRESOS</b><span class="fin-money">' + ingresos.toLocaleString("es-MX") + "</span></div>" +
        '<div class="fin-card"><b>GASTOS</b><span class="fin-money">' + gastos.toLocaleString("es-MX") + "</span></div>" +
        '<div class="fin-card"><b>AHORRO (10%)</b><span class="fin-money">' + ahorro.toLocaleString("es-MX") + "</span></div>" +
        '<div class="fin-card"><b>BALANCE</b><span class="fin-money">' + balance.toLocaleString("es-MX") + "</span></div>" +
      "</div>" +
      '<div class="fin-row"><span>💰 Ingresos mensuales</span><input id="finIngresos" type="number" min="0" value="' + (f.ingresos || "") + '"></div>' +
      '<div class="fin-row"><span>🍔 Alimentación</span><input id="finAlimentacion" type="number" min="0" value="' + (f.alimentacion || "") + '"></div>' +
      '<div class="fin-row"><span>🚌 Transporte</span><input id="finTransporte" type="number" min="0" value="' + (f.transporte || "") + '"></div>' +
      '<div class="fin-row"><span>📱 Servicios</span><input id="finServicios" type="number" min="0" value="' + (f.servicios || "") + '"></div>' +
      '<div class="fin-row"><span>🛍 Otros</span><input id="finOtros" type="number" min="0" value="' + (f.otros || "") + '"></div>' +
      '<p style="color:var(--text-dim); font-size:12px; margin-top:8px;">Regla MODO GUERRA: ahorra mínimo el 10% de cualquier ingreso.</p>';

    ["ingresos", "alimentacion", "transporte", "servicios", "otros"].forEach((fld) => {
      const el = document.getElementById("fin" + fld.charAt(0).toUpperCase() + fld.slice(1));
      if (el) {
        el.addEventListener("input", () => {
          const nf = loadFinance();
          nf[fld] = el.value;
          localStorage.setItem("mg_finance", JSON.stringify(nf));
          renderFinance();
        });
      }
    });
  }

  /* ---------------- Motor del entrenamiento ---------------- */
  let timerInt = null;

  function startTraining(cfg) {
    ensureAudio();
    S.mode = cfg.mode;
    S.routineName = cfg.name;
    S.segs = buildSchedule(cfg.blocks);
    S.idx = 0;
    S.done = false;
    S.paused = false;
    S.running = true;
    go("training");
    enterSeg(true);
    engineStart();
    keepAwake(true);
  }

  function enterSeg(announce) {
    const seg = S.segs[S.idx];
    S.segEnd = Date.now() + seg.dur * 1000;
    S.remaining = seg.dur;
    S.lastSec = Math.ceil(seg.dur);
    renderSeg(seg);
    if (announce) {
      if (seg.kind === "work") {
        alarmWork();
        if (S.idx === 0) vibrate([200, 80, 200]);
        else vibrate([150, 50, 150]);
        speak("Empieza " + seg.name + ". " + (seg.cue || ""));
      } else {
        alarmRest();
        vibrate([100]);
        speak(seg.name + ". Respira.");
      }
      flash();
    }
  }

  function engineStart() {
    S.running = true;
    if (timerInt) clearInterval(timerInt);
    timerInt = setInterval(engineTick, 200);
  }

  function engineStop() {
    if (timerInt) { clearInterval(timerInt); timerInt = null; }
    S.running = false;
    keepAwake(false);
  }

  function engineTick() {
    const now = Date.now();
    S.remaining = Math.max(0, (S.segEnd - now) / 1000);
    const sec = Math.ceil(S.remaining);
    if (sec !== S.lastSec) {
      S.lastSec = sec;
      if (sec <= 10 && sec > 0) { alarmTick(sec); vibrate(sec <= 3 ? [60] : 25); }
    }
    if (S.remaining <= 0) {
      if (S.idx < S.segs.length - 1) {
        S.idx++;
        enterSeg(true);
      } else {
        finishTraining();
        return;
      }
    }
    renderTimer();
  }

  function finishTraining() {
    S.done = true;
    S.running = false;
    engineStop();
    alarmFinish();
    vibrate([300, 100, 300, 100, 500]);
    flash();
    speak("¡Rutina completada! Muy bien.");
    $("trainBlockType").textContent = "🏆 COMPLETADO";
    $("trainBlockName").textContent = "¡RUTINA COMPLETA!";
    $("trainCue").textContent = "Has terminado " + S.routineName + ". ¡Excelente trabajo!";
    $("timerTime").textContent = "00:00";
    $("timerPhase").textContent = "FINAL";
    $("timerPhase").className = "timer-phase";
    $("timerProgress").setAttribute("stroke-dashoffset", "0");
    document.querySelectorAll(".train-controls .btn").forEach((b) => b.classList.add("hidden"));
    $("scheduleStrip").innerHTML = "";
    toast("🏆 ¡RUTINA COMPLETA!");

    const hoy = dateKey();
    const store = loadHabits();
    const day = store[hoy] || {};
    day.entrene = true;
    store[hoy] = day;
    localStorage.setItem("mg_habits", JSON.stringify(store));
  }

  function renderSeg(seg) {
    $("trainBlockType").textContent = seg.kind === "rest" ? "😮‍💨 DESCANSO" : "🥊 " + S.routineName;
    $("trainBlockName").textContent = seg.name;
    $("trainCue").textContent = seg.kind === "rest" ? "Descansa, respira y suelta los brazos." : (seg.cue || "");
    $("trainFigure").innerHTML = '<div class="figure-ring"></div><div class="figure-wrap">' + (seg.kind === "rest" ? figureSVG("guardia") : figureHTML(seg.type)) + "</div>";
    renderStrip();
    document.querySelectorAll(".train-controls .btn").forEach((b) => b.classList.remove("hidden"));
  }

  function renderStrip() {
    const el = $("scheduleStrip");
    el.innerHTML = S.segs.map((s, i) =>
      '<div class="sched-cell' + (i === S.idx ? " active" : i < S.idx ? " past" : "") + '" id="sc-' + i + '">' +
        '<span class="sc-time">' + fmtTime(s.start) + "</span>" +
        '<span class="sc-name">' + (s.kind === "rest" ? "Descanso" : s.name) + "</span>" +
      "</div>"
    ).join("");
    const cur = $("sc-" + S.idx);
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ inline: "nearest", block: "nearest" });
  }

  function renderTimer() {
    const seg = S.segs[S.idx];
    if (!seg) return;
    const frac = S.remaining / seg.dur;
    $("timerTime").textContent = fmtTime(Math.ceil(S.remaining));
    $("timerPhase").textContent = seg.kind === "rest" ? "DESCANSO" : "TRABAJO";
    $("timerPhase").classList.toggle("rest", seg.kind === "rest");
    const offset = 867.08 * (1 - frac);
    $("timerProgress").setAttribute("stroke-dashoffset", Math.max(0, offset).toFixed(2));
    if (S.idx >= 0) {
      document.querySelectorAll("#scheduleStrip .sched-cell").forEach((c, i) => {
        c.classList.toggle("active", i === S.idx);
        c.classList.toggle("past", i < S.idx);
      });
    }
  }

  /* ---------------- Controles de entrenamiento ---------------- */
  $("btnPause").addEventListener("click", () => {
    if (S.done) return;
    if (S.paused) {
      S.paused = false;
      S.segEnd = Date.now() + S.remaining * 1000;
      engineStart();
      $("btnPause").textContent = "⏸ PAUSA";
    } else {
      S.paused = true;
      engineStop();
      $("btnPause").textContent = "▶ RESUMIR";
      $("timerPhase").textContent = "PAUSA";
      $("timerPhase").classList.remove("rest");
    }
  });

  $("btnSkip").addEventListener("click", () => {
    if (S.done) return;
    if (S.idx < S.segs.length - 1) { S.idx++; enterSeg(true); engineStart(); }
    else finishTraining();
  });

  $("btnReset").addEventListener("click", () => {
    if (S.done) return;
    S.idx = 0;
    enterSeg(true);
    engineStart();
  });

  $("btnStop").addEventListener("click", () => {
    engineStop();
    S.paused = false;
    S.done = false;
    toast("Entrenamiento detenido");
    go("home");
  });

  /* ---------------- Wake Lock ---------------- */
  let wakeLock = null;
  async function keepAwake(on) {
    if (!("wakeLock" in navigator)) return;
    try {
      if (on && !wakeLock) wakeLock = await navigator.wakeLock.request("screen");
      if (!on && wakeLock) { wakeLock.release(); wakeLock = null; }
    } catch (e) {}
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && S.running && !S.paused) keepAwake(true);
  });

  /* ---------------- Ajustes ---------------- */
  function renderSettings() {
    const el = $("settingsBody");
    el.innerHTML =
      '<div class="setting-row"><div><b>Volumen de alarmas</b><small>' + Math.round(settings.vol * 100) + "%</small></div>" +
        '<input type="range" id="setVol" min="0" max="100" value="' + Math.round(settings.vol * 100) + '"></div>' +
      '<div class="setting-row"><div><b>Alarmas sonoras</b><small>Pitidos en cada cambio de ejercicio</small></div>' +
        '<label class="switch"><input type="checkbox" id="setAlarms" ' + (settings.alarms ? "checked" : "") + '><span class="slider"></span></label></div>' +
      '<div class="setting-row"><div><b>Voz guiada</b><small>Anuncia cada ejercicio y su pista</small></div>' +
        '<label class="switch"><input type="checkbox" id="setVoice" ' + (settings.voice ? "checked" : "") + '><span class="slider"></span></label></div>' +
      '<div class="setting-row"><div><b>Vibración</b><small>Alertas táctiles en cada tiempo exacto</small></div>' +
        '<label class="switch"><input type="checkbox" id="setVibe" ' + (settings.vibe ? "checked" : "") + '><span class="slider"></span></label></div>' +
      '<div class="setting-row"><div><b>⚡ Modo Guerra</b><small>Glow exagerado, escaneo y viñeta roja</small></div>' +
        '<label class="switch"><input type="checkbox" id="setWar" ' + (settings.war ? "checked" : "") + '><span class="slider"></span></label></div>' +
      '<div class="setting-row"><div><b>Sin brillo</b><small>Apaga todas las animaciones de glow y pulso</small></div>' +
        '<label class="switch"><input type="checkbox" id="setNoGlow" ' + (settings.noglow ? "checked" : "") + '><span class="slider"></span></label></div>' +
      '<div class="setting-row" style="align-items:flex-start; flex-direction:column;">' +
        "<b>Color de detalles</b><small>El fondo se mantiene negro</small>" +
        '<div id="accSwatches" style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;">' +
        Object.keys(ACCENT_BASES).map((k) =>
          '<button data-acc="' + k + '" title="' + k + '" style="width:34px;height:34px;border-radius:50%;cursor:pointer;background:' + ACCENT_BASES[k] + ';border:2px solid ' + (settings.accent === k ? "#fff" : "transparent") + ';' + (settings.accent === k ? "box-shadow:0 0 12px var(--red);" : "") + '"></button>'
        ).join("") +
        "</div></div>" +
      '<button id="btnTestAlarm" class="btn secondary" style="width:100%; margin-top:4px;">🔔 PROBAR ALARMA</button>' +
      '<button id="btnEditScheduleFromSettings" class="btn secondary" style="width:100%; margin-top:6px;">🗓 EDITAR HORARIO SEMANAL</button>' +
      '<div class="section-title">📲 INSTALAR EN WINDOWS Y ANDROID</div>' +
      '<div class="setting-row" style="align-items:flex-start; flex-direction:column;">' +
        "<b>Windows / Edge</b><small>1. Abre la app en Microsoft Edge o Chrome.<br>2. Pulsa el icono de instalación (➕ / 📥) en la barra de direcciones.<br>3. Se instalará como aplicación nativa.</small>" +
      "</div>" +
      '<div class="setting-row" style="align-items:flex-start; flex-direction:column;">' +
        "<b>Android / Chrome</b><small>1. Abre la app en Chrome.<br>2. Menú (⋮) → <b>Instalar aplicación</b>.<br>3. Aparecerá en tu pantalla de inicio.</small>" +
      "</div>" +
      '<div class="setting-row" style="align-items:flex-start; flex-direction:column;">' +
        "<b>Consejo</b><small>La app funciona sin conexión una vez instalada. Usa server.ps1 o INICIAR.bat para servirla.</small>" +
      "</div>" +
      '<button id="btnResetData" class="btn danger" style="width:100%; margin-top:6px;">🗑 BORRAR DATOS</button>';

    $("setVol").addEventListener("input", (e) => { settings.vol = Number(e.target.value) / 100; saveSettings(); });
    $("setAlarms").addEventListener("change", (e) => { settings.alarms = e.target.checked; saveSettings(); });
    $("setVoice").addEventListener("change", (e) => { settings.voice = e.target.checked; saveSettings(); });
    $("setVibe").addEventListener("change", (e) => { settings.vibe = e.target.checked; saveSettings(); });
    $("setWar").addEventListener("change", (e) => { settings.war = e.target.checked; saveSettings(); applyWar(); flash(); vibrate([80]); });
    $("setNoGlow").addEventListener("change", (e) => { settings.noglow = e.target.checked; saveSettings(); applyNoGlow(); });
    $("btnTestAlarm").addEventListener("click", () => { ensureAudio(); alarmFinish(); vibrate([200, 100, 200]); flash(); });
    $("accSwatches").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
      settings.accent = b.dataset.acc;
      saveSettings();
      applyAccent();
      renderSettings();
    }));
    $("btnEditScheduleFromSettings").addEventListener("click", () => go("schedule"));
    $("btnResetData").addEventListener("click", () => {
      localStorage.removeItem("sb_settings");
      localStorage.removeItem("sb_custom");
      localStorage.removeItem("mg_habits");
      localStorage.removeItem("mg_finance");
      location.reload();
    });
  }

  function saveSettings() {
    localStorage.setItem("sb_settings", JSON.stringify(settings));
    const row = $("settingsBody").querySelector(".setting-row small");
    if (row && document.getElementById("setVol")) {
      row.textContent = Math.round(settings.vol * 100) + "%";
    }
  }

  $("btnSettings").addEventListener("click", () => go("settings"));

  $("btnWar").addEventListener("click", () => {
    settings.war = !settings.war;
    saveSettings();
    applyWar();
    flash();
    vibrate([80]);
    toast(settings.war ? "⚡ MODO GUERRA ACTIVADO" : "Modo guerra desactivado");
  });

  /* ---------------- Instalación PWA ---------------- */
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      $("installBar").classList.remove("hidden");
    }
  });
  window.addEventListener("appinstalled", () => {
    $("installBar").classList.add("hidden");
    toast("✅ App instalada. Encuéntrala en tu dispositivo.");
  });

  $("installBtn").addEventListener("click", async () => {
    if (!deferredPrompt) { toast("Abre la app en Edge o Chrome y usa el botón de instalar"); return; }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    $("installBar").classList.add("hidden");
  });
  $("installClose").addEventListener("click", () => $("installBar").classList.add("hidden"));

  /* ---------------- Service Worker ---------------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  /* ---------------- Arranque ---------------- */
  applyAccent();
  applyNoGlow();
  renderHome();
  renderMilitary();
  renderShadow();
  renderCustom();
  renderHabits();
  renderSettings();
  renderSchedTabs();
  renderSchedEdit();
  applyWar();
  go("home");
})();
