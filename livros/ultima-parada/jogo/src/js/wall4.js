// ===== wall4.js — a oficina do Seu Aurélio, atrás da parede da cômoda =====
const LIGHTS = {
  4: { x: 1030, y: 368, tint: [215, 222, 228], glow: [250, 252, 245], vy: 520 }, // luz de bancada, branca e dura
};
function radioValvulas(ctx, x, y) { // x,y = canto de cima à esquerda; 290×200
  castShadow(ctx, x, y, 290, 200, 24);
  ctx.save(); ctx.beginPath(); ctx.moveTo(x, y + 200); ctx.lineTo(x, y + 60); ctx.quadraticCurveTo(x, y, x + 145, y); ctx.quadraticCurveTo(x + 290, y, x + 290, y + 60); ctx.lineTo(x + 290, y + 200); ctx.closePath(); ctx.clip();
  wood(ctx, x, y, 290, 200, '#5a3418', 401, 'h'); ctx.restore();
  ctx.fillStyle = '#3b2a1a'; ctx.beginPath(); ctx.roundRect(x + 40, y + 34, 210, 92, 10); ctx.fill();
  ctx.strokeStyle = 'rgba(200,170,120,.18)'; ctx.lineWidth = 1;
  for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.moveTo(x + 44 + i * 8, y + 38); ctx.lineTo(x + 44 + i * 8, y + 122); ctx.stroke(); }
  ctx.fillStyle = '#d8c79a'; ctx.fillRect(x + 30, y + 138, 230, 30);
  ctx.strokeStyle = '#3a2a14'; for (let i = 0; i <= 15; i++) { ctx.beginPath(); ctx.moveTo(x + 38 + i * 14.4, y + 140); ctx.lineTo(x + 38 + i * 14.4, y + (i % 5 ? 148 : 154)); ctx.stroke(); }
  ctx.strokeStyle = '#8a1f1f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 156, y + 139); ctx.lineTo(x + 152, y + 167); ctx.stroke();
  ctx.fillStyle = '#1b1a14'; ctx.beginPath(); ctx.arc(x + 145, y + 22, 11, 0, 7); ctx.fill();
  for (const kx of [60, 230]) { ctx.fillStyle = '#20150c'; ctx.beginPath(); ctx.arc(x + kx, y + 184, 13, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,230,190,.2)'; ctx.fillRect(x + kx - 2, y + 172, 4, 8); }
  ctx.fillStyle = 'rgba(230,210,160,.6)'; ctx.font = 'italic 13px Georgia'; ctx.fillText('Philips', x + 124, y + 132);
}

