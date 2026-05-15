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

Exemplo:

```html
<iframe
  src="https://seu-deploy.vercel.app"
  width="420"
  height="660"
  style="border:0; max-width:100%;"
  loading="lazy"
></iframe>
```
