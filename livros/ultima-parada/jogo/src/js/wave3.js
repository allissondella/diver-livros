// ===== wave3.js — as máquinas: fita na TV, secretária, telefone, CP-500, evento das 03:40 =====
ITEMS.microfita = { name: 'Microfita', desc: 'A microfita da secretária eletrônica da sua casa. O recado da Cecília está nela.' };
ICONS.microfita = (g) => { g.fillStyle = '#d6d0bd'; g.fillRect(5, 8, 18, 12); g.fillStyle = '#222'; g.fillRect(8, 11, 12, 5);
  g.fillStyle = '#777'; g.beginPath(); g.arc(11, 13.5, 1.6, 0, 7); g.arc(17, 13.5, 1.6, 0, 7); g.fill(); };

// ——— texto que aparece com o tempo (secretária e telefone) ———
let linesTimer = 0;
function playLines(listEl, ovId, lines, onEnd) {
  clearTimeout(linesTimer); listEl.textContent = '';
  const gen = playLines.gen = (playLines.gen || 0) + 1;
  let i = 0;
  const next = () => {
    if (playLines.gen !== gen || $(ovId).hidden) return; // desligaram no meio
    if (i >= lines.length) { onEnd && onEnd(); return; }
    const l = lines[i++], li = document.createElement('li');
    if (l.sys) { li.className = 'sys'; li.textContent = l.sys; }
    else if (l.me) { li.className = 'me'; li.textContent = l.me; }
    else { li.innerHTML = `<span class="who">${l.who}</span>`; const s = document.createElement('span'); s.className = 'voice' + (l.noisy ? ' noisy' : ''); s.textContent = l.text; li.append(s); }
    listEl.append(li);
    while (listEl.children.length > 5) listEl.firstChild.remove();
    const txt = l.sys || l.me || l.text;
    const temBip = !!(l.sys && l.sys.startsWith('[BIP]') && typeof SFX !== 'undefined');
    if (temBip) SFX.bip();
    let wait = l.d != null ? l.d : Math.max(1800, txt.length * 58);
    if (l.sys && l.sys.startsWith('[chamando') && typeof SFX !== 'undefined') {
      const n = (l.sys.match(/tuuu/g) || []).length >= 2 ? 2 : 1; SFX.ring(n); if (SFX.ringMs) wait = Math.max(wait, SFX.ringMs(n));
    }
    if (l.v && typeof hasVoice === 'function' && hasVoice(l.v)) {
      const falar = () => { if (playLines.gen !== gen || $(ovId).hidden) return;
        voice(l.v, l.fx).then(() => { if (playLines.gen === gen && !$(ovId).hidden) linesTimer = setTimeout(next, 450); }); };
      if (temBip && SFX.bipMs) linesTimer = setTimeout(falar, SFX.bipMs()); else falar();
    }
    else { if (l.noisy && typeof AUD !== 'undefined') AUD.noisyUntil = performance.now() + wait; linesTimer = setTimeout(next, wait); }
  };
  next();
}

