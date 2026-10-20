// ===== wave7.js — fitas com vídeo de verdade (Flow/Veo), passadas pelo mesmo VHS =====
// Cada fita é um arquivo só, já com os cortes de chiado no lugar (media/build-tapes.sh).
// Se o arquivo não carregar, a fita volta a ser a desenhada (o FILM antigo).
const TAPES = {};
function tapeEl(src) {
  if (TAPES[src]) return TAPES[src];
  const v = document.createElement('video');
  // WebM (VP9) onde der; MP4 (H.264) no Safari e afins
  v.src = v.canPlayType('video/webm; codecs="vp9, opus"') ? src.replace(/\.mp4$/, '.webm') : src; v.preload = 'auto'; v.playsInline = true; v.setAttribute('playsinline', '');
  v.style.cssText = 'position:fixed;left:0;top:0;width:2px;height:2px;opacity:0;pointer-events:none';
  v.setAttribute('aria-hidden', 'true');
  document.body.appendChild(v);
  TAPES[src] = v; return v;
}
const tapeOK = (v) => v && !v.error && v.readyState >= 2;
function tapeSync(v, t) {
  v.muted = !AUD.on;
  if (v.paused && !v.ended) v.play().catch(() => {});
  if (Math.abs(v.currentTime - t) > .3) { try { v.currentTime = t; } catch (e) { /* ainda carregando */ } }
}
const inR = (t, rs) => rs.find(r => t >= r[0] && t < r[1]);

// troca o conteúdo de um FILM pela versão em vídeo, guardando a desenhada como reserva
function useTape(film, spec) {
  const old = { dur: film.dur, subs: film.subs, motor: film.motor, draw: film.draw };
  const v = tapeEl(spec.src);
  const draw = function (g, t) {
    const stamp = spec.stamp(t);
    if (t < 2) { vcrBlue(g, 'PLAY ►'); return { snow: 0 }; }
    if (t >= spec.dur - 1) { vcrBlue(g, 'STOP ■'); v.pause(); return { snow: 0 }; }
    tapeSync(v, t);
    const cut = inR(t, spec.cuts);
    if (cut && !cut[2]) { g.fillStyle = '#000'; g.fillRect(0, 0, VW, VH); return { snow: .92, track: 1 }; }
    const near = spec.cuts.some(c => t >= c[0] - .35 && t < c[0]);
    if (inR(t, spec.vid)) {
      if (!tapeOK(v)) { g.fillStyle = '#000'; g.fillRect(0, 0, VW, VH); return { snow: .6, track: 1, stamp }; }
      const r = { stamp, real: true, img: v, overlay: spec.extra };
      if (cut) return Object.assign(r, { snow: .45, track: 1 }); // falha dentro da cena (rasgo de tracking)
      return Object.assign(r, { track: near ? .9 : .12 });
    }
    g.fillStyle = '#000'; g.fillRect(0, 0, VW, VH); return { snow: .8, track: 1 };
  };
  film.tape = { spec, v, old, neu: { dur: spec.dur, subs: spec.subs, motor: spec.motor, draw } };
  Object.assign(film, film.tape.neu);
}

// ——— fita de ida (50 s) ———
// liga a fita com vídeo só quando os vídeos novos chegarem
const FITA_VIDEO = { ida: false };
const IDA_LETREIRO = ['875A-10  AEROPORTO – PERDIZES', '875A-10  AEROPORTO – PERDI ES', '875A-1   AER PORTO – PERDI  S', '87 A     A   ORTO – PERDI', ' 7 A               – PERDI'];
if (FITA_VIDEO.ida) useTape(FILM_IDA, {
  src: 'video/fita-ida.mp4', dur: 50,
  stamp: (t) => { const tot = 3600 + 31 * 60 + Math.max(0, t - 4) * 25;
    return ['JUN. 7 1996', `0${Math.floor(tot / 3600)}:${String(Math.floor(tot / 60) % 60).padStart(2, '0')}:${String(Math.floor(tot) % 60).padStart(2, '0')}`]; },
  // trechos com imagem de vídeo no arquivo
  vid: [[4, 9.875], [10.5, 18.5], [19.1, 26.3], [26.7, 37.37], [43, 44.5]],
  // cortes de chiado; o terceiro valor marca falha por cima da imagem
  cuts: [[2, 4], [9.875, 10.5], [17.35, 17.95, 'rasgo'], [18.5, 19.1], [26.3, 26.7], [37.37, 39], [48, 49]],
  motor: [],
  subs: [[5, 9.8, '[garoa. Av. Paulista, uma e meia da manhã]'], [12.5, 17.3, '[o 875A-10 encosta no ponto]'],
    [19.3, 21.6, '[a catraca gira]'], [21.6, 23.3, '[uma mulher sozinha, no banco atrás da catraca]'],
    [23.3, 26.3, '“Seu lugar não é aqui. Desce.”', 'mulher-desce'], [28, 37, '[o letreiro vai perdendo as letras]'],
    [39.3, 43, '[a porta abre e espera]'], [43.1, 44.5, '[ela ainda está olhando]'], [44.8, 48, '[o portão. a porta da casa]']],
  // o letreiro de dentro, refletido no vidro da janela
  extra(g, t) {
    if (t < 26.7 || t >= 37.37) return;
    const i = Math.min(4, (t - 26.7) / 2.1 | 0);
    if (Math.random() < .04) return; // pisca
    g.save(); g.globalCompositeOperation = 'lighter'; ledText(g, IDA_LETREIRO[i], 10, 34, 17, .7); g.restore();
  },
  // a casa: chiado até chegar o vídeo 06
});

// escolhe vídeo ou desenho na hora de tocar; para o vídeo quando a fita fecha
playFilm = wrap('playFilm', (film) => {
  const tp = film.tape; if (!tp) return;
  const ok = !tp.v.error;
  Object.assign(film, ok ? tp.neu : tp.old);
  AUD.film = film; // o wrap do som (wave6) já guardou a referência; os campos é que mudaram
  if (ok) { try { tp.v.currentTime = 0; } catch (e) { /* ainda carregando */ } tp.v.muted = !AUD.on; tp.v.volume = .9; tp.v.play().catch(() => {}); }
});
hideAllOv = wrap('hideAllOv', () => { for (const k in TAPES) TAPES[k].pause(); });
