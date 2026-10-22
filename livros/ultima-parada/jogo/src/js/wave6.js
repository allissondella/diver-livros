// ===== wave6.js — liga os sons e as vozes aos momentos do jogo =====
const wrap = (name, before, after) => {
  const base = window[name] || eval(name);
  const fn = function (...a) { if (before) before(...a); const r = base.apply(this, a); if (after) after(r, ...a); return r; };
  return fn;
};
placeFuse = wrap('placeFuse', () => { SFX.squeak(); setTimeout(SFX.clunk, 700); });
unlock = wrap('unlock', () => { SFX.clunk(); });
openGav3 = wrap('openGav3', () => { SFX.tick(); SFX.pull(); });
deskDrawer = wrap('deskDrawer', () => SFX.pull());
openEstante = wrap('openEstante', () => SFX.rumble(3.2));
mazeDone = wrap('mazeDone', () => { SFX.roll(1.6); setTimeout(() => SFX.roll(2.4), 900); setTimeout(() => { SFX.clunk(); SFX.rumble(2); }, 2600); });
tilt = wrap('tilt', () => { if (!mazeBusy) SFX.roll(.35); });
corrMove = wrap('corrMove', () => { for (let i = 0; i < 4; i++) SFX.step(i * .32); });
dial = wrap('dial', null, (r, ch, i) => { if (dialing) { const n = i + 1, back = (220 + n * 85); for (let k = 0; k < n; k++) SFX.tick(back / 1000 + k * .065); } });
playFilm = wrap('playFilm', (film) => { AUD.film = film; AUD.filmT0 = performance.now() + 16; AUD.filmPlayed = new Set(); });
hideAllOv = wrap('hideAllOv', () => stopVoice());

// falas ditas fora de diálogo (mensagens) que têm voz gravada
const SAY_VOICES = [['Você veio. Trouxe a certa?', 'ceci-ponto']];
say = wrap('say', (text) => { for (const [k, id, fx] of SAY_VOICES) if (text.includes(k)) voice(id, fx); });

// narração dos papéis
const pid = (id) => 'papel-' + String(id).padStart(2, '0');
openPaper = wrap('openPaper', null, (r, id) => {
  const b = $('paperAudio'), ok = hasVoice(pid(id));
  b.disabled = !ok; b.textContent = ok ? 'Ouvir a narração' : 'Narração ainda não gravada';
  b.dataset.id = id;
  if (ok && S.flags.autoNarra !== false) voice(pid(id));
});
$('paperAudio').addEventListener('click', () => voice(pid($('paperAudio').dataset.id)));

// cliques dos cadeados, do disco e do teclado
document.addEventListener('click', (e) => {
  const t = e.target;
  if (t.closest && t.closest('.wheel button')) SFX.tick();
  else if (t.closest && t.closest('.dirBody button')) { SFX.tick(); SFX.tick(.05); }
  else if (t.classList && t.classList.contains('dirPull')) SFX.pull();
  else if (t.closest && t.closest('.item')) SFX.tick();
});
$('termInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') SFX.cpBeep(); else if (e.key.length === 1 || e.key === 'Backspace') SFX.key(); });
// passos ao entrar e sair das cenas do outro lado
goView = wrap('goView', (v) => { if (v >= 4 || S.view >= 4) for (let i = 0; i < 3; i++) SFX.step(.1 + i * .3); });
