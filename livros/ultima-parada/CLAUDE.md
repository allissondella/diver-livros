# Última Parada — Diver Livro (livros/ultima-parada)

Livro gamificado de terror. Um caderno encontrado num sebo (1996), com cópias de cadernos de 1976 e 1986. Cada capítulo lido destrava uma parte do porão; cada descoberta no porão, vinculada ao texto, destrava o capítulo seguinte. Coleção "Diver Livros" (Diver, diver.app.br).

## Onde está cada coisa
- `livro/` — capítulos em Markdown (`00-aviso.md` a `06-ultima-parada.md`) e `biblia.md` (método, arquitetura, capítulos, loop, pontos, fórmula). A bíblia é a fonte da verdade.
- `jogo/` — o porão no navegador. `sh jogo/build.sh` gera `jogo/dist/index.html` (um arquivo só). JS por "ondas" em `jogo/src/js/`.
- `midia/ferramentas/` — montagem das fitas VHS: `fita_ida5.py` (versão aprovada), `vhs-real.sh`, e `../../compartilhado/ferramentas/vhsfx/` (Rust, usa ntsc-rs: github.com/valadaptive/ntsc-rs, crate `crates/ntscrs`).
- `midia/sons/` — statics, jumpscare, fita entrando no videocassete, voz da mulher.
- Vídeos brutos do Google Flow (Veo) e fitas montadas NÃO vão para o git (pesados); ficam com o autor.

## Regras do método (Drácula, Bram Stoker)
- Só documentos, nunca narrador. Toda entrada tem data e lugar. Notas do estúdio entre colchetes, frias.
- Ninguém explica o portal. Ninguém diz "Sete Além". Sem vultos nem fantasmas: terror psicológico.
- O número da casa nunca aparece (Rua Monte Alegre existe).
- Personagens brasileiros, coisas brasileiras.
- Do outro lado a hora passa diferente: para Cecília foi uma semana (7 a 13 de junho); deste lado, menos de seis horas.

## Fatos fixos
- Portal: 6 de junho dos anos terminados em 6, abre 23h10, fecha 05h10.
- Aurélio Toledo (41, Ipen) some em 06/06/1976; Marina (18) em 06/06/1986; Cecília (18) em 06/06/1996 e volta com Fábio (19) às 05h10 de 07/06.
- Ônibus 875A-10 Aeroporto–Perdizes; letreiro apaga até "7 A PERDI". Faixa de rádio 23.10. Morse: 06 06 76 · 23 10 · 875A-10.
- Senhas: ROTA (cômoda), 0606 (CP-500), volume sete (estante). Capítulo 3 é lido no CP-500 (PAI.TXT, sem acentos).
- A caixa de chumbo fica no banco do ônibus; a de sapato é "a caixa errada".

## O livro e o porão juntos (`site/` + `jogo/`)
- O site do livro é a casca; o escape room (o porão) roda dentro dele, num iframe: `porao/index.html?livro=1`. No GitHub Pages: livro em `/ultima-parada/`, porão em `/ultima-parada/porao/` (o workflow gera o jogo com `jogo/build.sh`).
- Abertura: aviso (vermelho) → nota do estúdio (vermelho) → a fita na TV → "Descer ao porão" → o porão no escuro.
- Cada marco do porão solta uma página do caderno (a folha cai na tela, com a cena e "Ler agora" / "Continuar no porão"):
  luz acesa (fusível) → cap. 1 (vermelho) · cadeado ROTA da cômoda → cap. 2 · senha 0606 no CP-500 → cap. 3 · caixa de chumbo na bancada → cap. 4 · estante gira (volume sete) → cap. 5 · 05h10, a caixa no ônibus → cap. 6, que abre sozinho → fim.
- Os capítulos saem sempre em ordem: um marco feito antes da hora fica guardado e solta junto com o anterior ("Capítulos 4 a 5").
- Enquanto a pessoa lê (ou está com o menu Caderno aberto), o relógio da ficção e o som do porão param.
- Ponte do lado do jogo: `jogo/src/js/livro.js` (pula a abertura da TV, avisa os marcos com postMessage, pausa/continua, entrega o final ao livro). Fora do livro, o jogo funciona sozinho como antes.
- Lado do livro: `site/app.js`. Progresso no `localStorage` (`ultima-parada:livro`). O estado do jogo não é salvo: recarregar a página recomeça o porão, mas os capítulos já soltos continuam.
- `site/build.py` gera `site/capitulos.js` a partir de `livro/0N-*.md`. Rode depois de mudar um capítulo (o workflow também roda).
- Páginas: ler capítulo 10 (só com tempo suficiente: palavras × 0,1 s), cada marco do porão 5, fita até o fim 5, terminar 20. Máximo 115. Cupom provisório: ≥90 → ULTIMAPARADA10, ≥105 → ULTIMAPARADA15.
- Vídeo: `site/video/fita-ida.mp4` (H.264) e `.webm` (reserva). Som da fita entrando: `site/sons/fita-entrando.mp3`.
- Teste local: `sh jogo/build.sh && mkdir -p site/porao && cp jogo/dist/index.html site/porao/` e sirva a pasta `site/` (`python3 -m http.server`).

## A fita (`site/video/fita-ida.mp4`, 49 s)
Montada por `midia/ferramentas/fita_ida6.py` (precisa dos vídeos brutos do Flow, que ficam fora do git, e do vhsfx compilado):
Paulista → glitch → ônibus chegando → letreiro apagando até "7 A PERDI" → chiado → corredor até a mulher (frase escondida no chiado) → a lâmpada estoura (glitch) → ela mais perto → chiado → janela → chiado → a casa → chiado → o ônibus indo embora (05:40) → chiado → a caixa de chumbo sozinha no banco, escurecendo → glitch + jumpscare → preto.

## Pendências
- Gravar as vozes no ElevenLabs (guia de vozes) e a narração opcional dos capítulos.
- Ligar Páginas e cupom à conta Diver.
- Salvar o estado do porão (hoje recomeça ao recarregar).
- O porão tem a própria "Linha do tempo" com os papéis; decidir se ela fica ou se o caderno basta.
