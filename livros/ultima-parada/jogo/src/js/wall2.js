// ===== wall2.js — parede de tijolos (canos, labirinto, cômoda com três cadeados) =====
function padlock(ctx, x, y, kind) { // x,y = topo da alça
  ctx.strokeStyle = '#9a9a92'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(x, y + 16, 12, Math.PI, 0); ctx.lineTo(x + 12, y + 26); ctx.moveTo(x - 12, y + 16); ctx.lineTo(x - 12, y + 26); ctx.stroke();
  const bw = kind === 'key' ? 38 : 46, bh = kind === 'key' ? 40 : 50;
  ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(x - bw / 2 + 4, y + 28, bw, bh);
  ctx.fillStyle = '#9b7a2c'; ctx.fillRect(x - bw / 2, y + 24, bw, bh);
  ctx.fillStyle = 'rgba(255,230,150,.3)'; ctx.fillRect(x - bw / 2, y + 24, bw, 4); ctx.fillRect(x - bw / 2, y + 24, 4, bh);
  ctx.fillStyle = 'rgba(40,25,5,.4)'; ctx.fillRect(x - bw / 2, y + 24 + bh - 5, bw, 5);
  if (kind === 'key') {
    ctx.fillStyle = '#1a1206'; ctx.beginPath(); ctx.arc(x, y + 40, 5, 0, 7); ctx.fill(); ctx.fillRect(x - 2, y + 40, 4, 12);
  } else {
    for (let i = 0; i < 4; i++) {
      const wx = x - bw / 2 + 5 + i * 9.5;
      ctx.fillStyle = '#1b1a17'; ctx.fillRect(wx, y + 32, 8, bh - 16);
      ctx.fillStyle = '#d8d2bc'; ctx.fillRect(wx + 1, y + 44, 6, 12);
      ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(wx, y + 32, 8, 3);
    }
    ctx.fillStyle = '#222'; ctx.font = 'bold 9px Arial';
    const chars = kind === 'letters' ? 'MZKQ' : '0000';
    for (let i = 0; i < 4; i++) ctx.fillText(chars[i], x - bw / 2 + 6.2 + i * 9.5, y + 54);
  }
}
function drawMazeWalls(ctx, x0, y0, cw, ch, col, lw) {
  const { cols, rows, h, v, exitCol, start } = MAZE;
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.beginPath();
  const line = (a, b, c, d) => { ctx.moveTo(x0 + a * cw, y0 + b * ch); ctx.lineTo(x0 + c * cw, y0 + d * ch); };
  line(0, 0, start[0], 0); line(start[0] + 1, 0, cols, 0); // topo com a entrada
  line(0, rows, exitCol, rows); line(exitCol + 1, rows, cols, rows); // fundo com a saída
  line(0, 0, 0, rows); line(cols, 0, cols, rows);
  for (const k of h) { const [c, r] = k.split(',').map(Number); line(c, r + 1, c + 1, r + 1); }
  for (const k of v) { const [c, r] = k.split(',').map(Number); line(c + 1, r, c + 1, r + 1); }
  ctx.stroke();
}
function drawer(ctx, x, y, w, h, seed, open) {
  if (open) { // puxada: fresta escura em cima, frente um pouco mais baixa
    ctx.fillStyle = '#040302'; ctx.fillRect(x, y, w, 10);
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(x - 2, y + h, w + 4, 8);
    y += 8;
  }
  ctx.fillStyle = '#cfc6ae'; ctx.fillRect(x, y, w, h);
  const r = rng(seed);
  // tinta descascando: lascas pequenas e irregulares mostrando a madeira
  for (let i = 0; i < 26; i++) {
    const px = x + r() * w, py = y + r() * h, s = 3 + r() * 11;
    ctx.fillStyle = r() < .5 ? '#6b5233' : '#7d6442';
    poly(ctx, [[px, py], [px + s, py + r() * 3], [px + s * .8, py + s * .5], [px + s * .2, py + s * .6 + r() * 3]]); ctx.fill();
    ctx.fillStyle = 'rgba(255,250,235,.25)'; ctx.fillRect(px, py - 1, s * .8, 1);
  }
  speckle(ctx, x, y, w, h, 260, seed + 1, ['rgba(70,50,30,.35)', 'rgba(120,110,90,.3)'], 2);
  bevel(ctx, x, y, w, h, 4);
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2; ctx.strokeRect(x + 10, y + 10, w - 20, h - 20);
  // puxador de ferro em arco
  const hx = x + w / 2 - 70, hy = y + h / 2;
  ctx.fillStyle = '#18130d'; ctx.fillRect(hx - 6, hy - 7, 14, 14); ctx.fillRect(hx + 58, hy - 7, 14, 14);
  ctx.strokeStyle = '#18130d'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(hx + 1, hy + 2); ctx.quadraticCurveTo(hx + 33, hy + 26, hx + 65, hy + 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,190,170,.25)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(hx + 4, hy); ctx.quadraticCurveTo(hx + 33, hy + 21, hx + 62, hy); ctx.stroke();
  // ferrolho onde o cadeado pendura
  ctx.fillStyle = '#6d6c64'; ctx.fillRect(x + w - 64, y + h / 2 - 26, 46, 12); ctx.fillRect(x + w - 30, y + h / 2 - 34, 12, 18);
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(x + w - 64, y + h / 2 - 15, 46, 3);
}

