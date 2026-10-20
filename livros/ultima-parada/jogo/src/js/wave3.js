// ===== wave3.js — as máquinas: fita na TV, secretária, telefone, CP-500, evento das 03:40 =====
ITEMS.microfita = { name: 'Microfita', desc: 'A microfita da secretária eletrônica da sua casa. O recado da Cecília está nela.' };
ICONS.microfita = (g) => { g.fillStyle = '#d6d0bd'; g.fillRect(5, 8, 18, 12); g.fillStyle = '#222'; g.fillRect(8, 11, 12, 5);
  g.fillStyle = '#777'; g.beginPath(); g.arc(11, 13.5, 1.6, 0, 7); g.arc(17, 13.5, 1.6, 0, 7); g.fill(); };

// ——— texto que aparece com o tempo (secretária e telefone) ———
let linesTimer = 0;
function playLines(listEl, ovId, lines, onEnd) {
  clearTimeout(linesTimer); listEl.textContent = '';
  let i = 0;
  const next = () => {
    if ($(ovId).hidden) return; // desligaram no meio
    if (i >= lines.length) { onEnd && onEnd(); return; }
    const l = lines[i++], li = document.createElement('li');
    if (l.sys) { li.className = 'sys'; li.textContent = l.sys; }
    else if (l.me) { li.className = 'me'; li.textContent = l.me; }
    else { li.innerHTML = `<span class="who">${l.who}</span>`; const s = document.createElement('span'); s.className = 'voice' + (l.noisy ? ' noisy' : ''); s.textContent = l.text; li.append(s); }
    listEl.append(li);
    while (listEl.children.length > 5) listEl.firstChild.remove();
    const txt = l.sys || l.me || l.text;
    if (l.sys && l.sys.startsWith('[BIP]') && typeof SFX !== 'undefined') SFX.bip();
    if (l.sys && l.sys.startsWith('[chamando') && typeof SFX !== 'undefined') SFX.ring();
    const wait = l.d != null ? l.d : Math.max(1800, txt.length * 58);
    if (l.v && typeof hasVoice === 'function' && hasVoice(l.v)) voice(l.v, l.fx).then(() => { if (!$(ovId).hidden) linesTimer = setTimeout(next, 450); });
    else { if (l.noisy && typeof AUD !== 'undefined') AUD.noisyUntil = performance.now() + wait; linesTimer = setTimeout(next, wait); }
  };
  next();
}

