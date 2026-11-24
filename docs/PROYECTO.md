# AronysTech — Web de impresiones 3D personalizadas

> Documento maestro del proyecto. **Todo lo que se decida se anota aquí.**
> Para seguir la conversación: abrí una terminal y escribí `3d`.

---

## 1. Qué es

Página web para vender **impresiones 3D personalizadas**. Marca: **AronysTech**
(el nombre aparece impreso en los llaveros de las fotos).

**Alcance decidido (2026-09-07): CATÁLOGO, no tienda.**

- [x] Catálogo con la información a la vista (precios, colores, tiempos) + pedidos por WhatsApp
- [ ] ~~Tienda con carrito y pago en línea~~ — descartado por ahora
- [x] Zona de administración oculta → ver sección 9b

Nada de carrito, checkout ni pasarela de pago. La página informa; el pedido se cierra
por WhatsApp.

---

## 2. Datos del negocio

| Dato | Valor |
|---|---|
| Nombre de la marca | AronysTech |
| Slogan / frase | _(pendiente)_ |
| WhatsApp | 6795 5170 _(confirmar, sale en las fotos)_ |
| Instagram / TikTok / Facebook | _(pendiente)_ |
| Correo | _(pendiente)_ |
| País | **Panamá** |
| Zona / envíos | **Todo Panamá**, a nivel nacional |
| **Moneda** | **Dólares (USD).** Todos los precios del catálogo en $. |
| Tiempos de entrega | **No se publican.** La fecha se da al confirmar cada pedido. |
| Métodos de pago | **Efectivo, Yappy, tarjeta, criptomonedas y PayPal** |
| Dominio | _(pendiente)_ |
| Dónde se va a publicar | _(pendiente — Netlify / Vercel / GitHub Pages / hosting propio)_ |

---

## 3. Productos vistos en las fotos

Esto es lo que se identifica en `fotos/`. Corregir y completar precios:

| Producto | Descripción | Precio (USD) |
|---|---|---|
| Llaveros de cubos con letras | Cubos apilables que forman nombres/palabras, colores combinables | |
| Llaveros de cubos con números | Igual pero con números (ej. número de teléfono) | |
| Soportes para celular | Plegables, varios colores (turquesa, naranja, negro, mármol) | |
| Canasta / bowl tipo manzana | Malla 3D en rojo con hoja y tallo, sirve para dulces | |
| Cajas de regalo armadas | Cajas transparentes con dulces, cinta y pieza 3D personalizada dentro | |
| _(agregar más)_ | | |

**Personalización que se ofrece:** nombres, colores, tamaños, logos… _(completar)_

---

## 4. Fotos

- `img/` — las 7 que se están usando en la página, ya renombradas.
- `fotos/originales/` — 28 fotos crudas de WhatsApp.
- `fotos/editadas/` — 14 imágenes retocadas sobre fondo blanco.
- Hay 2 videos en `~/Escritorio/fotos aroonystech/editadas/` sin usar todavía.

### ⚠️ Falta material fotográfico

Ninguna foto muestra **un solo producto aislado**. Casi todas son grupales, con los
llaveros de letras metidos en cada toma como firma de marca. Sirve para redes, pero para
un catálogo cada producto necesita su propia foto.

Lo que hace falta, por producto, sobre fondo liso:

- [ ] Llavero de nombre solo
- [ ] Llavero de números solo
- [ ] Un soporte de celular **con un teléfono encima** (vender el uso, no la pieza)
- [ ] Monedero manzana cerrado y abierto con algo adentro
- [ ] Una caja de regalo cerrada, entera
- [ ] Alguna pieza en la mano, para que se entienda el tamaño real

Con el celular y una hoja blanca cerca de una ventana alcanza. No hace falta estudio.
**La guía completa, con medidas y nombres de archivo, está en `GUIA-FOTOS.md`.**
Si guardás las fotos con esos nombres en `img/`, la página las toma sola.

---

## 5. Investigación (ya hecha) → ver `INVESTIGACION.md`

Investigué la competencia en Panamá, referentes de diseño y qué información
necesita el cliente antes de comprar. **Todo está en `INVESTIGACION.md`.** Resumen:

- **Llaveros Panamá** es el competidor directo: pide **mínimo 6 unidades**. Vos podés
  vender de una. Ese hueco es la oportunidad más clara que hay.
