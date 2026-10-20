// ===== data.js — textos do jogo (papéis, diário, caderno, nomes) =====
const VIEWS = ['Escada', 'Estante', 'Parede de tijolos', 'Escrivaninha'];

// Os 14 papéis da linha do tempo. `date` ordena; `when` é o que aparece.
// kind define o papel (quadriculado, fichário, caderno, jornal...). `voice` é para o ElevenLabs.
const PAPERS = [
  { id: 1, date: '1948-01-01', when: '1948', kind: 'planta', voice: '—', where: 'Oficina, na parede',
    title: 'Planta da casa',
    html: `<div class="stamp">Sobrado — Rua Monte Alegre — 1948</div>
      <p>Porão. Carvoeira. Corredor de serviço até a travessa.</p><p class="sign">Fechado 1963.</p>` },
  { id: 2, date: '1974-03-01', when: 'mar 1974', kind: 'aurelio', voice: 'Aurélio', where: 'Oficina, na bancada',
    title: 'Caderno 4 de Aurélio',
    html: `<div class="stamp">Caderno 4</div>
      <p>Montei o receptor com as válvulas do rádio velho e duas que trouxe do IPEN.</p>
      <p>Pega coisa que a Rádio Gazeta não pega.</p>
      <p>A Lúcia diz que o porão cheira a queimado. É o estanho.</p>` },
  { id: 3, date: '1974-11-01', when: 'nov 1974', kind: 'aurelio', voice: 'Aurélio', where: 'Oficina, numa gaveta',
    title: 'Caderno 5 de Aurélio',
    html: `<div class="stamp">Caderno 5</div>
      <p>Na faixa 23.10 tem um sinal que repete. Não é radioamador, não é a polícia, não é a torre do Sumaré.</p>
      <p>Pontos e traços, sempre a mesma sequência. Toda noite.</p><p>Anotei tudo.</p>` },
  { id: 4, date: '1975-02-01', when: 'fev 1975', kind: 'aurelio', voice: 'Aurélio', where: 'Oficina, dentro do rádio',
    title: 'Caderno 6 de Aurélio',
    html: `<div class="stamp">Caderno 6</div>
      <p>Decifrei. É morse.</p>
      <p class="h">06 06 76 &nbsp;·&nbsp; 23 10 &nbsp;·&nbsp; 875A-10</p>
      <p>Uma data, uma hora e um número de ônibus. Seis, seis, seis. Não gosto disso.</p>
      <p>Mas alguém está chamando. E chama esta casa.</p>` },
  { id: 5, date: '1976-05-01', when: 'mai 1976', kind: 'aurelio', voice: 'Aurélio', where: 'Oficina, embaixo da caixa de chumbo',
    title: 'Caderno 8 de Aurélio',
    html: `<div class="stamp">Caderno 8</div>
      <p>Não existe linha 875A-10. Mas existe um ônibus que acaba em Perdizes e passa na Cardoso de Almeida.</p>
      <p>Dia 6 eu espero na janela. Levo a caixa.</p>
      <p>Se for o que eu acho, volto antes de amanhecer.</p>` },
  { id: 6, date: '1976-06-06', when: '6 jun 1976', kind: 'lucia', voice: 'Dona Odete (lendo)', where: 'Oficina, pregado na porta',
    title: 'Bilhete de Lúcia',
    html: `<p>Aurélio, se você descer de novo eu vou embora com a menina.</p>
      <p>Já é quase onze horas. A Marina perguntou por que o relógio da cozinha está fazendo barulho.</p><p class="sign">— L.</p>` },
  { id: 7, date: '1976-06-08', when: '8 jun 1976', kind: 'recorte', voice: 'Locutor', where: 'Mural de cortiça',
    title: 'Folha de S.Paulo: técnico desaparece',
    html: `<div class="paperName">Folha de S.Paulo · terça-feira, 8 de junho de 1976 · Cidade</div>
      <p class="h">Técnico do IPEN desaparece em Perdizes</p>
      <div class="body"><p>O técnico Aurélio Toledo, 41, saiu de casa na noite de domingo, no sobrado da Rua Monte Alegre, e não foi mais visto.</p>
      <p>Segundo a esposa, a costureira Lúcia Toledo, ele saiu de noite carregando uma caixa e não disse para onde ia. A filha do casal tem oito anos.</p>
      <p>A polícia trabalha com a hipótese de abandono do lar.</p></div>` },
  { id: 8, date: '1986-04-20', when: 'abr 1986', kind: 'marina', voice: 'Marina', where: 'Gaveta do meio da cômoda',
    title: 'Folha de fichário de Marina',
    html: `<p>Li os nove cadernos.</p><p>Ele não fugiu. Ele não largou a gente.</p>
      <p>Ele foi atrás do sinal.</p><p>Faz dez anos. Este ano acaba em 6.</p>` },
  { id: 15, date: '1986-04-22', when: '22 abr 1986', kind: 'marina mapa', voice: 'Marina', where: 'Gaveta de cima da cômoda',
    title: 'Mapas de Marina: o caminho do ônibus',
    html: `<svg viewBox="0 0 320 300" role="img" aria-label="Mapa desenhado à mão do caminho do ônibus 875A, da Paulista até a casa">
      <g fill="none" stroke="#1f3a7a" stroke-width="1.2" opacity=".55">
        <path d="M20 270 H300"/><path d="M80 40 V290"/><path d="M110 20 V250"/><path d="M60 250 H260"/>
        <path d="M30 120 H300"/><path d="M230 60 V230"/><path d="M200 140 V290"/></g>
      <g font-family="Kalam, cursive" font-size="11" fill="#1f3a7a">
        <text x="126" y="296">Av. Paulista, 900</text><text x="122" y="244">Av. Dr. Arnaldo</text>
        <text x="94" y="60" transform="rotate(90 94 60)">R. Cardoso de Almeida</text>
        <text x="238" y="138">R. Monte Alegre</text></g>
      <path d="M200 286 V250 H110 V120 H230 V196" fill="none" stroke="#8a1f1f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <g fill="#8a1f1f" font-family="Kalam, cursive" font-size="15">
        <path d="M200 262 l-7 12 h14z"/><text x="208" y="276">1</text>
        <path d="M150 250 l12 -7 v14z"/><text x="146" y="270">2</text>
        <path d="M110 175 l-7 12 h14z"/><text x="88" y="186">3</text>
        <path d="M180 120 l-12 -7 v14z"/><text x="176" y="140">4</text>
        <path d="M230 170 l-7 -12 h14z"/><text x="240" y="170">5</text></g>
      <g stroke="#1d1a14" stroke-width="3"><path d="M222 196 l16 16 M238 196 l-16 16"/></g>
      <text x="248" y="216" font-family="Kalam, cursive" font-size="12" fill="#1d1a14">casa</text>
      <text x="150" y="104" font-family="Kalam, cursive" font-size="12" fill="#8a1f1f">aqui ele vira errado</text>
    </svg>
    <p>O 875A não entra na Monte Alegre. Nunca entrou. Só no dia 6.</p>` },
  { id: 9, date: '1986-06-04', when: '4 jun 1986', kind: 'marina', voice: 'Marina', where: 'Atrás da pintura do corredor',
    title: 'Marina, dois dias antes',
    html: `<p>Pintei o corredor na parede.</p>
      <p>Se eu não voltar, quem achar a oficina sabe o caminho.</p>
      <p>Amarelo. Sempre à esquerda. Até ouvir o motor.</p>` },
  { id: 10, date: '1986-06-09', when: '9 jun 1986', kind: 'recorte', voice: 'Locutor', where: 'Mural de cortiça',
    title: 'Notícias Populares: some na mesma casa',
    html: `<div class="paperName">Notícias Populares · segunda-feira, 9 de junho de 1986</div>
      <p class="h">Filha de desaparecido some na mesma casa, dez anos depois</p>
      <div class="body"><p>Marina Toledo, 18, sumiu na noite de sexta-feira do sobrado da Rua Monte Alegre, em Perdizes, de onde o pai, o técnico Aurélio Toledo, desapareceu em junho de 1976.</p>
      <p>A mãe disse ter ouvido passos na escada do porão às 23h10. Ao descer, não encontrou a filha.</p>
      <p>A polícia informou que só abre investigação depois de 48 horas.</p></div>` },
  { id: 11, date: '1996-05-20', when: 'mai 1996', kind: 'cecilia', voice: 'Cecília', where: 'Caderno da Cecília',
    title: 'Cecília, depois de falar com Dona Odete',
    html: `<p>Dona Odete me contou os dois.</p><p>O pai em 76. A filha em 86.</p>
      <p>Sempre 6 de junho.</p><p>Este ano acaba em 6.</p><p>Eu moro no quarto deles.</p>` },
  { id: 12, date: '1996-06-06', when: '6 jun 1996', kind: 'cecilia molhada', voice: 'Cecília', where: 'Corredores, no chão',
    title: 'Cecília, no ônibus',
    html: `<p>No ônibus. O letreiro apagou.</p><p>Ele virou na Monte Alegre.</p>
      <p>Vou descer e <span class="run">conferir no diário</span>.</p>` },
  { id: 13, date: '1996-06-07', when: '7 jun 1996', kind: 'marina mofo', voice: 'Marina', where: 'Corredores, preso num cano',
    title: 'Marina, do lado de lá',
    html: `<p>Ceci está comigo e com meu pai. Trouxe a caixa errada.</p>
      <p>Quem vier: a de chumbo, na bancada.</p><p>Antes das cinco e dez.</p>` },
  { id: 14, date: '1996-06-07b', when: '7 jun 1996', kind: 'aurelio mofo', voice: 'Aurélio', where: 'Ponto final, no banco',
    title: 'Aurélio, no banco do ponto',
    html: `<p>Deixem no banco e desçam.</p><p>Não olhem pra trás.</p><p>Eu abri; eu fecho.</p>` },
];

