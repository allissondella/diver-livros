# Diver Livros

Coleção de livros gamificados do Diver (diver.app.br): o leitor lê um capítulo, ele destrava uma sala; uma descoberta na sala, vinculada ao texto, destrava o capítulo seguinte. Leitura dá Páginas (pontos) que viram desconto no próximo livro.

## Estrutura
- `formula/` — a receita da coleção (método epistolar de Stoker, loop ler → destravar → descobrir → vincular, tabela de Páginas). Leia antes de começar um título novo.
- `livros/<titulo>/` — um diretório por livro, cada um com o seu `CLAUDE.md`, `livro/` (capítulos em Markdown + `biblia.md`), `jogo/` e `midia/`.
- `compartilhado/` — o que serve a todos os livros: `ferramentas/vhsfx` (simulador de VHS, Rust + ntsc-rs). Futuro: motor do loop, sistema de Páginas, telas de aviso.

## Regras da coleção
- Só documentos, sem narrador; toda entrada datada; notas do "Estúdio Diver" entre colchetes.
- Abre com aviso + nota do estúdio (o achado) e fecha com "Não pedimos que ninguém acredite."
- Capítulos curtos (2 a 5 páginas) terminando em corte; um vínculo por capítulo (decifrar, ouvir, encontrar), nunca o mesmo duas vezes seguidas.
- Arquivos pesados (vídeo bruto, fitas montadas) fora do git.

## Títulos
- `livros/ultima-parada/` — terror, São Paulo 1976/1986/1996. Em produção.
