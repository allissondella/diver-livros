// ===== paint.js — texturas e utilidades de desenho =====
const W = 1600, H = 900, FLOOR = 720, WALL_TOP = 95;

function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function rgba(r, g, b, a) { return `rgba(${r | 0},${g | 0},${b | 0},${a})`; }
function clipRect(ctx, x, y, w, h) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); }
function poly(ctx, pts) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); }

function speckle(ctx, x, y, w, h, n, seed, colors, maxR) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = colors[(r() * colors.length) | 0];
    const s = r() * maxR + .5;
    ctx.fillRect(x + r() * w, y + r() * h, s, s);
  }
}
// mancha difusa; col é um molde 'rgba(r,g,b,A)'
function stain(ctx, cx, cy, rx, ry, col, a) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, col.replace('A', a)); g.addColorStop(.6, col.replace('A', a * .5)); g.addColorStop(1, col.replace('A', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, 7); ctx.fill(); ctx.restore();
}
// escorridos de umidade e mofo
function drips(ctx, x, y, w, len, seed, col, density) {
  const r = rng(seed), n = (w / 7) * (density || 1);
  for (let i = 0; i < n; i++) {
    const xx = x + r() * w, l = len * (.2 + r() * .8), ww = 1 + r() * 5;
    const g = ctx.createLinearGradient(0, y, 0, y + l);
    g.addColorStop(0, col.replace('A', .5 * r() + .15)); g.addColorStop(1, col.replace('A', 0));
    ctx.fillStyle = g; ctx.fillRect(xx, y, ww, l);
  }
}

function plaster(ctx, x, y, w, h, seed, base) {
  clipRect(ctx, x, y, w, h);
  ctx.fillStyle = base || '#7f6d49'; ctx.fillRect(x, y, w, h);
  const r = rng(seed);
  for (let i = 0; i < 46; i++) stain(ctx, x + r() * w, y + r() * h, 40 + r() * 170, 30 + r() * 120, 'rgba(60,45,22,A)', .1 + r() * .14);
  for (let i = 0; i < 16; i++) stain(ctx, x + r() * w, y + r() * h * .6, 30 + r() * 100, 20 + r() * 70, 'rgba(160,140,95,A)', .1);
  // manchas de infiltração com borda marrom
  for (let i = 0; i < 5; i++) {
    const sx = x + r() * w, sy = y + r() * h * .5, sr = 50 + r() * 110;
    stain(ctx, sx, sy, sr, sr * .8, 'rgba(75,50,20,A)', .32); stain(ctx, sx, sy, sr * .82, sr * .66, 'rgba(140,120,80,A)', .25);
  }
  speckle(ctx, x, y, w, h, 6000, seed + 1, ['rgba(30,22,10,.28)', 'rgba(170,150,110,.16)', 'rgba(40,55,30,.2)'], 2.4);
  drips(ctx, x, y, w, h * .5, seed + 2, 'rgba(28,40,22,A)');
  const g = ctx.createLinearGradient(0, y + h - 180, 0, y + h);
  g.addColorStop(0, 'rgba(30,26,12,0)'); g.addColorStop(1, 'rgba(22,20,8,.7)');
  ctx.fillStyle = g; ctx.fillRect(x, y + h - 180, w, 180);
  ctx.restore();
}

function ceiling(ctx, seed) {
  ctx.fillStyle = '#3b2e1d'; ctx.fillRect(0, 0, W, WALL_TOP);
  const r = rng(seed);
  ctx.strokeStyle = 'rgba(15,10,5,.75)'; ctx.lineWidth = 2;
  for (let x = 0; x < W; x += 60 + r() * 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, WALL_TOP); ctx.stroke(); }
  for (const vy of [10, 52]) {
    ctx.fillStyle = '#251c11'; ctx.fillRect(0, vy, W, 20);
    ctx.fillStyle = 'rgba(120,95,60,.22)'; ctx.fillRect(0, vy, W, 3);
  }
  speckle(ctx, 0, 0, W, WALL_TOP, 1800, seed + 3, ['rgba(0,0,0,.35)', 'rgba(140,110,70,.12)'], 2);
  drips(ctx, 0, 0, W, WALL_TOP, seed + 4, 'rgba(10,8,4,A)', .5);
  const g = ctx.createLinearGradient(0, WALL_TOP - 8, 0, WALL_TOP + 40);
  g.addColorStop(0, 'rgba(0,0,0,.7)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, WALL_TOP - 8, W, 48);
}

