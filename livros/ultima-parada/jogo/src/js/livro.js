// ===== livro.js — o porão dentro do livro (Diver Livro) =====
// Quando o jogo roda dentro do site do livro (porao/index.html?livro=1):
// - não mostra a abertura da TV (o livro já passou a fita) e começa direto no escuro;
// - avisa o livro a cada marco da investigação, e o livro solta a página seguinte do caderno;
// - para o relógio e o som enquanto a pessoa lê;
// - no final, entrega a última cena para o livro (capítulos 9 e 10) em vez do filme do jogo.
const NO_LIVRO = /[?&]livro=1/.test(location.search) && window.parent !== window;
if (NO_LIVRO) {
  const avisa = (d) => { try { window.parent.postMessage(Object.assign({ ultimaParada: true }, d), '*'); } catch (e) { /* sem livro */ } };
  showIntro = function () {
    $('intro').hidden = true; if ($('tvIntro')) $('tvIntro').hidden = true;
    startGame(false);
  };
  // os marcos, na ordem do livro: cada um solta um capítulo (o livro garante a ordem)
  const MARCOS = [
    ['luz', () => S.power],            // o fusível: a luz acende → capítulo 3
    ['rota', () => S.open.gav1],       // o cadeado ROTA da cômoda → capítulo 4
    ['pai', () => S.flags.pai],        // a senha 0606 do CP-500 → capítulo 5
    ['caixa', () => S.found.caixa],    // a caixa de chumbo na bancada da oficina → capítulo 6
    ['radio', () => S.flags.marina],   // o receptor da oficina em 23.10, depois que a voz da Marina termina → capítulo 7
    ['estante', () => S.open.estante], // o volume sete, a estante gira → capítulo 8
    ['fim', () => S.flags.won],        // 05h10, a caixa no ônibus → capítulo 9
  ];
  const enviados = new Set();
  TICKS.push(() => {
    for (const [k, f] of MARCOS) if (!enviados.has(k) && f()) { enviados.add(k); avisa({ marco: k }); }
  });
  // pausa enquanto a pessoa lê: o relógio da ficção e o som param
  // (a cada verificação, empurra o começo da partida para frente: o tempo parado não conta)
  let pausado = false, ultimo = 0;
  TICKS.unshift(() => {
    if (!pausado) return;
    const agora = performance.now(), dt = agora - ultimo; ultimo = agora;
    if (S.started) { S.t0 += dt; S.nextBatt += dt; S.nextFlick += dt; }
  });
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (!d.ultimaParada) return;
    if (d.acao === 'pausa' && !pausado) {
      pausado = true; window.LIVRO_PAUSADO = true; ultimo = performance.now();
      if (AUD.ctx && AUD.ctx.state === 'running') AUD.ctx.suspend();
    } else if (d.acao === 'continua' && pausado) {
      const dt = performance.now() - ultimo; pausado = false; window.LIVRO_PAUSADO = false;
      if (S.started) { S.t0 += dt; S.nextBatt += dt; S.nextFlick += dt; }
      if (AUD.ctx && AUD.on) AUD.ctx.resume();
    }
  });
  // o fim ruim também é do livro: tela preta, "VOCÊ FALHOU", e volta ao começo
  endBad = function () {
    S.ended = true; closeOv(); hideMsg();
    if (AUD.ctx && AUD.ctx.state === 'running') AUD.ctx.suspend();
    avisa({ falhou: true });
  };
  // o final é do livro
  finale = function () {
    S.flags.won = true; removeItem('caixa'); dirty(6); S.ended = true; closeOv(); hideMsg();
    if (!enviados.has('fim')) { enviados.add('fim'); avisa({ marco: 'fim' }); }
  };
  avisa({ pronto: true });
}
