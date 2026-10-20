// ===== wall0.js — parede da escada (LED, janelinha, relógio, quadro de luz) =====
const ART = [], EMIT = [];
const LAMP_X = [1190, 300, 820, 1330];

// visor de 7 segmentos (LED de ônibus)
const SEG = { '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', '-': 'g', ' ': '' };
function seg7(ctx, str, x, y, h, on, off) {
  const w = h * .52, t = h * .12; let cx = x;
  for (const ch of str) {
    if (ch === ':') {
      ctx.fillStyle = on || off;
      ctx.fillRect(cx + w * .1, y + h * .28, t, t); ctx.fillRect(cx + w * .1, y + h * .66, t, t);
      cx += w * .45; continue;
    }
    const lit = SEG[ch] || '';
    const segs = {
      a: [cx + t, y, w - 2 * t, t], d: [cx + t, y + h - t, w - 2 * t, t], g: [cx + t, y + h / 2 - t / 2, w - 2 * t, t],
      f: [cx, y + t, t, h / 2 - t], b: [cx + w - t, y + t, t, h / 2 - t],
      e: [cx, y + h / 2, t, h / 2 - t], c: [cx + w - t, y + h / 2, t, h / 2 - t],
    };
    for (const k in segs) {
      const col = lit.includes(k) ? on : off; if (!col) continue;
      ctx.fillStyle = col; ctx.fillRect(...segs[k]);
    }
    cx += w + h * .16;
  }
}

