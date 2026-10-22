// ===== audio.js — todo o som é gerado aqui (Web Audio); as vozes vêm de audio/<id>.mp3 se existirem =====
const AUD = { ctx: null, master: null, on: true, g: {}, last: {}, morseAt: 0, ev340: false, epi: false, film: null, filmT0: 0, filmPlayed: new Set(), noisyUntil: 0, silenceUntil: 0, silenceDone: false };
try { AUD.on = localStorage.getItem('ultima-parada-som') !== 'off'; } catch (e) { /* segue com som */ }

function audioInit() {
  if (AUD.ctx) { if (AUD.ctx.state === 'suspended') AUD.ctx.resume(); return; }
  const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
  const ctx = AUD.ctx = new C();
  AUD.master = ctx.createGain(); AUD.master.gain.value = AUD.on ? .9 : 0; AUD.master.connect(ctx.destination);
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  AUD.noiseBuf = buf;
  const layer = (name) => { const g = ctx.createGain(); g.gain.value = 0; g.connect(AUD.master); AUD.g[name] = g; return g; };
  const filt = (type, f, q) => { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q) b.Q.value = q; return b; };
  const noiseInto = (...chain) => { const s = noiseSrc(); let n = s; for (const c of chain) { n.connect(c); n = c; } s.start(); return n; };
  // garoa lá fora
  noiseInto(filt('highpass', 900), filt('lowpass', 5200)).connect(layer('rain'));
  // ronco grave da casa
  noiseInto(filt('lowpass', 140)).connect(layer('rumble'));
  // zumbido da lâmpada (60 Hz da rede)
  const hum = layer('hum'); for (const [f, v, ty] of [[60, 1, 'sine'], [120, .6, 'sine'], [180, .25, 'triangle']]) { const o = ctx.createOscillator(); o.type = ty; o.frequency.value = f; const gg = ctx.createGain(); gg.gain.value = v; o.connect(gg).connect(hum); o.start(); }
  // reator de fluorescente (corredores)
  { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 120; o.connect(filt('lowpass', 900)).connect(layer('fluor')); o.start(); }
  // motor a diesel
  { const m = layer('motor'), o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 34; const lp = filt('lowpass', 160);
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 7; lg.gain.value = 6; lfo.connect(lg).connect(o.frequency); lfo.start();
    o.connect(lp).connect(m); o.start(); noiseInto(filt('lowpass', 220)).connect(m); }
  // chiado de fita / TV
  noiseInto(filt('highpass', 2600)).connect(layer('hiss'));
  // chiado de rádio AM
  noiseInto(filt('bandpass', 1600, .6)).connect(layer('chiado'));
  // morse: um tom que é ligado e desligado pelo padrão
  { const o = ctx.createOscillator(); o.frequency.value = 690; AUD.morseGate = ctx.createGain(); AUD.morseGate.gain.value = 0; o.connect(AUD.morseGate).connect(layer('morse')); o.start(); }
  setInterval(audioTick, 100);
}
function noiseSrc() { const s = AUD.ctx.createBufferSource(); s.buffer = AUD.noiseBuf; s.loop = true; s.loopStart = Math.random(); return s; }
function setG(name, v, tc) { const g = AUD.g[name]; if (g) g.gain.setTargetAtTime(v, AUD.ctx.currentTime, tc || .15); }

