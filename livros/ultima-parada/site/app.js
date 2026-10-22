/* Última Parada — o livro e o porão juntos.
   Abertura: aviso → capítulo 1 → a fita → capítulo 2 → o porão, no escuro.
   No porão (o escape room, em porao/index.html?livro=1), cada marco solta um capítulo:
     a luz acende → 3 · o cadeado ROTA → 4 · a senha 0606 → 5 · a caixa de chumbo → 6 ·
     o receptor da oficina em 23.10 → 7 · a estante gira → 8 · 05h10, a caixa no ônibus → 9, que abre sozinho → 10 → fim.
   Enquanto a pessoa lê, o relógio e o som do porão param.
   As secretárias eletrônicas têm play: as falas marcadas com {v:id} tocam audio/<id>.mp3 (os mesmos do jogo). */
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
  const ORDEM = ['luz', 'rota', 'pai', 'caixa', 'radio', 'estante', 'fim']; // marcos que soltam os capítulos 3 a 9
  const PRIMEIRO_DO_PORAO = 3;
  const MAXIMO = PONTOS.ler * CAPS.length + PONTOS.marco * ORDEM.length + PONTOS.fita + PONTOS.final; // 160
  const CUPOM = [[145, 15], [125, 10]];
  const CENAS = {
    3: 'A lâmpada acende, amarela, zumbindo. No canto, a luzinha vermelha da secretária começa a piscar. De dentro da bíblia escorregam três folhas dobradas.',
    4: 'O cadeado abre com um estalo que você sente nos dentes. Na gaveta de cima, um diário de capa verde, com elástico.',
    5: 'A tela verde aceita a senha e começa a escrever sozinha, uma linha de cada vez.',
    6: 'Onze quilos de chumbo, frios. Na porta da oficina, pregado com uma tachinha, um bilhete.',
    7: 'As válvulas acendem laranja. Em 23.10, por baixo do chiado, pontos e traços. Depois, uma voz de moça diz o seu nome.',
    8: 'A estante gira para dentro da parede. Um ar frio vem do corredor. No chão, uma página molhada.',
  };
  const CHAVE = 'ultima-parada:livro:2';
  const novo = () => ({ fase: 'cap1', liberados: 1, marcos: {}, lidos: {}, abertos: {}, paginas: 0, fita: false, final: false, claro: false });
  let P = novo();
  try { const s = JSON.parse(localStorage.getItem(CHAVE)); if (s && s.fase) P = Object.assign(novo(), s); } catch (e) { /* sem armazenamento */ }
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(P)); } catch (e) { /* segue sem salvar */ } };
  function ganhar(n) {
    P.paginas += n; salvar();
    const b = $('#paginas'); b.textContent = P.paginas + ' Páginas';
    b.classList.remove('ganhou'); void b.offsetWidth; b.classList.add('ganhou');
  }
  function liberar(n) { if (n > P.liberados) { P.liberados = n; salvar(); atualizaSelo(); } }
  const naoLido = () => { for (let n = 1; n <= P.liberados; n++) if (!P.abertos[n]) return n; return 0; };
  const atualizaSelo = () => { $('#selo').hidden = !naoLido(); };
  const titulo = (n) => { const c = CAPS.find(x => x.n === n); return c ? c.titulo : ''; };

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

  // ——— a microfita (o play das secretárias) ———
  let VOZES = new Set();
  fetch('audio/manifest.json').then(r => r.ok ? r.json() : []).then(l => { VOZES = new Set(l); }).catch(() => {});
  let tocando = null;
  function pararFita() {
    if (!tocando) return;
    const t = tocando; tocando = null;
    clearTimeout(t.timer); if (t.audio) { t.audio.pause(); t.audio = null; }
    if (t.chiado) { try { t.chiado.stop(); } catch (e) { /* já parou */ } }
    t.falas.forEach(f => f.classList.remove('tocando'));
    if (t.botao.parentElement) t.botao.parentElement.classList.remove('em-play');
    t.botao.classList.remove('tocando'); t.botao.querySelector('.ouvir-rotulo').textContent = 'Ouvir de novo';
  }
  // sons gravados (bipe, chiado, telefone): decodificados uma vez
  const SONS = {};
  function somGravado(id) {
    const c = audio();
    if (!c || !VOZES.has(id)) return Promise.resolve(null);
    return SONS[id] = SONS[id] || fetch('audio/' + id + '.mp3').then(r => r.arrayBuffer()).then(a => c.decodeAudioData(a)).catch(() => null);
  }
  function tocarBuf(c, b, vol = 1) { const s = c.createBufferSource(), g = c.createGain(); s.buffer = b; g.gain.value = vol; s.connect(g).connect(c.destination); s.start(); return s; }
  function bip(c, b) {
    if (b) return tocarBuf(c, b);
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
    o.frequency.value = 1050; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
    g.gain.setValueAtTime(0.12, t + 0.32); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.36);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.4);
  }
  // falas que já vêm com o som da microfita (ou são o próprio telefone): tocam como estão, sem filtro e sem o chiado de fundo
  const CRU = /^(ceci-saudacao|ceci-recado|odete-recado|sec-|telefone-|bip|chiado)/;
  const CHIADO_BASE = 0.035;
  function tocarMicrofita(botao) {
    if (tocando) { const era = tocando.botao; pararFita(); if (era === botao) return; }
    const c = audio();
    const falas = []; let n = botao.nextElementSibling;
    while (n) { if (n.tagName === 'P') falas.push(n); n = n.nextElementSibling; }
    const t = { botao, falas, timer: 0, audio: null, chiado: null, bip: null };
    tocando = t;
    botao.classList.add('tocando'); botao.querySelector('.ouvir-rotulo').textContent = 'Parar';
    if (botao.parentElement) botao.parentElement.classList.add('em-play');
    const chiadoEm = (v, tc = 0.05) => { if (c && t.ganhoChiado) t.ganhoChiado.gain.setTargetAtTime(v, c.currentTime, tc); };
    let i = 0;
    const proxima = () => {
      if (tocando !== t) return;
      falas.forEach(f => f.classList.remove('tocando'));
      if (i >= falas.length) { pararFita(); return; }
      const f = falas[i++]; f.classList.add('tocando');
      f.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      const texto = f.textContent, v = f.dataset.v, temBip = /\[BIP\]/.test(texto);
      if (c && temBip) bip(c, t.bip);
      const espera = Math.max(1400, texto.length * 55);
      if (v && VOZES.has(v) && c) {
        const a = new Audio('audio/' + v + '.mp3'); t.audio = a;
        const cru = CRU.test(v);
        try {
          const src = c.createMediaElementSource(a);
          if (cru) src.connect(c.destination);
          else {
            const hp = c.createBiquadFilter(), lp = c.createBiquadFilter();
            hp.type = 'highpass'; hp.frequency.value = 350; lp.type = 'lowpass'; lp.frequency.value = 3400;
            src.connect(hp).connect(lp).connect(c.destination);
          }
        } catch (e) { /* toca direto */ }
        a.onended = () => { t.audio = null; chiadoEm(CHIADO_BASE, 0.08); t.timer = setTimeout(proxima, 450); };
        a.onerror = () => { t.audio = null; chiadoEm(CHIADO_BASE, 0.08); t.timer = setTimeout(proxima, espera); };
        const comecar = () => { if (t.audio !== a) return; if (cru) chiadoEm(0.0001); a.play().catch(() => { t.timer = setTimeout(proxima, espera); }); };
        if (temBip) t.timer = setTimeout(comecar, t.bip ? t.bip.duration * 1000 + 80 : 420); else comecar();
      } else {
        if (c && /grito|corta seco/.test(texto)) {          // o chiado engole
          chiadoEm(0.22); t.ganhoChiado && t.ganhoChiado.gain.setTargetAtTime(CHIADO_BASE, c.currentTime + 0.9, 0.3);
        } else if (/chiado/.test(texto)) {                   // um trecho só de chiado
          chiadoEm(0.09, 0.2); t.ganhoChiado && t.ganhoChiado.gain.setTargetAtTime(CHIADO_BASE, c.currentTime + espera / 1000 - 0.4, 0.15);
        }
        t.timer = setTimeout(proxima, espera);
      }
    };
    const comecarFita = (chiadoBuf, bipBuf) => {
      if (tocando !== t) return;
      t.bip = bipBuf;
      if (c) {                                   // o chiado da microfita, por baixo de tudo (o gravado, em loop; senão, sintetizado)
        const s = c.createBufferSource(), g = c.createGain();
        s.buffer = chiadoBuf || ruidoBuf; s.loop = true; g.gain.value = CHIADO_BASE;
        if (chiadoBuf) { const pre = c.createGain(); pre.gain.value = 8.6; s.connect(pre).connect(g); }   // o gravado é mais baixo: −30 dB → −40 dB, como o sintetizado
        else { const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2600; f.Q.value = 0.5; s.connect(f).connect(g); }
        g.connect(c.destination); s.start(); t.chiado = s; t.ganhoChiado = g;
      }
      t.timer = setTimeout(proxima, 600);
    };
    Promise.all([somGravado('chiado-microfita'), somGravado('bip')]).then(([ch, bp]) => comecarFita(ch, bp), () => comecarFita(null, null));
  }
  function botaoOuvir() {
    const b = el('button', { type: 'button', class: 'ouvir' },
      el('span', { class: 'microfita', 'aria-hidden': 'true' }, el('i'), el('i')),
      el('span', { class: 'ouvir-rotulo' }, 'Ouvir a microfita'));
    b.addEventListener('click', () => tocarMicrofita(b));
    return b;
  }

  // ——— o porão (o escape room) ———
  let jogo = null;
  const falaJogo = (acao) => { if (jogo && jogo.contentWindow) jogo.contentWindow.postMessage({ ultimaParada: true, acao }, '*'); };
  function mostrarPorao() {
    if (P.fase === 'cap1' || P.fase === 'fita' || P.fase === 'cap2') { P.fase = 'porao'; salvar(); }
    if (!jogo) {
      jogo = el('iframe', { src: 'porao/index.html?livro=1', title: 'O porão', allow: 'autoplay; fullscreen' });
      $('#porao').append(jogo);
    }
    vista = 'porao'; pararLeitura(); pararFita();
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
    if (d.falhou) falhou();
  });
  // ——— o fim ruim: deu 05h10 no porão ———
  // tela preta, chiado, VOCÊ FALHOU por 3 segundos, e o livro volta ao começo, sem explicação
  function falhou() {
    pararLeitura(); pararFita();
    if (jogo) { jogo.remove(); jogo = null; }
    P = novo(); salvar();
    const tela = el('div', { class: 'falhou', role: 'alert', 'aria-label': 'Você falhou' }, el('p', null, 'VOCÊ', el('br'), 'FALHOU'));
    document.body.append(tela);
    // o susto: o grito gravado (grito-falhou), se existir; senão o jumpscare da fita
    const susto = new Audio(VOZES.has('grito-falhou') ? 'audio/grito-falhou.mp3' : 'sons/jumpscare.mp3'); susto.volume = 1;
    susto.play().catch(() => { ruido(0.9, 0.4, 2600); });
    ruido(0.5, 0.3, 1800);
    setTimeout(() => { location.reload(); }, 3000);
  }
  function registrarMarco(k) {
    if (P.marcos[k] || !ORDEM.includes(k)) return;
    P.marcos[k] = true;
    let n = 0; while (n < ORDEM.length && P.marcos[ORDEM[n]]) n++;   // os capítulos saem em ordem
    const ate = n ? PRIMEIRO_DO_PORAO + n - 1 : 0, antes = P.liberados;
    if (ate <= antes) { salvar(); return; }
    liberar(ate);
    for (let i = antes; i < ate; i++) ganhar(PONTOS.marco);
    paginaSolta(Math.max(antes + 1, PRIMEIRO_DO_PORAO), ate);
  }
  function paginaSolta(de, ate) {
    falaJogo('pausa'); papel();
    if (ate === 9) { P.fase = 'fim'; salvar(); setTimeout(() => abrirCapitulo(de <= 8 ? de : 9), 1400); return; }
    $('#solta-cena').textContent = CENAS[ate];
    $('#solta-titulo').textContent = de === ate ? `Capítulo ${de} — ${titulo(de)}` : `Capítulos ${de} a ${ate}`;
    $('#solta').hidden = false; $('#solta-ler').focus();
    $('#solta-ler').onclick = () => { $('#solta').hidden = true; abrirCapitulo(de); };
    $('#solta-depois').onclick = () => { $('#solta').hidden = true; falaJogo('continua'); };
  }

  // ——— vistas ———
  let vista = 'cap1', timerLeitura = 0, observador = null;
  const pagina = $('#pagina');
  const VERMELHAS = ['cap1', 'fita', 'cap2', 'porao'];
  function aplicarTema(v) {
    const vermelho = VERMELHAS.includes(v);
    document.body.classList.toggle('tema-vermelho', vermelho);
    document.body.classList.toggle('tema-leitura', !vermelho);
    document.body.classList.toggle('claro', !vermelho && P.claro);
    const t = $('#tema'); t.textContent = P.claro ? 'Fundo escuro' : 'Fundo claro'; t.setAttribute('aria-pressed', String(P.claro));
  }
  $('#tema').addEventListener('click', () => { P.claro = !P.claro; salvar(); aplicarTema(vista); });
  function pararLeitura() { clearTimeout(timerLeitura); if (observador) observador.disconnect(); }
  function abrirPagina(v) {
    sairDoPorao(); pararLeitura(); pararFita();
    vista = v; aplicarTema(v); pagina.innerHTML = '';
    window.scrollTo(0, 0); pagina.focus({ preventScroll: true });
  }
  const botao = (rotulo, fn, cheio) => el('button', { class: 'botao continuar' + (cheio ? ' cheio' : ''), type: 'button', onclick: fn }, rotulo);

  // ——— a fita ———
  function fita() {
    if (P.fase === 'cap1') { P.fase = 'fita'; salvar(); }
    abrirPagina('fita');
    const a = el('article');
    a.append(el('header', { class: 'cap-cabeca' }, el('span', { class: 'cap-numero' }, 'A fita'), el('h1', { class: 'cap-titulo' }, 'JUN. 7 1996')));
    a.append(el('p', { class: 'nota' }, '[A fita estava no envelope, sem etiqueta. É uma fita de filmadora. O relógio dela começa à 01h31 de 7 de junho de 1996. O que segue é tudo o que ainda se pode ver. — Estúdio]'));
    const tela = el('div', { class: 'tv-tela' }, el('div', { class: 'chuvisco' }, 'SEM SINAL'));
    const tv = el('div', { class: 'tv' }, tela, el('span', { class: 'tv-marca' }, 'COLOR 20'), el('span', { class: 'tv-led' }));
    const colocar = el('button', { class: 'fita', type: 'button' }, el('span', { class: 'fita-icone', 'aria-hidden': 'true' }), 'Colocar a fita');
    const depois = el('div');
    const seguir = () => botao('Continuar a leitura', () => { liberar(2); if (P.fase === 'fita') { P.fase = 'cap2'; salvar(); } abrirCapitulo(2); }, true);
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
      liberar(2);
      depois.innerHTML = '';
      depois.append(el('p', { class: 'nota' }, '[Fim do que se pode ver. O resto da fita é chiado. Uma das cenas, a da casa, é a casa onde hoje fica o sebo. — Estúdio]'), seguir());
    }
    a.append(tv, colocar, depois);
    if (P.fita) depois.append(seguir());
    pagina.append(a);
  }

  // ——— capítulos ———
  function montarBlocos(a, blocos) {
    let doc = null;
    for (const b of blocos) {
      let alvo = a;
      if (b.dentro) { if (!doc) { doc = el('div', { class: 'documento' }); a.append(doc); } alvo = doc; } else doc = null;
      if (b.tipo === 'tela') alvo.append(telaCP500(b.texto));
      else if (b.tipo === 'ouvir') alvo.append(botaoOuvir());
      else {
        const p = el('p', { class: b.classe || '', html: b.html });
        if (b.v) p.dataset.v = b.v;
        alvo.append(p);
      }
    }
  }
  function abrirCapitulo(n) {
    if (n > P.liberados) return;
    abrirPagina(n <= 2 ? 'cap' + n : 'cap');
    if (!P.abertos[n]) { P.abertos[n] = true; salvar(); atualizaSelo(); }
    const c = CAPS.find(x => x.n === n); if (!c) return;
    const a = el('article');
    a.append(el('header', { class: 'cap-cabeca' }, el('span', { class: 'cap-numero' }, 'Capítulo ' + n), el('h1', { class: 'cap-titulo' }, c.titulo)));
    montarBlocos(a, c.blocos);
    const marca = el('p', { class: 'fim-cap', 'aria-hidden': 'true' }, '· · ·');
    a.append(marca);
    pagina.append(a);
    const acoes = el('div', { class: 'acoes', style: 'justify-content:center' });
    const prox = naoLido();
    if (P.fase === 'fim' && P.final) {
      if (n < P.liberados) acoes.append(botao(`Capítulo ${n + 1}`, () => abrirCapitulo(n + 1)));
      acoes.append(botao('Voltar ao fim', fim, true));
    } else if (n === 1) acoes.append(botao('Colocar a fita', fita, true));
    else if (n === 2) acoes.append(botao('Descer ao porão', mostrarPorao, true));
    else if (n === 9) acoes.append(botao('Virar a página', () => { liberar(10); abrirCapitulo(10); }, true));
    else if (n === 10) acoes.append(botao('Fechar o envelope', fim, true));
    else if (P.marcos.fim) acoes.append(botao(prox && prox !== n ? `Ler o capítulo ${prox}` : 'Voltar ao capítulo 9', () => abrirCapitulo(prox && prox !== n ? prox : 9), true));
    else {
      if (prox && prox !== n) acoes.append(botao(`Ler o capítulo ${prox}`, () => abrirCapitulo(prox)));
      acoes.append(botao('Voltar ao porão', mostrarPorao, true));
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
        timerLeitura = setTimeout(() => { if (pagina.querySelector('.cap-numero') && pagina.querySelector('.cap-numero').textContent === 'Capítulo ' + n && !P.lidos[n]) { P.lidos[n] = true; ganhar(PONTOS.ler); const av = $('.aviso-pressa'); if (av) av.remove(); } }, falta);
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
    if (!P.final) { P.final = true; P.fase = 'fim'; liberar(10); ganhar(PONTOS.final); }
    if (jogo) { jogo.remove(); jogo = null; }
    abrirPagina('fim'); $('#ir-porao').hidden = true;
    const faixa = CUPOM.find(([min]) => P.paginas >= min), desconto = faixa ? faixa[1] : 0;
    const a = el('article', { class: 'fim' });
    a.append(el('header', { class: 'cap-cabeca' }, el('span', { class: 'cap-numero' }, 'Fim do envelope'), el('h1', { class: 'cap-titulo' }, 'Última Parada')));
    a.append(el('p', null, 'Você leu tudo o que havia no envelope.'));
    a.append(el('p', { class: 'fim-pontos' }, P.paginas + ' Páginas'), el('p', null, 'de ' + MAXIMO + ' possíveis'));
    if (desconto) a.append(el('p', null, `Suas Páginas valem ${desconto}% de desconto no próximo Diver Livro.`), el('p', { class: 'cupom' }, `ULTIMAPARADA${desconto}`));
    else a.append(el('p', null, `Com ${CUPOM[1][0]} Páginas, o próximo Diver Livro sai com 10% de desconto. Releia sem pressa: o envelope inteiro está no menu Envelope.`));
    a.append(el('p', { class: 'nota' }, '[Não pedimos que ninguém acredite. — Estúdio]'));
    a.append(el('div', { class: 'acoes', style: 'justify-content:center' }, el('button', { class: 'botao', type: 'button', onclick: abrirSumario }, 'Reler o envelope')));
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
    for (const c of CAPS) {
      const livre = c.n <= P.liberados;
      item(livre ? `Capítulo ${c.n} — ${c.titulo}` : `Capítulo ${c.n} — página ainda presa`, livre, () => abrirCapitulo(c.n), livre && !P.abertos[c.n]);
      if (c.n === 1) item('A fita — JUN. 7 1996', P.fase !== 'cap1', fita);
    }
    if (P.final) item('Fim do envelope', true, fim);
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
  if (P.fase !== 'cap1' || P.abertos[1]) $('.recomecar').hidden = false;
  $('#entrar').addEventListener('click', () => {
    audio(); estalo();
    $('#aviso').hidden = true; $('#livro').hidden = false;
    $('#paginas').textContent = P.paginas + ' Páginas'; atualizaSelo(); medirBarra();
    if (P.fase === 'cap1') abrirCapitulo(1);
    else if (P.fase === 'fita') fita();
    else if (P.fase === 'cap2') abrirCapitulo(2);
    else if (P.fase === 'fim') { if (P.final) fim(); else abrirCapitulo(Math.min(P.liberados, 9)); }
    else mostrarPorao();
  });
  $('#recomecar').addEventListener('click', () => { P = novo(); salvar(); $('.recomecar').hidden = true; });
})();
