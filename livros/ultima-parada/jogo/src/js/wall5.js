// ===== wall5.js — os corredores amarelos (o lado de lá: mofado e encardido) =====
LIGHTS[5] = { x: 800, y: 150, tint: [225, 190, 130], glow: [255, 220, 150], vy: 380 };
LIGHTS[6] = { x: 1110, y: 150, tint: [255, 168, 88], glow: [255, 180, 90], vy: 420 };

// cada cruzamento: aberturas possíveis e o que tem no chão. O certo é sempre à esquerda.
const CORR = [
  { open: ['L', 'F', 'R'], paper: 12, px: 820, py: 790 },   // a página da Cecília, na primeira bifurcação
  { open: ['L', 'F'] },
  { open: ['L', 'R'], paper: 13, pipe: true },                 // o bilhete da Marina, enfiado num cano onde a faixa vira
  { open: ['L', 'F', 'R'] },
];
const CV = { x: 800, y: 400, bx0: 650, bx1: 950, by0: 300, by1: 520 }; // ponto de fuga e fundo

function sideQuad(left, t1, t2, hFrac) { // abertura numa parede lateral, entre profundidades t1 e t2
  const xAt = (t) => left ? CV.bx0 * t : W - (W - CV.bx1) * t;
  const top = (t) => CV.by0 * t, bot = (t) => H - (H - CV.by1) * t;
  const p = (t) => [xAt(t), bot(t) - (bot(t) - top(t)) * hFrac, bot(t)];
  const a = p(t1), b = p(t2);
  return [[a[0], a[1]], [b[0], b[1]], [b[0], b[2]], [a[0], a[2]]];
}
ART[5] = function (ctx, st) {
  const J = CORR[Math.min(st.corr, CORR.length - 1)], r = rng(500 + st.corr);
  // corredor de serviço de 1948: tijolo sem reboco, chão de terra batida, seco. A faixa amarela na altura do ombro.
  const wallL = '#5a3f32', wallR = '#4a3329', ceil = '#2a211b', floorC = '#6a5536';
  ctx.fillStyle = wallL; poly(ctx, [[0, 0], [CV.bx0, CV.by0], [CV.bx0, CV.by1], [0, H]]); ctx.fill();
  ctx.fillStyle = wallR; poly(ctx, [[W, 0], [CV.bx1, CV.by0], [CV.bx1, CV.by1], [W, H]]); ctx.fill();
  ctx.fillStyle = ceil; poly(ctx, [[0, 0], [W, 0], [CV.bx1, CV.by0], [CV.bx0, CV.by0]]); ctx.fill();
  ctx.fillStyle = floorC; poly(ctx, [[0, H], [W, H], [CV.bx1, CV.by1], [CV.bx0, CV.by1]]); ctx.fill();
  // fiadas de tijolo em perspectiva, dos dois lados
  const brickWall = (left) => {
    const xAt = (t) => left ? CV.bx0 * t : W - (W - CV.bx1) * t;
    const top = (t) => CV.by0 * t, bot = (t) => H - (H - CV.by1) * t;
    ctx.strokeStyle = 'rgba(25,15,10,.55)'; ctx.lineWidth = 2;
    for (let k = 0; k <= 14; k++) { const f = k / 14; ctx.beginPath(); ctx.moveTo(xAt(0), top(0) + (bot(0) - top(0)) * f); ctx.lineTo(xAt(1), top(1) + (bot(1) - top(1)) * f); ctx.stroke(); }
    for (let i = 1; i < 26; i++) { const t = 1 - Math.pow(1 - i / 26, 1.8); const x = xAt(t); ctx.strokeStyle = 'rgba(25,15,10,.35)';
      for (let k = (i % 2); k < 14; k += 2) { const y0 = top(t) + (bot(t) - top(t)) * k / 14, y1 = top(t) + (bot(t) - top(t)) * (k + 1) / 14; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); } }
    // a faixa amarela de Marina, na altura do ombro, tinta de parede com pincel grosso
    const hf0 = .5, hf1 = .58;
    ctx.fillStyle = 'rgba(214,176,52,.85)';
    poly(ctx, [[xAt(0), top(0) + (bot(0) - top(0)) * hf0], [xAt(1), top(1) + (bot(1) - top(1)) * hf0], [xAt(1), top(1) + (bot(1) - top(1)) * hf1], [xAt(0), top(0) + (bot(0) - top(0)) * hf1]]); ctx.fill();
    for (let i = 0; i < 40; i++) { const t = r(); const y = top(t) + (bot(t) - top(t)) * (hf0 + (r() - .5) * .02); ctx.strokeStyle = `rgba(${200 + r() * 40 | 0},${160 + r() * 40 | 0},40,.35)`; ctx.lineWidth = 1 + r() * 2; ctx.beginPath(); ctx.moveTo(xAt(t), y); ctx.lineTo(xAt(Math.min(1, t + .03)), y + (r() - .5) * 4); ctx.stroke(); }
  };
  brickWall(true); brickWall(false);
  // fundo: continua (frente aberta) ou parede de tijolo
  if (J.open.includes('F')) {
    ctx.fillStyle = '#3a2820'; ctx.fillRect(CV.bx0, CV.by0, CV.bx1 - CV.bx0, CV.by1 - CV.by0);
    ctx.fillStyle = '#2a1c15'; poly(ctx, [[CV.bx0, CV.by0], [770, 380], [770, 430], [CV.bx0, CV.by1]]); ctx.fill();
    ctx.fillStyle = '#231710'; poly(ctx, [[CV.bx1, CV.by0], [830, 380], [830, 430], [CV.bx1, CV.by1]]); ctx.fill();
    ctx.fillStyle = '#0b0904'; ctx.fillRect(770, 380, 60, 50);
  } else { ctx.fillStyle = '#4e362b'; ctx.fillRect(CV.bx0, CV.by0, CV.bx1 - CV.bx0, CV.by1 - CV.by0); stain(ctx, 800, 420, 120, 90, 'rgba(40,25,15,A)', .6);
    ctx.fillStyle = 'rgba(214,176,52,.8)'; ctx.fillRect(CV.bx0, CV.by0 + (CV.by1 - CV.by0) * .5, CV.bx1 - CV.bx0, (CV.by1 - CV.by0) * .08); }
  for (const side of ['L', 'R']) {
    if (!J.open.includes(side)) continue;
    const q = sideQuad(side === 'L', .38, .62, .78);
    ctx.fillStyle = '#0e0905'; poly(ctx, q); ctx.fill();
    const g = ctx.createLinearGradient(q[0][0], 0, q[1][0], 0);
    g.addColorStop(0, 'rgba(200,150,70,.2)'); g.addColorStop(1, 'rgba(200,150,70,0)'); ctx.fillStyle = g; poly(ctx, q); ctx.fill();
    ctx.strokeStyle = 'rgba(20,12,6,.8)'; ctx.lineWidth = 4; poly(ctx, q); ctx.stroke();
    // a faixa vira para a esquerda: entra na abertura da esquerda e acaba antes da direita
    if (side === 'L') { ctx.fillStyle = 'rgba(214,176,52,.85)'; poly(ctx, [[q[0][0] - 30, q[0][1] + (q[3][1] - q[0][1]) * .5], [q[0][0] + 10, q[0][1] + (q[3][1] - q[0][1]) * .5], [q[0][0] + 10, q[0][1] + (q[3][1] - q[0][1]) * .58], [q[0][0] - 30, q[0][1] + (q[3][1] - q[0][1]) * .58]]); ctx.fill(); }
  }
  // lâmpadas nuas penduradas no fio
  for (const t of [.15, .45, .72]) {
    const y = CV.by0 * t + 8, x = CV.x + (t - .45) * 30;
    ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, y); ctx.stroke();
    ctx.fillStyle = '#e8d8a4'; ctx.beginPath(); ctx.arc(x, y + 10 * (1 - t), 8 * (1 - t) + 3, 0, 7); ctx.fill();
  }
  // poeira, terra, teias
  for (let i = 0; i < 30; i++) stain(ctx, r() * W, r() * H, 40 + r() * 140, 30 + r() * 110, 'rgba(30,20,12,A)', .2 + r() * .2);
  for (let i = 0; i < 10; i++) stain(ctx, r() * W, 760 + r() * 140, 80 + r() * 200, 20 + r() * 30, 'rgba(60,45,25,A)', .5);
  speckle(ctx, 0, 0, W, H, 9000, 530 + st.corr, ['rgba(20,12,6,.3)', 'rgba(210,170,110,.1)', 'rgba(90,60,30,.25)'], 2.5);
  speckle(ctx, 0, CV.by1, W, H - CV.by1, 3000, 540 + st.corr, ['rgba(0,0,0,.3)', 'rgba(180,150,100,.15)'], 3);
  if (J.pipe || st.corr % 2) pipe(ctx, [[W, 150], [CV.bx1 + 30, CV.by0 + 30]], 12, '#5a5440', 'rgba(230,220,180,.25)');
  // o que está no chão
  if (J.paper === 12 && !st.papers.has(12)) { ctx.save(); ctx.translate(J.px, J.py); ctx.rotate(.3); ctx.fillStyle = '#bdb391'; ctx.fillRect(-36, -22, 72, 44); ctx.fillStyle = 'rgba(40,50,90,.35)'; ctx.fillRect(-28, -12, 50, 3); ctx.fillRect(-28, -2, 40, 3); ctx.restore(); }
  if (J.paper === 13 && !st.papers.has(13)) note(ctx, 1200, 190, 56, 70, .25, '#a99c74');
};
EMIT[5] = function (ctx, st, t) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  [.15, .45, .72].forEach((tt, i) => {
    let a = .18; if (i === 1 && (t % 3700) < 260) a = Math.random() * .06; // uma delas pisca
    const y = CV.by0 * tt + 10, x = CV.x + (tt - .45) * 30, half = (1 - tt) * 200 + 40;
    const g = ctx.createRadialGradient(x, y, 0, x, y, half * 1.3);
    g.addColorStop(0, `rgba(255,220,150,${a})`); g.addColorStop(1, 'rgba(255,220,150,0)');
    ctx.fillStyle = g; ctx.fillRect(x - half * 1.3, y - half * 1.3, half * 2.6, half * 2.6);
  });
  ctx.restore();
};

