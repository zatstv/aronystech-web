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

## Pendientes conocidos

- `public/robots.txt` todavía bloquea a los buscadores: es una versión de prueba.
  Hay que cambiarlo antes de publicar de verdad.
- Las tipografías van por CDN. Al publicar conviene auto-hospedarlas.
- Los precios y textos son de ejemplo (ver el aviso de arriba de la página).

Las decisiones de dónde publicar y con qué base de datos están en `STACK.md`.