ART[4] = function (ctx, st) {
  plaster(ctx, 0, WALL_TOP, W, FLOOR - WALL_TOP, 411, '#4f4d45');
  ctx.fillStyle = '#26241f'; ctx.fillRect(0, 0, W, WALL_TOP);
  speckle(ctx, 0, 0, W, WALL_TOP, 1200, 412, ['rgba(0,0,0,.4)', 'rgba(150,140,120,.1)'], 2);
  ctx.fillStyle = '#2a2925'; ctx.fillRect(0, FLOOR, W, H - FLOOR);
  for (let i = 0; i < 18; i++) stain(ctx, rng(i)() * W, FLOOR + rng(i + 50)() * 180, 80 + i * 6, 14, 'rgba(10,10,8,A)', .5);
  speckle(ctx, 0, FLOOR, W, H - FLOOR, 2500, 413, ['rgba(0,0,0,.45)', 'rgba(170,160,140,.1)'], 2);

  // o painel aberto, à esquerda, com o bilhete de Lúcia preso por dentro
  wood(ctx, 0, WALL_TOP, 150, FLOOR - WALL_TOP, '#3a2a19', 414, 'v'); bevel(ctx, 0, WALL_TOP, 150, FLOOR - WALL_TOP, 4);
  ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(150, WALL_TOP, 18, FLOOR - WALL_TOP);
  if (!st.found.lucia) note(ctx, 34, 300, 84, 70, -.05, '#a98a5c');

  // esquema na parede: o porão, a estante e "A LINHA"
  castShadow(ctx, 470, 110, 400, 190, 18);
  ctx.fillStyle = '#c7c0a6'; ctx.fillRect(470, 110, 400, 190);
  ctx.strokeStyle = '#26314a'; ctx.lineWidth = 3; ctx.strokeRect(520, 140, 180, 120);
  ctx.strokeRect(570, 260, 80, 28); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(700, 225); ctx.lineTo(840, 225); ctx.moveTo(826, 214); ctx.lineTo(842, 225); ctx.lineTo(826, 236); ctx.stroke();
  ctx.fillStyle = '#26314a'; ctx.font = '15px "Architects Daughter", cursive';
  ctx.fillText('PORÃO', 580, 206); ctx.fillText('OFICINA', 576, 280); ctx.fillText('A LINHA', 760, 214); ctx.fillText('23.10', 742, 256);
  ctx.fillText('ESTANTE', 704, 252);

  // planta de 1948 em papel vegetal
  if (!st.found.planta) {
    castShadow(ctx, 960, 130, 280, 180, 14);
    ctx.fillStyle = 'rgba(180,195,198,.92)'; ctx.fillRect(960, 130, 280, 180);
    ctx.strokeStyle = 'rgba(35,58,90,.7)'; ctx.lineWidth = 1.5;
    ctx.strokeRect(990, 160, 140, 100); ctx.strokeRect(1130, 200, 70, 30); ctx.strokeRect(990, 260, 60, 30);
    ctx.fillStyle = 'rgba(35,58,90,.8)'; ctx.font = '12px "Architects Daughter", cursive'; ctx.fillText('1948', 1190, 296);
  }

  // prateleira com válvulas e rolos de fio
  wood(ctx, 1290, 220, 270, 14, '#3a2a19', 415, 'h');
  for (let i = 0; i < 7; i++) { ctx.fillStyle = 'rgba(200,210,200,.35)'; ctx.beginPath(); ctx.ellipse(1310 + i * 34, 196, 10, 24, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#222'; ctx.fillRect(1302 + i * 34, 214, 16, 6); }
  for (let i = 0; i < 3; i++) { ctx.fillStyle = ['#7b2a1a', '#2a4a6b', '#6a5a2a'][i]; ctx.beginPath(); ctx.arc(1330 + i * 70, 300, 26, 0, 7); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(1330 + i * 70, 300, 8, 0, 7); ctx.fill(); }
  wood(ctx, 1290, 330, 270, 14, '#3a2a19', 416, 'h');

  // bancada de relojoeiro
  castShadow(ctx, 260, 520, 1080, 30, 30);
  wood(ctx, 250, 516, 1100, 34, '#4a3320', 417, 'h'); bevel(ctx, 250, 516, 1100, 34, 3);
  ctx.fillStyle = '#211710'; ctx.fillRect(270, 550, 24, FLOOR - 550); ctx.fillRect(1306, 550, 24, FLOOR - 550);
  wood(ctx, 300, 552, 240, 62, '#3b2a19', 418, 'h'); bevel(ctx, 300, 552, 240, 62, 3);
  ctx.fillStyle = '#a28150'; ctx.fillRect(404, 578, 32, 8);
  floorShadow(ctx, 250, 1100, 50);

  // cadernos quadriculados
  if (!st.found.cadernos) for (let i = 0; i < 9; i++) {
    ctx.fillStyle = ['#2c4a6b', '#6b2c2c', '#2c6b44', '#6b5a2c', '#3a3a3a'][i % 5];
    ctx.fillRect(300 + (i % 2) * 4, 506 - i * 8, 150, 8); ctx.fillStyle = 'rgba(230,225,210,.7)'; ctx.fillRect(302 + (i % 2) * 4, 508 - i * 8, 146, 2);
  }
  radioValvulas(ctx, 560, 316);
  // caixa de chumbo
  if (!st.found.caixa) {
    castShadow(ctx, 940, 450, 160, 66, 16);
    ctx.fillStyle = '#4c4f50'; ctx.fillRect(936, 446, 168, 70); bevel(ctx, 936, 446, 168, 70, 3);
    ctx.fillStyle = '#3c3f40'; ctx.fillRect(936, 446, 168, 14);
    const cx = 1020, cy = 488; ctx.fillStyle = '#d8b52a'; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, 7); ctx.fill();
    ctx.fillStyle = '#151515';
    for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + k * 2 * Math.PI / 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, 17, a - .5, a + .5); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = '#d8b52a'; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fill(); ctx.fillStyle = '#151515'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, 7); ctx.fill();
  }
  // lupa de pé e a luminária articulada
  ctx.strokeStyle = '#1d1d1b'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(1190, 516); ctx.lineTo(1190, 420); ctx.lineTo(1230, 390); ctx.stroke();
  ctx.strokeStyle = '#8c8c86'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(1250, 380, 26, 0, 7); ctx.stroke();
  ctx.fillStyle = 'rgba(200,220,230,.12)'; ctx.beginPath(); ctx.arc(1250, 380, 24, 0, 7); ctx.fill();
  ctx.strokeStyle = '#1b1b19'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1120, 516); ctx.lineTo(1150, 380); ctx.lineTo(1040, 334); ctx.stroke();
  ctx.fillStyle = '#2b2b27'; poly(ctx, [[1000, 326], [1060, 326], [1080, 364], [980, 364]]); ctx.fill();
};
EMIT[4] = function (ctx, st, t) {
  if (!st.power) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const c = ctx.createRadialGradient(1030, 400, 0, 1030, 400, 360);
  c.addColorStop(0, 'rgba(240,245,240,.2)'); c.addColorStop(1, 'rgba(240,245,240,0)'); ctx.fillStyle = c; ctx.fillRect(670, 40, 720, 720);
  if (st.flags.radioOn) {
    const eye = ctx.createRadialGradient(705, 338, 0, 705, 338, 18);
    eye.addColorStop(0, `rgba(120,255,140,${st.flags.tuned ? .95 : .4})`); eye.addColorStop(1, 'rgba(120,255,140,0)');
    ctx.fillStyle = eye; ctx.fillRect(685, 318, 40, 40);
    ctx.fillStyle = 'rgba(255,200,120,.25)'; ctx.fillRect(590, 454, 230, 30);
  }
  ctx.restore();
};
