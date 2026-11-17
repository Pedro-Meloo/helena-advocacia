# Helena Martins Advocacia — site institucional

Site estático (HTML + CSS + JS puro), sem build. Funciona em qualquer hospedagem (GitHub Pages, Netlify, Hostinger etc.).

## Estrutura

```
index.html          home (hero, profissional, áreas, atendimento, contato)
contato.html        página de contato (WhatsApp, dados, mapa)
privacidade.html    política de privacidade (modelo — revisar)
assets/css/style.css
assets/js/config.js  ← dados do escritório (edite aqui)
assets/js/main.js    animações e comportamento
assets/img/          imagens demonstrativas (SVG)
robots.txt, sitemap.xml
```

## O que trocar antes de publicar

1. **`assets/js/config.js`**: WhatsApp (só dígitos, DDI+DDD+número), telefone, e-mail, Instagram, endereço, horários, OAB e `mapQuery` (endereço para o Google Maps). Depois, `demo: false`.
2. **Fotos**: as imagens em `assets/img/` são ilustrações demonstrativas. Substitua por fotografias profissionais (licença própria ou de banco de imagens) e ajuste o `src` e o `alt` em `index.html`. Use `.jpg` ou `.webp` otimizados (hero ~1600px de altura máx.).
3. **Textos entre colchetes** em `index.html` (formação, trajetória) e as **áreas de atuação**: devem refletir apenas o que a advogada realmente oferece.
4. **Domínio**: troque `seudominio.com.br` em `canonical`, `og:url`, `robots.txt` e `sitemap.xml`. Adicione `og:image` (1200×630).
5. **`privacidade.html`**: revisar com a advogada antes de publicar.

## Publicidade na advocacia (OAB)

O site foi escrito sem preços, sem promessa de resultado, sem depoimentos de clientes e sem captação ativa, e traz aviso no rodapé. Confirme as regras vigentes (Código de Ética e Disciplina e Provimento nº 205/2021 do CFOAB) com a seccional da OAB.

## Acessibilidade e movimento

Navegação por teclado, foco visível, link "ir para o conteúdo" e `prefers-reduced-motion` respeitado (animações desligadas para quem prefere menos movimento).
