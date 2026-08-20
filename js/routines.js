/* routines.js — Shadow Box: rutinas, deportes, disciplina */

// ═══════════════════════════════════════════════════════════════════
//  TECHNIQUES
// ═══════════════════════════════════════════════════════════════════

var TECHNIQUES = [
  { key: "guardia", name: "Posicion de Guardia", desc: "Postura base de combate" },
  { key: "jab", name: "Jab", desc: "Golpe rapido con mano delantera" },
  { key: "cross", name: "Directo de Derecha", desc: "Golpe de poder con mano trasera" },
  { key: "hook", name: "Gancho (Hook)", desc: "Gancho lateral" },
  { key: "uppercut", name: "Uppercut", desc: "Golpe ascendente" },
  { key: "defensa", name: "Defensa / Cobertura", desc: "Bloqueo y cobertura" },
  { key: "bob", name: "Esquiva (Bob & Weave)", desc: "Esquivar agachandose en zigzag" },
  { key: "footwork", name: "Juego de Pies", desc: "Movimiento de pies" },
  { key: "dribble", name: "Drible", desc: "Driblar balon en basket/futbol" },
  { key: "tiro", name: "Tiro", desc: "Disparo a porteria o aro" },
  { key: "pase", name: "Pase", desc: "Pase del balon" },
  { key: "regate", name: "Regate", desc: "Regatear al rival" },
  { key: "remate", name: "Remate de Cabeza", desc: "Remate de cabeza en futbol" },
  { key: "defensa_fut", name: "Defensa Futbol", desc: "Defensa en futbol" },
  { key: "natacion", name: "Natacion", desc: "Nado de piscina" },
  { key: "ciclismo", name: "Ciclismo", desc: "Pedaleo en bicicleta" },
  { key: "patada", name: "Patada", desc: "Patada de artes marciales" },
  { key: "puno", name: "Punetazo", desc: "Punetazo de artes marciales" },
  { key: "codazo", name: "Codazo", desc: "Golpe de codo" },
  { key: "rodillazo", name: "Rodillazo", desc: "Golpe de rodilla" }
];

// ═══════════════════════════════════════════════════════════════════
//  SPORTS
// ═══════════════════════════════════════════════════════════════════

var SPORTS = {
  boxeo: {
    name: "Boxeo",
    icon: "\uD83E\uDD4A",
    desc: "Entrenamiento de boxeo",
    routines: ["fundamentos", "combinaciones", "defensa", "acondicionamiento", "completa"]
  },
  futbol: {
    name: "Futbol",
    icon: "\u26BD",
    desc: "Entrenamiento de futbol",
    routines: ["fut_tecnica", "fut_fisico", "fut_completa"]
  },
  basquet: {
    name: "Basquetbol",
    icon: "\uD83C\uDFC0",
    desc: "Entrenamiento de basquetbol",
    routines: ["basq_tecnica", "basq_fisico", "basq_completa"]
  },
  natacion: {
    name: "Natacion",
    icon: "\uD83C\uDFCA",
    desc: "Entrenamiento de natacion",
    routines: ["nat_tecnica", "nat_resistencia"]
  },
  artes_marciales: {
    name: "Artes Marciales",
    icon: "\uD83E\uDD4B",
    desc: "Entrenamiento de artes marciales",
    routines: ["am_tecnica", "am_fisico", "am_completa"]
  },
  ciclismo: {
    name: "Ciclismo",
    icon: "\uD83D\uDEB4",
    desc: "Entrenamiento de ciclismo",
    routines: ["cic_resistencia", "cic_sprints"]
  }
};

// ═══════════════════════════════════════════════════════════════════
//  ROUTINES
// ═══════════════════════════════════════════════════════════════════

