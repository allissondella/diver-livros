# Diver Livros

Coleção de livros gamificados do Diver (diver.app.br): o livro e uma sala de escape room andam juntos; cada descoberta na sala solta um capítulo, e o capítulo deixa a pista da descoberta seguinte. Os capítulos funcionam como cenas de corte de um jogo. Leitura dá Páginas (pontos) que viram desconto no próximo livro.

## Estrutura
- `formula/` — a receita da coleção (método epistolar de Stoker, loop ler → destravar → descobrir → vincular, tabela de Páginas). Leia antes de começar um título novo.
- `livros/<titulo>/` — um diretório por livro, cada um com o seu `CLAUDE.md`, `livro/` (capítulos em Markdown + `biblia.md`), `jogo/` e `midia/`.
- `compartilhado/` — o que serve a todos os livros: `ferramentas/vhsfx` (simulador de VHS, Rust + ntsc-rs). Futuro: motor do loop, sistema de Páginas, telas de aviso.

## Regras da coleção
- Documentos datados, como no Drácula de Stoker, e uma pessoa da história que conversa com o leitor, como o Brás Cubas de Machado; notas do "Estúdio Diver" entre colchetes.
- Abre com o aviso (o achado) e fecha com a nota final do estúdio: "Não pedimos que ninguém acredite."
- Capítulos curtos (3 a 6 minutos de leitura) terminando em corte; uma pista por capítulo (decifrar, ouvir, encontrar), nunca o mesmo tipo duas vezes seguidas. Toda gravação citada no texto tem play.
- Arquivos pesados (vídeo bruto, fitas montadas) fora do git.

## Títulos
- `livros/ultima-parada/` — terror, São Paulo 1976/1986/1996. Em produção.

## Publicação (teste)
- GitHub Pages, pelo workflow `.github/workflows/pages.yml`, a cada push na `main`: vitrine em `/` (`site/index.html`) e cada livro em `/<titulo>/`.
- Arquivos de mídia que o jogo carrega (fitas, vozes) vão em `livros/<titulo>/midia/publico/` e são copiados junto.
