#!/usr/bin/env python3
"""Fita de ida, versão 3: tudo colorido. Os glitches e cortes usam os vídeos de interferência do Allisson
(TV-Static-VHS e Morphing White Noise). Na cena da mulher, a interferência embaralha a tela por cima dela;
a frase fica mais audível, misturada com chiado. Glitch final só com interferência + jumpscare."""
import os, subprocess, json

os.chdir(os.path.dirname(os.path.abspath(__file__)))
FX = '/home/claude/vhsfx/target/release/vhsfx'
SONS = 'sons'
TVS = f'{SONS}/tv-static-vhs.mp4'          # interferência colorida (640x360, 30 fps)
WN = f'{SONS}/morphing-white-noise.mp4'     # chiado cinza que se mexe (640x360, 25 fps, sem som)
T = 'tmp-vhs3'; os.makedirs(T, exist_ok=True); os.makedirs('out', exist_ok=True)
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

# ——— 1. a mulher, colorida, mais lenta, com a interferência por cima ———
sh(f'ffmpeg -v error -y -i tmp-montagem/m05.mp4 -filter_complex "[0:v]setpts=PTS/0.8[v];[0:a]atempo=0.8[a]" -map "[v]" -map "[a]" {E} {T}/m05s.mp4')
hora = f'{T}/hora-5885.txt'
open(hora, 'w').write('%{eif:trunc((t+5885)/3600):d:2}:%{eif:mod(trunc((t+5885)/60),60):d:2}:%{eif:mod(trunc(t+5885),60):d:2}')
osd = (f"drawtext=fontfile={FONT}:text='JUN. 7 1996':x=w-tw-34:y=h-78:fontsize=26:fontcolor=white:borderw=2:bordercolor=black@0.8,"
       f"drawtext=fontfile={FONT}:textfile={hora}:expansion=normal:x=w-tw-34:y=h-46:fontsize=26:fontcolor=white:borderw=2:bordercolor=black@0.8")
# a fita "perde o sinal" na cena dela: tracking ruim e mais ruído na simulação
sh(f'ffmpeg -v error -i {T}/m05s.mp4 -vf "scale=640:480:flags=area,{osd},format=rgb24" -f rawvideo -pix_fmt rgb24 - '
   f'| {FX} 640 480 31 1.8 1 '
   f'| ffmpeg -v error -y -f rawvideo -pix_fmt rgb24 -s 640x480 -r {FPS} -i - -i {T}/m05s.mp4 '
   f'-filter_complex "[0:v]{POST}[v];[1:a]aresample=48000,aformat=channel_layouts=stereo[a]" -map "[v]" -map "[a]" {E} -shortest {T}/mulher_base.mp4')
dm = dur(f'{T}/mulher_base.mp4')
# ela aparece limpa e vai sendo engolida pelo chiado preto e branco conforme a câmera chega perto:
# K = quanto do chiado cobre a imagem (0 no começo → ~1 no fim), com trancos que aparecem cada vez mais
K = (f"min(1,0.5+0.38*pow(T/{dm:.3f},1.3)+0.3*gt(sin(T*11),0.5)+0.25*gt(sin(T*29+1),0.75))")
sh(f'ffmpeg -v error -y -i {T}/mulher_base.mp4 -ss 40 -t {dm + 0.2} -i "{WN}" -filter_complex '
   f'"[1:v]{CROP43},scale=960:720,fps={FPS},eq=contrast=1.25,format=gbrp,setpts=PTS-STARTPTS[i];'
   f'[0:v]format=gbrp,setpts=PTS-STARTPTS[m];'
   f"[m][i]blend=all_expr='A*(1-({K}))+B*({K})',format=yuv420p[v]\" "
   f'-map "[v]" -map 0:a {E} -t {dm} {T}/s_mulher.mp4')

# ——— 2. cortes e glitches com os vídeos de interferência ———
ruido(WN, 60.0, 0.5, 51, f'{T}/c1.mp4', 25)
ruido(WN, 101.0, 0.5, 52, f'{T}/c2.mp4', 25)
ruido(WN, 150.0, 0.5, 53, f'{T}/c3.mp4', 25)
# glitch 1 (ônibus → mulher): surto colorido, chiado cinza, surto
tvs2(1.5, 2.0, 0.53, f'{T}/tvs2_g1.mp4'); ruido(f'{T}/tvs2_g1.mp4', 0.0, 0.45, 61, f'{T}/g1a.mp4', 30, 0)
ruido(WN, 30.0, 0.21, 62, f'{T}/g1b.mp4', 25, 0)
ruido(f'{T}/tvs2_g1.mp4', 0.9, 0.46, 63, f'{T}/g1c.mp4', 30, 0)
# glitch final (só interferência, sem ninguém), ~2 s, o surto mais forte cai no pico do jumpscare (~1 s)
tvs2(20.0, 3.0, 0.53, f'{T}/tvs2_g2.mp4'); ruido(f'{T}/tvs2_g2.mp4', 0.0, 0.38, 71, f'{T}/g2a.mp4', 30, 0)
ruido(WN, 80.0, 0.25, 72, f'{T}/g2b.mp4', 25, 0)
ruido(f'{T}/tvs2_g2.mp4', 0.7, 0.54, 73, f'{T}/g2c.mp4', 30, 0)
ruido(WN, 120.0, 0.29, 74, f'{T}/g2d.mp4', 25, 0)
ruido(f'{T}/tvs2_g2.mp4', 1.6, 0.54, 75, f'{T}/g2e.mp4', 30, 0)
sh(f'ffmpeg -v error -y -f lavfi -i color=c=black:s=960x720:r={FPS}:d=0.7 -f lavfi -i anullsrc=r=48000:cl=stereo {E} -t 0.7 {T}/fim_preto.mp4')

