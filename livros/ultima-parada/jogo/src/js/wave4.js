// ===== wave4.js — labirinto, oficina, rádio de válvulas, estante, corredores, ponto final =====
ICONS.bolinha = (g) => { const r = g.createRadialGradient(11, 11, 1, 14, 14, 9); r.addColorStop(0, '#fff'); r.addColorStop(.4, '#a9aba8'); r.addColorStop(1, '#3a3b39');
  g.fillStyle = r; g.beginPath(); g.arc(14, 14, 8, 0, 7); g.fill(); };
ICONS.caixa = (g) => { g.fillStyle = '#4c4f50'; g.fillRect(3, 8, 22, 14); g.fillStyle = '#d8b52a'; g.beginPath(); g.arc(14, 15, 4.5, 0, 7); g.fill();
  g.fillStyle = '#151515'; g.beginPath(); g.arc(14, 15, 1.5, 0, 7); g.fill(); };

// ——— navegação: virar só no porão; nas outras cenas, um botão de voltar ———
function syncNav() {
  const inRoom = S.view <= 3;
  $('turnL').hidden = $('turnR').hidden = !inRoom;
  const b = $('btnBack'); b.hidden = inRoom;
  b.textContent = S.view === 6 ? 'Voltar pelo corredor' : 'Voltar ao porão';
}
$('btnBack').addEventListener('click', () => {
  if (overlayOpen()) return;
  if (S.view === 4) goView(2);
  else if (S.view === 5) goView(1);
  else if (S.view === 6) goView(5, () => { S.corr = 0; dirty(5); });
});
// garoa no ponto final
const dynBase = drawDyn;
drawDyn = function (g, t) {
  dynBase(g, t);
  if (S.view !== 6) return;
  g.strokeStyle = 'rgba(210,200,180,.22)'; g.lineWidth = 1.2;
  for (let i = 0; i < 140; i++) { const x = (i * 131.7 + t * .05 * (1 + i % 3)) % (W + 80) - 40, y = (i * 77.3 + t * .55) % H;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x - 5, y + 18); g.stroke(); }
};

