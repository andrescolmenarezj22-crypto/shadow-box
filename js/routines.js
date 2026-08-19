/* ===========================================================================
   SHADOW BOX — Rutinas con tiempos exactos, alarmas y pistas guiadas
   =========================================================================== */

const TECHNIQUES = [
  { key: "guardia",  name: "Posición de Guardia", desc: "Manos arriba protegiendo el mentón, codos pegados, rodillas semiflexionadas y pies en posición de combate." },
  { key: "jab",      name: "Jab", desc: "Golpe rápido con la mano delantera, rotando ligeramente el puño. No bajes la guardia al regresar." },
  { key: "cross",    name: "Directo de Derecha", desc: "Golpe de potencia con la mano trasera. Gira cadera y hombro; el talón trasero se levanta." },
  { key: "hook",     name: "Gancho (Hook)", desc: "Gancho corto lateral con el codo a la altura del puño. Fuerza desde las piernas y la rotación." },
  { key: "uppercut", name: "Uppercut", desc: "Golpe ascendente desde abajo, flexionando las rodillas y subiendo el puño por el centro." },
  { key: "defensa",  name: "Defensa / Cobertura", desc: "Cubre cabeza y torso con los guantes, barbilla al pecho y codos cerrados." },
  { key: "bob",      name: "Esquiva (Bob & Weave)", desc: "Agáchate flexionando las piernas y desplázate en zigzag manteniendo las manos arriba." },
  { key: "footwork", name: "Juego de Pies", desc: "Pasos cortos y rápidos: avanza, retrocede y lateral. Nunca cruces los pies." }
];

