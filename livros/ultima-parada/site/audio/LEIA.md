# Vozes do livro e do porão

Ponha aqui os MP3 com o nome do id (por exemplo `ceci-recado-1.mp3`) e rode `python3 livros/ultima-parada/site/build.py`, que atualiza `manifest.json`. O livro toca no play da microfita; o porão toca na secretária e no rádio (o workflow copia esta pasta para `porao/audio/`).

Grave as falas limpas, sem efeito: o livro e o jogo aplicam a banda de telefone, o chiado e o bipe.

| id | quem | o que diz |
| --- | --- | --- |
| ceci-saudacao | Cecília | "Oi, aqui é a Cecília. Ninguém pode atender agora. Deixa seu recado depois do bipe." |
| sec-01 | relógio falante | "Mensagem um. Sexta-feira, zero hora e quarenta e um minutos." |
| ceci-recado-1 | Cecília | "Fábio? É a Ceci. Eu tô na última parada. Não dá pra explicar. Eu tenho pouco tempo. Fecha às cinco e dez. Vem. Desce no porão. Lê o diaaaah—" |
| ceci-grito | Cecília (efeito) | o grito, longe, cortado seco |
| sec-02 | relógio falante | "Mensagem dois. Data e hora não registradas." |
| ceci-recado-2 | Cecília | "Fábio. Eu trouxe a caixa errada. A certa tá embaixo da bancada. Não abre." |
| sec-03 | relógio falante | "Fim das mensagens." |
| sec-04 | relógio falante | "Você tem uma mensagem." |
| sec-05 | relógio falante | "Segunda-feira, vinte de maio, dezesseis horas e dois minutos." |
| odete-recado | Dona Odete | "Cecília? É a Odete, da frente. Eu fiquei pensando no que você perguntou. Menina, não desce mais lá. A outra também era teimosa. E o pai dela também." |

O jogo usa outras vozes (rádio da Marina, ligações): veja os ids `v:` em `jogo/src/js/wave3.js`, `wave4.js` e `wave6.js`.
