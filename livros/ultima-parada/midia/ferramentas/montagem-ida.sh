#!/bin/sh
# Montagem simples da fita de ida: só os vídeos colados, 4:3 (960x720), com cortes de chiado de TV entre eles.
# Sem filtro de VHS: o filtro vem depois, no Gemini/Flow.
set -e
cd "$(dirname "$0")"
R=raw; T=tmp-montagem; mkdir -p $T out
V="fps=24,format=yuv420p,setsar=1"
A="aresample=48000,aformat=channel_layouts=stereo"
enc="-c:v libx264 -preset slow -crf 18 -c:a aac -b:a 160k -ar 48000 -ac 2"
C="960:720:160:0"

clip() { # arquivo início duração saída
  ffmpeg -v error -y -ss $2 -t $3 -i $R/$1 -vf "crop=$C,scale=960:720,$V" -af "$A" $enc $T/$4.mp4
}
chiado() { # duração saída — chiado de TV sem sinal, com o som
  ffmpeg -v error -y -f lavfi -i "color=c=gray:s=960x720:r=24:d=$1" \
    -f lavfi -i "anoisesrc=color=white:amplitude=0.22:d=$1,highpass=f=200" \
    -vf "noise=alls=100:allf=t+u,hue=s=0,eq=contrast=1.4:brightness=-0.05,$V" -af "$A" $enc -t $1 $T/$2.mp4
}

clip vid-01-ida-paulista.mp4 0 4.7 m01   # a Paulista na garoa (antes de aparecer o rapaz)
chiado 0.5 m02
clip vid-02-ida-chega.mp4 0 6.9 m03      # o ônibus chega (antes do salto do fim)
chiado 0.5 m04
clip vid-04n-ida-mulher.mp4 0 3.9 m05    # o corredor até a mulher
chiado 0.5 m06
clip vid-05-ida-janela.mp4 0 8 m07       # a janela: a avenida vira a rua das casas
chiado 0.5 m08
clip vid-06c-ida-casa.mp4 0 3.3 m09      # a casa (antes do quadrado azul)
chiado 0.8 m10

ls $T/m*.mp4 | sort | sed "s#^$T/#file '#; s#\$#'#" > $T/lista.txt
(cd $T && ffmpeg -v error -y -f concat -safe 0 -i lista.txt -c copy -movflags +faststart ../out/fita-ida-montagem.mp4)
ffprobe -v error -show_entries format=duration,size -of csv=p=0 out/fita-ida-montagem.mp4
