#!/bin/sh
# Prepara as vozes gravadas no ElevenLabs para o livro e o jogo.
# Uso: sh processar-vozes.sh "pasta/com/os/mp3" livros/ultima-parada/site/audio
# Secretária: efeito de microfita (perto, longe, relógio). Rádio da Marina: um eco leve, de outro lugar.
# O resto: só volume igualado (o jogo põe o telefone, o rádio e a TV ao vivo).
set -e
ENT="$1"; SAI="$2"; AQUI=$(dirname "$0"); mkdir -p "$SAI"
CHIADO="$ENT/Chiado secret elet.mp3"; [ -f "$CHIADO" ] || CHIADO=""
nivela() { ffmpeg -hide_banner -loglevel error -y -i "$1" -af "aformat=channel_layouts=mono,afade=t=in:d=0.02,loudnorm=I=${3:--18}:TP=-2" -ar 44100 -ac 1 -b:a 128k "$2"; }
for id in ceci-saudacao odete-recado; do sh "$AQUI/secretaria.sh" "$ENT/$id.mp3" "$SAI/$id.mp3" perto "$CHIADO"; done
for id in ceci-recado-1 ceci-recado-2; do sh "$AQUI/secretaria.sh" "$ENT/$id.mp3" "$SAI/$id.mp3" longe "$CHIADO"; done
for id in sec-01 sec-02 sec-03 sec-04 sec-05; do sh "$AQUI/secretaria.sh" "$ENT/$id.mp3" "$SAI/$id.mp3" relogio "$CHIADO"; done
for id in marina-radio-1 marina-radio-2 marina-radio-3 marina-radio-4 marina-radio-5; do
  ffmpeg -hide_banner -loglevel error -y -i "$ENT/$id.mp3" -af "aformat=channel_layouts=mono,apad=pad_dur=0.4,aecho=0.85:0.55:70|140:0.22|0.12,vibrato=f=0.5:d=0.03,loudnorm=I=-18:TP=-2" -ar 44100 -ac 1 -b:a 128k "$SAI/$id.mp3"; done
for id in odete-tel-1 odete-tel-2 odete-tel-3 odete-tel-4 odete-tel-5 odete-tel-de-novo pm-1 pm-2 fabio-tel fabio-pm plantao ceci-ponto ceci-fim-1 fabio-fim-1 fabio-fim-2; do
  nivela "$ENT/$id.mp3" "$SAI/$id.mp3"; done
# o grito do VOCÊ FALHOU: só o pico, alto
ffmpeg -hide_banner -loglevel error -y -ss 5.3 -t 2.8 -i "$ENT/grito-falhou.mp3" -af "afade=t=out:st=2.3:d=0.5,loudnorm=I=-11:TP=-1" -ar 44100 -b:a 160k "$SAI/grito-falhou.mp3"
# sons de cena
ffmpeg -hide_banner -loglevel error -y -ss 0.05 -t 1.0 -i "$ENT/Bip.mp3" -af "afade=t=out:st=0.85:d=0.15,volume=-8dB" -ar 44100 -ac 1 -b:a 128k "$SAI/bip.mp3"
# telefone chamando (quem liga ouve): dois toques e o clique de quem atende. Volume pelo pico (o loudnorm sobe o silêncio entre os toques)
pico() { ffmpeg -hide_banner -i "$1" -af astats=metadata=0 -f null - 2>&1 | grep -m1 "Peak level dB" | awk '{print $NF}'; }
TMP=$(mktemp -d)
ffmpeg -hide_banner -loglevel error -y -i "$ENT/Telefone chamando.mp3" -filter_complex "[0:a]aformat=channel_layouts=mono,asplit=2[x][y];[x]atrim=2.2:5.4,asetpts=N/SR/TB[a];[y]atrim=14.85:17.75,asetpts=N/SR/TB,afade=t=out:st=2.6:d=0.3[b];[a][b]concat=n=2:v=0:a=1[o]" -map "[o]" -ar 44100 -ac 1 -b:a 128k "$TMP/ch.mp3"
G=$(python3 -c "print(round(-7-($(pico "$TMP/ch.mp3")),1))"); ffmpeg -hide_banner -loglevel error -y -i "$TMP/ch.mp3" -af "volume=${G}dB" -ar 44100 -b:a 128k "$SAI/telefone-chamando.mp3"
# telefone tocando (a campainha do porão)
G=$(python3 -c "print(round(-6-($(pico "$ENT/Telefone tocando.mp3")),1))"); ffmpeg -hide_banner -loglevel error -y -t 3.3 -i "$ENT/Telefone tocando.mp3" -af "aformat=channel_layouts=mono,volume=${G}dB,afade=t=out:st=2.9:d=0.4" -ar 44100 -b:a 128k "$SAI/telefone-tocando.mp3"
rm -rf "$TMP"
[ -n "$CHIADO" ] && ffmpeg -hide_banner -loglevel error -y -i "$CHIADO" -ar 44100 -ac 1 -b:a 128k "$SAI/chiado-microfita.mp3"
echo "pronto: $(ls "$SAI"/*.mp3 | wc -l) arquivos em $SAI"