// ——— sons curtos ———
function tone(f, dur, type, vol, fEnd, delay) {
  if (!AUD.ctx || !AUD.on) return;
  const c = AUD.ctx, t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
  o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (fEnd) o.frequency.exponentialRampToValueAtTime(fEnd, t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g).connect(AUD.master); o.start(t); o.stop(t + dur + .05);
}
function burst(dur, type, f, q, vol, delay, attack) {
  if (!AUD.ctx || !AUD.on) return;
  const c = AUD.ctx, t = c.currentTime + (delay || 0), s = noiseSrc(), b = c.createBiquadFilter(), g = c.createGain();
  b.type = type; b.frequency.value = f; b.Q.value = q || 1;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + (attack || .004)); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(b).connect(g).connect(AUD.master); s.start(t); s.stop(t + dur + .05);
}
const SFX = {
  // a gota na lata: o som gravado (audio/gota.mp3), baixinho; sem ele, o sintetizado
  drip(v) { if (!sample('gota', .3 * v)) { tone(1900, .09, 'sine', .07 * v, 650); burst(.03, 'bandpass', 3000, 3, .03 * v); } },
  thud(v, d) { tone(95, .3, 'sine', .5 * (v || 1), 38, d); burst(.1, 'lowpass', 320, 1, .25 * (v || 1), d); },
  knock() { SFX.thud(.6); burst(.6, 'bandpass', 880, 9, .12, .02); burst(.5, 'bandpass', 1320, 12, .06, .05); },
  creak(d) { tone(210, .7, 'sawtooth', .02, 150, d); burst(.6, 'bandpass', 700, 14, .05, d, .2); },
  tick(d) { burst(.014, 'bandpass', 3600, 2, .3, d); },
  clunk() { SFX.tick(); SFX.thud(.5, .03); burst(.08, 'highpass', 2500, 1, .15, .02); },
  // bipe e telefone: o som gravado (audio/bip.mp3, telefone-*.mp3) se existir; senão, sintetizado
  bip() { if (!sample('bip', .9)) tone(1020, .32, 'sine', .14); },
  bipMs() { return hasVoice('bip') ? 1080 : 400; },
  // telefone chamando (quem liga ouve): n = 1 ou 2 toques; o gravado termina com o clique de quem atende
  ring(n) { if (n === 1 ? sample('telefone-chamando', .9, 3.2) : sample('telefone-chamando', .9)) return;
    tone(425, 1.0, 'sine', .07); if (n !== 1) tone(425, 1.0, 'sine', .07, null, 3.2); },
  ringMs(n) { return hasVoice('telefone-chamando') ? (n === 1 ? 3000 : 6200) : (n === 1 ? 1800 : 4400); },
  // a campainha do telefone do porão
  bell() { if (sample('telefone-tocando', .8)) return; for (let k = 0; k < 2; k++) for (let i = 0; i < 18; i++) tone(i % 2 ? 680 : 860, .05, 'square', .025, null, k * 1.6 + i * .05); },
  key() { burst(.018, 'bandpass', 1800 + Math.random() * 600, 1.2, .18); },
  cpBeep() { tone(1180, .09, 'square', .04); },
  shatter() { for (let i = 0; i < 6; i++) burst(.12 + Math.random() * .15, 'highpass', 2000 + Math.random() * 3000, 2, .2, i * .03); SFX.thud(.4); },
  roll(dur) { burst(dur, 'lowpass', 520, 1, .12, 0, dur * .3); },
  step(d) { SFX.thud(.35, d); burst(.06, 'lowpass', 900, 1, .1, d); },
  clockTick() { burst(.02, 'highpass', 4200, 1, .35); },
  rumble(dur) { burst(dur, 'lowpass', 110, 1, .5, 0, dur * .3); for (let i = 0; i < dur / .16; i++) SFX.tick(i * .16); },
  squeak() { tone(900, .12, 'sawtooth', .02, 1300); tone(1000, .1, 'sawtooth', .02, 1400, .18); },
  pull() { burst(.35, 'bandpass', 500, 3, .15, 0, .1); SFX.thud(.25, .3); },
};

