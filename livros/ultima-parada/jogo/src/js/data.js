// ===== data.js — textos do jogo (papéis, diário, caderno, nomes) =====
const VIEWS = ['Escada', 'Estante', 'Parede de tijolos', 'Escrivaninha'];

// Os 14 papéis da linha do tempo. `date` ordena; `when` é o que aparece.
// kind define o papel (quadriculado, fichário, caderno, jornal...). `voice` é para o ElevenLabs.
const PAPERS = [
  { id: 16, date: '1974-11-02', when: 'nov 1974', kind: 'aurelio morse', voice: '—', where: 'Oficina, pregada na parede',
    title: 'Tabela de código morse',
    html: `<div class="stamp">Código Morse · internacional</div>
      <div class="morse-tab"><span><b>A</b> ·−</span><span><b>B</b> −···</span><span><b>C</b> −·−·</span><span><b>D</b> −··</span><span><b>E</b> ·</span><span><b>F</b> ··−·</span><span><b>G</b> −−·</span><span><b>H</b> ····</span><span><b>I</b> ··</span><span><b>J</b> ·−−−</span><span><b>K</b> −·−</span><span><b>L</b> ·−··</span><span><b>M</b> −−</span><span><b>N</b> −·</span><span><b>O</b> −−−</span><span><b>P</b> ·−−·</span><span><b>Q</b> −−·−</span><span><b>R</b> ·−·</span><span><b>S</b> ···</span><span><b>T</b> −</span><span><b>U</b> ··−</span><span><b>V</b> ···−</span><span><b>W</b> ·−−</span><span><b>X</b> −··−</span><span><b>Y</b> −·−−</span><span><b>Z</b> −−··</span><span><b>1</b> ·−−−−</span><span><b>2</b> ··−−−</span><span><b>3</b> ···−−</span><span><b>4</b> ····−</span><span><b>5</b> ·····</span><span><b>6</b> −····</span><span><b>7</b> −−···</span><span><b>8</b> −−−··</span><span><b>9</b> −−−−·</span><span><b>0</b> −−−−−</span></div>
      <p class="sign">· ponto curto &nbsp; − traço longo &nbsp;·&nbsp; espaço entre letras, barra entre palavras</p>` },
  { id: 1, date: '1948-01-01', when: '1948', kind: 'planta', voice: '—', where: 'Oficina, pregada na parede',
    title: 'Planta da casa',
    html: `<div class="stamp">Sobrado — Rua Monte Alegre — 1948</div>
      <p>Porão. Carvoeira. Corredor de serviço até a travessa.</p><p class="sign">Fechado 1963.</p>` },
  { id: 2, date: '1976-06-06', when: '6 jun 1976, 22h40', kind: 'aurelio', voice: 'Aurélio', where: 'Oficina, o caderno 9, aberto na última página',
    title: 'Caderno 9 de Aurélio',
    html: `<div class="stamp">Caderno 9 · 6 de junho de 1976, 22h40</div>
      <p>A Lúcia pregou um bilhete na porta. Li. Vou assim mesmo.</p>
      <p>Ela não entende que não é ir embora. É ir ver.</p>
      <p>Se eu não voltar, a menina vai ler isto um dia. Marina: eu não fui embora. Eu fui ver quem chama. Se você ouvir, não vá.</p>` },
  { id: 6, date: '1976-06-06b', when: '6 jun 1976', kind: 'lucia', voice: 'Lúcia', where: 'Oficina, pregado na porta',
    title: 'Bilhete de Lúcia',
    html: `<p>Aurélio, se você descer de novo eu vou embora com a menina.</p>
      <p>Já é quase onze horas. A Marina perguntou por que o relógio da cozinha está fazendo barulho.</p><p class="sign">— L.</p>` },
  { id: 7, date: '1976-06-08', when: '8 jun 1976', kind: 'recorte', voice: 'Locutor', where: 'Oficina, dentro da bíblia de Lúcia',
    title: 'Folha de S.Paulo: técnico desaparece',
    html: `<div class="paperName">Folha de S.Paulo · terça-feira, 8 de junho de 1976 · Cidade</div>
      <p class="h">Técnico do Ipen desaparece em Perdizes</p>
      <div class="body"><p>O técnico Aurélio Toledo, 41, saiu de casa na noite de domingo, no sobrado da Rua Monte Alegre, e não foi mais visto.</p>
      <p>Segundo a esposa, a costureira Lúcia Toledo, ele saiu de noite carregando uma caixa e não disse para onde ia. A filha do casal tem oito anos.</p>
      <p>A polícia trabalha com a hipótese de abandono do lar.</p></div>` },
  { id: 15, date: '1986-04-22', when: '22 abr 1986', kind: 'marina mapa', voice: 'Marina', where: 'Gaveta de cima da cômoda, dobrado dentro do diário',
    title: 'Mapa de Marina: o caminho do ônibus',
    html: `<svg viewBox="0 0 320 300" role="img" aria-label="Mapa desenhado à mão do caminho do ônibus 875A, da Paulista até a casa">
      <g fill="none" stroke="#1f3a7a" stroke-width="1.2" opacity=".55">
        <path d="M20 270 H300"/><path d="M80 40 V290"/><path d="M110 20 V250"/><path d="M60 250 H260"/>
        <path d="M30 120 H300"/><path d="M230 60 V230"/><path d="M200 140 V290"/></g>
      <g font-family="Kalam, cursive" font-size="11" fill="#1f3a7a">
        <text x="126" y="296">Av. Paulista, 900</text><text x="122" y="244">Av. Dr. Arnaldo</text>
        <text x="94" y="60" transform="rotate(90 94 60)">R. Cardoso de Almeida</text>
        <text x="238" y="138">R. Monte Alegre</text></g>
      <path d="M200 286 V250 H110 V120 H230 V196" fill="none" stroke="#8a1f1f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <g stroke="#1d1a14" stroke-width="3"><path d="M222 196 l16 16 M238 196 l-16 16"/></g>
      <text x="248" y="216" font-family="Kalam, cursive" font-size="12" fill="#1d1a14">casa</text>
      <text x="150" y="104" font-family="Kalam, cursive" font-size="12" fill="#8a1f1f">aqui ele vira errado</text>
    </svg>
    <p>O 875A não entra na Monte Alegre. Nunca entrou. Só no dia 6.</p>` },
  { id: 9, date: '1986-06-04', when: '4 jun 1986', kind: 'marina', voice: 'Marina', where: 'Atrás da pintura do corredor, numa rachadura',
    title: 'Marina, dois dias antes',
    html: `<p>Terminei a faixa do corredor.</p>
      <p>Se eu não voltar, quem achar a oficina sabe o caminho.</p>
      <p>Amarelo. Sempre à esquerda. Até ouvir o motor.</p>` },
  { id: 10, date: '1986-06-09', when: '9 jun 1986', kind: 'recorte', voice: 'Locutor', where: 'Estante, nos jornais de junho de 1986',
    title: 'Notícias Populares: some na mesma casa',
    html: `<div class="paperName">Notícias Populares · segunda-feira, 9 de junho de 1986</div>
      <p class="h">Filha de desaparecido some na mesma casa, dez anos depois</p>
      <div class="body"><p>Marina Toledo, 18, sumiu na noite de sexta-feira do sobrado da Rua Monte Alegre, em Perdizes, de onde o pai, o técnico Aurélio Toledo, desapareceu em junho de 1976.</p>
      <p>A mãe disse ter ouvido passos na escada do porão às 23h10. Ao descer, não encontrou a filha.</p>
      <p>A polícia informou que só abre investigação depois de 24 horas.</p></div>` },
  { id: 17, date: '1986-08-20', when: '20 ago 1986', kind: 'lucia', voice: 'Lúcia', where: 'Oficina, dentro da bíblia, dobrada no Salmo 23',
    title: 'Carta de Lúcia, não enviada',
    html: `<div class="stamp">São Paulo, 20 de agosto de 1986</div>
      <p>Marina, vou embora desta casa amanhã. A Odete fica com a chave até alguém alugar.</p>
      <p>A caixa do seu pai continua embaixo da bancada. Eu não mexi. Ele pediu, e você também, os dois com a mesma letra.</p>
      <p>O rádio dele falava sozinho às onze e dez, na faixa que ele marcava em tudo. Ontem ele falou de novo. Tirei da tomada. Continuou.</p>
      <p>Se você voltar, a chave está com a Odete.</p><p class="sign">Mãe</p>` },
  { id: 11, date: '1996-05-17', when: 'mai 1996', kind: 'cecilia', voice: 'Cecília', where: 'Mural da Cecília',
    title: 'A folha de Marina, copiada pela Cecília',
    html: `<p><small>(copiei da folha que estava embaixo do forro da gaveta do meio. canto de cima: “abr 86”. sem nome.)</small></p>
      <p>Li os nove cadernos. Ele não fugiu. Ele não largou a gente. Ele foi atrás do sinal. Faz dez anos. Este ano acaba em 6. Preciso saber a <span class="dupla">ROTA</span>.</p>
      <p><small>sublinhado duas vezes, com força. sublinhado não é senha, é pergunta. ou é?</small></p>` },
  { id: 12, date: '1996-06-06', when: '6 jun 1996, 22h58', kind: 'cecilia molhada', voice: 'Cecília', where: 'Corredor, no chão da primeira bifurcação',
    title: 'Cecília, no ônibus',
    html: `<p>Ele não parou na minha esquina. Apertei a campainha e não tocou.</p>
      <p>O letreiro apagou. 7 A PERDI, depois nada.</p><p>Ele virou na Monte Alegre. 23h09 no relógio do painel.</p>
      <p>Vou descer e tentar o <span class="run">cadead</span></p>` },
  { id: 13, date: '1996-06-07', when: '7 jun 1996', kind: 'marina mofo', voice: 'Marina', where: 'Corredor, enfiado num cano, onde a faixa vira',
    title: 'Marina, do lado de lá',
    html: `<p>Ceci está comigo e com meu pai. Trouxe a caixa errada.</p>
      <p>Quem vier: a de chumbo, na bancada.</p><p>Antes das cinco e dez.</p>` },
  { id: 14, date: '1996-06-07b', when: '7 jun 1996', kind: 'aurelio mofo', voice: 'Aurélio', where: 'Ponto final, no banco',
    title: 'Aurélio, no banco do ponto',
    html: `<p>Deixem no banco e desçam.</p><p>Não olhem pra trás.</p><p>Eu abri; eu fecho.</p>` },
];

