// ===== vhs.js — fita copiada de fita até sobrar quase nada (lost media) =====
// Desenha a cena em 320x240, depois estraga: linhas tremendo, faixa de tracking,
// fantasma de cor, chiado, scanlines, cor lavada, data de filmadora.
const VW = 320, VH = 240;
function makeVHS(out) {
  const src = mk(VW, VH), sg = src.getContext('2d');
  const tmp = mk(VW, VH), tg = tmp.getContext('2d');
  const og = out.getContext('2d');
  const noise = [];
  for (let i = 0; i < 6; i++) {
    const c = mk(VW, VH), g = c.getContext('2d'), d = g.createImageData(VW, VH);
    for (let p = 0; p < d.data.length; p += 4) { const v = Math.random() * 255; d.data[p] = d.data[p + 1] = d.data[p + 2] = v; d.data[p + 3] = 255; }
    g.putImageData(d, 0, 0); noise.push(c);
  }
  const lines = mk(4, 4), lg = lines.getContext('2d');
  lg.fillStyle = 'rgba(0,0,0,.45)'; lg.fillRect(0, 2, 4, 2);
  let hold = 0, held = false;
  // vídeo filmado: só o que uma fita copiada faz de verdade (tremida de linha, tracking, chiado leve)
  const real = function (t, o) {
    const W2 = out.width, H2 = out.height, k = W2 / VW, img = o.img, iw = img.videoWidth || VW, ih = img.videoHeight || VH;
    const band = ((t / 18) % (VH + 80)) - 40, tr = o.track || 0, sh = 6;
    og.globalCompositeOperation = 'source-over'; og.globalAlpha = 1; og.imageSmoothingEnabled = true;
    og.fillStyle = '#000'; og.fillRect(0, 0, W2, H2);
    for (let y = 0; y < VH; y += sh) {
      let dx = (Math.random() - .5) * .5;
      if (Math.abs(y - band) < 14) dx += (Math.random() - .5) * (2 + 18 * tr);
      if (y > VH - 10) dx += 3 + Math.random() * 5; // borda de baixo rasgada
      if (Math.random() < .003) dx += (Math.random() - .5) * 16;
      og.drawImage(img, 0, y / VH * ih, iw, sh / VH * ih, dx * k, y * k, W2, sh * k + 1);
    }
    og.globalCompositeOperation = 'lighter'; og.globalAlpha = .06; og.drawImage(out, 2.5 * k, 0, W2, H2);
    og.globalCompositeOperation = 'source-over';
    const n = noise[(Math.random() * noise.length) | 0];
    og.globalAlpha = o.snow != null ? o.snow : .05 + tr * .2; og.drawImage(n, 0, 0, W2, H2);
    og.globalAlpha = .1 + tr * .45; og.drawImage(n, 0, 0, VW, 14, 0, (band - 7) * k, W2, 14 * k);
    og.globalAlpha = .3; og.fillStyle = og.createPattern(lines, 'repeat'); og.fillRect(0, 0, W2, H2);
    og.globalAlpha = 1;
    const v = og.createRadialGradient(W2 / 2, H2 / 2, H2 * .35, W2 / 2, H2 / 2, W2 * .75);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); og.fillStyle = v; og.fillRect(0, 0, W2, H2);
    if (o.overlay) { og.save(); og.scale(k, k); o.overlay(og, t); og.restore(); }
    og.font = `${Math.round(17 * k)}px VT323, monospace`; og.textBaseline = 'alphabetic';
    og.shadowColor = 'rgba(0,0,0,.9)'; og.shadowBlur = 3 * k; og.fillStyle = `rgba(255,248,230,${Math.random() < .05 ? .5 : .9})`;
    if (o.stamp) { og.fillText(o.stamp[0], W2 - 108 * k, H2 - 30 * k); og.fillText(o.stamp[1], W2 - 108 * k, H2 - 14 * k); }
    og.shadowBlur = 0;
  };
  return {
    sg, real,
    // o: { track: 0..1 tracking ruim, snow: 0..1 só chiado, stamp: [linha1, linha2], osd: texto no canto }
    frame(t, o) {
      const W2 = out.width, H2 = out.height, k = W2 / VW;
      if (held && t < hold) return; // quadro congelado
      held = false;
      if (Math.random() < .006) { hold = t + 120 + Math.random() * 260; held = true; }
      if (o.real) return this.real(t, o);
      tg.fillStyle = '#000'; tg.fillRect(0, 0, VW, VH);
      const band = ((t / 18) % (VH + 80)) - 40, tr = o.track || 0;
      for (let y = 0; y < VH; y += 2) {
        let dx = (Math.random() - .5) * 1.2;
        const nb = Math.abs(y - band);
        if (nb < 18) dx += (Math.random() - .5) * (6 + 22 * tr);
        if (y > VH - 14) dx += 6 + Math.random() * 8; // borda de baixo rasgada
        if (Math.random() < .005) dx += (Math.random() - .5) * 40;
        tg.drawImage(src, 0, y, VW, 2, dx, y, VW, 2);
      }
      og.globalCompositeOperation = 'source-over'; og.globalAlpha = 1; og.imageSmoothingEnabled = true;
      og.drawImage(tmp, 0, 0, W2, H2);
      og.globalCompositeOperation = 'lighter'; og.globalAlpha = .2; og.drawImage(tmp, 3.5 * k, 0, W2, H2);
      og.globalCompositeOperation = 'multiply'; og.globalAlpha = 1;
      og.fillStyle = 'rgb(205,215,190)'; og.fillRect(0, 0, W2, H2);
      og.globalCompositeOperation = 'source-over';
      const n = noise[(Math.random() * noise.length) | 0];
      og.globalAlpha = o.snow != null ? o.snow : .14 + tr * .3;
      og.drawImage(n, 0, 0, W2, H2);
      // faixa de tracking: chiado mais claro
      og.globalAlpha = .35 + tr * .4; og.drawImage(n, 0, 0, VW, 20, 0, (band - 10) * k, W2, 20 * k);
      og.globalAlpha = 1;
      og.fillStyle = og.createPattern(lines, 'repeat'); og.fillRect(0, 0, W2, H2);
      const v = og.createRadialGradient(W2 / 2, H2 / 2, H2 * .3, W2 / 2, H2 / 2, W2 * .72);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.75)'); og.fillStyle = v; og.fillRect(0, 0, W2, H2);
      og.font = `${Math.round(17 * k)}px VT323, monospace`; og.textBaseline = 'alphabetic';
      const flick = Math.random() < .08 ? .4 : .92;
      og.shadowColor = 'rgba(0,0,0,.9)'; og.shadowBlur = 3 * k; og.fillStyle = `rgba(255,248,230,${flick})`;
      if (o.stamp) { og.fillText(o.stamp[0], W2 - 108 * k, H2 - 30 * k); og.fillText(o.stamp[1], W2 - 108 * k, H2 - 14 * k); }
      if (o.osd) og.fillText(o.osd, 14 * k, 26 * k);
      og.shadowBlur = 0;
    },
  };
}

