// ===== wave2.js — cadeados, mural de perto, luz negra =====
const LOCKS = {
  gav1: { type: 'wheels', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', answer: 'ROTA', title: 'Gaveta de cima · cadeado de letras',
    open() {
      S.open.gav1 = true; dirty(2); dirty(3); findPaper(15, true);
      say('O cadeado abre com um estalo que você sente nos dentes. Dentro, um diário de capa dura verde, com elástico, e um mapa dobrado dentro dele. Atrás de você, na escrivaninha, alguma coisa zumbe e acende.');
      toast('O mapa da Marina foi para a linha do tempo.');
      setTimeout(() => { if (!overlayOpen()) openDiary(); }, 2600);
    } },
};
const ARROW = { U: '↑', D: '↓', L: '←', R: '→' };

function openLock(id) {
  const L = LOCKS[id], box = $('lockBox');
  box.className = ''; box.textContent = '';
  $('lockMsg').textContent = ''; $('lockTitle').textContent = L.title;
  const sh = document.createElement('div'); sh.className = 'shackle'; box.append(sh);
  buildWheels(id, L, box);
  openOv('ovLock');
}
function unlock(id) {
  const box = $('lockBox'); box.classList.add('open'); $('lockMsg').textContent = 'Clique.';
  box.querySelectorAll('button').forEach(b => { b.disabled = true; });
  setTimeout(() => { hideAllOv(); LOCKS[id].open(); }, 950);
}
function buildWheels(id, L, box) {
  const body = document.createElement('div'); body.className = 'lockBody';
  const vals = S.lockVals[id];
  vals.forEach((ch, i) => {
    const w = document.createElement('div'); w.className = 'wheel';
    const up = document.createElement('button'), out = document.createElement('output'), dn = document.createElement('button');
    up.type = dn.type = 'button'; up.textContent = '▲'; dn.textContent = '▼';
    up.setAttribute('aria-label', `Roda ${i + 1}: anterior`); dn.setAttribute('aria-label', `Roda ${i + 1}: próxima`);
    out.textContent = ch;
    const spin = (d) => {
      const k = L.chars.indexOf(vals[i]), n = (k + d + L.chars.length) % L.chars.length;
      vals[i] = L.chars[n]; out.textContent = vals[i];
      out.classList.remove('tick'); void out.offsetWidth; out.classList.add('tick');
      if (vals.join('') === L.answer) unlock(id);
    };
    up.addEventListener('click', () => spin(-1)); dn.addEventListener('click', () => spin(1));
    w.append(up, out, dn); body.append(w);
  });
  box.append(body);
}
// ——— itens usados nesta onda ———
function openGav3() {
  S.open.gav3 = true; dirty(2); addItem('fita');
  say('Abre fácil. Jornal de 1976 forrando o fundo e a marca de poeira da caixa de sapato que a Cecília levou. Atrás, de pé, enfiada entre o fundo e a lateral, onde ela não viu: uma fita VHS com etiqueta “JUN 86”.');
  return true;
}
function deskDrawer() {
  if (S.open.esc) { say('Lupas, pinças, molas de relógio. A caixinha “relojoaria” está vazia agora.'); return; }
  if (S.flags.uvTaken) { S.open.esc = true; dirty(3); say('Você não fechou essa gaveta. Ela abre de novo, fácil, como se nunca tivesse emperrado.'); return; }
  if (!S.flags.escTry) { S.flags.escTry = true; say('Emperrada. A madeira inchou com a umidade. Talvez com mais força.'); return; }
  S.open.esc = true; S.flags.uvTaken = true; dirty(3); addItem('uv');
  say('Você puxa com as duas mãos e ela abre de uma vez. Uma caixinha escrita “relojoaria”: lupas, pinças e uma lanterninha de luz roxa. A luz negra do pai da Marina.');
}