// ——— labirinto de inclinar ———
const MZ = { x0: 10, y0: 30, cw: 60, ch: 54 };
let ball = null, mazeBusy = false, mazeUV = false;
const DIRS = { L: [-1, 0], R: [1, 0], U: [0, -1], D: [0, 1] };
function mazeBlocked(c, r, d) {
  const { cols, rows, h, v, exitCol } = MAZE;
  if (d === 'L') return c === 0 || v.has(`${c - 1},${r}`);
  if (d === 'R') return c === cols - 1 || v.has(`${c},${r}`);
  if (d === 'U') return r === 0 || h.has(`${c},${r - 1}`);
  if (r === rows - 1) return c !== exitCol; // embaixo: só passa pela saída
  return h.has(`${c},${r}`);
}
function drawMaze() {
  const cv = $('mazeCv'), g = cv.getContext('2d'), { x0, y0, cw, ch } = MZ;
  g.fillStyle = '#0c1210'; g.fillRect(0, 0, cv.width, cv.height);
  const sh = g.createLinearGradient(0, 0, cv.width, cv.height); sh.addColorStop(0, 'rgba(255,255,255,.07)'); sh.addColorStop(.4, 'rgba(255,255,255,0)');
  g.fillStyle = sh; g.fillRect(0, 0, cv.width, cv.height);
  if (mazeUV) { g.save(); uvInk(g); g.lineWidth = 3; g.setLineDash([9, 7]); path(g, mazeTrace(x0, y0, cw, ch), 0, 0); g.stroke(); g.restore();
    g.fillStyle = 'rgba(90,30,220,.18)'; g.fillRect(0, 0, cv.width, cv.height); }
  drawMazeWalls(g, x0, y0, cw, ch, '#a7aca6', 5);
  if (ball) {
    const bx = x0 + (ball.c + .5) * cw, by = y0 + (ball.r + .5) * ch;
    const rg = g.createRadialGradient(bx - 6, by - 6, 2, bx, by, 18); rg.addColorStop(0, '#fff'); rg.addColorStop(.35, '#b9bbb8'); rg.addColorStop(1, '#2d2e2c');
    g.fillStyle = 'rgba(0,0,0,.5)'; g.beginPath(); g.ellipse(bx + 4, by + 6, 16, 10, 0, 0, 7); g.fill();
    g.fillStyle = rg; g.beginPath(); g.arc(bx, by, 16, 0, 7); g.fill();
  }
}
function openMaze() {
  ball = { c: MAZE.start[0], r: MAZE.start[1] }; mazeBusy = false; mazeUV = false;
  $('mazeUV').hidden = !S.inv.includes('uv'); $('mazeMsg').textContent = 'A bolinha entra pelo furo de cima e para logo ali.';
  openOv('ovMaze'); drawMaze();
}
function tilt(d) {
  if (mazeBusy || !ball || $('ovMaze').hidden) return;
  const [dc, dr] = DIRS[d], steps = [];
  let c = ball.c, r = ball.r;
  while (!mazeBlocked(c, r, d)) { c += dc; r += dr; steps.push([c, r]); if (r >= MAZE.rows) break; }
  if (!steps.length) { $('mazeMsg').textContent = 'A bolinha não se mexe para esse lado.'; return; }
  mazeBusy = true; $('mazeMsg').textContent = '';
  let i = 0;
  const go = () => {
    if ($('ovMaze').hidden) { mazeBusy = false; return; }
    ball.c = steps[i][0]; ball.r = steps[i][1]; drawMaze(); i++;
    if (ball.r >= MAZE.rows) { mazeDone(); return; }
    if (i < steps.length) setTimeout(go, 75); else mazeBusy = false;
  };
  go();
}
function mazeDone() {
  $('mazeMsg').textContent = 'Ela some pela saída de baixo.';
  S.flags.mazeDone = true; removeItem('bolinha');
  setTimeout(() => {
    hideAllOv(); mazeBusy = false; S.open.oficina = true; dirty(2);
    say('A bolinha desce pelo cano fino. Você ouve ela rolar rente ao rodapé até a cômoda. Um estalo de mola. A parede atrás da cômoda corre para a direita, com a cômoda junto, e uma luz branca acende lá dentro.');
  }, 900);
}
document.querySelectorAll('.mazeBar [data-d]').forEach(b => b.addEventListener('click', () => tilt(b.dataset.d)));
$('mazeShake').addEventListener('click', () => { if (mazeBusy) return; ball = { c: MAZE.start[0], r: MAZE.start[1] }; $('mazeMsg').textContent = 'A bolinha volta pro começo.'; drawMaze(); });
$('mazeUV').addEventListener('click', () => { mazeUV = !mazeUV; $('mazeUV').textContent = mazeUV ? 'Apagar a luz negra' : 'Acender a luz negra'; drawMaze(); });
window.addEventListener('keydown', (e) => {
  if ($('ovMaze').hidden) return;
  const d = { ArrowLeft: 'L', ArrowRight: 'R', ArrowUp: 'U', ArrowDown: 'D' }[e.key];
  if (d) { e.preventDefault(); tilt(d); }
});