// tela azul de videocassete
function vcrBlue(g, text) {
  g.fillStyle = '#1b3bb8'; g.fillRect(0, 0, VW, VH);
  g.fillStyle = '#f2f2f2'; g.font = '30px VT323, monospace'; g.fillText(text, 26, 46);
}
function garoa(g, t, n, a) {
  g.strokeStyle = `rgba(200,200,190,${a || .18})`; g.lineWidth = 1;
  for (let i = 0; i < n; i++) {
    const x = (i * 97.3 + t * .31 * (1 + i % 3)) % (VW + 40) - 20, y = (i * 53.7 + t * .9) % VH;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3, y + 9); g.stroke();
  }
}
// a rua vista da janelinha do porão, rente à calçada
function ruaDaJanela(g, t) {
  g.fillStyle = '#05070a'; g.fillRect(0, 0, VW, VH);
  g.fillStyle = '#0b0d10'; g.fillRect(0, 30, 70, 70); g.fillRect(250, 20, 80, 80); g.fillRect(150, 44, 60, 56);
  g.fillStyle = 'rgba(200,150,70,.35)'; g.fillRect(272, 50, 8, 10);
  g.fillStyle = '#121214'; g.fillRect(0, 100, VW, 46);
  const lamp = g.createRadialGradient(218, 34, 1, 218, 34, 90);
  lamp.addColorStop(0, 'rgba(255,170,70,.9)'); lamp.addColorStop(.15, 'rgba(255,150,60,.35)'); lamp.addColorStop(1, 'rgba(255,140,50,0)');
  g.fillStyle = lamp; g.fillRect(100, 0, 220, 160);
  g.fillStyle = '#16120c'; g.fillRect(214, 34, 4, 112);
  g.fillStyle = 'rgba(255,160,70,.3)'; g.fillRect(200, 128, 34, 22);
  g.fillStyle = '#1d1c1a'; g.fillRect(0, 146, VW, 60);
  g.fillStyle = 'rgba(255,160,70,.12)'; g.fillRect(150, 160, 120, 10);
  garoa(g, t, 60);
  g.fillStyle = '#020202'; g.fillRect(0, 204, VW, 36); g.fillRect(0, 0, 8, VH); g.fillRect(VW - 8, 0, 8, VH);
  g.fillStyle = '#0c0a07'; g.fillRect(0, 200, VW, 6); g.fillRect(156, 0, 6, 206);
}
// o 875A visto de baixo: só a metade de baixo, apagado
function onibus(g, x, doorOpen) {
  g.fillStyle = '#16191a'; g.fillRect(x, 6, 520, 146);
  g.fillStyle = 'rgba(255,170,80,.18)'; g.fillRect(x, 6, 520, 3);
  g.fillStyle = '#060707'; for (let i = 0; i < 6; i++) g.fillRect(x + 20 + i * 82, 12, 70, 44);
  g.fillStyle = 'rgba(255,160,70,.08)'; g.fillRect(x + 300, 14, 40, 6);
  g.fillStyle = '#0d0f10'; g.fillRect(x, 100, 520, 6);
  const dx = x + 232;
  g.fillStyle = doorOpen ? '#000' : '#101213'; g.fillRect(dx, 18, 56, 128);
  if (doorOpen) { g.fillStyle = 'rgba(120,120,110,.18)'; g.fillRect(dx + 4, 128, 48, 4); g.fillRect(dx + 4, 138, 48, 4); }
  else { g.strokeStyle = '#050505'; g.lineWidth = 2; g.beginPath(); g.moveTo(dx + 28, 18); g.lineTo(dx + 28, 146); g.stroke(); }
  g.fillStyle = '#030303';
  for (const wx of [70, 430]) { g.beginPath(); g.arc(x + wx, 152, 24, 0, 7); g.fill(); g.fillStyle = '#1b1b1b'; g.beginPath(); g.arc(x + wx, 152, 9, 0, 7); g.fill(); g.fillStyle = '#030303'; }
  g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(x, 170, 520, 8);
}
function tetoDoPorao(g, t) {
  g.fillStyle = '#060504'; g.fillRect(0, 0, VW, VH);
  g.fillStyle = '#0f0b07'; for (let i = 0; i < 9; i++) g.fillRect(i * 38 + 4, 0, 30, VH);
  g.fillStyle = '#050403'; g.fillRect(0, 80, VW, 20); g.fillRect(0, 170, VW, 20);
  const s = g.createRadialGradient(40, 40, 0, 40, 40, 160); s.addColorStop(0, 'rgba(255,150,60,.12)'); s.addColorStop(1, 'rgba(255,150,60,0)');
  g.fillStyle = s; g.fillRect(0, 0, VW, VH);
  g.strokeStyle = '#020202'; g.lineWidth = 2; g.beginPath(); g.moveTo(200, 0); g.quadraticCurveTo(204 + Math.sin(t / 700) * 3, 90, 200, 140); g.stroke();
}
function corredorAmarelo(g, t) { // tijolo sem reboco à luz de lanterna; a faixa amarela na altura do ombro vira à esquerda
  const f = .75 + Math.random() * .25 * (Math.random() < .1 ? -1.5 : 1);
  const cx = 168, cy = 118;
  g.fillStyle = `rgb(${70 * f | 0},${48 * f | 0},${36 * f | 0})`; g.fillRect(0, 0, VW, VH);
  g.fillStyle = `rgb(${52 * f | 0},${36 * f | 0},${28 * f | 0})`; poly(g, [[VW, 0], [cx + 18, cy - 14], [cx + 18, cy + 16], [VW, VH]]); g.fill();
  g.fillStyle = `rgb(${30 * f | 0},${22 * f | 0},${16 * f | 0})`; poly(g, [[0, 0], [VW, 0], [cx + 18, cy - 14], [cx - 18, cy - 14]]); g.fill();
  g.fillStyle = `rgb(${96 * f | 0},${78 * f | 0},${48 * f | 0})`; poly(g, [[0, VH], [VW, VH], [cx + 18, cy + 16], [cx - 18, cy + 16]]); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1;
  for (let k = 1; k < 7; k++) { const q = k / 7; g.beginPath(); g.moveTo(0, VH * q); g.lineTo(cx - 18, (cy - 14) + 30 * q); g.stroke(); g.beginPath(); g.moveTo(VW, VH * q); g.lineTo(cx + 18, (cy - 14) + 30 * q); g.stroke(); }
  // a faixa amarela, dos dois lados, e a volta para a esquerda
  g.fillStyle = `rgb(${214 * f | 0},${176 * f | 0},${52 * f | 0})`;
  poly(g, [[0, VH * .5], [cx - 18, cy + 1], [cx - 18, cy + 4], [0, VH * .58]]); g.fill();
  poly(g, [[VW, VH * .5], [cx + 18, cy + 1], [cx + 18, cy + 4], [VW, VH * .58]]); g.fill();
  const tt = Math.max(0, Math.min(1, (t / 1000 - 46) / 2.5));            // a câmera vira: a faixa some pela esquerda
  g.fillStyle = `rgb(${214 * f | 0},${176 * f | 0},${52 * f | 0})`; g.fillRect(0, VH * .5 - tt * 6, 40 + tt * 120, 14 + tt * 10);
  g.fillStyle = '#050402'; g.fillRect(cx - 7, cy - 8, 14, 24);
  const l = g.createRadialGradient(cx - 60, cy + 20, 10, cx - 60, cy + 20, 190); l.addColorStop(0, 'rgba(255,230,160,.35)'); l.addColorStop(1, 'rgba(0,0,0,.55)');
  g.fillStyle = l; g.fillRect(0, 0, VW, VH);
}

