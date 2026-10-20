#!/usr/bin/env python3
"""Fita de ida, versão 2: começo colorido, glitch de sinal corrompido, preto e branco da mulher até a casa,
glitch final com jumpscare. Statics bagunçando o tempo todo e a voz da mulher quase incompreensível.
Usa as cenas já passadas pela simulação de VHS (tmp-vhs/) e o vhsfx (ntsc-rs) para o que é novo."""
import os, subprocess, json

os.chdir(os.path.dirname(os.path.abspath(__file__)))
FX = '/home/claude/vhsfx/target/release/vhsfx'
UP = '/root/.claude/uploads/1100826f-e3cf-5eb0-a799-1c61fb05bde2'
GLITCH_REF = f'{UP}/3ca1d0e4-Broken-Phone-Screen-SnapYT.App.mp4'
SONS = 'sons'
T = 'tmp-vhs2'; os.makedirs(T, exist_ok=True); os.makedirs('out', exist_ok=True)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
FPS = 24
POST = 'eq=saturation=0.8:brightness=0.015:contrast=0.95:gamma=1.04,vignette=PI/5,scale=960:720:flags=bicubic'
PB = 'hue=s=0,eq=contrast=1.12:brightness=-0.01'  # preto e branco
ENC = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', str(FPS),
       '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2']

def sh(cmd):
    subprocess.run(cmd, shell=True, check=True)

def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())

def vhs_pipe(src_vf, inp, seed, noise, tracking, out, post_extra='', audio=None, t=None):
    """decodifica → (filtros) → 640x480 rgb → vhsfx → pós → mp4 (com áudio de `audio` ou silêncio)"""
    tt = f'-t {t}' if t else ''
    a_in = f'-i {audio}' if audio else '-f lavfi -i anullsrc=r=48000:cl=stereo'
    post = POST + (',' + post_extra if post_extra else '')
    sh(f'ffmpeg -v error {tt} -i "{inp}" -vf "{src_vf},scale=640:480,format=rgb24" -f rawvideo -pix_fmt rgb24 - '
       f'| {FX} 640 480 {seed} {noise} {tracking} '
       f'| ffmpeg -v error -y -f rawvideo -pix_fmt rgb24 -s 640x480 -r {FPS} -i - {a_in} '
       f'-filter_complex "[0:v]{post}[v];[1:a]aresample=48000,aformat=channel_layouts=stereo[a]" '
       f'-map "[v]" -map "[a]" {" ".join(ENC)} -shortest {out}')

def silent_video(vf_src, out, d):
    """quadro congelado (png) por d segundos, sem som"""
    sh(f'ffmpeg -v error -y -loop 1 -t {d} -i {vf_src} -f lavfi -i anullsrc=r=48000:cl=stereo '
       f'-vf "scale=960:720,setsar=1" {" ".join(ENC)} -t {d} {out}')

def frame(src, at, out, extra=''):
    vf = f'-vf "{extra}"' if extra else ''
    sh(f'ffmpeg -v error -y -ss {at} -i {src} -frames:v 1 {vf} {out}')

def pb(src, out):
    sh(f'ffmpeg -v error -y -i {src} -vf "{PB}" {" ".join(ENC)} {out}')

# ——— 1. cenas ———
# a mulher, um pouco mais lenta, em preto e branco (simulação de novo, com a data da filmadora)
sh(f'ffmpeg -v error -y -i tmp-montagem/m05.mp4 -filter_complex "[0:v]setpts=PTS/0.8[v];[0:a]atempo=0.8[a]" '
   f'-map "[v]" -map "[a]" {" ".join(ENC)} {T}/m05s.mp4')
hora = f'{T}/hora-5885.txt'
open(hora, 'w').write('%{eif:trunc((t+5885)/3600):d:2}:%{eif:mod(trunc((t+5885)/60),60):d:2}:%{eif:mod(trunc(t+5885),60):d:2}')
osd = (f"drawtext=fontfile={FONT}:text='JUN. 7 1996':x=w-tw-34:y=h-78:fontsize=26:fontcolor=white:borderw=2:bordercolor=black@0.8,"
       f"drawtext=fontfile={FONT}:textfile={hora}:expansion=normal:x=w-tw-34:y=h-46:fontsize=26:fontcolor=white:borderw=2:bordercolor=black@0.8")
