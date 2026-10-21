#!/usr/bin/env python3
"""Fita de ida, versão 4 (vídeo novo da mulher no corredor comprido; glitch só quando a lâmpada estoura). Base da versão 3: tudo colorido. Os glitches e cortes usam os vídeos de interferência do Allisson
(TV-Static-VHS e Morphing White Noise). Na cena da mulher, a interferência embaralha a tela por cima dela;
a frase fica mais audível, misturada com chiado. Glitch final só com interferência + jumpscare."""
import os, subprocess, json

os.chdir(os.path.dirname(os.path.abspath(__file__)))
FX = '/home/claude/vhsfx/target/release/vhsfx'
SONS = 'sons'
TVS = f'{SONS}/tv-static-vhs.mp4'          # interferência colorida (640x360, 30 fps)
WN = f'{SONS}/morphing-white-noise.mp4'     # chiado cinza que se mexe (640x360, 25 fps, sem som)
T = 'tmp-vhs6'; os.makedirs(T, exist_ok=True); os.makedirs('out', exist_ok=True)
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

# ——— 1. a mulher: o vídeo novo (corredor comprido, ela espiando por cima do banco), passado pela fita ———
SRCM = 'raw/vid-04f-ida-mulher.mp4'
hora = f'{T}/hora-5885.txt'
open(hora, 'w').write('%{eif:trunc((t+5885)/3600):d:2}:%{eif:mod(trunc((t+5885)/60),60):d:2}:%{eif:mod(trunc(t+5885),60):d:2}')
osd = (f"drawtext=fontfile={FONT}:text='JUN. 7 1996':x=w-tw-34:y=h-78:fontsize=26:fontcolor=white:borderw=2:bordercolor=black@0.8,"
       f"drawtext=fontfile={FONT}:textfile={hora}:expansion=normal:x=w-tw-34:y=h-46:fontsize=26:fontcolor=white:borderw=2:bordercolor=black@0.8")
AUDV = 'highpass=f=80,lowpass=f=9000,vibrato=f=4.5:d=0.0012,aresample=48000,aformat=channel_layouts=stereo'
sh(f'ffmpeg -v error -i {SRCM} -vf "crop=960:720:160:0,scale=640:480:flags=area,{osd},format=rgb24" -f rawvideo -pix_fmt rgb24 - '
   f'| {FX} 640 480 31 1.4 0 '
   f'| ffmpeg -v error -y -f rawvideo -pix_fmt rgb24 -s 640x480 -r {FPS} -i - -i {SRCM} '
   f'-filter_complex "[0:v]{POST}[v];[1:a]{AUDV}[a]" -map "[v]" -map "[a]" {E} -shortest {T}/mulher_full.mp4')

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

# a lâmpada estoura em ~4,5 s: a fita corta no glitch ali e volta já mais perto dela
LAMP = 4.62
sh(f'ffmpeg -v error -y -t {LAMP} -i {T}/mulher_full.mp4 {E} {T}/s_mulher1.mp4')
sh(f'ffmpeg -v error -y -ss 5.3 -i {T}/mulher_full.mp4 {E} {T}/s_mulher2.mp4')

