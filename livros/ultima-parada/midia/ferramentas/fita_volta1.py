#!/usr/bin/env python3
"""Fita da volta, versão 1 (22/10): o último trecho da fita do Fábio, que toca no capítulo 9.
Por enquanto só com as duas cenas que saíram da fita de ida: a caixa de chumbo sozinha no banco (05:33)
e o ônibus indo embora (05:40), mais lento, a imagem apagando com a câmera parada. Sem susto no fim.
Faltam (pedir ao Flow): o ponto final às 05:10, o ônibus sem farol abrindo a porta, a mulher atrás da catraca
fechando os olhos, a plataforma da Barra Funda, as costas da Cecília num banco (05:49)."""
import os, subprocess, json

os.chdir(os.path.dirname(os.path.abspath(__file__)))
FX = '/home/claude/vhsfx/target/release/vhsfx'
SONS = 'sons'
TVS = f'{SONS}/tv-static-vhs.mp4'          # interferência colorida (640x360, 30 fps)
WN = f'{SONS}/morphing-white-noise.mp4'     # chiado cinza que se mexe (640x360, 25 fps, sem som)
T = 'tmp-volta1'; os.makedirs(T, exist_ok=True); os.makedirs('out', exist_ok=True)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
FPS = 24
POST = 'eq=saturation=0.8:brightness=0.015:contrast=0.95:gamma=1.04,vignette=PI/5,scale=960:720:flags=bicubic'
ENC = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', str(FPS),
       '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2']
E = ' '.join(ENC)
CROP43 = 'crop=480:360:80:0,scale=640:480:flags=bicubic'

def sh(cmd):
    subprocess.run(cmd, shell=True, check=True)

def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())

def ruido(src, ss, d, seed, out, fps_in, som=0.2):
    """trecho de um vídeo de interferência/chiado, passado pela mesma fita (vhsfx com tracking), com som de chiado"""
    a = f'anoisesrc=color=white:amplitude={som}:d={d},highpass=f=200,lowpass=f=9000' if som else f'anullsrc=r=48000:cl=stereo:d={d}'
    sh(f'ffmpeg -v error -ss {ss} -t {d} -i "{src}" -an -vf "{CROP43},fps={FPS},format=rgb24" -f rawvideo -pix_fmt rgb24 - '
       f'| {FX} 640 480 {seed} 1.2 1 '
       f'| ffmpeg -v error -y -f rawvideo -pix_fmt rgb24 -s 640x480 -r {FPS} -i - -f lavfi -i "{a}" '
       f'-filter_complex "[0:v]{POST}[v];[1:a]aresample=48000,aformat=channel_layouts=stereo[a]" -map "[v]" -map "[a]" {E} -t {d} {out}')


def tvs2(ss, d, off, out):
    """duas cópias da interferência, defasadas em `off` s, somadas (screen) em RGB: surto quase contínuo, 640x360"""
    sh(f'ffmpeg -v error -y -ss {ss} -t {d} -i "{TVS}" -ss {ss + off} -t {d} -i "{TVS}" -filter_complex '
       f'"[0:v]format=gbrp,setpts=PTS-STARTPTS[a];[1:v]format=gbrp,setpts=PTS-STARTPTS[b];[a][b]blend=all_mode=screen,format=yuv420p[v]" '
       f'-map "[v]" -an -c:v libx264 -crf 14 -preset fast -t {d} {out}')

AUDV = 'highpass=f=80,lowpass=f=9000,vibrato=f=4.5:d=0.0012,aresample=48000,aformat=channel_layouts=stereo'

def cena_nova(src, vf_pre, seed, clock, out, noise=1.4):
    """cena nova do Flow: filtros de entrada (corte/velocidade/fade), data da filmadora, fita (vhsfx), som de VHS"""
    hora = f'{T}/hora-{clock}.txt'
    open(hora, 'w').write('%{eif:trunc((t+CLK)/3600):d:2}:%{eif:mod(trunc((t+CLK)/60),60):d:2}:%{eif:mod(trunc(t+CLK),60):d:2}'.replace('CLK', str(clock)))
    osd_ = (f"drawtext=fontfile={FONT}:text='JUN. 7 1996':x=w-tw-34:y=h-78:fontsize=26:fontcolor=white:borderw=2:bordercolor=black@0.8,"
            f"drawtext=fontfile={FONT}:textfile={hora}:expansion=normal:x=w-tw-34:y=h-46:fontsize=26:fontcolor=white:borderw=2:bordercolor=black@0.8")
    tem_som = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', src], capture_output=True).stdout.strip()
    a_in = f'-i {src}' if tem_som else '-f lavfi -i anullsrc=r=48000:cl=stereo'
    sh(f'ffmpeg -v error -i {src} -vf "{vf_pre},scale=640:480:flags=area,{osd_},format=rgb24" -f rawvideo -pix_fmt rgb24 - '
       f'| {FX} 640 480 {seed} {noise} 0 '
       f'| ffmpeg -v error -y -f rawvideo -pix_fmt rgb24 -s 640x480 -r {FPS} -i - {a_in} '
       f'-filter_complex "[0:v]{POST}[v];[1:a]{AUDV}[a]" -map "[v]" -map "[a]" {E} -shortest {out}')


