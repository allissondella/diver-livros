// ===== wave5.js — abertura na TV de tubo e a fita da volta no final =====
// abertura: a TV no chuvisco; a fita IDA 7/6 é o "play" do jogo
let tvRaf = 0;
function tvStaticLoop() {
  const c = $('tvStatic'), g = c.getContext('2d');
  const step = (t) => {
    if ($('intro').hidden || $('tvIntro').hidden) return;
    g.drawImage(grains[(t / 60 | 0) % grains.length], 0, 0, 320, 240);
    g.fillStyle = 'rgba(170,185,200,.35)'; g.fillRect(0, 0, 320, 240);
    const y = (t / 9) % 280 - 20; g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(0, y, 320, 14);
    tvRaf = requestAnimationFrame(step);
  };
  cancelAnimationFrame(tvRaf); tvRaf = requestAnimationFrame(step);
}
const showIntroText = showIntro;
showIntro = function () {
  showIntroText(); clearTimeout(showIntro.t); clearTimeout(showIntroText.t);
  $('introText').hidden = true; $('btnStart').hidden = true;
  $('tvIntro').hidden = false; $('tapeIda').classList.remove('in'); $('tapeIda').disabled = false;
  tvStaticLoop();
};
function afterIda() {
  $('tvIntro').hidden = true; $('introText').hidden = false;
  showIntroText(); // linhas do porão e o botão de acender a lanterna
}
$('tapeIda').addEventListener('click', (e) => {
  e.stopPropagation();
  const b = $('tapeIda'); b.disabled = true; b.classList.add('in');
  setTimeout(() => playFilm(FILM_IDA, afterIda, afterIda), 950);
});

// final: a fita da volta, depois a plataforma do Barra Funda
finale = function () {
  S.flags.won = true; removeItem('caixa'); dirty(6); S.ended = true; closeOv(); hideMsg();
  const epilogue = () => {
    $('endText').innerHTML = `<span class="when">05:12</span>
      <p>Plataforma do Metrô Barra Funda, começando a clarear. A Cecília está sentada do seu lado, com a mesma roupa de ontem.</p>
      <p>Ela pergunta a que horas você pegou o ônibus.<br>“Uma e meia.”<br>“O 875A não passa na Monte Alegre.”</p>
      <p>“Passou. Duas vezes.”</p>
      <p>Você olha a câmera na mochila. O contador nunca parou de gravar.</p>
      <p class="fim">FIM</p>
      <p class="score">Você achou ${S.papers.size} de ${PAPERS.length} papéis da linha do tempo.</p>`;
    $('btnRetry').hidden = true; $('ovEnd').hidden = false;
  };
  playFilm(FILM_VOLTA, epilogue, epilogue);
};
