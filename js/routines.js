/* routines.js — Shadow Box: rutinas, deportes, disciplina */

var TECHNIQUES = [
  { key: "guardia", name: "Posicion de Guardia", desc: "Manos arriba protegiendo el menton, codos pegados, rodillas semiflexionadas." },
  { key: "jab", name: "Jab", desc: "Golpe rapido con la mano delantera, rotando ligeramente el puno." },
  { key: "cross", name: "Directo de Derecha", desc: "Golpe de potencia con la mano trasera. Gira cadera y hombro." },
  { key: "hook", name: "Gancho (Hook)", desc: "Gancho corto lateral con el codo a la altura del puno." },
  { key: "uppercut", name: "Uppercut", desc: "Golpe ascendente desde abajo, flexionando las rodillas." },
  { key: "defensa", name: "Defensa / Cobertura", desc: "Cubre cabeza y torso con los guantes, barbilla al pecho." },
  { key: "bob", name: "Esquiva (Bob & Weave)", desc: "Agachate flexionando las piernas y desplazate en zigzag." },
  { key: "footwork", name: "Juego de Pies", desc: "Pasos cortos y rapidos: avanza, retrocede y lateral." },
  { key: "dribble", name: "Drible", desc: "Controla el balon con toques cortos, cambia de direccion rapido." },
  { key: "tiro", name: "Tiro", desc: "Dispara con precision al arco o aro." },
  { key: "pase", name: "Pase", desc: "Pase preciso al companero. Interior del pie o mano." },
  { key: "regate", name: "Regate", desc: "Desplazate con el balon, cambia de ritmo y direccion." },
  { key: "remate", name: "Remate de Cabeza", desc: "Golpea el balon con la frente, mira el balon." },
  { key: "defensa_fut", name: "Defensa Futbol", desc: "Posicionate entre el rival y tu arco." },
  { key: "natacion", name: "Natacion", desc: "Brazada de crol, respiracion lateral. Cuerpo alineado." },
  { key: "ciclismo", name: "Ciclismo", desc: "Pedaleo constante, postura erguida, ritmo controlado." },
  { key: "patada", name: "Patada", desc: "Golpea con la canilla o empenine. Cadera hacia adelante." },
  { key: "puno", name: "Punetazo", desc: "Golpe directo con el puño cerrado, cadera rotando." },
  { key: "codazo", name: "Codazo", desc: "Golpe lateral con el codo, corta distancia." },
  { key: "rodillazo", name: "Rodillazo", desc: "Rodilla hacia arriba, agarre imaginario del rival." }
];

var SPORTS = {
  boxeo: {
    name: "BOXEO",
    icon: "\uD83E\uDD4A",
    desc: "Sombras, golpes, defensa",
    routines: ["fundamentos", "combinaciones", "defensa_r", "acondicionamiento", "completa"]
  },
  futbol: {
    name: "FUTBOL",
    icon: "\u26BD",
    desc: "Drible, tiro, pase, regate",
    routines: ["fut_tecnica", "fut_fisico", "fut_completa"]
  },
  basquet: {
    name: "BASQUET",
    icon: "\uD83C\uDFC0",
    desc: "Drible, tiro, defensa, agilidad",
    routines: ["basq_tecnica", "basq_fisico", "basq_completa"]
  },
  natacion: {
    name: "NATACION",
    icon: "\uD83C\uDFCA",
    desc: "Tecnica, resistencia, velocidad",
    routines: ["nat_tecnica", "nat_resistencia"]
  },
  artes_marciales: {
    name: "ARTES MARCIALES",
    icon: "\uD83E\uDD4B",
    desc: "Patadas, punos, codazos, rodillazos",
    routines: ["am_tecnica", "am_fisico", "am_completa"]
  },
  ciclismo: {
    name: "CICLISMO",
    icon: "\uD83D\uDEB4",
    desc: "Resistencia, sprints, colinas",
    routines: ["cic_resistencia", "cic_sprints"]
  }
};

