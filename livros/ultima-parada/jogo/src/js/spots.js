// ===== spots.js — o que dá pra examinar e usar em cada parede =====
// Ordem importa: o que vem depois fica "por cima" no clique.
// a cômoda corre para a direita quando a oficina abre
const cm = (x, y, w, h) => () => [x + (S.open.oficina ? 270 : 0), y, w, h];
const lit = () => S.power;

function placeFuse() {
  removeItem('fusivel'); S.fuse = true; dirty(0);
  say('Você rosqueia o fusível. Ele aperta com um rangido de porcelana. Um estalo.');
  setTimeout(() => {
    S.power = true; S.powerAt = performance.now(); S.nextFlick = S.powerAt + 15000;
    $('clock').hidden = false; dirty();
    setTimeout(() => say('A lâmpada acende devagar, amarela, zumbindo. Acima da escada, o visor vermelho acorda com a hora.'), 1600);
  }, 900);
  return true;
}

// ——— parede 0: escada ———
spot(0, 'escada', [80, 130, 530, 590], { label: 'Escada',
  act: () => say('Dez degraus de madeira. O sexto range. A Cecília desceu por aqui às 23h10.') });
spot(0, 'porta', [30, 0, 300, 125], { label: 'Porta lá em cima',
  act: () => say('Emperrou. Pela fresta entra a luz da cozinha. A Denise anda de um lado pro outro lá em cima. Ninguém vai descer.') });
spot(0, 'lata', [684, 636, 82, 90], { label: 'Lata de tinta',
  act: () => say('Uma lata de Suvinil vazia, embaixo de uma goteira. Já tem dois dedos de água escura.') });
spot(0, 'janela', [760, 104, 250, 76], { label: 'Janelinha',
  act: () => say('A calçada da Monte Alegre, molhada, no nível dos seus olhos. Um poste aceso. Não passa ninguém. Não passa nem carro.') });
spot(0, 'led', [650, 215, 300, 82], { label: 'Visor de LED',
  act: () => say(lit() ? `Marca ${clockText()}. A passagem fecha às 05:10.` : 'Um visor vermelho, igual aos de ônibus. Apagado. Tem um fio que vai até o quadro de luz.') });
spot(0, 'relogio', [976, 236, 128, 176], { label: 'Relógio de parede',
  act: () => say('Um relógio de cozinha, parado em 23:10. Embaixo, preso com fita crepe, um bilhete na letra da Cecília: “a hora que a casa escuta”.') });
spot(0, 'cano', [1490, WALL_TOP, 80, 625], { label: 'Cano',
  act: () => say('Cano de PVC. Frio. Lá dentro, água correndo. De vez em quando, uma pancada seca que sobe até o teto.') });
spot(0, 'lampada', [LAMP_X[0] - 45, 150, 90, 70], { label: 'Lâmpada',
  act: () => say(lit() ? 'Quente demais pra encostar. Treme de vez em quando.' : 'Uma lâmpada de 60 velas, fria. O interruptor lá em cima não faz nada.') });
spot(0, 'quadro', [1288, 298, 174, 234], { label: 'Quadro de luz',
  act: () => say(S.fuse ? 'Os quatro fusíveis no lugar. Etiqueta: LUZ PORÃO.' : 'Quadro de fusíveis de rosca. Etiqueta: LUZ PORÃO. A rosca de baixo, à direita, está vazia.'),
  use: (it) => it === 'fusivel' ? placeFuse() : false });

// ——— parede 1: estante ———
spot(1, 'estante', [520, 120, 600, 600], { label: 'Estante',
  act: () => say('Uma estante de madeira escura, pesada demais pra arrastar. O cano de ferro do teto some atrás dela.') });
spot(1, 'porquinho', [552, 178, 136, 74], { label: () => S.pigBroken ? 'Cacos do porquinho' : 'Porquinho de barro',
  act: () => say(S.pigBroken ? 'Cacos de barro e moedas de cruzado. Ninguém vai sentir falta.' : 'Pesado. Chacoalha. Não tem tampa embaixo: só quebrando.'),
  use: (it) => it === 'martelo' && !S.pigBroken ? breakPig() : false });
spot(1, 'santinho', [698, 174, 66, 78], { label: 'Nossa Senhora Aparecida',
  act: () => say('Um quadrinho de Nossa Senhora Aparecida. Atrás, a lápis: “Marina, 1ª comunhão, 1975”.') });