// ——— estado contínuo: o que deve soar agora ———
const vis = (id) => { const e = document.getElementById(id); return e && !e.hidden; };
function audioTick() {
  if (!AUD.ctx) return;
  const now = performance.now(), porao = S.started && S.view <= 3, silent = now < AUD.silenceUntil;
  const intro = vis('intro') && vis('tvIntro');
  setG('rain', silent ? 0 : intro ? .012 : !S.started ? .02 : S.view === 6 ? .085 : S.view === 4 ? .007 : porao ? .018 : 0, silent ? .02 : .4);
  setG('rumble', S.started ? .03 : 0);
  const dark = now < S.blackoutUntil;
  setG('hum', S.started && S.power && S.view <= 4 && !dark ? .01 : 0, .05);
  setG('fluor', S.view === 5 ? .012 : 0);
  // fitas: chiado e motor por trecho
  let motor = 0, hiss = 0;
  if (vis('ovVideo') && AUD.film) {
    const t = (now - AUD.filmT0) / 1000; hiss = .05;
    for (const [a, b, v] of (AUD.film.motor || [])) if (t >= a && t < b) motor = v;
    for (const s of AUD.film.subs) if (s[3] && t >= s[0] && !AUD.filmPlayed.has(s[3])) { AUD.filmPlayed.add(s[3]); voice(s[3], s[4]); }
  } else if (intro) hiss = .035;
  else if (vis('ovTape') && document.querySelector('.machine.play')) hiss = .02;
  else if (S.tvOn && S.power && S.view === 3 && !vis('ovVideo')) hiss = .02;
  if (S.view === 5 && !vis('ovVideo')) motor = .03 + S.corr * .035;
  setG('motor', motor, .5); setG('hiss', hiss);
  // rádio de válvulas: chiado, morse perto do 23.10
  let chiado = now < AUD.noisyUntil ? .035 : 0, morse = 0;
  if (vis('ovRadio')) {
    const d = Math.abs(parseFloat($('tune').value) - 23.1);
    chiado = Math.max(chiado, d < .035 ? .012 : d < .6 ? .03 : .05);
    morse = d < .035 ? (S.flags.marina && !curVoice ? .05 : .012) : d < .6 ? .06 * (1 - d / .6) : 0;
    scheduleMorse();
  }
  setG('chiado', chiado, .08); setG('morse', morse, .08);
  // goteira na lata (mesmo ritmo do desenho)
  if (porao && !silent) {
    const cyc = now % 11000, crossed = AUD.last.drip !== undefined && AUD.last.drip < 650 && cyc >= 650;   // uma a cada onze segundos, junto com o desenho
    if (crossed && !overlayOpen() && now >= S.dropPauseUntil) SFX.drip(S.view === 0 ? 1 : .35);
    AUD.last.drip = cyc;
    if (!AUD.last.knock) AUD.last.knock = now + 60000 + Math.random() * 60000;
    if (now > AUD.last.knock) { SFX.knock(); AUD.last.knock = now + 90000 + Math.random() * 90000; }
    if (!AUD.last.creak) AUD.last.creak = now + 30000;
    if (now > AUD.last.creak) { SFX.creak(); AUD.last.creak = now + 40000 + Math.random() * 45000; }
    // uma vez por partida: tudo some por 6 segundos
    if (!AUD.silenceDone && S.t0 && now - S.t0 > 36 * 60000 && Math.random() < .002) { AUD.silenceDone = true; AUD.silenceUntil = now + 6000; }
  }
  // o evento das 03:40
  if (S.flags.ev340 && !AUD.ev340) {
    AUD.ev340 = true; SFX.clockTick(); SFX.thud(.7, .05);
    for (let i = 0; i < 5; i++) SFX.step(.5 + i * .55);
    SFX.creak(1.6); burst(2, 'bandpass', 1500, .7, .12, 3, .05);
  }
  if (!S.flags.ev340) AUD.ev340 = false;
  // epílogo com as vozes, se existirem
  if (vis('ovEnd') && S.flags.won && !AUD.epi) {
    AUD.epi = true;
    voice('fabio-fim-1').then(() => voice('ceci-fim-1')).then(() => voice('fabio-fim-2'));
  }
  if (!S.flags.won) AUD.epi = false;
}
// morse: 06 06 76 / 23 10 / 875A-10, agendado um pouco à frente
const MORSE_CODE = { '0': '-----', '1': '.----', '2': '..---', '3': '...--', '5': '.....', '6': '-....', '7': '--...', '8': '---..', 'A': '.-',
  'P': '.--.', 'U': '..-', 'X': '-..-', 'E': '.', 'O': '---', 'L': '.-..', 'I': '..', 'V': '...-', 'R': '.-.' };