# ——— 2. cortes e glitches com os vídeos de interferência ———
sh(f'ffmpeg -v error -y -t 3.0 -i tmp-vhs/v01.mp4 {E} {T}/p1.mp4')          # a Paulista, sem tanta imagem parada
sh(f'ffmpeg -v error -y -ss 1.8 -i tmp-vhs/v03.mp4 {E} {T}/onibus.mp4')      # o ônibus já vindo
tvs2(3.6, 1.5, 0.53, f'{T}/tvs2_g0.mp4'); ruido(f'{T}/tvs2_g0.mp4', 0.1, 0.55, 81, f'{T}/g0.mp4', 30, 0)
ruido(WN, 101.0, 0.5, 52, f'{T}/c2.mp4', 25)
ruido(WN, 150.0, 0.5, 53, f'{T}/c3.mp4', 25)
ruido(WN, 30.0, 0.5, 54, f'{T}/c4.mp4', 25)
# glitch da lâmpada estourando: surto colorido, chiado cinza, surto (~0,9 s)
tvs2(1.5, 2.0, 0.53, f'{T}/tvs2_g1.mp4'); ruido(f'{T}/tvs2_g1.mp4', 0.0, 0.5, 61, f'{T}/g1a.mp4', 30, 0)
ruido(WN, 45.0, 0.13, 62, f'{T}/g1b.mp4', 25, 0)
ruido(f'{T}/tvs2_g1.mp4', 0.9, 0.29, 63, f'{T}/g1c.mp4', 30, 0)
# glitch final (só interferência, sem ninguém), ~2 s, o surto mais forte cai no pico do jumpscare (~1 s)
tvs2(20.0, 3.0, 0.53, f'{T}/tvs2_g2.mp4'); ruido(f'{T}/tvs2_g2.mp4', 0.0, 0.38, 71, f'{T}/g2a.mp4', 30, 0)
ruido(WN, 80.0, 0.25, 72, f'{T}/g2b.mp4', 25, 0)
ruido(f'{T}/tvs2_g2.mp4', 0.7, 0.54, 73, f'{T}/g2c.mp4', 30, 0)
ruido(WN, 120.0, 0.29, 74, f'{T}/g2d.mp4', 25, 0)
ruido(f'{T}/tvs2_g2.mp4', 1.6, 0.54, 75, f'{T}/g2e.mp4', 30, 0)
sh(f'ffmpeg -v error -y -f lavfi -i color=c=black:s=960x720:r={FPS}:d=0.7 -f lavfi -i anullsrc=r=48000:cl=stereo {E} -t 0.7 {T}/fim_preto.mp4')


# ——— cenas novas (20/10): o letreiro apagando, o ônibus indo embora, a caixa ———
# letreiro: inteiro (0–1,5 s) e já morto (2,45–6,6 s); o trecho do meio, em que o Veo embaralha os números, sai fora
sh(f'ffmpeg -v error -y -i raw/vid-07-letreiro.mp4 -filter_complex '
   f'"[0:v]trim=0:1.5,setpts=PTS-STARTPTS[a];[0:v]trim=2.45:6.6,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0[v];'
   f'[0:a]atrim=0:1.5,asetpts=PTS-STARTPTS[x];[0:a]atrim=2.45:6.6,asetpts=PTS-STARTPTS[y];[x][y]concat=n=2:v=0:a=1[aa]" '
   f'-map "[v]" -map "[aa]" {E} {T}/letreiro_raw.mp4')
cena_nova(f'{T}/letreiro_raw.mp4', 'crop=960:720:160:0', 91, 5632, f'{T}/letreiro.mp4')
# o ônibus indo embora: 1,5 s do Flow, mais lento
sh(f'ffmpeg -v error -y -i raw/vid-08-vai-embora.mp4 -filter_complex "[0:v]setpts=PTS/0.6[v];[0:a]atempo=0.6[a]" -map "[v]" -map "[a]" {E} {T}/embora_raw.mp4')
cena_nova(f'{T}/embora_raw.mp4', 'crop=960:720:160:0', 92, 20402, f'{T}/embora.mp4')
# a caixa sozinha no banco; a imagem vai escurecendo e a data da filmadora fica
cena_nova('raw/vid-09-caixa.mp4', 'crop=912:684:184:18,scale=960:720,fade=out:st=5.0:d=2.6', 93, 20475, f'{T}/caixa.mp4', 1.5)
ruido(WN, 170.0, 0.5, 55, f'{T}/c5.mp4', 25)
ruido(WN, 190.0, 0.35, 56, f'{T}/c6.mp4', 25)

