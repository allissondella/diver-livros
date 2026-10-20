// ===== films.js — as fitas da câmera do Fábio: a ida (abertura) e a volta (fim) =====
// Tudo desenhado em 320x240 e estragado pelo makeVHS (vhs.js).
const fr = rng(9091), BUILD = Array.from({ length: 14 }, (_, i) => ({ x: i * 26 - 10, w: 22 + fr() * 14, h: 50 + fr() * 90, lit: Array.from({ length: 12 }, () => fr() < .35) }));
function sway(g, t, a) { g.translate(Math.sin(t * 2.7) * 3 * a, Math.abs(Math.sin(t * 5.4)) * 3 * a); }
function ledText(g, txt, x, y, size, a) {
  g.save(); g.font = `${size}px VT323, monospace`; g.shadowColor = `rgba(255,150,40,${a})`; g.shadowBlur = 6;
  g.fillStyle = `rgba(255,160,50,${a})`; g.fillText(txt, x, y); g.restore();
}
function cityNight(g, t, wet) {
  g.fillStyle = '#06070a'; g.fillRect(0, 0, VW, VH);
  for (const b of BUILD) { g.fillStyle = '#0d0e11'; g.fillRect(b.x, 140 - b.h, b.w, b.h);
    b.lit.forEach((l, k) => { if (l && k * 9 < b.h - 6) { g.fillStyle = 'rgba(230,200,120,.35)'; g.fillRect(b.x + 4 + (k % 2) * 9, 140 - b.h + 6 + k * 9, 4, 4); } }); }
  g.fillStyle = '#111215'; g.fillRect(0, 140, VW, 50);
  if (wet) { g.fillStyle = 'rgba(255,170,80,.12)'; for (let i = 0; i < 9; i++) g.fillRect(i * 37 + 8, 150 + (i % 3) * 9, 18, 2); }
  g.fillStyle = '#1a1917'; g.fillRect(0, 190, VW, 50);
}
function orelhao(g, x, y) {
  g.fillStyle = '#18222c'; g.fillRect(x + 14, y + 30, 4, 60);
  g.fillStyle = '#2b5f9e'; g.beginPath(); g.ellipse(x + 16, y + 24, 20, 26, 0, Math.PI, 0); g.lineTo(x + 36, y + 40); g.lineTo(x - 4, y + 40); g.closePath(); g.fill();
  g.fillStyle = '#0b0e12'; g.beginPath(); g.ellipse(x + 16, y + 30, 13, 16, 0, Math.PI, 0); g.fill();
}
function onibusAceso(g, x) { // lateral do 875A, aceso, chegando no ponto da Paulista
  g.fillStyle = '#6f6a5a'; g.fillRect(x, 92, 260, 92); g.fillStyle = '#5a2016'; g.fillRect(x, 150, 260, 10);
  for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(220,195,120,.6)'; g.fillRect(x + 40 + i * 36, 100, 30, 30);
    g.fillStyle = 'rgba(30,25,15,.6)'; if (i % 2) g.fillRect(x + 48 + i * 36, 112, 10, 18); }
  g.fillStyle = '#1a1a18'; g.fillRect(x + 4, 98, 26, 72);
  g.fillStyle = '#111'; g.fillRect(x + 2, 86, 120, 10); ledText(g, '875A-10 PERDIZES', x + 6, 95, 11, .95);
  g.fillStyle = '#050505'; for (const wx of [40, 210]) { g.beginPath(); g.arc(x + wx, 186, 14, 0, 7); g.fill(); }
  const hl = g.createRadialGradient(x, 165, 0, x, 165, 40); hl.addColorStop(0, 'rgba(255,240,200,.8)'); hl.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = hl; g.fillRect(x - 40, 125, 80, 80);
}
function interiorOnibus(g, t, lit) {
  const L = lit ? 1 : .18;
  g.fillStyle = `rgb(${26 * L + 4},${22 * L + 4},${14 * L + 4})`; g.fillRect(0, 0, VW, VH);
  g.fillStyle = `rgb(${58 * L | 0},${51 * L | 0},${38 * L | 0})`; poly(g, [[0, 0], [VW, 0], [190, 95], [130, 95]]); g.fill();
  g.fillStyle = '#121110'; poly(g, [[0, VH], [VW, VH], [190, 130], [130, 130]]); g.fill();
  g.fillStyle = '#030303'; poly(g, [[0, 40], [130, 98], [130, 118], [0, 140]]); g.fill(); poly(g, [[VW, 40], [190, 98], [190, 118], [VW, 140]]); g.fill();
  if (lit) for (const [y, w] of [[8, 90], [42, 50], [70, 22]]) { g.fillStyle = 'rgba(255,240,190,.85)'; g.fillRect(160 - w, y, w * 2, 4 - y / 40); }
  else { const s = (t * 140) % 400 - 60; const gr = g.createLinearGradient(s - 40, 0, s + 40, 0); gr.addColorStop(0, 'rgba(255,150,60,0)'); gr.addColorStop(.5, 'rgba(255,150,60,.35)'); gr.addColorStop(1, 'rgba(255,150,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, VW, VH); }
  for (let k = 0; k < 4; k++) { const s = 1 - k * .22, y = 140 - k * 12;
    g.fillStyle = `rgb(${42 * L | 0},${53 * L | 0},${80 * L | 0})`; g.fillRect(4 + k * 32, y - 40 * s, 52 * s, 50 * s); g.fillRect(VW - 4 - k * 32 - 52 * s, y - 40 * s, 52 * s, 50 * s); }
  g.fillStyle = '#0a0a0c'; g.fillRect(130, 95, 60, 35);
  if (lit) {
    g.fillStyle = '#5c4636'; g.beginPath(); g.arc(44, 92, 10, 0, 7); g.fill(); g.fillStyle = '#3a2e42'; g.fillRect(32, 102, 26, 30);
    g.fillStyle = '#7a3b2a'; g.fillRect(58, 112, 16, 20); g.strokeStyle = '#d7c39a'; g.lineWidth = 1; g.strokeRect(58, 112, 16, 20);
    g.fillStyle = '#4b3a2a'; g.beginPath(); g.arc(270, 96, 10, 0, 7); g.fill(); g.fillStyle = '#2e3a2a'; g.fillRect(256, 104, 30, 30);
    g.fillStyle = '#4b3a2a'; g.beginPath(); g.arc(226, 112, 6, 0, 7); g.fill();
  }
  g.strokeStyle = lit ? '#8d8a80' : '#2a2a28'; g.lineWidth = 3; g.beginPath(); g.moveTo(140, 118); g.lineTo(140, 140); g.moveTo(132, 126); g.lineTo(150, 126); g.stroke();
}
function mulher(g, t, look, closed) { // a passageira atrás da catraca: pálida, olhos inteiramente pretos
  g.fillStyle = '#0a0b0d'; g.fillRect(0, 0, VW, VH);
  g.fillStyle = '#1d2638'; g.fillRect(70, 40, 180, 200);
  g.fillStyle = '#020202'; g.fillRect(0, 0, 70, 160); g.fillRect(250, 0, 70, 160);
  g.fillStyle = '#26262a'; g.beginPath(); g.ellipse(160, 230, 90, 60, 0, Math.PI, 0); g.fill();
  const fx = 160 + (1 - look) * 14;
  g.fillStyle = '#bfb9ad'; g.fillRect(fx - 10, 140, 20, 30);
  g.fillStyle = '#c9c3b6'; g.beginPath(); g.ellipse(fx, 100, 33, 43, 0, 0, 7); g.fill();
  g.fillStyle = '#0d0c0b'; g.beginPath(); g.ellipse(fx, 82, 37, 34, 0, Math.PI, 0); g.fill(); g.fillRect(fx - 37, 80, 8, 40); g.fillRect(fx + 29, 80, 8, 40);
  if (look > .5 && !closed) { g.fillStyle = '#000'; g.beginPath(); g.ellipse(fx - 12, 98, 7, 5, 0, 0, 7); g.ellipse(fx + 12, 98, 7, 5, 0, 0, 7); g.fill(); }
  else { g.strokeStyle = '#6d675d'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(fx - 18, 99); g.lineTo(fx - 6, 100); g.moveTo(fx + 6, 100); g.lineTo(fx + 18, 99); g.stroke(); }
  g.strokeStyle = '#8f897d'; g.lineWidth = 1; g.beginPath(); g.moveTo(fx, 102); g.lineTo(fx - 2, 116); g.stroke();
  g.strokeStyle = '#7a6f66'; g.beginPath(); g.moveTo(fx - 8, 126); g.lineTo(fx + 8, 126); g.stroke();
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, VW, VH);
}
function janelaReflexo(g, t, txt) {
  g.fillStyle = '#030304'; g.fillRect(0, 0, VW, VH);
  for (let i = 0; i < 7; i++) { const x = ((i * 70 - t * 90) % 460 + 460) % 460 - 70; g.fillStyle = 'rgba(255,170,70,.5)'; g.beginPath(); g.arc(x, 150 + (i % 3) * 14, 2, 0, 7); g.fill();
    g.fillStyle = '#0a0a0c'; g.fillRect(x - 20, 60 + (i % 4) * 12, 26, 120); }
  g.fillStyle = 'rgba(40,50,80,.25)'; g.fillRect(0, 120, VW, 120);
  ledText(g, txt, 16, 70, 26, .9);
  g.strokeStyle = '#151515'; g.lineWidth = 8; g.strokeRect(4, 4, VW - 8, VH - 8);
}
function painelInterno(g, t) {
  g.fillStyle = '#0b0a08'; g.fillRect(0, 0, VW, VH);
  g.fillStyle = '#2b2721'; g.fillRect(0, 0, VW, 60);
  g.fillStyle = '#050403'; g.fillRect(40, 70, 240, 60);
  if ((t * 2 | 0) % 2 === 0) ledText(g, 'ÚLTIMA PARADA', 62, 112, 34, .95);
  g.fillStyle = 'rgba(255,150,40,.05)'; g.fillRect(0, 0, VW, VH);
}
function casaAmarela(g, t, z) {
  g.fillStyle = '#05060a'; g.fillRect(0, 0, VW, VH);
  g.save(); g.translate(160, 140); g.scale(z, z); g.translate(-160, -140);
  g.fillStyle = '#6e5f34'; g.fillRect(80, 30, 170, 150);
  g.fillStyle = 'rgba(255,190,110,.55)'; g.fillRect(110, 52, 26, 30);
  g.fillStyle = '#16140d'; g.fillRect(180, 52, 26, 30); g.fillRect(150, 112, 30, 68);
  g.fillStyle = '#0a0b08'; g.beginPath(); g.ellipse(50, 90, 60, 70, 0, 0, 7); g.fill();
  g.strokeStyle = '#0b0b0a'; g.lineWidth = 3; for (let x = 60; x < 280; x += 10) { g.beginPath(); g.moveTo(x, 150); g.lineTo(x, 200); g.stroke(); }
  g.fillRect(60, 150, 220, 4);
  g.restore();
  const s = g.createRadialGradient(290, 20, 0, 290, 20, 160); s.addColorStop(0, 'rgba(255,160,60,.45)'); s.addColorStop(1, 'rgba(255,160,60,0)'); g.fillStyle = s; g.fillRect(0, 0, VW, VH);
  garoa(g, t * 1000, 40);
}
function pontoFinalBaixo(g, t, busX, blink) {
  g.fillStyle = '#060608'; g.fillRect(0, 0, VW, VH);
  for (let i = 0; i < 6; i++) { g.fillStyle = '#0e0e0c'; g.fillRect(i * 56, 60 + (i % 3) * 18, 50, 90); }
  g.fillStyle = '#141414'; g.fillRect(0, 150, VW, 40); g.fillStyle = '#26251f'; g.fillRect(0, 190, VW, 50);
  const s = g.createRadialGradient(240, 30, 0, 240, 30, 170); s.addColorStop(0, 'rgba(255,150,60,.5)'); s.addColorStop(1, 'rgba(255,150,60,0)'); g.fillStyle = s; g.fillRect(0, 0, VW, VH);
  if (busX != null) {
    g.fillStyle = '#141617'; g.fillRect(busX, 70, 300, 116); g.fillStyle = '#050606'; for (let i = 0; i < 6; i++) g.fillRect(busX + 30 + i * 44, 78, 36, 34);
    g.fillStyle = '#0b0b0b'; g.fillRect(busX + 260, 62, 40, 12); if (blink) ledText(g, '7 A – PERDI', busX + 200, 72, 12, .95);
    g.fillStyle = '#030303'; for (const wx of [50, 250]) { g.beginPath(); g.arc(busX + wx, 188, 15, 0, 7); g.fill(); }
  }
  garoa(g, t * 1000, 60, .22);
}
function caixaNoColo(g, t) {
  interiorOnibus(g, t, false);
  g.fillStyle = '#3e4142'; g.fillRect(170, 170, 120, 60); g.fillStyle = '#2e3132'; g.fillRect(170, 170, 120, 10);
  g.fillStyle = '#c9a428'; g.beginPath(); g.arc(230, 204, 13, 0, 7); g.fill();
  g.fillStyle = '#111'; for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + k * 2.094; g.beginPath(); g.moveTo(230, 204); g.arc(230, 204, 11, a - .5, a + .5); g.closePath(); g.fill(); }
  g.fillStyle = '#3a2c24'; g.fillRect(150, 190, 26, 40); g.fillRect(284, 190, 26, 40);
}
function barraFunda(g, t) {
  g.fillStyle = '#08090b'; g.fillRect(0, 0, VW, VH);
  g.fillStyle = '#20232a'; g.fillRect(0, 110, VW, 70);
  for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(220,235,255,.6)'; g.fillRect(i * 44 + 6, 96, 30, 4); }
  g.fillStyle = '#12285e'; g.fillRect(90, 50, 140, 28); g.fillStyle = '#e8eef8'; g.font = '18px VT323, monospace'; g.fillText('BARRA FUNDA', 112, 70);
  g.strokeStyle = '#151515'; g.lineWidth = 10; g.strokeRect(5, 5, VW - 10, VH - 10);
}
function caixaNoBanco(g, t, door) {
  interiorOnibus(g, t, false);
  g.fillStyle = '#25304a'; g.fillRect(40, 120, 180, 80);
  g.fillStyle = '#3e4142'; g.fillRect(80, 150, 100, 46); g.fillStyle = '#c9a428'; g.beginPath(); g.arc(130, 174, 11, 0, 7); g.fill();
  g.fillStyle = '#111'; g.beginPath(); g.arc(130, 174, 3, 0, 7); g.fill();
  g.fillStyle = '#0d0e0e'; g.fillRect(VW - door * 160, 0, 160, VH);
}
function indoEmbora(g, t, k) {
  g.fillStyle = '#060709'; g.fillRect(0, 0, VW, VH);
  const dawn = g.createLinearGradient(0, 0, 0, 120); dawn.addColorStop(0, `rgba(40,60,90,${.15 + k * .2})`); dawn.addColorStop(1, 'rgba(40,60,90,0)'); g.fillStyle = dawn; g.fillRect(0, 0, VW, 120);
  g.fillStyle = '#121315'; g.fillRect(0, 140, VW, 50); g.fillStyle = '#1e1e1c'; g.fillRect(0, 190, VW, 50);
  const s = 1 - k * .7, x = 120 - k * 150;
  g.fillStyle = '#121414'; g.fillRect(x, 150 - 90 * s, 110 * s, 90 * s);
  g.fillStyle = '#050606'; g.fillRect(x + 10 * s, 150 - 80 * s, 90 * s, 34 * s);
  if (k < .7 && Math.random() < .6 - k * .6) ledText(g, '7 A – PERDI', x + 8 * s, 150 - 84 * s, Math.max(6, 12 * s), .9 - k);
}