ART[0] = function (ctx, st) {
  plaster(ctx, 0, WALL_TOP, W, FLOOR - WALL_TOP, 11);
  ceiling(ctx, 12);
  floor(ctx, 13);

  // vão da escada no teto e a porta lá em cima
  ctx.fillStyle = '#050403'; ctx.fillRect(0, 0, 330, WALL_TOP + 6);
  ctx.fillStyle = '#16110b'; ctx.fillRect(40, 0, 250, 40);
  ctx.fillStyle = 'rgba(0,0,0,.8)'; ctx.fillRect(0, WALL_TOP, 330, 18);

  // vazio embaixo da escada
  ctx.fillStyle = '#070503'; poly(ctx, [[80, 210], [520, FLOOR], [60, FLOOR], [60, 210]]); ctx.fill();
  // garrafão e balde no escuro
  ctx.fillStyle = '#121a10'; ctx.beginPath(); ctx.ellipse(170, 690, 34, 30, 0, 0, 7); ctx.fill();
  ctx.fillRect(160, 640, 20, 25);
  ctx.fillStyle = 'rgba(120,160,110,.12)'; ctx.beginPath(); ctx.ellipse(160, 682, 8, 16, -.3, 0, 7); ctx.fill();

  // longarina, degraus e corrimão
  const top = (t) => [80 + 500 * t, 140 + 580 * t];
  ctx.save(); poly(ctx, [[80, 140], [580, FLOOR], [520, FLOOR], [80, 210]]); ctx.clip();
  wood(ctx, 60, 120, 540, 620, '#3a2716', 21, 'h'); ctx.restore();
  ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(80, 210); ctx.lineTo(520, FLOOR); ctx.stroke();
  for (let i = 0; i < 10; i++) {
    const [px, py] = top(i / 10 + .03);
    wood(ctx, px - 36, py - 14, 86, 15, '#59402a', 30 + i, 'h');
    ctx.fillStyle = 'rgba(255,220,170,.12)'; ctx.fillRect(px - 36, py - 14, 86, 2);
    ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(px - 36, py, 86, 4);
  }
  ctx.strokeStyle = '#2b1d10'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(70, 40); ctx.lineTo(600, 610); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,160,110,.18)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(68, 36); ctx.lineTo(598, 606); ctx.stroke();
  ctx.strokeStyle = '#24180c'; ctx.lineWidth = 5;
  for (let i = 1; i < 10; i += 2) {
    const [px, py] = top(i / 10 + .03); const ry = 40 + (px + 6 - 70) * (570 / 530);
    ctx.beginPath(); ctx.moveTo(px + 6, ry); ctx.lineTo(px + 6, py - 14); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(600, 610); ctx.lineTo(600, FLOOR - 4); ctx.stroke();

  // lata de tinta que recebe a goteira
  floorShadow(ctx, 690, 70, 30);
  ctx.fillStyle = '#5b5a52'; ctx.fillRect(690, 650, 66, 72);
  ctx.fillStyle = '#8d8a7c'; ctx.beginPath(); ctx.ellipse(723, 650, 33, 8, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#16140f'; ctx.beginPath(); ctx.ellipse(723, 651, 28, 6, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(160,40,30,.55)'; ctx.fillRect(696, 672, 54, 26);
  ctx.fillStyle = 'rgba(230,220,190,.45)'; ctx.font = 'bold 12px Arial'; ctx.fillText('SUVINIL', 698, 690);
  stain(ctx, 723, 100, 30, 12, 'rgba(10,8,4,A)', .7);

  // janelinha basculante alta, no nível da calçada
  const wx = 760, wy = 104, ww = 250, wh = 76;
  ctx.fillStyle = '#07090c'; ctx.fillRect(wx, wy, ww, wh);
  const sg = ctx.createLinearGradient(0, wy, 0, wy + wh);
  sg.addColorStop(0, '#0c0e12'); sg.addColorStop(.62, '#141519'); sg.addColorStop(.64, '#25231f'); sg.addColorStop(1, '#0f0e0c');
  ctx.fillStyle = sg; ctx.fillRect(wx, wy, ww, wh);
  speckle(ctx, wx, wy, ww, wh, 500, 77, ['rgba(255,255,255,.05)', 'rgba(0,0,0,.4)'], 2.5);
  ctx.strokeStyle = '#2d281e'; ctx.lineWidth = 8; ctx.strokeRect(wx, wy, ww, wh);
  ctx.lineWidth = 5; for (const yy of [wy + 25, wy + 51]) { ctx.beginPath(); ctx.moveTo(wx, yy); ctx.lineTo(wx + ww, yy); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();

  // canos
  pipe(ctx, [[1010, 112], [1600, 112]], 12, '#3e3c36', 'rgba(220,210,190,.25)');
  pipe(ctx, [[1545, WALL_TOP], [1545, 600], [1510, 640], [1510, FLOOR]], 16, '#b9b2a0', 'rgba(255,255,255,.4)');

  // visor de LED acima da escada
  castShadow(ctx, 650, 215, 300, 82, 22);
  ctx.fillStyle = '#0d0c0b'; ctx.fillRect(650, 215, 300, 82);
  ctx.fillStyle = '#1d0806'; ctx.fillRect(662, 226, 276, 60);
  seg7(ctx, '88:88', 690, 234, 44, 'rgba(90,20,12,.35)', null);
  bevel(ctx, 650, 215, 300, 82, 4);
  ctx.strokeStyle = '#0a0908'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(940, 260); ctx.lineTo(1010, 112); ctx.stroke();

  // relógio de cozinha parado às 23:10
  const cx = 1040, cy = 300;
  castShadow(ctx, cx - 52, cy - 52, 104, 104, 24);
  ctx.fillStyle = '#c9bb92'; ctx.beginPath(); ctx.arc(cx, cy, 60, 0, 7); ctx.fill();
  ctx.fillStyle = '#e6dcc0'; ctx.beginPath(); ctx.arc(cx, cy, 50, 0, 7); ctx.fill();
  stain(ctx, cx + 14, cy + 18, 30, 20, 'rgba(120,90,40,A)', .35);
  ctx.fillStyle = '#2a2418';
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ctx.fillRect(cx + Math.sin(a) * 42 - 2, cy - Math.cos(a) * 42 - 2, 4, i % 3 ? 4 : 8); }
  const hand = (ang, len, wd, col) => { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ang) * len, cy - Math.cos(ang) * len); ctx.stroke(); };
  hand((11 + 10 / 60) / 12 * Math.PI * 2, 26, 5, '#1b1712');
  hand(10 / 60 * Math.PI * 2, 38, 3.5, '#1b1712');
  hand((st.flags.ev340 ? 42 : 41) / 60 * Math.PI * 2, 40, 1.5, '#8a1d14');
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.ellipse(cx - 18, cy - 22, 22, 10, -.6, 0, 7); ctx.fill();
  note(ctx, cx - 30, cy + 66, 62, 38, .06, '#d6c99c');

  // quadro de luz
  castShadow(ctx, 1290, 300, 170, 230, 30);
  ctx.fillStyle = '#2b2f29'; ctx.fillRect(1290, 300, 170, 230);
  ctx.fillStyle = '#3d4239'; ctx.fillRect(1302, 312, 146, 206);
  speckle(ctx, 1290, 300, 170, 230, 900, 51, ['rgba(110,60,25,.35)', 'rgba(0,0,0,.3)'], 3);
  bevel(ctx, 1290, 300, 170, 230, 4);
  pipe(ctx, [[1375, WALL_TOP], [1375, 300]], 14, '#3c3a33', 'rgba(220,210,190,.2)');
  const sockets = [[1340, 370], [1410, 370], [1340, 455], [1410, 455]];
  sockets.forEach(([sx, sy], i) => {
    ctx.fillStyle = '#d8d2c0'; ctx.beginPath(); ctx.arc(sx, sy, 25, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.arc(sx + 3, sy + 4, 25, 0, 7); ctx.fill();
    ctx.fillStyle = '#cfc9b6'; ctx.beginPath(); ctx.arc(sx, sy, 22, 0, 7); ctx.fill();
    const empty = i === 3 && !st.fuse;
    if (empty) {
      ctx.fillStyle = '#060504'; ctx.beginPath(); ctx.arc(sx, sy, 14, 0, 7); ctx.fill();
      ctx.strokeStyle = '#7c6a48'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy, 12, 0, 7); ctx.stroke();
    } else {
      ctx.fillStyle = '#3a2316'; ctx.beginPath(); ctx.arc(sx, sy, 15, 0, 7); ctx.fill();
      ctx.fillStyle = '#8f7c55'; ctx.beginPath(); ctx.arc(sx, sy, 6, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,240,200,.2)'; ctx.beginPath(); ctx.arc(sx - 5, sy - 6, 4, 0, 7); ctx.fill();
    }
  });
  note(ctx, 1318, 318, 112, 22, -.02, '#c9b989');
  ctx.fillStyle = 'rgba(40,30,20,.8)'; ctx.font = '15px "Architects Daughter", cursive'; ctx.fillText('LUZ PORÃO', 1330, 335);

  lamp(ctx, LAMP_X[0]);
};

