# Guía para tomar las fotos

La página ya funciona con tus fotos actuales. Esto es para cuando quieras
reemplazarlas por unas hechas a propósito.

**La gracia:** si guardás los archivos con el mismo nombre en `img/`, la página los
toma sola. No hay que tocar código.

---

## 1. El montaje, con lo que ya tenés en la casa

No hace falta comprar nada. Con esto alcanza:

- **Una ventana grande, sin sol directo.** El sol directo hace sombras duras y quema el
  color. Nublado es mejor que soleado. Temprano en la mañana o al final de la tarde.
- **Una cartulina blanca** doblada en curva: mitad sobre la mesa, mitad pegada a la pared
  con cinta. Así no se ve la línea donde termina la mesa. Vale ₡500 en cualquier librería.
- **Un rebotador**: otra cartulina blanca parada del lado contrario a la ventana. Rellena
  la sombra y hace la diferencia entre foto de aficionado y foto de catálogo.
- **El celular apoyado**, no en el aire. Sobre una pila de libros si no tenés trípode.

**Tres cosas que arruinan la foto:**
1. **El flash.** Nunca. Aplasta el color y mete brillos falsos. La luz de la ventana sobra.
2. **Luz de bombillo mezclada con luz de ventana.** Apagá las luces del cuarto, se pone amarillo.
3. **Zoom digital.** Acercá el teléfono, no el zoom.

Si más adelante querés invertir: una caja de luz plegable con LED anda entre $40 y $80 y
sirve para todo lo que mida menos de 30 cm, que es todo lo tuyo.

---

## 2. Qué medida tiene que tener cada foto

La página recorta al centro, así que **dejá aire alrededor del producto**. Si lo pegás al
borde, el recorte se lo come.

| Dónde va | Formato | Mínimo | Cómo encuadrar |
|---|---|---|---|
| **Hero** (arriba del todo) | Vertical 3:4 | 1200 × 1600 | Producto centrado, con espacio arriba y abajo |
| **Cada producto del catálogo** | Horizontal, casi panorámico | 1720 × 950 | Producto en la **franja del medio**. Arriba y abajo se recortan |

En el celular: cámara en **4:3** para el hero, y para el catálogo tomá horizontal normal
y después recortá a lo ancho.

---

## 3. La lista de tomas

Guardá cada una con este nombre exacto dentro de `img/`:

### `hero-manzana-cubos.jpg` — vertical
La foto que manda. Un arreglo de varios productos: la manzana, un llavero de letras y uno
de números. Fondo blanco. Es la que ya tenés y funciona bien; solo mejorala si conseguís
mejor luz.

### `cubos-letras-detalle.jpg` — horizontal
Primer plano de los cubos con letras, bien cerca, que se vean las capas de impresión.
La que tenés está sobre fondo verde y queda linda, pero sobre blanco combina con el resto.
**Idea mejor:** que formen una palabra real de cliente, no "ARONYSTECH".

### `cubos-numeros.jpg` — horizontal
Los cubos de números **solos**, sin la manzana al lado. Es la única foto donde hoy
aparecen acompañados y por eso hubo que recortarla raro.

### `soportes-celular.jpg` — horizontal
Los soportes en fila sobre blanco. La que tenés es la mejor de todas, no la cambies.

### `soporte-con-celular.jpg` — horizontal ← **la que más falta**
**Un soporte con un celular encima, encendido.** Esta es la foto que más vende y no la
tenés. Nadie compra "una pieza de plástico"; compran no tener el teléfono tirado en la
mesa. Poné el soporte en un escritorio real, con el teléfono mostrando algo, y tomá desde
la altura del ojo.

### `manzana-piezas.jpg` — horizontal
La que tenés (las piezas separadas) está buena porque muestra que la hoja y el tallo van
aparte. **Sumá una segunda:** la manzana **cerrada, con dulces adentro**, que se vea a
través de la malla. Guardala como `manzana-cerrada.jpg` y te la meto en la página.

### `cajas-regalo.jpg` — horizontal
**Una sola caja, cerrada, entera.** La actual tiene varias apiladas y cortadas. Una caja
sola se entiende mejor.

### La que falta y no está en la lista: **algo en la mano**
Una pieza sostenida entre los dedos. Es la única forma de que se entienda el tamaño real
sin poner una regla. Sirve para cualquier producto.

---

## 4. Después de tomarlas

1. **Recortá** al formato de la tabla de arriba.
2. **Subí brillo y bajá sombras** un poco. Nada más. No toques saturación: el cliente
   tiene que ver el color real del filamento o va a reclamar.
3. **Achicá el peso.** Ninguna debería pasar de 300 KB o la página carga lento.
   Con `squoosh.app` (gratis, en el navegador) o desde la terminal:
   ```bash
   # deja la foto en 1720px de ancho y calidad 82
   magick foto.jpg -resize 1720x -quality 82 img/nombre-final.jpg
   ```
4. Guardala en `img/` con el nombre exacto de la lista. Listo, la página ya la muestra.

---

## Fuentes

- [Shopify — guía DIY de fotografía de producto](https://www.shopify.com/blog/12206313-the-ultimate-diy-guide-to-beautiful-product-photography)
- [Fotografía de producto con celular (Tiendada)](https://tiendada.com/blog/gestion-de-negocio/mercadotecnia-y-publicidad/guia-fotografia-producto-celular/)
- [Fotografiar con luz natural (SellerPic)](https://www.sellerpic.ai/es/blog/how-to-shoot-with-natural-light)
- [Smartphone product photography 2026 (FrameOnce)](https://frameonce.io/blog/smartphone-product-photography)
- [Cajas de luz para vendedores pequeños (PhotoWorkout)](https://www.photoworkout.com/best-light-boxes-for-photography/)