// ——— rádio de válvulas ———
const MORSE = '−−−−− −····   −−−−− −····   −−··· −····   ··−−− ···−−   ·−−−− −−−−−   −−−·· −−··· ·····';
const RADIO_MARINA = [
  { sys: '[chiado; por baixo, o morse repetindo, fraco]' },
  { v: 'marina-radio-1', fx: 'radio', who: 'Marina', noisy: true, text: 'Você é o Fábio. Ela falou de você.' },
  { v: 'marina-radio-2', fx: 'radio', who: 'Marina', noisy: true, text: 'Escuta: a caixa de chumbo, na bancada. Não abre. Leva pra ela.' },
  { v: 'marina-radio-3', fx: 'radio', who: 'Marina', noisy: true, text: 'Às cinco e dez o ônibus passa no ponto pela última vez e fecha. Vocês sobem com a caixa, descem na última parada e deixam a caixa no banco. O ônibus vai embora com ela.' },
  { v: 'marina-radio-4', fx: 'radio', who: 'Marina', noisy: true, text: 'Eu fico. Meu pai fica. A gente já era daqui.' },
  { v: 'marina-radio-5', fx: 'radio', who: 'Marina', noisy: true, text: 'Puxa o volume sete. A estante abre. Segue a pintura.' },
  { sys: '[o chiado volta]', d: 0 },
];
const RADIO_AGAIN = [{ v: 'marina-radio-de-novo', fx: 'radio', who: 'Marina', noisy: true, text: 'Puxa o volume sete. A estante abre. Segue a pintura. Sempre à esquerda.' }, { sys: '[chiado]', d: 0 }];
function openRadio() {
  if (!S.power) { say('Um rádio de válvulas Philips, de madeira. Sem luz, as válvulas não acendem.'); return; }
  if (!S.papers.has(4)) {
    findPaper(4, true); toast('Uma página do caderno 6 foi para a linha do tempo.');
    say('Atrás do rádio, enfiada entre as válvulas, uma página dobrada do caderno 6. As válvulas esquentam devagar, com cheiro de poeira queimada.');
  }
  S.flags.radioOn = true; S.flags.tuned = false; $('radioLines').textContent = ''; $('morse').textContent = '';
  openOv('ovRadio'); $('tune').value = '17.4'; tuneRadio();
  setTimeout(() => $('tune').focus(), 60);
}
function tuneRadio() {
  const v = parseFloat($('tune').value), d = Math.abs(v - 23.1);
  $('freq').textContent = v.toFixed(2); $('needle').style.left = ((v - 15) / 15 * 100) + '%';
  const eye = $('magicEye'); eye.className = 'eye' + (d < .035 ? ' on' : d < .6 ? ' near' : '');
  const m = $('morse');
  if (d < .6) { m.textContent = MORSE; m.style.opacity = String(Math.max(.15, 1 - d * 1.5)); } else m.textContent = '';
  if (d < .035 && !S.flags.tuned) {
    S.flags.tuned = true; $('tune').value = '23.10'; $('freq').textContent = '23.10';
    playLines($('radioLines'), 'ovRadio', S.flags.marina ? RADIO_AGAIN : RADIO_MARINA, () => { S.flags.marina = true; });
  }
}
$('tune').addEventListener('input', tuneRadio);

// ——— a estante ———
function openEstante() {
  S.open.estante = true; dirty(1);
  say('Você puxa o volume 7 até o fim. Um estalo dentro da parede, depois outro, como engrenagem de relógio. A estante inteira gira sem barulho e para de lado. Atrás dela, um corredor curto de concreto e uma fresta de luz amarela.');
}

// ——— corredores ———
const STEP_MSG = ['Ao longe, um motor a diesel.', 'O motor, mais perto. Cheiro de óleo queimado no ar parado.', 'Agora dá para ouvir o motor em ponto morto, logo ali.', 'Garoa. Você sente garoa no rosto, dentro de um corredor.'];
const WRONG_MSG = ['O corredor faz uma curva longa e te devolve no começo. As mesmas manchas. A mesma lâmpada piscando.',
  'Você anda muito. Quando para, está de novo onde começou. O motor sumiu.', 'Uma porta, outra porta, e de novo a fresta da estante atrás de você.'];
function corrMove(dir) {
  if (dir === 'L') {
    const next = S.corr + 1;
    if (next >= CORR.length) { goView(6, () => { say('A última porta dá numa calçada. Uma rua de Perdizes, mas vazia, encardida, com garoa que não molha o chão. Um ponto de ônibus. No banco, alguém sentado.'); }); return; }
    goView(5, () => { S.corr = next; dirty(5); say(STEP_MSG[next - 1]); });
  } else goView(5, () => { S.corr = 0; dirty(5); say(WRONG_MSG[(Math.random() * WRONG_MSG.length) | 0]); });
}

// ——— fim ———
function finale() {
  S.flags.won = true; removeItem('caixa'); dirty(6); S.ended = true; closeOv(); hideMsg();
  $('endText').innerHTML = `<span class="when">05:10</span>
    <p>Você entrega a caixa de chumbo. A Cecília segura com as duas mãos, como se estivesse quente.</p>
    <p>Lá atrás, muito longe, o rádio de válvulas estala uma última vez. Uma voz de homem, rouca, que você nunca ouviu: “Agora vai.”</p>
    <p>Um ônibus vira a esquina sem farol. Apagado. No letreiro, piscando: <b>7 A – PERDI</b>. A porta abre e espera.</p>
    <p>A mulher de olhos pretos está no banco atrás da catraca. Não diz nada. Olha a caixa no colo da Cecília e fecha os olhos.</p>
    <p>No Metrô Barra Funda, vocês descem. A caixa fica no banco. O ônibus vai embora sem acender.</p>
    <span class="when">05:12</span>
    <p>A plataforma começa a clarear. A Cecília pergunta a que horas você pegou o ônibus.<br>“Uma e meia.”<br>“O 875A não passa na Monte Alegre.”</p>
    <p>Você olha a câmera na mochila. O contador nunca parou de gravar.</p>
    <p class="fim">FIM</p>
    <p class="score">Você achou ${S.papers.size} de ${PAPERS.length} papéis da linha do tempo.</p>`;
  $('btnRetry').hidden = true; $('ovEnd').hidden = false;
}
const endBadBase = endBad;
endBad = function () { endBadBase(); $('btnRetry').hidden = !S.open.oficina; };
$('btnRetry').addEventListener('click', () => {
  // volta para a oficina com o relógio em 03:40 e tudo o que já foi feito
  S.ended = false; S.t0 = performance.now() - (220 - START_MIN) / (END_MIN - START_MIN) * REAL_MIN * 60000;
  $('ovEnd').hidden = true; S.view = 4; S.corr = 0; dirty(); $('viewName').textContent = VIEWS[4]; syncNav();
  say('03:40. Você está de novo na oficina, com a luz branca da bancada. Ainda dá tempo.');
});