vhs_pipe(f'scale=640:480:flags=area,{osd}', f'{T}/m05s.mp4', 31, 1.7, 0, f'{T}/s_mulher.mp4', PB, audio=f'{T}/m05s.mp4')
pb('tmp-vhs/v07.mp4', f'{T}/s_janela.mp4')
pb('tmp-vhs/v08.mp4', f'{T}/s_chiado_pb.mp4')
pb('tmp-vhs/v09.mp4', f'{T}/s_casa.mp4')

# ——— 2. glitch (o vídeo de referência, passado pela mesma fita, com tracking) ———
for name, start, d, seed in [('g1', 4.0, 1.2, 41), ('g2', 31.0, 2.4, 42)]:
    sh(f'ffmpeg -v error -y -ss {start} -t {d} -i "{GLITCH_REF}" -an -vf "scale=640:480,format=rgb24" -f rawvideo -pix_fmt rgb24 - '
       f'| {FX} 640 480 {seed} 1.8 1 '
       f'| ffmpeg -v error -y -f rawvideo -pix_fmt rgb24 -s 640x480 -r 30 -i - -f lavfi -i anullsrc=r=48000:cl=stereo '
       f'-filter_complex "[0:v]eq=saturation=1.2:contrast=1.1,vignette=PI/5,scale=960:720,fps={FPS}[v]" -map "[v]" -map 1:a '
       f'{" ".join(ENC)} -t {d} {T}/{name}.mp4')

def cut(src, ss, d, out):
    sh(f'ffmpeg -v error -y -ss {ss} -t {d} -i {src} {" ".join(ENC)} {out}')

# quadros congelados para piscar no meio do glitch
frame('tmp-vhs/v03.mp4', dur('tmp-vhs/v03.mp4') - 0.1, f'{T}/f_onibus.png')
frame(f'{T}/s_mulher.mp4', 0.05, f'{T}/f_mulher_longe.png')
frame(f'{T}/s_mulher.mp4', dur(f'{T}/s_mulher.mp4') - 0.1, f'{T}/f_mulher_perto.png')
frame(f'{T}/s_casa.mp4', dur(f'{T}/s_casa.mp4') - 0.1, f'{T}/f_casa.png')

# glitch 1: entre o ônibus (cor) e a mulher (p&b)
cut(f'{T}/g1.mp4', 0.0, 0.25, f'{T}/g1a.mp4'); silent_video(f'{T}/f_onibus.png', f'{T}/g1b.mp4', 0.083)
cut(f'{T}/g1.mp4', 0.3, 0.33, f'{T}/g1c.mp4'); silent_video(f'{T}/f_mulher_longe.png', f'{T}/g1d.mp4', 0.083)
cut(f'{T}/g1.mp4', 0.7, 0.42, f'{T}/g1e.mp4')
# glitch final: casa → glitch → o rosto dela por um instante → glitch → preto (dura o jumpscare, ~2 s)
cut(f'{T}/g2.mp4', 0.0, 0.25, f'{T}/g2a.mp4'); silent_video(f'{T}/f_casa.png', f'{T}/g2b.mp4', 0.125)
cut(f'{T}/g2.mp4', 0.5, 0.5, f'{T}/g2c.mp4')  # o rosto cai no pico do jumpscare (~1 s)
silent_video(f'{T}/f_mulher_perto.png', f'{T}/g2d.mp4', 0.29)
cut(f'{T}/g2.mp4', 1.2, 0.5, f'{T}/g2e.mp4')
sh(f'ffmpeg -v error -y -f lavfi -i color=c=black:s=960x720:r={FPS}:d=0.9 -f lavfi -i anullsrc=r=48000:cl=stereo {" ".join(ENC)} -t 0.9 {T}/fim_preto.mp4')

