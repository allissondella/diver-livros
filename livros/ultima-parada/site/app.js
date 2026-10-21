/* Última Parada — o motor do livro.
   Etapas: aviso → nota do estúdio → cap. 1 → a fita → vínculo 1 → cap. 2 → vínculo 2 → … → cap. 6 → fim.
   Cada capítulo lido dá Páginas; cada vínculo (a descoberta no porão ligada ao texto) abre o capítulo seguinte. */
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

  // ——— Páginas (pontos) ———
  const PONTOS = { ler: 10, vinculo: 5, fita: 5, final: 20, semDica: 15 };
  const MAXIMO = PONTOS.ler * 6 + PONTOS.vinculo * 5 + PONTOS.fita + PONTOS.final + PONTOS.semDica; // 130
  const ETAPAS = ['nota', 'cap1', 'fita', 'v1', 'cap2', 'v2', 'cap3', 'v3', 'cap4', 'v4', 'cap5', 'v5', 'cap6', 'fim'];
  const VERMELHO = new Set(['nota', 'cap1', 'fita', 'v1']);
  const CHAVE = 'ultima-parada:progresso';
  const novo = () => ({ etapa: 0, paginas: 0, lidos: {}, vinculos: {}, dicas: {}, fita: false, final: false, claro: false });
  let P = novo();
  try { const s = JSON.parse(localStorage.getItem(CHAVE)); if (s && typeof s.etapa === 'number') P = Object.assign(novo(), s); } catch (e) { /* sem armazenamento: começa do zero */ }
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(P)); } catch (e) { /* segue sem salvar */ } };

  function ganhar(n) {
    P.paginas += n; salvar();
    const b = $('#paginas'); b.textContent = P.paginas + ' Páginas';
    b.classList.remove('ganhou'); void b.offsetWidth; b.classList.add('ganhou');
  }

  // ——— som ———
  let ctx = null, ruidoBuf = null;
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
  function estalo(dur = 0.35, vol = 0.25) { // chiado curto de erro
    const c = audio(); if (!c) return;
    const s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
    s.buffer = ruidoBuf; f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.7;
    g.gain.setValueAtTime(vol, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    s.connect(f).connect(g).connect(c.destination); s.start(); s.stop(c.currentTime + dur);
  }
  let bufFita = null;
  function somFita() { // a fita entrando no videocassete
    const c = audio(); if (!c) return;
    const tocar = (b) => { const s = c.createBufferSource(), g = c.createGain(); g.gain.value = 3; s.buffer = b; s.connect(g).connect(c.destination); s.start(); };
    if (bufFita) return tocar(bufFita);
    fetch('sons/fita-entrando.mp3').then(r => r.arrayBuffer()).then(a => c.decodeAudioData(a)).then(b => { bufFita = b; tocar(b); }).catch(() => {});
  }

  // ——— tema ———
  function aplicarTema(etapa) {
    const vermelho = VERMELHO.has(etapa);
    document.body.classList.toggle('tema-vermelho', vermelho);
    document.body.classList.toggle('tema-leitura', !vermelho);
    document.body.classList.toggle('claro', !vermelho && P.claro);
    const t = $('#tema'); t.textContent = P.claro ? 'Fundo escuro' : 'Fundo claro'; t.setAttribute('aria-pressed', String(P.claro));
  }
  $('#tema').addEventListener('click', () => { P.claro = !P.claro; salvar(); aplicarTema(atual); });

  // ——— navegação ———
  let atual = 'nota', timerLeitura = 0, observador = null;
  const pagina = $('#pagina');
  function ir(etapa) {
    atual = etapa; clearTimeout(timerLeitura); if (observador) observador.disconnect();
    aplicarTema(etapa); pagina.innerHTML = '';
    window.scrollTo(0, 0); pagina.focus({ preventScroll: true });
    if (etapa === 'nota') return nota();
    if (etapa === 'fita') return fita();
    if (etapa === 'fim') return fim();
    if (etapa.startsWith('cap')) return capitulo(+etapa.slice(3));
    if (etapa.startsWith('v')) return VINCULOS[etapa]();
  }
  function avancar() {
    const i = ETAPAS.indexOf(atual);
    if (i >= P.etapa) { P.etapa = i + 1; salvar(); }
    ir(ETAPAS[Math.min(i + 1, ETAPAS.length - 1)]);
  }
  const continuar = (rotulo, fn) => el('button', { class: 'botao continuar', type: 'button', onclick: fn || avancar }, rotulo || 'Continuar');
  const relendo = () => ETAPAS.indexOf(atual) < P.etapa;
  function botaoFim(rotulo) {
    return relendo() ? continuar('Voltar para onde parei', () => ir(ETAPAS[P.etapa])) : continuar(rotulo);
  }

  // ——— nota do estúdio ———
  function nota() {
    const a = el('article');
    a.append(el('header', { class: 'cap-cabeca' }, el('h1', { class: 'cap-titulo' }, 'Nota do estúdio')));
    [
      'Como estes papéis foram postos em ordem ficará claro na leitura. Todas as partes inúteis foram tiradas, para que uma história que não cabe bem no que se sabe hoje seja apresentada como simples fato. Não há nela nenhuma lembrança de coisas antigas em que a memória possa errar: todas as anotações escolhidas foram feitas na hora, por quem estava lá, sabendo só o que sabia naquele momento.',
      'O caderno chegou ao nosso estúdio em abril de 2026, trazido por um amigo, dono de um sebo na Rua Monte Alegre, em Perdizes. Ele o encontrou numa prateleira do fundo da loja, amarrado com barbante a uma bíblia, ao lado de uma fita VHS sem etiqueta. Não se lembra de tê-lo recebido. As câmeras de segurança, que gravam a porta e o balcão, não registraram ninguém deixando o pacote. A bíblia é uma edição comum, de 1961, com um nome na primeira página. A fita tem trinta e dois minutos gravados, e quase tudo é chiado; o que ainda se pode ver está no fim do primeiro capítulo.',
      'O sebo funciona no térreo de um sobrado. Nas páginas que seguem, esse sobrado é chamado de “a casa”.',
      'As entradas do caderno são de uma moça de dezoito anos. Dentro dele, copiados com a letra dela, estão trechos de cadernos mais antigos, que ela encontrou na casa. Mantivemos as datas como ela anotou. As transcrições das fitas são nossas, e estão marcadas.',
      'Não pedimos que ninguém acredite.',
    ].forEach(t => a.append(el('p', null, t)));
    a.append(el('p', { class: 'doc' }, 'Estúdio Diver, São Paulo, 2026'));
    pagina.append(a, botaoFim('Abrir o caderno'));
  }

  // ——— capítulos ———
  function capitulo(n) {
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
    const prox = { 1: 'Continuar', 6: 'Continuar' }[n] || 'Ir ao porão';
    pagina.append(botaoFim(prox));
    // Páginas por leitura: só conta se a pessoa ficou tempo suficiente para ler (uns 600 palavras por minuto, no mínimo)
    if (!P.lidos[n]) {
      const t0 = Date.now(), minimo = c.palavras * 100;
      observador = new IntersectionObserver((es) => {
        if (!es.some(e => e.isIntersecting)) return;
        observador.disconnect();
        const falta = Math.max(0, minimo - (Date.now() - t0));
        if (falta > 0) pagina.insertBefore(el('p', { class: 'aviso-pressa' }, '[As Páginas deste capítulo contam para quem leu. Fique mais um pouco.]'), marca.nextSibling);
        timerLeitura = setTimeout(() => { if (atual === 'cap' + n && !P.lidos[n]) { P.lidos[n] = true; ganhar(PONTOS.ler); const av = $('.aviso-pressa'); if (av) av.remove(); } }, falta);
      });
      observador.observe(marca);
    }
  }
  function telaCP500(texto) {
    const t = el('div', { class: 'cp500', role: 'document', 'aria-label': 'Tela do computador CP-500' });
    const linhas = texto.split('\n');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { t.textContent = texto; return t; }
    let i = 0;
    const passo = () => { if (i >= linhas.length) return; t.textContent += (i ? '\n' : '') + linhas[i++]; setTimeout(passo, 28); };
    setTimeout(passo, 400);
    return t;
  }

  // ——— a fita ———
  function fita() {
    const a = el('article');
    a.append(el('header', { class: 'cap-cabeca' }, el('span', { class: 'cap-numero' }, 'A fita'), el('h1', { class: 'cap-titulo' }, 'JUN. 7 1996')));
    a.append(el('p', { class: 'nota' }, '[A fita estava junto do caderno, sem etiqueta. O relógio da filmadora começa à 01h31 de 7 de junho de 1996. O que segue é tudo o que ainda se pode ver. — Estúdio]'));
    const tela = el('div', { class: 'tv-tela' }, el('div', { class: 'chuvisco' }, 'SEM SINAL'));
    const tv = el('div', { class: 'tv' }, tela, el('span', { class: 'tv-marca' }, 'COLOR 20'), el('span', { class: 'tv-led' }));
    const botaoFitaEl = el('button', { class: 'fita', type: 'button' }, el('span', { class: 'fita-icone', 'aria-hidden': 'true' }), 'Colocar a fita');
    const depois = el('div');
    botaoFitaEl.addEventListener('click', () => {
      botaoFitaEl.disabled = true; botaoFitaEl.classList.add('entrando'); somFita();
      setTimeout(() => {
        tv.classList.add('ligada');
        const v = el('video', { playsinline: '', preload: 'auto' },
          el('source', { src: 'video/fita-ida.mp4', type: 'video/mp4' }),
          el('source', { src: 'video/fita-ida.webm', type: 'video/webm' }));
        tela.innerHTML = ''; tela.append(v);
        v.addEventListener('ended', terminou);
        v.addEventListener('click', () => { if (v.requestFullscreen) v.requestFullscreen().catch(() => {}); });
        const p = v.play(); if (p && p.catch) p.catch(() => { v.controls = true; });
        botaoFitaEl.remove();
      }, 1300);
    });
    function terminou() {
      tv.classList.remove('ligada');
      if (!P.fita) { P.fita = true; ganhar(PONTOS.fita); }
      depois.innerHTML = '';
      depois.append(el('p', { class: 'nota' }, '[Fim do que se pode ver. O resto da fita é chiado. — Estúdio]'),
        el('div', { class: 'acoes' }, el('button', { class: 'botao', type: 'button', onclick: () => ir('fita') }, 'Ver de novo')),
        botaoFim('Descer ao porão'));
    }
    a.append(tv, botaoFitaEl, depois);
    if (P.fita) depois.append(el('div', { class: 'acoes' }), botaoFim('Descer ao porão'));
    pagina.append(a);
  }

  // ——— vínculos ———
  function vinculo(cfg) {
    const id = cfg.id, caixa = el('section', { class: 'vinculo', 'aria-labelledby': id + '-t' });
    let erros = 0;
    const retorno = el('p', { class: 'vinculo-retorno', role: 'status', 'aria-live': 'polite' });
    const dicaEl = el('p', { class: 'vinculo-dica', hidden: '' }, cfg.dica);
    const ajuda = el('button', { class: 'link', type: 'button', onclick: () => mostrarDica() }, 'preciso de uma pista');
    function mostrarDica() { dicaEl.hidden = false; ajuda.remove(); if (!P.vinculos[id]) { P.dicas[id] = true; salvar(); } }
    function erro(msg) {
      erros++; retorno.classList.remove('certo'); retorno.textContent = msg; estalo();
      caixa.classList.remove('tremer'); void caixa.offsetWidth; caixa.classList.add('tremer');
      if (erros >= 2) mostrarDica();
    }
    function ok() {
      if (!P.vinculos[id]) { P.vinculos[id] = true; if (!P.dicas[id]) ganhar(PONTOS.vinculo); salvar(); }
      retorno.classList.add('certo'); retorno.textContent = cfg.sucesso;
      corpo.querySelectorAll('button, input').forEach(b => { b.disabled = true; });
      ajuda.remove();
      caixa.append(continuar(cfg.abre));
      setTimeout(() => caixa.lastChild.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    }
    const corpo = el('div');
    caixa.append(el('p', { class: 'vinculo-rotulo' }, cfg.rotulo), el('h3', { id: id + '-t' }, cfg.titulo), el('p', { html: cfg.texto }), corpo, retorno, dicaEl, el('p', null, ajuda));
    const a = el('article');
    a.append(el('header', { class: 'cap-cabeca' }, el('span', { class: 'cap-numero' }, cfg.lugar), el('h1', { class: 'cap-titulo' }, cfg.cabeca)));
    if (cfg.intro) a.append(el('p', { class: 'nota', html: cfg.intro }));
    a.append(caixa);
    pagina.append(a);
    cfg.montar(corpo, ok, erro);
    if (P.vinculos[id]) { // já resolvido: mostra resolvido e deixa seguir
      retorno.classList.add('certo'); retorno.textContent = cfg.sucesso; ajuda.remove();
      corpo.querySelectorAll('button, input').forEach(b => { b.disabled = true; });
      caixa.append(relendo() && ETAPAS.indexOf(atual) + 1 < P.etapa ? continuar('Voltar para onde parei', () => ir(ETAPAS[P.etapa])) : continuar(cfg.abre));
    }
  }

  const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const MORSE = { '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', 'A': '.-' };

  const VINCULOS = {
    v1: () => vinculo({
      id: 'v1', lugar: 'O porão', cabeca: 'A cômoda', rotulo: 'Decifrar',
      intro: '[Você desce a escada. O quinto degrau não range. A lanterna acha a cômoda, o relógio parado às onze e dez, a lata embaixo do cano.]',
      titulo: 'A gaveta de cima tem um cadeado de quatro letras.',
      texto: 'Cecília escreveu que ia tentar quando voltasse.',
      dica: '[Na folha de Marina, uma palavra está sublinhada duas vezes.]',
      sucesso: 'O cadeado abre. Dentro da gaveta, embaixo do forro, um diário de capa verde, com elástico.',
      abre: 'Abrir o diário',
      montar(corpo, ok, erro) {
        const idx = [0, 0, 0, 0];
        const saidas = [];
        const cad = el('div', { class: 'cadeado' });
        idx.forEach((_, i) => {
          const out = el('output', { 'aria-label': 'letra ' + (i + 1) }, 'A'); saidas.push(out);
          const muda = (d) => { idx[i] = (idx[i] + d + 26) % 26; out.textContent = LETRAS[idx[i]]; };
          cad.append(el('div', { class: 'roda' },
            el('button', { type: 'button', 'aria-label': 'letra anterior', onclick: () => muda(-1) }, '▲'), out,
            el('button', { type: 'button', 'aria-label': 'próxima letra', onclick: () => muda(1) }, '▼')));
        });
        const abrir = el('button', { class: 'botao cheio', type: 'button', onclick: () => {
          const w = idx.map(i => LETRAS[i]).join('');
          if (w === 'ROTA') ok(); else erro(['Não abre.', 'O cadeado não cede.', 'Nada. A gota cai na lata.'][Math.min(2, Math.floor(Math.random() * 3))]);
        } }, 'Abrir');
        corpo.append(cad, el('div', { class: 'acoes' }, abrir));
      },
    }),

    v2: () => vinculo({
      id: 'v2', lugar: 'O porão', cabeca: 'O rádio de pilha', rotulo: 'Ouvir',
      intro: '[Na estante, o rádio de pilha. O lugar das pilhas está vazio. No canto, o computador, apagado.]',
      titulo: 'Gire o dial. Alguém está chamando.',
      texto: 'Aurélio anotou a faixa. Marina ouviu de novo, dez anos depois.',
      dica: '[Caderno 5: “Na faixa 23.10 tem um sinal que repete.” Marina: “A senha é a data que ele marcou.”]',
      sucesso: 'A tela verde pisca. Na impressora ao lado, o formulário contínuo começa a correr.',
      abre: 'Ler o arquivo',
      montar(corpo, ok, erro) {
        const mostrador = el('div', { class: 'radio-mostrador', 'aria-live': 'off' }, '15.00');
        const dial = el('input', { type: 'range', min: '1500', max: '3000', step: '5', value: '1500', 'aria-label': 'dial do rádio, de 15 a 30' });
        corpo.append(el('div', { class: 'radio' }, mostrador, dial, el('div', { class: 'radio-escala' }, el('span', null, '15'), el('span', null, '20'), el('span', null, '25'), el('span', null, '30'))));
        const cp = el('div', { class: 'cp500', hidden: '' });
        corpo.append(cp);
        let ruido = null, ganhoRuido = null, ganhoMorse = null, osc = null, laco = 0, sintonizado = false, abriuCP = false;
        function liga() {
          const c = audio(); if (!c || ruido) return;
          ruido = c.createBufferSource(); ruido.buffer = ruidoBuf; ruido.loop = true;
          const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 0.5;
          ganhoRuido = c.createGain(); ganhoRuido.gain.value = 0.12;
          ruido.connect(f).connect(ganhoRuido).connect(c.destination); ruido.start();
          osc = c.createOscillator(); osc.frequency.value = 640; ganhoMorse = c.createGain(); ganhoMorse.gain.value = 0;
          osc.connect(ganhoMorse).connect(c.destination); osc.start();
        }
        function morse() { // 06 06 96 · 23 10 · 875A 10 — o sinal sabe que ano é
          const c = audio(); if (!c) return 0;
          const u = 0.075; let t = c.currentTime + 0.2;
          for (const grupo of ['06', '06', '96', '23', '10', '875A', '10']) {
            for (const ch of grupo) {
              for (const s of MORSE[ch]) { const d = s === '.' ? u : 3 * u; ganhoMorse.gain.setValueAtTime(0.18, t); ganhoMorse.gain.setValueAtTime(0, t + d); t += d + u; }
              t += 2 * u;
            }
            t += 4 * u;
          }
          return (t - c.currentTime) * 1000;
        }
        function tocarLaco() { if (!sintonizado) return; const ms = morse(); laco = setTimeout(tocarLaco, ms + 1200); if (!abriuCP) setTimeout(abrirCP, 2600); }
        dial.addEventListener('input', () => {
          liga();
          const f = dial.value / 100; mostrador.textContent = f.toFixed(2);
          const perto = Math.abs(f - 23.10);
          if (ganhoRuido) ganhoRuido.gain.value = perto < 0.06 ? 0.03 : Math.min(0.16, 0.05 + perto * 0.04);
          const agora = perto < 0.06;
          if (agora && !sintonizado) { sintonizado = true; tocarLaco(); }
          if (!agora && sintonizado) { sintonizado = false; clearTimeout(laco); if (ganhoMorse) ganhoMorse.gain.cancelScheduledValues(0), ganhoMorse.gain.value = 0; }
        });
        function abrirCP() {
          if (abriuCP) return; abriuCP = true; cp.hidden = false;
          const linha = el('div', null, 'CP-500  TRS-DOS 6.2\n\nARQUIVO: PAI.TXT  (PROTEGIDO)\nSENHA: ');
          const inp = el('input', { type: 'text', inputmode: 'numeric', maxlength: '8', 'aria-label': 'senha do computador', autocomplete: 'off' });
          linha.append(inp);
          cp.append(linha);
          inp.focus();
          inp.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            const v = inp.value.replace(/\D/g, '');
            if (v === '0606' || v === '060676') { inp.disabled = true; cp.append(el('div', null, '\nACESSO LIBERADO.')); para(); ok(); }
            else { cp.append(el('div', null, '\nSENHA INCORRETA.')); inp.value = ''; erro('O computador apita e espera.'); }
          });
        }
        function para() { sintonizado = false; clearTimeout(laco); try { if (ruido) ruido.stop(); if (osc) osc.stop(); } catch (e) { /* já parado */ } }
        window.addEventListener('ultima:sai', para, { once: true });
      },
    }),

    v3: () => vinculo({
      id: 'v3', lugar: 'A oficina', cabeca: 'A bancada', rotulo: 'Encontrar',
      intro: '[Você empurra a estante pelo lado esquerdo e ela gira. A bancada, o receptor, a caneca, a planta de 1948 pregada na parede.]',
      titulo: 'Embaixo da bancada tem uma coisa pesada e fria. Qual trecho fala dela?',
      texto: '',
      dica: '[Caderno 7, outubro de 1975. Ele nunca escreve o nome da coisa, só o quanto pesa.]',
      sucesso: 'A caixa de chumbo. Onze quilos. Você a puxa para fora da bancada.',
      abre: 'Seguir lendo',
      montar(corpo, ok, erro) {
        const opcoes = [
          ['“Levo o receptor na caixa de madeira, para escutar do lado de la.”', false],
          ['“Vou escrever o que pesa: onze quilos, com o chumbo.”', true],
          ['“(acaba aqui. a caneca de cafe estava do lado.)”', false],
        ];
        const lista = el('div', { class: 'trechos' });
        opcoes.forEach(([t, certo]) => {
          const b = el('button', { class: 'trecho', type: 'button' }, t);
          b.addEventListener('click', () => { if (certo) ok(); else { b.classList.add('errado'); erro('Não é isso. A coisa embaixo da bancada é mais pesada.'); } });
          lista.append(b);
        });
        corpo.append(lista);
      },
    }),

    v4: () => vinculo({
      id: 'v4', lugar: 'O corredor', cabeca: 'A faixa amarela', rotulo: 'Decifrar',
      intro: '[Atrás do reboco, a porta baixa de 1963. Terra batida, tijolo sem reboco, e uma faixa amarela na altura do ombro.]',
      titulo: 'Cinco bifurcações. Por onde?',
      texto: 'A faixa foi pintada dos dois lados.',
      dica: '[Marina, 4 de junho de 1986: “Amarelo. Sempre à esquerda. Até ouvir o motor.”]',
      sucesso: 'Ao longe, um motor. Parado, ligado, esperando.',
      abre: 'Seguir lendo',
      montar(corpo, ok, erro) {
        let passo = 0;
        const cont = el('span', { class: 'corredor-contagem' }, 'bifurcação 1 de 5');
        const cor = el('div', { class: 'corredor', 'aria-hidden': 'true' }, el('span', { class: 'faixa esq' }), el('span', { class: 'faixa dir' }), cont);
        const esc = (lado) => {
          if (lado === 'e') {
            passo++; cont.textContent = passo < 5 ? `bifurcação ${passo + 1} de 5` : 'o motor';
            cor.style.filter = `brightness(${1 - passo * 0.12})`;
            if (passo >= 5) ok();
          } else { passo = 0; cont.textContent = 'bifurcação 1 de 5'; cor.style.filter = ''; erro('A direita volta. Você está de novo na porta baixa.'); }
        };
        corpo.append(cor, el('div', { class: 'acoes' },
          el('button', { class: 'botao', type: 'button', onclick: () => esc('e') }, '← Esquerda'),
          el('button', { class: 'botao', type: 'button', onclick: () => esc('d') }, 'Direita →')));
      },
    }),

    v5: () => vinculo({
      id: 'v5', lugar: 'O corredor', cabeca: 'Os papéis', rotulo: 'Encontrar',
      intro: '[Mais adiante no corredor, dois papéis que não estavam ali da outra vez.]',
      titulo: 'O que estava no chão da primeira bifurcação? E o que estava enfiado no cano?',
      texto: '',
      dica: '[Cecília, “13 de junho”: ela arrancou uma página e deixou no chão; Marina escreveu um bilhete e enfiou num cano.]',
      sucesso: 'Uma página molhada do caderno de Cecília, e um bilhete de Marina. Os dois apontam para o mesmo lugar: a de chumbo, antes das cinco e dez.',
      abre: 'Ler as últimas páginas',
      montar(corpo, ok, erro) {
        const etapas = [
          ['No chão da primeira bifurcação:', [['“O letreiro apagou. Ele virou na Monte Alegre.”', true], ['“Deixem no banco e desçam. Não olhem pra trás.”', false], ['“Ceci está comigo e com meu pai.”', false]]],
          ['Enfiado num cano, onde a faixa vira:', [['“Deixem no banco e desçam. Não olhem pra trás.”', false], ['“Ceci está comigo e com meu pai. Trouxe a caixa errada. Quem vier: a de chumbo, na bancada.”', true], ['“O letreiro apagou. Ele virou na Monte Alegre.”', false]]],
        ];
        let i = 0;
        const titulo = el('p'), lista = el('div', { class: 'trechos' });
        const monta = () => {
          titulo.textContent = etapas[i][0]; lista.innerHTML = '';
          etapas[i][1].forEach(([t, certo]) => {
            const b = el('button', { class: 'trecho', type: 'button' }, t);
            b.addEventListener('click', () => {
              if (!certo) { b.classList.add('errado'); return erro(i === 0 ? 'Esse não estava no chão.' : 'Esse não estava no cano.'); }
              i++; if (i < etapas.length) monta(); else ok();
            });
            lista.append(b);
          });
        };
        monta(); corpo.append(titulo, lista);
      },
    }),
  };

  // ——— fim ———
  function fim() {
    if (!P.final) { P.final = true; ganhar(PONTOS.final); if (!Object.keys(P.dicas).length) ganhar(PONTOS.semDica); }
    const desconto = P.paginas >= 120 ? 15 : P.paginas >= 100 ? 10 : 0;
    const a = el('article', { class: 'fim' });
    a.append(el('header', { class: 'cap-cabeca' }, el('span', { class: 'cap-numero' }, 'Fim do caderno'), el('h1', { class: 'cap-titulo' }, 'Última Parada')));
    a.append(el('p', null, 'Você leu o caderno até a página 63.'));
    a.append(el('p', { class: 'fim-pontos' }, P.paginas + ' Páginas'), el('p', null, 'de ' + MAXIMO + ' possíveis'));
    if (desconto) {
      a.append(el('p', null, `Suas Páginas valem ${desconto}% de desconto no próximo Diver Livro.`), el('p', { class: 'cupom' }, `ULTIMAPARADA${desconto}`));
    } else {
      a.append(el('p', null, 'Com 100 Páginas, o próximo Diver Livro sai com 10% de desconto. Releia sem pressa: o caderno está no sumário.'));
    }
    a.append(el('p', { class: 'nota' }, '[Não pedimos que ninguém acredite. — Estúdio]'));
    a.append(el('div', { class: 'acoes', style: 'justify-content:center' },
      el('a', { class: 'botao', href: 'porao/' }, 'Entrar no porão'),
      el('button', { class: 'botao', type: 'button', onclick: () => abrirSumario() }, 'Reler')));
    pagina.append(a);
  }

  // ——— sumário ———
  const NOMES = { nota: 'Nota do estúdio', fita: 'A fita (JUN. 7 1996)', fim: 'Fim do caderno' };
  function abrirSumario() {
    const ol = $('#sumario-lista'); ol.innerHTML = '';
    ETAPAS.forEach((e, i) => {
      if (e.startsWith('v')) return;
      const nome = NOMES[e] || (() => { const c = CAPS.find(x => x.n === +e.slice(3)); return c ? `Capítulo ${c.n} — ${c.titulo}` : e; })();
      const livre = i <= P.etapa;
      const b = el('button', { type: 'button', onclick: () => { fecharSumario(); window.dispatchEvent(new Event('ultima:sai')); ir(e); } }, livre ? nome : '— ' + '·'.repeat(8));
      if (!livre) b.disabled = true;
      ol.append(el('li', null, b));
    });
    $('#sumario').hidden = false; $('#fechar-sumario').focus();
  }
  function fecharSumario() { $('#sumario').hidden = true; }
  $('#abrir-sumario').addEventListener('click', abrirSumario);
  $('#fechar-sumario').addEventListener('click', fecharSumario);
  $('#sumario').addEventListener('click', (e) => { if (e.target.id === 'sumario') fecharSumario(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharSumario(); });

  // ——— aviso (sempre a primeira tela) ———
  document.querySelectorAll('#aviso .surge').forEach((n, i) => { n.style.animationDelay = (0.4 + i * 1.1) + 's'; });
  if (P.etapa > 0) $('.recomecar').hidden = false;
  $('#entrar').addEventListener('click', () => {
    audio(); estalo(0.6, 0.18);
    $('#aviso').hidden = true; $('#livro').hidden = false;
    $('#paginas').textContent = P.paginas + ' Páginas';
    ir(ETAPAS[Math.min(P.etapa, ETAPAS.length - 1)]);
  });
  $('#recomecar').addEventListener('click', () => {
    P = novo(); salvar(); $('.recomecar').hidden = true;
  });
  // ao trocar de etapa, o rádio para
  const irOriginal = ir;
  ir = function (e) { window.dispatchEvent(new Event('ultima:sai')); irOriginal(e); };
})();