ART[2] = function (ctx, st) {
  bricks(ctx, 0, WALL_TOP, W, FLOOR - WALL_TOP, 201);
  ceiling(ctx, 202);
  floor(ctx, 203);
  const dx = st.open.oficina ? 270 : 0; // a cômoda corre junto com o painel
  if (!st.open.oficina) { // emenda quase invisível de um painel atrás da cômoda
    ctx.strokeStyle = 'rgba(20,12,6,.35)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(955, FLOOR - 16); ctx.lineTo(955, 302); ctx.lineTo(1325, 302); ctx.lineTo(1325, FLOOR - 16); ctx.stroke();
    ctx.strokeStyle = 'rgba(200,170,130,.08)'; ctx.beginPath(); ctx.moveTo(957, FLOOR - 16); ctx.lineTo(957, 304); ctx.lineTo(1323, 304); ctx.stroke();
  } else { // o vão da oficina, com a luz branca da bancada lá dentro
    ctx.fillStyle = '#060707'; ctx.fillRect(955, 302, 370, FLOOR - 302);
    const lg = ctx.createRadialGradient(1090, 420, 10, 1090, 420, 260);
    lg.addColorStop(0, 'rgba(225,232,236,.32)'); lg.addColorStop(1, 'rgba(225,232,236,0)');
    ctx.fillStyle = lg; ctx.fillRect(955, 302, 370, FLOOR - 302);
    ctx.fillStyle = '#2a2722'; ctx.fillRect(990, 520, 280, 16); ctx.fillStyle = '#1a1916'; ctx.fillRect(1000, 536, 10, 180); ctx.fillRect(1250, 536, 10, 180);
    ctx.fillStyle = '#3d2618'; ctx.fillRect(1060, 440, 110, 80);
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(951, 298, 8, FLOOR - 298); ctx.fillRect(951, 298, 378, 8);
  }
  for (let i = 0; i < 6; i++) stain(ctx, 300 + i * 220, 140, 120, 90, 'rgba(25,40,18,A)', .45);

  // canos
  pipe(ctx, [[0, 120], [W, 120]], 13, '#3a3832', 'rgba(220,210,190,.22)');
  pipe(ctx, [[560, WALL_TOP], [560, 380], [760, 380], [760, WALL_TOP]], 18, '#bdb6a2', 'rgba(255,255,255,.45)');
  pipe(ctx, [[560, 380], [560, FLOOR]], 18, '#bdb6a2', 'rgba(255,255,255,.45)');
  pipe(ctx, [[760, 380], [880, 470], [880, FLOOR - 30]], 14, '#a9a28e', 'rgba(255,255,255,.35)');
  // cano fino do labirinto, rente ao rodapé até a cômoda
  pipe(ctx, [[360, 500], [360, 692], [950, 692]], 8, '#575247', 'rgba(230,220,200,.3)');
  stain(ctx, 560, 300, 60, 160, 'rgba(25,45,20,A)', .5);
  stain(ctx, 760, 220, 50, 120, 'rgba(25,45,20,A)', .5);

  // labirinto de vidro embutido no tijolo (desenhado a partir de MAZE)
  castShadow(ctx, 300, 260, 120, 240, 16);
  ctx.fillStyle = '#1d1c19'; ctx.fillRect(296, 256, 128, 248);
  ctx.fillStyle = '#0d1110'; ctx.fillRect(308, 268, 104, 224);
  drawMazeWalls(ctx, MAZE.gx, MAZE.gy, MAZE.cw, MAZE.ch, 'rgba(150,160,150,.4)', 2.5);
  if (st.flags.mazeDone) { ctx.fillStyle = 'rgba(200,200,190,.25)'; ctx.fillRect(354, 494, 12, 8); }
  ctx.fillStyle = 'rgba(255,255,255,.08)'; poly(ctx, [[312, 270], [350, 270], [330, 490], [312, 490]]); ctx.fill();
  ctx.fillStyle = '#2b2a26'; poly(ctx, [[344, 240], [376, 240], [366, 258], [354, 258]]); ctx.fill();
  ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.ellipse(360, 242, 12, 4, 0, 0, 7); ctx.fill();
  bevel(ctx, 296, 256, 128, 248, 4);

  // cômoda branca descascada
  const X = 980 + dx, Y = 430, CW = 320;
  castShadow(ctx, X, Y, CW, FLOOR - Y - 10, 40);
  floorShadow(ctx, X, CW, 40);
  ctx.fillStyle = '#2a1d10'; ctx.fillRect(X + 10, 700, 20, 20); ctx.fillRect(X + CW - 30, 700, 20, 20);
  ctx.fillStyle = '#b9b09a'; ctx.fillRect(X, Y + 10, CW, 692 - Y);
  wood(ctx, X - 12, Y - 4, CW + 24, 18, '#d6cdb6', 211, 'h'); bevel(ctx, X - 12, Y - 4, CW + 24, 18, 3);
  drawer(ctx, X + 8, 626, CW - 16, 66, 223, st.open.gav3);
  drawer(ctx, X + 8, 538, CW - 16, 80, 222, st.open.gav2);
  drawer(ctx, X + 8, 450, CW - 16, 80, 221, st.open.gav1);
  if (!st.open.gav1) padlock(ctx, X + CW - 33, 452, 'letters');
  if (!st.open.gav2) padlock(ctx, X + CW - 33, 540, 'numbers');
  if (!st.open.gav3) padlock(ctx, X + CW - 33, 624, 'key');
  // paninho de crochê e porta-retrato virado para baixo
  ctx.fillStyle = 'rgba(225,220,200,.85)'; ctx.beginPath(); ctx.ellipse(X + 100, 428, 70, 7, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(120,110,90,.6)'; ctx.lineWidth = 1;
  for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.arc(X + 32 + i * 8, 431, 4, 0, Math.PI); ctx.stroke(); }
  ctx.fillStyle = '#2b2116'; poly(ctx, [[X + 60, 424], [X + 140, 424], [X + 134, 414], [X + 66, 414]]); ctx.fill();
  ctx.fillStyle = '#4a3a25'; ctx.fillRect(X + 66, 410, 68, 5);

  lamp(ctx, LAMP_X[2]);
};
EMIT[2] = function () {};