// ——— secretária eletrônica ———
const TAPE_CECI = [
  { v: 'sec-01', sys: '[BIP] Mensagem um. Sexta-feira, zero hora e quarenta e um minutos.' },
  { v: 'ceci-recado-1', fx: 'radio', who: 'Cecília', noisy: true, text: 'Fábio? É a Ceci. Eu tô na última parada. Não dá pra explicar. Eu tenho pouco tempo. Fecha às cinco e dez. Vem. Desce no porão. Lê o diá—' },
  { sys: '[o chiado engole a última palavra]', d: 1800 },
  { v: 'sec-02', sys: '[BIP] Mensagem dois. Data e hora não registradas.' },
  { v: 'ceci-recado-2', fx: 'radio', who: 'Cecília', noisy: true, text: 'Fábio. A parede da cômoda. Ele guardou tudo lá. Eu trouxe a caixa errada.' },
  { v: 'sec-03', sys: '[BIP] Fim das mensagens.', d: 1600 },
  { me: 'Em casa, essa fita só tinha uma mensagem.', d: 0 },
];
const TAPE_ODETE = [
  { v: 'sec-04', sys: '[BIP] Você tem uma mensagem.' },
  { v: 'sec-05', sys: '[BIP] Segunda-feira, vinte de maio, dezesseis horas e dois minutos.' },
  { v: 'odete-recado', fx: 'phone', who: 'Dona Odete', text: 'Cecília? É a Odete, da frente. Eu fiquei pensando no que você perguntou. Menina, não desce mais lá. A outra também era teimosa. E o pai dela também.' },
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
      { v: 'odete-tel-3', fx: 'phone', who: 'Dona Odete', text: 'Vi o Aurélio sair de casa de noite em setenta e seis, com uma caixa debaixo do braço, e subir num ônibus apagado. Vi a Marina em oitenta e seis, com uma lanterna. Vi a sua amiga ontem, às onze e dez.' },
      { v: 'odete-tel-4', fx: 'phone', who: 'Dona Odete', text: 'A menina foi atrás do pai, e a sua foi atrás da menina. Agora você tá indo atrás da sua.' },
      { v: 'odete-tel-5', fx: 'phone', who: 'Dona Odete', text: 'Fecha essa coisa, menino.' }, { sys: '[ela desliga]', d: 0 }],
  '190': () => [{ sys: '[chamando…]' }, { v: 'pm-1', fx: 'phone', who: 'Polícia Militar', text: 'Polícia Militar, boa noite.' },
    { v: 'fabio-pm', me: '— Minha amiga sumiu dentro de casa. Num porão.' },
    { v: 'pm-2', fx: 'phone', who: 'Polícia Militar', text: 'Maior de idade? Desaparecimento só depois de quarenta e oito horas, senhor. Liga de novo no sábado à noite.' }, { sys: '[desligam]', d: 0 }],
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
const CP_FILES = {
  'MARINA.TXT': 'MEU PAI NAO FUGIU.\nELE MONTOU UM RECEPTOR NUMA OFICINA ESCONDIDA\nATRAS DA PAREDE DA COMODA. O LABIRINTO ABRE.\n\nEM 1974 O RADIO PEGOU UM SINAL EM MORSE.\nUMA DATA, UMA HORA, UM ONIBUS.\nEM 6/6/76, AS 23:10, ELE SUBIU NO ONIBUS.\n\nA PASSAGEM ABRE TODO 6 DE JUNHO DE ANO\nQUE ACABA EM 6 E FICA ABERTA SEIS HORAS.\n\nEU VOU BUSCAR ELE.',
  'DATAS.TXT': '06/06/1976 - PAPAI\n06/06/1986 - ?\n06/06/1996\n06/06/2006\n06/06/2016\n06/06/2026\n06/06/2036\n06/06/2046',
  'RELOGIO.BAS': '10 REM RELOGIO - A.T. 1985\n20 H=23 : M=10\n30 PRINT H;":";M\n40 GOTO 30',
};
const CP_PAI = 'TRANSCRICAO DOS CADERNOS DO PAPAI (M.T., 1986)\n\nCAD. 4  MONTOU O RECEPTOR COM VALVULAS DO RADIO VELHO.\nCAD. 5  SINAL NA FAIXA 23.10. PONTOS E TRACOS.\nCAD. 6  DECIFROU:  06 06 76 / 23 10 / 875A-10\nCAD. 8  "DEIXEI ABERTO. SEIS HORAS.\n         VOLTO PELO MESMO ONIBUS."\n\n          N (ESCADA)\n   +---------------------+\n M |                     | E\n E |       PORAO         | S ===> A LINHA\n S |                     | T\n A |                     |\n   +-------[COMODA]------+\n           |OFICINA|\n           +-------+';
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim().replace(/\s+/g, ' ');
function termPrint(txt) { const t = $('term'); t.textContent += txt + '\n'; t.scrollTop = t.scrollHeight; }
function setPrompt(p) { $('termPrompt').textContent = p; }
function cpBoot() {
  $('term').textContent = ''; $('ovCP').querySelector('.crt').classList.remove('dead');
  termPrint('PROLOGICA CP-500   48K\nSISTEMA DOS 500   VERSAO 1.3\n');
  if (S.cp.logged) { termPrint('A>'); setPrompt('A>'); } else setPrompt('SENHA:');
}
function openCP() {
  if (!S.power) { say('Um Prológica CP-500, bege. Sem energia.'); return; }
  if (S.flags.cpDead) { say('Não liga mais. Cheiro de componente queimado.'); return; }
  if (!S.cp) S.cp = { logged: false, fails: 0, mode: 'pass', pai: false };
  openOv('ovCP'); cpBoot(); setTimeout(() => $('termInput').focus(), 50);
}
function cpFiles() {
  const f = Object.keys(CP_FILES);
  if (S.cp.pai) f.push('PAI.TXT');
  if (S.flags.ev340 && !S.flags.ceciRead) f.push('CECI.TXT');
  return f;
}
const CP_DATES = { 'MARINA.TXT': '01/06/86', 'DATAS.TXT': '25/05/86', 'RELOGIO.BAS': '02/02/85', 'PAI.TXT': '01/06/86', 'CECI.TXT': '07/06/96' };
function cpType(name) {
  if (name === 'CECI.TXT' && cpFiles().includes(name)) { cpCeci(); return; }
  if (name === 'PAI.TXT' && S.cp.pai) { termPrint(CP_PAI); return; }
  if (CP_FILES[name] && name.endsWith('.TXT')) { termPrint(CP_FILES[name]); return; }
  if (CP_FILES[name]) { termPrint(CP_FILES[name]); return; }
  termPrint('?ARQUIVO NAO ENCONTRADO');
}
function cpCeci() {
  const inp = $('termInput'); inp.disabled = true; S.flags.ceciRead = true;
  const msg = 'a caixa de chumbo'; let i = 0;
  const t = $('term'); t.textContent += '\n';
  const iv = setInterval(() => {
    t.textContent += msg[i++]; t.scrollTop = t.scrollHeight;
    if (i >= msg.length) { clearInterval(iv);
      setTimeout(() => { $('ovCP').querySelector('.crt').classList.add('dead'); S.flags.cpDead = true;
        setTimeout(() => { inp.disabled = false; closeOv(); say('A tela se apaga num risco branco. Cheiro de componente queimado. O computador não liga mais.'); }, 1100); }, 900); }
  }, 260);
}
function cpCommand(raw) {
  const c = norm(raw); const cp = S.cp;
  if (cp.mode === 'pass') {
    termPrint('SENHA: ' + '*'.repeat(raw.length));
    if (c === 'TITO') { cp.logged = true; cp.mode = 'cmd'; termPrint('\nBEM-VINDA, MARINA.\nDIGITE AJUDA PARA VER OS COMANDOS.\n'); setPrompt('A>'); }
    else { cp.fails++; termPrint(cp.fails >= 3 ? 'VOCE NAO E A MARINA.' : 'SENHA INCORRETA.'); }
    return;
  }
  if (cp.mode === 'filepass') {
    termPrint('SENHA DO ARQUIVO: ' + '*'.repeat(raw.length));
    cp.mode = 'cmd'; setPrompt('A>');
    if (c === '0606' || c === '06/06' || c === '0606' || c === '06 06') { cp.pai = true; S.flags.pai = true; termPrint('RECUPERADO: PAI.TXT\n'); termPrint(CP_PAI); }
    else termPrint('SENHA INCORRETA.\nLEMBRETE DA AUTORA: O DIA E O MES DELE.');
    return;
  }
  termPrint('A>' + c);
  if (!c) return;
  const [cmd, ...rest] = c.split(' '); let arg = rest.join(' ');
  const fix = (n) => { if (!n) return n; if (n.includes('.')) return n; const hit = cpFiles().find(f => f.startsWith(n + '.')); return hit || n; };
  if (cmd === 'AJUDA' || cmd === 'HELP') termPrint('DIR              LISTA OS ARQUIVOS\nTYPE <ARQUIVO>   MOSTRA UM ARQUIVO\nRUN <PROGRAMA>   RODA UM PROGRAMA\nRECUPERA         PROCURA ARQUIVOS APAGADOS\nCLS              LIMPA A TELA');
  else if (cmd === 'DIR') { termPrint(' DIRETORIO A:'); for (const f of cpFiles()) { const [n, e] = f.split('.'); termPrint(` ${n.padEnd(9)}${e.padEnd(6)}${CP_DATES[f]}`); } termPrint(` ${cpFiles().length} ARQUIVOS`); }
  else if (cmd === 'TYPE' || cmd === 'LIST' || cmd === 'LER' || cmd === 'CAT' || cmd === 'ABRIR') cpType(fix(arg));
  else if (cmd === 'RUN' || cmd === 'RODAR') {
    if (fix(arg) === 'RELOGIO.BAS') { termPrint(' 23 : 10'); const inp = $('termInput'); inp.disabled = true;
      setTimeout(() => { termPrint(' 23 : 10\n 23 : 10\n 23 : 10'); }, 700);
      setTimeout(() => { termPrint('BREAK EM 30\nPRONTO'); inp.disabled = false; inp.focus(); }, 3200); }
    else termPrint('?PROGRAMA NAO ENCONTRADO');
  }
  else if (cmd === 'RECUPERA') {
    if (!arg) { termPrint('PROCURANDO SETORES APAGADOS...'); termPrint(S.cp.pai ? 'NADA MAIS PARA RECUPERAR.' : ' *APAGADO*  PAI.TXT   (PROTEGIDO)\nUSE: RECUPERA PAI.TXT'); }
    else if (fix(arg) === 'PAI.TXT' || arg === 'PAI') { if (S.cp.pai) termPrint('JA RECUPERADO. USE: TYPE PAI.TXT'); else { cp.mode = 'filepass'; setPrompt('SENHA DO ARQUIVO:'); } }
    else termPrint('?NADA COM ESSE NOME');
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
  if ((t % 9000) < 3600) {
    ctx.fillStyle = 'rgba(20,40,120,.75)'; ctx.fillRect(1104, 372, 136, 30);
    ctx.fillStyle = 'rgba(240,240,240,.85)'; ctx.font = 'bold 15px Arial'; ctx.fillText('PLANTÃO', 1140, 393);
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
  S.blackoutUntil = now + 1500; S.tvOn = false;
  setTimeout(() => {
    const closed = S.open.esc; if (closed) { S.open.esc = false; S.flags.escClosed = true; }
    dirty();
    say(S.power
      ? 'O relógio parado dá um tique. Um só. A lâmpada morre e volta. Na estante, o rádio de pilha, que não tem pilha, chia por dois segundos.' + (closed ? ' Quando a luz volta, a gaveta da escrivaninha está fechada. Você não fechou.' : '')
      : 'No escuro, o relógio parado dá um tique. Um só. Na estante, o rádio de pilha, que não tem pilha, chia por dois segundos.');
  }, 1600);
});

// ——— pontos clicáveis desta onda (ficam por cima dos antigos) ———
spot(1, 'radio', [576, 400, 186, 112], { label: 'Rádio de pilha',
  act: () => say(S.flags.ev340 ? 'O lugar das pilhas continua vazio. Mas ele chiou. Você ouviu.' : 'Um Motoradio de capa de couro. O lugar das pilhas está vazio.') });
spot(3, 'cp500', [702, 284, 210, 192], { label: 'Computador CP-500', act: () => openCP() });
spot(3, 'tv', [1082, 188, 220, 284], { label: 'TV Telefunken',
  act: () => {
    if (!S.power) { say('TV de tubo, 20 polegadas, antena de chifre. Sem luz, não liga.'); return; }
    S.tvOn = !S.tvOn;
    say(S.tvOn ? 'Liga com um estalo. Chuvisco, e um plantão que vai e volta: “…jovem de dezoito anos desaparecida desde ontem à noite em Perdizes. A polícia aguarda o prazo de quarenta e oito horas…” Depois, o Minhocão fechado para obras. Depois, chuvisco.' : 'Você desliga. O ponto branco demora a sumir da tela.');
  } });
spot(3, 'vcr', [1096, 476, 194, 38], { label: 'Videocassete Sharp',
  act: () => { if (!S.flags.fitaIn) say('Vazio. Esperando uma fita.'); else if (!S.power) say('Sem luz.'); else watch86(); },
  use: (it) => { if (it !== 'fita') return false; if (!S.power) { say('Sem luz, o videocassete não puxa a fita.'); return true; }
    removeItem('fita'); S.flags.fitaIn = true; watch86(); return true; } });
spot(3, 'telefone', [1322, 486, 92, 54], { label: 'Telefone', act: () => openPhone() });
spot(3, 'secretaria', [1408, 508, 64, 34], { label: 'Secretária eletrônica',
  act: () => { if (!S.power) { say('Uma secretária eletrônica de microfita. Sem luz, morta.'); return; }
    if (S.flags.microfitaIn) playTape(TAPE_CECI); else playTape(TAPE_ODETE, () => { S.flags.odeteTape = true; }); },
  use: (it) => { if (it !== 'microfita') return false; if (!S.power) { say('Sem luz, a secretária não liga.'); return true; }
    removeItem('microfita'); S.flags.microfitaIn = true; playTape(TAPE_CECI, () => { S.flags.recado2 = true; }); return true; } });
