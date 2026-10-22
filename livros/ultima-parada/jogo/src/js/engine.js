// ===== engine.js — estado, tela, luz, lanterna, relógio, cliques =====
const S = {};
function resetState() {
  Object.assign(S, {
    view: 0, started: false, ended: false,
    fuse: false, fuseTaken: false, power: false, powerAt: 0,
    inv: [], sel: null, cp: null, tvOn: false, blackoutUntil: 0, papers: new Set(), seen: new Set(), flags: {},
    open: { gav1: false, gav2: false, gav3: false, esc: false, oficina: false, estante: false }, corr: 0, found: {}, caixaAt: 0, dropPauseUntil: 0,
    lockVals: { gav1: ['M', 'Z', 'K', 'Q'] },
    t0: 0, nextFlick: 0, flickUntil: 0, battUntil: 0, nextBatt: 0,
  });
}
resetState();

// a ficção vai de 02:05 a 05:10 (185 min) em 60 minutos reais: do lado de lá a hora passa mais rápido
// (no livro, o relógio para enquanto a pessoa lê)
const START_MIN = 125, END_MIN = 310, REAL_MIN = 60;
function fictionMin() {
  if (!S.started) return START_MIN;
  const real = (performance.now() - S.t0) / 60000;
  return Math.min(END_MIN, START_MIN + real * (END_MIN - START_MIN) / REAL_MIN);
}
function clockText() {
  const m = Math.floor(fictionMin());
  return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}

