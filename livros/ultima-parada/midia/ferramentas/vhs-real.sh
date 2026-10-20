#!/bin/sh
# Fita de ida com cara de VHS de verdade: simulação NTSC/VHS (ntsc-rs, via ../../vhsfx) quadro a quadro,
# data de filmadora gravada ANTES da fita (então ela também se degrada), som de trilha linear de VHS.
set -e
cd "$(dirname "$0")"
FX=/home/claude/vhsfx/target/release/vhsfx
SRC=tmp-montagem; T=tmp-vhs; mkdir -p $T out
FONT=/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf
POST="eq=saturation=0.8:brightness=0.015:contrast=0.95:gamma=1.04,vignette=PI/5,scale=960:720:flags=bicubic,format=yuv420p"
AUD="highpass=f=80,lowpass=f=9000,vibrato=f=4.5:d=0.0012,aresample=48000,aformat=channel_layouts=stereo"
enc="-c:v libx264 -preset slow -crf 18 -c:a aac -b:a 160k -ar 48000 -ac 2"

osd() { # segundos do relógio no início do trecho → filtros de data/hora da filmadora (texto em arquivo, sem briga de escape)
  f=$T/hora-$1.txt
  printf '%%{eif:trunc((t+%s)/3600):d:2}:%%{eif:mod(trunc((t+%s)/60),60):d:2}:%%{eif:mod(trunc(t+%s),60):d:2}' $1 $1 $1 > $f
  echo "drawtext=fontfile=$FONT:text='JUN. 7 1996':x=w-tw-34:y=h-78:fontsize=26:fontcolor=white:borderw=2:bordercolor=black@0.8,drawtext=fontfile=$FONT:textfile=$f:expansion=normal:x=w-tw-34:y=h-46:fontsize=26:fontcolor=white:borderw=2:bordercolor=black@0.8"
}
cena() { # entrada saída semente ruído relógio
  ffmpeg -v error -i $SRC/$1.mp4 -vf "scale=640:480:flags=area,$(osd $5),format=rgb24" -f rawvideo -pix_fmt rgb24 - \
  | $FX 640 480 $3 $4 0 \
  | ffmpeg -v error -y -f rawvideo -pix_fmt rgb24 -s 640x480 -r 24 -i - -i $SRC/$1.mp4 \
      -f lavfi -i "anoisesrc=color=pink:amplitude=0.012" \
      -filter_complex "[0:v]$POST[v];[1:a]$AUD[a1];[2:a]aformat=channel_layouts=stereo[n];[a1][n]amix=inputs=2:duration=first:normalize=0[a]" \
      -map "[v]" -map "[a]" $enc -shortest $T/$2.mp4
}
chiado() { # duração saída semente — fita sem sinal: chiado passado pela mesma simulação, com tracking
  ffmpeg -v error -f lavfi -i "color=c=gray:s=640x480:r=24:d=$1" -vf "noise=alls=100:allf=t+u,hue=s=0,scale=213:480:flags=area,scale=640:480:flags=neighbor,eq=contrast=1.9:brightness=-0.04,format=rgb24" -f rawvideo -pix_fmt rgb24 - \
  | $FX 640 480 $3 2.0 1 \
  | ffmpeg -v error -y -f rawvideo -pix_fmt rgb24 -s 640x480 -r 24 -i - \
      -f lavfi -i "anoisesrc=color=white:amplitude=0.2:d=$1,highpass=f=200,lowpass=f=9000" \
      -filter_complex "[0:v]$POST[v];[1:a]aresample=48000,aformat=channel_layouts=stereo[a]" -map "[v]" -map "[a]" $enc -t $1 $T/$2.mp4
}

cena m01 v01 11 1.3 5470   # 01:31:10 a Paulista
chiado 0.5 v02 21
cena m03 v03 12 1.3 5622   # 01:33:42 o ônibus chega
chiado 0.5 v04 22
cena m05 v05 13 1.5 5885   # 01:38:05 a mulher
chiado 0.5 v06 23
cena m07 v07 14 1.3 6080   # 01:41:20 a janela
chiado 0.5 v08 24
cena m09 v09 15 1.5 6768   # 01:52:48 a casa
chiado 0.8 v10 25

ls $T/v*.mp4 | sort | sed "s#^$T/#file '#; s#\$#'#" > $T/lista.txt
(cd $T && ffmpeg -v error -y -f concat -safe 0 -i lista.txt -c copy -movflags +faststart ../out/fita-ida-vhs.mp4)
ffprobe -v error -show_entries format=duration,size -of csv=p=0 out/fita-ida-vhs.mp4
