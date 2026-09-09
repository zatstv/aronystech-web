# Brief de diseño — AronysTech

> Para pegar en `/superpowers:brainstorm` junto con `wireframes/index.html`.
> Armado con el cookbook de Anthropic sobre estética de frontend y con las
> decisiones ya tomadas en `PROYECTO.md` e `INVESTIGACION.md`.

---

## 1. Qué es

Catálogo de impresiones 3D personalizadas. Marca **AronysTech**, Panamá.
No es tienda: no hay carrito ni pago en línea. La página informa y el pedido
se cierra por WhatsApp con el mensaje ya armado.

**Quién entra:** alguien que necesita un regalo con nombre para una fecha
concreta —cumpleaños, graduación, boda— y está comparando por Instagram desde
el teléfono. Casi todo el tráfico es móvil.

**El diferenciador:** la competencia directa en Panamá exige mínimo 6
unidades. Acá se vende desde 1. Ese hueco es la oportunidad más clara.

---

## 2. Lo que ya está decidido y no se discute

Estas salen de la investigación de competencia, no de gusto personal:

| | |
|---|---|
| Moneda | Dólares |
| Entrega | Todo Panamá |
| Plazos | **No se publican.** La fecha se da al confirmar cada pedido |
| Material | PLA. Todo por encargo, nada sale de stock |
| Pago | Efectivo, Yappy, tarjeta, criptomonedas, PayPal |
| Acción única | "Pedir por WhatsApp", con ese mismo texto en toda la página |

**Dirección visual vigente: "física, no digital".** Todo es una pieza apoyada
sobre una superficie, no un rectángulo flotando en una pantalla.

- Sombras duras, sin desenfoque: `4px 4px 0`. Al apretar, se hunde.
- Filo sólido de 1.5px en color tinta. Nada de líneas grises tímidas.
- Divisores como capas de impresión, no rayas rectas.
- Grano fino al 5% sobre toda la página.
- Un solo color de acento en la interfaz. El multicolor solo aparece dentro
  de los cubos y las fotos, que son contenido del producto.

---

## 3. Lo que hay que evitar

De `INVESTIGACION.md` §5 — esto es lo que hace que una página del rubro se
vea hecha con plantilla:

- Gradiente morado-azul de fondo.
- Hero con render de impresora 3D o wireframe azul brillante. **Todos** los
  sitios de impresión 3D hacen esto.
- Íconos genéricos en tres columnas tipo "Calidad / Rapidez / Confianza".
- Fotos de stock. Las fotos son del taller o no van.
- Texto de relleno que no dice nada.

Y del cookbook, los defaults hacia los que converge un modelo:

- Tipografías sobreusadas: Inter, Roboto, Arial, la del sistema. Ojo también
  con **Space Grotesk**, que es la que sale por defecto cuando se pide "algo
  distinto".
- Paletas tímidas y repartidas parejo. Conviene **un color dominante con
  acentos filosos**.
- Layouts predecibles: barra arriba, hero partido 50/50, secciones apiladas
  todas desde el mismo margen.

---

## 4. Dimensiones a resolver por separado

El cookbook recomienda tratarlas como problemas distintos, no como un
"hacelo lindo" global.

### Tipografía
Hoy: Outfit 900 para titulares, JetBrains Mono para etiquetas chicas.
Elegidas porque los cubos del producto son cuadrados redondeados y la
geométrica rima con eso. **A revisar:** si hay algo con más carácter que
Outfit sin caer en las de siempre.

### Color
Hoy: papel `#F5F2EC`, tinta `#22252A`, acento coral `#E5402B`. Los colores de
filamento solo dentro de cubos y fotos.

**Problema medido y sin resolver:** el acento actual da **4.12:1 contra
blanco** y hace falta 4.5:1. Los botones "Pedir por WhatsApp" con texto
blanco no pasan contraste, y los rótulos rojos sobre el papel tampoco.
Calculado: `#C93B27` pasa las dos cosas (5.07:1 sobre blanco, 4.54:1 como
texto sobre papel) y sale de oscurecer el coral del logotipo un 25%.

El logotipo real usa coral `#E07060` y turquesa `#90C0C0`, más suaves que los
tokens. Hay que decidir si los tokens se acercan al logo o al revés.

### Movimiento
El cookbook: **un momento bien orquestado al cargar vale más que
micro-interacciones repartidas**. Hoy hay tres cosas:

1. El nombre de la marca se dibuja trazo por trazo, en bucle de 5.5s.
2. Una cuadrícula de fondo que se deforma hacia el cursor y suelta una onda
   al hacer clic.
3. Los bloques aparecen al entrar en pantalla.

**A decidir:** son tres sistemas distintos compitiendo. ¿Cuál es *el*
momento y cuáles sobran?

Todo debe respetar `prefers-reduced-motion` y quedarse quieto en táctiles.

### Fondos
El cookbook pide atmósfera y profundidad en vez de color plano. Hoy: grano al
5% más la cuadrícula que reacciona al cursor, en tinta muy suave sobre el
papel. Se lee como cama de impresión.

---

## 5. Estado del código

Vite + React 19, JSX plano. **Sin Tailwind, sin TypeScript, sin shadcn.**
Los estilos son CSS propio con variables en `src/styles/global.css`, y cada
componente trae su hoja al lado.

Existe: cabecera, portada, catálogo con buscador y filtros, ficha de
producto, modal de pedido, galería, nosotros, pie, cuadrícula de fondo.

Falta, y está en `sitio.js` esperando componente: el bloque "el mínimo es 1",
"para qué lo piden" (`OCASIONES`), preguntas frecuentes (`PREGUNTAS`),
entrega y pago (`PAGOS`), y el botón flotante de WhatsApp.

---

## 6. Preguntas abiertas para el brainstorm

1. **Catálogo: ¿grilla o lista?** La §7 decidió lista con índice tipo
   artículo. Al adoptar una referencia externa quedó grilla de tarjetas.
   Con 5 productos, ¿cuál convierte mejor?
2. **¿Cuál es el momento de la página?** Hoy compiten el nombre dibujándose,
   la cuadrícula reactiva y las apariciones al hacer scroll.
3. **Contraste del acento:** ¿se oscurece a `#C93B27` o se rediseña el par
   botón/texto?
4. **Seis ocasiones en grilla** es el cliché de las tarjetas de features.
   ¿Qué forma le damos?
5. **Voseo o tuteo.** El texto está mezclado; hay que unificar. Panamá tutea.
6. **En celular**, la foto del hero empuja el botón de WhatsApp fuera del
   primer golpe de vista. ¿Foto antes o después de la acción?

---

## 7. Restricciones duras

- **Móvil primero.** Es donde está el tráfico.
- El catálogo público es estático: sin backend, sin base de datos.
- Nada de fotos de stock ni de piezas que no existan. Si la foto promete algo
  que la impresora no da, vuelve como reclamo.
- Las fotos actuales vienen en formatos mezclados y no se recortan.
- Los precios en el código son de ejemplo; los reales están pendientes.
