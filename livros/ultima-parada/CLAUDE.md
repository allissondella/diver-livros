# Última Parada — Diver Livro (livros/ultima-parada)

Livro gamificado de terror. Um envelope deixado num sebo de São Paulo (abril de 2026) com o caderno da Cecília (1996), o diário de Marina (1986), os cadernos de Aurélio (1976), uma microfita de secretária e uma fita de vídeo. O Fábio, o amigo que foi atrás da Cecília, conversa com o leitor; cada descoberta no porão (o escape room) solta o capítulo seguinte. Coleção "Diver Livros" (Diver, diver.app.br).

## Onde está cada coisa
- `livro/` — `00-aviso.md`, os capítulos em Markdown (`01-em-que-a-ceci-some.md` a `10-das-coisas-que-eu-nao-trouxe.md`) e `biblia.md` (método, voz, capítulos, Páginas, fórmula). A bíblia é a fonte da verdade.
- Formato dos capítulos: `>` é a voz de quem conversa com o leitor; `>>` é documento (quadro à parte); `>> {{ouvir}}` põe o play da microfita; `>> {v:id} texto` liga a fala ao áudio `site/audio/<id>.mp3`. O que está fora de citação (a linha de descrição) não vai para o site.
- `jogo/` — o porão no navegador. `sh jogo/build.sh` gera `jogo/dist/index.html` (um arquivo só). JS por "ondas" em `jogo/src/js/`.
- `midia/ferramentas/` — `processar-vozes.sh` e `secretaria.sh` (vozes do ElevenLabs → `site/audio/`, com o efeito de microfita); montagem das fitas VHS: `fita_ida7.py` (a ida) e `fita_volta1.py` (o último trecho), versões atuais; `vhs-real.sh`, e `../../compartilhado/ferramentas/vhsfx/` (Rust, usa ntsc-rs: github.com/valadaptive/ntsc-rs, crate `crates/ntscrs`).
- `midia/sons/` — statics, jumpscare, fita entrando no videocassete, voz da mulher.
- Vídeos brutos do Google Flow (Veo) e fitas montadas NÃO vão para o git (pesados); ficam com o autor.

## Regras do método (Stoker por dentro, Machado por fora)
- O Fábio conversa com o leitor como o Brás Cubas de Machado de Assis ("caro leitor", promessas que ele segura, ironia como respiro), no começo e no fim de cada capítulo. Suas partes não têm data, menos as do capítulo 9.
- Dentro dos quadros, só documentos, como no Drácula de Stoker. Toda entrada tem data e lugar. Notas do estúdio entre colchetes, frias.
- O leitor só descobre que a Cecília voltou no capítulo 9. A Cecília só fala com o leitor no capítulo 10.
- Dinâmico e gostoso de ler, sem perder o suspense: frases curtas, corte no fim de cada capítulo, ironia nunca na cena de medo.
- Ninguém explica o portal. Ninguém diz "Sete Além". Sem vultos nem fantasmas: terror psicológico.
- O número da casa nunca aparece (Rua Monte Alegre existe).
- Personagens brasileiros, coisas brasileiras.
- Do outro lado a hora passa diferente: para Cecília foi uma semana (7 a 13 de junho); deste lado, menos de seis horas.

## Fatos fixos
- Portal: 6 de junho dos anos terminados em 6, abre 23h10, fecha 05h10.
- Aurélio Toledo (41, Ipen) some em 06/06/1976; Marina (18) em 06/06/1986; Cecília (18) em 06/06/1996 e volta com Fábio (19) às 05h10 de 07/06.
- Ônibus 875A-10 Aeroporto–Perdizes; letreiro apaga até "7 A PERDI". Faixa de rádio 23.10. Morse: 06 06 76 · 23 10 · 875A-10.
- Senhas: ROTA (cômoda), 0606 (CP-500), volume sete (estante). O capítulo 5 é lido na tela do CP-500 (PAI.TXT, sem acentos). A oficina fica atrás da parede da cômoda (tranca: labirinto de vidro e bolinha); o corredor, atrás da estante do porão (alavanca: volume 7 da Barsa, que só destrava depois do rádio). A pista do volume 7 é um morse que o receptor bate depois da voz da Marina, PUXE O LIVRO 7, traduzido com a tabela de morse pregada na parede da oficina (papel 16 da linha do tempo). Nenhum texto do livro diz "volume 7" antes do capítulo 8.
- A caixa de chumbo fica no banco do ônibus; a de sapato é "a caixa errada".

## O livro e o porão juntos (`site/` + `jogo/`)
- O site do livro é a casca; o escape room (o porão) roda dentro dele, num iframe: `porao/index.html?livro=1`. No GitHub Pages: livro em `/ultima-parada/`, porão em `/ultima-parada/porao/` (o workflow gera o jogo com `jogo/build.sh` e copia `site/audio/` para `porao/audio/`).
- Ordem: aviso (vermelho) → capítulo 1 (vermelho) → a fita na TV → capítulo 2 (vermelho) → "Descer ao porão" → o porão no escuro.
- Cada marco do porão solta um capítulo (a folha cai na tela, com a cena e só "Ler agora"):
  luz acesa (fusível) → cap. 3 · cadeado ROTA → cap. 4 · senha 0606 no CP-500 → cap. 5 · caixa de chumbo na oficina (que abre com a bolinha no labirinto de vidro) → cap. 6 · receptor da oficina em 23.10 → cap. 7 · estante do porão gira (volume 7 da Barsa) → cap. 8 · 05h10, a caixa no ônibus → cap. 9, que abre sozinho → "Virar a página" → cap. 10 → "Fechar o envelope" → fim.