// taco de peroba em perspectiva
function floor(ctx, seed) {
  const y0 = FLOOR, vx = W / 2, vy = 330, r = rng(seed);
  ctx.fillStyle = '#2f1f10'; ctx.fillRect(0, y0, W, H - y0);
  const rows = []; let y = y0, step = 9; while (y < H + 40) { rows.push(y); y += step; step *= 1.32; }
  const xAt = (xb, yy) => vx + (xb - vx) * ((yy - vy) / (H - vy));
  for (let j = 0; j < rows.length - 1; j++) {
    for (let i = -24; i < 24; i++) {
      const a = vx + i * 85, b = vx + (i + 1) * 85, ya = rows[j], yb = rows[j + 1];
      const t = .82 + r() * .3, alt = (i + j) % 2 ? 1 : .86;
      ctx.fillStyle = rgba(64 * t * alt, 40 * t * alt, 20 * t * alt, 1);
      poly(ctx, [[xAt(a, ya), ya], [xAt(b, ya), ya], [xAt(b, yb), yb], [xAt(a, yb), yb]]); ctx.fill();
    }
  }
  ctx.strokeStyle = 'rgba(10,6,2,.6)'; ctx.lineWidth = 1.2;
  for (let i = -24; i <= 24; i++) { const xb = vx + i * 85; ctx.beginPath(); ctx.moveTo(xAt(xb, y0), y0); ctx.lineTo(xAt(xb, H), H); ctx.stroke(); }
  for (const yy of rows) { ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
  for (let i = 0; i < 26; i++) stain(ctx, r() * W, y0 + r() * (H - y0), 60 + r() * 220, 8 + r() * 30, 'rgba(20,12,4,A)', .3);
  speckle(ctx, 0, y0, W, H - y0, 3000, seed + 5, ['rgba(0,0,0,.4)', 'rgba(150,100,55,.12)'], 2);
  ctx.fillStyle = '#20150a'; ctx.fillRect(0, y0 - 16, W, 16);
  ctx.fillStyle = 'rgba(140,100,60,.18)'; ctx.fillRect(0, y0 - 16, W, 2);
  const g = ctx.createLinearGradient(0, y0, 0, y0 + 70);
  g.addColorStop(0, 'rgba(0,0,0,.65)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, y0, W, 70);
}

function bricks(ctx, x, y, w, h, seed) {
  clipRect(ctx, x, y, w, h);
  ctx.fillStyle = '#4e3a2c'; ctx.fillRect(x, y, w, h);
  const r = rng(seed), bh = 32, bw = 92; let row = 0;
  for (let yy = y; yy < y + h; yy += bh, row++) {
    const off = (row % 2) * bw / 2;
    for (let xx = x - off; xx < x + w; xx += bw) {
      const t = r();
      ctx.fillStyle = rgba(118 + t * 38, 58 + t * 20, 40 + t * 14, 1);
      ctx.fillRect(xx + 3, yy + 3, bw - 6, bh - 6);
      ctx.fillStyle = rgba(0, 0, 0, .12 + r() * .22); ctx.fillRect(xx + 3, yy + bh - 9, bw - 6, 6);
      ctx.fillStyle = rgba(220, 190, 150, .1 + r() * .08); ctx.fillRect(xx + 3, yy + 3, bw - 6, 2);
      if (r() < .25) { ctx.fillStyle = 'rgba(210,190,160,.13)'; ctx.fillRect(xx + 6 + r() * 40, yy + 6 + r() * 8, 18 + r() * 30, 5 + r() * 6); }
      if (r() < .12) { ctx.fillStyle = 'rgba(20,12,8,.35)'; ctx.fillRect(xx + 8 + r() * 50, yy + 8, 6 + r() * 10, 4 + r() * 8); }
    }
  }
  for (let i = 0; i < 14; i++) stain(ctx, x + r() * w, y + r() * h, 60 + r() * 150, 40 + r() * 120, 'rgba(25,30,18,A)', .3);
  speckle(ctx, x, y, w, h, 5000, seed + 9, ['rgba(0,0,0,.3)', 'rgba(200,170,130,.1)'], 2);
  drips(ctx, x, y, w, h * .6, seed + 10, 'rgba(22,40,20,A)', 1.4);
  ctx.restore();
}

function path(ctx, pts, ox, oy) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0] + ox, p[1] + oy) : ctx.moveTo(p[0] + ox, p[1] + oy)); }
function pipe(ctx, pts, wd, col, hi) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = wd + 4; path(ctx, pts, 6, 7); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = wd; path(ctx, pts, 0, 0); ctx.stroke();
  ctx.strokeStyle = hi; ctx.lineWidth = Math.max(1.5, wd * .22); path(ctx, pts, -wd * .2, -wd * .2); ctx.stroke();
  ctx.fillStyle = col;
  for (let i = 1; i < pts.length - 1; i++) { ctx.beginPath(); ctx.arc(pts[i][0], pts[i][1], wd * .72, 0, 7); ctx.fill(); }
  ctx.restore();
}