// ——— mural de perto ———
const MURAL_MAP = `<svg viewBox="0 0 100 64" aria-hidden="true"><path d="M62 58 V44 H22 V14 H76 V32" fill="none" stroke="#2b1c0e" stroke-width="2.4" stroke-linejoin="round"/><circle cx="76" cy="32" r="3" fill="#7a1910"/><text x="81" y="28" font-size="12" fill="#2b1c0e">?</text></svg>`;
const MURAL = [
  { cls: 'map', x: 4, y: 6, w: 30, h: 44, r: -2, html: '875A' + MURAL_MAP, cap: 'Papel de pão, letra da Cecília: “875A — Paulista 900 → Dr. Arnaldo → Cardoso de Almeida. Não entra na nossa rua.” Na esquina da Monte Alegre, um ponto de interrogação.' },
  { cls: 'note', x: 38, y: 5, w: 30, h: 40, r: 2, html: '<small>folha da Marina (cópia)</small>Li os nove cadernos. Ele não fugiu… Preciso saber a <u>ROTA</u>.', paper: 11 },
  { cls: 'post', x: 72, y: 8, w: 13, h: 17, r: -5, html: 'ROTA: senha ou pergunta?' },
  { cls: 'post', x: 72, y: 30, w: 13, h: 17, r: 4, html: '23h10. sempre 23h10' },
  { cls: 'post', x: 6, y: 56, w: 13, h: 17, r: 3, html: '76 · 86 · 96?' },
  { cls: 'post', x: 24, y: 60, w: 13, h: 17, r: -3, html: 'Odete conta dois' },
  { cls: 'post', x: 44, y: 56, w: 14, h: 17, r: 5, html: 'que caixa?' },
  { cls: 'post', x: 62, y: 62, w: 13, h: 17, r: -2, html: 'a gota: 11 s' },
  { cls: 'post', x: 80, y: 58, w: 14, h: 17, r: 3, html: 'tentei PERD MONT ABRI' },
];
function openMural() {
  const cork = $('cork');
  if (!cork.childElementCount) {
    for (const m of MURAL) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pinned ' + m.cls; b.innerHTML = m.html;
      Object.assign(b.style, { left: m.x + '%', top: m.y + '%', width: m.w + '%', height: m.h + '%' });
      b.style.setProperty('--r', m.r + 'deg');
      b.addEventListener('click', () => {
        if (m.paper) { if (findPaper(m.paper, true)) toast('Um recorte foi para a linha do tempo.'); openPaper(m.paper, openMural); return; }
        $('muralCap').textContent = m.cap || `Bilhete da Cecília, letra apressada: “${b.textContent}”.`;
      });
      cork.append(b);
    }
  }
  openOv('ovMural');
}

// ——— o que só a luz negra mostra ———
function uvInk(ctx) { ctx.shadowColor = 'rgba(120,255,235,.95)'; ctx.shadowBlur = 14; ctx.fillStyle = '#d4fff7'; ctx.strokeStyle = '#d4fff7'; }
// o caminho da solução, do furo de cima até a saída de baixo
function mazeTrace(x0, y0, cw, ch) {
  const pts = [[x0 + (MAZE.start[0] + .5) * cw, y0 - ch * .4]];
  for (const [c, r] of MAZE.sol) pts.push([x0 + (c + .5) * cw, y0 + (r + .5) * ch]);
  pts.push([x0 + (MAZE.exitCol + .5) * cw, y0 + (MAZE.rows + .2) * ch]);
  return pts;
}
const UVMARKS = {
  1(ctx, st) {
    if (st.flags.fold) return;
    uvInk(ctx); ctx.lineWidth = 2.5;
    poly(ctx, [[1212, 566], [1262, 558], [1270, 598], [1216, 606]]); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1238, 562); ctx.lineTo(1242, 602); ctx.stroke();
  },
  2(ctx, st) {
    uvInk(ctx); ctx.lineWidth = 2.5; ctx.setLineDash([7, 5]);
    path(ctx, mazeTrace(MAZE.gx, MAZE.gy, MAZE.cw, MAZE.ch), 0, 0); ctx.stroke();
    ctx.setLineDash([]);
    if (!st.open.oficina) { ctx.font = '26px "Architects Daughter", cursive'; ctx.fillText('23.10', 1236, 340); }
  },
};
const uvOn = () => S.sel === 'uv';
spot(1, 'dobra', [1200, 546, 86, 68], { label: 'Canto da pintura', when: () => uvOn() && !S.flags.fold,
  act() {
    S.flags.fold = true; dirty(1); findPaper(9, true);
    say('A luz roxa mostra a borda de um papel enfiado numa rachadura do reboco, no canto da pintura. Você puxa com a unha: uma folha de fichário dobrada em quatro.');
    toast('Uma folha da Marina foi para a linha do tempo.');
  } });
spot(2, 'uvLab', [296, 256, 128, 248], { label: 'Traço no vidro', when: uvOn,
  act: () => say('A luz roxa acende um traço fino no vidro, de lápis de relojoeiro: um caminho do furo de cima até a saída de baixo.') });
spot(2, 'uvPainel', [1206, 310, 120, 48], { label: 'Escrito na argamassa', when: () => uvOn() && !S.open.oficina,
  act: () => say('Pequeno, na argamassa acima da cômoda, letra de técnico: “23.10”. Ele marcava em tudo.') });