spot(1, 'guia', [788, 208, 144, 44], { label: 'Guia Quatro Rodas 1986',
  act: () => say('Uma página dobrada no mapa de Perdizes. A Rua Monte Alegre está circulada a lápis, com força, várias vezes.') });
spot(1, 'sonho', [956, 196, 126, 56], { label: 'Lata de Sonho de Valsa',
  act: () => say('Não tem bombom. Tem parafusos, válvulas de rádio e um carretel de estanho.') });
spot(1, 'barsa', [548, 272, 546, 110], { label: 'Enciclopédia Barsa',
  act: () => say('Catorze volumes vermelhos. Falta o 7. O 8 está tombando no buraco que ele deixou.') });
spot(1, 'radio', [576, 400, 186, 112], { label: 'Rádio de pilha',
  act: () => say('Um Motoradio de capa de couro. O lugar das pilhas está vazio.') });
spot(1, 'revistas', [782, 454, 86, 58], { label: 'Revistas Manchete',
  act: () => say('Manchete de 1985 e 1986. A umidade grudou as páginas.') });
spot(1, 'vaso', [866, 396, 128, 116], { label: 'Vaso de porcelana',
  act: () => say('Vazio. No fundo, a marca retangular de um caderno que ficou guardado aqui muito tempo. Foi daqui que a Cecília tirou o diário.') });
spot(1, 'tecidos', [572, 582, 192, 60], { label: 'Rolos de tecido',
  act: () => say('Rolos de tecido e retalhos. A mãe da Marina costurava.') });
spot(1, 'costura', [796, 576, 148, 66], { label: 'Caixa de costura',
  act: () => say('Linhas, agulhas, dedal, uma fita métrica. Tudo arrumado, como se alguém fosse voltar.') });
spot(1, 'biscoito', [958, 574, 122, 68], { label: 'Lata de biscoito',
  act: () => say('Botões. Centenas de botões.') });
spot(1, 'jornais', [554, 664, 504, 58], { label: 'Jornais amarrados',
  act: () => say('Jornais de junho de 1986, amarrados com barbante. Ninguém desamarrou.') });
spot(1, 'canoE', [1128, WALL_TOP, 34, 215], { label: 'Cano de ferro',
  act: () => say('Desce do teto e some atrás da estante. Atrás dela, só escuro.') });
spot(1, 'pintura', [1198, 168, 304, 444], { label: 'Pintura na parede',
  act: () => say('Um corredor amarelo pintado direto na parede, tinta de parede, pincel grosso. Lâmpadas no teto, uma porta escura no fundo. No canto: M.T. 86. Olhando muito tempo, parece mais fundo do que a parede.') });
spot(1, 'espada', [338, 420, 144, 300], { label: 'Espada-de-são-jorge',
  act: () => say('Morta faz tempo. A terra está seca e fofa, como se alguém tivesse cavado e tampado de novo.') });
spot(1, 'fusivel', [1136, 732, 76, 54], { label: 'Fusível', when: () => !S.fuseTaken,
  act: () => { S.fuseTaken = true; dirty(1); addItem('fusivel'); say('Um fusível de rosca, caído perto da estante. Parece ter pulado do quadro. Você guarda.'); } });

// ——— parede 2: tijolos ———
spot(2, 'tijolos', [0, WALL_TOP, W, FLOOR - WALL_TOP], { label: 'Parede de tijolos',
  act: () => say('Tijolo baiano sem reboco, úmido. Escorre verde dos canos.') });
spot(2, 'emenda', [945, 296, 392, 126], { when: () => !S.open.oficina, label: 'Parede atrás da cômoda',
  act: () => say('Tem uma emenda reta no tijolo, em volta da cômoda. Reta demais. E aqui a parede soa oca.') });
spot(2, 'canos', [536, WALL_TOP, 250, 620], { label: 'Canos',
  act: () => say('Canos de PVC, frios. De vez em quando estalam, como se alguém batesse lá dentro.') });
spot(2, 'cano3', [860, 420, 44, 280], { label: 'Cano',
  act: () => say('Desce torto até o chão e some no taco.') });
