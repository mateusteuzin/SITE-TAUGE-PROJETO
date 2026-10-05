# Ajustes responsivos — 5 de outubro de 2026

O mapa estava fora da tela porque `site-final.css` restaurava duas colunas após a regra móvel. A correção em `css/site-map.css` empilha o conteúdo até 1040px e limita o mapa ao contêiner. A imagem usa WebP com dimensões reservadas.

A camada final `css/site-mobile.css`, carregada nas oito páginas, corrige checkbox e consentimento, melhora a leitura e as áreas de toque, ajusta grades e mantém os diferenciais do banner no fluxo do conteúdo. O menu usa a posição real do cabeçalho, medida em `js/site.js`. As versões dos arquivos novos e do JavaScript foram atualizadas nos HTML.

Skills aplicadas: `breakpoints`, `layout-primitives` e `responsive-typography` de https://github.com/dylantarre/design-system-skills. Dois subagentes participaram do diagnóstico, correção do mapa e revisão.

## Validação

- Chrome automatizado com Playwright: oito páginas em 320, 375, 390, 480, 600, 768, 820, 900, 1024, 1280 e 1440px; 88 combinações sem elementos principais fora da tela ou consentimento cortado.
- 73 verificações de interação: mapa carregado e acionável, menu alinhado ao cabeçalho, submenu, Escape, chat, checkbox, validação de campos obrigatórios e mudança entre celular e desktop. Inclui 667 × 375px na horizontal.
- Inspeção visual das capturas do banner, serviços, presença nacional e formulário em 390px.
- JavaScript validado com `node --check`; referências locais dos oito HTML verificadas.

Testes feitos em navegador com tamanhos simulados; aparelhos físicos e Safari não foram utilizados. O formulário mantém o envio pelo aplicativo de e-mail já existente.

## Rondônia colorida e rolagem do cabeçalho

Rondônia agora aparece em azul e turquesa no mapa. Asset final: `assets/images/mapa-presenca-rondonia-v4.webp`, 1267 × 1241px, transparente, 156 KB. Criado pelo ImageGen integrado e convertido para WebP para publicação. Prompt: colorir somente Rondônia no mesmo gradiente dos estados destacados, preservando os limites, relevo, enquadramento e transparência do mapa; não adicionar símbolos ou textos, pois os marcadores são aplicados pelo site.

O cabeçalho mantém `position: sticky` desde o início; a classe de rolagem altera somente a sombra. O menu bloqueia a rolagem no elemento raiz, preservando o cabeçalho, e o foco evita rolagem automática. Verificados 77 casos de rolagem/menu em Chromium, nas larguras 320, 390, 768, 1040 e 1440px, além de 73 verificações de interação.
