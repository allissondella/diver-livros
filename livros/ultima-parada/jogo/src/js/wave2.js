// ===== wave2.js — cadeados, mural de perto, luz negra =====
const LOCKS = {
  gav1: { type: 'wheels', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', answer: 'ROTA', title: 'Gaveta de cima · cadeado de letras',
    open() {
      S.open.gav1 = true; dirty(2); findPaper(15, true);
      say('O cadeado abre. Dentro, folhas de caderno dobradas: os mapas da Marina, o caminho do ônibus desenhado à mão.');
      toast('Os mapas da Marina foram para a linha do tempo.');
    } },
  gav2: { type: 'wheels', chars: '0123456789', answer: '2310', title: 'Gaveta do meio · cadeado de números',
    open() {
      S.open.gav2 = true; dirty(2); findPaper(8, true);
      say('Abre. Uma folha de fichário com a letra da Marina, embaixo de uma foto de Natal: o homem de jaleco com uma menina no colo.');
      toast('Uma folha da Marina foi para a linha do tempo.');
    } },
  tool: { type: 'dir', answer: 'ULURD', title: 'Caixa de ferramentas · cadeado direcional',
    open() {
      S.open.tool = true; dirty(3); addItem('martelo');
      say('A bolinha estala e a alça solta. Dentro, ferramentas enferrujadas e um martelo de unha. Você pega o martelo.');
    } },
};
const ARROW = { U: '↑', D: '↓', L: '←', R: '→' };

