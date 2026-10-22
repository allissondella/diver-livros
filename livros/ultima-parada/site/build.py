#!/usr/bin/env python3
"""Gera capitulos.js a partir de ../livro/NN-*.md (01 a 10) e audio/manifest.json.

Formato dos capítulos (só o que está em citação entra no livro):
    > texto          a voz de quem conversa com o leitor (o Fábio; no 10, a Cecília)
    >> texto         documento (diário, fita, recorte, carta), num quadro à parte
    >> {{ouvir}}     o play da microfita: toca as falas seguintes do mesmo documento
    >> {{fita:id}}   a TV com "Colocar a fita": toca video/fita-<id>.mp4 (a do cap. 9 é {{fita:volta}})
    >> {v:id} texto  a fala que toca o áudio audio/<id>.mp3 (os mesmos ids do jogo)
    ```              bloco de tela (o PAI.TXT, na tela verde do CP-500)
A linha de descrição logo abaixo do título e qualquer coisa fora de citação são ignoradas.
Rode de novo sempre que mudar um capítulo ou pôr um áudio novo em site/audio/:
    python3 livros/ultima-parada/site/build.py
"""
import glob, html, json, os, re

AQUI = os.path.dirname(os.path.abspath(__file__))
LIVRO = os.path.join(AQUI, '..', 'livro')
AUDIO = os.path.join(AQUI, 'audio')


def inline(t):
    t = re.sub(r'\\([\[\]\*_`#\-\.\(\)>!])', r'\1', t)          # tira os escapes do markdown
    t = html.escape(t, quote=False)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', t)
    return t


def capitulo(caminho):
    linhas = open(caminho, encoding='utf-8').read().split('\n')
    m = re.match(r'## Cap[ií]tulo (\d+) [—-] (.+)', linhas[0])
    n, titulo = int(m.group(1)), m.group(2).strip()
    blocos, par, em_codigo, codigo = [], [], False, []
    estado = {'dentro': False}

    def fecha():
        if not par:
            return
        dentro = estado['dentro']
        bruto = ' '.join(par).strip()
        if bruto == '{{ouvir}}':
            blocos.append({'tipo': 'ouvir', 'dentro': True}); par.clear(); return
        mf = re.fullmatch(r'\{\{fita:([a-z0-9-]+)\}\}', bruto)
        if mf:
            blocos.append({'tipo': 'fita', 'id': mf.group(1), 'dentro': True}); par.clear(); return
        v = None
        mv = re.match(r'\{v:([a-z0-9-]+)\}\s*', par[0])
        if mv:
            v = mv.group(1); par[0] = par[0][mv.end():]
        texto = '<br>'.join(inline(l) for l in par)
        puro = re.sub(r'<[^>]+>', '', texto).strip()
        classe = ''
        if puro.startswith('[') and puro.endswith(']'):
            classe = 'nota'
        elif re.fullmatch(r'<strong>[^<]+</strong>', texto):
            classe = 'doc'      # cabeçalho de documento: CADERNO DE CECÍLIA, PAI.TXT, FITA…
        b = {'tipo': 'p', 'html': texto, 'classe': classe, 'dentro': dentro}
        if v:
            b['v'] = v
        blocos.append(b)
        par.clear()

    for l in linhas[1:]:
        if l.startswith('**Decisões'):
            break
        if l.startswith('```'):
            if em_codigo:
                blocos.append({'tipo': 'tela', 'texto': '\n'.join(codigo), 'dentro': True}); codigo = []
            else:
                fecha()
            em_codigo = not em_codigo
            continue
        if em_codigo:
            codigo.append(l); continue
        if l.startswith('>'):
            dentro = l.startswith('>>')
            c = l[2:] if dentro else l[1:]
            c = c.strip()
            if dentro != estado['dentro']:
                fecha(); estado['dentro'] = dentro
            if c == '':
                fecha()
            else:
                par.append(c)
        else:
            fecha()
    fecha()
    palavras = sum(len(re.sub(r'<[^>]+>', ' ', b.get('html', b.get('texto', ''))).split()) for b in blocos)
    return {'n': n, 'titulo': titulo, 'palavras': palavras, 'blocos': blocos}


arquivos = sorted(glob.glob(os.path.join(LIVRO, '[0-9][0-9]-*.md')))
caps = [capitulo(c) for c in arquivos if not os.path.basename(c).startswith('00-')]
caps.sort(key=lambda c: c['n'])
with open(os.path.join(AQUI, 'capitulos.js'), 'w', encoding='utf-8') as f:
    f.write('// gerado por build.py a partir de ../livro — não edite à mão\n')
    f.write('window.CAPITULOS = ' + json.dumps(caps, ensure_ascii=False, indent=1) + ';\n')

# os áudios que existem (o livro e o jogo leem a mesma lista)
os.makedirs(AUDIO, exist_ok=True)
vozes = sorted(os.path.splitext(os.path.basename(a))[0] for a in glob.glob(os.path.join(AUDIO, '*.mp3')))
with open(os.path.join(AUDIO, 'manifest.json'), 'w', encoding='utf-8') as f:
    json.dump(vozes, f)

print(' · '.join(f"{c['n']}: {c['titulo']} ({c['palavras']} palavras)" for c in caps))
print(f"{sum(c['palavras'] for c in caps)} palavras no total · {len(vozes)} áudios em site/audio")
