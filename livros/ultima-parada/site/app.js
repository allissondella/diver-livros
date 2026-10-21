/* Última Parada — o livro e o porão juntos.
   Abertura: aviso → nota do estúdio → a fita → o porão, no escuro.
   No porão (o escape room, em porao/index.html?livro=1), cada marco solta uma página do caderno:
     a luz acende → cap. 1 · o cadeado da cômoda → cap. 2 · a senha do CP-500 → cap. 3 ·
     a caixa de chumbo → cap. 4 · a estante gira → cap. 5 · 05h10, a caixa no ônibus → cap. 6 → fim.
   Enquanto a pessoa lê, o relógio e o som do porão param. */
(function () {
  'use strict';
  const CAPS = window.CAPITULOS || [];
  const $ = (s, r) => (r || document).querySelector(s);
  const el = (tag, props, ...filhos) => {
    const e = document.createElement(tag);
    if (props) for (const k in props) {
      if (k === 'class') e.className = props[k];
      else if (k === 'html') e.innerHTML = props[k];
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), props[k]);
      else e.setAttribute(k, props[k]);
    }
    for (const f of filhos) if (f != null) e.append(f);
    return e;
  };

  // ——— progresso e Páginas ———
  const PONTOS = { ler: 10, marco: 5, fita: 5, final: 20 };
  const MAXIMO = PONTOS.ler * 6 + PONTOS.marco * 6 + PONTOS.fita + PONTOS.final; // 115
  const ORDEM = ['luz', 'rota', 'pai', 'caixa', 'estante', 'fim']; // marco que solta o capítulo 1, 2, … 6
  const CENAS = {
    1: 'A lâmpada acende, amarela, zumbindo. No seu colo, o caderno que veio do sebo se abre sozinho na primeira página escrita.',
    2: 'O cadeado da cômoda abre. No caderno, as páginas de trás, grudadas de umidade, se descolam uma da outra.',
    3: 'A tela verde aceita a senha. De dentro do caderno escorregam seis folhas de formulário contínuo, dobradas.',
    4: 'Onze quilos de chumbo, frios. Quando você puxa a caixa, o caderno abre numa página em que a tinta muda de azul para preta.',
    5: 'A estante gira. Um ar frio vem do corredor e vira as páginas do caderno até a letra da Cecília de novo.',
    6: 'Cinco e dez. A porta do ônibus fecha. As últimas páginas do caderno estão escritas a lápis, com outra letra.',
  };
  const CHAVE = 'ultima-parada:livro';
  const novo = () => ({ fase: 'nota', liberados: 0, marcos: {}, lidos: {}, abertos: {}, paginas: 0, fita: false, final: false, claro: false });
  let P = novo();
  try { const s = JSON.parse(localStorage.getItem(CHAVE)); if (s && s.fase) P = Object.assign(novo(), s); } catch (e) { /* sem armazenamento */ }
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(P)); } catch (e) { /* segue sem salvar */ } };
  function ganhar(n) {
    P.paginas += n; salvar();
    const b = $('#paginas'); b.textContent = P.paginas + ' Páginas';
    b.classList.remove('ganhou'); void b.offsetWidth; b.classList.add('ganhou');
  }
  const naoLido = () => { for (let n = 1; n <= P.liberados; n++) if (!P.abertos[n]) return n; return 0; };
  const atualizaSelo = () => { $('#selo').hidden = !naoLido(); };

  // ——— som ———
  let ctx = null, ruidoBuf = null, bufFita = null;
  function audio() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        ruidoBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const d = ruidoBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function ruido(dur, vol, freq, quando = 0) {
    const c = audio(); if (!c) return;
    const s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter(), t = c.currentTime + quando;
    s.buffer = ruidoBuf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(c.destination); s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }
  const estalo = () => ruido(0.5, 0.2, 1800);
  const papel = () => { ruido(0.18, 0.12, 4200); ruido(0.25, 0.09, 3000, 0.16); ruido(0.3, 0.07, 2400, 0.4); }; // folha virando
  function somFita() {
    const c = audio(); if (!c) return;
    const tocar = (b) => { const s = c.createBufferSource(), g = c.createGain(); g.gain.value = 3; s.buffer = b; s.connect(g).connect(c.destination); s.start(); };
    if (bufFita) return tocar(bufFita);
    fetch('sons/fita-entrando.mp3').then(r => r.arrayBuffer()).then(a => c.decodeAudioData(a)).then(b => { bufFita = b; tocar(b); }).catch(() => {});
  }

  // ——— o porão (o escape room) ———
  let jogo = null;
  const falaJogo = (acao) => { if (jogo && jogo.contentWindow) jogo.contentWindow.postMessage({ ultimaParada: true, acao }, '*'); };
  function mostrarPorao() {
    if (!jogo) {
      jogo = el('iframe', { src: 'porao/index.html?livro=1', title: 'O porão', allow: 'autoplay; fullscreen' });
      $('#porao').append(jogo);
    }
    vista = 'porao'; pararLeitura();
    aplicarTema('porao');
    document.body.classList.add('no-porao');
    $('#porao').hidden = false; $('#ir-porao').hidden = true;
    medirBarra();
    falaJogo('continua');
    setTimeout(() => { try { jogo.focus(); } catch (e) { /* ok */ } }, 50);
  }
  function sairDoPorao() {
    if (vista === 'porao') falaJogo('pausa');
    document.body.classList.remove('no-porao');
    $('#porao').hidden = true;
    $('#ir-porao').hidden = P.fase !== 'porao' || !!P.marcos.fim;
  }
  function medirBarra() { document.documentElement.style.setProperty('--barra', $('.barra').offsetHeight + 'px'); }
  window.addEventListener('resize', medirBarra);
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (!d.ultimaParada || !jogo || e.source !== jogo.contentWindow) return;
    if (d.marco) registrarMarco(d.marco);
  });
  function registrarMarco(k) {
    if (P.marcos[k]) return;
    P.marcos[k] = true;
    let n = 0; while (n < ORDEM.length && P.marcos[ORDEM[n]]) n++;   // os capítulos saem em ordem
    if (n <= P.liberados) { salvar(); return; }
    const antes = P.liberados; P.liberados = n; salvar();
    for (let i = antes; i < n; i++) ganhar(PONTOS.marco);
    atualizaSelo();
    paginaSolta(antes + 1, n);
  }
  function paginaSolta(de, ate) {
    if (ate === 6) { falaJogo('pausa'); setTimeout(() => abrirCapitulo(6), 1400); papel(); return; }
    falaJogo('pausa');
    $('#solta-cena').textContent = CENAS[ate];
    const c = CAPS.find(x => x.n === de);
    $('#solta-titulo').textContent = de === ate ? `Capítulo ${de} — ${c ? c.titulo : ''}` : `Capítulos ${de} a ${ate}`;
    $('#solta').hidden = false; papel(); $('#solta-ler').focus();
    $('#solta-ler').onclick = () => { $('#solta').hidden = true; abrirCapitulo(de); };
    $('#solta-depois').onclick = () => { $('#solta').hidden = true; falaJogo('continua'); };
  }

  // ——— vistas ———
  let vista = 'nota', timerLeitura = 0, observador = null;
  const pagina = $('#pagina');
  function aplicarTema(v) {
    const vermelho = v === 'nota' || v === 'fita' || v === 'cap1' || v === 'porao';
    document.body.classList.toggle('tema-vermelho', vermelho);
    document.body.classList.toggle('tema-leitura', !vermelho);
    document.body.classList.toggle('claro', !vermelho && P.claro);
    const t = $('#tema'); t.textContent = P.claro ? 'Fundo escuro' : 'Fundo claro'; t.setAttribute('aria-pressed', String(P.claro));
  }
  $('#tema').addEventListener('click', () => { P.claro = !P.claro; salvar(); aplicarTema(vista); });
  function pararLeitura() { clearTimeout(timerLeitura); if (observador) observador.disconnect(); }
  function abrirPagina(v) {
    sairDoPorao(); pararLeitura();
    vista = v; aplicarTema(v); pagina.innerHTML = '';
    window.scrollTo(0, 0); pagina.focus({ preventScroll: true });
  }
  const botao = (rotulo, fn, cheio) => el('button', { class: 'botao continuar' + (cheio ? ' cheio' : ''), type: 'button', onclick: fn }, rotulo);

  // ——— nota do estúdio ———
  function nota() {
    abrirPagina('nota');
    const a = el('article');
    a.append(el('header', { class: 'cap-cabeca' }, el('h1', { class: 'cap-titulo' }, 'Nota do estúdio')));
    [
      'Como estes papéis foram postos em ordem ficará claro na leitura. Todas as partes inúteis foram tiradas, para que uma história que não cabe bem no que se sabe hoje seja apresentada como simples fato. Não há nela nenhuma lembrança de coisas antigas em que a memória possa errar: todas as anotações escolhidas foram feitas na hora, por quem estava lá, sabendo só o que sabia naquele momento.',
      'O caderno chegou ao nosso estúdio em abril de 2026, trazido por um amigo, dono de um sebo na Rua Monte Alegre, em Perdizes. Ele o encontrou numa prateleira do fundo da loja, amarrado com barbante a uma bíblia, ao lado de uma fita VHS sem etiqueta. Não se lembra de tê-lo recebido. As câmeras de segurança, que gravam a porta e o balcão, não registraram ninguém deixando o pacote. A bíblia é uma edição comum, de 1961, com um nome na primeira página. A fita tem trinta e dois minutos gravados, e quase tudo é chiado.',
      'O sebo funciona no térreo de um sobrado. Nas páginas que seguem, esse sobrado é chamado de “a casa”. Embaixo dele há um porão.',
      'As entradas do caderno são de uma moça de dezoito anos. Dentro dele, copiados com a letra dela, estão trechos de cadernos mais antigos, que ela encontrou na casa. Mantivemos as datas como ela anotou. As transcrições das fitas são nossas, e estão marcadas.',
      'Recomendamos assistir à fita antes de abrir o caderno. Foi assim que nós fizemos.',
      'Não pedimos que ninguém acredite.',
    ].forEach(t => a.append(el('p', null, t)));
    a.append(el('p', { class: 'doc' }, 'Estúdio Diver, São Paulo, 2026'));
    pagina.append(a, botao('Assistir à fita', () => { if (P.fase === 'nota') { P.fase = 'fita'; salvar(); } fita(); }));
  }

  // ——— a fita ———
  function fita() {
    abrirPagina('fita');
    const a = el('article');
    a.append(el('header', { class: 'cap-cabeca' }, el('span', { class: 'cap-numero' }, 'A fita'), el('h1', { class: 'cap-titulo' }, 'JUN. 7 1996')));
    a.append(el('p', { class: 'nota' }, '[A fita estava junto do caderno, sem etiqueta. O relógio da filmadora começa à 01h31 de 7 de junho de 1996. O que segue é tudo o que ainda se pode ver. — Estúdio]'));
    const tela = el('div', { class: 'tv-tela' }, el('div', { class: 'chuvisco' }, 'SEM SINAL'));
    const tv = el('div', { class: 'tv' }, tela, el('span', { class: 'tv-marca' }, 'COLOR 20'), el('span', { class: 'tv-led' }));
    const colocar = el('button', { class: 'fita', type: 'button' }, el('span', { class: 'fita-icone', 'aria-hidden': 'true' }), 'Colocar a fita');
    const depois = el('div');
    const descer = () => botao('Descer ao porão', () => { if (P.fase !== 'porao' && P.fase !== 'fim') { P.fase = 'porao'; salvar(); } mostrarPorao(); }, true);
    colocar.addEventListener('click', () => {
      colocar.disabled = true; colocar.classList.add('entrando'); somFita();
      setTimeout(() => {
        tv.classList.add('ligada');
        const v = el('video', { playsinline: '', preload: 'auto' },
          el('source', { src: 'video/fita-ida.mp4', type: 'video/mp4' }),
          el('source', { src: 'video/fita-ida.webm', type: 'video/webm' }));
        tela.innerHTML = ''; tela.append(v);
        v.addEventListener('ended', terminou);
        v.addEventListener('click', () => { if (v.requestFullscreen) v.requestFullscreen().catch(() => {}); });
        const p = v.play(); if (p && p.catch) p.catch(() => { v.controls = true; });
        colocar.remove();
      }, 1300);
    });
    function terminou() {
      tv.classList.remove('ligada');
      if (!P.fita) { P.fita = true; ganhar(PONTOS.fita); }
      depois.innerHTML = '';
      depois.append(el('p', { class: 'nota' }, '[Fim do que se pode ver. O resto da fita é chiado. Uma das cenas, a da casa, é a casa onde fica o sebo. — Estúdio]'), descer());
    }
    a.append(tv, colocar, depois);
    if (P.fita) depois.append(descer());
    pagina.append(a);
  }

  // ——— capítulos ———
  function abrirCapitulo(n) {
    if (n > P.liberados) return;
    abrirPagina('cap' + n);
    if (!P.abertos[n]) { P.abertos[n] = true; salvar(); atualizaSelo(); }
    const c = CAPS.find(x => x.n === n); if (!c) return;
    const a = el('article');
    a.append(el('header', { class: 'cap-cabeca' }, el('span', { class: 'cap-numero' }, 'Capítulo ' + n), el('h1', { class: 'cap-titulo' }, c.titulo)));
    for (const b of c.blocos) {
      if (b.tipo === 'tela') a.append(telaCP500(b.texto));
      else a.append(el('p', { class: b.classe || '', html: b.html }));
    }
    const marca = el('p', { class: 'fim-cap', 'aria-hidden': 'true' }, '· · ·');
    a.append(marca);
    pagina.append(a);
    const acoes = el('div', { class: 'acoes', style: 'justify-content:center' });
    const prox = naoLido();
    if (n === 6) acoes.append(botao('Fechar o caderno', fim, true));
    else {
      if (prox) acoes.append(botao(`Ler o capítulo ${prox}`, () => abrirCapitulo(prox)));
      acoes.append(botao(P.fase === 'fim' ? 'Voltar ao fim' : 'Voltar ao porão', P.fase === 'fim' ? fim : mostrarPorao, true));
    }
    pagina.append(acoes);
    // Páginas por leitura: só conta se a pessoa ficou tempo suficiente para ler (uns 600 palavras por minuto, no mínimo)
    if (!P.lidos[n]) {
      const t0 = Date.now(), minimo = c.palavras * 100;
      observador = new IntersectionObserver((es) => {
        if (!es.some(e => e.isIntersecting)) return;
        observador.disconnect();
        const falta = Math.max(0, minimo - (Date.now() - t0));
        if (falta > 0) pagina.insertBefore(el('p', { class: 'aviso-pressa' }, '[As Páginas deste capítulo contam para quem leu. Fique mais um pouco.]'), acoes);
        timerLeitura = setTimeout(() => { if (vista === 'cap' + n && !P.lidos[n]) { P.lidos[n] = true; ganhar(PONTOS.ler); const av = $('.aviso-pressa'); if (av) av.remove(); } }, falta);
      });
      observador.observe(marca);
    }
  }
  function telaCP500(texto) {
    const t = el('div', { class: 'cp500', role: 'document', 'aria-label': 'Tela do computador CP-500' });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { t.textContent = texto; return t; }
    const linhas = texto.split('\n'); let i = 0;
    const passo = () => { if (i >= linhas.length) return; t.textContent += (i ? '\n' : '') + linhas[i++]; setTimeout(passo, 28); };
    setTimeout(passo, 400);
    return t;
  }

  // ——— fim ———
  function fim() {
    if (!P.final) { P.final = true; P.fase = 'fim'; ganhar(PONTOS.final); }
    if (jogo) { jogo.remove(); jogo = null; }
    abrirPagina('fim'); $('#ir-porao').hidden = true;
    const desconto = P.paginas >= 105 ? 15 : P.paginas >= 90 ? 10 : 0;
    const a = el('article', { class: 'fim' });
    a.append(el('header', { class: 'cap-cabeca' }, el('span', { class: 'cap-numero' }, 'Fim do caderno'), el('h1', { class: 'cap-titulo' }, 'Última Parada')));
    a.append(el('p', null, 'Você leu o caderno até a página 63.'));
    a.append(el('p', { class: 'fim-pontos' }, P.paginas + ' Páginas'), el('p', null, 'de ' + MAXIMO + ' possíveis'));
    if (desconto) a.append(el('p', null, `Suas Páginas valem ${desconto}% de desconto no próximo Diver Livro.`), el('p', { class: 'cupom' }, `ULTIMAPARADA${desconto}`));
    else a.append(el('p', null, 'Com 90 Páginas, o próximo Diver Livro sai com 10% de desconto. Releia sem pressa: o caderno inteiro está no menu Caderno.'));
    a.append(el('p', { class: 'nota' }, '[Não pedimos que ninguém acredite. — Estúdio]'));
    a.append(el('div', { class: 'acoes', style: 'justify-content:center' }, el('button', { class: 'botao', type: 'button', onclick: abrirSumario }, 'Reler o caderno')));
    pagina.append(a);
  }

  // ——— o caderno (sumário) ———
  function abrirSumario() {
    const ol = $('#sumario-lista'); ol.innerHTML = '';
    const item = (rotulo, livre, fn, novoMarca) => {
      const b = el('button', { type: 'button', onclick: () => { fecharSumario(); fn(); } }, rotulo);
      if (novoMarca) b.append(el('span', { class: 'novo' }, 'nova'));
      if (!livre) { b.disabled = true; }
      ol.append(el('li', null, b));
    };
    item('Nota do estúdio', true, nota);
    item('A fita — JUN. 7 1996', P.fase !== 'nota', fita);
    for (const c of CAPS) {
      const livre = c.n <= P.liberados;
      item(livre ? `Capítulo ${c.n} — ${c.titulo}` : `Capítulo ${c.n} — página ainda presa`, livre, () => abrirCapitulo(c.n), livre && !P.abertos[c.n]);
    }
    if (P.final) item('Fim do caderno', true, fim);
    $('#sumario').hidden = false; $('#fechar-sumario').focus();
    if (vista === 'porao') falaJogo('pausa');
  }
  function fecharSumario() { $('#sumario').hidden = true; if (vista === 'porao') falaJogo('continua'); }
  $('#abrir-sumario').addEventListener('click', abrirSumario);
  $('#fechar-sumario').addEventListener('click', fecharSumario);
  $('#sumario').addEventListener('click', (e) => { if (e.target.id === 'sumario') fecharSumario(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#sumario').hidden) fecharSumario(); });
  $('#ir-porao').addEventListener('click', mostrarPorao);

  // ——— aviso (sempre a primeira tela) ———
  document.querySelectorAll('#aviso .surge').forEach((n, i) => { n.style.animationDelay = (0.4 + i * 1.1) + 's'; });
  if (P.fase !== 'nota' || P.liberados) $('.recomecar').hidden = false;
  $('#entrar').addEventListener('click', () => {
    audio(); estalo();
    $('#aviso').hidden = true; $('#livro').hidden = false;
    $('#paginas').textContent = P.paginas + ' Páginas'; atualizaSelo(); medirBarra();
    if (P.fase === 'nota') nota();
    else if (P.fase === 'fita') fita();
    else if (P.fase === 'fim') fim();
    else mostrarPorao();
  });
  $('#recomecar').addEventListener('click', () => { P = novo(); salvar(); $('.recomecar').hidden = true; });
})();
