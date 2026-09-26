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
index.html            la cáscara: título, descripción, iconos
src/
  main.jsx            arranque de React
  App.jsx             el orden de las secciones y el salto por #hash
  data/sitio.js       TODO el contenido editable: precios, textos, preguntas
  components/         una sección de la página por archivo, con su .css al lado
  hooks/              sección activa del menú, salto por ancla y la entrada
                      escalonada de las grillas al hacer scroll
  lib/whatsapp.js     arma los enlaces de WhatsApp (el número vive en data/sitio.js)
  lib/tema.js         claro / oscuro, y lo que quedó guardado
  styles/global.css   colores, tamaños y espacios comunes
public/
  img/                las fotos que usa la página
                      (la página usa los .webp; portada.jpg es para WhatsApp)
  video/              el video de la portada (hero), con su poster
  fuentes/            Outfit y JetBrains Mono, servidas desde el propio sitio
  robots.txt

docs/
  PROYECTO.md         documento maestro: qué se decidió y por qué
  STACK.md            dónde se publica y con qué base de datos
  INVESTIGACION.md    competencia, referentes y dirección de diseño
  GUIA-FOTOS.md       cómo sacar las fotos de los productos
  wireframes.html     los bocetos de los que salió la página, con su brief
crudos/               fotos y videos sin comprimir, solo en tu disco (no va al repo)
```

No hay router instalado: la ficha `#producto/<id>` se mira desde el hash en
`App.jsx`, y el pedido personalizado se abre con cualquier enlace a
`#personalizado` (o `#personalizado/<tipo>`, que llega con el tipo ya elegido).
El sitio no tiene cuentas de usuario: todo pedido termina en WhatsApp.

## Cambios más comunes

- **Precio, texto o foto de un producto** → `src/data/sitio.js`, lista `PRODUCTOS`
  (salen en `#catalogo`, cada uno con su ficha en `#producto/<id>`).
- **Una pregunta frecuente** → `src/data/sitio.js`, lista `PREGUNTAS` (salen en `#preguntas`).
- **Los pasos o las ocasiones** → `src/data/sitio.js`, listas `PASOS` y `OCASIONES` (en `#proceso`).
- **Los medios de pago** → `src/data/sitio.js`, lista `PAGOS`. Salen en las preguntas
  y en el último paso del pedido, con el `detalle` de cada uno. El `icono` es un nombre
  de `lucide-react`, mapeado arriba de `components/Preguntas.jsx`.
- **El número de WhatsApp** → `src/data/sitio.js`, constantes `TEL` y `TEL_BONITO`.
- **Las redes sociales del pie** → `src/data/sitio.js`, lista `REDES` (hoy vacía).
- **Los colores de filamento** → `src/data/sitio.js`, lista `PALETA`.
- **El pedido personalizado** (tipos de pieza con su ejemplo, qué referencia
  tiene el cliente, cantidades rápidas y desde cuántas es mayoreo) →
  `src/data/sitio.js`, `TIPOS_ENCARGO`, `REFERENCIAS`, `CANTIDADES` y `MAYOREO`.

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

Estas dos cosas hay que tocarlas o el sitio sale mal, y ninguna avisa:

1. **`public/robots.txt`** bloquea a todos los buscadores (`Disallow: /`).
   Está bien para una prueba; si sale así, Google no lo indexa nunca.
2. **Las tres direcciones `CAMBIAR-POR-EL-DOMINIO` de `index.html`.** Son las
   que usan WhatsApp y Facebook para armar la vista previa del enlace. Tienen
   que ser absolutas: con una ruta relativa el enlace se comparte sin imagen,
   y el negocio se mueve por WhatsApp.

## Pendientes conocidos

- Los precios y textos son de ejemplo.

Las decisiones de dónde publicar y con qué base de datos están en `docs/STACK.md`.