const FILM_IDA = {
  dur: 70, motor: [[12, 58, .09], [58, 64, .04]],
  subs: [[6, 11, '[garoa. Av. Paulista, uma e meia da manhã]'], [13, 17.5, '[o 875A-10 encosta no ponto]'], [19, 25, '[motor. a catraca gira]'],
    [29, 31.5, '[uma mulher sozinha, no banco atrás da catraca]'], [31.5, 35.5, '“Seu lugar não é aqui. Desce.”', 'mulher-desce'], [39, 51, '[o letreiro vai perdendo as letras]'],
    [58, 62, '[a porta abre e espera]'], [62.5, 64, '[ela ainda está olhando]'], [64.5, 68, '[o portão. a porta da casa]']],
  draw(g, t) {
    const clk = (s) => { const tot = 3600 + 31 * 60 + s * 25; return `0${Math.floor(tot / 3600)}:${String(Math.floor(tot / 60) % 60).padStart(2, '0')}:${String(Math.floor(tot) % 60).padStart(2, '0')}`; };
    const stamp = ['JUN. 7 1996', clk(t)];
    if (t < 2) { vcrBlue(g, 'PLAY ►'); return { snow: 0 }; }
    if (t < 5) { g.fillStyle = '#000'; g.fillRect(0, 0, VW, VH); return { snow: .9 - (t - 2) * .2, track: 1 }; }
    g.save(); sway(g, t, t < 18 ? 1 : .5);
    let o = { stamp, track: .2 };
    if (t < 18) { cityNight(g, t, true); orelhao(g, 40, 110); garoa(g, t * 1000, 50); if (t > 13) onibusAceso(g, 330 - (Math.min(t, 17.5) - 13) / 4.5 * 330); }
    else if (t < 29) interiorOnibus(g, t, true);
    else if (t < 36) { mulher(g, t, Math.min(1, (t - 29) / 1.4)); o = { stamp, track: .35 + (t > 31.5 && t < 35.5 ? .3 : 0) }; }
    else if (t < 38) interiorOnibus(g, t, true);
    else if (t < 52) { const L = ['875A-10  AEROPORTO – PERDIZES', '875A-10  AEROPORTO – PERDI ES', '875A-1   AER PORTO – PERDI  S', '87 A     A   ORTO – PERDI', ' 7 A               – PERDI']; janelaReflexo(g, t, L[Math.min(4, (t - 38) / 2.8 | 0)]); o = { stamp, track: .3 }; }
    else if (t < 58) { painelInterno(g, t); o = { stamp, track: .25 }; }
    else if (t < 62.5) { casaAmarela(g, t, 1); g.fillStyle = '#0c0c0b'; g.fillRect(0, 0, 70 - (t - 58) * 10, VH); g.fillRect(250 + (t - 58) * 10, 0, 80, VH); }
    else if (t < 64) { g.restore(); mulher(g, t, 1); return { stamp, track: .9 }; }
    else if (t < 68) casaAmarela(g, t, 1 + (t - 64) * .18);
    else if (t < 69) { g.restore(); g.fillStyle = '#000'; g.fillRect(0, 0, VW, VH); return { snow: .9, track: 1 }; }
    else { g.restore(); vcrBlue(g, 'STOP ■'); return { snow: 0 }; }
    g.restore(); return o;
  },
};

