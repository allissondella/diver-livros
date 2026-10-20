// ===== wave7.js — a fita de ida em vídeo, tocada como está na TV da abertura =====
// midia/publico/video/fita-ida.mp4 já é o produto final (VHS, cortes, glitch, voz da mulher,
// jumpscare): aqui só se toca o arquivo, dentro da tela da TV, SEM o filtro VHS em canvas
// (makeVHS) por cima. Se o vídeo não carregar, a fita volta a ser a desenhada (FILM_IDA).
const IDA = { v: $('tvIda'), sfx: 'audio/fita-entrando.mp3', on: false };

// a fita entrando no videocassete (o arquivo em publico/ já vem 10 dB mais alto que o de sons/)
function sfxFitaEntrando() {
  if (!AUD.on) return;
  const a = new Audio(IDA.sfx); a.volume = 1; a.play().catch(() => { /* sem som, segue */ });
}
$('tapeIda').addEventListener('click', sfxFitaEntrando);

// o player: vídeo em tela cheia na TV; Esc interrompe a fita (como "Parar a fita")
const playFilmDrawn = playFilm;
function playIdaVideo(onEnd, onStop) {
  const v = IDA.v, screen = $('tvScreen'), hint = $('tvHint');
  let done = false;
  const finish = (fn) => {
    if (done) return; done = true; IDA.on = false;
    v.pause(); v.hidden = true; screen.classList.remove('on'); hint.textContent = hint.dataset.idle;
    document.removeEventListener('keydown', onKey); v.onended = v.onerror = null;
    fn && fn();
  };
  const onKey = (e) => { if (e.key === 'Escape') finish(onStop); };
  const fallback = () => { finish(null); playFilmDrawn(FILM_IDA, onEnd, onStop); };
  if (!hint.dataset.idle) hint.dataset.idle = hint.textContent;
  if (v.error) { fallback(); return; }
  IDA.on = true; v.hidden = false; screen.classList.add('on'); hint.textContent = 'Esc para parar a fita';
  v.muted = !AUD.on; v.volume = 1;
  v.onended = () => finish(onEnd);
  v.onerror = fallback;
  try { v.currentTime = 0; } catch (e) { /* ainda carregando */ }
  document.addEventListener('keydown', onKey);
  v.play().catch(fallback);
}
playFilm = function (film, onEnd, onStop) {
  if (film === FILM_IDA) { playIdaVideo(onEnd, onStop); return; }
  return playFilmDrawn(film, onEnd, onStop);
};

// enquanto a fita toca, o som é só o do vídeo: sem o chiado e a chuva da abertura
audioTick = wrap('audioTick', null, () => {
  if (!IDA.on) return;
  IDA.v.muted = !AUD.on; setG('hiss', 0); setG('rain', 0, .2);
});