- Ninguno muestra precios: todos dicen "cotiza por WhatsApp". Mostrarlos ya nos pone adelante.
- Ninguno dice tiempos de entrega, colores disponibles ni materiales.
- Todos usan la misma plantilla y el mismo cliché visual (impresora 3D, azul, wireframe).
- En LATAM el catálogo que termina en WhatsApp convierte 3–5× más que un formulario.

### Links que te gusten (opcional, si ves alguno)

Ya no hace falta que busques, pero si topás con algo que te guste, pegalo acá:

```
1. https://
   Me gusta:
```

### Cosas que NO quiero
_(anotá lo que te choque; ya dejé la lista de clichés a evitar en INVESTIGACION.md §5)_

-

---

## 6. Dirección de diseño propuesta

**El producto es el sistema de diseño.** Los llaveros de cubos con letras son cuadrados
redondeados, de colores planos y saturados, apilables — la página se construye con esos
mismos bloques. Estética de caja de juguetes, no de taller tecnológico.

| Aspecto | Propuesta |
|---|---|
| Sensación | Alegre, táctil, hecho a mano. Nada de "tech". |
| Fondo | Claro y neutro; el color lo ponen los productos. |
| Paleta | Filamentos reales: rojo tomate, turquesa, naranja, amarillo, negro, blanco. |
| Tipografía | Gruesa, geométrica, redondeada (que rime con los cubos). |
| Motion | Los cubos caen y se apilan al cargar. Nada más. |

**Gancho que nadie tiene:** un armador en el hero — escribís tu nombre, ves los cubos
formándose en pantalla con los colores que elegís, y ese texto se va pre-armado al
WhatsApp. Barato de hacer y es lo que la gente comparte.

Detalle en `INVESTIGACION.md` §6.

---

## 6b. Dirección visual definida: física, no digital

Elegida el 2026-09-07 sobre la referencia de **Apocalypse Coffee**. Detalle y comparación
contra ferm LIVING en `INVESTIGACION.md` §10.

**La idea en una frase:** todo en la página es una pieza apoyada sobre una superficie,
no un rectángulo flotando en una pantalla.

| Elemento | Regla |
|---|---|
| Sombras | **Duras, sin desenfoque.** 4px abajo y a la derecha. Al apretar un botón, se hunde. |
| Bordes | Filo sólido de 1.5px en color tinta. Nada de líneas grises tímidas. |
| Tipografía | Outfit 900 para titulares, **JetBrains Mono** para etiquetas chicas |
| Divisores | **Capas de impresión**, no rayas rectas |
| Precio | Etiqueta girada 2.5 grados, con el material de la pieza |
| Fondo | Grano fino al 5% sobre toda la página |
| Rótulos | Máximo dos por página, en mono y color de acento |

---

## 6c. Pulido, sección por sección

Todo lleva ahora el mismo lenguaje físico. Lo que se tocó en la segunda pasada:

| Sección | Qué cambió |
|---|---|
| **Menú** | Enlaces en monoespaciada mayúscula. Filo sólido abajo en vez de línea tímida. **En celular ya no desaparecen**: bajan a una segunda fila que se desliza. Antes, en teléfono no había forma de saltar a una sección. |
| **Armador** | El estado vacío ya no es una frase suelta: son **cinco ranuras punteadas** esperando las letras. |
| **Cómo funciona** | Era cuatro columnas con una rayita, o sea el cliché de las "tres tarjetas de features". Ahora es un **riel punteado** que conecta los cuatro pasos, y cada paso es un **cubo apoyado sobre el riel**. Se lee como proceso, no como lista. |
| **Colores** | Cada muestra tiene filo sólido y sombra dura. Se apoyan sobre la página. |
| **Ocasiones** | Se agregó la pista "Deslizá para ver todas". Antes no se notaba que había más de seis. |
| **Preguntas** | Todo el bloque es ahora un panel con filo y sombra dura, y **el `+` es un cubo** con el mismo filo rojo. |
| **Cierre** | Suma el teléfono a la vista, en monoespaciada, debajo del botón. |
| **Pie** | Marca con su cubo, enlaces en mono, y una línea honesta: "Todo en PLA, impreso por encargo". |

### Chequeos que se corrieron

- Contraste: se subió el gris de la nota del pie, quedaba flojo a 11px.
- Un solo color de acento en toda la interfaz. El multicolor solo aparece dentro de los
  cubos y las fotos, que es contenido del producto.
