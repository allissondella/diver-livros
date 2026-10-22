// ===== ui.js — mensagens, itens, papéis, linha do tempo, caderno, diário, fim =====
let msgTimer = 0;
function say(text) {
  const m = $('msg'); m.textContent = text; m.hidden = false;
  clearTimeout(msgTimer); msgTimer = setTimeout(hideMsg, Math.max(4200, text.length * 62));
}
function hideMsg() { $('msg').hidden = true; }
$('msg').addEventListener('click', hideMsg);

let toastTimer = 0;
function toast(text) {
  const t = $('toast'); t.textContent = text; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
}

// ——— itens ———
const ICONS = {
  fusivel(g) {
    g.fillStyle = '#3a2316'; g.fillRect(4, 8, 14, 12); g.fillStyle = '#9c8656'; g.fillRect(18, 10, 6, 8);
    g.fillStyle = 'rgba(255,240,200,.4)'; g.fillRect(5, 9, 12, 2);
  },
  uv(g) {
    g.fillStyle = '#2b2b30'; g.fillRect(3, 11, 16, 7); g.fillStyle = '#44444c'; g.fillRect(17, 9, 6, 11);
    g.fillStyle = '#9b6bff'; g.fillRect(23, 10, 3, 9); g.fillStyle = 'rgba(160,110,255,.35)'; g.fillRect(25, 6, 3, 17);
  },
  fita(g) {
    g.fillStyle = '#151515'; g.fillRect(2, 7, 24, 15); g.fillStyle = '#d9cfae'; g.fillRect(5, 9, 18, 5);
    g.fillStyle = '#333'; g.beginPath(); g.arc(9, 18, 2.5, 0, 7); g.arc(19, 18, 2.5, 0, 7); g.fill();
  },
};
function renderInv() {
  const inv = $('inv'); inv.textContent = '';
  for (const id of S.inv) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'item';
    b.setAttribute('aria-pressed', S.sel === id ? 'true' : 'false');
    const c = mk(28, 28); ICONS[id] && ICONS[id](c.getContext('2d'));
    b.append(c, document.createTextNode(ITEMS[id].name));
    b.addEventListener('click', () => selectItem(S.sel === id ? null : id));
    inv.append(b);
  }
}
function addItem(id) { if (!S.inv.includes(id)) S.inv.push(id); renderInv(); }
function removeItem(id) { S.inv = S.inv.filter(i => i !== id); if (S.sel === id) S.sel = null; renderInv(); }
function selectItem(id) {
  S.sel = id; renderInv();
  if (id && ITEMS[id].desc) say(ITEMS[id].desc + (id === 'uv' ? '' : ' Clique em alguma coisa para usar.'));
}

// ——— sobreposições ———
let paperBack = null; // de onde o papel foi aberto (linha do tempo, mural), para voltar ao fechar
function openOv(id) { hideAllOv(); $(id).hidden = false; hideMsg(); }
function hideAllOv() { document.querySelectorAll('.ov').forEach(o => { if (o.id !== 'ovEnd') o.hidden = true; }); }
function closeOv() {
  const fromPaper = !$('ovPaper').hidden && paperBack;
  hideAllOv(); saveNotes();
  if (fromPaper) { const back = paperBack; paperBack = null; back(); } else paperBack = null;
}
document.querySelectorAll('.ov .close').forEach(b => b.addEventListener('click', closeOv));
document.querySelectorAll('.ov').forEach(o => o.addEventListener('pointerdown', (e) => { if (e.target === o && o.id !== 'ovEnd') closeOv(); }));

