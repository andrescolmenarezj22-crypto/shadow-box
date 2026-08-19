/* ===========================================================================
   SHADOW BOX — Generador de figuras SVG del boxeador por técnica
   Figuras articuladas en rojo sangre con estelas de movimiento
   =========================================================================== */

const POSES = {
  guardia: {
    name: "Posición de Guardia",
    head: [100, 62], neck: [100, 92],
    shoulders: { f: [92, 88], r: [108, 87] },
    elbows: { f: [83, 74], r: [115, 72] },
    gloves: { f: [91, 56], r: [107, 54] },
    hips: [100, 134],
    knees: { f: [91, 164], r: [111, 166] },
    feet: { f: [83, 190], r: [119, 192] },
    swing: null, focus: [90, 60], trails: []
  },
  jab: {
    name: "Jab",
    head: [100, 62], neck: [100, 92],
    shoulders: { f: [94, 88], r: [106, 87] },
    elbows: { f: [58, 84], r: [115, 72] },
    gloves: { f: [28, 74], r: [107, 54] },
    hips: [99, 134],
    knees: { f: [90, 164], r: [111, 166] },
    feet: { f: [82, 190], r: [118, 192] },
    swing: "f", focus: [22, 74],
    trails: [[40, 66, 12, 70], [42, 74, 10, 78], [40, 82, 12, 86]]
  },
  cross: {
    name: "Directo de Derecha",
    head: [99, 62], neck: [100, 92],
    shoulders: { f: [94, 86], r: [106, 90] },
    elbows: { f: [112, 72], r: [60, 86] },
    gloves: { f: [108, 54], r: [30, 76] },
    hips: [99, 134],
    knees: { f: [90, 164], r: [111, 166] },
    feet: { f: [82, 190], r: [118, 192] },
    swing: "r", focus: [24, 76],
    trails: [[40, 70, 12, 72], [42, 78, 10, 80], [40, 86, 12, 88]]
  },
  hook: {
    name: "Gancho (Hook)",
    head: [100, 62], neck: [100, 92],
    shoulders: { f: [92, 88], r: [108, 87] },
    elbows: { f: [68, 82], r: [115, 72] },
    gloves: { f: [44, 66], r: [107, 54] },
    hips: [100, 134],
    knees: { f: [90, 164], r: [111, 166] },
    feet: { f: [82, 190], r: [118, 192] },
    swing: "f", focus: [38, 66],
    trails: [[58, 78, 34, 74], [60, 70, 38, 64], [56, 86, 36, 82]]
  },
  uppercut: {
    name: "Uppercut",
    head: [101, 62], neck: [100, 92],
    shoulders: { f: [93, 90], r: [109, 87] },
    elbows: { f: [80, 72], r: [116, 72] },
    gloves: { f: [88, 50], r: [108, 54] },
    hips: [101, 134],
    knees: { f: [90, 164], r: [111, 166] },
    feet: { f: [82, 190], r: [118, 192] },
    swing: "f", focus: [86, 44],
    trails: [[82, 62, 84, 40], [90, 62, 92, 38], [76, 60, 76, 42]]
  },
  defensa: {
    name: "Defensa / Cobertura",
    head: [100, 58], neck: [100, 94],
    shoulders: { f: [92, 90], r: [108, 89] },
    elbows: { f: [78, 72], r: [117, 70] },
    gloves: { f: [87, 50], r: [112, 48] },
    hips: [100, 138],
    knees: { f: [90, 168], r: [112, 170] },
    feet: { f: [82, 194], r: [120, 196] },
    swing: null, focus: [100, 52], trails: []
  },
  bob: {
    name: "Esquiva (Bob & Weave)",
    head: [100, 82], neck: [100, 112],
    shoulders: { f: [91, 108], r: [109, 106] },
    elbows: { f: [85, 90], r: [112, 88] },
    gloves: { f: [93, 74], r: [109, 72] },
    hips: [100, 150],
    knees: { f: [86, 182], r: [114, 184] },
    feet: { f: [80, 206], r: [120, 208] },
    swing: null, focus: [95, 78], trails: []
  },
  footwork: {
    name: "Juego de Pies",
    head: [100, 62], neck: [100, 92],
    shoulders: { f: [92, 88], r: [108, 87] },
    elbows: { f: [84, 74], r: [114, 72] },
    gloves: { f: [91, 56], r: [107, 54] },
    hips: [99, 134],
    knees: { f: [86, 166], r: [114, 164] },
    feet: { f: [74, 192], r: [126, 190] },
    swing: null, focus: [90, 60], trails: []
  }
};

function _ln(ax, ay, bx, by, w, cls) {
  return '<line x1="' + ax + '" y1="' + ay + '" x2="' + bx + '" y2="' + by +
    '" stroke="#ff2222" stroke-width="' + w + '" stroke-linecap="round" class="' + (cls || '') + '"/>';
}

function rayEnd(cx, cy, ang, rMax) {
  const dx = Math.cos(ang), dy = Math.sin(ang);
  let t = rMax;
  if (dx > 0) t = Math.min(t, (270 - cx) / dx);
  else if (dx < 0) t = Math.min(t, (10 - cx) / dx);
  if (dy > 0) t = Math.min(t, (248 - cy) / dy);
  else if (dy < 0) t = Math.min(t, (10 - cy) / dy);
  return [cx + dx * t, cy + dy * t];
}

function _circle(x, y, r, cls) {
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#ff2b2b" class="' + (cls || '') + '"/>';
}

