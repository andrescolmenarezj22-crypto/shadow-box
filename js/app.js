(function () {
  "use strict";

  // ---- $ helper ----
  const $ = (id) => document.getElementById(id);

  // ---- POSE_IMG for boxing figures ----
  const POSE_IMG = {
    guardia: "images/guardia.png", jab: "images/jab.png", cross: "images/jabcross.png",
    hook: "images/hook.png", uppercut: "images/uppercut.png", defensa: "images/defensa.png",
    bob: "images/bob.png", footwork: "images/footwork.png"
  };

  // For non-boxing techniques, use emoji-based SVG silhouettes
  function figureHTML(type) {
    if (POSE_IMG[type]) return '<img src="' + POSE_IMG[type] + '" alt="' + type + '">';
    // For new sports techniques, show a stylized SVG figure
    const sportIcons = {
      dribble: "⚽", tiro: "🎯", pase: "🤝", regate: "🏃", remate: "🏃‍♂️",
      defensa_fut: "🛡️", natacion: "🏊", ciclismo: "🚴", patada: "🦵",
      puno: "👊", codazo: "💪", rodillazo: "🦵"
    };
    const icon = sportIcons[type] || "🏃";
    return '<div style="font-size:80px;text-align:center;padding:20px;filter:drop-shadow(0 0 8px var(--red))drop-shadow(0 0 20px var(--blood2))">' + icon + '</div>';
  }

  // ---- Settings ----
  const DEFAULTS = { vol: 0.9, voice: true, vibe: true, alarms: true, war: false, accent: "rojo", noglow: false };
  let settings = Object.assign({}, DEFAULTS);
  try { Object.assign(settings, DEFAULTS, JSON.parse(localStorage.getItem("sb_settings") || "{}")); } catch (e) {}

  function applyWar() {
    document.body.classList.toggle("war-mode", !!settings.war);
    const b = $("btnWar");
    if (b) {
      b.textContent = settings.war ? "⚡ ON" : "⚡";
      b.style.borderColor = settings.war ? "var(--red)" : "";
      b.style.color = settings.war ? "var(--red-bright)" : "";
    }
  }

  // ---- Accent Colors (expanded) ----
  const ACCENT_BASES = {
    rojo: "#ff1f1f", azul: "#2f7bff", verde: "#2ee05a",
    cian: "#18e0d0", morado: "#b44bff", naranja: "#ff7a1f", rosa: "#ff4bc0",
    fantasia: "#c9a52c", dorado: "#ffd700", turquesa: "#00ced1",
    lime: "#32cd32", coral: "#ff6b6b", lila: "#9370db", azul oscuro: "#1a3a6b"
  };

  function hexRgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function mix(c, t, k) {
    return "rgb(" + Math.round(c[0]+(t[0]-c[0])*k) + "," + Math.round(c[1]+(t[1]-c[1])*k) + "," + Math.round(c[2]+(t[2]-c[2])*k) + ")";
  }
  function rgbaOf(h, a) {
    const c = hexRgb(h);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
  }

  function applyAccent() {
    const base = ACCENT_BASES[settings.accent] || ACCENT_BASES.rojo;
    const c = hexRgb(base), W = [255,255,255], K = [0,0,0];
    const set = (k, v) => document.documentElement.style.setProperty(k, v);
    set("--red", "rgb(" + c.join(",") + ")");
    set("--red-hot", mix(c,W,.28));
    set("--red-soft", mix(c,W,.5));
    set("--red-bright", mix(c,W,.12));
    set("--blood", mix(c,K,.55));
    set("--blood2", mix(c,K,.32));
    set("--blood-deep", mix(c,K,.72));
    set("--line", mix(c,K,.86));
    set("--text", mix(c,W,.82));
    set("--text-dim", mix(c,W,.55));
    set("--grad1", mix(c,K,.72));
    set("--grad1b", mix(c,K,.78));
    set("--grad4", mix(c,K,.9));
    set("--grad5", mix(c,K,.95));
    set("--tint", rgbaOf(base,.4));
    set("--tint2", rgbaOf(base,.6));
    set("--tint3", rgbaOf(base,.6));
    set("--tint4", rgbaOf(base,.25));
    set("--bg-glow", rgbaOf(base,.18));
    set("--bg-glow2", rgbaOf(base,.12));
    set("--glow-text", "0 0 5px var(--red), 0 0 12px var(--red)");
    set("--glow-box", "0 0 6px var(--red), 0 0 16px var(--blood2), inset 0 0 10px var(--tint3)");
    set("--glow-soft", "0 0 4px var(--red), 0 0 14px var(--blood2)");
  }

  function applyNoGlow() {
    document.body.classList.toggle("no-glow", !!settings.noglow);
  }

  // ---- Custom blocks ----
  let customBlocks = [];
  try { customBlocks = JSON.parse(localStorage.getItem("sb_custom") || "[]"); } catch (e) { customBlocks = []; }

  // ---- Training state ----
  const S = { mode: "routine", routineName: "", segs: [], idx: 0, remaining: 0, segEnd: 0, running: false, paused: false, done: false, lastSec: -1 };

  // ---- Audio ----
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; audioCtx = new AC(); }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }
  function playBeep(freq, dur, gain, delay, type) {
    if (!settings.alarms) return;
    const ctx = ensureAudio(); if (!ctx) return;
    delay = delay || 0; dur = dur || 0.12; gain = (gain || 0.5) * settings.vol;
    const t0 = ctx.currentTime + delay;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(gain,0.001), t0+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
    o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0+dur+0.06);
  }
  function alarmWork() { playBeep(740,0.14,0.55); playBeep(1180,0.22,0.55,0.18); }
  function alarmRest() { playBeep(660,0.14,0.5); playBeep(440,0.24,0.5,0.18); }
  function alarmTick(sec) { playBeep(sec<=3?1320:880,0.06,0.45); }
  function alarmFinish() { [880,1040,1318,1568].forEach(function(f,i){playBeep(f,0.2,0.6,i*0.16);}); }

  // ---- Voice ----
  function speak(text) {
    if (!settings.voice || !("speechSynthesis" in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text); u.lang = "es-ES"; u.rate = 0.98;
      const voices = speechSynthesis.getVoices().filter(v => /es/i.test(v.lang));
      if (voices.length) u.voice = voices[0]; speechSynthesis.speak(u);
    } catch (e) {}
  }

  // ---- Vibration ----
  function vibrate(pattern) { if (!settings.vibe || !navigator.vibrate) return; try { navigator.vibrate(pattern); } catch (e) {} }

  // ---- Flash / Toast ----
  function flash() {
    const el = $("flashOverlay"); el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
    document.body.classList.remove("shake"); void document.body.offsetWidth; document.body.classList.add("shake");
  }
  let toastTimer = null;
  function toast(msg) {
    const el = $("toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  // ---- Navigation ----
  const VIEWS = ["home","military","schedule","shadow","library","routine","training","custom","habits","settings","profile"];
  const NAV_FOR = { library:"shadow", routine:"shadow", custom:"shadow", schedule:"home", profile:"settings" };
  function go(view) {
    if (view !== "training" && S.running) { engineStop(); S.paused = false; }
    VIEWS.forEach(v => { var el = $(`view-${v}`); if (el) el.classList.toggle("active", v === view); });
    document.querySelectorAll("#bottomNav .nav-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.nav === (NAV_FOR[view]||view));
    });
    $("btnBack").classList.toggle("hidden", !["library","routine","custom","schedule","profile"].includes(view));
    if (view === "home") renderHome();
    if (view === "profile") renderProfile();
    window.scrollTo(0, 0);
  }
  document.querySelectorAll("#bottomNav .nav-btn").forEach(b => b.addEventListener("click", () => go(b.dataset.nav)));
  $("btnBack").addEventListener("click", () => go("home"));

  // ---- Date helpers ----
  const DAY_KEYS = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
  const DAY_NAMES = { lunes:"LUNES", martes:"MARTES", miercoles:"MIERCOLES", jueves:"JUEVES", viernes:"VIERNES", sabado:"SABADO", domingo:"DOMINGO" };
  function dayKeyOf(d) { return DAY_KEYS[d.getDay()]; }
  function mondayOf(d) {
    const x = new Date(d); x.setDate(x.getDate() - (x.getDay()+6)%7); x.setHours(0,0,0,0); return x;
  }
  function hmMin(t) { const p = t.split(":"); return (+p[0])*60+(+p[1]); }

  // ---- RANK BAR (HOME) ----
  function renderRankBar() {
    const habitsStore = loadHabits();
    const now = new Date();
    const monday = mondayOf(now);
    const sunday = new Date(monday); sunday.setDate(monday.getDate()+6); sunday.setHours(23,59,59);
    const weekPct = calcDisciplinePercent(monday, sunday, habitsStore);
    const rank = getRankForPercent(weekPct);
    const next = getNextRank(rank.level);
    const progress = next ? ((weekPct - rank.min) / (next.min - rank.min)) * 100 : 100;

    $("rankBar").innerHTML =
      '<span class="rank-icon">' + rank.icon + '</span>' +
      '<div class="rank-info">' +
        '<b>' + rank.name + '</b>' +
        '<small>Semana: ' + weekPct + '% disciplina' + (next ? ' — Proximo: ' + next.name + ' (' + next.min + '%)' : ' — MAXIMO') + '</small>' +
        '<div class="rank-progress"><div class="rank-progress-fill" style="width:' + Math.min(100, progress) + '%;background:' + rank.color + '"></div></div>' +
      '</div>';
  }

  // ---- DISCIPLINE STATS (HOME) ----
  function renderDiscStats() {
    const habitsStore = loadHabits();
    const now = new Date();
    // Week
    const monday = mondayOf(now);
    const sunday = new Date(monday); sunday.setDate(monday.getDate()+6); sunday.setHours(23,59,59);
    const weekPct = calcDisciplinePercent(monday, sunday, habitsStore);
    // Month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth()+1, 0); monthEnd.setHours(23,59,59);
    const monthPct = calcDisciplinePercent(monthStart, monthEnd, habitsStore);
    // Year
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31); yearEnd.setHours(23,59,59);
    const yearPct = calcDisciplinePercent(yearStart, yearEnd, habitsStore);

    $("discStats").innerHTML =
      '<div class="disc-card"><b>SEMANA</b><span class="disc-pct">' + weekPct + '%</span></div>' +
      '<div class="disc-card"><b>MES</b><span class="disc-pct">' + monthPct + '%</span></div>' +
      '<div class="disc-card"><b>ANIO</b><span class="disc-pct">' + yearPct + '%</span></div>';
  }

  // ---- HOME ----
  function renderHome() {
    renderRankBar();
    renderDiscStats();
    const now = new Date();
    const dk = dayKeyOf(now);
    const d = MODO_GUERRA.plan[dk];
    const nombre = DAY_NAMES[dk];

    $("todayTitle").textContent = "HOY · " + nombre;
    const fechas = ["DOMINGO","LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"];
    $("todaySub").textContent = fechas[now.getDay()] + " " + now.getDate() + "/" + (now.getMonth()+1);

    let hero = "";
    if (d.trote) {
      hero = '<div class="hero-figure"><div class="figure-wrap">' + figureHTML("guardia") + '</div>' +
        '<div class="hero-body"><h3>TROTE SUAVE 30 MIN</h3>' +
        '<p style="color:var(--text-dim);font-size:12px;margin:4px 0 8px;">Sabado de resistencia. Trote + sombra.</p>' +
        '<button class="btn primary big" data-start="' + dk + '">EMPEZAR TROTE</button></div></div>';
    } else if (d.descanso) {
      hero = '<div class="hero-figure"><div class="figure-wrap">' + figureHTML("guardia") + '</div>' +
        '<div class="hero-body"><h3>DESCANSO ACTIVO</h3>' +
        '<p style="color:var(--text-dim);font-size:12px;margin:4px 0 8px;">Caminar, estirar y respirar.</p>' +
        '<button class="btn primary big" data-start="' + dk + '">EMPEZAR RECUPERACION</button></div></div>';
    } else {
      hero = '<div class="hero-figure"><div class="figure-wrap">' + figureHTML("guardia") + '</div>' +
        '<div class="hero-badge">ENTRENAMIENTO ' + nombre + '</div></div>' +
        '<div class="hero-body"><h3>HOY TOCA ENTRENAR</h3>' +
        '<div class="mini-grid">' +
          '<div><b>Abs</b><span>x' + d.ab + '</span></div>' +
          '<div><b>Flex</b><span>x' + d.fl + '</span></div>' +
          '<div><b>Sent</b><span>x' + d.ss + '</span></div>' +
          '<div><b>Plan</b><span>' + d.pl + 's</span></div>' +
          '<div><b>MC</b><span>x' + d.mc + '</span></div>' +
          '<div><b>Cuerda</b><span>' + d.cu + 'm</span></div>' +
          '<div><b>JJ</b><span>x' + d.jj + '</span></div>' +
          '<div><b>Saltos</b><span>x' + d.sl + '</span></div>' +
        '</div>' +
        '<button class="btn primary big" data-start="' + dk + '">EMPEZAR ENTRENAMIENTO</button></div>';
    }

    const habits = loadHabits();
    const hoy = habits[dateKey(now)] || {};
    const doneCount = HABITS.filter(h => hoy[h.key]).length;
    hero += '<div class="today-strip">' +
      '<button id="todayHabits" class="btn secondary" style="flex:1;">HABITOS HOY: ' + doneCount + "/" + HABITS.length + '</button>' +
      '<button id="todayPlan" class="btn secondary">PLAN SEMANAL</button></div>';

    $("homeHero").innerHTML = hero;
    const startBtn = document.querySelector('#homeHero [data-start]');
    if (startBtn) startBtn.addEventListener("click", () => startTraining({mode:"military", name:"ENTRENAMIENTO "+nombre, blocks:militaryBlocks(dk)}));
    $("todayHabits").addEventListener("click", () => go("habits"));
    $("todayPlan").addEventListener("click", () => go("military"));
    renderSchedule();
  }

  function renderSchedule() {
    const now = new Date(); const nowMin = now.getHours()*60+now.getMinutes();
    const items = getDaySchedule(dayKeyOf(now));
    $("scheduleList").innerHTML = items.map((it,i) => {
      const start = hmMin(it.t);
      const end = it.until ? hmMin(it.until) : (i+1<items.length ? hmMin(items[i+1].t) : 1440);
      const active = nowMin>=start && nowMin<end;
      return '<div class="sched-row'+(active?" active":"")+'">' +
        '<span class="sched-time">'+it.t+'</span>' +
        '<span class="sched-emoji">'+it.emoji+'</span>' +
        '<div class="sched-txt"><b>'+it.title+'</b><span>'+it.desc+'</span></div>' +
        (active ? '<span class="sched-now">AHORA</span>' : "") +
      '</div>';
    }).join("");
  }

  // ---- MILITARY PLAN ----
  function renderMilitary() {
    const keys = ["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];
    const today = dayKeyOf(new Date());
    $("militaryGrid").innerHTML = keys.map(k => {
      const d = MODO_GUERRA.plan[k]; let detail = "";
      if (d.trote) detail = '<div class="day-detail"><span>Trote suave 30 min</span></div>';
      else if (d.descanso) detail = '<div class="day-detail"><span>Descanso activo</span></div>';
      else detail = '<div class="day-detail"><span>Ab x'+d.ab+'</span><span>Fl x'+d.fl+'</span><span>Sent x'+d.ss+'</span><span>Pl '+d.pl+'s</span><span>MC x'+d.mc+'</span><span>Cuerda '+d.cu+'m</span><span>JJ x'+d.jj+'</span><span>Saltos x'+d.sl+'</span></div>';
      return '<div class="day-card'+(today===k?" today":"")+'" data-day="'+k+'">' +
        '<div class="day-head"><h3>'+d.emoji+' '+DAY_NAMES[k]+'</h3>'+(today===k?'<span class="day-tag">HOY</span>':'')+'</div>' +
        detail + '<button class="btn primary small" data-start-day="'+k+'">EMPEZAR</button></div>';
    }).join("");
    $("militaryGrid").querySelectorAll("[data-start-day]").forEach(b => {
      b.addEventListener("click", () => startTraining({mode:"military", name:"ENTRENAMIENTO "+DAY_NAMES[b.dataset.startDay], blocks:militaryBlocks(b.dataset.startDay)}));
    });
  }

  // ---- SPORT TABS + SHADOW BOX ----
  let currentSport = "boxeo";

  function renderSportTabs() {
    const keys = Object.keys(SPORTS);
    $("sportTabs").innerHTML = keys.map(k => {
      const s = SPORTS[k];
      return '<button class="sport-tab'+(currentSport===k?" active":"")+'" data-sport="'+k+'">'+s.icon+' '+s.name+'</button>';
    }).join("");
    $("sportTabs").querySelectorAll("[data-sport]").forEach(b => {
      b.addEventListener("click", () => { currentSport = b.dataset.sport; renderSportTabs(); renderShadow(); });
    });
  }

  function renderShadow() {
    renderSportTabs();
    const today = dayKeyOf(new Date());
    const d = MODO_GUERRA.plan[today];
    let note = "";
    if (d.descanso) note = '<div class="note-warn">Hoy es descanso activo. La sombra es opcional.</div>';
    else if (d.trote) note = '<div class="note-info">Sabado de resistencia. Anade sombra al terminar el trote.</div>';
    else note = '<div class="note-info">Hoy toca entrenamiento militar. La sombra ya incluye 3 rondas.</div>';
    $("shadowNote").innerHTML = note;

    const sport = SPORTS[currentSport];
    const sportRoutines = sport.routines;
    const rg = $("routineGrid");
    rg.innerHTML = sportRoutines.map(key => {
      const r = ROUTINES[key]; if (!r) return "";
      const blocks = routineBlocks(key);
      const total = routineTotal(blocks);
      return '<div class="routine-card" data-rt="'+key+'">' +
        '<div class="card-figure">' + figureHTML(blocks[0].type) + '</div>' +
        '<h3>'+r.emoji+' '+r.name+'</h3>' +
        '<p>'+r.desc+'</p>' +
        '<div class="card-meta"><span>⏱ '+fmtTime(total)+'</span><span>🥊 '+blocks.length+' ejercicios</span></div>' +
      '</div>';
    }).join("");
    rg.querySelectorAll(".routine-card").forEach(card => {
      card.addEventListener("click", () => { go("routine"); showRoutine(card.dataset.rt); });
    });

    // Techniques for this sport
    const sportTechniques = TECHNIQUES.filter(t => {
      if (currentSport === "boxeo") return ["guardia","jab","cross","hook","uppercut","defensa","bob","footwork"].includes(t.key);
      if (currentSport === "futbol") return ["dribble","tiro","pase","regate","remate","defensa_fut","footwork"].includes(t.key);
      if (currentSport === "basquet") return ["dribble","tiro","pase","regate","defensa_fut","footwork","bob"].includes(t.key);
      if (currentSport === "natacion") return ["natacion"].includes(t.key);
      if (currentSport === "artes_marciales") return ["patada","puno","codazo","rodillazo","guardia","defensa","hook"].includes(t.key);
      if (currentSport === "ciclismo") return ["ciclismo","footwork"].includes(t.key);
      return false;
    });
    const tg = $("techniqueGrid");
    tg.innerHTML = sportTechniques.map(t =>
      '<div class="tech-card" data-tech="'+t.key+'">' +
        '<div class="card-figure">'+figureHTML(t.key)+'</div>' +
        '<h3>'+t.name+'</h3><p>'+t.desc+'</p></div>'
    ).join("");
    tg.querySelectorAll(".tech-card").forEach(card => {
      card.addEventListener("click", () => { go("library"); showLibrary(card.dataset.tech); });
    });

    $("customMini").innerHTML = customBlocks.length
      ? '<p style="color:var(--text-dim);font-size:12px;">Tu rutina tiene <b>'+customBlocks.length+'</b> ejercicio(s).</p>'
      : '<p style="color:var(--text-dim);font-size:12px;">Sin ejercicios guardados.</p>';
  }

  $("btnCustomGo").addEventListener("click", () => go("custom"));

  // ---- SCHEDULE EDITOR ----
  let schedDay = dayKeyOf(new Date());
  const DAY_ORDER = ["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];

  function saveSchedModel() {
    const store = loadScheduleStore();
    store[schedDay] = getEditableSchedule(schedDay);
    saveUserKey("mg_schedule", store);
  }

  function renderSchedTabs() {
    const today = dayKeyOf(new Date());
    $("schedDayTabs").innerHTML = DAY_ORDER.map(k =>
      '<button class="sched-tab'+(schedDay===k?" active":'')+(today===k?" today":'')+'" data-sday="'+k+'">'+DAY_NAMES[k].charAt(0)+'</button>'
    ).join("");
    $("schedDayTabs").querySelectorAll("[data-sday]").forEach(b => {
      b.addEventListener("click", () => { schedDay=b.dataset.sday; renderSchedTabs(); renderSchedEdit(); });
    });
  }

  function renderSchedEdit() {
    const items = getDaySchedule(schedDay);
    const el = $("schedEditList");
    el.innerHTML = '<div class="sched-edit-head"><b>'+DAY_NAMES[schedDay]+'</b><span>'+items.length+' bloques</span></div>' +
      items.map((it,i) =>
        '<div class="sched-edit-row"><div class="sched-edit-fields">' +
          '<input type="time" class="se-time" data-idx="'+i+'" data-f="t" value="'+toTimeInput(it.t)+'">' +
          '<input class="se-emoji" data-idx="'+i+'" data-f="emoji" maxlength="4" value="'+escHtml(it.emoji)+'">' +
          '<input class="se-title" data-idx="'+i+'" data-f="title" placeholder="Actividad" value="'+escHtml(it.title)+'">' +
          '<input class="se-desc" data-idx="'+i+'" data-f="desc" placeholder="Descripcion" value="'+escHtml(it.desc||"")+'">' +
          '<input type="time" class="se-until" data-idx="'+i+'" data-f="until" value="'+toTimeInput(it.until||"")+'" title="Hora fin">' +
        '</div><div class="sched-edit-actions">' +
          '<button data-up="'+i+'" title="Subir">&#9650;</button>' +
          '<button data-down="'+i+'" title="Bajar">&#9660;</button>' +
          '<button data-del="'+i+'" title="Eliminar">&#10005;</button>' +
        '</div></div>'
      ).join("");
    el.querySelectorAll("input[data-idx]").forEach(inp => { inp.addEventListener("input", onSchedInput); inp.addEventListener("change", onSchedInput); });
    el.querySelectorAll("[data-up]").forEach(b => b.addEventListener("click", () => moveSchedItem(+b.dataset.up,-1)));
    el.querySelectorAll("[data-down]").forEach(b => b.addEventListener("click", () => moveSchedItem(+b.dataset.down,1)));
    el.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => {
      getEditableSchedule(schedDay).splice(+b.dataset.del,1); saveSchedModel(); renderSchedEdit(); toast("Bloque eliminado");
    }));
  }

  function onSchedInput(e) {
    const inp = e.target; const model = getEditableSchedule(schedDay);
    model[+inp.dataset.idx][inp.dataset.f] = inp.value;
    saveSchedModel();
  }

  function moveSchedItem(i, dir) {
    const model = getEditableSchedule(schedDay); const j = i+dir;
    if (j<0||j>=model.length) return;
    const tmp=model[i]; model[i]=model[j]; model[j]=tmp; saveSchedModel(); renderSchedEdit();
  }

  // SAVE BUTTON for schedule editor
  $("schedSave").addEventListener("click", () => {
    saveSchedModel();
    renderSchedEdit();
    renderSchedule();
    renderHome();
    toast("Horario guardado y aplicado");
    go("home");
  });

  $("schedAdd").addEventListener("click", () => {
    const model = getEditableSchedule(schedDay);
    let t = "20:00";
    const last = model[model.length-1];
    if (last && last.t) { const m = hmMin(last.t)+60; t = toTimeInput((Math.floor(m/60)%24)+":"+(m%60)); }
    model.push({t:t, emoji:"⭐", title:"Nueva actividad", desc:""});
    saveSchedModel(); renderSchedEdit(); toast("Bloque anadido");
  });

  $("schedReset").addEventListener("click", () => {
    const store = loadScheduleStore(); delete store[schedDay];
    saveUserKey("mg_schedule", store);
    renderSchedEdit();
    toast("Horario de "+DAY_NAMES[schedDay].toLowerCase()+" restaurado");
  });

  $("btnEditSchedule").addEventListener("click", () => go("schedule"));

  // ---- LIBRARY ----
  function showLibrary(key) {
    const t = TECHNIQUES.find(x => x.key===key) || TECHNIQUES[0];
    $("libTitle").textContent = t.name;
    $("libFigure").innerHTML = '<div class="figure-ring"></div><div class="figure-wrap">'+figureHTML(t.key)+'</div>';
    $("libBody").innerHTML = '<p style="color:var(--text);line-height:1.5;font-size:14px;">'+t.desc+'</p>' +
      '<p style="color:var(--text-dim);font-size:12px;">Practica 1 minuto siguiendo la figura.</p>';
    $("libPractice").dataset.type = t.key;
  }
  $("libPractice").addEventListener("click", () => {
    const key = $("libPractice").dataset.type||"guardia";
    const t = TECHNIQUES.find(x => x.key===key);
    startTraining({mode:"practice", name:t.name, blocks:[{name:t.name, type:key, dur:60, rest:0, cue:t.desc}]});
  });

  // ---- ROUTINE DETAIL ----
  function showRoutine(key) {
    const r = ROUTINES[key]; const blocks = routineBlocks(key); const total = routineTotal(blocks);
    $("routineTitle").textContent = r.emoji+" "+r.name;
    $("routineDesc").textContent = r.desc;
    const restTotal = blocks.reduce((a,b) => a+b.rest, 0);
    $("routineSummary").innerHTML =
      "<div><b>"+fmtTime(total)+"</b><br>Tiempo total</div>" +
      "<div><b>"+blocks.length+"</b><br>Ejercicios</div>" +
      "<div><b>"+fmtTime(restTotal)+"</b><br>Descanso</div>" +
      "<div><b>"+Math.round(blocks.length/(total/60))+"</b><br>Ej/min</div>";
    $("routinePlan").innerHTML = blocks.map((b,i) =>
      '<div class="plan-row"><span class="plan-idx">'+(i+1)+'</span><b>'+b.name+'</b>' +
      '<span class="plan-time">'+fmtTime(b.dur)+(b.rest?' desc '+fmtTime(b.rest):'')+'</span></div>'
    ).join("");
    $("btnStart").dataset.routine = key;
  }

  $("btnStart").addEventListener("click", () => {
    const key = $("btnStart").dataset.routine;
    startTraining({mode:"routine", name:ROUTINES[key].name, blocks:routineBlocks(key)});
  });

  // ---- CUSTOM ----
  function saveCustom() {
    saveUserKey("sb_custom", customBlocks);
    renderCustom(); renderShadow();
  }
  function renderCustom() {
    const el = $("customList");
    if (!customBlocks.length) { el.innerHTML = '<p style="color:var(--text-dim);">Sin ejercicios. Anade abajo.</p>'; return; }
    el.innerHTML = customBlocks.map((b,i) =>
      '<div class="custom-row"><div class="cr-fig">'+figureHTML(b.type)+'</div>' +
      '<div class="cr-info"><b>'+b.name+'</b><span>'+fmtTime(b.dur)+' trabajo · '+fmtTime(b.rest)+' descanso</span></div>' +
      '<button data-del="'+i+'" title="Eliminar">&#10005;</button></div>'
    ).join("");
    el.querySelectorAll("button[data-del]").forEach(btn => {
      btn.addEventListener("click", () => { customBlocks.splice(+btn.dataset.del,1); saveCustom(); });
    });
  }

  $("customAdd").addEventListener("click", () => {
    const type = $("customType").value;
    const dur = Math.max(5, Number($("customDur").value)||60);
    const rest = Math.max(0, Number($("customRest").value)||20);
    const t = TECHNIQUES.find(x => x.key===type);
    customBlocks.push({name:t.name, type:type, dur:dur, rest:rest, cue:t.desc});
    saveCustom();
  });

  $("customStart").addEventListener("click", () => {
    if (!customBlocks.length) { toast("Anade al menos un ejercicio"); return; }
    startTraining({mode:"custom", name:"MI RUTINA", blocks:customBlocks.map(b=>({name:b.name,type:b.type,dur:b.dur,rest:b.rest,cue:b.cue}))});
  });

  // Populate custom type select
  function populateCustomSelect() {
    const sel = $("customType");
    sel.innerHTML = TECHNIQUES.map(t => '<option value="'+t.key+'">'+t.name+'</option>').join("");
  }

  // ---- HABITS ----
  function loadHabits() { try { return JSON.parse(localStorage.getItem("mg_habits")||"{}"); } catch(e) { return {}; } }
  function saveHabits(store) { saveUserKey("mg_habits", store); }

  function renderHabits() {
    const store = loadHabits(); const key = dateKey(); const day = store[key]||{};
    const done = HABITS.filter(h => day[h.key]).length;
    $("habitsList").innerHTML =
      '<div class="habit-progress"><b>'+done+'/'+HABITS.length+'</b><span>habitos de hoy</span></div>' +
      HABITS.map(h =>
        '<div class="habit-row'+(day[h.key]?" done":"")+'" data-habit="'+h.key+'">' +
          '<span class="habit-emoji">'+h.emoji+'</span><b>'+h.label+'</b>' +
          '<span class="habit-check">'+(day[h.key]?"&#10003;":"")+'</span></div>'
      ).join("") +
      '<p style="color:var(--text-dim);font-size:11px;margin-top:6px;">Toca cada habito al completarlo.</p>';
    $("habitsList").querySelectorAll("[data-habit]").forEach(row => {
      row.addEventListener("click", () => {
        const s2=loadHabits(), k2=dateKey(), d2=s2[k2]||{};
        d2[row.dataset.habit]=!d2[row.dataset.habit]; s2[k2]=d2;
        saveHabits(s2); renderHabits(); renderHome();
      });
    });
    // Week
    const monday = mondayOf(new Date());
    const weekHtml = [];
    for (let i=0;i<7;i++) {
      const d2=new Date(monday); d2.setDate(monday.getDate()+i); const k=dateKey(d2); const st=store[k]||{};
      const c=HABITS.filter(h=>st[h.key]).length;
      weekHtml.push('<div class="week-cell'+(k===dateKey()?" today":"")+'">' +
        '<b>'+DAY_NAMES[dayKeyOf(d2)].charAt(0)+'</b><span>'+d2.getDate()+'</span>' +
        '<i style="background:'+(c>=HABITS.length?"#ff1f1f":c>=5?"#8a0000":"#2a0000")+'">'+c+'/'+HABITS.length+'</i></div>');
    }
    $("habitsWeek").innerHTML = '<div class="week-grid">'+weekHtml.join("")+'</div>';
    // Goals
    $("goalsList").innerHTML = GOALS.map(g =>
      '<div class="goal-row'+(day["g_"+g.key]?" done":"")+'" data-goal="'+g.key+'">' +
        '<b>'+g.label+'</b><span class="habit-check">'+(day["g_"+g.key]?"&#10003;":"")+'</span></div>'
    ).join("");
    $("goalsList").querySelectorAll("[data-goal]").forEach(row => {
      row.addEventListener("click", () => {
        const s2=loadHabits(), k2=dateKey(), d2=s2[k2]||{};
        d2["g_"+row.dataset.goal]=!d2["g_"+row.dataset.goal]; s2[k2]=d2;
        saveHabits(s2); renderHabits();
      });
    });
    renderFinance();
  }

  // ---- FINANCE ----
  function loadFinance() { try { return JSON.parse(localStorage.getItem("mg_finance")||"{}"); } catch(e) { return {}; } }
  function renderFinance() {
    const f=loadFinance(); const ingresos=Number(f.ingresos)||0;
    const gastos=["alimentacion","transporte","servicios","otros"].reduce((a,c)=>a+(Number(f[c])||0),0);
    const balance=ingresos-gastos; const ahorro=Math.round(ingresos*0.1);
    $("financeBody").innerHTML =
      '<div class="fin-grid">' +
        '<div class="fin-card"><b>INGRESOS</b><span class="fin-money">'+ingresos.toLocaleString("es-MX")+'</span></div>' +
        '<div class="fin-card"><b>GASTOS</b><span class="fin-money">'+gastos.toLocaleString("es-MX")+'</span></div>' +
        '<div class="fin-card"><b>AHORRO 10%</b><span class="fin-money">'+ahorro.toLocaleString("es-MX")+'</span></div>' +
        '<div class="fin-card"><b>BALANCE</b><span class="fin-money">'+balance.toLocaleString("es-MX")+'</span></div>' +
      '</div>' +
      '<div class="fin-row"><span>Ingresos</span><input id="finIngresos" type="number" min="0" value="'+(f.ingresos||"")+'"></div>' +
      '<div class="fin-row"><span>Alimentacion</span><input id="finAlimentacion" type="number" min="0" value="'+(f.alimentacion||"")+'"></div>' +
      '<div class="fin-row"><span>Transporte</span><input id="finTransporte" type="number" min="0" value="'+(f.transporte||"")+'"></div>' +
      '<div class="fin-row"><span>Servicios</span><input id="finServicios" type="number" min="0" value="'+(f.servicios||"")+'"></div>' +
      '<div class="fin-row"><span>Otros</span><input id="finOtros" type="number" min="0" value="'+(f.otros||"")+'"></div>' +
      '<p style="color:var(--text-dim);font-size:11px;margin-top:6px;">Ahorra minimo el 10% de cualquier ingreso.</p>';
    ["ingresos","alimentacion","transporte","servicios","otros"].forEach(fld => {
      const el=document.getElementById("fin"+fld.charAt(0).toUpperCase()+fld.slice(1));
      if (el) el.addEventListener("input", () => { const nf=loadFinance(); nf[fld]=el.value;
        saveUserKey("mg_finance", nf);
        renderFinance(); });
    });
  }

  // ---- TRAINING ENGINE ----
  let timerInt = null;
  function startTraining(cfg) {
    ensureAudio(); S.mode=cfg.mode; S.routineName=cfg.name; S.segs=buildSchedule(cfg.blocks);
    S.idx=0; S.done=false; S.paused=false; S.running=true;
    go("training"); enterSeg(true); engineStart(); keepAwake(true);
  }
  function enterSeg(announce) {
    const seg=S.segs[S.idx]; S.segEnd=Date.now()+seg.dur*1000; S.remaining=seg.dur; S.lastSec=Math.ceil(seg.dur);
    renderSeg(seg);
    if (announce) {
      if (seg.kind==="work") { alarmWork(); vibrate(S.idx===0?[200,80,200]:[150,50,150]); speak("Empieza "+seg.name+". "+(seg.cue||"")); }
      else { alarmRest(); vibrate([100]); speak(seg.name+". Respira."); }
      flash();
    }
  }
  function engineStart() { S.running=true; if (timerInt) clearInterval(timerInt); timerInt=setInterval(engineTick,200); }
  function engineStop() { if (timerInt){clearInterval(timerInt);timerInt=null;} S.running=false; keepAwake(false); }

  function engineTick() {
    const now=Date.now(); S.remaining=Math.max(0,(S.segEnd-now)/1000);
    const sec=Math.ceil(S.remaining);
    if (sec!==S.lastSec) { S.lastSec=sec; if (sec<=10&&sec>0){alarmTick(sec);vibrate(sec<=3?[60]:25);} }
    if (S.remaining<=0) {
      if (S.idx<S.segs.length-1) { S.idx++; enterSeg(true); }
      else { finishTraining(); return; }
    }
    renderTimer();
  }

  function finishTraining() {
    S.done=true; S.running=false; engineStop(); alarmFinish(); vibrate([300,100,300,100,500]);
    flash(); speak("Rutina completada! Muy bien.");
    $("trainBlockType").textContent="COMPLETADO";
    $("trainBlockName").textContent="RUTINA COMPLETA!";
    $("trainCue").textContent="Terminaste "+S.routineName+". Excelente trabajo!";
    $("timerTime").textContent="00:00"; $("timerPhase").textContent="FINAL";
    $("timerPhase").className="timer-phase";
    $("timerProgress").setAttribute("stroke-dashoffset","0");
    document.querySelectorAll(".train-controls .btn").forEach(b=>b.classList.add("hidden"));
    $("scheduleStrip").innerHTML=""; toast("RUTINA COMPLETA!");
    const hoy=dateKey(), store=loadHabits(), day=store[hoy]||{}; day.entrene=true; store[hoy]=day;
    saveHabits(store);
  }

  function renderSeg(seg) {
    $("trainBlockType").textContent = seg.kind==="rest"?"DESCANSO":S.routineName;
    $("trainBlockName").textContent = seg.name;
    $("trainCue").textContent = seg.kind==="rest"?"Descansa, respira.":(seg.cue||"");
    $("trainFigure").innerHTML = '<div class="figure-ring"></div><div class="figure-wrap">'+(seg.kind==="rest"?figureHTML("guardia"):figureHTML(seg.type))+'</div>';
    renderStrip();
    document.querySelectorAll(".train-controls .btn").forEach(b=>b.classList.remove("hidden"));
  }

  function renderStrip() {
    $("scheduleStrip").innerHTML = S.segs.map((s,i) =>
      '<div class="sched-cell'+(i===S.idx?" active":i<S.idx?" past":"")+'" id="sc-'+i+'">' +
        '<span class="sc-time">'+fmtTime(s.start)+'</span>' +
        '<span class="sc-name">'+(s.kind==="rest"?"Descanso":s.name)+'</span></div>'
    ).join("");
    const cur=$("sc-"+S.idx); if (cur&&cur.scrollIntoView) cur.scrollIntoView({inline:"nearest"});
  }

  function renderTimer() {
    const seg=S.segs[S.idx]; if (!seg) return;
    const frac=S.remaining/seg.dur;
    $("timerTime").textContent=fmtTime(Math.ceil(S.remaining));
    $("timerPhase").textContent=seg.kind==="rest"?"DESCANSO":"TRABAJO";
    $("timerPhase").classList.toggle("rest",seg.kind==="rest");
    $("timerProgress").setAttribute("stroke-dashoffset", Math.max(0,867.08*(1-frac)).toFixed(2));
  }

  // ---- Controls ----
  $("btnPause").addEventListener("click", () => {
    if (S.done) return;
    if (S.paused) { S.paused=false; S.segEnd=Date.now()+S.remaining*1000; engineStart(); $("btnPause").textContent="PAUSA"; }
    else { S.paused=true; engineStop(); $("btnPause").textContent="RESUMIR"; $("timerPhase").textContent="PAUSA"; $("timerPhase").classList.remove("rest"); }
  });
  $("btnSkip").addEventListener("click", () => {
    if (S.done) return; if (S.idx<S.segs.length-1){S.idx++;enterSeg(true);engineStart();}else finishTraining();
  });
  $("btnReset").addEventListener("click", () => { if (S.done) return; S.idx=0; enterSeg(true); engineStart(); });
  $("btnStop").addEventListener("click", () => { engineStop(); S.paused=false; S.done=false; toast("Detenido"); go("home"); });

  // ---- Wake Lock ----
  let wakeLock = null;
  async function keepAwake(on) {
    if (!("wakeLock" in navigator)) return;
    try { if (on&&!wakeLock) wakeLock=await navigator.wakeLock.request("screen"); if (!on&&wakeLock){wakeLock.release();wakeLock=null;} } catch(e) {}
  }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState==="visible"&&S.running&&!S.paused) keepAwake(true); });

  // ---- SETTINGS ----
  function renderSettings() {
    const el=$("settingsBody");
    el.innerHTML =
      '<div class="setting-row"><div><b>Volumen</b><small>'+Math.round(settings.vol*100)+'%</small></div>' +
        '<input type="range" id="setVol" min="0" max="100" value="'+Math.round(settings.vol*100)+'"></div>' +
      '<div class="setting-row"><div><b>Alarmas</b><small>Pitidos en cada cambio</small></div>' +
        '<label class="switch"><input type="checkbox" id="setAlarms" '+(settings.alarms?"checked":'')+'><span class="slider"></span></label></div>' +
      '<div class="setting-row"><div><b>Voz guiada</b><small>Anuncia cada ejercicio</small></div>' +
        '<label class="switch"><input type="checkbox" id="setVoice" '+(settings.voice?"checked":'')+'><span class="slider"></span></label></div>' +
      '<div class="setting-row"><div><b>Vibracion</b><small>Alertas tactiles</small></div>' +
        '<label class="switch"><input type="checkbox" id="setVibe" '+(settings.vibe?"checked":'')+'><span class="slider"></span></label></div>' +
      '<div class="setting-row"><div><b>Modo Guerra</b><small>Glow y escaneo rojo</small></div>' +
        '<label class="switch"><input type="checkbox" id="setWar" '+(settings.war?"checked":'')+'><span class="slider"></span></label></div>' +
      '<div class="setting-row"><div><b>Sin brillo</b><small>Apaga animaciones</small></div>' +
        '<label class="switch"><input type="checkbox" id="setNoGlow" '+(settings.noglow?"checked":'')+'><span class="slider"></span></label></div>' +
      '<div class="setting-row" style="align-items:flex-start;flex-direction:column;">' +
        '<b>Color de detalles</b><small>Fondo se mantiene negro</small>' +
        '<div id="accSwatches" style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">' +
        Object.keys(ACCENT_BASES).map(k =>
          '<button data-acc="'+k+'" title="'+k+'" style="width:30px;height:30px;border-radius:50%;cursor:pointer;background:'+ACCENT_BASES[k]+';border:2px '+(settings.accent===k?"solid #fff":"solid transparent")+';"></button>'
        ).join("") + '</div></div>' +
      '<button id="btnTestAlarm" class="btn secondary" style="width:100%;margin-top:4px;">PROBAR ALARMA</button>' +
      '<button id="btnEditScheduleFromSettings" class="btn secondary" style="width:100%;margin-top:6px;">EDITAR HORARIO SEMANAL</button>' +
      (typeof Auth !== "undefined" && Auth.isLoggedIn() ?
        '<button id="btnProfileFromSettings" class="btn secondary" style="width:100%;margin-top:6px;">&#128100; MI CUENTA ('+Auth.getUser().displayName+')</button>' : '') +
      '<button id="btnResetData" class="btn danger" style="width:100%;margin-top:6px;">BORRAR DATOS</button>';

    $("setVol").addEventListener("input", e => { settings.vol=Number(e.target.value)/100; saveSettings(); });
    $("setAlarms").addEventListener("change", e => { settings.alarms=e.target.checked; saveSettings(); });
    $("setVoice").addEventListener("change", e => { settings.voice=e.target.checked; saveSettings(); });
    $("setVibe").addEventListener("change", e => { settings.vibe=e.target.checked; saveSettings(); });
    $("setWar").addEventListener("change", e => { settings.war=e.target.checked; saveSettings(); applyWar(); flash(); vibrate([80]); });
    $("setNoGlow").addEventListener("change", e => { settings.noglow=e.target.checked; saveSettings(); applyNoGlow(); });
    $("btnTestAlarm").addEventListener("click", () => { ensureAudio(); alarmFinish(); vibrate([200,100,200]); flash(); });
    $("accSwatches").querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      settings.accent=b.dataset.acc; saveSettings(); applyAccent(); renderSettings();
    }));
    $("btnEditScheduleFromSettings").addEventListener("click", () => go("schedule"));
    $("btnProfileFromSettings").addEventListener("click", () => go("profile"));
    $("btnResetData").addEventListener("click", () => {
      localStorage.removeItem("sb_settings"); localStorage.removeItem("sb_custom");
      localStorage.removeItem("mg_habits"); localStorage.removeItem("mg_finance"); location.reload();
    });
  }

  function saveSettings() { saveUserKey("sb_settings", settings); }
  $("btnSettings").addEventListener("click", () => go("settings"));
  $("btnWar").addEventListener("click", () => {
    settings.war=!settings.war; saveSettings(); applyWar(); flash(); vibrate([80]);
    toast(settings.war?"MODO GUERRA ACTIVADO":"Modo guerra desactivado");
  });

  // ---- PWA Install ----
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault(); deferredPrompt=e;
    if (!window.matchMedia("(display-mode:standalone)").matches) $("installBar").classList.remove("hidden");
  });
  window.addEventListener("appinstalled", () => { $("installBar").classList.add("hidden"); toast("App instalada"); });
  $("installBtn").addEventListener("click", async () => {
    if (!deferredPrompt) { toast("Abre en Edge o Chrome para instalar"); return; }
    deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; $("installBar").classList.add("hidden");
  });
  $("installClose").addEventListener("click", () => $("installBar").classList.add("hidden"));

  // ---- Service Worker ----
  if ("serviceWorker" in navigator) { window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(()=>{}); }); }

  // ---- PROFILE ----
  function renderProfile() {
    var u = (typeof Auth !== "undefined") ? Auth.getUser() : null;
    if (!u) { go("settings"); return; }
    $("profileBody").innerHTML =
      '<div class="profile-card">' +
        '<div class="profile-avatar" style="display:flex;align-items:center;justify-content:center;font-size:32px;background:var(--grad4);">&#128100;</div>' +
        '<h3 class="profile-name">'+escHtml(u.displayName)+'</h3>' +
        '<p class="profile-email">@'+escHtml(u.username)+'</p>' +
        '<div class="profile-sync-status synced">&#10003; Datos guardados localmente</div>' +
      '</div>' +
      '<button id="btnLogout" class="btn danger" style="width:100%;">CERRAR SESION</button>';
    $("btnLogout").addEventListener("click", function () {
      Auth.logout();
      toast("Sesion cerrada");
    });
  }

  // ---- AUTH INIT ----
  function showAuthView() {
    $("view-login").classList.add("active");
    $("appContainer").classList.add("hidden");
    document.querySelectorAll("#bottomNav .nav-btn").forEach(function(b){b.classList.remove("active");});
  }
  function showApp() {
    $("view-login").classList.remove("active");
    $("appContainer").classList.remove("hidden");
    go("home");
  }
  function showAuthError(msg) {
    var el = $("authError"); el.textContent = msg; el.classList.remove("hidden");
  }
  function hideAuthError() { $("authError").classList.add("hidden"); }

  function initAuth() {
    if (typeof Auth === "undefined") { showApp(); return; }
    Auth.init();
    Auth.onAuthChange(function (u) {
      if (u) {
        loadUserDataFor(u.username);
        showApp();
        renderHome(); renderMilitary(); renderShadow(); renderCustom();
        renderHabits(); renderSettings(); renderSchedTabs(); renderSchedEdit();
        toast("Bienvenido, " + u.displayName);
      } else {
        loadDefaultData();
        showAuthView();
      }
    });

    // Login
    $("btnAuthLogin").addEventListener("click", function () {
      hideAuthError();
      var user = $("authUser").value.trim();
      if (!user) { showAuthError("Escribe tu usuario"); return; }
      try { Auth.login(user); } catch (e) { showAuthError(e.message); }
    });

    // Register
    $("btnAuthRegister").addEventListener("click", function () {
      hideAuthError();
      var user = $("authRegUser").value.trim();
      if (!user) { showAuthError("Escribe un nombre de usuario"); return; }
      try { Auth.register(user); } catch (e) { showAuthError(e.message); }
    });

    // Form switching
    $("btnShowRegister").addEventListener("click", function () {
      $("authLoginForm").classList.add("hidden");
      $("authRegisterForm").classList.remove("hidden");
      hideAuthError();
    });
    $("btnShowLogin").addEventListener("click", function () {
      $("authLoginForm").classList.remove("hidden");
      $("authRegisterForm").classList.add("hidden");
      hideAuthError();
    });

    // Skip
    // (no skip button needed — user must create/select a user)
  }

  /* ---- Cargar datos del usuario ---- */
  function loadUserDataFor(username) {
    ["sb_settings","mg_habits","mg_finance","mg_schedule","sb_custom"].forEach(function (lsKey) {
      var data = Auth.loadData(lsKey);
      if (data !== null) {
        localStorage.setItem(lsKey, typeof data === "string" ? data : JSON.stringify(data));
      }
    });
    // Reload settings
    try { Object.assign(settings, DEFAULTS, JSON.parse(localStorage.getItem("sb_settings") || "{}")); } catch(e){}
    try { customBlocks = JSON.parse(localStorage.getItem("sb_custom") || "[]"); } catch(e){ customBlocks = []; }
    applyAccent(); applyNoGlow(); applyWar();
  }
  function loadDefaultData() {
    // Keep whatever is in localStorage (guest mode)
  }

  /* ---- Guardar con sync automatico ---- */
  function saveUserKey(lsKey, value) {
    if (typeof Auth !== "undefined" && Auth.isLoggedIn()) {
      Auth.saveAndSync(lsKey, value);
    } else {
      localStorage.setItem(lsKey, typeof value === "string" ? value : JSON.stringify(value));
    }
  }

  // ---- INIT ----
  populateCustomSelect();
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
  initAuth();
})();