# ——— cenas ———
# a caixa de chumbo sozinha no banco, o ônibus andando (luzes passando na janela); 05:33
cena_nova('raw/vid-09-caixa.mp4', 'trim=0:6.4,setpts=PTS-STARTPTS,crop=912:684:184:18,scale=960:720', 93, 19984, f'{T}/caixa.mp4', 1.5)
# o ônibus indo embora, da calçada; 05:40. Mais lento, e a câmera fica parada depois que ele some
sh(f'ffmpeg -v error -y -i raw/vid-08-vai-embora.mp4 -filter_complex "[0:v]setpts=PTS/0.45,tpad=stop_mode=clone:stop_duration=1.6,fade=out:st=3.0:d=1.9[v];[0:a]atempo=0.5,atempo=0.9,apad=pad_dur=2.0,afade=t=out:st=2.2:d=2.5[a]" -map "[v]" -map "[a]" {E} -t 4.95 {T}/embora_raw.mp4')
cena_nova(f'{T}/embora_raw.mp4', 'crop=960:720:160:0', 92, 20402, f'{T}/embora.mp4')
# cortes de chiado
ruido(WN, 12.0, 0.8, 57, f'{T}/c0.mp4', 25)
ruido(WN, 170.0, 0.5, 55, f'{T}/c1.mp4', 25)
ruido(WN, 190.0, 1.1, 56, f'{T}/c2.mp4', 25, 0.12)
sh(f'ffmpeg -v error -y -f lavfi -i color=c=black:s=960x720:r={FPS}:d=1.6 -f lavfi -i anullsrc=r=48000:cl=stereo {E} -t 1.6 {T}/fim_preto.mp4')

SEQ = [(f'{T}/c0.mp4', 'abre'), (f'{T}/caixa.mp4', 'caixa'), (f'{T}/c1.mp4', 'corte1'), (f'{T}/embora.mp4', 'embora'),
       (f'{T}/c2.mp4', 'corte2'), (f'{T}/fim_preto.mp4', 'fim')]
marks, t = {}, 0.0
for f, tag in SEQ:
    marks[tag] = round(t, 3); t += dur(f)
total = t
with open(f'{T}/lista.txt', 'w') as fh:
    for f, _ in SEQ: fh.write(f"file '{os.path.abspath(f)}'\n")
sh(f'ffmpeg -v error -y -f concat -safe 0 -i {T}/lista.txt -c copy {T}/base.mp4')
print(json.dumps(marks), round(total, 2))

# ——— som: a fita, o chiado de fundo mais baixo que na ida, sem susto. Só o motor indo embora e o silêncio da plataforma ———
m = marks
ms = lambda x: f'{int(x * 1000)}|{int(x * 1000)}'
filters = [
    f"[1:a]aloop=loop=-1:size=2e9,atrim=0:{total - 1.6},volume=16dB,volume='0.3+0.5*abs(sin(t*0.53)*sin(t*1.37+1))':eval=frame,afade=t=out:st={total - 2.6}:d=1.0[bed]",
    f"[2:a]volume=8dB,asplit=2[s1a][s1b]",
    f"[s1a]atrim=0.4:1.0,asetpts=PTS-STARTPTS,volume=2dB,adelay={ms(m['corte1'])}[s1a1]",
    f"[s1b]atrim=1:2.1,asetpts=PTS-STARTPTS,volume=-4dB,adelay={ms(m['corte2'])}[s1b1]",
    f"[0:a]volume=6dB[fita]",
    f"[fita][bed][s1a1][s1b1]amix=inputs=4:duration=first:normalize=0,alimiter=limit=0.95:level=false[a]",
]
sh(f'ffmpeg -v error -y -i {T}/base.mp4 -i {SONS}/static_3.mp3 -i {SONS}/static.mp3 -filter_complex "{";".join(filters)}" '
   f'-map 0:v -map "[a]" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart out/fita-volta-vhs1.mp4')
print('ok', dur('out/fita-volta-vhs1.mp4'), os.path.getsize('out/fita-volta-vhs1.mp4'))