# ——— 3. linha do tempo ———
SEQ = [('tmp-vhs/v01.mp4', 'paulista'), ('tmp-vhs/v02.mp4', 'chiado'), ('tmp-vhs/v03.mp4', 'onibus'),
       (f'{T}/g1a.mp4', 'glitch1'), (f'{T}/g1b.mp4', ''), (f'{T}/g1c.mp4', ''), (f'{T}/g1d.mp4', ''), (f'{T}/g1e.mp4', ''),
       (f'{T}/s_mulher.mp4', 'mulher'), (f'{T}/s_chiado_pb.mp4', 'chiado'), (f'{T}/s_janela.mp4', 'janela'),
       (f'{T}/s_chiado_pb.mp4', 'chiado'), (f'{T}/s_casa.mp4', 'casa'),
       (f'{T}/g2a.mp4', 'glitch2'), (f'{T}/g2b.mp4', ''), (f'{T}/g2c.mp4', ''), (f'{T}/g2d.mp4', 'rosto'), (f'{T}/g2e.mp4', ''),
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

# ——— 4. som: a fita + statics bagunçando + a voz + o jumpscare ———
m = marks
voz_t = m['mulher'] + 1.3
js_t = m['glitch2']
filters = [
    # fundo: static_3 o tempo todo, volume subindo e descendo sem padrão
    f"[1:a]aloop=loop=-1:size=2e9,atrim=0:{total},volume=22dB,volume='0.25+0.75*abs(sin(t*0.71)*sin(t*1.93+1))':eval=frame[bed]",
    # static_2: rajadas com tremor em momentos tortos
    f"[2:a]volume=6dB,tremolo=f=7:d=0.7,asplit=3[s2a][s2b][s2c]",
    f"[s2a]atrim=0:2.2,adelay={int(2.6*1000)}|{int(2.6*1000)}[s2a1]",
    f"[s2b]atrim=3:6.5,asetpts=PTS-STARTPTS,adelay={int((m['janela']+1.5)*1000)}|{int((m['janela']+1.5)*1000)}[s2b1]",
    f"[s2c]atrim=6:7.6,asetpts=PTS-STARTPTS,adelay={int((m['onibus']+3.2)*1000)}|{int((m['onibus']+3.2)*1000)}[s2c1]",
    # static: estouros curtos e nos dois glitches (no glitch final, por baixo do jumpscare)
    f"[3:a]volume=12dB,asplit=4[s1a][s1b][s1c][s1d]",
    f"[s1a]atrim=0:{m['mulher']-m['glitch1']+0.1},volume=7dB,adelay={int(m['glitch1']*1000)}|{int(m['glitch1']*1000)}[s1a1]",
    f"[s1b]atrim=0.5:0.9,asetpts=PTS-STARTPTS,volume=-6dB,adelay={int((m['paulista']+3.1)*1000)}|{int((m['paulista']+3.1)*1000)}[s1b1]",
    f"[s1c]atrim=1:1.5,asetpts=PTS-STARTPTS,volume=-6dB,adelay={int((m['casa']+1.0)*1000)}|{int((m['casa']+1.0)*1000)}[s1c1]",
    f"[s1d]atrim=0:2.2,volume=-10dB,adelay={int(js_t*1000)}|{int(js_t*1000)}[s1d1]",
    # a voz da mulher: quase sem entender — rádio estourado, cortes, tremida, afogada no chiado
    f"[4:a]atrim=0:2.75,volume=20dB,highpass=f=450,lowpass=f=2400,acrusher=bits=5:mode=log:aa=0.6:samples=3,"
    f"vibrato=f=6.5:d=0.35,tremolo=f=11:d=0.85,aecho=0.6:0.5:35:0.35,volume=-2dB,adelay={int(voz_t*1000)}|{int(voz_t*1000)}[voz]",
    f"[3:a]atrim=0:2.9,volume=4dB,tremolo=f=5:d=0.6,adelay={int((voz_t-0.1)*1000)}|{int((voz_t-0.1)*1000)}[vozchi]",
    # o jumpscare no glitch final
    f"[5:a]volume=-1dB,adelay={int(js_t*1000)}|{int(js_t*1000)}[js]",
    f"[0:a]volume=6dB[fita]",
    f"[fita][bed][s2a1][s2b1][s2c1][s1a1][s1b1][s1c1][s1d1][voz][vozchi][js]amix=inputs=12:duration=first:normalize=0,"
    f"alimiter=limit=0.95:level=false[a]",
]
sh(f'ffmpeg -v error -y -i {T}/base.mp4 -i {SONS}/static_3.mp3 -i {SONS}/static_2.mp3 -i {SONS}/static.mp3 '
   f'-i {SONS}/mulher-seu-lugar.mp3 -i {SONS}/jumpscare.mp3 -filter_complex "{";".join(filters)}" '
   f'-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart out/fita-ida-vhs2.mp4')
print('ok', dur('out/fita-ida-vhs2.mp4'), os.path.getsize('out/fita-ida-vhs2.mp4'))