// ===== a última parada: réplica do ponto da Cardoso de Almeida, do lado de lá =====
ART[6] = function (ctx, st) {
  ctx.fillStyle = '#050608'; ctx.fillRect(0, 0, W, H);
  const r = rng(601);
  for (let i = 0; i < 9; i++) { const x = i * 190 - 40, h = 180 + r() * 160; ctx.fillStyle = i % 2 ? '#0e0e0c' : '#121210'; ctx.fillRect(x, 470 - h, 180, h);
    if (r() < .4) { ctx.fillStyle = 'rgba(160,130,60,.18)'; ctx.fillRect(x + 40 + r() * 80, 470 - h + 40, 22, 30); } }
  ctx.fillStyle = '#141414'; ctx.fillRect(0, 470, W, 160);
  ctx.fillStyle = 'rgba(255,170,80,.08)'; for (let i = 0; i < 12; i++) ctx.fillRect(r() * W, 520 + r() * 90, 60 + r() * 140, 3);
  ctx.fillStyle = '#5a5a54'; ctx.fillRect(0, 630, W, 14);
  ctx.fillStyle = '#26251f'; ctx.fillRect(0, 644, W, H - 644);
  speckle(ctx, 0, 644, W, H - 644, 4000, 602, ['rgba(0,0,0,.4)', 'rgba(150,140,110,.1)', 'rgba(40,60,25,.3)'], 2.5);
  for (let i = 0; i < 12; i++) stain(ctx, r() * W, 700 + r() * 200, 120, 20, 'rgba(20,30,12,A)', .5);
  // poste de luz de sódio
  ctx.fillStyle = '#1d1c18'; ctx.fillRect(1104, 150, 12, 500); ctx.fillRect(1060, 140, 70, 10);
  ctx.fillStyle = '#3a3226'; ctx.fillRect(1052, 136, 30, 16);
  // placa de parada
  ctx.fillStyle = '#2a2a26'; ctx.fillRect(420, 330, 8, 310);
  ctx.fillStyle = '#c9c4b2'; ctx.fillRect(370, 290, 110, 70); ctx.fillStyle = '#1d3a7a'; ctx.fillRect(374, 294, 102, 24);
  ctx.fillStyle = '#e9e5d6'; ctx.font = 'bold 15px Arial'; ctx.fillText('PARADA', 393, 312);
  ctx.fillStyle = '#26251f'; ctx.font = 'bold 13px Arial'; ctx.fillText('875A-10', 395, 340);
  stain(ctx, 450, 330, 30, 20, 'rgba(40,30,10,A)', .6);
  // banco de concreto
  ctx.fillStyle = '#4a4943'; ctx.fillRect(560, 600, 480, 28); ctx.fillStyle = '#3a3934'; ctx.fillRect(590, 628, 30, 60); ctx.fillRect(980, 628, 30, 60);
  ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(560, 688, 480, 14);
  // a Cecília sentada, quase toda no escuro
  if (!st.flags.won) {
    ctx.fillStyle = '#16161a'; ctx.beginPath(); ctx.ellipse(800, 560, 48, 70, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#1b1a1e'; ctx.fillRect(764, 596, 80, 30); ctx.fillRect(770, 620, 22, 70); ctx.fillRect(812, 620, 22, 70);
    ctx.fillStyle = '#0d0b0a'; ctx.beginPath(); ctx.ellipse(800, 470, 30, 36, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#2c241e'; ctx.beginPath(); ctx.ellipse(806, 476, 20, 26, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#0b0908'; ctx.beginPath(); ctx.moveTo(772, 456); ctx.quadraticCurveTo(800, 420, 830, 452); ctx.lineTo(838, 520); ctx.lineTo(826, 480); ctx.lineTo(778, 480); ctx.lineTo(766, 520); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#6b5a40'; ctx.fillRect(770, 576, 66, 30); ctx.fillStyle = '#50432f'; ctx.fillRect(770, 576, 66, 6);
  }
  // bilhete do Aurélio no banco
  if (!st.papers.has(14)) { ctx.save(); ctx.translate(950, 598); ctx.rotate(-.12); ctx.fillStyle = '#9d9478'; ctx.fillRect(-26, -10, 52, 14); ctx.restore(); }
};
EMIT[6] = function (ctx) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(1080, 150, 0, 1080, 150, 520);
  g.addColorStop(0, 'rgba(255,160,70,.55)'); g.addColorStop(.08, 'rgba(255,150,60,.25)'); g.addColorStop(1, 'rgba(255,140,50,0)');
  ctx.fillStyle = g; ctx.fillRect(560, 0, 1040, 760);
  ctx.restore();
};
