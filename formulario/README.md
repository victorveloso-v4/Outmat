# Formulario Outmat

Projeto standalone para deploy no Vercel.

## Vercel

Use esta pasta como **Root Directory**:

```txt
formulario
```

Build command: vazio  
Output directory: vazio  
Framework preset: Other

## Arquivos

- `index.html`: entrada principal
- `styles.css`: estilos do formulario
- `script.js`: etapas, validacao, mascara de telefone e eventos para iframe

## Iframe

Use o arquivo `embed-greatpages.html` como base para colar no bloco HTML do GreatPages.

Exemplo simples:

```html
<iframe
  src="https://seu-deploy.vercel.app"
  width="420"
  height="660"
  style="border:0; max-width:100%;"
  loading="lazy"
></iframe>
```

Para evitar travar o scroll da pagina quando o mouse estiver em cima do iframe, use o snippet completo de `embed-greatpages.html`. Ele escuta o `postMessage` enviado pelo iframe e aplica `window.scrollBy()` na pagina pai.