// Diário de Marina (1986). As partes cifradas vêm com as letras invertidas.
const DIARY = [
  { d: '12 de março de 1986', t: 'Consegui o porão. Mamãe chorou, disse que lá embaixo é frio. É frio. Mas era dele, e agora é meu. Tito dorme no pé da cama.', c: 'osav on arom zul a' },
  { d: '3 de abril', t: 'Achei a lanterna do papai na gaveta, a que mostra as marquinhas dos relógios. Mamãe não pode saber que eu mexo nas coisas dele. Tito late para a parede da cômoda.', c: 'orucse on avagrexne iap uem' },
  { d: '22 de abril', t: 'Desenhei o caminho do ônibus da Paulista até aqui. Tem uma esquina em que ele vira errado. Guardei meus mapas onde só cabe a palavra do ônibus.' },
  { d: '9 de maio', t: 'Eu tinha oito anos. Ouvi o papai descer a escada e o relógio da cozinha parar. Vinte e três e dez. Mamãe diz que eu sonhei. Tito latiu até de manhã. A casa escuta às 23h10.' },
  { d: '18 de maio', t: 'Mamãe trancou a gaveta de baixo com as fotos dele. Roubei a chave.', c: 'ohniuqrop on emrod evahc a' },
  { d: '25 de maio', t: 'Vou filmar o que ele filmou. A Super 8 dele não funciona mais; peguei a VHS do tio emprestada. A fita fica na gaveta de baixo.' },
  { d: '28 de maio', t: 'Meu pai era o inventor da família. Técnico do IPEN, relojoeiro em casa, nunca comprou nada que pudesse construir. Hoje descobri que o labirinto da parede não é enfeite: é a tranca de uma oficina que ninguém sabia que existia. Primeiro a bolinha, que eu plantei com a planta. Ela roda pelo cano e destrava o painel. Entrei. Tem nove cadernos.' },
  { d: '1º de junho', t: 'Li os nove. Ele foi atrás do sinal. Um rádio que ele montou pegou, em morse, uma data, uma hora e o número de um ônibus. Ele decifrou, descobriu o ônibus e esperou. Ele deixou aberto: todo seis de junho de ano que acaba em seis, das vinte e três e dez às cinco e dez. Seis horas. Faz dez anos. É daqui a cinco dias.' },
  { d: '4 de junho', t: 'Atrás da estante tem um corredor amarelo. Vi pela fresta. Eu pintei igual na parede, pra não esquecer o caminho.' },
  { d: '6 de junho de 1986', t: 'Hoje eu vou buscar ele. Se alguém ler isso: ele para onde a Monte Alegre acaba, às 23h10, e fecha às 5h10. Não entra sem saber fechar.', ceci: '6/6/1996 — eu sei fechar. acho.' },
];