# ——— 3. linha do tempo (cenas coloridas já passadas pela fita em tmp-vhs/) ———
SEQ = [('tmp-vhs/v01.mp4', 'paulista'), (f'{T}/c1.mp4', 'corte1'), ('tmp-vhs/v03.mp4', 'onibus'),
       (f'{T}/g1a.mp4', 'glitch1'), (f'{T}/g1b.mp4', ''), (f'{T}/g1c.mp4', ''),
       (f'{T}/s_mulher.mp4', 'mulher'), (f'{T}/c2.mp4', 'corte2'), ('tmp-vhs/v07.mp4', 'janela'),
       (f'{T}/c3.mp4', 'corte3'), ('tmp-vhs/v09.mp4', 'casa'),
       (f'{T}/g2a.mp4', 'glitch2'), (f'{T}/g2b.mp4', ''), (f'{T}/g2c.mp4', ''), (f'{T}/g2d.mp4', ''), (f'{T}/g2e.mp4', ''),
       (f'{T}/fim_preto.mp4', 'fim')]
marks, t = {}, 0.0
for f, tag in SEQ:
    if tag and tag not in marks: marks[tag] = round(t, 3)
    t += dur(f)
total = t
with open(f'{T}/lista.txt', 'w') as fh:
    for f, _ in SEQ: fh.write(f"file '{os.path.abspath(f)}'\n")
sh(f'ffmpeg -v error -y -f concat -safe 0 -i {T}/lista.txt -c copy {T}/base.mp4')
print(json.dumps(marks), round(total, 2))

# ——— 4. som ———
m = marks
voz_t = m['mulher'] + 2.1
js_t = m['glitch2']
ms = lambda x: f'{int(x * 1000)}|{int(x * 1000)}'
filters = [
    # fundo: static_3 o tempo todo, subindo e descendo sem padrão
    f"[1:a]aloop=loop=-1:size=2e9,atrim=0:{total},volume=22dB,volume='0.25+0.75*abs(sin(t*0.71)*sin(t*1.93+1))':eval=frame[bed]",
    # static_2 em rajadas tortas
    f"[2:a]volume=6dB,tremolo=f=7:d=0.7,asplit=3[s2a][s2b][s2c]",
    f"[s2a]atrim=0:2.2,adelay={ms(2.6)}[s2a1]",
    f"[s2b]atrim=3:6.5,asetpts=PTS-STARTPTS,adelay={ms(m['janela'] + 1.5)}[s2b1]",
    f"[s2c]atrim=6:7.6,asetpts=PTS-STARTPTS,adelay={ms(m['onibus'] + 3.2)}[s2c1]",
    # static: estouro alto no glitch 1, estalos curtos, e por baixo do jumpscare
    f"[3:a]volume=12dB,asplit=5[s1a][s1b][s1c][s1d][s1e]",
    f"[s1a]atrim=0:{m['mulher'] - m['glitch1'] + 0.1},volume=7dB,adelay={ms(m['glitch1'])}[s1a1]",
    f"[s1b]atrim=0.5:0.9,asetpts=PTS-STARTPTS,volume=-6dB,adelay={ms(m['paulista'] + 3.1)}[s1b1]",
    f"[s1c]atrim=1:1.5,asetpts=PTS-STARTPTS,volume=-6dB,adelay={ms(m['casa'] + 1.0)}[s1c1]",
    f"[s1d]atrim=0:2.2,volume=-10dB,adelay={ms(js_t)}[s1d1]",
    # na cena da mulher, o chiado sobe e desce com a interferência
    f"[s1e]atrim=0:3,volume=-3dB,tremolo=f=1.9:d=0.8,adelay={ms(m['mulher'])}[s1e1]",
    # a voz: dá para entender com esforço — rádio fraco, cortes leves, misturada com chiado branco
    f"[4:a]atrim=0:2.75,atempo=1.75,volume=16dB,highpass=f=350,lowpass=f=3000,acrusher=bits=7:mode=log:aa=0.7:samples=2,"
    f"vibrato=f=5:d=0.18,tremolo=f=8:d=0.45,volume=-1dB,adelay={ms(voz_t)}[voz]",
    f"anoisesrc=color=white:amplitude=0.12:d=2.4,highpass=f=500,lowpass=f=7000,tremolo=f=3:d=0.5,adelay={ms(voz_t - 0.2)}[vozchi]",
    # o jumpscare no glitch final
    f"[5:a]volume=-1dB,adelay={ms(js_t)}[js]",
    f"[0:a]volume=6dB[fita]",
    f"[fita][bed][s2a1][s2b1][s2c1][s1a1][s1b1][s1c1][s1d1][s1e1][voz][vozchi][js]amix=inputs=13:duration=first:normalize=0,"
    f"alimiter=limit=0.95:level=false[a]",
]
sh(f'ffmpeg -v error -y -i {T}/base.mp4 -i {SONS}/static_3.mp3 -i {SONS}/static_2.mp3 -i {SONS}/static.mp3 '
   f'-i {SONS}/mulher-seu-lugar.mp3 -i {SONS}/jumpscare.mp3 -filter_complex "{";".join(filters)}" '
   f'-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart out/fita-ida-vhs3.mp4')
print('ok', dur('out/fita-ida-vhs3.mp4'), os.path.getsize('out/fita-ida-vhs3.mp4'))