- Os capítulos saem sempre em ordem: um marco feito antes da hora fica guardado e solta junto com o anterior ("Capítulos 4 a 5").
- Os capítulos que o porão solta (3 a 8) têm que ser abertos: não há "Continuar no porão". Não há tempo de leitura: aberto o capítulo, já dá para voltar ao porão. Enquanto um capítulo solto não foi aberto, o "Voltar ao porão" da barra some e qualquer caminho de volta ao porão (Envelope → capítulo 2 → "Descer ao porão") abre o capítulo pendente. Com dois capítulos soltos juntos, o primeiro leva ao segundo, e só o último volta ao porão.
- O porão dura 1 hora real: o relógio da ficção vai das 02h05 às 05h10 (`REAL_MIN = 60` em `jogo/src/js/engine.js`); o susto das 03h40 cai perto dos 31 minutos e o silêncio súbito do som, aos 36 (60% do tempo). Se o tempo acaba depois de abrir a oficina, dá para tentar de novo a partir das 03h40.
- Fim ruim: se der 05h10 no porão, o livro mostra uma tela preta com "VOCÊ FALHOU" enorme, em vermelho, com um grito (`audio/grito-falhou.mp3`; sem ele, `sons/jumpscare.mp3`), e depois de 3 segundos volta ao aviso com o progresso zerado. Sem explicação.
- Enquanto a pessoa lê (ou está com o menu Envelope aberto), o relógio da ficção e o som do porão param.
- Ponte do lado do jogo: `jogo/src/js/livro.js` (pula a abertura da TV, avisa os marcos com postMessage, pausa/continua, entrega o final ao livro). Fora do livro, o jogo funciona sozinho como antes.
- Lado do livro: `site/app.js`. Progresso no `localStorage` (`ultima-parada:livro:2`). O estado do jogo não é salvo: recarregar a página recomeça o porão, mas os capítulos já soltos continuam.
- O play da microfita: o botão toca as falas seguintes do quadro, uma por vez, destacando a linha, com o chiado gravado em loop por baixo e o bipe gravado nas linhas `[BIP]`. As falas da secretária já vêm com o efeito de microfita no arquivo e tocam como estão; outras falas ganham filtro de telefone. Sem o MP3, toca bipe e chiado sintetizados e segue no tempo de leitura. No capítulo 1, a fita começa com o telefone chamando (o que o Fábio ouviu do outro lado da linha).
- No porão, o mesmo: bipe e toques gravados (`SFX.bip`, `SFX.ring`, `SFX.bell` em `jogo/src/js/audio.js`, com reserva sintetizada); depois da caixa, o telefone do porão toca e a secretária atende sozinha.
- `site/build.py` gera `site/capitulos.js` a partir de `livro/NN-*.md` e `site/audio/manifest.json`. Rode depois de mudar um capítulo ou pôr um áudio (o workflow também roda).
- Páginas: ler capítulo 10 (ao chegar ao fim do capítulo, sem tempo mínimo), cada marco do porão 5, fita até o fim 5, fechar o envelope 20. Máximo 160. Cupom provisório: ≥125 → ULTIMAPARADA10, ≥145 → ULTIMAPARADA15.
- Vídeo: `site/video/fita-ida.mp4` (a ida, depois do capítulo 1) e `site/video/fita-volta.mp4` (o último trecho, dentro do capítulo 9, com `>> {{fita:volta}}`), cada um com `.webm` de reserva. A TV com "Colocar a fita" é a mesma (`televisao()` em `site/app.js`). Som da fita entrando: `site/sons/fita-entrando.mp3`.
- A fita de Marina (1986) não tem play no livro: não estava no envelope; o capítulo 7 a traz como reconstituição, da nota do Fábio na margem do caderno. No porão, ela passa no videocassete (desenhada, `vhs.js`).
- Teste local: `sh jogo/build.sh && mkdir -p site/porao && cp jogo/dist/index.html site/porao/ && cp -r site/audio site/porao/` e sirva a pasta `site/` (`python3 -m http.server`).

## As fitas do Fábio
Montadas por scripts em `midia/ferramentas/` (precisam dos vídeos brutos do Flow, que ficam fora do git, e do vhsfx compilado).
- A ida (`site/video/fita-ida.mp4`, 38 s, `fita_ida7.py`): Paulista → glitch → ônibus chegando → letreiro apagando até "7 A PERDI" → chiado → corredor até a mulher (frase escondida no chiado) → a lâmpada estoura (glitch) → ela mais perto → chiado → janela → chiado → a casa → glitch + jumpscare → preto. Não mostra nada depois das 01h52: a caixa e o ônibus indo embora são do fim.
- O último trecho (`site/video/fita-volta.mp4`, 15 s, `fita_volta1.py`, no capítulo 9): chiado → a caixa de chumbo sozinha no banco (05:33) → chiado → o ônibus indo embora (05:40), a imagem apagando → chiado → preto. Sem susto. Faltam cenas do Flow para completar (ponto final às 05:10, ônibus sem farol abrindo a porta, a mulher fechando os olhos, plataforma da Barra Funda, as costas da Cecília às 05:49); o resto o capítulo transcreve.

## Pendências
- Vozes gravadas (out. 2026) e processadas com `midia/ferramentas/processar-vozes.sh` (veja `site/audio/LEIA.md`). Faltam só as opcionais: `aurelio-agora-vai` e a narração dos papéis. Roteiro: documento "Última Parada — vozes para o ElevenLabs".
- A narração opcional dos capítulos.
- Ligar Páginas e cupom à conta Diver.
- Salvar o estado do porão (hoje recomeça ao recarregar).
- O porão tem a própria "Linha do tempo" com os papéis e o próprio diário da Marina (na escrivaninha, com frases invertidas); no livro, o diário está na gaveta do ROTA. Decidir se alinha.
- Guia de teste de todos os enigmas: documento "Última Parada — guia de teste".
