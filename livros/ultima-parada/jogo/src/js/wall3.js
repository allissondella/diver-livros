// ===== wall3.js — escrivaninha (mural, CP-500, TV, telefone, cama) =====
function photo(ctx, x, y, w, h, rot, inner) {
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot);
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-w / 2 + 4, -h / 2 + 5, w, h);
  ctx.fillStyle = '#d9d2bd'; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = inner; ctx.fillRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 22);
  ctx.restore();
}
function recorte(ctx, x, y, w, h, rot, masthead) {
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot);
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-w / 2 + 4, -h / 2 + 5, w, h);
  ctx.fillStyle = '#bdb59a'; ctx.fillRect(-w / 2, -h / 2, w, h);
  if (masthead) { ctx.fillStyle = masthead; ctx.fillRect(-w / 2 + 6, -h / 2 + 6, w - 12, 10); }
  ctx.fillStyle = '#2c2a24'; ctx.fillRect(-w / 2 + 6, -h / 2 + 22, w - 14, 8); ctx.fillRect(-w / 2 + 6, -h / 2 + 33, w - 30, 8);
  ctx.fillStyle = 'rgba(40,38,32,.55)';
  for (let i = 0; i < 9; i++) { ctx.fillRect(-w / 2 + 6, -h / 2 + 50 + i * 6, w / 2 - 10, 2); ctx.fillRect(4, -h / 2 + 50 + i * 6, w / 2 - 10, 2); }
  ctx.restore();
}
function pin(ctx, x, y, col) { ctx.fillStyle = col || '#a01c14'; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(x - 2, y - 3, 2, 2); }