// Diário de Marina (1986): capa dura verde, com elástico. O que está em itálico ela copiou dos cadernos do pai.
const DIARY = [
  { d: '12 de abril de 1986', t: 'Mãe foi para Sorocaba cuidar da tia Zilda. Duas semanas. Pela primeira vez desde os oito anos eu desci. Eu sabia da oficina. Fica atrás da parede da cômoda, e a tranca é um labirinto de vidro que ele embutiu no tijolo: a bolinha entra por cima, desce, e a parede corre com a cômoda junto. No dia em que ele não voltou, eu enterrei a bolinha no vaso da espada-de-são-jorge, para ninguém entrar. Hoje eu desenterrei.' },
  { d: '14 de abril', t: 'Li os nove. Não dormi. Copio o que importa.<br><i>CADERNO 5 — novembro de 1974. Na faixa 23.10 tem um sinal que repete. Começa às 23h10 e dura seis minutos. Pontos e traços, sempre a mesma sequência, toda noite.</i><br><i>CADERNO 6 — fevereiro de 1975. Decifrei. Não são letras, são números. 06 06 76 · 23 10 · 875A-10. Uma data, uma hora e um número de ônibus. Mas alguém está chamando. E chama esta casa.</i>' },
  { d: '18 de abril', t: 'Comecei a passar os cadernos 7, 8 e 9 para o CP-500. Um arquivo só: PAI.TXT. Pus senha, porque a mãe desce aqui de vez em quando para chorar e não precisa ler. A senha é o dia e o mês que ele marcou. Quatro números.' },
  { d: '20 de abril', t: 'Liguei o receptor. Girei o dial até 23.10. Onze e nove: o relógio dela na parede deu um tique. Um só. Onze e dez: pontos e traços. É igual ao caderno 5, menos o terceiro grupo. Onde era 76, agora é 86. Ele não fugiu. Ele foi atrás do sinal. Está chamando de novo.' },
  { d: '22 de abril', t: 'Preciso saber a ROTA. Peguei o 875A na Paulista, em frente ao 900, e desenhei por onde ele passa. Passa a dois quarteirões da nossa casa e nunca entra na nossa rua. Marquei onde ele teria que virar, se virasse: “aqui ele vira errado”.' },
  { d: '25 de abril', t: 'A Dona Odete viu o ônibus parar na nossa porta em 76, de noite, apagado, e meu pai subir com uma caixa. “Esse ônibus não entra na Monte Alegre, menina. Nunca entrou. Só no dia 6.”' },
  { d: '9 de maio', t: 'Abri o corredor. Depois do sinal de sempre veio outro, mais devagar. Copiei com a tabela que ele pregou na parede, letra por letra. Era o nome de um livro da estante. Puxei até o fim. A estante girou sem barulho. Atrás, uma porta de madeira baixa. Tijolo sem reboco, chão de terra seco. Lá na frente, longe, um motor. Parado, ligado, esperando.' },
  { d: '12 de maio', t: 'Tinta amarela da garagem. Fui pintando uma faixa na parede do corredor, na altura do ombro, por onde eu ia. Em cada bifurcação, esquerda. A direita volta. A esquerda vai.' },
  { d: '4 de junho', t: 'Terminei a faixa do corredor. Se eu não voltar, quem achar a oficina sabe o caminho. Amarelo. Sempre à esquerda. Até ouvir o motor.' },
  { d: '6 de junho de 1986, 22h50', t: 'Deixo este diário na gaveta de cima da cômoda, com o cadeado. A palavra é ROTA. A caixa fica. Ele entrou pela frente, pelo ônibus. Eu vou pelo corredor. Vou descer às onze e dez. Levo a lanterna dele e a filmadora.<br>Mãe: eu não fui embora.' },
];


const ITEMS = {
  fusivel: { name: 'Fusível', desc: 'Um fusível de rosca, da lata de peças do Aurélio. Parece bom.' },
  uv: { name: 'Luz negra', desc: 'A lanterninha roxa do Seu Aurélio, de ver marca de relojoeiro. Com ela na mão, aparece o que está escrito invisível.' },
  fita: { name: 'Fita VHS', desc: 'Uma fita VHS. Na etiqueta, letra da Marina: “JUN 86”.' },
};

const INTRO = [
  { when: 'SEX 07·06·96  02:05' },
  'O ônibus te deixou na porta. A porta da frente estava aberta; os pais dela dormem lá em cima.',
  'A Cecília desceu de um ônibus aqui na frente às 23h10 de ontem e ninguém mais viu ela.',
  'No recado, ela disse que tem pouco tempo. Que fecha às cinco e dez.',
  'A porta lá em cima emperrou atrás de você. A luz do porão não acende. Você tem uma lanterna de pilha fraca e a filmadora ligada na mochila, no peito.',
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
ITEMS.caixa = { name: 'Caixa de chumbo', desc: 'Cinza, fosca, com alça. Onze quilos. Fria como se tivesse saído da geladeira. Não abre. Ninguém nesta história abre.' };
