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

## O site do livro (`site/`)
- É o produto principal: o livro como site, publicado em `/ultima-parada/`. O jogo antigo do porão fica em `/ultima-parada/porao/`.
- Fluxo: aviso (vermelho) → nota do estúdio (vermelho) → cap. 1 (vermelho) → a fita (TV, vídeo) → vínculo 1 → cap. 2 → vínculo 2 → … → cap. 6 → fim (Páginas e cupom). Capítulos 2 a 6: branco no preto, com botão "Fundo claro".
- `site/build.py` gera `site/capitulos.js` a partir de `livro/0N-*.md` (só o texto em citação `>` e o bloco de código do cap. 3; ignora "Decisões de escrita"). Rode depois de mudar qualquer capítulo. O workflow também roda.
- `site/app.js`: motor (etapas, vínculos, Páginas, sumário, tema). Progresso no `localStorage` (`ultima-parada:progresso`).
- Vínculos: v1 cadeado ROTA · v2 rádio na faixa 23.10 (morse 06 06 96 · 23 10 · 875A 10) + senha 0606 no CP-500 · v3 o trecho dos "onze quilos" · v4 corredor, 5 vezes à esquerda · v5 os dois papéis do corredor. Pista: botão ou 2 erros (tira os pontos do vínculo).
- Páginas: ler capítulo 10 (só se ficou tempo suficiente: palavras × 0,1 s), vínculo sem pista 5, fita até o fim 5, terminar 20, sem nenhuma pista 15. Máximo 130. Cupom: ≥100 → ULTIMAPARADA10, ≥120 → ULTIMAPARADA15 (códigos provisórios; falta ligar ao Diver).
- Vídeo: `site/video/fita-ida.mp4` (H.264) e `.webm` (VP9, reserva). Som da fita entrando: `site/sons/fita-entrando.mp3`.

## A fita (`site/video/fita-ida.mp4`, 49 s)
Montada por `midia/ferramentas/fita_ida6.py` (precisa dos vídeos brutos do Flow, que ficam fora do git, e do vhsfx compilado):
Paulista → glitch → ônibus chegando → letreiro apagando até "7 A PERDI" → chiado → corredor até a mulher (frase escondida no chiado) → a lâmpada estoura (glitch) → ela mais perto → chiado → janela → chiado → a casa → chiado → o ônibus indo embora (05:40) → chiado → a caixa de chumbo sozinha no banco, escurecendo → glitch + jumpscare → preto.

## Pendências
- Gravar as vozes no ElevenLabs (guia de vozes) e a narração opcional dos capítulos.
- Ligar Páginas e cupom à conta Diver.
- Decidir se o porão (jogo) continua como extra ou se os vínculos do site bastam.