var ROUTINES = {
  fundamentos: {
    name: "FUNDAMENTOS",
    sport: "boxeo",
    emoji: "\uD83C\uDF93",
    desc: "Base: guardia, golpes, defensa y juego de pies.",
    blocks: [
      { name: "Posicion de Guardia", type: "guardia", dur: 45, rest: 15, cue: "Manos arriba, barbilla baja." },
      { name: "Jab", type: "jab", dur: 60, rest: 15, cue: "Jabs rapidos al frente." },
      { name: "Directo de Derecha", type: "cross", dur: 60, rest: 15, cue: "Gira cadera y hombro." },
      { name: "Gancho", type: "hook", dur: 60, rest: 15, cue: "Gancho corto con rotacion." },
      { name: "Uppercut", type: "uppercut", dur: 60, rest: 15, cue: "Sube el puno desde abajo." },
      { name: "Defensa", type: "defensa", dur: 60, rest: 15, cue: "Cubre cabeza y torso." },
      { name: "Esquiva", type: "bob", dur: 60, rest: 15, cue: "Agachate y muévete en zigzag." },
      { name: "Juego de Pies", type: "footwork", dur: 60, rest: 15, cue: "Pasos cortos y rapidos." },
      { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respira profundo." }
    ]
  },
  combinaciones: {
    name: "COMBINACIONES",
    sport: "boxeo",
    emoji: "\uD83D\uDD25",
    desc: "Encadena golpes con ritmo.",
    blocks: [
      { name: "1-2 (Jab + Cross)", type: "cross", dur: 60, rest: 20, cue: "Jab + cross." },
      { name: "1-2-3 (Jab + Cross + Gancho)", type: "hook", dur: 60, rest: 20, cue: "Jab, cross, gancho." },
      { name: "1-1-2 (Doble Jab + Cross)", type: "cross", dur: 60, rest: 20, cue: "Doble jab + cross." },
      { name: "3-2 (Gancho + Cross)", type: "hook", dur: 60, rest: 20, cue: "Gancho + cross." },
      { name: "1-2-5-2 (Uppercut)", type: "uppercut", dur: 60, rest: 20, cue: "Jab, cross, uppercut, cross." },
      { name: "5-6 (Doble Uppercut)", type: "uppercut", dur: 60, rest: 20, cue: "Uppercut izq + der." },
      { name: "1-2-3-2-1 (Clasico)", type: "cross", dur: 60, rest: 20, cue: "Jab, cross, gancho, cross, jab." },
      { name: "Combo Libre", type: "jab", dur: 60, rest: 20, cue: "Combina todo a maxima velocidad." },
      { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respira y relaja." }
    ]
  },
  defensa_r: {
    name: "DEFENSA",
    sport: "boxeo",
    emoji: "\uD83D\uDEE1\uFE0F",
    desc: "Bloqueos, esquivas y contraataques.",
    blocks: [
      { name: "Cobertura Alta", type: "defensa", dur: 60, rest: 20, cue: "Guantes pegados a la cara." },
      { name: "Esquiva Lateral", type: "bob", dur: 60, rest: 20, cue: "Desplazate de lado." },
      { name: "Bloqueo + Jab", type: "jab", dur: 60, rest: 20, cue: "Bloquea y responde con jab." },
      { name: "Retroceso + 1-2", type: "cross", dur: 60, rest: 20, cue: "Retrocede y contraataca." },
      { name: "Circulo de Pies", type: "footwork", dur: 60, rest: 20, cue: "Rodea al rival imaginario." },
      { name: "Simulacion de Combate", type: "guardia", dur: 60, rest: 20, cue: "Defiende y contraataca." },
      { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respira hondo." }
    ]
  },
  acondicionamiento: {
    name: "ACONDICIONAMIENTO",
    sport: "boxeo",
    emoji: "\u26A1",
    desc: "Rondas intensas: explosividad y resistencia.",
    blocks: [
      { name: "Calentamiento", type: "guardia", dur: 120, rest: 10, cue: "Trote en el sitio." },
      { name: "Ronda 1 - Jabs", type: "jab", dur: 40, rest: 20, cue: "Jabs sin parar." },
      { name: "Ronda 2 - Combos", type: "cross", dur: 40, rest: 20, cue: "1-2-3 a toda potencia." },
      { name: "Ronda 3 - Agachadas", type: "bob", dur: 40, rest: 20, cue: "Bob & weave intenso." },
      { name: "Ronda 4 - Poder", type: "hook", dur: 40, rest: 20, cue: "Ganchos y uppercuts." },
      { name: "Ronda 5 - Pies", type: "footwork", dur: 40, rest: 20, cue: "Muévete rapido." },
      { name: "Ronda 6 - Defensa", type: "defensa", dur: 40, rest: 20, cue: "Cubre y contraataca." },
      { name: "Ronda 7 - Doble ritmo", type: "jab", dur: 40, rest: 20, cue: "Jabs dobles." },
      { name: "Ronda 8 - Todo", type: "uppercut", dur: 40, rest: 20, cue: "Combina sin parar." },
      { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Camina y estira." }
    ]
  },
  completa: {
    name: "RUTINA COMPLETA",
    sport: "boxeo",
    emoji: "\uD83D\uDCAF",
    desc: "Calentamiento + tecnica + combos + intensidad.",
    blocks: [
      { name: "Calentamiento", type: "guardia", dur: 120, rest: 10, cue: "Trote, brazos en movimiento." },
      { name: "Posicion de Guardia", type: "guardia", dur: 45, rest: 15, cue: "Ajusta tu postura." },
      { name: "Jab", type: "jab", dur: 60, rest: 15, cue: "Jabs rapidos." },
      { name: "Cross", type: "cross", dur: 60, rest: 15, cue: "Cross de potencia." },
      { name: "Gancho + Uppercut", type: "hook", dur: 60, rest: 15, cue: "Alterna ganchos y uppercuts." },
      { name: "Defensa", type: "defensa", dur: 60, rest: 15, cue: "Cobertura y esquivas." },
      { name: "Combo 1-2-3", type: "cross", dur: 60, rest: 15, cue: "Jab + cross + gancho." },
      { name: "Ronda Intensa", type: "uppercut", dur: 40, rest: 20, cue: "Maxima velocidad." },
      { name: "Ronda Intensa 2", type: "bob", dur: 40, rest: 20, cue: "Esquivas + contraataque." },
      { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respira y estira." }
    ]
  },
  fut_tecnica: {
    name: "TECNICA FUTBOL",
    sport: "futbol",
    emoji: "\u26BD",
    desc: "Drible, pase, tiro y regate.",
    blocks: [
      { name: "Calentamiento", type: "footwork", dur: 120, rest: 10, cue: "Trote con balon imaginario." },
      { name: "Dribbling Basico", type: "dribble", dur: 60, rest: 15, cue: "Toques cortos, cabeza arriba." },
      { name: "Cambio de Ritmo", type: "regate", dur: 60, rest: 15, cue: "Acelera y frena entre conos." },
      { name: "Pase Corto", type: "pase", dur: 60, rest: 15, cue: "Pase interior, follow-through." },
      { name: "Pase Largo", type: "pase", dur: 60, rest: 15, cue: "Empeine, bola con efecto." },
      { name: "Tiro a Gol", type: "tiro", dur: 60, rest: 15, cue: "Dispara con potencia." },
      { name: "Regate 1v1", type: "regate", dur: 60, rest: 15, cue: "Supera al rival imaginario." },
      { name: "Remate de Cabeza", type: "remate", dur: 60, rest: 15, cue: "Golpea con la frente." },
      { name: "Enfriamiento", type: "footwork", dur: 90, rest: 0, cue: "Caminar y estirar." }
    ]
  },
  fut_fisico: {
    name: "FISICO FUTBOL",
    sport: "futbol",
    emoji: "\uD83D\uDCAA",
    desc: "Velocidad, resistencia y agilidad.",
    blocks: [
      { name: "Trote", type: "footwork", dur: 180, rest: 15, cue: "Ritmo constante." },
      { name: "Sprint 30m x6", type: "footwork", dur: 30, rest: 30, cue: "Explosivo, rodillas arriba." },
      { name: "Cambio de Direccion", type: "regate", dur: 45, rest: 20, cue: "Gira rapido." },
      { name: "Saltos de Valla", type: "footwork", dur: 45, rest: 20, cue: "Salta y aterriza suave." },
      { name: "Defensa Posicional", type: "defensa_fut", dur: 60, rest: 15, cue: "Posicionate y lee el juego." },
      { name: "Resistencia", type: "footwork", dur: 180, rest: 15, cue: "Manten el ritmo." },
      { name: "Enfriamiento", type: "footwork", dur: 120, rest: 0, cue: "Caminar y estirar." }
    ]
  },
  fut_completa: {
    name: "COMPLETA FUTBOL",
    sport: "futbol",
    emoji: "\uD83C\uDFC6",
    desc: "Tecnica + fisico + tactica.",
    blocks: [
      { name: "Calentamiento", type: "footwork", dur: 120, rest: 10, cue: "Trote y movilidad." },
      { name: "Dribbling", type: "dribble", dur: 60, rest: 15, cue: "Toques rapidos." },
      { name: "Pase y Control", type: "pase", dur: 60, rest: 15, cue: "Primer toque perfecto." },
      { name: "Regate", type: "regate", dur: 60, rest: 15, cue: "Cambia de ritmo." },
      { name: "Tiro", type: "tiro", dur: 60, rest: 15, cue: "Dispara fuerte." },
      { name: "Defensa", type: "defensa_fut", dur: 60, rest: 15, cue: "Marca y roba." },
      { name: "Sprint Final", type: "footwork", dur: 30, rest: 15, cue: "Todo o nada." },
      { name: "Enfriamiento", type: "footwork", dur: 120, rest: 0, cue: "Relaja el cuerpo." }
    ]
  },
  basq_tecnica: {
    name: "TECNICA BASQUET",
    sport: "basquet",
    emoji: "\uD83C\uDFC0",
    desc: "Drible, tiro, pase y agilidad.",
    blocks: [
      { name: "Calentamiento", type: "dribble", dur: 120, rest: 10, cue: "Dribbling suave." },
      { name: "Dribble Derecha", type: "dribble", dur: 60, rest: 15, cue: "Solo mano derecha." },
      { name: "Dribble Izquierda", type: "dribble", dur: 60, rest: 15, cue: "Solo mano izquierda." },
      { name: "Crossover", type: "regate", dur: 60, rest: 15, cue: "Cruza el balon rapido." },
      { name: "Tiro Libre", type: "tiro", dur: 60, rest: 15, cue: "Forma de L, follow-through." },
      { name: "Tiro en Movimiento", type: "tiro", dur: 60, rest: 15, cue: "Un dribble y tira." },
      { name: "Pase de Pecho", type: "pase", dur: 60, rest: 15, cue: "Pase fuerte al pecho." },
      { name: "Layup Derecha", type: "tiro", dur: 60, rest: 15, cue: "2 pasos y layup suave." },
      { name: "Enfriamiento", type: "dribble", dur: 90, rest: 0, cue: "Dribbling suave, respira." }
    ]
  },
  basq_fisico: {
    name: "FISICO BASQUET",
    sport: "basquet",
    emoji: "\uD83D\uDCAA",
    desc: "Explosividad, agilidad y resistencia.",
    blocks: [
      { name: "Trote", type: "dribble", dur: 120, rest: 10, cue: "Trote con dribbling." },
      { name: "Suicides x6", type: "footwork", dur: 20, rest: 30, cue: "Carrera ida y vuelta." },
      { name: "Defensive Slides", type: "defensa_fut", dur: 45, rest: 15, cue: "Deslizate lateral." },
      { name: "Jump Squats", type: "bob", dur: 40, rest: 20, cue: "Salta desde sentadilla." },
      { name: "Burpees", type: "footwork", dur: 40, rest: 20, cue: "Abajo, salta, arriba." },
      { name: "Sprint Cortos", type: "footwork", dur: 15, rest: 30, cue: "Explosivo." },
      { name: "Dribble Sprint", type: "dribble", dur: 30, rest: 20, cue: "Dribbling rapido en carrera." },
      { name: "Enfriamiento", type: "dribble", dur: 120, rest: 0, cue: "Caminar y estirar." }
    ]
  },
  basq_completa: {
    name: "COMPLETA BASQUET",
    sport: "basquet",
    emoji: "\uD83C\uDFC6",
    desc: "Tecnica + fisico completo.",
    blocks: [
      { name: "Calentamiento", type: "dribble", dur: 120, rest: 10, cue: "Dribbling y movilidad." },
      { name: "Dribble Basico", type: "dribble", dur: 60, rest: 15, cue: "Cambios de mano." },
      { name: "Crossover + Tiro", type: "regate", dur: 60, rest: 15, cue: "Regate y tira." },
      { name: "Layup Izq", type: "tiro", dur: 60, rest: 15, cue: "Layup mano izquierda." },
      { name: "Defensa", type: "defensa_fut", dur: 60, rest: 15, cue: "Defiende agachado." },
      { name: "Suicides", type: "footwork", dur: 20, rest: 30, cue: "Velocidad pura." },
      { name: "Tiro Libre", type: "tiro", dur: 60, rest: 0, cue: "Calma y precision." },
      { name: "Enfriamiento", type: "dribble", dur: 90, rest: 0, cue: "Relaja." }
    ]
  },
  nat_tecnica: {
    name: "TECNICA NATACION",
    sport: "natacion",
    emoji: "\uD83C\uDFCA",
    desc: "Brazada, patada, respiracion.",
    blocks: [
      { name: "Patada con Tabla", type: "natacion", dur: 120, rest: 15, cue: "Piernas constantes." },
      { name: "Brazada Un Brazo", type: "natacion", dur: 60, rest: 15, cue: "Solo brazo derecho." },
      { name: "Brazada Un Brazo Izq", type: "natacion", dur: 60, rest: 15, cue: "Solo brazo izquierdo." },
      { name: "Respiracion Lateral", type: "natacion", dur: 90, rest: 15, cue: "Gira la cabeza." },
      { name: "Crol Completo", type: "natacion", dur: 120, rest: 20, cue: "Brazada + patada + respiracion." },
      { name: "Pull Buoys", type: "natacion", dur: 90, rest: 15, cue: "Solo brazada." },
      { name: "Enfriamiento", type: "natacion", dur: 120, rest: 0, cue: "Nado suave." }
    ]
  },
  nat_resistencia: {
    name: "RESISTENCIA NATACION",
    sport: "natacion",
    emoji: "\u23F1\uFE0F",
    desc: "Series de resistencia acuatica.",
    blocks: [
      { name: "Calentamiento", type: "natacion", dur: 180, rest: 15, cue: "Nado suave." },
      { name: "4x100m", type: "natacion", dur: 120, rest: 30, cue: "Ritmo constante." },
      { name: "8x50m", type: "natacion", dur: 60, rest: 20, cue: "50m fuerte." },
      { name: "4x100m Piernas", type: "natacion", dur: 120, rest: 30, cue: "Solo patada." },
      { name: "200m Mezcla", type: "natacion", dur: 240, rest: 30, cue: "200m continuo." },
      { name: "Enfriamiento", type: "natacion", dur: 180, rest: 0, cue: "Nado muy suave." }
    ]
  },
  am_tecnica: {
    name: "TECNICA AM",
    sport: "artes_marciales",
    emoji: "\uD83E\uDD4B",
    desc: "Patadas, punos, codos, rodillas.",
    blocks: [
      { name: "Calentamiento", type: "guardia", dur: 120, rest: 10, cue: "Movilidad articular." },
      { name: "Patada Frontal", type: "patada", dur: 60, rest: 15, cue: "Patada frontal, empenine." },
      { name: "Patada Lateral", type: "patada", dur: 60, rest: 15, cue: "Patada lateral, cadera." },
      { name: "Patada Rotando", type: "patada", dur: 60, rest: 15, cue: "Gira y golpea." },
      { name: "Punetazo Directo", type: "puno", dur: 60, rest: 15, cue: "Directo con cadera." },
      { name: "Jab + Cross", type: "cross", dur: 60, rest: 15, cue: "Combinacion de punos." },
      { name: "Codazo Lateral", type: "codazo", dur: 60, rest: 15, cue: "Codo a la cara." },
      { name: "Rodillazo", type: "rodillazo", dur: 60, rest: 15, cue: "Rodilla arriba." },
      { name: "Combo Completo", type: "hook", dur: 60, rest: 0, cue: "Puno + codo + rodilla + patada." },
      { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respira y estira." }
    ]
  },
  am_fisico: {
    name: "FISICO AM",
    sport: "artes_marciales",
    emoji: "\uD83D\uDCAA",
    desc: "Potencia, resistencia y explosividad.",
    blocks: [
      { name: "Trote", type: "footwork", dur: 120, rest: 10, cue: "Trote ligero." },
      { name: "Sentadillas + Patada", type: "patada", dur: 45, rest: 15, cue: "Sentadilla y patada." },
      { name: "Burpees + Punetazo", type: "puno", dur: 45, rest: 15, cue: "Burpee y golpe." },
      { name: "Rodillazos x20", type: "rodillazo", dur: 40, rest: 20, cue: "Alternando rodillas." },
      { name: "Plancha + Golpe", type: "defensa", dur: 40, rest: 20, cue: "En plancha, golpea." },
      { name: "Mountain Climbers", type: "footwork", dur: 40, rest: 20, cue: "Rodillas al pecho." },
      { name: "Combate Libre", type: "hook", dur: 60, rest: 0, cue: "Todo lo que sepas." },
      { name: "Enfriamiento", type: "guardia", dur: 120, rest: 0, cue: "Estira todo." }
    ]
  },
  am_completa: {
    name: "COMPLETA AM",
    sport: "artes_marciales",
    emoji: "\uD83C\uDFC6",
    desc: "Tecnica + fisico completo.",
    blocks: [
      { name: "Calentamiento", type: "guardia", dur: 120, rest: 10, cue: "Movilidad y sombra ligera." },
      { name: "Patadas Frontales", type: "patada", dur: 60, rest: 15, cue: "Patada recta." },
      { name: "Punetazos", type: "puno", dur: 60, rest: 15, cue: "Jab + cross fuerte." },
      { name: "Codazos", type: "codazo", dur: 60, rest: 15, cue: "Codos cortantes." },
      { name: "Rodillazos", type: "rodillazo", dur: 60, rest: 15, cue: "Rodilla al pecho." },
      { name: "Patada Giratoria", type: "patada", dur: 60, rest: 15, cue: "Gira y golpea." },
      { name: "Combo Libre", type: "hook", dur: 60, rest: 0, cue: "Libera todo." },
      { name: "Enfriamiento", type: "guardia", dur: 120, rest: 0, cue: "Respira y estira." }
    ]
  },
  cic_resistencia: {
    name: "RESISTENCIA",
    sport: "ciclismo",
    emoji: "\uD83D\uDEB4",
    desc: "Ritmo constante y resistencia.",
    blocks: [
      { name: "Calentamiento", type: "ciclismo", dur: 180, rest: 10, cue: "Pedaleo suave." },
      { name: "Ritmo Medio", type: "ciclismo", dur: 300, rest: 20, cue: "75-80 rpm, constante." },
      { name: "Subida", type: "ciclismo", dur: 120, rest: 30, cue: "Resistencia alta." },
      { name: "Ritmo Medio", type: "ciclismo", dur: 300, rest: 20, cue: "Vuelve al ritmo." },
      { name: "Bajada", type: "ciclismo", dur: 120, rest: 10, cue: "Pedaleo suave." },
      { name: "Ritmo Fuerte", type: "ciclismo", dur: 180, rest: 20, cue: "85+ rpm." },
      { name: "Enfriamiento", type: "ciclismo", dur: 180, rest: 0, cue: "Pedaleo muy suave." }
    ]
  },
  cic_sprints: {
    name: "SPRINTS",
    sport: "ciclismo",
    emoji: "\u26A1",
    desc: "Intervalos de velocidad pura.",
    blocks: [
      { name: "Calentamiento", type: "ciclismo", dur: 180, rest: 10, cue: "Pedaleo progresivo." },
      { name: "Sprint 20s", type: "ciclismo", dur: 20, rest: 40, cue: "Maximo esfuerzo." },
      { name: "Sprint 20s", type: "ciclismo", dur: 20, rest: 40, cue: "Otra vez, fuerte." },
      { name: "Sprint 30s", type: "ciclismo", dur: 30, rest: 60, cue: "30s a tope." },
      { name: "Sprint 20s", type: "ciclismo", dur: 20, rest: 40, cue: "Rapido." },
      { name: "Sprint 30s", type: "ciclismo", dur: 30, rest: 60, cue: "Ultimo sprint fuerte." },
      { name: "Recuperacion", type: "ciclismo", dur: 180, rest: 0, cue: "Pedaleo suave." }
    ]
  }
};

var MODO_GUERRA = {
  lema: "DISCIPLINA HOY, LIBERTAD MANANA",
  despertar: "7:00",
  dormir: "22:30",
  plan: {
    lunes:    { emoji: "\uD83D\uDCAA", ab: 20, fl: 10, ss: 20, pl: 30, mc: 20, cu: 1, jj: 30, sl: 20 },
    martes:   { emoji: "\uD83D\uDD25", ab: 30, fl: 15, ss: 30, pl: 40, mc: 30, cu: 2, jj: 40, sl: 30 },
    miercoles:{ emoji: "\u26A1", ab: 40, fl: 20, ss: 40, pl: 50, mc: 30, cu: 3, jj: 50, sl: 40 },
    jueves:   { emoji: "\uD83D\uDCA5", ab: 30, fl: 15, ss: 30, pl: 40, mc: 30, cu: 2, jj: 40, sl: 30 },
    viernes:  { emoji: "\uD83C\uDFC6", ab: 50, fl: 20, ss: 50, pl: 60, mc: 50, cu: 4, jj: 50, sl: 45 },
    sabado:   { emoji: "\uD83C\uDFC3", trote: true, desc: "Trote suave, 30 minutos" },
    domingo:  { emoji: "\uD83D\uDE0C", descanso: true, desc: "Descanso activo" }
  }
};

var SCHEDULE_DEFAULTS = (function () {
  var semana = [
    { t: "7:00", title: "Despertar", emoji: "\uD83C\uDF05", desc: "Tender la cama, tomar agua." },
    { t: "7:10", title: "Activacion", emoji: "\uD83E\uDDD8", desc: "Estiramientos 10 min, respiracion 5 min." },
    { t: "7:25", title: "Cardio", emoji: "\uD83C\uDFC3", desc: "Caminar o trotar 15 min." },
    { t: "8:30", title: "Entrenamiento", emoji: "\uD83D\uDCAA", desc: "Segun el plan del dia." },
    { t: "8:45", title: "Ducha", emoji: "\uD83D\uDEBF", desc: "Refrescarse." },
    { t: "9:00", title: "Desayuno", emoji: "\uD83C\uDF73", desc: "Vestirse, preparar mochila." },
    { t: "11:00", title: "Almuerzo", emoji: "\uD83E\uDD57", desc: "Almuerzo saludable." },
    { t: "12:00", title: "Descanso", emoji: "\uD83D\uDE0C", desc: "Desconexion breve." },
    { t: "12:30", title: "Escuela", emoji: "\uD83C\uDFEB", desc: "Salir con tiempo." },
    { t: "13:00", title: "Clases", emoji: "\uD83C\uDFEB", desc: "Atencion y enfoque 100%.", until: "18:00" },
    { t: "18:00", title: "Llego a casa", emoji: "\uD83C\uDFE0", desc: "Descanso breve, hidratarse." },
    { t: "18:30", title: "Tiempo libre", emoji: "\uD83C\uDFAE", desc: "Relajarse, musica." },
    { t: "19:00", title: "Estudiar", emoji: "\uD83D\uDCDA", desc: "Tareas, leer, aprender." },
    { t: "20:00", title: "Proyecto", emoji: "\uD83D\uDEE0", desc: "Crear contenido." },
    { t: "21:00", title: "Finanzas", emoji: "\uD83D\uDCB8", desc: "Registrar gastos." },
    { t: "21:30", title: "Organizar", emoji: "\uD83D\uDDC2", desc: "Limpiar, preparar ropa." },
    { t: "22:00", title: "Habitos", emoji: "\u2705", desc: "Tracker, musica, sin pantallas." },
    { t: "22:15", title: "Dormir", emoji: "\uD83D\uDE34", desc: "Descansar 8h30min." }
  ];
  var sabado = [
    { t: "7:00", title: "Despertar", emoji: "\uD83C\uDF05", desc: "Tender la cama." },
    { t: "7:10", title: "Activacion", emoji: "\uD83E\uDDD8", desc: "Estiramientos y respiracion." },
    { t: "7:25", title: "Cardio", emoji: "\uD83C\uDFC3", desc: "Trote suave 20 min." },
    { t: "8:30", title: "Entrenamiento", emoji: "\uD83D\uDCAA", desc: "Trote + sombra." },
    { t: "8:45", title: "Ducha", emoji: "\uD83D\uDEBF", desc: "Refrescarse." },
    { t: "9:00", title: "Desayuno", emoji: "\uD83C\uDF73", desc: "Sin prisa." },
    { t: "10:00", title: "Tareas casa", emoji: "\uD83E\uDDF9", desc: "Lavar ropa, limpiar." },
    { t: "12:00", title: "Proyecto", emoji: "\uD83D\uDEE0", desc: "Crear contenido." },
    { t: "13:00", title: "Almuerzo", emoji: "\uD83E\uDD57", desc: "Almuerzo saludable." },
    { t: "14:00", title: "Tiempo libre", emoji: "\uD83C\uDFAE", desc: "Amigos, jugar." },
    { t: "16:00", title: "Crear", emoji: "\uD83C\uDFA8", desc: "Edicion, diseño." },
    { t: "18:00", title: "Descanso", emoji: "\uD83C\uDFB5", desc: "Musica, relajarse." },
    { t: "19:00", title: "Estudiar", emoji: "\uD83D\uDCDA", desc: "Leer o aprender." },
    { t: "20:00", title: "Finanzas", emoji: "\uD83D\uDCB8", desc: "Registrar gastos." },
    { t: "21:00", title: "Organizar", emoji: "\uD83D\uDDC2", desc: "Preparar la semana." },
    { t: "22:00", title: "Habitos", emoji: "\u2705", desc: "Tracker y relajacion." },
    { t: "22:30", title: "Dormir", emoji: "\uD83D\uDE34", desc: "Recuperar." }
  ];
  var domingo = [
    { t: "7:00", title: "Despertar", emoji: "\uD83C\uDF05", desc: "Tender la cama." },
    { t: "7:15", title: "Prepararse", emoji: "\uD83E\uDEE9", desc: "Arreglarse para iglesia." },
    { t: "8:00", title: "Iglesia", emoji: "\u26EA", desc: "Servicio.", until: "11:00" },
    { t: "11:00", title: "Almuerzo familiar", emoji: "\uD83C\uDF73", desc: "Comer con la familia." },
    { t: "12:30", title: "Descanso activo", emoji: "\uD83D\uDEB6", desc: "Caminar, estirar." },
    { t: "14:00", title: "Tiempo libre", emoji: "\uD83C\uDFAE", desc: "Relajarse." },
    { t: "16:00", title: "Lectura", emoji: "\uD83D\uDCD6", desc: "Leer o repasar." },
    { t: "17:30", title: "Preparar semana", emoji: "\uD83D\uDDC2", desc: "Ropa, utes, plan." },
    { t: "19:00", title: "Estudiar", emoji: "\uD83D\uDCDA", desc: "Aprender algo nuevo." },
    { t: "20:30", title: "Finanzas", emoji: "\uD83D\uDCB8", desc: "Revisar la semana." },
    { t: "21:30", title: "Relajacion", emoji: "\uD83D\uDE0C", desc: "Sin pantallas." },
    { t: "22:00", title: "Dormir", emoji: "\uD83D\uDE34", desc: "Prepararse." }
  ];
  var o = {};
  ["lunes", "martes", "miercoles", "jueves", "viernes"].forEach(function (k) {
    o[k] = semana.map(function (x) { return Object.assign({}, x); });
  });
  o.sabado = sabado;
  o.domingo = domingo;
  return o;
})();

function loadScheduleStore() {
  try { return JSON.parse(localStorage.getItem("mg_schedule") || "{}"); } catch (e) { return {}; }
}

function getDaySchedule(dayKey) {
  var store = loadScheduleStore();
  var d = store[dayKey];
  return (d && d.length) ? d : (SCHEDULE_DEFAULTS[dayKey] || []);
}

function getEditableSchedule(dayKey) {
  var store = loadScheduleStore();
  if (!store[dayKey] || !store[dayKey].length) {
    store[dayKey] = getDaySchedule(dayKey).map(function (x) { return Object.assign({}, x); });
    localStorage.setItem("mg_schedule", JSON.stringify(store));
  }
  return store[dayKey];
}

function toTimeInput(t) {
  if (!t) return "";
  var p = String(t).split(":");
  return ("0" + (+p[0])).slice(-2) + ":" + (p[1] || "00");
}

function escHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function militaryBlocks(dayKey) {
  var d = MODO_GUERRA.plan[dayKey];
  var B = function (name, type, dur, rest, cue) { return { name: name, type: type, dur: dur, rest: rest, cue: cue }; };
  var out = [B("Activacion", "guardia", 120, 10, "Estiramientos y movilidad.")];
  if (d.trote) {
    out.push(B("Trote 10 min", "guardia", 600, 30, "Ritmo constante, respira."));
    out.push(B("Trote 10 min", "guardia", 600, 30, "Manten el ritmo."));
    out.push(B("Trote 10 min", "guardia", 600, 20, "Ultima parte."));
    out.push(B("Sombra Combos", "cross", 60, 20, "Jab + cross."));
    out.push(B("Sombra Esquivas", "bob", 60, 20, "Bob & weave."));
    out.push(B("Sombra Libre", "jab", 60, 0, "Combina todo."));
  } else if (d.descanso) {
    out.push(B("Caminar 15 min", "guardia", 900, 0, "Paso ligero."));
    out.push(B("Estiramientos", "guardia", 300, 0, "Estira todo."));
    out.push(B("Respiracion", "guardia", 300, 0, "Inhala 4s, exhala 6s."));
    return out;
  } else {
    out.push(B("Abdominales x" + d.ab, "guardia", 60, 20, "Contrae el abdomen."));
    out.push(B("Flexiones x" + d.fl, "guardia", 60, 20, "Cuerpo recto."));
    out.push(B("Sentadillas salto x" + d.ss, "guardia", 60, 20, "Explota arriba."));
    out.push(B("Plancha " + d.pl + "s", "guardia", d.pl, 30, "Firme, no bajes la cadera."));
    out.push(B("Mountain climbers x" + d.mc, "guardia", 60, 20, "Rodillas al pecho."));
    out.push(B("Cuerda " + d.cu + " min", "guardia", d.cu * 60, 20, "Ritmo constante."));
    out.push(B("Jumping jacks x" + d.jj, "guardia", 60, 20, "Abre y cierra."));
    out.push(B("Saltos laterales x" + d.sl, "guardia", 60, 20, "De lado a lado."));
    out.push(B("Sombra Combos", "cross", 60, 20, "Jab + cross."));
    out.push(B("Sombra Esquivas", "bob", 60, 20, "Bob & weave."));
    out.push(B("Sombra Libre", "jab", 60, 0, "Combina todo."));
  }
  return out;
}

var HABITS = [
  { key: "entrene",    label: "Entrene",                  emoji: "\uD83D\uDCAA" },
  { key: "estudie",    label: "Estudie",                  emoji: "\uD83D\uDCDA" },
  { key: "lei",        label: "Lei",                      emoji: "\uD83D\uDCD6" },
  { key: "ahorre",     label: "Ahorre",                   emoji: "\uD83D\uDCB0" },
  { key: "registre",   label: "Registre gastos",          emoji: "\uD83E\uDDFE" },
  { key: "nocompras",  label: "Sin compras impulsivas",   emoji: "\uD83D\uDEAB" },
  { key: "agua",       label: "Agua (2L)",                emoji: "\uD83D\uDCA7" },
  { key: "dormi",      label: "Dormi temprano",           emoji: "\uD83C\uDF19" },
  { key: "noprocrast", label: "Sin procrastinar",         emoji: "\u23F1\uFE0F" },
  { key: "aprendi",    label: "Aprendi algo nuevo",       emoji: "\uD83E\uDDE0" }
];

var GOALS = [
  { key: "pasos",     label: "10.000 pasos" },
  { key: "agua2",     label: "2 litros de agua" },
  { key: "leer15",    label: "Leer 15 paginas" },
  { key: "ahorrardin",label: "Ahorrar dinero" },
  { key: "registrar", label: "Registrar gastos" },
  { key: "noprocra2", label: "No procrastinar" },
  { key: "estudiar",  label: "Estudiar 2 horas" },
  { key: "cuarto",    label: "Cuarto limpio" },
  { key: "entrenar",  label: "Entrenar" },
  { key: "dormir",    label: "Dormir antes de 10:30" }
];

var RANKS = [
  { level: 1, name: "COBRE",    icon: "\uD83E\uDE99", min: 0,   color: "#cd7f32" },
  { level: 2, name: "HIERRO",   icon: "\u2699\uFE0F",  min: 30,  color: "#808080" },
  { level: 3, name: "ORO",      icon: "\uD83E\uDD47", min: 50,  color: "#ffd700" },
  { level: 4, name: "DIAMANTE", icon: "\uD83D\uDC8E", min: 70,  color: "#b9f2ff" },
  { level: 5, name: "NEMESIS",  icon: "\u2620\uFE0F",  min: 85,  color: "#ff1f1f" },
  { level: 6, name: "ARCH NEMESIS", icon: "\uD83D\uDD25", min: 95, color: "#ff4444" }
];

function getRankForPercent(pct) {
  var rank = RANKS[0];
  for (var i = RANKS.length - 1; i >= 0; i--) {
    if (pct >= RANKS[i].min) { rank = RANKS[i]; break; }
  }
  return rank;
}

function getNextRank(currentLevel) {
  for (var i = 0; i < RANKS.length; i++) {
    if (RANKS[i].level === currentLevel + 1) return RANKS[i];
  }
  return null;
}

function calcDisciplinePercent(startDate, endDate, habitsStore) {
  var total = 0, done = 0;
  var d = new Date(startDate);
  while (d <= endDate) {
    var dk = dateKey(d);
    var day = habitsStore[dk] || {};
    var dayTotal = HABITS.length;
    var dayDone = HABITS.filter(function (h) { return day[h.key]; }).length;
    total += dayTotal;
    done += dayDone;
    d.setDate(d.getDate() + 1);
  }
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

function fmtTime(sec) {
  sec = Math.max(0, Math.round(sec));
  var m = Math.floor(sec / 60);
  var s = sec % 60;
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

function buildSchedule(blocks) {
  var segs = [];
  var t = 0;
  blocks.forEach(function (b, bi) {
    segs.push({ kind: "work", bi: bi, name: b.name, type: b.type, dur: b.dur, cue: b.cue, start: t });
    t += b.dur;
    if (b.rest > 0) {
      segs.push({ kind: "rest", bi: bi, name: "Descanso", type: "rest", dur: b.rest, cue: "Descansa. Respira.", start: t });
      t += b.rest;
    }
  });
  return segs;
}

function dateKey(d) {
  d = d || new Date();
  var m = ("0" + (d.getMonth() + 1)).slice(-2);
  var dd = ("0" + d.getDate()).slice(-2);
  return d.getFullYear() + "-" + m + "-" + dd;
}