// Páginas que a Cecília já tinha escrito no caderno dela.
const CECI_NOTES = [
  'Diário de uma Marina. 1986. Ela morava aqui. Ela sumiu daqui. O pai dela também.',
  'Código dela: inverte as letras. Às vezes número = letra.',
  'Fusível no vaso. Luz funciona. Por que ninguém trocou em dez anos?',
  'Cachorro Tito. Senha?',
  'Dona Odete: o pai em 76, a menina em 86. Sempre 6 de junho. Sempre 23h10. Este ano acaba em 6.',
  'Tem uma caixa. Marina fala de uma caixa. Achei uma na gaveta de baixo. Deve ser essa. <small>(riscado depois: não era)</small>',
  '6/6. No ônibus. O letreiro apagou. Ele entrou na Monte Alegre. Vou conferir no diário e descer.',
];

const ITEMS = {
  fusivel: { name: 'Fusível', desc: 'Um fusível de rosca. Parece bom.' },
  uv: { name: 'Luz negra', desc: 'A lanterninha roxa do Seu Aurélio, de ver marca de relojoeiro. Com ela na mão, aparece o que está escrito invisível.' },
  martelo: { name: 'Martelo', desc: 'Martelo de unha, cabo de madeira, enferrujado.' },
  chave: { name: 'Chave pequena', desc: 'Uma chave pequena, de gaveta. Estava dentro do porquinho.' },
  fita: { name: 'Fita VHS', desc: 'Uma fita VHS. Na etiqueta, letra da Marina: “JUN 86”.' },
  cracha: { name: 'Crachá', desc: 'Crachá plastificado do IPEN: AURÉLIO TOLEDO · TÉCNICO · RADIOQUÍMICA. A foto é a do homem do porta-retrato.' },
};