const FILM_VOLTA = {
  dur: 52, motor: [[3, 32, .07], [38, 47, .05]],
  subs: [[2, 6.5, '[o rádio, muito longe] “Agora vai.”', 'aurelio-agora-vai', 'radio'], [8, 12, '[sem farol. a porta abre e espera]'], [14, 19, '[a mulher de olhos pretos olha a caixa]'], [19, 23, '[e fecha os olhos]'],
    [26, 31, '[Metrô Barra Funda]'], [33, 37.5, '[a caixa fica no banco]'], [40, 46, '[o ônibus vai embora sem acender]']],
  draw(g, t) {
    const stamp = ['JUN. 7 1996', `05:${String(10 + Math.floor(t * 3 / 60)).padStart(2, '0')}:${String(Math.floor(t * 3) % 60).padStart(2, '0')}`];
    if (t < 2) { g.fillStyle = '#000'; g.fillRect(0, 0, VW, VH); return { snow: .9, track: 1 }; }
    g.save(); sway(g, t, .4);
    let o = { stamp, track: .25 };
    if (t < 12) pontoFinalBaixo(g, t, t < 8 ? -300 + (t - 2) / 6 * 290 : -10, (t * 3 | 0) % 2 === 0);
    else if (t < 24) { if (t > 16 && t < 23) { g.restore(); mulher(g, t, 1, t > 19.5); return { stamp, track: .45 }; } caixaNoColo(g, t); }
    else if (t < 32) { if (t > 26) barraFunda(g, t); else interiorOnibus(g, t, false); }
    else if (t < 38) caixaNoBanco(g, t, Math.min(1, (t - 35) / 2));
    else if (t < 47) { indoEmbora(g, t, (t - 38) / 9); o = { stamp, track: .3 }; }
    else if (t < 50) { g.restore(); g.fillStyle = '#000'; g.fillRect(0, 0, VW, VH); return { snow: .9, track: 1 }; }
    else { g.restore(); vcrBlue(g, 'STOP ■'); return { snow: 0 }; }
    g.restore(); return o;
  },
};