// ——— secretária eletrônica ———
const TAPE_CECI = [
  { v: 'sec-01', sys: '[BIP] Mensagem um. Sexta-feira, zero hora e quarenta e um minutos.' },
  { v: 'ceci-recado-1', who: 'Cecília', noisy: true, text: 'Fábio? É a Ceci. Eu tô na última parada. Não dá pra explicar. Eu tenho pouco tempo. Fecha às cinco e dez. Vem. Desce no porão. Lê o diaaaah—' },
  { v: 'ceci-grito', fx: 'radio', sys: '[um grito, longe; o chiado corta seco]', d: 1800 },
  { v: 'sec-02', sys: '[BIP] Mensagem dois. Data e hora não registradas.' },
  { v: 'ceci-recado-2', who: 'Cecília', noisy: true, text: 'Fábio. Eu trouxe a caixa errada. A certa tá embaixo da bancada. Não abre.' },
  { v: 'sec-03', sys: '[BIP] Fim das mensagens.', d: 1600 },
  { me: 'À meia-noite e quarenta e um, essa fita só tinha uma mensagem.', d: 0 },
];
const TAPE_ODETE = [
  { v: 'sec-04', sys: '[BIP] Você tem uma mensagem.' },
  { v: 'sec-05', sys: 'Segunda-feira, vinte de maio, dezesseis horas e dois minutos.' },
  { v: 'odete-recado', who: 'Dona Odete', text: 'Cecília? É a Odete, da frente. Eu fiquei pensando no que você perguntou. Menina, não desce mais lá. A outra também era teimosa. E o pai dela também.' },
  { v: 'sec-03', sys: '[BIP] Fim das mensagens.', d: 0 },
];
function playTape(lines, onEnd) {
  openOv('ovTape');
  const m = document.querySelector('.machine'), led = $('tapeLed');
  m.classList.add('play'); led.className = 'mLed on';
  let c = 0; clearInterval(playTape.iv);
  playTape.iv = setInterval(() => { if ($('ovTape').hidden) { clearInterval(playTape.iv); return; } $('tapeCount').textContent = String(++c).padStart(3, '0'); }, 260);
  playLines($('tapeLines'), 'ovTape', lines, () => { clearInterval(playTape.iv); m.classList.remove('play'); led.className = 'mLed on blink'; onEnd && onEnd(); });
}

// ——— telefone de disco ———
const CALLS = {
  '38620147': () => S.flags.odete
    ? [{ sys: '[chamando… tuuu…]' }, { v: 'odete-tel-de-novo', fx: 'phone', who: 'Dona Odete', text: 'Já falei o que eu sabia, menino. Vai, que o tempo tá passando.' }, { sys: '[ela desliga]', d: 0 }]
    : [{ sys: '[chamando… tuuu… tuuu…]' }, { v: 'odete-tel-1', fx: 'phone', who: 'Dona Odete', text: 'Alô?… Quem é, a essa hora?' },
      { v: 'fabio-tel', me: '— É o Fábio, amigo da Cecília. Eu tô no porão.' },
      { v: 'odete-tel-2', fx: 'phone', who: 'Dona Odete', text: 'No porão. Ai, meu Deus. Eu moro na frente desde sessenta e um, menino.' },
      { v: 'odete-tel-3', fx: 'phone', who: 'Dona Odete', text: 'Vi o Aurélio sair de casa de noite em setenta e seis, com uma caixa debaixo do braço, e subir num ônibus apagado. Vi a luz da lanterna da Marina na janelinha do porão, em oitenta e seis. Vi a sua amiga ontem, às onze e dez.' },
      { v: 'odete-tel-4', fx: 'phone', who: 'Dona Odete', text: 'A menina foi atrás do pai, e a sua foi atrás da menina. Agora você tá indo atrás da sua.' },
      { v: 'odete-tel-5', fx: 'phone', who: 'Dona Odete', text: 'Fecha essa coisa, menino.' }, { sys: '[ela desliga]', d: 0 }],
  '190': () => [{ sys: '[chamando…]' }, { v: 'pm-1', fx: 'phone', who: 'Polícia Militar', text: 'Polícia Militar, boa noite.' },
    { v: 'fabio-pm', me: '— Minha amiga sumiu dentro de casa. Num porão.' },
    { v: 'pm-2', fx: 'phone', who: 'Polícia Militar', text: 'Maior de idade? Então tem que esperar vinte e quatro horas, senhor. Liga de novo amanhã à noite.' }, { sys: '[desligam]', d: 0 }],
};
let dialed = '', dialing = false, inCall = false;
function fmtNum(n) { return n.length > 4 ? n.slice(0, 4) + '-' + n.slice(4) : n; }
(function buildDial() {
  const d = $('dial');
  '1234567890'.split('').forEach((ch, i) => {
    const a = (-35 - i * 30) * Math.PI / 180, b = document.createElement('button');
    b.type = 'button'; b.textContent = ch; b.setAttribute('aria-label', 'Discar ' + ch);
    b.style.left = (50 + 37 * Math.cos(a)) + '%'; b.style.top = (50 + 37 * Math.sin(a)) + '%';
    b.addEventListener('click', () => dial(ch, i));
    d.append(b);
  });
})();
function setDialDisabled(v) { $('dial').querySelectorAll('button').forEach(b => { b.disabled = v; }); }
function dial(ch, i) {
  if (dialing || inCall) return;
  dialing = true; setDialDisabled(true);
  const turn = 50 + (i + 1) * 30, ms = 220 + (i + 1) * 85;
  const d = $('dial'); d.style.transition = `transform ${ms}ms ease-out`; d.style.transform = `rotate(${turn}deg)`;
  setTimeout(() => {
    d.style.transition = `transform ${ms * 1.4}ms linear`; d.style.transform = '';
    setTimeout(() => {
      dialing = false; setDialDisabled(false);
      dialed += ch; $('dialed').textContent = fmtNum(dialed);
      if (CALLS[dialed] && (dialed.length === 3 || dialed.length === 8)) placeCall(CALLS[dialed]());
      else if (dialed.length >= 8) placeCall([{ sys: '[tu… tu… tu… ninguém atende]', d: 0 }]);
    }, ms * 1.4);
  }, ms);
}
function placeCall(lines) {
  inCall = true; setDialDisabled(true);
  playLines($('callLines'), 'ovPhone', lines, () => {
    if (dialed === '38620147') S.flags.odete = true;
    setTimeout(() => { inCall = false; dialed = ''; $('dialed').innerHTML = '&nbsp;'; setDialDisabled(false); }, 1500);
  });
}
function openPhone() {
  dialed = ''; inCall = false; dialing = false; clearTimeout(linesTimer);
  $('dialed').innerHTML = '&nbsp;'; $('callLines').textContent = ''; setDialDisabled(false);
  openOv('ovPhone');
}
$('hangup').addEventListener('click', () => { clearTimeout(linesTimer); inCall = false; closeOv(); });