// A fita JUN 86 (Marina, 6/6/1986). Tempos em segundos.
const FILM86 = {
  dur: 54, motor: [[13, 34, .07]],
  // o relógio da filmadora: 23:08:20 no começo da imagem, 23:09:00 no tique, 23:10 o ônibus, 23:11 a respiração,
  // 23:13 a câmera cai, 23:14 a faixa amarela, 23:15 "Eu pintei igual" (é o que o capítulo 7 reconstitui)
  subs: [[9.5, 11.5, '[um tique de relógio, dentro da casa]'], [13, 19, '[motor a diesel, chegando devagar]'], [22, 29, '[respiração bem perto do microfone]'], [34, 36, '[a câmera cai]'],
    [37, 43, '[passos descendo uma escada de madeira]'], [45.5, 48.5, '[a faixa amarela vira à esquerda. A câmera vira à esquerda]'], [48.6, 51.5, '“Eu pintei igual.”', 'marina-fita']],
  draw(g, t) {
    if (t < 2.2) { vcrBlue(g, 'PLAY ►'); return { snow: 0, track: 0 }; }
    if (t < 6) { g.fillStyle = '#000'; g.fillRect(0, 0, VW, VH); return { snow: .9 - (t - 2.2) * .18, track: 1 }; }
    const clock = (s) => { const tot = 23 * 3600 + 9 * 60 + (s - 10) * 10; const h = Math.floor(tot / 3600) % 24, m = Math.floor(tot / 60) % 60, sc = Math.floor(tot) % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`; };
    const stamp = ['JUN. 6 1986', clock(t)];
    if (t < 34) {
      ruaDaJanela(g, t * 1000);
      if (t > 12) { const x = t < 20 ? -560 + (t - 12) / 8 * 470 : -90; onibus(g, x + Math.sin(t * 9) * (t < 20 ? 1 : 0), t > 22); }
      if (t > 22) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, 0, VW, VH); }
      return { stamp, track: t < 8 ? .6 : .15 + (t > 28 ? .25 : 0) };
    }
    if (t < 36) { // a câmera cai: gira, borra
      const a = (t - 34) / 2;
      g.save(); g.translate(VW / 2, VH / 2); g.rotate(a * 1.9); g.scale(1 + a * .6, 1 + a * .6); g.translate(-VW / 2, -VH / 2 + a * 120);
      ruaDaJanela(g, t * 1000); onibus(g, -90, true); g.restore();
      g.fillStyle = `rgba(0,0,0,${a * .8})`; g.fillRect(0, 0, VW, VH);
      return { stamp, track: .9 };
    }
    if (t < 44) { tetoDoPorao(g, t * 1000); return { stamp, track: .25 }; }
    if (t < 45.5) { g.fillStyle = '#000'; g.fillRect(0, 0, VW, VH); return { snow: .85, track: 1 }; }
    if (t < 51.5) { corredorAmarelo(g, t * 1000); return { stamp, track: .35 }; }
    if (t < 52.5) { g.fillStyle = '#000'; g.fillRect(0, 0, VW, VH); return { snow: .9, track: 1 }; }
    vcrBlue(g, 'STOP ■'); return { snow: 0, track: 0 };
  },
};
