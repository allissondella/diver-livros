#!/bin/sh
# Deixa uma fala gravada limpa (ElevenLabs) com som de secretária eletrônica de microfita, 1994.
# Uso: sh secretaria.sh entrada.mp3 saida.mp3 [perto|longe|relogio] [chiado.mp3]
#   chiado.mp3 (opcional): o chiado de microfita, em loop por baixo da voz (sem ele, usa ruído rosa)
#   perto   — a saudação gravada na própria máquina (ceci-saudacao, odete-recado)
#   longe   — recado que chega pela linha, "longe e perto ao mesmo tempo" (ceci-recado-1, ceci-recado-2)
#   relogio — o relógio falante da máquina (sec-01 a sec-05): mais seco e digital
set -e
ENT="$1"; SAI="$2"; MODO="${3:-perto}"; CHIADO="$4"
case "$MODO" in
  perto)   BANDA="highpass=f=280,lowpass=f=3600"; RUIDO=0.012; WOW="vibrato=f=0.7:d=0.025" ;;
  longe)   BANDA="highpass=f=380,lowpass=f=2700"; RUIDO=0.030; WOW="vibrato=f=0.9:d=0.045" ;;
  relogio) BANDA="highpass=f=400,lowpass=f=3200,acrusher=bits=8:mode=log:aa=1:mix=0.35"; RUIDO=0.008; WOW="anull" ;;
  *) echo "modo: perto, longe ou relogio"; exit 1 ;;
esac
if [ -n "$CHIADO" ]; then FONTE="-stream_loop -1 -i"; FONTE_ARQ="$CHIADO"; GANHO=$(python3 -c "print(round($RUIDO*14,2))"); else FONTE="-f lavfi -i"; FONTE_ARQ="anoisesrc=color=pink:amplitude=$RUIDO:sample_rate=44100"; GANHO=1; fi
ffmpeg -hide_banner -loglevel error -y -i "$ENT" $FONTE "$FONTE_ARQ" -filter_complex "
  [0:a]aformat=channel_layouts=mono,aresample=44100,adelay=250,apad=pad_dur=0.35,
       aresample=8000,aresample=44100,$BANDA,$WOW,
       acompressor=threshold=-22dB:ratio=4:attack=5:release=120,
       asoftclip=type=tanh,volume=1.4[voz];
  [1:a]aformat=channel_layouts=mono,aresample=44100,highpass=f=500,lowpass=f=6000,volume=$GANHO[chiado];
  [voz][chiado]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,
       afade=t=in:d=0.05,loudnorm=I=-18:TP=-2[out]" -map "[out]" -ac 1 -ar 44100 -b:a 128k "$SAI"
echo "pronto: $SAI ($MODO)"
