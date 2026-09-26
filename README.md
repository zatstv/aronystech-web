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
  App.jsx             el orden de las secciones y el salto por #hash
  data/sitio.js       TODO el contenido editable: precios, textos, preguntas
  components/         una sección de la página por archivo, con su .css al lado
  hooks/              aparición al hacer scroll, sección activa, salto por ancla
                      y la entrada escalonada con GSAP
  lib/whatsapp.js     arma los enlaces de WhatsApp (el número vive en data/sitio.js)
  lib/tema.js         claro / oscuro, y lo que quedó guardado
  styles/global.css   colores, tamaños y espacios comunes
public/
  img/                las fotos que usa la página
                      (la página usa los .webp; portada.jpg es para WhatsApp)
  video/              el video de la portada (hero), con su poster
  fuentes/            Outfit 900 suelta, sin usar todavía (ver "Pendientes")
  robots.txt

docs/
  PROYECTO.md         documento maestro: qué se decidió y por qué
  STACK.md            dónde se publica y con qué base de datos
  INVESTIGACION.md    competencia, referentes y dirección de diseño
  GUIA-FOTOS.md       cómo sacar las fotos de los productos
  wireframes.html     los bocetos de los que salió la página, con su brief
crudos/               fotos y videos sin comprimir, solo en tu disco (no va al repo)
```

No hay router instalado: las pantallas sueltas (`#acceso`, `#producto/<id>`)
se miran desde el hash en `App.jsx`. Cuando haya más de dos, ahí sí conviene uno.

## Cambios más comunes

- **Precio, texto o foto de un producto** → `src/data/sitio.js`, lista `PRODUCTOS`.
- **Una pregunta frecuente** → `src/data/sitio.js`, lista `PREGUNTAS` (salen en `#preguntas`).
- **Los pasos o las ocasiones** → `src/data/sitio.js`, listas `PASOS` y `OCASIONES` (en `#proceso`).
- **Los medios de pago** → `src/data/sitio.js`, lista `PAGOS`. El `icono` es un nombre
  de `lucide-react`, mapeado arriba de `components/Preguntas.jsx`.
- **El número de WhatsApp** → `src/data/sitio.js`, constantes `TEL` y `TEL_BONITO`.
- **Las redes sociales del pie** → `src/data/sitio.js`, lista `REDES` (hoy vacía).
- **Colores del armador de cubos** → `src/data/sitio.js`, listas `PALETA` y `CHIPS`.

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

- Las tipografías van por CDN de Google. Al publicar conviene auto-hospedarlas:
  `public/fuentes/outfit-900-latin.woff2` ya está bajada para eso, pero hoy no
  la usa nadie. Si se descarta la idea, ese archivo se puede borrar.
- Los precios y textos son de ejemplo.
- `PRODUCTOS` y la pantalla `components/DetalleProducto.jsx` funcionan, pero no hay
  nada que enlace a `#producto/<id>` desde que se sacó el catálogo (commit `d97c41b`).
  O vuelven a tener puerta de entrada, o son peso muerto.
- `CHIPS`, `CATEGORIAS` y `SUELTOS` en `sitio.js` quedaron de esa misma etapa y no
  los usa ningún componente.
- GSAP suma 47 kB comprimidos al bundle y hoy solo hace el escalonado de dos
  grillas. Si algún día pesa más que lo que aporta, `hooks/useEntradaEscalonada.js`
  se puede rehacer con `transition-delay` y sacarlo.

Las decisiones de dónde publicar y con qué base de datos están en `docs/STACK.md`.