// ——— papéis e linha do tempo ———
function findPaper(id, quiet) {
  if (S.papers.has(id)) return false;
  S.papers.add(id);
  $('tlCount').textContent = S.papers.size;
  const b = $('btnTimeline'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
  if (!quiet) toast('Um papel foi para a linha do tempo.');
  return true;
}
function paperBg() {
  const c = $('paperBg'); c.width = 800; c.height = 450;
  const g = c.getContext('2d'); g.filter = 'sepia(1) brightness(.35) contrast(1.2) blur(2px)';
  g.drawImage(scene(S.view), 0, 0, 800, 450); g.filter = 'none';
  g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(0, 0, 800, 450);
}
function openPaper(id, back) {
  const p = PAPERS.find(x => x.id === id); if (!p) return;
  paperBack = back || null;
  S.seen.add(id); paperBg();
  const el = $('paper'); el.className = 'paper ' + p.kind; el.innerHTML = p.html;
  el.style.setProperty('--rot', ((id * 37 % 7) - 3) * .45 + 'deg');
  $('paperMeta').textContent = `${p.when} · ${p.where}`;
  openOv('ovPaper');
}
function openTimeline() {
  const list = $('tlList'); list.textContent = '';
  const found = PAPERS.filter(p => S.papers.has(p.id)).sort((a, b) => a.date < b.date ? -1 : 1);
  if (!found.length) { const li = document.createElement('li'); li.className = 'tlEmpty'; li.textContent = 'Nenhum papel ainda. Eles aparecem aqui em ordem de data, não na ordem em que você acha.'; list.append(li); }
  let prevYear = null;
  for (const p of found) {
    const y = p.date.slice(0, 3);
    if (prevYear && y !== prevYear) { const gap = document.createElement('li'); gap.className = 'tlGap'; gap.textContent = '· · ·'; list.append(gap); }
    prevYear = y;
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.className = 'tlItem' + (S.seen.has(p.id) ? '' : ' new');
    b.innerHTML = `<span class="d">${p.when}</span><span class="t">${p.title}<span class="w">${p.where}</span></span>`;
    b.addEventListener('click', () => openPaper(p.id, openTimeline));
    li.append(b); list.append(li);
  }
  $('tlProgress').textContent = `${S.papers.size} de ${PAPERS.length} papéis`;
  openOv('ovTimeline');
}
$('btnTimeline').addEventListener('click', openTimeline);

// ——— caderno (da Cecília + do jogador) ———
const NOTES_KEY = 'ultima-parada-notas';
function loadNotes() { try { return localStorage.getItem(NOTES_KEY) || ''; } catch (e) { return ''; } }
function saveNotes() { try { localStorage.setItem(NOTES_KEY, $('notes').value); } catch (e) { /* sem armazenamento: segue sem salvar */ } }
$('notes').value = loadNotes();
$('notes').addEventListener('input', () => { clearTimeout(saveNotes.t); saveNotes.t = setTimeout(saveNotes, 400); });
function openNotes() { openOv('ovNotes'); }
$('btnNotes').addEventListener('click', openNotes);

// ——— diário de Marina ———
let diaryPage = 0;
function renderDiary() {
  const d = DIARY[diaryPage], el = $('diaryPage');
  el.innerHTML = `<p class="dd">${d.d}</p><p>${d.t}</p>` +
    (d.c ? `<span class="cifra">${d.c}</span>` : '') + (d.ceci ? `<span class="ceci">${d.ceci}</span>` : '');
  $('dNum').textContent = `${diaryPage + 1} / ${DIARY.length}`;
  $('dPrev').disabled = diaryPage === 0; $('dNext').disabled = diaryPage === DIARY.length - 1;
}
function openDiary() { renderDiary(); openOv('ovDiary'); S.flags.diary = true; }
$('dPrev').addEventListener('click', () => { if (diaryPage > 0) { diaryPage--; renderDiary(); } });
$('dNext').addEventListener('click', () => { if (diaryPage < DIARY.length - 1) { diaryPage++; renderDiary(); } });

// ——— fim ———
function endBad() {
  S.ended = true; closeOv();
  $('endText').innerHTML = `<span class="when">05:10</span>
    <p>Lá fora, um motor a diesel passa devagar pela Monte Alegre. Não para.</p>
    <p>A lâmpada apaga sozinha. A estante é só uma estante.</p>
    <p>A gota volta a cair na lata. Uma a cada onze segundos.</p>`;
  $('ovEnd').hidden = false;
}
$('btnRestart').addEventListener('click', () => startGame(true));

// ——— abertura ———
function showIntro() {
  const box = $('introText'); box.textContent = '';
  INTRO.forEach((line, i) => {
    const p = document.createElement('p');
    if (typeof line === 'object') { p.className = 'when'; p.textContent = line.when; } else p.textContent = line;
    p.style.animationDelay = (0.4 + i * 1.5) + 's'; box.append(p);
  });
  $('intro').hidden = false; $('btnStart').hidden = true;
  clearTimeout(showIntro.t); showIntro.t = setTimeout(() => { $('btnStart').hidden = false; $('btnStart').focus(); }, 800 + INTRO.length * 1500);
}
$('intro').addEventListener('click', (e) => { if (e.target.id !== 'btnStart' && (!$('tvIntro') || $('tvIntro').hidden)) { $('btnStart').hidden = false; } });
$('btnStart').addEventListener('click', () => startGame(false));

function startGame(restart) {
  if (restart) { resetState(); dirty(); renderInv(); if (typeof syncNav === 'function') syncNav(); $('tlCount').textContent = '0'; $('ovEnd').hidden = true; diaryPage = 0; showIntro(); return; }
  $('intro').hidden = true;
  S.started = true; S.t0 = performance.now(); S.nextBatt = S.t0 + 9000; S.nextFlick = S.t0 + 12000; $('clock').hidden = false;
  $('viewName').textContent = VIEWS[S.view];
  fit();
  setTimeout(() => say('Escuro. Cheiro de mofo e de cera de chão. Em algum lugar, água pingando numa lata.'), 900);
}