function openLock(id) {
  const L = LOCKS[id], box = $('lockBox');
  box.className = ''; box.textContent = '';
  $('lockMsg').textContent = ''; $('lockTitle').textContent = L.title;
  const sh = document.createElement('div'); sh.className = 'shackle'; box.append(sh);
  if (L.type === 'wheels') buildWheels(id, L, box); else buildDir(id, L, box);
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
function buildDir(id, L, box) {
  const body = document.createElement('div'); body.className = 'dirBody';
  const knob = document.createElement('div'); knob.className = 'knob'; body.append(knob);
  const seq = document.createElement('div'); seq.className = 'dirSeq'; seq.setAttribute('aria-label', 'Movimentos feitos');
  const vals = S.lockVals[id] = [];
  const show = () => { seq.innerHTML = vals.map(v => `<span>${ARROW[v]}</span>`).join('') || '<span> </span>'; };
  for (const [d, cls, lab] of [['U', 'u', 'Para cima'], ['L', 'l', 'Para a esquerda'], ['R', 'r', 'Para a direita'], ['D', 'd', 'Para baixo']]) {
    const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = ARROW[d]; b.setAttribute('aria-label', lab);
    b.addEventListener('click', () => {
      if (vals.length >= 8) vals.shift();
      vals.push(d); show();
      const off = { U: [0, -.6], D: [0, .6], L: [-.6, 0], R: [.6, 0] }[d];
      knob.style.transform = `translate(${off[0]}em,${off[1]}em)`; setTimeout(() => { knob.style.transform = ''; }, 140);
    });
    body.append(b);
  }
  const pull = document.createElement('button'); pull.type = 'button'; pull.className = 'dirPull'; pull.textContent = 'Puxar a alça';
  pull.addEventListener('click', () => {
    if (vals.join('') === L.answer) { unlock(id); return; }
    box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
    $('lockMsg').textContent = vals.length ? 'Não abriu. A bolinha volta pro meio.' : 'Nada. Precisa mexer a bolinha antes.';
    vals.length = 0; show();
  });
  show();
  box.append(body, seq, pull);
}

// ——— itens usados nesta onda ———
function breakPig() {
  S.pigBroken = true; dirty(1); removeItem('martelo'); addItem('chave');
  say('Uma batida só. O porquinho racha em quatro pedaços. Moedas de cruzado, um botão de camisa e uma chave pequena, de gaveta.');
  return true;
}
function openGav3() {
  S.open.gav3 = true; dirty(2); removeItem('chave'); addItem('fita'); addItem('cracha');
  say('A chave gira. Dentro: uma fita VHS com etiqueta “JUN 86” e um crachá do IPEN. No fundo da gaveta, a marca de poeira de uma caixa de sapato que não está mais aqui.');
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
const MURAL_MAP = `<svg viewBox="0 0 100 64" aria-hidden="true"><path d="M8 58 V40 H30 V12 H70 V30" fill="none" stroke="#2b1c0e" stroke-width="2.4" stroke-linejoin="round"/><circle cx="70" cy="30" r="3" fill="#7a1910"/><text x="75" y="26" font-size="12" fill="#2b1c0e">?</text></svg>`;
const MURAL = [
  { cls: 'news', x: 4, y: 6, w: 22, h: 34, r: -3, html: '<small>Folha de S.Paulo · 8/6/1976</small>Técnico do IPEN desaparece em Perdizes', paper: 7 },
  { cls: 'news', x: 74, y: 5, w: 22, h: 36, r: 2.5, html: '<small>Notícias Populares · 9/6/1986</small>Filha de desaparecido some na mesma casa, dez anos depois', paper: 10 },
  { cls: 'photo', x: 30, y: 5, w: 15, h: 26, r: 2, html: '<span></span>', cap: 'Um homem de jaleco na frente de um prédio de tijolo, crachá no peito. Atrás, a lápis: “IPEN, 1973”.' },
  { cls: 'photo', x: 56, y: 52, w: 15, h: 26, r: -3, html: '<span></span>', cap: 'Uma menina sentada nesta mesma escada, com um vira-lata no colo. Atrás: “eu e o Tito, abril de 86”.' },
  { cls: 'map', x: 22, y: 46, w: 30, h: 44, r: 1, html: 'ROTA 875A' + MURAL_MAP, cap: 'Papel de pão, letra da Cecília: “ROTA 875A”. A linha do ônibus desenhada da Paulista até a esquina da Monte Alegre. Na esquina, um ponto de interrogação.' },
  { cls: 'post', x: 47, y: 8, w: 12, h: 16, r: -6, html: '23h10 — ver' },
  { cls: 'post', x: 60, y: 28, w: 12, h: 16, r: 5, html: '6/6. seis horas.' },
  { cls: 'post', x: 5, y: 50, w: 13, h: 17, r: 4, html: 'não é fuga' },
  { cls: 'post', x: 78, y: 52, w: 13, h: 17, r: -4, html: 'volume 7???' },
  { cls: 'post', x: 6, y: 74, w: 13, h: 17, r: -2, html: 'que caixa?' },
  { cls: 'post', x: 78, y: 76, w: 14, h: 16, r: 3, html: 'Odete viu os dois' },
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
    if (!st.open.oficina) { ctx.font = '26px "Architects Daughter", cursive'; ctx.fillText('23.10', 1128, 372); }
  },
  3(ctx) {
    uvInk(ctx);
    ctx.font = '21px Kalam, cursive'; ctx.fillText('a senha é quem late no diário', 782, 528);
    ctx.font = '600 28px Caveat, cursive'; ctx.fillText('Odete: 3862-0147', 1298, 424); ctx.fillText('ela viu os dois', 1316, 456);
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
spot(2, 'uvPainel', [1100, 334, 160, 54], { label: 'Escrito na argamassa', when: () => uvOn() && !S.open.oficina,
  act: () => say('Pequeno, na argamassa acima da cômoda, letra de técnico: “23.10”.') });
spot(3, 'uvMesa', [770, 496, 272, 52], { label: 'Embaixo do tampo', when: uvOn,
  act: () => say('Embaixo do tampo da escrivaninha, letra de menina: “a senha é quem late no diário”.') });
spot(3, 'uvFone', [1288, 392, 196, 76], { label: 'Escrito na parede', when: uvOn,
  act: () => say('Na parede, de marca-texto, letra da Cecília: “Odete: 3862-0147 — ela viu os dois”.') });