function wood(ctx, x, y, w, h, base, seed, dir) {
  clipRect(ctx, x, y, w, h);
  ctx.fillStyle = base; ctx.fillRect(x, y, w, h);
  const r = rng(seed), n = (dir === 'v' ? w : h) / 2.5;
  ctx.lineWidth = 1;
  for (let i = 0; i < n; i++) {
    ctx.strokeStyle = rgba(0, 0, 0, .05 + r() * .14); ctx.beginPath();
    if (dir === 'v') { const xx = x + r() * w; ctx.moveTo(xx, y); ctx.bezierCurveTo(xx + r() * 8 - 4, y + h * .3, xx + r() * 8 - 4, y + h * .7, xx + r() * 4 - 2, y + h); }
    else { const yy = y + r() * h; ctx.moveTo(x, yy); ctx.bezierCurveTo(x + w * .3, yy + r() * 8 - 4, x + w * .7, yy + r() * 8 - 4, x + w, yy + r() * 4 - 2); }
    ctx.stroke();
  }
  speckle(ctx, x, y, w, h, w * h / 160, seed + 2, ['rgba(0,0,0,.2)', 'rgba(255,220,170,.06)'], 1.5);
  ctx.restore();
}
function bevel(ctx, x, y, w, h, s) {
  s = s || 3;
  ctx.fillStyle = 'rgba(255,230,190,.12)'; ctx.fillRect(x, y, w, s); ctx.fillRect(x, y, s, h);
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(x, y + h - s, w, s); ctx.fillRect(x + w - s, y, s, h);
}
// sombra projetada atrás de um objeto encostado na parede
function castShadow(ctx, x, y, w, h, blur) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.75)'; ctx.shadowBlur = blur || 30; ctx.shadowOffsetX = 14; ctx.shadowOffsetY = 12;
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x, y, w, h); ctx.restore();
}
function floorShadow(ctx, x, w, depth) {
  const g = ctx.createLinearGradient(0, FLOOR - 4, 0, FLOOR + (depth || 40));
  g.addColorStop(0, 'rgba(0,0,0,.8)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(x - 10, FLOOR - 4, w + 30, (depth || 40) + 4);
}
// lâmpada pendurada no fio (o brilho é desenhado pelo motor)
function lamp(ctx, x) {
  ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(x, 0); ctx.bezierCurveTo(x + 3, 60, x - 2, 120, x, 168); ctx.stroke();
  ctx.fillStyle = '#2a2a24'; poly(ctx, [[x - 9, 166], [x + 9, 166], [x + 40, 194], [x - 40, 194]]); ctx.fill();
  ctx.fillStyle = 'rgba(200,190,150,.25)'; poly(ctx, [[x - 9, 166], [x - 3, 166], [x - 30, 194], [x - 40, 194]]); ctx.fill();
  ctx.fillStyle = '#5a5444'; ctx.beginPath(); ctx.ellipse(x, 202, 13, 16, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(220,210,170,.35)'; ctx.beginPath(); ctx.ellipse(x - 4, 198, 4, 7, 0, 0, 7); ctx.fill();
}
// placa de texto pequena desenhada (etiquetas, bilhetes)
function note(ctx, x, y, w, h, rot, col) {
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot || 0);
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-w / 2 + 3, -h / 2 + 4, w, h);
  ctx.fillStyle = col || '#cdbf92'; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = 'rgba(30,40,90,.55)'; ctx.lineWidth = 1.4;
  for (let i = 1; i < Math.max(2, h / 9); i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + 5, -h / 2 + i * 8 + 2); ctx.lineTo(w / 2 - 5 - (i % 3) * 6, -h / 2 + i * 8 + 2); ctx.stroke(); }
  ctx.restore();
}
