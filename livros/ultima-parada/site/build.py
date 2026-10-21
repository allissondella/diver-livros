#!/usr/bin/env python3
"""Gera capitulos.js a partir de ../livro/0N-*.md.
Pega só o texto do livro (o que está em citação '>' e o bloco de código do cap. 3) e ignora
o cabeçalho de rascunho e as 'Decisões de escrita'. Rode de novo sempre que mudar um capítulo:
    python3 livros/ultima-parada/site/build.py
"""
import glob, html, json, os, re

AQUI = os.path.dirname(os.path.abspath(__file__))
LIVRO = os.path.join(AQUI, '..', 'livro')


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

    def fecha():
        if par:
            texto = '<br>'.join(inline(l) for l in par)
            classe = ''
            puro = re.sub(r'<[^>]+>', '', texto).strip()
            if puro.startswith('[') and puro.endswith(']'):
                classe = 'nota'
            else:
                mm = re.match(r'<strong>([^<]+)</strong>', texto)
                if mm and mm.group(1) == mm.group(1).upper() and '—' not in puro and len(par) == 1:
                    classe = 'doc'      # cabeçalho de documento: CADERNO DE CECÍLIA, PAI.TXT, FITA 2...
            if puro.startswith('→'):
                par.clear(); return
            blocos.append({'tipo': 'p', 'html': texto, 'classe': classe})
            par.clear()

    for l in linhas[1:]:
        if l.startswith('**Decisões'):
            break
        if l.startswith('```'):
            if em_codigo:
                blocos.append({'tipo': 'tela', 'texto': '\n'.join(codigo)}); codigo = []
            else:
                fecha()
            em_codigo = not em_codigo
            continue
        if em_codigo:
            codigo.append(l); continue
        if l.startswith('>'):
            c = l[1:].lstrip(' ') if len(l) > 1 else ''
            if c.strip() == '':
                fecha()
            else:
                par.append(c.rstrip())
        else:
            fecha()
    fecha()
    palavras = sum(len(re.sub(r'<[^>]+>', ' ', b.get('html', b.get('texto', ''))).split()) for b in blocos)
    return {'n': n, 'titulo': titulo, 'palavras': palavras, 'blocos': blocos}


caps = [capitulo(c) for c in sorted(glob.glob(os.path.join(LIVRO, '0[1-9]-*.md')))]
with open(os.path.join(AQUI, 'capitulos.js'), 'w', encoding='utf-8') as f:
    f.write('// gerado por build.py a partir de ../livro — não edite à mão\n')
    f.write('window.CAPITULOS = ' + json.dumps(caps, ensure_ascii=False, indent=1) + ';\n')
print(' · '.join(f"{c['n']}: {c['titulo']} ({c['palavras']} palavras, {len(c['blocos'])} blocos)" for c in caps))