- Dos rótulos en toda la página (el máximo para 8 secciones antes de parecer plantilla).
- Un solo texto para el botón principal: "Pedir por WhatsApp", en los 13 lugares.
- El JavaScript se valida con `node --check` después de cada cambio, porque ya se rompió
  una vez al insertar CSS dentro del `<script>`.

---

## 6d. Que no se vea plana: lo que se agregó y por qué

Hugo pidió que la página llame la atención, que no sea plana, "futurista". El riesgo de
esa palabra es caer justo en el cliché de IA: neón, morado y vidrio. Se fue por el otro
lado: lo que aporta el efecto **sale del oficio de imprimir en 3D**, no de un catálogo
de efectos.

### 1. El visor 3D. Un modelo real, girable

`modelo/llavero.glb` es un archivo tuyo de verdad: el llavero de graduación
"PROMO 2026" con birrete, en acrílico negro glitter, blanco y oro glitter. Se puede
agarrar con el mouse y girar.

**Por qué esto y no un efecto:** para una imprenta 3D, mostrar el archivo antes de la
pieza es el argumento más honesto que existe. No es un adorno, es la prueba de que sabés
modelar. Ningún competidor en Panamá tiene nada así.

Detalles técnicos que importan:
- El script de `model-viewer` pesa cerca de 1 MB, así que **no se descarga hasta que la
  sección se acerca** (IntersectionObserver con 500px de margen). No toca la carga inicial.
- `touch-action="pan-y"`, sin eso el modelo se traga el scroll vertical en celular.
- La cama de impresión sube de tono en modo oscuro, porque la pieza es negra y sin eso
  desaparecía contra el fondo.
- Exposición subida a 1.7 y encuadre inicial a 25/72 grados: de frente se lee "PROMO 2026",
  de perfil era una silueta delgada.

### 2. Las fotos del catálogo se imprimen al entrar

Cada foto crece de abajo hacia arriba con una línea roja que va dejando la capa. Es
exactamente lo que hace una impresora 3D.

**Nota honesta:** primero se hizo con `animation-timeline: view()`, el scroll-driven
nativo de CSS, sin JavaScript. `CSS.supports()` decía que sí, pero la línea de tiempo
nunca se activaba, ni siquiera en un div de prueba aislado y limpio. Se descartó y se
rehízo con el IntersectionObserver que ya movía el resto de la página. **No se deja
puesto lo que no se pudo ver funcionando.**

Por la misma razón se quitó el parallax de los cubos del hero, que dependía de `scroll()`.
Los cubos siguen flotando, que eso sí funciona.

---

## 6e. La reforma de composición

Hugo señaló, con razón, que las mejoras anteriores agregaban **funciones** pero no
cambiaban la **forma**: la página seguía siendo barra arriba, hero partido en dos, y
secciones apiladas empezando todas en el mismo margen. Ese es el esqueleto de plantilla,
y ni el 3D ni las sombras duras lo cambian.

Lo que se reformó:

### El hero deja de ser dos cajas al lado

| Antes | Ahora |
|---|---|
| Columnas 50/50 con un hueco al medio | La foto **se sale del contenedor y llega al borde de la pantalla** |
| Titular mediano | Titular **casi al doble** (hasta 4.7rem) |
| El armador en su propia columna | El armador **se monta encima de la foto**, cruzando el límite entre las dos |

Que un elemento cruce el borde de otro es lo que hace que una página deje de leerse como
una grilla de cajas.

### "Cómo funciona" y "El archivo" se fusionan en una escena

