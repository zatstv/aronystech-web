# AronysTech · sitio web

Catálogo de impresiones 3D personalizadas. React con Vite, sin backend:
el pedido sale por WhatsApp con el mensaje ya escrito.

## Correr el sitio

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:5173
```

Para generar la versión que se publica:

```bash
npm run build    # deja todo en dist/
npm run preview  # ver esa versión ya compilada
```

## Dónde está cada cosa

```
index.html            la cáscara: título, descripción, tipografías, iconos
src/
  main.jsx            arranque de React
  App.jsx             el orden de las secciones de la página
  data/sitio.js       TODO el contenido editable: precios, textos, preguntas
  components/         una sección de la página por archivo
  hooks/              aparición al hacer scroll y salto por ancla
  lib/whatsapp.js     arma los enlaces de WhatsApp (el número vive en data/sitio.js)
  styles/global.css   todo el diseño
public/
  img/  modelo/       fotos y modelos 3D que usa la página
                      (la página usa los .webp; los .jpg son el original)
legacy/index.html     la versión anterior en un solo archivo, de referencia
```

## Cambios más comunes

- **Precio, texto o foto de un producto** → `src/data/sitio.js`, lista `PRODUCTOS`.
- **Una pregunta frecuente** → `src/data/sitio.js`, lista `PREGUNTAS`.
- **El número de WhatsApp** → `src/data/sitio.js`, constantes `TEL` y `TEL_BONITO`.
- **Colores del armador de cubos** → `src/data/sitio.js`, listas `PALETA` y `CHIPS`.
- **Quitar el aviso de "versión de prueba"** → borrar `<Aviso />` de `src/App.jsx`.

Los colores, tamaños y espacios del diseño están arriba de `src/styles/global.css`,
como variables CSS.

## Publicar

El sitio se compila a archivos estáticos: no hay servidor ni base de datos
detrás, así que sirve cualquier hosting de estáticos. Los dos valores que pide
cualquiera de ellos son siempre los mismos:

| Comando de construcción | Carpeta que se publica |
|---|---|
| `npm run build` | `dist` |

**Netlify** (recomendado para empezar) ya los lee solos de `netlify.toml`:
entrás a netlify.com, "Add new site" → "Import an existing project", elegís
este repositorio de GitHub y listo. Cada `git push` vuelve a publicar.
En **Cloudflare Pages** es lo mismo, cargando esos dos valores a mano.

### Antes de publicar de verdad

Estas tres cosas hay que tocarlas o el sitio sale mal, y ninguna avisa:

1. **`public/robots.txt`** bloquea a todos los buscadores (`Disallow: /`).
   Está bien para una prueba; si sale así, Google no lo indexa nunca.
2. **Las tres direcciones `CAMBIAR-POR-EL-DOMINIO` de `index.html`.** Son las
   que usan WhatsApp y Facebook para armar la vista previa del enlace. Tienen
   que ser absolutas: con una ruta relativa el enlace se comparte sin imagen,
   y el negocio se mueve por WhatsApp.
3. **`#acceso`** es una pantalla de ingreso que no valida nada, y se llega
   desde "Tu cuenta" en el pie. Avisa que es una vista previa, pero conviene
   decidir si sale al aire o se saca el enlace.

## Pendientes conocidos

- Las tipografías van por CDN. Al publicar conviene auto-hospedarlas.
- Los tres modelos de `public/modelo` (2,4 MB) no los usa ningún componente
  todavía, pero se publican igual.
- Los precios y textos son de ejemplo (ver el aviso de arriba de la página).

Las decisiones de dónde publicar y con qué base de datos están en `STACK.md`.
