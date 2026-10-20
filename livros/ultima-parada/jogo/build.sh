#!/bin/sh
# Junta as fontes num único HTML publicável: dist/index.html
set -e
cd "$(dirname "$0")"
mkdir -p dist
{
  cat src/head.html
  printf '<style>\n'; cat src/style-base.css src/style-ui.css src/style-wave2.css src/style-wave3.css src/style-wave4.css src/style-wave5.css; printf '</style>\n'
  cat src/body.html
  printf '<script>\n"use strict";\n'
  for f in data paint wall0 wall1 wall2 wall3 wall4 wall5 engine ui spots wave2 vhs films wave3 wave4 wave5 audio wave6 wave7 boot; do cat "src/js/$f.js"; printf '\n'; done
  printf '</script>\n'
} > dist/index.html
echo "dist/index.html: $(wc -c < dist/index.html) bytes"
