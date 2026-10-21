# Vozes do livro e do porão

Ponha aqui os MP3 com o nome do id (por exemplo `ceci-recado-1.mp3`) e rode `python3 livros/ultima-parada/site/build.py`, que atualiza `manifest.json`. O livro toca no play da microfita; o porão toca na secretária, no telefone, no rádio, na TV e nos papéis (o workflow copia esta pasta para `porao/audio/`).

Grave as falas limpas, sem efeito: o livro e o jogo aplicam a banda de telefone, o rádio, o chiado e o bipe.

O roteiro completo, com o elenco (prompts do Voice Design), o texto de cada fala com as marcações do Eleven v3 e o jeito de dizer, está no documento "Última Parada — vozes para o ElevenLabs".

| Onde | ids |
| --- | --- |
| Secretária (livro caps. 1, 3, 6 e porão) | ceci-saudacao, sec-01, ceci-recado-1, ceci-grito (efeito), sec-02, ceci-recado-2, sec-03, sec-04, sec-05, odete-recado |
| Telefone do porão | odete-tel-1, fabio-tel, odete-tel-2, odete-tel-3, odete-tel-4, odete-tel-5, odete-tel-de-novo, pm-1, fabio-pm, pm-2 |
| Rádio da oficina | marina-radio-1 a marina-radio-5 |
| TV e ponto final | plantao, ceci-ponto |
| Fim do jogo fora do livro | fabio-fim-1, ceci-fim-1, fabio-fim-2 |
| Fim ruim (VOCÊ FALHOU) | grito-falhou (efeito; sem ele, o site usa `sons/jumpscare.mp3`) |
| Narração dos papéis (opcional) | papel-02 a papel-15 |
