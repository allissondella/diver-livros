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

## Pendências
- Cena no Google Flow: o letreiro do ônibus piscando/apagando.
- Gravar as vozes no ElevenLabs (guia de vozes).
- Sistema de Páginas (pontos) e cupom.

## Estado em 20/10/2026
- A fita de ida aprovada é `midia/publico/video/fita-ida.mp4` (32 s, já com VHS, cortes, glitch na lâmpada, voz da mulher escondida e jumpscare no fim). Ela é o produto final: o jogo só a toca, SEM o filtro VHS em canvas (`makeVHS`) por cima.
- `jogo/src/js/wave7.js` é o player da fita de ida: o `<video id="tvIda">` (em `body.html`) cobre a tela da TV da abertura; `playFilm(FILM_IDA)` é desviado para ele. Esc interrompe a fita; se o arquivo não carregar, volta a fita desenhada (`FILM_IDA`). Enquanto toca, o chiado e a chuva da abertura ficam mudos.
- Ao clicar na fita, toca `midia/publico/audio/fita-entrando.mp3`, que é o `midia/sons/fita-entrando.mp3` 10 dB mais alto (`ffmpeg -af volume=10dB`, pico em -3 dB).
- `jogo/dist/` não vai mais para o git: o workflow do Pages roda o `build.sh`.