// ——— pontos clicáveis desta onda ———
// porão: espada, volume 7, passagem, labirinto, vão da oficina
spot(1, 'espada', [338, 420, 144, 300], { label: 'Espada-de-são-jorge',
  act: () => {
    if (S.found.bolinha) { say('Morta. A terra revirada pelos seus dedos.'); return; }
    S.found.bolinha = true; addItem('bolinha');
    say('A terra está seca e fofa. Você enfia os dedos e encosta em uma coisa fria e redonda: uma bolinha de aço, do tamanho de uma bolinha de gude.');
  } });
spot(1, 'vol7', [774, 272, 44, 110], { label: 'O buraco do volume 7', when: () => !S.open.estante,
  act: () => S.flags.marina ? openEstante()
    : say('No buraco do 7, lá no fundo, tem um livro deitado atrás dos outros. Você puxa: ele vem até a metade e trava, como se alguma coisa ainda não estivesse ligada.') });
spot(1, 'passagem', [520, 120, 600, 600], { label: 'Passagem', when: () => S.open.estante,
  act: () => goView(5, () => { S.corr = 0; dirty(5); say('Concreto, depois papel de parede amarelo. Lâmpadas fluorescentes zumbindo. Cheiro de carpete molhado. Não tem ninguém.'); }) });
spot(2, 'labirinto', [294, 234, 132, 272], { label: 'Labirinto de vidro',
  act: () => say(S.flags.mazeDone ? 'Vazio. A bolinha desceu pelo cano.' : 'Um labirinto de vidro embutido no tijolo. Tem um furo em cima, do tamanho de uma bolinha de gude. Embaixo, ele encaixa num cano fino que corre pelo rodapé até a cômoda.'),
  use: (it) => it === 'bolinha' && !S.flags.mazeDone ? (openMaze(), true) : false });
spot(2, 'vao', [955, 302, 295, 418], { label: 'Oficina', when: () => S.open.oficina, act: () => goView(4) });

// oficina
spot(4, 'oficinaParede', [0, 0, W, H], { label: 'Oficina', act: () => say('Um cômodo de dois por três, de concreto. Cheiro de estanho e de poeira queimada. A luz da bancada é branca e dura.') });
spot(4, 'painel', [0, WALL_TOP, 168, 625], { label: 'Painel aberto', act: () => goView(2) });
spot(4, 'lucia', [28, 290, 96, 86], { label: 'Bilhete', when: () => !S.found.lucia,
  act: () => { S.found.lucia = true; dirty(4); findPaper(6, true); openPaper(6); } });
spot(4, 'esquema', [470, 110, 400, 190], { label: 'Esquema na parede',
  act: () => say('Um esquema a lápis em papel milimetrado: o porão, a estante e, depois dela, uma seta comprida até “A LINHA”. Do lado, sublinhado duas vezes: 23.10.') });
spot(4, 'planta', [960, 130, 280, 180], { label: 'Planta da casa', when: () => !S.found.planta,
  act: () => { S.found.planta = true; dirty(4); findPaper(1, true); openPaper(1); } });
spot(4, 'valvulas', [1290, 160, 270, 190], { label: 'Prateleira',
  act: () => say('Válvulas de rádio enfileiradas e rolos de fio esmaltado, tudo etiquetado com a mesma letra de técnico.') });
