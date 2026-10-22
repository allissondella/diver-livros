# Vozes do livro e do porão

Ponha aqui os MP3 com o nome do id (por exemplo `ceci-recado-1.mp3`) e rode `python3 livros/ultima-parada/site/build.py`, que atualiza `manifest.json`. O livro toca no play da microfita; o porão toca na secretária, no telefone, no rádio, na TV e nos papéis (o workflow copia esta pasta para `porao/audio/`).

Grave as falas limpas, sem efeito, e passe tudo por `midia/ferramentas/processar-vozes.sh` (pasta com os MP3 brutos → esta pasta):

    sh livros/ultima-parada/midia/ferramentas/processar-vozes.sh "pasta/Sons Livro" livros/ultima-parada/site/audio

- Secretária: o efeito de microfita vai gravado no arquivo (`secretaria.sh`: perto para as saudações e o recado da Odete, longe para os recados da Cecília, relógio para a voz da máquina), com o chiado de verdade (`Chiado secret elet.mp3`) por baixo. O livro e o jogo tocam essas falas sem filtro.
- Rádio da Marina: um eco leve, de outro lugar; o jogo põe o rádio ao vivo por cima.
- Telefone, TV, Fábio, fim: só volume igualado (−18 LUFS); o jogo põe o telefone e a TV ao vivo.
- `grito-falhou`: só o pico do grito, 2,8 s, alto.
- Sons de cena: `bip` (o bipe da secretária), `chiado-microfita` (em loop por baixo do play), `telefone-chamando` (dois toques e o clique de quem atende: o começo da fita no cap. 1 e as ligações do porão; um toque só = a partir de 3,2 s), `telefone-tocando` (a campainha do porão quando a secretária atende sozinha).

O roteiro completo, com o elenco (prompts do Voice Design), o texto de cada fala com as marcações do Eleven v3 e o jeito de dizer, está no documento "Última Parada — vozes para o ElevenLabs".

| Onde | ids |
| --- | --- |
| Secretária (livro caps. 1, 3, 6 e porão) | ceci-saudacao, sec-01, ceci-recado-1 (termina no grito), ceci-grito (opcional: sem ele, o chiado engole), sec-02, ceci-recado-2, sec-03, sec-04, sec-05, odete-recado |
| Telefone do porão | odete-tel-1, fabio-tel, odete-tel-2, odete-tel-3, odete-tel-4, odete-tel-5, odete-tel-de-novo, pm-1, fabio-pm, pm-2 |
| Rádio da oficina | marina-radio-1 a marina-radio-5 |
| Ponto final | ceci-ponto (`plantao` foi gravada, mas a TV não mostra mais o plantão: ninguém sabia do sumiço) |
| Fim do jogo fora do livro | fabio-fim-1, ceci-fim-1, fabio-fim-2 |
| Fim ruim (VOCÊ FALHOU) | grito-falhou (efeito; sem ele, o site usa `sons/jumpscare.mp3`) |
| Sons de cena | bip, chiado-microfita, telefone-chamando, telefone-tocando, gota (a goteira na lata, a cada onze segundos) |
| Fita do Fábio no fim do jogo (opcional) | aurelio-agora-vai ("Agora vai.", voz de homem, pelo rádio) |
| Narração dos papéis (opcional) | papel-01, 02, 06, 07, 09, 10, 11, 12, 13, 14, 15, 16, 17 (os ids da linha do tempo em `jogo/src/js/data.js`) |