const $ = (id) => document.getElementById(id);
const stage = $('stage'), cv = $('scr'), cx = cv.getContext('2d'), hud = $('hud');
const box = { x: 0, y: 0, w: W, h: H };
function fit() {
  const r = stage.getBoundingClientRect(), s = Math.min(r.width / W, r.height / H);
  box.w = Math.round(W * s); box.h = Math.round(H * s);
  box.x = Math.round((r.width - box.w) / 2); box.y = Math.round((r.height - box.h) / 2);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(box.w * dpr); cv.height = Math.round(box.h * dpr);
  Object.assign(cv.style, { left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px' });
  hud.style.setProperty('--gx', box.x + 'px'); hud.style.setProperty('--gy', box.y + 'px');
  hud.style.setProperty('--gw', box.w + 'px'); hud.style.setProperty('--gh', box.h + 'px');
}
window.addEventListener('resize', fit);

// cada parede é desenhada uma vez e guardada até o estado mudar
const cache = [null, null, null, null], uvCache = [null, null, null, null];
function dirty(v) { if (v == null) { cache.fill(null); uvCache.fill(null); } else { cache[v] = null; uvCache[v] = null; } }
// camada do que só aparece na luz negra (UVMARKS vem de wave2.js)
function uvLayer(v) {
  if (!uvCache[v]) { const c = mk(W, H); if (typeof UVMARKS !== 'undefined' && UVMARKS[v]) UVMARKS[v](c.getContext('2d'), S); uvCache[v] = c; }
  return uvCache[v];
}
function scene(v) {
  if (!cache[v]) { const c = mk(W, H); ART[v](c.getContext('2d'), S); cache[v] = c; }
  return cache[v];
}

// ——— luz ———
const ptr = { x: W * .5, y: H * .55 }, beam = { x: W * .5, y: H * .55 };
const BEAM_R = 175;
const mask = mk(W / 2, H / 2), mg = mask.getContext('2d');

function drawDark(g, t) {
  const k = mask.width / W, uv = S.sel === 'uv';
  const bx = (beam.x + Math.sin(t / 130) * 2 + Math.sin(t / 47) * 1.3) * k, by = (beam.y + Math.cos(t / 170) * 2) * k;
  // a pilha está fraca: de vez em quando a lanterna engasga
  if (t > S.nextBatt) { S.battUntil = t + 180 + Math.random() * 420; S.nextBatt = t + 14000 + Math.random() * 26000; }
  let R = BEAM_R * (1 + Math.sin(t / 900) * .03), A = 1;
  if (t < S.battUntil) { A = Math.random() < .5 ? .25 : .7; R *= .9; }
  if (uv) { A *= .4; R *= .85; }
  mg.globalCompositeOperation = 'source-over';
  mg.clearRect(0, 0, mask.width, mask.height);
  mg.fillStyle = 'rgba(1,1,0,.988)'; mg.fillRect(0, 0, mask.width, mask.height);
  mg.globalCompositeOperation = 'destination-out';
  const rg = mg.createRadialGradient(bx, by, 0, bx, by, R * k);
  rg.addColorStop(0, `rgba(0,0,0,${A})`); rg.addColorStop(.45, `rgba(0,0,0,${.9 * A})`);
  rg.addColorStop(.8, `rgba(0,0,0,${.3 * A})`); rg.addColorStop(1, 'rgba(0,0,0,0)');
  mg.fillStyle = rg; mg.beginPath(); mg.arc(bx, by, R * k, 0, 7); mg.fill();
  const rg2 = mg.createRadialGradient(bx, by, 0, bx, by, R * 2.1 * k);
  rg2.addColorStop(0, `rgba(0,0,0,${.08 * A})`); rg2.addColorStop(1, 'rgba(0,0,0,0)');
  mg.fillStyle = rg2; mg.beginPath(); mg.arc(bx, by, R * 2.1 * k, 0, 7); mg.fill();
  g.drawImage(mask, 0, 0, W, H);
  g.save(); g.globalCompositeOperation = 'soft-light';
  const w = g.createRadialGradient(bx / k, by / k, 0, bx / k, by / k, R);
  if (uv) { w.addColorStop(0, 'rgba(120,60,255,.9)'); w.addColorStop(1, 'rgba(120,60,255,0)'); }
  else { w.addColorStop(0, `rgba(255,214,140,${.5 * A})`); w.addColorStop(1, 'rgba(255,214,140,0)'); }
  g.fillStyle = w; g.fillRect(bx / k - R, by / k - R, R * 2, R * 2); g.restore();
}

function drawLit(g, t) {
  // lâmpada velha: acende devagar, oscila e às vezes pisca
  let f = .92 + Math.sin(t / 1300) * .02 + Math.sin(t / 77) * .008;
  const since = t - S.powerAt;
  if (since < 1800) f *= (since < 300 ? .15 : since < 520 ? .7 : since < 700 ? .25 : Math.min(1, since / 1800));
  if (t > S.nextFlick) { S.flickUntil = t + 100 + Math.random() * 300; S.nextFlick = t + 9000 + Math.random() * 22000; }
  if (t < S.flickUntil) f *= Math.random() < .5 ? .3 : .75;
  if (t < S.blackoutUntil) f *= (S.blackoutUntil - t > 1200 || Math.random() < .3) ? .03 : .4;
  const L = (typeof LIGHTS !== 'undefined' && LIGHTS[S.view]) || { x: LAMP_X[S.view], y: 205, tint: [245, 188, 112], glow: [255, 225, 160], vy: 430 };
  const lx = L.x, ly = L.y;
  g.save();
  g.globalCompositeOperation = 'multiply';
  g.fillStyle = `rgb(${L.tint[0] * f | 0},${L.tint[1] * f | 0},${L.tint[2] * f | 0})`; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'source-over';
  const v = g.createRadialGradient(lx, L.vy || 430, 90, lx, L.vy || 430, 1250);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(.38, `rgba(0,0,0,${Math.min(.9, .32 + (1 - f) * .8)})`); v.addColorStop(1, 'rgba(0,0,0,.95)');
  g.fillStyle = v; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'lighter';
  const b = g.createRadialGradient(lx, ly, 0, lx, ly, 170);
  const [gr, gg2, gb] = L.glow || [255, 225, 160];
  b.addColorStop(0, `rgba(${gr},${gg2},${gb},${.9 * f})`); b.addColorStop(.1, `rgba(${gr},${gg2 - 35},${gb - 50},${.35 * f})`); b.addColorStop(1, `rgba(${gr},${gg2 - 55},${gb - 70},0)`);
  g.fillStyle = b; g.fillRect(lx - 170, ly - 170, 340, 340);
  g.restore();
}

// granulação de filme velho
const grains = [];
for (let i = 0; i < 5; i++) {
  const c = mk(400, 225), gg = c.getContext('2d'), d = gg.createImageData(400, 225);
  for (let p = 0; p < d.data.length; p += 4) { const v = Math.random() * 255; d.data[p] = d.data[p + 1] = d.data[p + 2] = v; d.data[p + 3] = Math.random() < .55 ? 40 : 0; }
  gg.putImageData(d, 0, 0); grains.push(c);
}
function drawGrain(g, t) {
  const n = grains[(t / 70 | 0) % grains.length];
  g.save(); g.globalCompositeOperation = 'overlay'; g.globalAlpha = .45; g.drawImage(n, 0, 0, W, H);
  g.globalCompositeOperation = 'source-over'; g.globalAlpha = .05; g.drawImage(n, 0, 0, W, H); g.restore();
}

// luz negra: só revela a camada UV dentro do círculo roxo
const uvTmp = mk(W, H), ut = uvTmp.getContext('2d');
function drawUV(g) {
  const x = beam.x, y = beam.y, R = 150;
  ut.globalCompositeOperation = 'source-over'; ut.clearRect(0, 0, W, H);
  ut.drawImage(uvLayer(S.view), 0, 0);
  ut.globalCompositeOperation = 'destination-in';
  const m = ut.createRadialGradient(x, y, 0, x, y, R);
  m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(.65, 'rgba(0,0,0,.85)'); m.addColorStop(1, 'rgba(0,0,0,0)');
  ut.fillStyle = m; ut.fillRect(0, 0, W, H);
  g.save(); g.globalCompositeOperation = 'lighter'; g.drawImage(uvTmp, 0, 0);
  const v = g.createRadialGradient(x, y, 0, x, y, R);
  v.addColorStop(0, 'rgba(90,30,220,.32)'); v.addColorStop(1, 'rgba(90,30,220,0)');
  g.fillStyle = v; g.fillRect(x - R, y - R, 2 * R, 2 * R); g.restore();
}

// coisas que se mexem antes da luz ser aplicada (a goteira na lata)
function drawDyn(g, t) {
  if (S.view !== 0 || t < S.dropPauseUntil) return;
  const cyc = t % 11000;
  if (cyc < 650) { const y = 104 + (cyc / 650) ** 2 * 546; g.fillStyle = 'rgba(190,200,190,.6)'; g.beginPath(); g.ellipse(723, y, 2, 4, 0, 0, 7); g.fill(); }
  else if (cyc < 900) { const r = (cyc - 650) / 250 * 22; g.strokeStyle = `rgba(190,200,190,${.5 - r / 50})`; g.lineWidth = 1; g.beginPath(); g.ellipse(723, 652, r, r / 4, 0, 0, 7); g.stroke(); }
}

// ——— pontos clicáveis ———
const SPOTS = [];
function spot(view, id, rect, o) { SPOTS.push(Object.assign({ view, id, rect }, o)); }
function hitSpot(p) {
  for (let i = SPOTS.length - 1; i >= 0; i--) {
    const s = SPOTS[i];
    if (s.view !== S.view || (s.when && !s.when())) continue;
    const [x, y, w, h] = typeof s.rect === 'function' ? s.rect() : s.rect;
    if (p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h) return s;
  }
  return null;
}
function litNow() { return S.power || S.view >= 5; }
function visibleAt(p) { return litNow() || Math.hypot(p.x - beam.x, p.y - beam.y) < BEAM_R * .9; }
function toLogical(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; }
function overlayOpen() { return !!document.querySelector('.ov:not([hidden])'); }

let hoverSpot = null;
function updateLabel() {
  const s = overlayOpen() ? null : hitSpot(ptr), ok = s && visibleAt(ptr);
  hoverSpot = ok ? s : null;
  const txt = ok ? (typeof s.label === 'function' ? s.label() : s.label) : '';
  const lab = $('label');
  const pre = S.sel && S.sel !== 'uv' && ok ? `Usar ${ITEMS[S.sel].name.toLowerCase()} em: ` : '';
  if (lab.textContent !== pre + txt) lab.textContent = pre + txt;
  cv.style.cursor = S.sel === 'uv' || !litNow() ? (ok ? 'crosshair' : 'none') : (ok ? 'pointer' : 'default');
}

cv.addEventListener('pointermove', (e) => { const p = toLogical(e); ptr.x = p.x; ptr.y = p.y; });
cv.addEventListener('pointerdown', (e) => {
  const p = toLogical(e); ptr.x = p.x; ptr.y = p.y;
  if (e.pointerType !== 'mouse') { beam.x = p.x; beam.y = p.y; }
  if (!S.started || S.ended || overlayOpen() || fadeDir) return;
  const s = hitSpot(p);
  if (!s || !visibleAt(p)) { if (S.sel) selectItem(null); return; }
  if (S.sel) {
    if (s.use && s.use(S.sel) !== false) return;
    // a luz negra é luz, não ferramenta: sem uso específico, examina normalmente
    if (S.sel !== 'uv') { say('Isso não serve aí.'); return; }
  }
  if (s.act) s.act();
});

// ——— virar entre as paredes ———
let fade = 0, fadeDir = 0, pendingView = 0;
function turn(d) {
  if (fadeDir || !S.started || overlayOpen() || S.view > 3) return;
  const v = (S.view + d + 4) % 4;
  if (!S.power && v >= 2) { say(v === 2 ? 'Para esse lado, a lanterna não alcança nada: só o escuro e o barulho dos canos. Primeiro, a luz.' : 'Escuro fechado. A lanterna fraca não chega lá. Primeiro, a luz.'); return; }
  goView(v);
}
// troca de cena com escurecida (também entra na oficina, no corredor, no ponto)
function goView(v, after) { if (fadeDir) return; pendingView = v; fadeDir = 1; hideMsg(); goView.after = after || null; }
$('turnL').addEventListener('click', () => turn(-1));
$('turnR').addEventListener('click', () => turn(1));
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') { if (e.key === 'Escape') closeOv(); return; }
  if (e.key === 'Escape') { closeOv(); selectItem(null); }
  else if (e.key === 'ArrowLeft' || e.key === 'a') turn(-1);
  else if (e.key === 'ArrowRight' || e.key === 'd') turn(1);
  else if (e.key === 'c' && S.started) openNotes();
  else if (e.key === 'l' && S.started) openTimeline();
});