const INTRO = [
  { when: 'SEX 07·06·96  02:05' },
  'A Denise te deixou descer. A porta lá em cima emperrou atrás de você.',
  'A Cecília desceu esta escada às 23h10 de ontem e ninguém mais viu ela.',
  'No recado, ela disse que tem pouco tempo. Que fecha às cinco e dez.',
  'A luz do porão não acende. Você tem a lanterna de pilha da Denise e a câmera ligada na mochila.',
];

// Labirinto de vidro do Seu Aurélio (5 colunas × 10 linhas). A bolinha desliza até bater.
// h: parede embaixo da célula "c,r"; v: parede à direita da célula "c,r".
const MAZE = {
  cols: 5, rows: 10, start: [2, 0], exitCol: 2,
  h: new Set(['2,1', '0,3', '4,5', '0,7', '3,0', '1,2', '3,2', '1,4', '2,4', '3,4', '3,6', '4,6', '1,8', '3,8', '4,8']),
  v: new Set(['2,7', '3,1', '0,2', '2,2', '3,4', '0,6', '2,6', '1,8', '3,9', '0,9', '3,0']),
  sol: [[2, 0], [2, 1], [0, 1], [0, 3], [4, 3], [4, 5], [0, 5], [0, 7], [2, 7], [2, 9]],
  // posição no vidro da parede (x 308–412, y 268–492)
  gx: 308, gy: 268, cw: 20.8, ch: 22.4,
};
const VIEWS_EXTRA = ['Oficina', 'Corredor', 'Última parada'];
VIEWS.push(...VIEWS_EXTRA);
ITEMS.bolinha = { name: 'Bolinha de aço', desc: 'Uma bolinha de aço, do tamanho de uma bolinha de gude. Estava enterrada na terra da espada-de-são-jorge.' };
ITEMS.caixa = { name: 'Caixa de chumbo', desc: 'Pesada demais para o tamanho. Chumbo, com o trevo amarelo de radiação pintado à mão. Não abre. Não deve abrir.' };