spot(4, 'cadernos', [294, 430, 162, 90], { label: 'Cadernos quadriculados', when: () => !S.found.cadernos,
  act: () => { S.found.cadernos = true; dirty(4); findPaper(2, true); toast('O caderno 4 foi para a linha do tempo.');
    say('Nove cadernos quadriculados, numerados de 1 a 9. Faltam páginas em quase todos. O caderno 4 tem uma fita marcando uma página.'); } });
spot(4, 'gavetaBancada', [300, 552, 240, 62], { label: 'Gaveta da bancada',
  act: () => { if (findPaper(3, true)) { toast('Uma página do caderno 5 foi para a linha do tempo.'); say('Chaves de relojoeiro, molas e, dobrada no fundo, uma página arrancada do caderno 5.'); }
    else say('Chaves de relojoeiro, molas, um cronômetro parado.'); } });
spot(4, 'radioV', [560, 300, 290, 216], { label: 'Rádio de válvulas', act: () => openRadio() });
spot(4, 'caixa', [930, 440, 180, 80], { label: 'Caixa de chumbo', when: () => !S.found.caixa,
  act: () => { S.found.caixa = true; dirty(4); addItem('caixa'); findPaper(5, true); toast('Uma página do caderno 8 foi para a linha do tempo.');
    say('Você levanta a caixa de chumbo. Pesa como um tijolo. Embaixo dela, uma página do caderno 8.'); } });
spot(4, 'lupa', [1160, 350, 130, 170], { label: 'Lupa de relojoeiro',
  act: () => say('Pela lente, as letras dos cadernos ficam enormes e tremidas.') });

// corredores
spot(5, 'corredor', [0, 0, W, H], { label: 'Corredor', act: () => say('Papel de parede amarelo, inchado de umidade. As lâmpadas zumbem. O carpete afunda um pouco a cada passo.') });
const J = () => CORR[Math.min(S.corr, CORR.length - 1)];
spot(5, 'cL', [240, 250, 170, 510], { label: 'Virar à esquerda', when: () => J().open.includes('L'), act: () => corrMove('L') });
spot(5, 'cR', [1190, 250, 170, 510], { label: 'Virar à direita', when: () => J().open.includes('R'), act: () => corrMove('R') });
spot(5, 'cF', [690, 320, 220, 190], { label: 'Seguir em frente', when: () => J().open.includes('F'), act: () => corrMove('F') });
spot(5, 'obj', () => { const o = J().obj; return o ? [o.x - 34, o.y - 28, 68, 56] : [0, 0, 0, 0]; },
  { label: () => J().obj ? J().obj.label : '', when: () => J().obj && !S.found[J().obj.id],
    act: () => { const o = J().obj; S.found[o.id] = true; dirty(5); say(o.text); } });
spot(5, 'p12', [770, 755, 100, 70], { label: 'Folha de caderno', when: () => J().paper === 12 && !S.papers.has(12),
  act: () => { findPaper(12, true); dirty(5); openPaper(12); } });
spot(5, 'p13', [1176, 170, 104, 110], { label: 'Papel preso no cano', when: () => J().paper === 13 && !S.papers.has(13),
  act: () => { findPaper(13, true); dirty(5); openPaper(13); } });

// ponto final
spot(6, 'rua', [0, 0, W, H], { label: 'Rua', act: () => say('A rua está vazia. Não tem carro, não tem lixo, não tem nada. Só a garoa, que passa pela luz e não chega no chão.') });
spot(6, 'placa', [366, 286, 118, 354], { label: 'Placa de parada',
  act: () => say('PARADA. 875A-10. A mesma placa da Cardoso de Almeida, mas enferrujada como se tivesse trinta anos a mais.') });
spot(6, 'poste', [1040, 130, 100, 520], { label: 'Poste', act: () => say('Luz de sódio, alaranjada. Zumbe.') });
spot(6, 'bilheteA', [912, 584, 76, 32], { label: 'Bilhete no banco', when: () => !S.papers.has(14),
  act: () => { findPaper(14, true); dirty(6); openPaper(14); } });
spot(6, 'cecilia', [740, 400, 130, 300], { label: 'Cecília', when: () => !S.flags.won,
  act: () => S.inv.includes('caixa') ? finale()
    : say('A Cecília levanta do banco. Está pálida, com a mesma roupa de ontem, uma caixa de sapato nas mãos. “Você veio. Trouxe a certa? A de chumbo. Tá na bancada do pai da Marina. Corre.”'),
  use: (it) => it === 'caixa' ? (finale(), true) : false });