// ——— laço principal ———
let lastLabel = 0;
function frame(t) {
  requestAnimationFrame(frame);
  if (!S.started) return;
  if (fadeDir === 1) { fade += .16; if (fade >= 1) { fade = 1; S.view = pendingView; $('viewName').textContent = VIEWS[S.view]; fadeDir = -1; syncNav(); if (goView.after) { const a = goView.after; goView.after = null; a(); } } }
  else if (fadeDir === -1) { fade -= .1; if (fade <= 0) { fade = 0; fadeDir = 0; } }
  const g = cx;
  g.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
  beam.x += (ptr.x - beam.x) * .2; beam.y += (ptr.y - beam.y) * .2;
  g.drawImage(scene(S.view), 0, 0);
  drawDyn(g, t);
  if (litNow()) drawLit(g, t); else drawDark(g, t);
  EMIT[S.view](g, S, t);
  if (S.sel === 'uv') drawUV(g);
  drawGrain(g, t);
  if (fade > 0) { g.fillStyle = `rgba(0,0,0,${fade})`; g.fillRect(0, 0, W, H); }
  if (t - lastLabel > 90) { lastLabel = t; updateLabel(); tickClock(); }
}
const TICKS = []; // verificações periódicas das ondas (ex.: evento das 03:40)
function tickClock() {
  TICKS.forEach(f => f());
  { const c = $('clock'); const txt = clockText(); if (c.textContent !== txt) c.textContent = txt; }
  if (!S.ended && fictionMin() >= END_MIN) endBad();
}