# ——— 3. linha do tempo (cenas coloridas já passadas pela fita em tmp-vhs/) ———
SEQ = [(f'{T}/p1.mp4', 'paulista'), (f'{T}/g0.mp4', 'glitch0'), (f'{T}/onibus.mp4', 'onibus'), (f'{T}/letreiro.mp4', 'letreiro'),
       (f'{T}/c4.mp4', 'corte4'), (f'{T}/s_mulher1.mp4', 'mulher'),
       (f'{T}/g1a.mp4', 'lampada'), (f'{T}/g1b.mp4', ''), (f'{T}/g1c.mp4', ''),
       (f'{T}/s_mulher2.mp4', 'mulher2'), (f'{T}/c2.mp4', 'corte2'), ('tmp-vhs/v07.mp4', 'janela'),
       (f'{T}/c3.mp4', 'corte3'), ('tmp-vhs/v09.mp4', 'casa'),
       (f'{T}/c5.mp4', 'corte5'), (f'{T}/embora.mp4', 'embora'), (f'{T}/c6.mp4', 'corte6'), (f'{T}/caixa.mp4', 'caixa'),
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
voz_t = m['mulher2'] + 0.25
js_t = m['glitch2']
ms = lambda x: f'{int(x * 1000)}|{int(x * 1000)}'
filters = [
    # fundo: static_3 o tempo todo, subindo e descendo sem padrão
    f"[1:a]aloop=loop=-1:size=2e9,atrim=0:{total},volume=22dB,volume='0.25+0.75*abs(sin(t*0.71)*sin(t*1.93+1))':eval=frame[bed]",
    # static_2 em rajadas tortas
    f"[2:a]volume=6dB,tremolo=f=7:d=0.7,asplit=3[s2a][s2b][s2c]",
    f"[s2a]atrim=0:2.2,adelay={ms(2.6)}[s2a1]",
    f"[s2b]atrim=3:6.5,asetpts=PTS-STARTPTS,adelay={ms(m['janela'] + 1.5)}[s2b1]",
    f"[s2c]atrim=6:7.6,asetpts=PTS-STARTPTS,adelay={ms(m['onibus'] + 1.5)}[s2c1]",
    # static: estouro alto no glitch 1, estalos curtos, e por baixo do jumpscare
    f"[3:a]volume=12dB,asplit=5[s1a][s1b][s1c][s1d][s1e]",
    f"[s1a]atrim=0:{m['mulher2'] - m['lampada'] + 0.05},volume=7dB,adelay={ms(m['lampada'])}[s1a1]",
    f"[s1b]atrim=0.4:1.0,asetpts=PTS-STARTPTS,volume=4dB,adelay={ms(m['glitch0'])}[s1b1]",
    f"[s1c]atrim=1:1.5,asetpts=PTS-STARTPTS,volume=-6dB,adelay={ms(m['casa'] + 1.0)}[s1c1]",
    f"[s1d]atrim=0:2.2,volume=-10dB,adelay={ms(js_t)}[s1d1]",
    # na cena da mulher, o chiado sobe e desce com a interferência
    f"[s1e]atrim=0:2.4,volume=-1dB,tremolo=f=6:d=0.6,adelay={ms(voz_t - 0.2)}[s1e1]",
    # a voz: dá para entender com esforço — rádio fraco, cortes leves, misturada com chiado branco
    f"[4:a]atrim=0:2.75,atempo=1.75,volume=10dB,highpass=f=350,lowpass=f=3000,acrusher=bits=7:mode=log:aa=0.7:samples=2,"
    f"vibrato=f=5:d=0.18,tremolo=f=8:d=0.45,volume=-1dB,adelay={ms(voz_t)}[voz]",
    f"anoisesrc=color=white:amplitude=0.28:d=2.4,highpass=f=500,lowpass=f=7000,tremolo=f=3:d=0.5,adelay={ms(voz_t - 0.2)}[vozchi]",
    # o jumpscare no glitch final
    f"[5:a]volume=-1dB,adelay={ms(js_t)}[js]",
    f"[0:a]volume=6dB[fita]",
    f"[fita][bed][s2a1][s2b1][s2c1][s1a1][s1b1][s1c1][s1d1][s1e1][voz][vozchi][js]amix=inputs=13:duration=first:normalize=0,"
    f"alimiter=limit=0.95:level=false[a]",
]
sh(f'ffmpeg -v error -y -i {T}/base.mp4 -i {SONS}/static_3.mp3 -i {SONS}/static_2.mp3 -i {SONS}/static.mp3 '
   f'-i {SONS}/mulher-seu-lugar.mp3 -i {SONS}/jumpscare.mp3 -filter_complex "{";".join(filters)}" '
   f'-map 0:v -map "[a]" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart out/fita-ida-vhs6.mp4')
print('ok', dur('out/fita-ida-vhs6.mp4'), os.path.getsize('out/fita-ida-vhs6.mp4'))