// ——— CP-500 ———
// No livro: o computador está apagado até o diário sair da gaveta; depois acende sozinho pedindo quatro números.
// A senha certa (0606) escreve o PAI.TXT, linha por linha. Depois, DIR e TYPE para o resto.
const CP_FILES = {
  'MARINA.TXT': 'MEU PAI NAO FUGIU.\nELE MONTOU UM RECEPTOR NA OFICINA, ATRAS DA\nPAREDE DA COMODA. O LABIRINTO ABRE.\n\nEM 1974 O RADIO PEGOU UM SINAL EM MORSE.\nUMA DATA, UMA HORA, UM ONIBUS.\nEM 6/6/76, AS 23:10, ELE SUBIU NO ONIBUS.\n\nESTA CHAMANDO DE NOVO. EU VOU.',
  'DATAS.TXT': '06/06/1976 - PAPAI\n06/06/1986 - ?\n06/06/1996\n06/06/2006\n06/06/2016\n06/06/2026\n06/06/2036\n06/06/2046',
  'RELOGIO.BAS': '10 REM RELOGIO - A.T. 1985\n20 H=23 : M=10\n30 PRINT H;":";M\n40 GOTO 30',
};
const CP_PAI = 'PAI.TXT                          MARINA T.  18/04/86\n\n(cadernos 7, 8 e 9 do meu pai, Aurelio Toledo.\n copiei igual. o que esta entre parenteses e meu.)\n\nCADERNO 7 - outubro de 1975\nNao vou escrever o que peguei. Vou escrever o que\npesa: onze quilos, com o chumbo. Guardo embaixo da\nbancada. A Lucia nao desce mais aqui.\n\nCADERNO 8 - 1 de junho de 1976\nAchei a planta da casa, de 1948. "Porao. Carvoeira.\nCorredor de servico ate a travessa." Fechado em 1963.\nO corredor comeca onde hoje esta a estante do porao.\nBati atras dela. E oca.\n\nCADERNO 8 - 3 de junho\nPus a estante num eixo. A alavanca e um dos livros da\nBarsa: puxa ate o fim e ela gira. O trinco e um rele\nligado no receptor. Sem o receptor em 23.10, o livro\ntrava na metade. Qual livro, eu nao escrevo. Quem\nprecisar saber vai ouvir.\n\nCADERNO 8 - 5 de junho\nNao levo a amostra. Se o que chama quer isso, nao vai\nter. Fica embaixo da bancada, fechada. Lucia: nao mexa.\n\nCADERNO 9 - 6 de junho de 1976, 22h40\nSe eu nao voltar, a menina vai ler isto um dia.\nMarina: eu nao fui embora. Eu fui ver quem chama.\nSe voce ouvir, nao va.\n\n(acaba aqui. a caneca de cafe estava do lado.)';
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim().replace(/\s+/g, ' ');
function termPrint(txt) { const t = $('term'); t.textContent += txt + '\n'; t.scrollTop = t.scrollHeight; }
function setPrompt(p) { $('termPrompt').textContent = p; }
function cpBoot() {
  $('term').textContent = '';
  termPrint('PROLOGICA CP-500   48K\nSISTEMA DOS 500   VERSAO 1.3\n');
  if (S.cp.pai) { termPrint('A>'); setPrompt('A>'); }
  else { termPrint('ARQUIVO PROTEGIDO: PAI.TXT\nDIGITE A SENHA (4 NUMEROS)\n'); setPrompt('SENHA:'); }
}
function openCP() {
  if (!S.power) { say('Um Prológica CP-500, bege. Sem energia.'); return; }
  if (!S.open.gav1) { say('O botão de ligar fica atrás. Estala, zumbe, e a tela continua preta.'); return; }
  if (!S.cp) { S.cp = { fails: 0, pai: false }; say('Você não ligou. Está aceso, verde, com o cursor piscando, pedindo uma senha de quatro números.'); }
  openOv('ovCP'); cpBoot(); setTimeout(() => $('termInput').focus(), 50);
}
function cpFiles() { const f = Object.keys(CP_FILES); if (S.cp.pai) f.unshift('PAI.TXT'); return f; }
const CP_DATES = { 'PAI.TXT': '18/04/86', 'MARINA.TXT': '01/06/86', 'DATAS.TXT': '25/05/86', 'RELOGIO.BAS': '02/02/85' };
// o PAI.TXT escreve sozinho, uma linha de cada vez
function termSlow(txt, done) {
  const inp = $('termInput'); inp.disabled = true;
  const lines = txt.split('\n'); let i = 0;
  const step = () => { if ($('ovCP').hidden) { inp.disabled = false; return; }
    termPrint(lines[i++]); if (i < lines.length) setTimeout(step, 90); else { inp.disabled = false; inp.focus(); done && done(); } };
  step();
}
function cpType(name) {
  if (name === 'PAI.TXT' && S.cp.pai) { termPrint(CP_PAI); return; }
  if (CP_FILES[name]) { termPrint(CP_FILES[name]); return; }
  termPrint('?ARQUIVO NAO ENCONTRADO');
}
function cpCommand(raw) {
  const c = norm(raw); const cp = S.cp;
  if (!cp.pai) {
    termPrint('SENHA: ' + '*'.repeat(raw.length));
    if (c.replace(/[^0-9]/g, '') === '0606' && c.replace(/[^0-9]/g, '').length === 4) { cp.pai = true; S.flags.pai = true; termPrint('\nRECUPERADO: PAI.TXT\n'); termSlow(CP_PAI, () => { termPrint('\nA>'); setPrompt('A>'); }); }
    else { cp.fails++; termPrint(cp.fails >= 3 ? 'SENHA INCORRETA.\nLEMBRETE DA AUTORA: O DIA E O MES QUE ELE MARCOU.' : 'SENHA INCORRETA.'); }
    return;
  }
  termPrint('A>' + c);
  if (!c) return;
  const [cmd, ...rest] = c.split(' '); let arg = rest.join(' ');
  const fix = (n) => { if (!n) return n; if (n.includes('.')) return n; const hit = cpFiles().find(f => f.startsWith(n + '.')); return hit || n; };
  if (cmd === 'AJUDA' || cmd === 'HELP') termPrint('DIR              LISTA OS ARQUIVOS\nTYPE <ARQUIVO>   MOSTRA UM ARQUIVO\nRUN <PROGRAMA>   RODA UM PROGRAMA\nCLS              LIMPA A TELA');
  else if (cmd === 'DIR') { termPrint(' DIRETORIO A:'); for (const f of cpFiles()) { const [n, e] = f.split('.'); termPrint(` ${n.padEnd(9)}${e.padEnd(6)}${CP_DATES[f]}`); } termPrint(` ${cpFiles().length} ARQUIVOS`); }
  else if (cmd === 'TYPE' || cmd === 'LIST' || cmd === 'LER' || cmd === 'CAT' || cmd === 'ABRIR') cpType(fix(arg));
  else if (cmd === 'RUN' || cmd === 'RODAR') {
    if (fix(arg) === 'RELOGIO.BAS') { termPrint(' 23 : 10'); const inp = $('termInput'); inp.disabled = true;
      setTimeout(() => { termPrint(' 23 : 10\n 23 : 10\n 23 : 10'); }, 700);
      setTimeout(() => { termPrint('BREAK EM 30\nPRONTO'); inp.disabled = false; inp.focus(); }, 3200); }
    else termPrint('?PROGRAMA NAO ENCONTRADO');
  }
  else if (cmd === 'CLS') $('term').textContent = '';
  else if (cmd === 'SAIR' || cmd === 'EXIT') closeOv();
  else if (cpFiles().includes(fix(cmd))) cpType(fix(cmd));
  else if (cmd === 'RELOGIO' || cmd === 'RELOGIO.BAS') termPrint('?SYNTAX ERROR  (USE: RUN RELOGIO)');
  else termPrint('?SYNTAX ERROR');
}
$('termInput').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const v = e.target.value; e.target.value = ''; cpCommand(v);
});

