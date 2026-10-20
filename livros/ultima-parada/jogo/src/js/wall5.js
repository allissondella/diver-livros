// ===== wall5.js — os corredores amarelos (o lado de lá: mofado e encardido) =====
LIGHTS[5] = { x: 800, y: 120, tint: [235, 215, 150], glow: [250, 245, 210], vy: 380 };
LIGHTS[6] = { x: 1110, y: 150, tint: [255, 168, 88], glow: [255, 180, 90], vy: 420 };

// cada cruzamento: aberturas possíveis e o que tem no chão. O certo é sempre à esquerda.
const CORR = [
  { open: ['L', 'F', 'R'], obj: { id: 'brinco', x: 740, y: 780, label: 'Brinco', text: 'Um brinco de argola, prateado. A Cecília usava esse. Você guarda no bolso.' } },
  { open: ['L', 'F'], obj: { id: 'elastico', x: 880, y: 800, label: 'Elástico de cabelo', text: 'Um elástico de cabelo, roxo, enrolado. Dela. Ela passou por aqui.' } },
  { open: ['L', 'R'], paper: 12, px: 820, py: 790 },
  { open: ['L', 'F', 'R'], paper: 13, pipe: true },
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
  const wallL = '#a88a35', wallR = '#8a7029', ceil = '#c9b468', floorC = '#4e3f1c';
  ctx.fillStyle = wallL; poly(ctx, [[0, 0], [CV.bx0, CV.by0], [CV.bx0, CV.by1], [0, H]]); ctx.fill();
  ctx.fillStyle = wallR; poly(ctx, [[W, 0], [CV.bx1, CV.by0], [CV.bx1, CV.by1], [W, H]]); ctx.fill();
  ctx.fillStyle = ceil; poly(ctx, [[0, 0], [W, 0], [CV.bx1, CV.by0], [CV.bx0, CV.by0]]); ctx.fill();
  ctx.fillStyle = floorC; poly(ctx, [[0, H], [W, H], [CV.bx1, CV.by1], [CV.bx0, CV.by1]]); ctx.fill();
  // fundo: continua (frente aberta) ou parede com mancha
  if (J.open.includes('F')) {
    ctx.fillStyle = '#7d6626'; ctx.fillRect(CV.bx0, CV.by0, CV.bx1 - CV.bx0, CV.by1 - CV.by0);
    ctx.fillStyle = '#5a491b'; poly(ctx, [[CV.bx0, CV.by0], [770, 380], [770, 430], [CV.bx0, CV.by1]]); ctx.fill();
    ctx.fillStyle = '#4a3c15'; poly(ctx, [[CV.bx1, CV.by0], [830, 380], [830, 430], [CV.bx1, CV.by1]]); ctx.fill();
    ctx.fillStyle = '#0b0904'; ctx.fillRect(770, 380, 60, 50);
  } else { ctx.fillStyle = '#9b7f30'; ctx.fillRect(CV.bx0, CV.by0, CV.bx1 - CV.bx0, CV.by1 - CV.by0); stain(ctx, 800, 420, 120, 90, 'rgba(40,45,20,A)', .6); }
  for (const side of ['L', 'R']) {
    if (!J.open.includes(side)) continue;
    const q = sideQuad(side === 'L', .38, .62, .78);
    ctx.fillStyle = '#120e05'; poly(ctx, q); ctx.fill();
    const g = ctx.createLinearGradient(q[0][0], 0, q[1][0], 0);
    g.addColorStop(0, 'rgba(200,170,70,.25)'); g.addColorStop(1, 'rgba(200,170,70,0)'); ctx.fillStyle = g; poly(ctx, q); ctx.fill();
    ctx.strokeStyle = 'rgba(30,22,8,.8)'; ctx.lineWidth = 4; poly(ctx, q); ctx.stroke();
  }
  // luminárias fluorescentes no teto (o brilho vem do EMIT)
  for (const t of [.15, .45, .72]) {
    const y = CV.by0 * t + 8, half = (1 - t) * 220 + 40;
    ctx.fillStyle = '#e8e2c4'; ctx.fillRect(CV.x - half, y, half * 2, (1 - t) * 16 + 4);
  }
  // mofo, infiltração, carpete úmido
  for (let i = 0; i < 40; i++) stain(ctx, r() * W, r() * H, 40 + r() * 140, 30 + r() * 110, 'rgba(45,50,22,A)', .25 + r() * .2);
  for (let i = 0; i < 10; i++) stain(ctx, r() * W, 760 + r() * 140, 80 + r() * 200, 20 + r() * 30, 'rgba(15,12,4,A)', .5);
  drips(ctx, 0, 0, W, 420, 520 + st.corr, 'rgba(40,36,14,A)', 1.2);
  speckle(ctx, 0, 0, W, H, 9000, 530 + st.corr, ['rgba(30,26,10,.3)', 'rgba(210,190,120,.12)', 'rgba(40,60,25,.25)'], 2.5);
  if (J.pipe || st.corr % 2) pipe(ctx, [[W, 150], [CV.bx1 + 30, CV.by0 + 30]], 12, '#5a5440', 'rgba(230,220,180,.25)');
  // o que está no chão
  if (J.obj && !st.found[J.obj.id]) {
    ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.ellipse(J.obj.x + 4, J.obj.y + 8, 22, 6, 0, 0, 7); ctx.fill();
    if (J.obj.id === 'brinco') { ctx.strokeStyle = '#d9d6cc'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(J.obj.x, J.obj.y, 12, 0, 7); ctx.stroke(); }
    else { ctx.strokeStyle = '#6d3a8c'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(J.obj.x, J.obj.y, 16, 7, .3, 0, 7); ctx.stroke(); }
  }
  if (J.paper === 12 && !st.papers.has(12)) { ctx.save(); ctx.translate(J.px, J.py); ctx.rotate(.3); ctx.fillStyle = '#bdb391'; ctx.fillRect(-36, -22, 72, 44); ctx.fillStyle = 'rgba(40,50,90,.35)'; ctx.fillRect(-28, -12, 50, 3); ctx.fillRect(-28, -2, 40, 3); ctx.restore(); }
  if (J.paper === 13 && !st.papers.has(13)) note(ctx, 1200, 190, 56, 70, .25, '#a99c74');
};
EMIT[5] = function (ctx, st, t) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  [.15, .45, .72].forEach((tt, i) => {
    let a = .22; if (i === 1 && (t % 3700) < 260) a = Math.random() * .08; // uma delas pisca
    const y = CV.by0 * tt + 10, half = (1 - tt) * 220 + 40;
    const g = ctx.createRadialGradient(CV.x, y, 0, CV.x, y, half * 1.4);
    g.addColorStop(0, `rgba(255,250,220,${a})`); g.addColorStop(1, 'rgba(255,250,220,0)');
    ctx.fillStyle = g; ctx.fillRect(CV.x - half * 1.4, y - half * 1.4, half * 2.8, half * 2.8);
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