function scheduleMorse() {
  const livro = S.flags.marina;   // depois da voz da Marina: PUXE O LIVRO 7, mais devagar
  const c = AUD.ctx, u = livro ? .1 : .07, g = AUD.morseGate.gain;
  if (AUD.morseAt < c.currentTime) AUD.morseAt = c.currentTime + .05;
  if (AUD.morseAt > c.currentTime + 1.5) return;
  let t = AUD.morseAt;
  for (const word of (livro ? ['PUXE', 'O', 'LIVRO', '7'] : ['06', '06', '76', '2310', '875A10'])) {
    for (const ch of word) { for (const s of MORSE_CODE[ch]) { const len = s === '.' ? u : 3 * u; g.setValueAtTime(1, t); g.setValueAtTime(0, t + len); t += len + u; } t += 2 * u; }
    t += 4 * u;
  }
  AUD.morseAt = t + (livro ? 2.2 : 1.2);
}

// ——— sons gravados curtos: decodificados uma vez, tocados pelo master ———
const SAMPLES = {};
function sample(id, vol, from) {
  if (!AUD.ctx || !AUD.on || !hasVoice(id)) return false;
  const go = (b) => { if (!b || !AUD.on) return; const s = AUD.ctx.createBufferSource(), g = AUD.ctx.createGain();
    g.gain.value = vol || 1; s.buffer = b; s.connect(g).connect(AUD.master); s.start(AUD.ctx.currentTime, Math.min(from || 0, b.duration)); };
  if (SAMPLES[id] && !(SAMPLES[id] instanceof Promise)) go(SAMPLES[id]);
  else (SAMPLES[id] = SAMPLES[id] || fetch(`audio/${id}.mp3`).then(r => r.arrayBuffer()).then(a => AUD.ctx.decodeAudioData(a)).then(b => (SAMPLES[id] = b)).catch(() => null)).then(go);
  return true;
}

// ——— vozes gravadas (ElevenLabs): audio/<id>.mp3 listados em audio/manifest.json ———
let MANIFEST = new Set(), curVoice = null;
function hasVoice(id) { return MANIFEST.has(id); }
function stopVoice() { if (curVoice) { curVoice.pause(); curVoice = null; } }
function voice(id, fx) {
  return new Promise((res) => {
    if (!id || !AUD.on || !hasVoice(id)) { res(false); return; }
    audioInit(); stopVoice();
    const a = new Audio(`audio/${id}.mp3`); curVoice = a;
    if (AUD.ctx) {
      try {
        const src = AUD.ctx.createMediaElementSource(a); let node = src;
        if (fx === 'radio' || fx === 'phone' || fx === 'tv') {
          const hp = AUD.ctx.createBiquadFilter(), lp = AUD.ctx.createBiquadFilter();
          hp.type = 'highpass'; hp.frequency.value = fx === 'tv' ? 250 : 350; lp.type = 'lowpass'; lp.frequency.value = fx === 'radio' ? 2600 : 3400;
          node.connect(hp); hp.connect(lp); node = lp;
          if (fx === 'radio') AUD.noisyUntil = performance.now() + 60000;
        }
        node.connect(AUD.master);
      } catch (e) { /* toca direto */ }
    }
    const done = (ok) => { if (fx === 'radio') AUD.noisyUntil = 0; if (curVoice === a) curVoice = null; res(ok); };
    a.onended = () => done(true); a.onerror = () => done(false);
    a.play().catch(() => done(false));
  });
}
fetch('audio/manifest.json').then(r => r.ok ? r.json() : []).then((list) => { MANIFEST = new Set(list); }).catch(() => {});

// ——— botão de som ———
(function soundButton() {
  const b = document.createElement('button'); b.type = 'button'; b.id = 'btnSound';
  const label = () => { b.textContent = AUD.on ? 'Som: ligado' : 'Som: desligado'; b.setAttribute('aria-pressed', String(AUD.on)); };
  b.addEventListener('click', () => {
    AUD.on = !AUD.on; label(); audioInit();
    if (AUD.master) AUD.master.gain.setTargetAtTime(AUD.on ? .9 : 0, AUD.ctx.currentTime, .05);
    if (!AUD.on) stopVoice();
    try { localStorage.setItem('ultima-parada-som', AUD.on ? 'on' : 'off'); } catch (e) { /* sem armazenamento */ }
  });
  label(); $('tools').prepend(b);
})();
document.addEventListener('pointerdown', audioInit, { capture: true });
document.addEventListener('keydown', audioInit, { capture: true });
