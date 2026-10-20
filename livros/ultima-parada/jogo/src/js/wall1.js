// ===== wall1.js — parede da estante (Barsa, porquinho, pintura de Marina, fusível) =====
function shelfFrame(ctx, x, y, w, h, shelves) {
  castShadow(ctx, x, y, w, h, 40);
  wood(ctx, x, y, w, h, '#160e07', 41, 'v');
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(x, y, w, h);
  for (const sy of shelves) { wood(ctx, x, sy, w, 16, '#3b2614', 42 + sy, 'h'); bevel(ctx, x, sy, w, 16, 2);
    const g = ctx.createLinearGradient(0, sy + 16, 0, sy + 50); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x, sy + 16, w, 34); }
  wood(ctx, x, y, 22, h, '#3a2513', 45, 'v'); wood(ctx, x + w - 22, y, 22, h, '#3a2513', 46, 'v');
  bevel(ctx, x, y, 22, h, 2); bevel(ctx, x + w - 22, y, 22, h, 2);
}
function porquinho(ctx, x, y) { // x,y = centro do corpo
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(x + 6, y + 28, 46, 6, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#7d4126';
  for (const lx of [-28, -10, 12, 28]) ctx.fillRect(x + lx - 5, y + 10, 10, 18);
  ctx.beginPath(); ctx.ellipse(x, y, 48, 27, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x - 50, y - 2, 10, 13, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#5c2e19'; ctx.beginPath(); ctx.ellipse(x - 52, y - 2, 4, 8, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#7d4126'; poly(ctx, [[x - 34, y - 20], [x - 26, y - 40], [x - 18, y - 22]]); ctx.fill();
  ctx.fillStyle = '#1a0d06'; ctx.fillRect(x - 4, y - 27, 22, 3);
  ctx.fillStyle = 'rgba(255,210,170,.18)'; ctx.beginPath(); ctx.ellipse(x - 10, y - 12, 26, 8, -.2, 0, 7); ctx.fill();
  ctx.fillStyle = '#e8d7a0'; ctx.beginPath(); ctx.arc(x + 14, y - 4, 4, 0, 7); ctx.arc(x + 26, y + 2, 3, 0, 7); ctx.fill();
}

// a estante girada: vira de lado e mostra um corredor curto de concreto e a fresta amarela
function drawEstanteAberta(ctx) {
  ctx.fillStyle = '#030303'; ctx.fillRect(520, 120, 600, FLOOR - 120);
  ctx.fillStyle = '#17150f'; poly(ctx, [[540, 130], [700, 300], [700, 600], [540, FLOOR]]); ctx.fill();
  ctx.fillStyle = '#100e0a'; poly(ctx, [[1040, 130], [880, 300], [880, 600], [1040, FLOOR]]); ctx.fill();
  ctx.fillStyle = '#0b0a07'; poly(ctx, [[540, FLOOR], [1040, FLOOR], [880, 600], [700, 600]]); ctx.fill();
  ctx.fillStyle = '#0a0907'; ctx.fillRect(700, 300, 180, 300);
  const g = ctx.createLinearGradient(760, 0, 820, 0);
  g.addColorStop(0, 'rgba(230,190,70,0)'); g.addColorStop(.5, 'rgba(240,205,90,.95)'); g.addColorStop(1, 'rgba(230,190,70,0)');
  ctx.fillStyle = g; poly(ctx, [[784, 318], [800, 316], [806, 590], [778, 592]]); ctx.fill();
  speckle(ctx, 540, 130, 500, 590, 2500, 140, ['rgba(60,50,30,.4)', 'rgba(0,0,0,.4)'], 2);
  // a própria estante, girada de lado, encostada à direita
  castShadow(ctx, 1080, 120, 50, FLOOR - 120, 30);
  wood(ctx, 1076, 116, 58, FLOOR - 112, '#2c1c0e', 147, 'v'); bevel(ctx, 1076, 116, 58, FLOOR - 112, 3);
  for (const sy of [120, 250, 380, 510, 640]) { ctx.fillStyle = '#4a3119'; ctx.fillRect(1076, sy, 58, 10); }
}
ART[1] = function (ctx, st) {
  plaster(ctx, 0, WALL_TOP, W, FLOOR - WALL_TOP, 101);
  ceiling(ctx, 102);
  floor(ctx, 103);
  pipe(ctx, [[1600, 108], [1145, 108], [1145, 300], [1118, 300]], 14, '#3c3a33', 'rgba(220,210,190,.22)');

  if (st.open.estante) drawEstanteAberta(ctx);
  else {
    // estante
    const X = 520, Y = 120, EW = 600, EH = FLOOR - 120;
    shelfFrame(ctx, X, Y, EW, EH, [120, 250, 380, 510, 640]);
    floorShadow(ctx, X, EW, 50);

    // prateleira 1: porquinho, santinho, Guia Quatro Rodas, lata de Sonho de Valsa
    if (!st.pigBroken) porquinho(ctx, 612, 222);
    else {
      ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(615, 249, 60, 5, 0, 0, 7); ctx.fill();
      const shards = [[[566, 249], [590, 222], [606, 238], [598, 249]], [[604, 249], [612, 226], [640, 230], [636, 249]],
        [[640, 249], [650, 236], [676, 241], [668, 249]], [[586, 249], [578, 240], [560, 246]]];
      shards.forEach((s, i) => { ctx.fillStyle = i % 2 ? '#7d4126' : '#6a361f'; poly(ctx, s); ctx.fill();
        ctx.strokeStyle = 'rgba(255,210,170,.2)'; ctx.lineWidth = 1; ctx.stroke(); });
      ctx.fillStyle = '#a99260'; for (const [cx, cy] of [[628, 246], [648, 247], [658, 245]]) { ctx.beginPath(); ctx.ellipse(cx, cy, 6, 2.5, 0, 0, 7); ctx.fill(); }
    }
    ctx.fillStyle = '#4b3a14'; ctx.fillRect(700, 176, 62, 74); ctx.fillStyle = '#20263f'; ctx.fillRect(707, 183, 48, 60);
    ctx.fillStyle = '#2a3a78'; poly(ctx, [[731, 196], [745, 240], [717, 240]]); ctx.fill();
    ctx.fillStyle = '#3a2618'; ctx.beginPath(); ctx.arc(731, 198, 6, 0, 7); ctx.fill();
    ctx.fillStyle = '#b79a3c'; ctx.fillRect(724, 186, 14, 5);
    wood(ctx, 790, 226, 140, 24, '#1f3f74', 61, 'h'); ctx.fillStyle = '#d9b72f'; ctx.fillRect(790, 232, 140, 6);
    wood(ctx, 798, 212, 120, 14, '#5a1f17', 62, 'h');
    ctx.fillStyle = '#8e2b35'; ctx.fillRect(960, 204, 118, 46); ctx.fillStyle = '#b78a3a'; ctx.fillRect(958, 198, 122, 9);
    ctx.fillStyle = 'rgba(240,220,200,.3)'; ctx.font = 'italic 13px Georgia'; ctx.fillText('Sonho de Valsa', 972, 232);

    // prateleira 2: Enciclopédia Barsa, falta o volume 7
    let bx = 550;
    for (let v = 1; v <= 14; v++) {
      if (v === 7) { ctx.fillStyle = '#020101'; ctx.fillRect(bx, 276, 36, 104); bx += 38; continue; }
      const lean = v === 8 ? -.07 : 0;
      ctx.save(); ctx.translate(bx, 380); ctx.rotate(lean);
      wood(ctx, 0, -102, 36, 102, v % 2 ? '#4a1612' : '#401310', 70 + v, 'v');
      ctx.fillStyle = '#9c7a33'; ctx.fillRect(3, -90, 30, 3); ctx.fillRect(3, -26, 30, 3);
      ctx.fillStyle = '#b99446'; ctx.font = 'bold 13px Georgia'; ctx.fillText(String(v), v > 9 ? 9 : 13, -46);
      bevel(ctx, 0, -102, 36, 102, 2); ctx.restore();
      bx += 38;
    }
    ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(bx, 276, 1090 - bx, 104);

    // prateleira 3: rádio de pilha, revistas, vaso de porcelana
    ctx.fillStyle = '#3b2213'; ctx.fillRect(578, 436, 182, 74); bevel(ctx, 578, 436, 182, 74, 3);
    ctx.fillStyle = '#c4b68c'; ctx.fillRect(594, 450, 108, 26);
    ctx.strokeStyle = '#3b2213'; ctx.lineWidth = 1; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(598 + i * 9, 452); ctx.lineTo(598 + i * 9, 474); ctx.stroke(); }
    ctx.fillStyle = '#7a1f14'; ctx.fillRect(640, 450, 2, 26);
    ctx.fillStyle = '#18100a'; ctx.beginPath(); ctx.arc(732, 486, 14, 0, 7); ctx.fill();
    ctx.strokeStyle = '#24160c'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(586, 438); ctx.quadraticCurveTo(670, 396, 752, 438); ctx.stroke();
    for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? '#6f6650' : '#5c5340'; ctx.fillRect(786 + (i % 2) * 3, 498 - i * 7, 76, 7); }
    ctx.fillStyle = '#d9d4c4'; ctx.beginPath(); ctx.moveTo(906, 404); ctx.lineTo(954, 404); ctx.quadraticCurveTo(948, 420, 978, 450);
    ctx.quadraticCurveTo(1000, 490, 962, 510); ctx.lineTo(898, 510); ctx.quadraticCurveTo(860, 490, 882, 450); ctx.quadraticCurveTo(912, 420, 906, 404); ctx.fill();
    ctx.strokeStyle = '#2b4a8e'; ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(930, 462 + i * 9, 16 + i * 4, .4, 2.7); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.beginPath(); ctx.ellipse(902, 460, 6, 22, .2, 0, 7); ctx.fill();

    // prateleira 4: rolos de tecido de Lúcia, caixa de costura, lata de biscoito
    for (let i = 0; i < 4; i++) { ctx.fillStyle = ['#4b2f40', '#2f4a44', '#6a5a3a', '#3a3a52'][i]; ctx.beginPath(); ctx.ellipse(600 + i * 46, 612, 22, 26, 0, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(600 + i * 46, 612, 6, 7, 0, 0, 7); ctx.fill(); }
    wood(ctx, 800, 580, 140, 60, '#5d4426', 81, 'h'); bevel(ctx, 800, 580, 140, 60, 3);
    ctx.fillStyle = '#a2864c'; ctx.fillRect(862, 600, 16, 8);
    ctx.fillStyle = '#2d4a3a'; ctx.fillRect(964, 582, 110, 58); ctx.fillStyle = '#a8913c'; ctx.fillRect(962, 578, 114, 8);

    // prateleira 5: jornais amarrados
    for (let i = 0; i < 3; i++) { ctx.fillStyle = '#463f30'; ctx.fillRect(560 + i * 170, 670, 150, 50);
      ctx.strokeStyle = '#2c2416'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(560 + i * 170 + 75, 670); ctx.lineTo(560 + i * 170 + 75, 720); ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(560 + i * 170, 690, 150, 2); }
  }

  // pintura do corredor amarelo (Marina, 1986)
  const P = { x: 1200, y: 170, w: 300, h: 440 }, vx = 1352, vy = 362, fx0 = 1322, fx1 = 1382, fy0 = 332, fy1 = 398;
  castShadow(ctx, P.x, P.y, P.w, P.h, 14);
  ctx.fillStyle = '#d2b44a'; poly(ctx, [[P.x, P.y], [fx0, fy0], [fx0, fy1], [P.x, P.y + P.h]]); ctx.fill();
  ctx.fillStyle = '#8f7526'; poly(ctx, [[P.x + P.w, P.y], [fx1, fy0], [fx1, fy1], [P.x + P.w, P.y + P.h]]); ctx.fill();
  ctx.fillStyle = '#efe0a0'; poly(ctx, [[P.x, P.y], [P.x + P.w, P.y], [fx1, fy0], [fx0, fy0]]); ctx.fill();
  ctx.fillStyle = '#4b3a14'; poly(ctx, [[P.x, P.y + P.h], [P.x + P.w, P.y + P.h], [fx1, fy1], [fx0, fy1]]); ctx.fill();
  ctx.fillStyle = '#b39535'; ctx.fillRect(fx0, fy0, fx1 - fx0, fy1 - fy0);
  ctx.fillStyle = '#0a0703'; ctx.fillRect(vx - 14, vy - 16, 28, 50);
  // portas ao longo do corredor, uma de cada lado
  const side = (x0, xe, t, h0) => { // x da parede a uma fração t do caminho até o fundo
    const x = x0 + (xe - x0) * t, yTop = P.y + (fy0 - P.y) * t + 30 * (1 - t), yBot = P.y + P.h + (fy1 - P.y - P.h) * t;
    return [x, yTop + (yBot - yTop) * h0, yBot];
  };
  for (const [x0, xe, col] of [[P.x, fx0, '#3a2c0c'], [P.x + P.w, fx1, '#2a1f08']]) {
    const a = side(x0, xe, .3, .28), b = side(x0, xe, .48, .28);
    ctx.fillStyle = col; poly(ctx, [[a[0], a[1]], [b[0], b[1]], [b[0], b[2]], [a[0], a[2]]]); ctx.fill();
  }
  for (let k = 0; k < 3; k++) {
    const t = [.15, .42, .68][k], lx = (a, b) => a + (b - a) * t;
    ctx.fillStyle = 'rgba(250,245,215,.85)';
    poly(ctx, [[lx(1290, 1338), lx(P.y + 8, fy0)], [lx(1410, 1366), lx(P.y + 8, fy0)], [lx(1400, 1362), lx(P.y + 26, fy0 + 3)], [lx(1300, 1342), lx(P.y + 26, fy0 + 3)]]); ctx.fill();
  }
  const r = rng(5);
  ctx.lineWidth = 3;
  for (let i = 0; i < 260; i++) { ctx.strokeStyle = rgba(150 + r() * 80, 120 + r() * 60, 30 + r() * 30, .08);
    const sx = P.x + r() * P.w, sy = P.y + r() * P.h; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + r() * 30 - 15, sy + r() * 8 - 4); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(40,28,10,.6)'; ctx.lineWidth = 2;
  for (const [a, b] of [[[P.x, P.y], [fx0, fy0]], [[P.x + P.w, P.y], [fx1, fy0]], [[P.x, P.y + P.h], [fx0, fy1]], [[P.x + P.w, P.y + P.h], [fx1, fy1]]]) {
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  for (let i = 0; i < 10; i++) stain(ctx, P.x + r() * P.w, P.y + r() * P.h, 30 + r() * 60, 20 + r() * 50, 'rgba(110,95,60,A)', .35);
  ctx.strokeStyle = 'rgba(30,20,8,.5)'; ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) { let cx = P.x + r() * P.w, cy = P.y + r() * P.h; ctx.beginPath(); ctx.moveTo(cx, cy);
    for (let j = 0; j < 5; j++) { cx += r() * 30 - 15; cy += r() * 24; ctx.lineTo(cx, cy); } ctx.stroke(); }
  ctx.fillStyle = 'rgba(60,40,10,.8)'; ctx.font = '16px "Kalam", cursive'; ctx.fillText('M.T. 86', P.x + P.w - 70, P.y + P.h - 12);

  // espada-de-são-jorge morta
  floorShadow(ctx, 360, 100, 30);
  ctx.fillStyle = '#5e3a22'; poly(ctx, [[356, 640], [454, 640], [442, FLOOR + 6], [368, FLOOR + 6]]); ctx.fill();
  ctx.fillStyle = '#734a2c'; ctx.fillRect(350, 632, 110, 14);
  ctx.fillStyle = '#1b130b'; ctx.beginPath(); ctx.ellipse(405, 640, 50, 7, 0, 0, 7); ctx.fill();
  const leaves = [[380, -.25, 210], [395, -.08, 260], [410, .05, 240], [425, .2, 190], [402, -.4, 140], [418, .55, 120]];
  leaves.forEach(([lx, a, len], i) => {
    ctx.save(); ctx.translate(lx, 640); ctx.rotate(a + (i === 5 ? .9 : 0));
    ctx.fillStyle = i > 3 ? '#4a3c1c' : '#5e5a2a'; poly(ctx, [[-9, 0], [9, 0], [3, -len], [-2, -len + 6]]); ctx.fill();
    ctx.strokeStyle = 'rgba(200,180,90,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1, -len + 10); ctx.stroke();
    ctx.restore();
  });

  // fusível caído no chão
  if (!st.fuseTaken) {
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.beginPath(); ctx.ellipse(1176, 772, 26, 6, 0, 0, 7); ctx.fill();
    ctx.save(); ctx.translate(1170, 760); ctx.rotate(.35);
    ctx.fillStyle = '#3a2316'; ctx.fillRect(-16, -11, 26, 22);
    ctx.fillStyle = '#9c8656'; ctx.fillRect(10, -8, 12, 16);
    ctx.strokeStyle = '#5c4b2c'; ctx.lineWidth = 1.5; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(12 + i * 3, -8); ctx.lineTo(12 + i * 3, 8); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,240,200,.35)'; ctx.fillRect(-14, -9, 20, 3);
    ctx.restore();
  }
  lamp(ctx, LAMP_X[1]);
};
EMIT[1] = function () {};
