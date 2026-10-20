#!/bin/sh
# Monta as fitas com os vídeos do Flow: 4:3, 320x240, cortes de chiado entre as cenas.
# Saída: media/video/fita-ida.mp4 (a linha do tempo do arquivo = a do FILM_IDA em films/wave7)
set -e
cd "$(dirname "$0")"
R=raw; T=tmp; O=video
mkdir -p $T $O
V="fps=24,format=yuv420p,setsar=1"
A="aresample=48000,aformat=channel_layouts=stereo"
enc="-c:v libx264 -preset veryfast -crf 26 -c:a aac -b:a 96k -ar 48000 -ac 2"

# trecho de vídeo: entrada, início, duração, corte (crop), velocidade, saída
clip() { # $1 arquivo $2 ss $3 dur $4 crop $5 speed $6 out
  ffmpeg -v error -y -ss $2 -t $3 -i $R/$1 -filter_complex \
    "[0:v]crop=$4,scale=640:480,setpts=PTS/$5,$V[v];[0:a]atempo=$5,$A[a]" \
    -map "[v]" -map "[a]" $enc $T/$6.mp4
}
# tela preta: duração, saída, volume do chiado (0 = silêncio)
black() {
  ffmpeg -v error -y -f lavfi -i "color=c=black:s=640x480:r=24:d=$1" \
    -f lavfi -i "anoisesrc=color=pink:amplitude=$3:d=$1,highpass=f=300,lowpass=f=7000,tremolo=f=11:d=.7" \
    -map 0:v -map 1:a -vf "$V" -af "$A" $enc -t $1 $T/$2.mp4
}
# quadro congelado: arquivo, instante, duração, crop, saída
still() {
  ffmpeg -v error -y -ss $2 -i $R/$1 -frames:v 1 -vf "crop=$4,scale=640:480" $T/$5.png
  ffmpeg -v error -y -loop 1 -t $3 -i $T/$5.png -f lavfi -i "anoisesrc=color=pink:amplitude=.05:d=$3,lowpass=f=3000" \
    -map 0:v -map 1:a -vf "$V" -af "$A" $enc -t $3 $T/$5.mp4
}

C43=960:720:160:0
# ——— fita de ida (50 s) ———
black 4 i00 0                                  # 0–4: PLAY e chiado (desenhados por cima)
clip vid-01-ida-paulista.mp4 0 4.7 $C43 0.8 i01  # 4–9.875
black 0.625 i02 0.35                             # corte
clip vid-02-ida-chega.mp4 0 8 $C43 1 i03         # 10.5–18.5 (falha interna em 17.4–17.9)
black 0.6 i04 0.35                               # corte
clip vid-04-ida-mulher.mp4 0 7.2 936:702:172:9 1 i05  # 19.1–26.3 (antes do som estranho do fim)
black 0.4 i06 0.35                               # corte 26.3–26.7
clip vid-05-ida-janela.mp4 0 8 $C43 0.75 i07    # 26.7–37.367
black 1.633 i08 0.3                             # corte 37.367–39
black 4 i09 0                                  # 39–43: a casa (desenhada no jogo até chegar o vídeo 06)
still vid-04-ida-mulher.mp4 7.0 1.5 936:702:172:9 i10  # 43–44.5: ela ainda está olhando
black 3.5 i11 0                                # 44.5–48: a casa
black 2 i12 0.35                                # 48–50: chiado e STOP
ls $T/i*.mp4 | sort | sed "s#^#file '#; s#\$#'#; s#'$T/#'#" > $T/ida.txt
(cd $T && ffmpeg -v error -y -f concat -safe 0 -i ida.txt -c copy -movflags +faststart ../$O/fita-ida.mp4)
ffprobe -v error -show_entries format=duration,size -of csv=p=0 $O/fita-ida.mp4
# versão WebM (VP9/Opus) para navegadores sem H.264
ffmpeg -v error -y -i $O/fita-ida.mp4 -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -deadline good -cpu-used 4 -c:a libopus -b:a 80k $O/fita-ida.webm