const ROUTINES = {
  fundamentos: {
    name: "FUNDAMENTOS",
    emoji: "🎓",
    desc: "Aprende la base: guardia, golpes básicos, defensa y juego de pies. Ideal para principiantes.",
    color: "#ff1f1f",
    blocks: [
      { name: "Posición de Guardia", type: "guardia", dur: 45, rest: 15, cue: "Mantén las manos arriba, barbilla baja y rodillas semiflexionadas." },
      { name: "Jab", type: "jab", dur: 60, rest: 15, cue: "Lanza jabs rápidos al frente, sin bajar la guardia al regresar." },
      { name: "Directo de Derecha", type: "cross", dur: 60, rest: 15, cue: "Gira cadera y hombro al lanzar el directo de derecha." },
      { name: "Gancho (Hook)", type: "hook", dur: 60, rest: 15, cue: "Gancho corto con rotación de hombro, codo a la altura del puño." },
      { name: "Uppercut", type: "uppercut", dur: 60, rest: 15, cue: "Sube el puño desde abajo, potencia con las piernas." },
      { name: "Defensa / Cobertura", type: "defensa", dur: 60, rest: 15, cue: "Cubre cabeza y torso manteniendo los guantes pegados al rostro." },
      { name: "Esquiva (Bob & Weave)", type: "bob", dur: 60, rest: 15, cue: "Agáchate y muévete en zigzag, manos siempre arriba." },
      { name: "Juego de Pies", type: "footwork", dur: 60, rest: 15, cue: "Pasos cortos y rápidos en posición de combate, sin cruzar los pies." },
      { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respira profundo, camina despacio y estira los brazos." }
    ]
  },
  combinaciones: {
    name: "COMBINACIONES",
    emoji: "🔥",
    desc: "Encadena golpes con ritmo. 8 asaltos de combos seguidos con pistas exactas.",
    color: "#ff3b3b",
    blocks: [
      { name: "1-2 (Jab + Cross)", type: "cross", dur: 60, rest: 20, cue: "Jab + cross. Primero técnica, después velocidad." },
      { name: "1-2-3 (Jab + Cross + Gancho)", type: "hook", dur: 60, rest: 20, cue: "Jab, cross, gancho de izquierda. Repite sin pausa." },
      { name: "1-1-2 (Doble Jab + Cross)", type: "cross", dur: 60, rest: 20, cue: "Doble jab + cross. Muévete entre golpes." },
      { name: "3-2 (Gancho + Cross)", type: "hook", dur: 60, rest: 20, cue: "Gancho de izquierda + cross de derecha." },
      { name: "1-2-5-2 (Uppercut)", type: "uppercut", dur: 60, rest: 20, cue: "Jab, cross, uppercut izquierdo, cross." },
      { name: "5-6 (Doble Uppercut)", type: "uppercut", dur: 60, rest: 20, cue: "Uppercut izquierdo + derecho, cierra con jab." },
      { name: "1-2-3-2-1 (Clásico)", type: "cross", dur: 60, rest: 20, cue: "Jab, cross, gancho, cross, jab. Fluido y rítmico." },
      { name: "Combinación Libre", type: "jab", dur: 60, rest: 20, cue: "Combina todo lo aprendido a máxima velocidad." },
      { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respira y relaja los hombros." }
    ]
  },
  defensa: {
    name: "DEFENSA",
    emoji: "🛡️",
    desc: "Entrena bloqueos, esquivas y contraataques. Tu escudo invisible.",
    color: "#ff4040",
    blocks: [
      { name: "Cobertura Alta", type: "defensa", dur: 60, rest: 20, cue: "Guantes pegados a la cara, absorbe golpes imaginarios." },
      { name: "Esquiva Lateral", type: "bob", dur: 60, rest: 20, cue: "Desplázate de lado a lado agachado, manos arriba." },
      { name: "Bloqueo + Jab", type: "jab", dur: 60, rest: 20, cue: "Bloquea y responde con jab inmediato." },
      { name: "Retroceso + 1-2", type: "cross", dur: 60, rest: 20, cue: "Retrocede un paso y contraataca con jab + cross." },
      { name: "Círculo de Pies", type: "footwork", dur: 60, rest: 20, cue: "Rodea imaginando a tu rival, mantén la distancia." },
      { name: "Simulación de Combate", type: "guardia", dur: 60, rest: 20, cue: "Defiende y contraataca en movimiento continuo." },
      { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respira hondo y suelta los hombros." }
    ]
  },
  acondicionamiento: {
    name: "ACONDICIONAMIENTO",
    emoji: "⚡",
    desc: "Trabajo intenso por rondas: explosividad, ritmo y resistencia.",
    color: "#ff5a5a",
    blocks: [
      { name: "Calentamiento", type: "guardia", dur: 120, rest: 10, cue: "Trote en el sitio y guardia alta." },
      { name: "Ronda 1 — Jabs explosivos", type: "jab", dur: 40, rest: 20, cue: "Jabs sin parar, máxima velocidad." },
      { name: "Ronda 2 — Combinaciones", type: "cross", dur: 40, rest: 20, cue: "1-2-3 a toda potencia." },
      { name: "Ronda 3 — Agachadas", type: "bob", dur: 40, rest: 20, cue: "Bob & weave intenso, cadera abajo." },
      { name: "Ronda 4 — Golpes de poder", type: "hook", dur: 40, rest: 20, cue: "Ganchos y uppercuts fuertes." },
      { name: "Ronda 5 — Juego de pies", type: "footwork", dur: 40, rest: 20, cue: "Muévete rápido por todo el espacio." },
      { name: "Ronda 6 — Defensa activa", type: "defensa", dur: 40, rest: 20, cue: "Cubre, esquiva y contraataca." },
      { name: "Ronda 7 — Doble ritmo", type: "jab", dur: 40, rest: 20, cue: "Jabs dobles + movimiento constante." },
      { name: "Ronda 8 — Todo incluido", type: "uppercut", dur: 40, rest: 20, cue: "Combina golpes y esquivas sin parar." },
      { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Camina despacio y estira." }
    ]
  },
  completa: {
    name: "RUTINA COMPLETA",
    emoji: "💯",
    desc: "Calentamiento + técnica + combinaciones + intensidad + enfriamiento. Sesión completa.",
    color: "#ff0000",
    blocks: [
      { name: "Calentamiento", type: "guardia", dur: 120, rest: 10, cue: "Trote en el sitio, brazos en movimiento." },
      { name: "Posición de Guardia", type: "guardia", dur: 45, rest: 15, cue: "Ajusta tu postura de combate." },
      { name: "Jab", type: "jab", dur: 60, rest: 15, cue: "Jabs rápidos con técnica." },
      { name: "Directo de Derecha", type: "cross", dur: 60, rest: 15, cue: "Cross de potencia con rotación de cadera." },
      { name: "Gancho y Uppercut", type: "hook", dur: 60, rest: 15, cue: "Alterna ganchos y uppercuts." },
      { name: "Defensa", type: "defensa", dur: 60, rest: 15, cue: "Cobertura y esquivas." },
      { name: "Combo 1-2-3", type: "cross", dur: 60, rest: 15, cue: "Jab + cross + gancho, repetido." },
      { name: "Combo 1-1-2", type: "jab", dur: 60, rest: 15, cue: "Doble jab + cross, moviéndote." },
      { name: "Ronda Intensa", type: "uppercut", dur: 40, rest: 20, cue: "Máxima velocidad y potencia." },
      { name: "Ronda Intensa 2", type: "bob", dur: 40, rest: 20, cue: "Esquivas explosivas + contraataque." },
      { name: "Ronda Intensa 3", type: "footwork", dur: 40, rest: 20, cue: "Juego de pies sin parar." },
      { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respira profundo y estira los brazos." }
    ]
  }
};

/* ===========================================================================
   MODO GUERRA — Plan de vida diario + entrenamiento semanal "11-11"
   (extraído por OCR de la imagen modoguerra 1.0.png)
   =========================================================================== */

const MODO_GUERRA = {
  lema: "* DISCIPLINA HOY, LIBERTAD MAÑANA *",
  despertar: "7:00",
  dormir: "22:30",
  plan: {
    lunes:    { emoji: "💪", ab: 20, fl: 10, ss: 20, pl: 30, mc: 20, cu: 1, jj: 30, sl: 20 },
    martes:   { emoji: "🔥", ab: 30, fl: 15, ss: 30, pl: 40, mc: 30, cu: 2, jj: 40, sl: 30 },
    miercoles:{ emoji: "⚡", ab: 40, fl: 20, ss: 40, pl: 50, mc: 30, cu: 3, jj: 50, sl: 40 },
    jueves:   { emoji: "💥", ab: 30, fl: 15, ss: 30, pl: 40, mc: 30, cu: 2, jj: 40, sl: 30 },
    viernes:  { emoji: "🏆", ab: 50, fl: 20, ss: 50, pl: 60, mc: 50, cu: 4, jj: 50, sl: 45 },
    sabado:   { emoji: "🏃", trote: true, desc: "Trote suave · 30 minutos" },
    domingo:  { emoji: "😌", descanso: true, desc: "Descanso activo · caminar y estirar" }
  }
};

/* Horarios por defecto por día de la semana (editables en la app).
   Semana con escuela · sábado con actividades propias · domingo con iglesia. */
const SCHEDULE_DEFAULTS = (function () {
  var semana = [
    { t: "7:00", title: "Despertar", emoji: "🌅", desc: "Tender la cama, tomar agua, lavarse la cara. Nada de celular." },
    { t: "7:10", title: "Activación", emoji: "🧘", desc: "Estiramientos 10 min · respiración profunda 5 min." },
    { t: "7:25", title: "Cardio", emoji: "🏃", desc: "Caminar o trotar 15 min." },
    { t: "8:30", title: "Entrenamiento militar", emoji: "💪", desc: "Según el plan semanal del día de hoy." },
    { t: "8:45", title: "Ducha", emoji: "🚿", desc: "Refrescarse y activarse." },
    { t: "9:00", title: "Desayuno + prepararse", emoji: "🍳", desc: "Vestirse, arreglarse, preparar mochila, revisar útiles y tareas." },
    { t: "11:00", title: "Almuerzo", emoji: "🥗", desc: "Almuerzo saludable y breve descanso." },
    { t: "12:00", title: "Descanso / relajación", emoji: "😌", desc: "Desconexión breve." },
    { t: "12:30", title: "Voy para la escuela", emoji: "🎒", desc: "Salir con tiempo, llegar con calma y enfoque." },
    { t: "13:00", title: "Escuela", emoji: "🏫", desc: "Clases, atención, participación y enfoque al 100%.", until: "18:00" },
    { t: "18:00", title: "Llego a casa", emoji: "🏠", desc: "Descanso breve, hidratarse y cambiarse." },
    { t: "18:30", title: "Descanso / tiempo libre", emoji: "🎮", desc: "Relajarse, ver algo ligero, escuchar música." },
    { t: "19:00", title: "Segunda sesión", emoji: "📚", desc: "Estudiar, leer, tareas, aprender algo nuevo." },
    { t: "20:00", title: "Proyecto personal", emoji: "🛠", desc: "Minecraft, discord, diseño, edición, crear contenido." },
    { t: "21:00", title: "Finanzas", emoji: "💸", desc: "Registrar gastos, revisar ingresos, ahorrar, revisar inversiones." },
    { t: "21:30", title: "Organización", emoji: "🗂", desc: "Limpiar habitación, organizar escritorio, preparar ropa." },
    { t: "22:00", title: "Tracker de hábitos + relajación", emoji: "✅", desc: "Música tranquila, leer, estiramientos, sin pantallas." },
    { t: "22:15", title: "Prepararse para dormir", emoji: "🪥", desc: "Cepillarse los dientes, preparar alarma, luces bajas." },
    { t: "22:30", title: "Dormir", emoji: "😴", desc: "Descanso para ser mejor mañana. 8h 30min de sueño." }
  ];
  var sabado = [
    { t: "7:00", title: "Despertar", emoji: "🌅", desc: "Tender la cama, tomar agua, lavarse la cara." },
    { t: "7:10", title: "Activación", emoji: "🧘", desc: "Estiramientos 10 min · respiración profunda 5 min." },
    { t: "7:25", title: "Cardio", emoji: "🏃", desc: "Trote suave 20 min al ritmo que aguantes." },
    { t: "8:30", title: "Entrenamiento militar", emoji: "💪", desc: "Sábado de resistencia: trote + sombra." },
    { t: "8:45", title: "Ducha", emoji: "🚿", desc: "Refrescarse y activarse." },
    { t: "9:00", title: "Desayuno", emoji: "🍳", desc: "Desayuno completo y sin prisa." },
    { t: "10:00", title: "Tareas de la casa", emoji: "🧹", desc: "Lavar ropa, limpiar el cuarto, ayudar en casa." },
    { t: "12:00", title: "Proyecto personal", emoji: "🛠", desc: "Minecraft, discord, diseño, edición, crear contenido." },
    { t: "13:00", title: "Almuerzo", emoji: "🥗", desc: "Almuerzo saludable y descanso breve." },
    { t: "14:00", title: "Tiempo libre / amigos", emoji: "🎮", desc: "Salir, jugar, música o descansar." },
    { t: "16:00", title: "Crear contenido", emoji: "🎨", desc: "Edición, diseño o lo que más te guste." },
    { t: "18:00", title: "Descanso / música", emoji: "🎵", desc: "Relajarse y escuchar música." },
    { t: "19:00", title: "Segunda sesión", emoji: "📚", desc: "Estudiar, leer o aprender algo nuevo." },
    { t: "20:00", title: "Finanzas", emoji: "💸", desc: "Registrar gastos, revisar ingresos, ahorrar." },
    { t: "21:00", title: "Organización", emoji: "🗂", desc: "Ordenar el cuarto y preparar la semana." },
    { t: "22:00", title: "Tracker + relajación", emoji: "✅", desc: "Música tranquila, leer, sin pantallas." },
    { t: "22:30", title: "Dormir", emoji: "😴", desc: "Recuperarse para el domingo." }
  ];
  var domingo = [
    { t: "7:00", title: "Despertar", emoji: "🌅", desc: "Tender la cama, tomar agua, lavarse la cara." },
    { t: "7:15", title: "Prepararse", emoji: "🪥", desc: "Arreglarse para ir a la iglesia." },
    { t: "8:00", title: "Iglesia", emoji: "⛪", desc: "Asistir y disfrutar el servicio.", until: "11:00" },
    { t: "11:00", title: "Almuerzo familiar", emoji: "🍳", desc: "Comer con la familia y compartir." },
    { t: "12:30", title: "Descanso activo", emoji: "🚶", desc: "Caminar, estirar y respirar. El cuerpo se recupera." },
    { t: "14:00", title: "Tiempo libre", emoji: "🎮", desc: "Relajarse, ver algo ligero, escuchar música." },
    { t: "16:00", title: "Lectura / estudio ligero", emoji: "📖", desc: "Leer algo que te guste o repasar tareas." },
    { t: "17:30", title: "Preparar la semana", emoji: "🗂", desc: "Ropa, útiles y plan de la semana." },
    { t: "19:00", title: "Segunda sesión", emoji: "📚", desc: "Estudiar, leer, aprender algo nuevo." },
    { t: "20:30", title: "Finanzas / plan semanal", emoji: "💸", desc: "Registrar gastos y revisar la semana." },
    { t: "21:30", title: "Relajación sin pantallas", emoji: "😌", desc: "Música tranquila, estiramientos, respirar." },
    { t: "22:00", title: "Prepararse para dormir", emoji: "🪥", desc: "Cepillarse, preparar alarma, luces bajas." },
    { t: "22:30", title: "Dormir", emoji: "😴", desc: "Descanso para la semana de guerra." }
  ];
  var o = {};
  ["lunes", "martes", "miercoles", "jueves", "viernes"].forEach(function (k) {
    o[k] = semana.map(function (x) { return Object.assign({}, x); });
  });
  o.sabado = sabado;
  o.domingo = domingo;
  return o;
})();

/* Almacén de horarios personalizados por día (localStorage) */
function loadScheduleStore() {
  try { return JSON.parse(localStorage.getItem("mg_schedule") || "{}"); } catch (e) { return {}; }
}

/* Horario de un día: el personalizado si existe, si no el de fábrica */
function getDaySchedule(dayKey) {
  var store = loadScheduleStore();
  var d = store[dayKey];
  return (d && d.length) ? d : (SCHEDULE_DEFAULTS[dayKey] || []);
}

/* Horario editable de un día (guarda copia personalizada al primer cambio) */
function getEditableSchedule(dayKey) {
  var store = loadScheduleStore();
  if (!store[dayKey] || !store[dayKey].length) {
    store[dayKey] = getDaySchedule(dayKey).map(function (x) { return Object.assign({}, x); });
    localStorage.setItem("mg_schedule", JSON.stringify(store));
  }
  return store[dayKey];
}

/* Convierte "7:00" a "07:00" para inputs type=time */
function toTimeInput(t) {
  if (!t) return "";
  var p = String(t).split(":");
  return ("0" + (+p[0])).slice(-2) + ":" + (p[1] || "00");
}

/* Escapa texto para insertarlo como HTML */
function escHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* Sesión de entrenamiento por día: ejercicios del plan + shadow box (equilibrado) */
function militaryBlocks(dayKey) {
  const d = MODO_GUERRA.plan[dayKey];
  const B = (name, type, dur, rest, cue) => ({ name: name, type: type, dur: dur, rest: rest, cue: cue });
  const out = [B("Activación", "guardia", 120, 10, "Estiramientos y movilidad para entrar en calor.")];
  if (d.trote) {
    out.push(B("Trote suave · 10 min", "guardia", 600, 30, "Ritmo constante, respira por la nariz."));
    out.push(B("Trote suave · 10 min", "guardia", 600, 30, "Mantén el ritmo, brazos relajados."));
    out.push(B("Trote suave · 10 min", "guardia", 600, 20, "Última parte, cierra con calma."));
    out.push(B("Sombra — Combos 1-2", "cross", 60, 20, "Jab + cross con la guardia alta."));
    out.push(B("Sombra — Esquivas", "bob", 60, 20, "Bob & weave y contraataca con jab."));
    out.push(B("Sombra — Combinación libre", "jab", 60, 0, "Mezcla golpes, esquivas y juego de pies."));
  } else if (d.descanso) {
    out.push(B("Caminar suave · 15 min", "guardia", 900, 0, "Paso ligero, respira profundo."));
    out.push(B("Estiramientos y movilidad", "guardia", 300, 0, "Estira brazos, espalda y piernas."));
    out.push(B("Respiración profunda", "guardia", 300, 0, "Inhala 4 s, aguanta 4 s, exhala 6 s."));
    return out;
  } else {
    out.push(B("Abdominales x" + d.ab, "guardia", 60, 20, "Contrae el abdomen al subir. Controla cada repetición."));
    out.push(B("Flexiones x" + d.fl, "guardia", 60, 20, "Cuerpo recto, baja con control, empuja con fuerza."));
    out.push(B("Sentadillas con salto x" + d.ss, "guardia", 60, 20, "Baja en sentadilla y explota hacia arriba."));
    out.push(B("Plancha " + d.pl + " seg", "guardia", d.pl, 30, "Cuerpo alineado, abdomen firme, no bajes la cadera."));
    out.push(B("Mountain climbers x" + d.mc, "guardia", 60, 20, "Alterna rodillas al pecho a buen ritmo."));
    out.push(B("Cuerda " + d.cu + " min", "guardia", d.cu * 60, 20, "Salta al ritmo, muñecas sueltas."));
    out.push(B("Jumping jacks x" + d.jj, "guardia", 60, 20, "Abre y cierra brazos y piernas con ritmo."));
    out.push(B("Saltos laterales x" + d.sl, "guardia", 60, 20, "Salta de lado a lado sobre una línea imaginaria."));
    out.push(B("Sombra — Combos 1-2", "cross", 60, 20, "Jab + cross con la guardia alta."));
    out.push(B("Sombra — Esquivas", "bob", 60, 20, "Bob & weave y contraataca con jab."));
    out.push(B("Sombra — Combinación libre", "jab", 60, 0, "Mezcla golpes, esquivas y juego de pies."));
  }
  return out;
}

/* ---------- Hábitos y objetivos MODO GUERRA ---------- */
const HABITS = [
  { key: "entrene",    label: "Entrené",                  emoji: "💪" },
  { key: "estudie",    label: "Estudié",                  emoji: "📚" },
  { key: "lei",        label: "Leí",                      emoji: "📖" },
  { key: "ahorre",     label: "Ahorré",                   emoji: "💰" },
  { key: "registre",   label: "Registré gastos",          emoji: "🧾" },
  { key: "nocompras",  label: "Sin compras impulsivas",   emoji: "🚫" },
  { key: "agua",       label: "Tomé suficiente agua (2L)",emoji: "💧" },
  { key: "dormi",      label: "Dormí temprano",           emoji: "🌙" },
  { key: "noprocrast", label: "Sin procrastinar",         emoji: "⏱" },
  { key: "aprendi",    label: "Aprendí algo nuevo",       emoji: "🧠" }
];

const GOALS = [
  { key: "pasos",     label: "10.000 pasos" },
  { key: "agua2",     label: "2 litros de agua" },
  { key: "leer15",    label: "Leer 15 páginas" },
  { key: "ahorrardin",label: "Ahorrar dinero" },
  { key: "registrar", label: "Registrar gastos" },
  { key: "noprocra2", label: "No procrastinar" },
  { key: "estudiar",  label: "Estudiar mínimo 2 horas" },
  { key: "cuarto",    label: "Mantener el cuarto limpio" },
  { key: "entrenar",  label: "Entrenar" },
  { key: "dormir",    label: "Dormir antes de 10:30 pm" }
];

/* ---------- utilidades ---------- */

function fmtTime(sec) {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

function routineBlocks(key) {
  return (ROUTINES[key] ? ROUTINES[key].blocks : []).map(function (b) {
    return { name: b.name, type: b.type, dur: b.dur, rest: b.rest || 0, cue: b.cue || "" };
  });
}

function routineTotal(blocks) {
  return blocks.reduce(function (acc, b) { return acc + b.dur + b.rest; }, 0);
}

/* Devuelve la lista de segmentos con su tiempo de inicio exacto.
   Cada bloque de trabajo genera un segmento {work} y su descanso {rest}. */
function buildSchedule(blocks) {
  const segs = [];
  let t = 0;
  blocks.forEach(function (b, bi) {
    segs.push({ kind: "work", bi: bi, name: b.name, type: b.type, dur: b.dur, cue: b.cue, start: t });
    t += b.dur;
    if (b.rest > 0) {
      segs.push({ kind: "rest", bi: bi, name: "Descanso", type: "rest", dur: b.rest, cue: "Descansa. Respira y suelta los brazos.", start: t });
      t += b.rest;
    }
  });
  return segs;
}