function figureSVG(key, opts) {
  opts = opts || {};
  const p = POSES[key] || POSES.guardia;
  const s = opts.stroke || 9;
  const parts = [];

  /* ---- fondo escena: ráfaga de energía + anillos de combate ---- */
  const bx = 100, by = 118;
  for (let a = 0; a < 24; a++) {
    const ang = a * 15 * Math.PI / 180;
    const x1 = bx + Math.cos(ang) * 66, y1 = by + Math.sin(ang) * 66;
    const t = rayEnd(bx, by, ang, 190);
    parts.push('<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) +
      '" x2="' + t[0].toFixed(1) + '" y2="' + t[1].toFixed(1) +
      '" stroke="#ff1f1f" stroke-width="1.6" opacity="0.20" stroke-linecap="round"/>');
  }
  for (let i = 0; i < 3; i++) {
    const r = 50 + i * 26;
    const op = 0.30 - i * 0.09;
    parts.push('<circle cx="' + bx + '" cy="' + by + '" r="' + r + '" fill="none"' +
      ' stroke="#ff1f1f" stroke-width="1.4" opacity="' + op.toFixed(2) + '"/>');
  }
  parts.push('<circle cx="' + bx + '" cy="' + by + '" r="34" fill="none"' +
    ' stroke="#ff1f1f" stroke-width="1" opacity="0.35" stroke-dasharray="3 6"/>');

  // --- aura / sombra en el suelo ---
  parts.push('<ellipse cx="100" cy="' + (p.feet.f[1] + 10) + '" rx="58" ry="9" fill="#ff1f1f" opacity="0.16"/>');

  // --- piernas ---
  parts.push(_ln(p.hips[0], p.hips[1], p.knees.f[0], p.knees.f[1], s));
  parts.push(_ln(p.knees.f[0], p.knees.f[1], p.feet.f[0], p.feet.f[1], s * 0.8));
  parts.push(_ln(p.hips[0], p.hips[1], p.knees.r[0], p.knees.r[1], s));
  parts.push(_ln(p.knees.r[0], p.knees.r[1], p.feet.r[0], p.feet.r[1], s * 0.8));

  // --- torso ---
  parts.push(_ln(p.neck[0], p.neck[1], p.hips[0], p.hips[1], s * 1.15));

  // --- estelas de movimiento ---
  p.trails.forEach(function (t) {
    parts.push('<line x1="' + t[0] + '" y1="' + t[1] + '" x2="' + t[2] + '" y2="' + t[3] +
      '" stroke="#ff1f1f" stroke-width="3" stroke-linecap="round" opacity="0.35"/>');
  });

  // --- fantasma del guante en movimiento (motion blur) ---
  if (p.swing) {
    const g = p.gloves[p.swing];
    const fx = p.focus[0], fy = p.focus[1];
    const vx = fx - g[0], vy = fy - g[1];
    for (let i = 1; i <= 3; i++) {
      const k = i * 0.28;
      const ghost = _circle(g[0] + vx * k, g[1] + vy * k, 9 + i * 2.5, "ghost");
      parts.push(ghost.replace(
        'fill="#ff2b2b"',
        'fill="#ff1f1f" opacity="' + (0.34 - i * 0.08) + '"'
      ));
    }
  }

  // --- brazos ---
  parts.push(_ln(p.shoulders.f[0], p.shoulders.f[1], p.elbows.f[0], p.elbows.f[1], s * 0.85));
  parts.push(_ln(p.elbows.f[0], p.elbows.f[1], p.gloves.f[0], p.gloves.f[1], s * 0.75));
  parts.push(_ln(p.shoulders.r[0], p.shoulders.r[1], p.elbows.r[0], p.elbows.r[1], s * 0.85));
  parts.push(_ln(p.elbows.r[0], p.elbows.r[1], p.gloves.r[0], p.gloves.r[1], s * 0.75));

  // --- cabezas (principal + fantasma) ---
  parts.push(_circle(p.head[0], p.head[1], 15, "head"));
  parts.push('<line x1="' + p.head[0] + '" y1="' + (p.head[1] + 15) + '" x2="' + p.neck[0] + '" y2="' + p.neck[1] +
    '" stroke="#ff2222" stroke-width="' + s + '" stroke-linecap="round"/>');

  // --- impacto (destello en el punto de golpe) ---
  const fx = p.focus[0], fy = p.focus[1];
  parts.push(_circle(fx, fy, 6, "impact"));
  for (let a = 0; a < 4; a++) {
    const ang = (a * 90 + 45) * Math.PI / 180;
    parts.push('<line x1="' + (fx + Math.cos(ang) * 10) + '" y1="' + (fy + Math.sin(ang) * 10) +
      '" x2="' + (fx + Math.cos(ang) * 22) + '" y2="' + (fy + Math.sin(ang) * 22) +
      '" stroke="#ff3b3b" stroke-width="4" stroke-linecap="round" opacity="0.85"/>');
  }

  // --- guantes (por encima de todo) ---
  parts.push(_circle(p.gloves.f[0], p.gloves.f[1], 10, "glove f"));
  parts.push(_circle(p.gloves.r[0], p.gloves.r[1], 10, "glove r"));

  const extra = opts.class ? ' class="' + opts.class + '"' : '';
  return '<svg viewBox="0 0 280 250" ' + extra + '>' + parts.join('') + '</svg>';
}

function figureFor(poseKey) {
  const p = POSES[poseKey] || POSES.guardia;
  return { key: poseKey, name: p.name, svg: figureSVG(poseKey) };
}
