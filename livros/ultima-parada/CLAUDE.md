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
- Integrar `fita-ida-vhs5.mp4` no jogo (som `fita-entrando.mp3` ao clicar na fita).
- Gravar as vozes no ElevenLabs (guia de vozes).
- Sistema de Páginas (pontos) e cupom.