ART[3] = function (ctx, st) {
  plaster(ctx, 0, WALL_TOP, W, FLOOR - WALL_TOP, 301);
  ceiling(ctx, 302);
  floor(ctx, 303);
  pipe(ctx, [[0, 112], [1600, 112]], 12, '#3e3c36', 'rgba(220,210,190,.22)');

  // mural de cortiça da Cecília
  castShadow(ctx, 80, 160, 420, 300, 30);
  wood(ctx, 74, 154, 432, 312, '#4a3220', 311, 'h');
  ctx.fillStyle = '#8a6239'; ctx.fillRect(88, 168, 404, 284);
  speckle(ctx, 88, 168, 404, 284, 4000, 312, ['rgba(60,35,15,.5)', 'rgba(190,140,80,.3)', 'rgba(30,18,8,.4)'], 2.5);
  recorte(ctx, 104, 182, 104, 120, -.06, null);
  recorte(ctx, 376, 188, 104, 124, .05, '#8c1a14');
  photo(ctx, 226, 180, 74, 86, .04, '#3c3a33');
  ctx.fillStyle = '#d6d0c0'; ctx.fillRect(252, 202, 22, 40); ctx.fillStyle = '#1d1b17'; ctx.beginPath(); ctx.arc(263, 196, 8, 0, 7); ctx.fill();
  photo(ctx, 310, 326, 74, 86, -.05, '#5d4636');
  ctx.fillStyle = '#9b7c57'; ctx.beginPath(); ctx.arc(342, 352, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#3b2c1a'; ctx.fillRect(334, 362, 18, 22);
  ctx.fillStyle = '#c8b28a'; ctx.beginPath(); ctx.ellipse(360, 382, 9, 6, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.translate(250, 375); ctx.rotate(.02);
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-96, -66, 200, 136); ctx.fillStyle = '#a5875a'; ctx.fillRect(-100, -70, 200, 136);
  ctx.strokeStyle = '#2b1c0e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-86, 44); ctx.lineTo(-30, 30); ctx.lineTo(-10, -10); ctx.lineTo(40, -14); ctx.lineTo(56, -40); ctx.stroke();
  ctx.fillStyle = '#7a1910'; ctx.beginPath(); ctx.arc(56, -40, 6, 0, 7); ctx.fill();
  ctx.fillStyle = '#2b1c0e'; ctx.font = '17px "Caveat", cursive'; ctx.fillText('ROTA 875A', -90, -46); ctx.fillText('?', 64, -36);
  ctx.restore();
  note(ctx, 120, 312, 60, 40, .1, '#d4c590'); note(ctx, 410, 334, 64, 40, -.08, '#d4c590'); note(ctx, 214, 276, 58, 34, -.12, '#d4c590');
  ctx.strokeStyle = 'rgba(170,25,20,.8)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(156, 190); ctx.lineTo(263, 186); ctx.lineTo(428, 196); ctx.lineTo(306, 315); ctx.lineTo(346, 334); ctx.stroke();
  [[156, 190], [263, 186], [428, 196], [306, 315], [346, 334], [150, 318], [440, 340]].forEach(p => pin(ctx, p[0], p[1]));

  // escrivaninha de fórmica
  castShadow(ctx, 520, 470, 540, 40, 30);
  ctx.fillStyle = '#1a1916'; for (const lx of [530, 1040]) ctx.fillRect(lx, 492, 12, FLOOR - 492);
  ctx.fillRect(530, 650, 522, 8);
  floorShadow(ctx, 520, 540, 30);
  ctx.fillStyle = '#7e7464'; ctx.fillRect(516, 466, 548, 26);
  ctx.fillStyle = '#958a76'; ctx.fillRect(516, 466, 548, 8); bevel(ctx, 516, 466, 548, 26, 2);
  speckle(ctx, 516, 466, 548, 26, 400, 320, ['rgba(0,0,0,.25)', 'rgba(255,255,255,.08)'], 2);
  const dy = st.open.esc ? 9 : 0;
  if (dy) { ctx.fillStyle = '#050403'; ctx.fillRect(552, 492, 210, 10); ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(550, 538 + dy, 214, 8); }
  ctx.fillStyle = '#6c6355'; ctx.fillRect(552, 492 + dy, 210, 46); bevel(ctx, 552, 492 + dy, 210, 46, 3);
  ctx.fillStyle = '#2a2722'; ctx.fillRect(640, 510 + dy, 34, 7);

  // um porta-lápis e a apostila do cursinho (a Cecília levou o caderno)
  ctx.fillStyle = '#2b2b2b'; ctx.fillRect(540, 440, 26, 30); ctx.fillStyle = '#c9a23c'; ctx.fillRect(545, 424, 3, 18); ctx.fillStyle = '#3a6fb0'; ctx.fillRect(552, 420, 3, 22); ctx.fillStyle = '#b03a3a'; ctx.fillRect(559, 428, 3, 14);
  ctx.fillStyle = '#cfc4a4'; poly(ctx, [[600, 470], [700, 470], [708, 448], [610, 448]]); ctx.fill();
  ctx.fillStyle = '#7a1f1f'; ctx.fillRect(612, 452, 60, 5); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.font = '10px Arial'; ctx.fillText('CURSINHO', 622, 466);

  // Prológica CP-500
  castShadow(ctx, 720, 292, 176, 150, 24);
  ctx.fillStyle = '#b9ad90'; ctx.fillRect(716, 288, 182, 158); bevel(ctx, 716, 288, 182, 158, 4);
  ctx.fillStyle = '#25261f'; ctx.fillRect(732, 302, 150, 110);
  ctx.fillStyle = '#0c120c'; ctx.beginPath(); ctx.roundRect(740, 309, 134, 96, 10); ctx.fill();
  ctx.fillStyle = 'rgba(160,200,160,.08)'; ctx.beginPath(); ctx.ellipse(780, 330, 34, 14, -.3, 0, 7); ctx.fill();
  ctx.fillStyle = '#4b4536'; ctx.font = 'bold 10px Arial'; ctx.fillText('PROLOGICA  CP-500', 742, 430);
  ctx.fillStyle = '#a99c7e'; poly(ctx, [[704, 470], [910, 470], [902, 448], [712, 448]]); ctx.fill();
  ctx.fillStyle = '#5d564a';
  for (let row = 0; row < 3; row++) for (let k = 0; k < 16; k++) ctx.fillRect(718 + k * 11.2 + row * 2, 451 + row * 6, 9, 4);
  note(ctx, 868, 296, 40, 32, .12, '#d8c773');

  // caixa de ferramentas do pai da Cecília, nova, sem cadeado
  castShadow(ctx, 926, 412, 124, 56, 18);
  ctx.fillStyle = '#6b1d15'; ctx.fillRect(924, 410, 128, 58); bevel(ctx, 924, 410, 128, 58, 3);
  speckle(ctx, 924, 410, 128, 58, 120, 330, ['rgba(40,20,10,.4)', 'rgba(160,90,40,.2)'], 3);
  ctx.strokeStyle = '#2a2622'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(962, 410); ctx.lineTo(962, 396); ctx.lineTo(1014, 396); ctx.lineTo(1014, 410); ctx.stroke();
  ctx.fillStyle = '#c9c2b0'; ctx.fillRect(934, 432, 108, 14); ctx.fillStyle = 'rgba(40,20,10,.8)'; ctx.font = '10px Arial'; ctx.fillText('TRAMONTINA', 955, 443);

  // TV de tubo no carrinho de ferro, com videocassete
  ctx.fillStyle = '#1b1b19'; for (const lx of [1086, 1292]) ctx.fillRect(lx, 470, 8, FLOOR - 476);
  ctx.fillRect(1086, 470, 214, 8); ctx.fillRect(1086, 640, 214, 7);
  for (const lx of [1090, 1296]) { ctx.beginPath(); ctx.arc(lx, FLOOR - 2, 7, 0, 7); ctx.fill(); }
  floorShadow(ctx, 1086, 214, 30);
  ctx.fillStyle = '#c8c4b6'; ctx.fillRect(1098, 478, 190, 34); bevel(ctx, 1098, 478, 190, 34, 2);
  ctx.fillStyle = '#1a1a18'; ctx.fillRect(1120, 488, 96, 9);
  ctx.fillStyle = '#2b2b28'; ctx.font = 'bold 10px Arial'; ctx.fillText('SHARP', 1230, 498);
  castShadow(ctx, 1088, 302, 208, 168, 30);
  wood(ctx, 1084, 298, 216, 172, '#2a1a10', 341, 'h'); bevel(ctx, 1084, 298, 216, 172, 4);
  ctx.fillStyle = '#121210'; ctx.beginPath(); ctx.roundRect(1096, 312, 152, 144, 18); ctx.fill();
  ctx.fillStyle = '#1e211f'; ctx.beginPath(); ctx.roundRect(1104, 320, 136, 128, 22); ctx.fill();
  ctx.fillStyle = 'rgba(200,210,200,.07)'; ctx.beginPath(); ctx.ellipse(1140, 345, 30, 12, -.4, 0, 7); ctx.fill();
  ctx.fillStyle = '#121210'; ctx.fillRect(1254, 316, 38, 136);
  for (const ky of [336, 370]) { ctx.fillStyle = '#2f2e2a'; ctx.beginPath(); ctx.arc(1273, ky, 10, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#3c3b36'; ctx.fillRect(1260, 400, 26, 40);
  ctx.fillStyle = 'rgba(200,190,170,.5)'; ctx.font = '9px Arial'; ctx.fillText('TELEFUNKEN', 1108, 466);
  ctx.strokeStyle = '#8b8a84'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(1186, 298); ctx.lineTo(1132, 196); ctx.moveTo(1196, 298); ctx.lineTo(1262, 190); ctx.stroke();
  ctx.fillStyle = '#222'; ctx.beginPath(); ctx.ellipse(1191, 296, 18, 7, 0, 0, 7); ctx.fill();

  // o papel com os números da agenda, colado ao lado do telefone
  note(ctx, 1296, 404, 100, 54, -.03, '#e4dcc2');
  ctx.fillStyle = 'rgba(40,40,90,.85)'; ctx.font = '11px "Architects Daughter", cursive';
  ctx.fillText('Cursinho 255-1133', 1302, 420); ctx.fillText('Dr. Ribeiro 62-4018', 1302, 434); ctx.fillText('Odete 3862-0147', 1302, 448);

  // criado-mudo com telefone e secretária eletrônica
  castShadow(ctx, 1322, 540, 150, 180, 30);
  wood(ctx, 1318, 538, 156, FLOOR - 538, '#3c2816', 351, 'v'); bevel(ctx, 1318, 538, 156, FLOOR - 538, 3);
  ctx.fillStyle = '#2a1c0e'; ctx.fillRect(1330, 560, 132, 60); bevel(ctx, 1330, 560, 132, 60, 2);
  ctx.fillStyle = '#7b7a74'; poly(ctx, [[1330, 538], [1404, 538], [1396, 504], [1338, 504]]); ctx.fill();
  ctx.fillStyle = '#6a6963'; ctx.beginPath(); ctx.roundRect(1326, 490, 82, 18, 8); ctx.fill();
  ctx.fillStyle = '#d4d0c4'; ctx.beginPath(); ctx.arc(1367, 523, 13, 0, 7); ctx.fill();
  ctx.fillStyle = '#4a4944'; for (let i = 0; i < 10; i++) { const a = i / 10 * 5.2 + .6; ctx.beginPath(); ctx.arc(1367 + Math.cos(a) * 9, 523 + Math.sin(a) * 9, 2, 0, 7); ctx.fill(); }
  ctx.strokeStyle = '#3a3a36'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1330, 500); ctx.bezierCurveTo(1310, 520, 1340, 560, 1320, 600); ctx.stroke();
  ctx.fillStyle = '#151513'; ctx.fillRect(1412, 512, 56, 26); bevel(ctx, 1412, 512, 56, 26, 2);
  ctx.fillStyle = '#2d2d2a'; ctx.fillRect(1418, 518, 26, 12);
  ctx.fillStyle = '#3a0d08'; ctx.beginPath(); ctx.arc(1458, 524, 3, 0, 7); ctx.fill();

  // cama da Cecília e a mochila
  ctx.fillStyle = '#20150c'; ctx.fillRect(1490, 610, 110, FLOOR - 610);
  ctx.fillStyle = '#41314a'; ctx.fillRect(1486, 560, 114, 56);
  ctx.strokeStyle = 'rgba(200,160,90,.25)'; ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(1486 + i * 26, 560); ctx.lineTo(1486 + i * 26, 616); ctx.stroke(); ctx.beginPath(); ctx.moveTo(1486, 568 + i * 11); ctx.lineTo(1600, 568 + i * 11); ctx.stroke(); }
  ctx.fillStyle = '#5a4a36'; ctx.fillRect(1538, 486, 10, 22); ctx.fillStyle = '#3a2f22'; ctx.beginPath(); ctx.arc(1543, 486, 7, 0, 7); ctx.fill();   // o gancho vazio da mochila

  // tomada e fios
  ctx.fillStyle = '#c5bfae'; ctx.fillRect(1004, 598, 30, 44); ctx.fillStyle = '#222'; ctx.fillRect(1013, 610, 4, 8); ctx.fillRect(1021, 610, 4, 8);
  ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(1019, 620); ctx.bezierCurveTo(1000, 700, 900, 690, 880, 470); ctx.moveTo(1019, 626); ctx.bezierCurveTo(1060, 700, 1120, 690, 1150, 520); ctx.stroke();

  lamp(ctx, LAMP_X[3]);
};

EMIT[3] = function (ctx, st, t) {
  if (!st.power) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const blink = (t % 1400) < 700;
  if (blink) { const g = ctx.createRadialGradient(1458, 524, 0, 1458, 524, 26); g.addColorStop(0, 'rgba(255,40,20,.95)'); g.addColorStop(.2, 'rgba(255,40,20,.4)'); g.addColorStop(1, 'rgba(255,40,20,0)'); ctx.fillStyle = g; ctx.fillRect(1430, 496, 56, 56); }
  ctx.fillStyle = 'rgba(255,40,20,.8)'; ctx.fillRect(1282, 446, 4, 4);
  ctx.fillStyle = 'rgba(90,255,120,.7)'; ctx.fillRect(884, 432, 5, 4);
  if (st.open.gav1 && !st.cp) { // o computador acendeu sozinho: verde, cursor piscando
    ctx.fillStyle = 'rgba(70,190,90,.22)'; ctx.beginPath(); ctx.roundRect(740, 309, 134, 96, 10); ctx.fill();
    if ((t % 1000) < 500) { ctx.fillStyle = 'rgba(120,255,140,.9)'; ctx.fillRect(752, 322, 7, 11); }
    const g = ctx.createRadialGradient(807, 357, 10, 807, 357, 160); g.addColorStop(0, 'rgba(80,220,110,.18)'); g.addColorStop(1, 'rgba(80,220,110,0)'); ctx.fillStyle = g; ctx.fillRect(640, 200, 340, 320);
  }
  ctx.restore();
};