Antes eran dos secciones: cuatro columnas iguales con una rayita (el cliché de las "tres
tarjetas de features") y aparte un visor 3D suelto.

Ahora es **una sola escena**: el modelo 3D **queda fijo** en la izquierda mientras los
cinco pasos pasan a su lado. La pieza se queda quieta, el relato avanza. Es `position:
sticky`, sin JavaScript, y funciona en todos los navegadores.

Además se agregó un paso nuevo, "Se modela", que es el que le da sentido al visor: el
modelo de al lado ES el ejemplo de lo que dice ese paso.

### Escala tipográfica

Los títulos de sección pasaron de un máximo de 2.9rem a 4rem. Antes todo tenía
prácticamente el mismo tamaño, que es otra de las razones por las que una página se
siente plana.

---

## 6f. Las fotos cortadas: qué pasaba y cómo quedó

Hugo dijo que las fotos se veían mal cortadas. Tenía razón y la causa era mía.

**El problema:** tus fotos vienen en **dos formatos mezclados**.

| Foto | Medida | Formato |
|---|---|---|
| cubos-letras-detalle | 1600 x 1200 | acostada 4:3 |
| soportes-celular | 1195 x 896 | acostada 4:3 |
| cajas-regalo | 1195 x 896 | acostada 4:3 |
| hero-manzana-cubos | 896 x 1195 | **parada 3:4** |
| cubos-numeros | 896 x 1195 | **parada 3:4** |
| manzana-piezas | 896 x 1195 | **parada 3:4** |

Yo las estaba metiendo a todas en la misma caja ancha, de casi 2:1. Meter una foto
parada 3:4 en una caja de 2:1 con recorte "cover" **tira más de la mitad de la imagen**.
Por eso solo se veía un pedazo del producto. Los parches de encuadre que había puesto
(`foco-bajo`, `foco-medio`) tapaban el síntoma, no la causa.

**La solución:** cada foto conserva su proporción real y no se recorta nada.

- Las acostadas van en caja ancha de 800px.
- Las paradas van en caja angosta de 460px.

Efecto secundario bueno: que unas sean anchas y otras angostas **le da ritmo a la lista**,
que era otra de las cosas que hacían ver la página plana.

**Nota:** cuando saques las fotos nuevas siguiendo `GUIA-FOTOS.md`, si las
tomás todas en el mismo formato se puede volver a una sola caja y queda más parejo.

---

## 7. Estructura de la página

**Decidido: las secciones informativas arriba y el catálogo al final**, en formato de
lista con índice, al estilo de un artículo (la referencia que pasó Hugo fue una lista de
Profesional Review). La idea es que el visitante entienda el negocio antes de ver precios.

1. [x] **Hero** — titular + armador de nombre + WhatsApp
2. [x] **El mínimo de pedido es 1** — el diferenciador contra Llaveros Panamá
3. [x] **Cómo funciona** — Escribís, Confirmamos, Imprimimos, Te llega
4. [x] **Colores disponibles** — muestrario de filamentos + nota del PLA
5. [x] **Para qué lo piden** — cumpleaños, graduaciones, fiestas, empresas, bodas, repuestos
6. [x] **Preguntas frecuentes** — 6 preguntas reales
7. [x] **Catálogo** — índice con los 5 productos y precios, y después cada producto
       uno debajo del otro: número en cubo, nombre, texto, precio, colores, botón y foto ancha
8. [x] **Cierre** — contacto

Botón flotante de WhatsApp siempre visible. **Mobile primero.**

---

## 7b. Generar y retocar fotos con Gemini

Hay un script listo: `herramientas/imagen.py`. Edita fotos reales o genera imágenes
usando **Nano Banana** (los modelos de imagen de Gemini).

```bash
# poner un celular sobre el soporte, partiendo de la foto real
python3 herramientas/imagen.py img/soporte-con-celular.jpg \
    "Poné un celular apoyado en el soporte, fondo blanco de estudio" \
    img/soportes-celular.jpg
```

La llave se lee de `~/.config/aronystech/gemini.key` (permisos 600) o de la variable
`GEMINI_API_KEY`. **Nunca dentro del repositorio**, por eso está el `.gitignore`.

### Estado: falta habilitar facturación

Probado el 2026-09-07. La llave **funciona para texto** pero devuelve `429 quota
exceeded` en los tres modelos de imagen (`gemini-3-pro-image`,
`gemini-3.1-flash-image`, `gemini-2.5-flash-image`). El plan gratuito de Gemini no
incluye generación de imágenes. Hay que activar facturación en el proyecto de Google
Cloud. Apenas se active, el script corre sin cambiarle nada.

Costo de referencia: Nano Banana Pro está en unos **$0.134 por imagen**, y cerca de la
mitad en modo batch. Las 6 fotos que hacen falta salen por menos de un dólar.

### La línea que no hay que cruzar

| Sí | No |
|---|---|
| Limpiar el fondo de una foto real (es lo que ya está en `fotos/editadas`) | Inventar un producto que no existe |
| Mejorar la luz o el encuadre de una pieza real | Cambiarle el color o la forma a una pieza real |
| Poner un celular de utilería sobre el soporte real | Mostrar un acabado más fino del que sale de la impresora |
| Fondos, texturas, banners | Fotos "de clientes" que nunca existieron |

La regla simple: **la pieza tiene que verse como la que el cliente va a recibir.** Si la
foto promete algo que la impresora no da, el problema vuelve como reclamo.

Ojo también: las imágenes de Gemini llevan marca de agua invisible **SynthID**, así que
son detectables como generadas por IA.

---

## 8. Decisión técnica → ver `STACK.md`

**Decidido el 2026-09-07:** nada de Vercel. Se va con **Docker**, panel **Coolify** y base
de datos **PocketBase**, en un servidor propio (~$5/mes). El detalle, el porqué de cada
elección y el plan por etapas están en **`STACK.md`**.

Resumen:

- El **catálogo público es estático** (HTML/CSS). Carga instantáneo, no se cae, y quien
  entra a ver llaveros nunca toca la base de datos.
- **PocketBase en Docker** guarda productos, precios, colores y fotos. Es un solo binario
  que ya trae base de datos, login y panel de administración terminado.
- **Coolify** en un Hetzner CX22 da la experiencia de Vercel pero en servidor propio:
  push a GitHub → despliegue automático → HTTPS solo.
- Docker ya está instalado en esta máquina, así que la etapa 1 (practicar local) es gratis
  y no requiere registrarse en nada.

> ⚠️ El VPS de netPika que abrís con `vps` es **Windows por RDP** y no sirve para esto.
> Hace falta una máquina Linux aparte.

---

## 9. Decisiones de Hugo (2026-09-07)

| Tema | Decisión |
|---|---|
| **Colores** | **Se quita la sección.** No se publica lista de filamentos. El armador del hero sigue teniendo el selector de color, y las fichas muestran puntos, pero **sin prometer cantidades** ("+6 colores" se eliminó). |
| **Precios** | Se dejan los de ejemplo por ahora. **El aviso de "versión de prueba" sigue arriba** hasta que sean reales. |
| **Tiempos** | **No se publican plazos.** La página dice que la fecha se da al confirmar. Ver la nota de abajo. |
| **Entrega** | **Todo Panamá**, a nivel nacional. Ya está en la página, en dos lugares. |
| **Pago** | **Efectivo, Yappy, tarjeta, criptomonedas y PayPal.** Sección "Entrega y pago" nueva. |

### Nota sobre no publicar tiempos

Hugo preguntó para qué sirven. La respuesta corta: **"¿cuándo me lo entregás?" es la primera
pregunta de casi todo cliente de algo hecho a medida**, sobre todo cuando el regalo tiene
fecha (cumpleaños, graduación). Sin un rango en la página, esa conversación arranca siempre
igual y consume tiempo de WhatsApp.

Dicho eso, **la decisión de no publicar plazos es defendible y se respetó**: prometer "2 a 3
días" y no cumplir es peor que no decir nada. La página ahora dice que la fecha exacta sale
al confirmar el pedido, y que no se dan plazos al aire. Eso es honesto y no cierra la puerta.

Si algún día se quiere el punto medio: un rango amplio y seguro ("normalmente entre 3 y 7
días hábiles") baja la fricción sin comprometerse a una fecha.

### Lo único que sigue pendiente

- [x] **Precios reales** (2026-11-24): los de la página eran casi los reales; se bajaron un poco. Llavero de nombre y de números $8, soporte $6, monedero $12, caja de regalo $15.
- [ ] Redes sociales (Instagram, TikTok, Facebook).
- [x] Letras por llavero: **máximo 10**, confirmado por Hugo.
- [x] Tamaño de las piezas en cm: no hace falta ponerlo.
- [x] Precio por volumen: baja **desde 10 unidades**.
- [ ] Confirmar que **sí vendés de una unidad** (de eso depende la sección "El mínimo es 1").
- [ ] Dominio propio: **sí va a haber**, falta pagarlo. Hoy se publica en Cloudflare (`aronystech-web.aronys160604.workers.dev`).

---

## 9b. Zona de administración

**Requisito (Hugo):** zona de admin que no aparezca como sección normal de la página.
Al detectar a la persona específica que entró, se le muestra el panel.
**Al inicio 2 personas**: Hugo Pineda (hijo), que atiende, cotiza, modela y programa, y Hugo Pineda (padre), que imprime. Se pueden sumar más después.

### Propuesta: PocketBase (no construida)

> **Estado al 2026-11-24:** esto nunca se construyó. La página sigue sin backend y todo el contenido se edita en `src/data/sitio.js`. Lo de abajo queda como idea para cuando haga falta.

La decisión de stack (sección 8 / `STACK.md`) resolvería esto sin trabajo extra:

- El panel de PocketBase **ya existe y está terminado** — se entra por su propia URL con
  usuario y contraseña. No aparece en el menú del catálogo, nadie lo ve.
- El login es **de verdad**, no un truco de JavaScript: el servidor no entrega nada a quien
  no está autenticado.
- Dar de alta a Hugo Pineda (padre) es crear un usuario en el panel. Sumar una tercera persona después es
  otro click.
- Desde ahí se editan productos, precios en dólares, colores y fotos, desde el navegador
  o el teléfono.

*(La comparación anterior de tres niveles — link secreto / Cloudflare Access / CMS — quedó
obsoleta: PocketBase cubre el nivel 2 y el 3 de una sola vez, sin trámites de Cloudflare ni
cuentas de GitHub.)*

### Pendiente

- [x] ~~¿Quién es "Juan"?~~ No existe: los dos del negocio son Hugo Pineda (hijo) y Hugo Pineda (padre).
- [ ] **¿Qué hace cada uno?** ¿Los dos pueden editar todo, o uno solo mira?
- [ ] ¿Va a haber algo sensible ahí (costos, márgenes, datos de clientes)?

---

## 10. Bitácora

| Fecha | Qué se hizo |
|---|---|
| 2026-09-07 | Se crea la carpeta, se copian las fotos y se arma este documento. |
| 2026-09-07 | Investigación de competencia, referentes y dirección de diseño → `INVESTIGACION.md`. |
| 2026-09-07 | Hugo fija el alcance: **solo catálogo**, sin carrito. Pide zona de admin oculta por detección de usuario → sección 9b. |
| 2026-09-07 | Precios en **dólares**. Admin para **2 personas** al inicio. Stack decidido: Docker + Coolify + PocketBase → `STACK.md`. |
| 2026-09-07 | **Corrección: el negocio es en Panamá, no Costa Rica.** Se rehizo la investigación de competencia y pagos. |
| 2026-09-07 | Primera versión visual de la página: `index.html`. |
| 2026-09-07 | Estudio de Playdate y Teenage Engineering → sección "El mínimo es 1", precios con material de pieza, tarjetas más cortas. Ver `INVESTIGACION.md` §8 y §9. |
| 2026-09-07 | Reestructura pedida por Hugo: secciones arriba, **catálogo al final en formato lista con índice**, como un artículo. Se elimina el bento. |
| 2026-09-07 | Script `herramientas/imagen.py` para Gemini. La llave funciona pero el plan gratuito no cubre imágenes: falta activar facturación. |
| 2026-09-07 | Se congela la base. Guía de fotos en `GUIA-FOTOS.md` para cuando Hugo tome las suyas. |
| 2026-09-07 | Hugo pasa Apocalypse Coffee y ferm LIVING. Se elige **Apocalypse**: sombras duras, monoespaciada, capas de impresión, grano, cubos flotando. |
| 2026-09-07 | Instaladas 19 skills de diseño (`claude-webkit` + `web-design`). |
| 2026-09-07 | Segunda pasada de pulido: menú, armador, pasos, colores, ocasiones, preguntas, cierre y pie → sección 6c. |
| 2026-09-07 | Hugo decide: sin sección de colores, sin plazos publicados, entrega nacional, 5 métodos de pago. Nueva sección "Entrega y pago". |
| 2026-09-07 | Se arreglan las fotos cortadas: cada una conserva su proporción real, cero recorte. Ver §6f. |
| 2026-09-07 | **Reforma de composición**: hero a sangre con el armador montado sobre la foto, y el modelo 3D fijo mientras pasan los pasos. Ver §6e. |
| 2026-09-07 | Visor 3D con el `.glb` real de Hugo + las fotos que se imprimen al entrar. Se descarta el scroll-driven de CSS por no funcionar. |
| 2026-09-07 | Auditoría anti-plantilla completa. Corregidos: contraste del botón en oscuro (3.94:1), gris chico en claro (2.87:1) y en oscuro (4.41:1), y la contradicción de 6 vs 10 letras. |
| 2026-11-24 | Precios bajados un poco ($8, $8, $6, $12, $15), mayoreo desde 10 unidades, máximo 10 letras confirmado. Se corrige "Juan" por Hugo Pineda (padre) y se aclara que PocketBase no está construido. |