// o que brilha mesmo no escuro: a fresta da porta lá em cima, a rua, o LED ligado
EMIT[0] = function (ctx, st, t) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const fl = .8 + Math.sin(t / 900) * .05;
  ctx.fillStyle = `rgba(255,170,80,${.55 * fl})`; ctx.fillRect(60, 37, 210, 3);
  const g = ctx.createRadialGradient(165, 40, 2, 165, 40, 120);
  g.addColorStop(0, `rgba(255,150,60,${.12 * fl})`); g.addColorStop(1, 'rgba(255,150,60,0)');
  ctx.fillStyle = g; ctx.fillRect(40, 0, 260, 140);
  const s = ctx.createRadialGradient(950, 112, 2, 950, 112, 110);
  s.addColorStop(0, 'rgba(255,140,50,.16)'); s.addColorStop(1, 'rgba(255,140,50,0)');
  ctx.fillStyle = s; ctx.fillRect(760, 104, 250, 76);
  ctx.fillStyle = 'rgba(255,150,70,.07)'; ctx.fillRect(770, 154, 230, 3);
  if (st.power) {
    seg7(ctx, clockText(), 690, 234, 44, '#ff3a1e', null);
    const lg = ctx.createRadialGradient(800, 256, 10, 800, 256, 220);
    lg.addColorStop(0, 'rgba(255,40,10,.22)'); lg.addColorStop(1, 'rgba(255,40,10,0)');
    ctx.fillStyle = lg; ctx.fillRect(580, 120, 440, 280);
  }
  ctx.restore();
};