var ROUTINES = {

  // ─── BOXEO ─────────────────────────────────────────────────────

  boxeo: {

    fundamentos: {
      name: "Fundamentos de Boxeo",
      sport: "boxeo",
      emoji: "\uD83E\uDD4A",
      desc: "Aprende y perfecciona cada golpe y movimiento base",
      blocks: [
        { name: "Guardia Base", type: "guardia", dur: 45, rest: 15, cue: "Manos arriba, barbilla abajo, codos pegados" },
        { name: "Jab", type: "jab", dur: 60, rest: 15, cue: "Extiende rapido y vuelve a la cara" },
        { name: "Directo de Derecha", type: "cross", dur: 60, rest: 15, cue: "Gira la cadera, golpea fuerte" },
        { name: "Gancho", type: "hook", dur: 60, rest: 15, cue: "Codo alineado, gira el torso" },
        { name: "Uppercut", type: "uppercut", dur: 60, rest: 15, cue: "Sube con las piernas, no solo brazos" },
        { name: "Defensa", type: "defensa", dur: 60, rest: 15, cue: "Cubrir bien la cara, cerrar codos" },
        { name: "Bob & Weave", type: "bob", dur: 60, rest: 15, cue: "Esquivar con piernas, no espalda" },
        { name: "Juego de Pies", type: "footwork", dur: 60, rest: 15, cue: "Ligero, nunca plantar los pies" },
        { name: "Guardia - Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respirar profundo, mantener postura" }
      ]
    },

    combinaciones: {
      name: "Combinaciones de Golpes",
      sport: "boxeo",
      emoji: "\uD83D\uDC4A",
      desc: "Combina golpes en secuencias fluidas",
      blocks: [
        { name: "1-2  Jab-Directo", type: "jab", dur: 60, rest: 20, cue: "Fluidez, uno tras otro sin pausa" },
        { name: "1-2-3  Jab-Directo-Gancho", type: "hook", dur: 60, rest: 20, cue: "Cadena los tres golpes con giro" },
        { name: "1-1-2  Jab-Jab-Directo", type: "jab", dur: 60, rest: 20, cue: "Doble jab para abrir la guardia" },
        { name: "3-2  Gancho-Directo", type: "cross", dur: 60, rest: 20, cue: "Gancho lateral seguido de directo" },
        { name: "1-2-5-2  Jab-Directo-Uppercut-Directo", type: "uppercut", dur: 60, rest: 20, cue: "Combinacion larga, mantener ritmo" },
        { name: "5-6  Uppercut-Uppercut", type: "uppercut", dur: 60, rest: 20, cue: "Uppercuts alternos, subir con piernas" },
        { name: "1-2-3-2-1  Completa", type: "hook", dur: 60, rest: 20, cue: "Combo largo, fluidez y potencia" },
        { name: "Combos Libres", type: "jab", dur: 60, rest: 20, cue: "Inventa tus propias combinaciones" },
        { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respirar, soltar tension, estirar" }
      ]
    },

    defensa: {
      name: "Defensa y Contragolpe",
      sport: "boxeo",
      emoji: "\uD83D\uDEE1\uFE0F",
      desc: "Bloqueos, esquivas y respuestas defensivas",
      blocks: [
        { name: "Cobertura", type: "defensa", dur: 60, rest: 20, cue: "Manos firmes protegiendo la cara" },
        { name: "Esquiva Lateral", type: "bob", dur: 60, rest: 20, cue: "Mover cabeza lateralmente con piernas" },
        { name: "Bloqueo + Jab", type: "defensa", dur: 60, rest: 20, cue: "Bloquear y responder con jab rapido" },
        { name: "Retroceso + 1-2", type: "footwork", dur: 60, rest: 20, cue: "Retroceder y contraatacar" },
        { name: "Circulo de Pies", type: "footwork", dur: 60, rest: 20, cue: "Circular manteniendo distancia" },
        { name: "Simulacion de Pelea", type: "defensa", dur: 60, rest: 20, cue: "Imagina un rival, reacciona" },
        { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respirar profundo, relajar" }
      ]
    },

    acondicionamiento: {
      name: "Acondicionamiento Fisico",
      sport: "boxeo",
      emoji: "\uD83D\uDCAA",
      desc: "8 rondas de alta intensidad para resistencia",
      blocks: [
        { name: "Calentamiento", type: "footwork", dur: 120, rest: 10, cue: "Activar cuerpo suavemente" },
        { name: "Ronda 1", type: "jab", dur: 40, rest: 20, cue: "Ritmo constante, sin parar" },
        { name: "Ronda 2", type: "cross", dur: 40, rest: 20, cue: "Golpes fuertes, respirar" },
        { name: "Ronda 3", type: "hook", dur: 40, rest: 20, cue: "Ganchos con potencia" },
        { name: "Ronda 4", type: "uppercut", dur: 40, rest: 20, cue: "Uppercuts rapidos" },
        { name: "Ronda 5", type: "jab", dur: 40, rest: 20, cue: "Velocidad y precision" },
        { name: "Ronda 6", type: "cross", dur: 40, rest: 20, cue: "Gira la cadera, golpea" },
        { name: "Ronda 7", type: "hook", dur: 40, rest: 20, cue: "Casi terminamos, dalo todo" },
        { name: "Ronda 8", type: "uppercut", dur: 40, rest: 20, cue: "Ultima ronda, intensidad maxima" },
        { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Bajar ritmo, respirar, estirar" }
      ]
    },

    completa: {
      name: "Rutina Completa de Boxeo",
      sport: "boxeo",
      emoji: "\u2B50",
      desc: "Sesion completa: calentamiento, tecnicas, combos y cierre",
      blocks: [
        { name: "Calentamiento", type: "footwork", dur: 120, rest: 10, cue: "Movilizar articulaciones y elevar pulso" },
        { name: "Guardia Base", type: "guardia", dur: 45, rest: 15, cue: "Postura solida, manos arriba" },
        { name: "Jab", type: "jab", dur: 60, rest: 15, cue: "Rapido y directo, vuelve a la cara" },
        { name: "Directo de Derecha", type: "cross", dur: 60, rest: 15, cue: "Gira cadera con el golpe" },
        { name: "Gancho + Uppercut", type: "hook", dur: 60, rest: 15, cue: "Combina los dos en fluido" },
        { name: "Defensa", type: "defensa", dur: 60, rest: 15, cue: "Cubrir y esquivar" },
        { name: "Combo 1-2-3", type: "hook", dur: 60, rest: 15, cue: "Jab directo gancho sin pausa" },
        { name: "Combo 1-1-2", type: "jab", dur: 60, rest: 15, cue: "Doble jab directo" },
        { name: "Ronda Intensa", type: "cross", dur: 40, rest: 20, cue: "Golpes fuertes, sin descanso" },
        { name: "Ronda Intensa 2", type: "uppercut", dur: 40, rest: 20, cue: "Ultimo esfuerzo, dalo todo" },
        { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respirar, estirar, relajar" }
      ]
    }
  },

  // ─── FUTBOL ────────────────────────────────────────────────────

  futbol: {

    fut_tecnica: {
      name: "Tecnica de Futbol",
      sport: "futbol",
      emoji: "\u26BD",
      desc: "Dribling, pase, tiro y juego aereo",
      blocks: [
        { name: "Dribling Controlado", type: "dribble", dur: 60, rest: 15, cue: "Control del balon, cabeza arriba" },
        { name: "Tiro a Porteria", type: "tiro", dur: 60, rest: 15, cue: "Mirar el arco, pie firme en el impacto" },
        { name: "Pase Corto y Largo", type: "pase", dur: 60, rest: 15, cue: "Precision y timing en cada pase" },
        { name: "Regate", type: "regate", dur: 60, rest: 15, cue: "Cambio de ritmo y direccion" },
        { name: "Remate de Cabeza", type: "remate", dur: 60, rest: 15, cue: "Timing perfecto con la frente" },
        { name: "Defensa Posicional", type: "defensa_fut", dur: 60, rest: 15, cue: "Posicionarse bien, angulo correcto" },
        { name: "Enfriamiento", type: "footwork", dur: 90, rest: 0, cue: "Trote suave, respirar profundo" }
      ]
    },

    fut_fisico: {
      name: "Fisico de Futbol",
      sport: "futbol",
      emoji: "\uD83C\uDFC3",
      desc: "Sprints, resistencia y agilidad para futbol",
      blocks: [
        { name: "Calentamiento con Pies", type: "footwork", dur: 60, rest: 10, cue: "Pies rapidos, lubricar articulaciones" },
        { name: "Sprint con Balon 1", type: "dribble", dur: 30, rest: 20, cue: "Velocidad maxima con control" },
        { name: "Sprint con Balon 2", type: "dribble", dur: 30, rest: 20, cue: "Acelerar y frenar" },
        { name: "Sprint con Balon 3", type: "dribble", dur: 30, rest: 20, cue: "Cambio de direccion rapido" },
        { name: "Sprint con Balon 4", type: "dribble", dur: 30, rest: 20, cue: "Driblear y acelerar" },
        { name: "Defensa Activa", type: "defensa_fut", dur: 60, rest: 15, cue: "Entradas limpias, cuerpo en balance" },
        { name: "Footwork Intenso", type: "footwork", dur: 60, rest: 15, cue: "Cambios de ritmo, agilidad pura" },
        { name: "Enfriamiento", type: "footwork", dur: 90, rest: 0, cue: "Trote suave, estirar piernas" }
      ]
    },

    fut_completa: {
      name: "Rutina Completa de Futbol",
      sport: "futbol",
      emoji: "\u2B50",
      desc: "Sesion completa: tecnica, fisico y juego",
      blocks: [
        { name: "Calentamiento", type: "footwork", dur: 120, rest: 10, cue: "Movilizar todo el cuerpo" },
        { name: "Dribling", type: "dribble", dur: 60, rest: 15, cue: "Control cercano, cabeza arriba" },
        { name: "Tiro", type: "tiro", dur: 60, rest: 15, cue: "Disparo con potencia y precision" },
        { name: "Regate", type: "regate", dur: 60, rest: 15, cue: "Vencer al rival con movimiento" },
        { name: "Sprint 1", type: "dribble", dur: 30, rest: 20, cue: "Explosividad pura" },
        { name: "Sprint 2", type: "dribble", dur: 30, rest: 20, cue: "Sin bajar la intensidad" },
        { name: "Pase", type: "pase", dur: 60, rest: 15, cue: "Precision en cada entrega" },
        { name: "Remate de Cabeza", type: "remate", dur: 60, rest: 15, cue: "Saltar y conectar bien" },
        { name: "Defensa", type: "defensa_fut", dur: 60, rest: 15, cue: "Posicion defensiva solida" },
        { name: "Enfriamiento", type: "footwork", dur: 90, rest: 0, cue: "Relajar piernas, respirar" }
      ]
    }
  },

  // ─── BASQUETBOL ────────────────────────────────────────────────

  basquet: {

    basq_tecnica: {
      name: "Tecnica de Basquetbol",
      sport: "basquet",
      emoji: "\uD83C\uDFC0",
      desc: "Dribling, tiro, pase y defensa de basket",
      blocks: [
        { name: "Dribling Bajo", type: "dribble", dur: 60, rest: 15, cue: "Cabeza arriba, cambios de mano" },
        { name: "Tiro en Salto", type: "tiro", dur: 60, rest: 15, cue: "Buen release, follow through" },
        { name: "Pase y Corte", type: "pase", dur: 60, rest: 15, cue: "Pase firme, cortar rapido" },
        { name: "Regate Avanzado", type: "regate", dur: 60, rest: 15, cue: "Crossover rapido, cambio de ritmo" },
        { name: "Defensa Activa", type: "defensa_fut", dur: 60, rest: 15, cue: "Manos arriba, pies activos" },
        { name: "Juego de Pies", type: "footwork", dur: 60, rest: 15, cue: "Pies rapidos, base solida" },
        { name: "Enfriamiento", type: "bob", dur: 90, rest: 0, cue: "Trote suave, respirar profundo" }
      ]
    },

    basq_fisico: {
      name: "Fisico de Basquetbol",
      sport: "basquet",
      emoji: "\uD83D\uDCAA",
      desc: "Agilidad, sprints y resistencia para basket",
      blocks: [
        { name: "Calentamiento Pies", type: "footwork", dur: 60, rest: 10, cue: "Pies ligeros, activar" },
        { name: "Deflexion y Correr", type: "bob", dur: 45, rest: 15, cue: "Esquivar y acelerar" },
        { name: "Sprint Dribble 1", type: "dribble", dur: 30, rest: 20, cue: "Velocidad con control total" },
        { name: "Sprint Dribble 2", type: "dribble", dur: 30, rest: 20, cue: "Cancha completa rapido" },
        { name: "Sprint Dribble 3", type: "dribble", dur: 30, rest: 20, cue: "Sin perder el balon" },
        { name: "Tiro Rapido", type: "tiro", dur: 60, rest: 15, cue: "Disparo rapido bajo presion" },
        { name: "Defensa Intensa", type: "defensa_fut", dur: 60, rest: 15, cue: "Full court defense" },
        { name: "Enfriamiento", type: "footwork", dur: 90, rest: 0, cue: "Relajar, respirar, estirar" }
      ]
    },

    basq_completa: {
      name: "Rutina Completa de Basquetbol",
      sport: "basquet",
      emoji: "\u2B50",
      desc: "Sesion completa: habilidades, fisico y juego",
      blocks: [
        { name: "Calentamiento", type: "footwork", dur: 120, rest: 10, cue: "Movilizar todo el cuerpo" },
        { name: "Dribling", type: "dribble", dur: 60, rest: 15, cue: "Control y velocidad" },
        { name: "Tiro", type: "tiro", dur: 60, rest: 15, cue: "Forma correcta, follow through" },
        { name: "Pase", type: "pase", dur: 60, rest: 15, cue: "Pases rapidos y precisos" },
        { name: "Regate", type: "regate", dur: 60, rest: 15, cue: "Vencer al defensor" },
        { name: "Bob & Weave", type: "bob", dur: 45, rest: 15, cue: "Esquivar picks, mantener posicion" },
        { name: "Sprint 1", type: "dribble", dur: 30, rest: 20, cue: "Explosividad cancha completa" },
        { name: "Sprint 2", type: "dribble", dur: 30, rest: 20, cue: "Ultimo sprint, dalo todo" },
        { name: "Defensa", type: "defensa_fut", dur: 60, rest: 15, cue: "Defensa solida al final" },
        { name: "Enfriamiento", type: "footwork", dur: 90, rest: 0, cue: "Relajar, respirar, estirar" }
      ]
    }
  },

  // ─── NATACION ──────────────────────────────────────────────────

  natacion: {

    nat_tecnica: {
      name: "Tecnica de Natacion",
      sport: "natacion",
      emoji: "\uD83C\uDFCA",
      desc: "Perfecciona cada estilo de nado",
      blocks: [
        { name: "Crol (Front Crawl)", type: "natacion", dur: 120, rest: 15, cue: "Brazada larga, respiracion ritmica" },
        { name: "Espalda", type: "natacion", dur: 120, rest: 15, cue: "Cuerpo recto, brazada por encima" },
        { name: "Pecho (Breaststroke)", type: "natacion", dur: 120, rest: 15, cue: "Coordinacion brazos-piernas" },
        { name: "Mariposa", type: "natacion", dur: 90, rest: 15, cue: "Ondulacion fluida, brazada fuerte" },
        { name: "Enfriamiento", type: "natacion", dur: 90, rest: 0, cue: "Nado suave, relajar musculos" }
      ]
    },

    nat_resistencia: {
      name: "Resistencia Acuatica",
      sport: "natacion",
      emoji: "\uD83C\uDCA6",
      desc: "Volumen y resistencia en el agua",
      blocks: [
        { name: "Nado Largo 1", type: "natacion", dur: 180, rest: 15, cue: "Ritmo constante, sin apresurar" },
        { name: "Nado Largo 2", type: "natacion", dur: 180, rest: 15, cue: "Mantener tecnica con cansancio" },
        { name: "Intervalos 1", type: "natacion", dur: 60, rest: 30, cue: "Rapido en el tramo, recuperar" },
        { name: "Intervalos 2", type: "natacion", dur: 60, rest: 30, cue: "Aumentar ritmo en cada vuelta" },
        { name: "Nado Largo 3", type: "natacion", dur: 180, rest: 15, cue: "Ultimo tramo largo, no parar" },
        { name: "Enfriamiento", type: "natacion", dur: 90, rest: 0, cue: "Nado suave, respirar profundo" }
      ]
    }
  },

  // ─── ARTES MARCIALES ───────────────────────────────────────────

  artes_marciales: {

    am_tecnica: {
      name: "Tecnica de Artes Marciales",
      sport: "artes_marciales",
      emoji: "\uD83E\uDD4B",
      desc: "Golpes, patadas y movimientos fundamentales",
      blocks: [
        { name: "Guardia Base", type: "guardia", dur: 45, rest: 15, cue: "Siempre volver a guardia" },
        { name: "Punetazos", type: "puno", dur: 60, rest: 15, cue: "Golpe directo, volver a guardia" },
        { name: "Patadas Frontales", type: "patada", dur: 60, rest: 15, cue: "Cadera alineada, golpe seco" },
        { name: "Codazos", type: "codazo", dur: 60, rest: 15, cue: "Corto y potente, de cerca" },
        { name: "Rodillazos", type: "rodillazo", dur: 60, rest: 15, cue: "Empujar cadera, impacto fuerte" },
        { name: "Combinacion Puño-Patada", type: "puno", dur: 60, rest: 15, cue: "Encadenar golpes y patadas" },
        { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respirar, relajar, mantener guardia" }
      ]
    },

    am_fisico: {
      name: "Fisico de Artes Marciales",
      sport: "artes_marciales",
      emoji: "\uD83D\uDCAA",
      desc: "Velocidad, potencia y resistencia combativa",
      blocks: [
        { name: "Guardia Rapida", type: "guardia", dur: 45, rest: 10, cue: "Agil, rapido, listo" },
        { name: "Puños Rapidos", type: "puno", dur: 30, rest: 10, cue: "Velocidad maxima, no pensar" },
        { name: "Patadas Rapidas", type: "patada", dur: 30, rest: 10, cue: "Patadas alternas sin pausa" },
        { name: "Rodillazos Rapidos", type: "rodillazo", dur: 30, rest: 10, cue: "Rodillas alternas, ritmo alto" },
        { name: "Codazos Rapidos", type: "codazo", dur: 30, rest: 10, cue: "Codazos cortos y explosivos" },
        { name: "Combinacion Libre", type: "puno", dur: 60, rest: 15, cue: "Libera todo, golpes y patadas" },
        { name: "Ronda Intensa 1", type: "patada", dur: 40, rest: 20, cue: "Intensidad maxima" },
        { name: "Ronda Intensa 2", type: "puno", dur: 40, rest: 20, cue: "No bajar la guardia" },
        { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respirar, relajar cuerpo" }
      ]
    },

    am_completa: {
      name: "Rutina Completa de Artes Marciales",
      sport: "artes_marciales",
      emoji: "\u2B50",
      desc: "Sesion completa: golpes, patadas, combos e intensidad",
      blocks: [
        { name: "Calentamiento", type: "guardia", dur: 120, rest: 10, cue: "Movilizar todo el cuerpo" },
        { name: "Guardia Base", type: "guardia", dur: 45, rest: 15, cue: "Postura solida y estable" },
        { name: "Punetazos", type: "puno", dur: 60, rest: 15, cue: "Directos con potencia" },
        { name: "Patadas", type: "patada", dur: 60, rest: 15, cue: "Patadas limpias y fuertes" },
        { name: "Codazos", type: "codazo", dur: 60, rest: 15, cue: "Golpes de codo certeros" },
        { name: "Rodillazos", type: "rodillazo", dur: 60, rest: 15, cue: "Rodillas con poder" },
        { name: "Combinacion Total", type: "puno", dur: 60, rest: 15, cue: "Todo junto, fluidez letal" },
        { name: "Ronda Intensa", type: "patada", dur: 40, rest: 20, cue: "Dalo todo, sin reserva" },
        { name: "Ronda Intensa 2", type: "puno", dur: 40, rest: 20, cue: "Ultimo esfuerzo warrior" },
        { name: "Enfriamiento", type: "guardia", dur: 90, rest: 0, cue: "Respirar, relajar, respeto" }
      ]
    }
  },

  // ─── CICLISMO ──────────────────────────────────────────────────

  ciclismo: {

    cic_resistencia: {
      name: "Resistencia en Bicicleta",
      sport: "ciclismo",
      emoji: "\uD83D\uDEB4",
      desc: "Sesion larga para construir base de resistencia",
      blocks: [
        { name: "Calentamiento", type: "ciclismo", dur: 180, rest: 15, cue: "Pedaleo suave, preparar piernas" },
        { name: "Ritmo Medio 1", type: "ciclismo", dur: 300, rest: 15, cue: "Cadencia constante, postura recta" },
        { name: "Ritmo Medio 2", type: "ciclismo", dur: 300, rest: 15, cue: "Mantener el ritmo, no bajar" },
        { name: "Ritmo Alto 1", type: "ciclismo", dur: 180, rest: 15, cue: "Subir intensidad, respirar profundo" },
        { name: "Ritmo Alto 2", type: "ciclismo", dur: 180, rest: 15, cue: "Mantener la carga, piernas fuertes" },
        { name: "Enfriamiento", type: "ciclismo", dur: 180, rest: 0, cue: "Pedaleo ligero, bajar pulso" }
      ]
    },

    cic_sprints: {
      name: "Sprints en Bicicleta",
      sport: "ciclismo",
      emoji: "\u26A1",
      desc: "Intervalos de alta intensidad para velocidad",
      blocks: [
        { name: "Calentamiento", type: "ciclismo", dur: 180, rest: 15, cue: "Preparar el cuerpo para sprints" },
        { name: "Sprint 1", type: "ciclismo", dur: 30, rest: 30, cue: "Potencia maxima, pedalear fuerte" },
        { name: "Sprint 2", type: "ciclismo", dur: 30, rest: 30, cue: "Sin bajar la intensidad" },
        { name: "Sprint 3", type: "ciclismo", dur: 30, rest: 30, cue: "Explosividad pura" },
        { name: "Sprint 4", type: "ciclismo", dur: 30, rest: 30, cue: "Resistir el dolor, seguir" },
        { name: "Sprint 5", type: "ciclismo", dur: 30, rest: 30, cue: "Mitad de la serie, fuerte" },
        { name: "Sprint 6", type: "ciclismo", dur: 30, rest: 30, cue: "No aflojar" },
        { name: "Recuperacion", type: "ciclismo", dur: 120, rest: 15, cue: "Pedaleo suave, recuperar" },
        { name: "Sprint 7", type: "ciclismo", dur: 30, rest: 30, cue: "Segunda serie, sin miedo" },
        { name: "Sprint 8", type: "ciclismo", dur: 30, rest: 30, cue: "Velocidad pura" },
        { name: "Sprint 9", type: "ciclismo", dur: 30, rest: 30, cue: "Casi listo" },
        { name: "Sprint 10", type: "ciclismo", dur: 30, rest: 30, cue: "Ultimo sprint, todo o nada" },
        { name: "Enfriamiento", type: "ciclismo", dur: 180, rest: 0, cue: "Pedaleo suave, bajar ritmo" }
      ]
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
//  MODO GUERRA
// ═══════════════════════════════════════════════════════════════════

var MODO_GUERRA = {
  lema: "Disciplina es libertad",
  despertar: "7:00",
  dormir: "22:30",
  plan: {
    lunes: {
      exercises: ["ab", "fl", "ss", "pl", "mc"]
    },
    martes: {
      exercises: ["cu", "jj", "ab", "fl", "sl"]
    },
    miercoles: {
      exercises: ["ss", "pl", "mc", "ab", "cu"]
    },
    jueves: {
      exercises: ["jj", "fl", "ss", "pl", "sl"]
    },
    viernes: {
      exercises: ["ab", "mc", "cu", "jj", "fl"]
    },
    sabado: {
      trote: true
    },
    domingo: {
      descanso: true
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
//  SCHEDULE
// ═══════════════════════════════════════════════════════════════════

function SCHEDULE_DEFAULTS() {
  return {
    semana: [
      { time: "06:30", label: "Modo Guerra", routine: null, military: true },
      { time: "20:00", label: "Boxeo Fundamentos", routine: "fundamentos", military: false }
    ],
    sabado: [
      { time: "08:00", label: "Boxeo Completa", routine: "completa", military: false },
      { time: "16:00", label: "Modo Guerra", routine: null, military: true }
    ],
    domingo: []
  };
}

function loadScheduleStore() {
  try {
    var raw = localStorage.getItem("shadowbox_schedule");
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

function getDaySchedule(dayKey) {
  var store = loadScheduleStore();
  if (store && store[dayKey]) return store[dayKey];
  var defaults = SCHEDULE_DEFAULTS();
  return defaults[dayKey] || [];
}

function getEditableSchedule(dayKey) {
  return JSON.parse(JSON.stringify(getDaySchedule(dayKey)));
}

function toTimeInput(t) {
  if (typeof t === "string" && t.indexOf(":") >= 0) return t;
  var mins = parseInt(t, 10) || 0;
  var h = Math.floor(mins / 60);
  var m = mins % 60;
  return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ═══════════════════════════════════════════════════════════════════
//  MODO GUERRA — BLOCKS
// ═══════════════════════════════════════════════════════════════════

function militaryBlocks(dayKey) {
  var plan = MODO_GUERRA.plan[dayKey];
  if (!plan || plan.descanso) return [];
  if (plan.trote) {
    return [
      { name: "Trote Continuo", type: "ciclismo", dur: 300, rest: 0, cue: "Mantener ritmo constante, respirar" }
    ];
  }
  var catalog = {
    ab: { name: "Abdominales", type: "guardia", dur: 45, rest: 15, cue: "Core firme, respirar en cada rep" },
    fl: { name: "Flexiones", type: "guardia", dur: 45, rest: 15, cue: "Cuerpo recto, bajar completo" },
    ss: { name: "Sentadillas", type: "guardia", dur: 45, rest: 15, cue: "Rodillas alineadas, bajar profundo" },
    pl: { name: "Plancha", type: "guardia", dur: 45, rest: 15, cue: "Cuerpo recto, no hundir cadera" },
    mc: { name: "Mountain Climbers", type: "guardia", dur: 45, rest: 15, cue: "Rodillas al pecho, ritmo rapido" },
    cu: { name: "Cuclillas", type: "guardia", dur: 45, rest: 15, cue: "Paso largo, rodilla al suelo" },
    jj: { name: "Jumping Jacks", type: "guardia", dur: 45, rest: 15, cue: "Brazos completos, saltar ligero" },
    sl: { name: "Skipping", type: "guardia", dur: 45, rest: 15, cue: "Rodillas altas, ritmo constante" }
  };
  var blocks = [];
  var exercises = plan.exercises || [];
  for (var i = 0; i < exercises.length; i++) {
    var ex = catalog[exercises[i]];
    if (ex) {
      blocks.push({
        name: ex.name,
        type: ex.type,
        dur: ex.dur,
        rest: ex.rest,
        cue: ex.cue
      });
    }
  }
  return blocks;
}

// ═══════════════════════════════════════════════════════════════════
//  HABITS
// ═══════════════════════════════════════════════════════════════════

var HABITS = [
  { key: "entrene", name: "Entrene hoy", icon: "\uD83E\uDD4A" },
  { key: "estudie", name: "Estudie", icon: "\uD83D\uDCDA" },
  { key: "lei", name: "Lei al menos 15 min", icon: "\uD83D\uDCD6" },
  { key: "ahorre", name: "Ahorre dinero", icon: "\uD83D\uDCB0" },
  { key: "registre", name: "Registre su progreso", icon: "\uD83D\uDCDD" },
  { key: "nocompras", name: "No compro impulsivamente", icon: "\uD83D\uDEAB" },
  { key: "agua", name: "Tome suficiente agua", icon: "\uD83D\uDCA7" },
  { key: "dormi", name: "Dormi 7+ horas", icon: "\uD83D\uDE34" },
  { key: "noprocrast", name: "No procrastine", icon: "\u23F0" },
  { key: "aprendi", name: "Aprendi algo nuevo", icon: "\uD83E\uDDE0" }
];

// ═══════════════════════════════════════════════════════════════════
//  GOALS
// ═══════════════════════════════════════════════════════════════════

var GOALS = [
  { key: "g1", name: "Correr 5K sin parar", icon: "\uD83C\uDFC3" },
  { key: "g2", name: "100 flexiones seguidas", icon: "\uD83D\uDCAA" },
  { key: "g3", name: "30 dias de disciplina", icon: "\uD83D\uDD25" },
  { key: "g4", name: "Dominar combinacion 1-2-3", icon: "\uD83E\uDD4A" },
  { key: "g5", name: "Plancha 3 minutos seguidos", icon: "\u23F1\uFE0F" },
  { key: "g6", name: "Leer 12 libros este anio", icon: "\uD83D\uDCDA" },
  { key: "g7", name: "Ahorrar 1000 este mes", icon: "\uD83D\uDCB0" },
  { key: "g8", name: "Hablar ingles 15 min diarios", icon: "\uD83D\uDDE3\uFE0F" },
  { key: "g9", name: "Entrenar 5 veces por semana", icon: "\uD83C\uDFCB\uFE0F" },
  { key: "g10", name: "Ascender a rango ORO", icon: "\uD83E\uDD47" }
];

// ═══════════════════════════════════════════════════════════════════
//  RANKS
// ═══════════════════════════════════════════════════════════════════

var RANKS = [
  { level: 1, name: "COBRE", min: 0, color: "#cd7f32" },
  { level: 2, name: "HIERRO", min: 30, color: "#808080" },
  { level: 3, name: "ORO", min: 50, color: "#ffd700" },
  { level: 4, name: "DIAMANTE", min: 70, color: "#b9f2ff" },
  { level: 5, name: "NEMESIS", min: 85, color: "#ff1f1f" },
  { level: 6, name: "ARCH NEMESIS", min: 95, color: "#ff4444" }
];

// ═══════════════════════════════════════════════════════════════════
//  RANK FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function getRankForPercent(pct) {
  var rank = RANKS[0];
  for (var i = 0; i < RANKS.length; i++) {
    if (pct >= RANKS[i].min) rank = RANKS[i];
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
  var start = new Date(startDate);
  var end = new Date(endDate);
  var msPerDay = 86400000;
  var totalDays = Math.round((end - start) / msPerDay) + 1;
  if (totalDays <= 0) return 0;
  var totalPossible = totalDays * HABITS.length;
  var completed = 0;
  var d = new Date(start);
  while (d <= end) {
    var dk = dateKey(d);
    var dayData = habitsStore ? habitsStore[dk] : null;
    if (dayData) {
      for (var h = 0; h < HABITS.length; h++) {
        if (dayData[HABITS[h].key]) completed++;
      }
    }
    d.setDate(d.getDate() + 1);
  }
  return totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
}

// ═══════════════════════════════════════════════════════════════════
//  UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function fmtTime(sec) {
  var m = Math.floor(sec / 60);
  var s = sec % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

function routineBlocks(key) {
  for (var sportKey in ROUTINES) {
    if (ROUTINES.hasOwnProperty(sportKey)) {
      if (ROUTINES[sportKey][key]) {
        return ROUTINES[sportKey][key].blocks;
      }
    }
  }
  return null;
}

function routineTotal(blocks) {
  var total = 0;
  for (var i = 0; i < blocks.length; i++) {
    total += blocks[i].dur + (blocks[i].rest || 0);
  }
  return total;
}

function buildSchedule(blocks) {
  var t = 0;
  var result = [];
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    result.push({
      name: b.name,
      type: b.type,
      dur: b.dur,
      rest: b.rest,
      cue: b.cue,
      start: t,
      end: t + b.dur
    });
    t += b.dur + (b.rest || 0);
  }
  result.totalTime = t;
  return result;
}

function dateKey(d) {
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  var day = d.getDate();
  return y + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
}
