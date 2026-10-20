// ——— partida ———
// as letras desenhadas no cenário usam fontes do Google; redesenha quando chegarem
if (document.fonts && document.fonts.load) {
  Promise.all(['16px "Architects Daughter"', '16px Kalam', '17px Caveat'].map(f => document.fonts.load(f)))
    .then(() => dirty()).catch(() => {});
}
fit();
renderInv();
syncNav();
showIntro();
requestAnimationFrame(frame);