// ——— TV ———
function drawTVScreen(ctx, t) {
  ctx.save(); ctx.beginPath(); ctx.roundRect(1104, 320, 136, 128, 22); ctx.clip();
  ctx.globalAlpha = .85; ctx.drawImage(grains[(t / 50 | 0) % grains.length], 1104, 320, 136, 128);
  ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(150,170,200,.28)'; ctx.fillRect(1104, 320, 136, 128);
  if ((t % 9000) < 3600) { // a tela de ajuste
    const cols = ['#c8c8c8', '#c8c800', '#00c8c8', '#00c800', '#c800c8', '#c80000', '#0000c8'];
    cols.forEach((c, i) => { ctx.fillStyle = c; ctx.globalAlpha = .55; ctx.fillRect(1104 + i * 19.5, 320, 19.5, 90); });
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(1172, 384, 10, 1172, 384, 260); g.addColorStop(0, 'rgba(120,150,220,.22)'); g.addColorStop(1, 'rgba(120,150,220,0)');
  ctx.fillStyle = g; ctx.fillRect(900, 120, 540, 540); ctx.restore();
}
const emit3base = EMIT[3];
EMIT[3] = function (ctx, st, t) { emit3base(ctx, st, t); if (st.tvOn && st.power && !ovVideoOpen()) drawTVScreen(ctx, t); };
function ovVideoOpen() { return !$('ovVideo').hidden; }

// ——— fita na TV ———
let vhsPlayer = null, vhsRaf = 0;
function playFilm(film, onEnd, onStop) {
  if (!vhsPlayer) vhsPlayer = makeVHS($('vhs'));
  openOv('ovVideo'); const t0 = performance.now(); cancelAnimationFrame(vhsRaf);
  const step = (now) => {
    if ($('ovVideo').hidden) { $('vhsSub').textContent = ''; onStop && onStop(); return; }
    const t = (now - t0) / 1000;
    vhsPlayer.sg.save(); const o = film.draw(vhsPlayer.sg, t) || {}; vhsPlayer.sg.restore();
    vhsPlayer.frame(now, o);
    const sub = film.subs.find(s => t >= s[0] && t < s[1]), txt = sub ? sub[2] : '';
    if ($('vhsSub').textContent !== txt) $('vhsSub').textContent = txt;
    if (t >= film.dur) { hideAllOv(); $('vhsSub').textContent = ''; onEnd && onEnd(); return; }
    vhsRaf = requestAnimationFrame(step);
  };
  vhsRaf = requestAnimationFrame(step);
}
function watch86() {
  S.tvOn = true;
  playFilm(FILM86, () => { S.flags.fita86 = true;
    say('A fita para sozinha e a tela volta pro azul. A Marina filmou o ônibus parado nesta porta, em 1986. O mesmo ônibus que você pegou hoje.'); });
}

// ——— o evento das 03:40 ———
TICKS.push(() => {
  if (S.flags.ev340 || !S.started || S.ended || fictionMin() < 220 || overlayOpen() || S.view > 3) return;
  S.flags.ev340 = true;
  const now = performance.now();
  S.blackoutUntil = now + 1500; S.tvOn = false; S.dropPauseUntil = now + 120000;
  setTimeout(() => {
    dirty();
    say(S.power
      ? 'O relógio parado, em cima da cômoda, dá um tique. Um só. A lâmpada morre e volta.' + (S.open.oficina ? ' Na oficina, o receptor chia sozinho por dois segundos.' : '') + ' E a gota parou de cair.'
      : 'No escuro, o relógio parado dá um tique. Um só. E a gota parou de cair.');
  }, 1600);
});

// ——— pontos clicáveis desta onda (ficam por cima dos antigos) ———
spot(3, 'cp500', [702, 284, 210, 192], { label: 'Computador CP-500', act: () => openCP() });
spot(3, 'tv', [1082, 188, 220, 284], { label: 'TV Telefunken',
  act: () => {
    if (!S.power) { say('TV de tubo, 20 polegadas, antena de chifre. Sem luz, não liga.'); return; }
    S.tvOn = !S.tvOn;
    say(S.tvOn ? 'Liga com um estalo. Chuvisco. Você gira o seletor: num canal, a tela de ajuste com o apito fino; no outro, um filme antigo com o som no mínimo; no resto, chuvisco. Três da manhã é isso.' : 'Você desliga. O ponto branco demora a sumir da tela.');
  } });
spot(3, 'vcr', [1096, 476, 194, 38], { label: 'Videocassete Sharp',
  act: () => { if (!S.flags.fitaIn) say('Vazio. Esperando uma fita.'); else if (!S.power) say('Sem luz.'); else watch86(); },
  use: (it) => { if (it !== 'fita') return false; if (!S.power) { say('Sem luz, o videocassete não puxa a fita.'); return true; }
    removeItem('fita'); S.flags.fitaIn = true; watch86(); return true; } });
spot(3, 'telefone', [1322, 486, 92, 54], { label: 'Telefone', act: () => openPhone() });
spot(3, 'secretaria', [1408, 508, 64, 34], { label: 'Secretária eletrônica',
  act: () => { if (!S.power) { say('Uma secretária eletrônica de microfita. Sem luz, morta.'); return; }
    if (S.flags.secApitou) playTape(TAPE_CECI, () => { S.flags.recado2 = true; }); else playTape(TAPE_ODETE, () => { S.flags.odeteTape = true; }); } });
// a microfita é a da própria secretária do porão (a mesma que o Fábio ouviu pelo telefone à 0h41).
// Primeiro ela toca o lado B (a Dona Odete). Depois que a caixa de chumbo sai de baixo da bancada,
// a máquina apita sozinha e passa a tocar o lado A, com uma mensagem que não estava lá antes.
TICKS.push(() => {
  if (S.flags.secApitou || !S.started || S.ended || !S.power || !S.found.caixa) return;
  const agora = performance.now();
  if (!S.caixaAt || window.LIVRO_PAUSADO) { S.caixaAt = agora; return; }   // no livro, só conta com o porão na tela
  if (agora - S.caixaAt < 4000 || overlayOpen()) return;
  S.flags.secApitou = true;
  if (typeof SFX !== 'undefined' && SFX.bell) { SFX.bell(); setTimeout(() => { if (!S.ended) SFX.bip(); }, 3600); }
  say('Lá no porão, o telefone toca. Ninguém atende. A secretária atende sozinha, apita, e a luzinha vermelha volta a piscar.');
});