spot(2, 'labirinto', [294, 234, 132, 272], { label: 'Labirinto de vidro',
  act: () => say('Um labirinto de vidro embutido no tijolo. Tem um furo em cima, do tamanho de uma bolinha de gude. Embaixo, ele encaixa num cano fino que corre pelo rodapé até a cômoda.') });
spot(2, 'comoda', cm(968, 424, 344, 296), { label: 'Cômoda',
  act: () => say('Cômoda pintada de branco, descascando. Três gavetas, três cadeados diferentes.') });
spot(2, 'gaveta1', cm(988, 450, 304, 80), { label: 'Gaveta de cima',
  act: () => S.open.gav1 ? say('Vazia. Você já pegou os mapas.') : openLock('gav1') });
spot(2, 'gaveta2', cm(988, 538, 304, 80), { label: 'Gaveta do meio',
  act: () => S.open.gav2 ? say('Só uma foto de Natal, de 1975. O homem de jaleco e a menina.') : openLock('gav2') });
spot(2, 'gaveta3', cm(988, 626, 304, 66), { label: 'Gaveta de baixo',
  act: () => say(S.open.gav3 ? 'A marca de poeira da caixa de sapato continua lá. A Cecília levou a caixa.' : 'Cadeado de chave. A fechadura é pequena, de chave de gaveta.'),
  use: (it) => it === 'chave' && !S.open.gav3 ? openGav3() : false });
spot(2, 'retrato', cm(1036, 400, 92, 28), { label: 'Porta-retrato virado',
  act: () => say('Você desvira. Um homem de jaleco com uma menina de uns oito anos no colo. Atrás: “Aurélio e Marina, Natal de 1975”. Você deixa virado de novo.') });

// ——— parede 3: escrivaninha ———
spot(3, 'mural', [74, 154, 432, 312], { label: 'Mural da Cecília', act: () => openMural() });
spot(3, 'diario', [522, 440, 104, 34], { label: 'Diário de Marina', act: () => openDiary() });
spot(3, 'caderno', [620, 442, 96, 30], { label: 'Caderno da Cecília', act: () => openNotes() });
spot(3, 'gavetaEsc', [550, 492, 214, 48], { label: 'Gaveta da escrivaninha', act: () => deskDrawer() });
spot(3, 'cp500', [702, 284, 210, 192], { label: 'Computador CP-500',
  act: () => say(lit() ? 'O botão de ligar fica atrás. Estala, zumbe, e a tela continua preta.' : 'Um Prológica CP-500, bege. Sem energia.') });
spot(3, 'bilhete', [862, 290, 52, 44], { label: 'Bilhete no monitor',
  act: () => say('Letra da Marina, desbotada: “se apagar de novo: RECUPERA”.') });
spot(3, 'ferramentas', [920, 392, 136, 78], { label: 'Caixa de ferramentas',
  act: () => S.open.tool ? say('Chaves de fenda, um alicate, pregos tortos. Você já pegou o martelo.') : openLock('tool') });
spot(3, 'tv', [1082, 188, 220, 284], { label: 'TV Telefunken',
  act: () => say(lit() ? 'Você gira o botão. Chuvisco e um chiado baixo. Só pega um canal.' : 'TV de tubo, 20 polegadas, antena de chifre. Sem luz, não liga.') });
spot(3, 'vcr', [1096, 476, 194, 38], { label: 'Videocassete Sharp',
  act: () => say('Vazio. Esperando uma fita.') });
spot(3, 'telefone', [1322, 486, 92, 54], { label: 'Telefone',
  act: () => say('Telefone de disco, cinza. Tem linha. Você não sabe pra quem ligar.') });
spot(3, 'secretaria', [1408, 508, 64, 34], { label: 'Secretária eletrônica',
  act: () => say(lit() ? 'A luzinha vermelha pisca. A microfita que você trouxe de casa cabe aqui.' : 'Uma secretária eletrônica de microfita. Sem luz, morta.') });
spot(3, 'cama', [1484, 560, 116, 160], { label: 'Cama da Cecília',
  act: () => say('O cobertor ainda está dobrado. Ela não deitou.') });
spot(3, 'mochila', [1498, 474, 90, 96], { label: 'Mochila da Cecília',
  act: () => say('Apostila do cursinho, um walkman, uma fita gravada do rádio, o passe escolar. Ela não levou nada.') });
