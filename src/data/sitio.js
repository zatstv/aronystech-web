/* Todo el contenido editable de la página vive acá.
   Para cambiar un precio, un texto o una pregunta, se toca este archivo y nada más. */

export const TEL = "50767955170";
export const TEL_BONITO = "+507 6795 5170";

/* Los ocho colores del armador. El orden importa: así se reparten
   los cubos cuando el cliente elige "colores surtidos". */
export const PALETA = [
  { hex: "#E5402B", nombre: "rojo" },
  { hex: "#24B5A6", nombre: "turquesa" },
  { hex: "#2E6FE8", nombre: "azul" },
  { hex: "#F2A00E", nombre: "mostaza" },
  { hex: "#7AC943", nombre: "verde" },
  { hex: "#8B4FD6", nombre: "morado" },
  { hex: "#22252A", nombre: "negro" },
  { hex: "#F2803C", nombre: "naranja" },
];

/* El armador muestra siete colores fijos más la opción surtida.
   El naranja queda fuera de los chips a propósito: la fila ya está llena. */
export const CHIPS = [
  { hex: "#E5402B", etiqueta: "Rojo" },
  { hex: "#24B5A6", etiqueta: "Turquesa" },
  { hex: "#2E6FE8", etiqueta: "Azul" },
  { hex: "#F2A00E", etiqueta: "Amarillo" },
  { hex: "#7AC943", etiqueta: "Verde" },
  { hex: "#8B4FD6", etiqueta: "Morado" },
  { hex: "#22252A", etiqueta: "Negro" },
];

export const PASOS = [
  { titulo: "Escribís", texto: "Nos mandás por WhatsApp qué querés, en qué color y para cuándo. Si tenés un diseño propio, también sirve." },
  { titulo: "Se modela", texto: "Tu idea se convierte en un archivo como el de al lado. Podés girarlo y verlo antes de que exista la pieza." },
  { titulo: "Confirmás", texto: "Te pasamos el precio final y la imagen de cómo va a quedar. Nada entra a la impresora sin tu visto bueno." },
  { titulo: "Se imprime", texto: "La pieza crece capa por capa y se limpia a mano. Cada pedido se hace desde cero, no sale de una caja." },
  { titulo: "Te llega", texto: "Enviamos a todo Panamá. Coordinamos la entrega y te avisamos apenas sale, por el mismo chat." },
];

export const PAGOS = [
  { icono: "ph-money", texto: "Efectivo" },
  { icono: "ph-device-mobile", texto: "Yappy" },
  { icono: "ph-credit-card", texto: "Tarjeta" },
  { icono: "ph-currency-btc", texto: "Criptomonedas" },
  { icono: "ph-paypal-logo", texto: "PayPal" },
];

export const OCASIONES = [
  { titulo: "Cumpleaños", texto: "Un llavero con el nombre cuesta menos que una tarjeta y dura años." },
  { titulo: "Graduaciones", texto: "Con el año, la carrera o las iniciales. Se pueden hacer varios iguales." },
  { titulo: "Recuerdos de fiesta", texto: "Pedidos de 20, 50 o 100 unidades con el mismo diseño y el precio baja." },
  { titulo: "Regalos de empresa", texto: "Con el logo de la compañía. Mandanos el archivo y lo adaptamos." },
  { titulo: "Bodas", texto: "Detalle para los invitados con la fecha o los nombres de los novios." },
  { titulo: "Piezas de repuesto", texto: "Esa perilla o soporte que ya no se consigue. Mandá la foto y la medida." },
];

export const PREGUNTAS = [
  {
    pregunta: "¿Se derrite si lo dejo en el carro?",
    respuesta: "El PLA se ablanda alrededor de los 60 grados. Un llavero colgando de las llaves o una pieza en el escritorio no tienen problema, pero dejarlo sobre el parabrisas al sol todo un día sí lo puede deformar. Si la pieza va a vivir a la intemperie, te la imprimimos en PETG, que aguanta más.",
  },
  {
    pregunta: "¿Cuánto tarda un pedido?",
    respuesta: "Depende de la pieza, del color y de la cola que haya en ese momento. Cuando confirmamos el pedido te damos la fecha exacta, y esa es la que se cumple. Preferimos no dar plazos al aire.",
  },
  {
    pregunta: "¿Puedo mandar mi propio diseño?",
    respuesta: "Sí. Si ya tenés el archivo en STL o 3MF lo imprimimos tal cual. Si solo tenés una foto, un boceto o el logo en PNG, lo modelamos nosotros y te cobramos el diseño aparte una sola vez.",
  },
  {
    pregunta: "¿Cuántas letras caben en un llavero?",
    respuesta: "Recomendamos hasta 10 cubos. Más largo se vuelve incómodo de cargar y pesa. Si necesitás una palabra larga, se puede repartir en dos llaveros.",
  },
  {
    pregunta: "¿Cómo se limpia?",
    respuesta: "Con agua tibia y jabón, nada de agua hirviendo ni lavaplatos. Si la pieza tiene malla, un cepillo de dientes viejo saca la suciedad de los huequitos.",
  },
  {
    pregunta: "¿Hacen pedidos grandes?",
    respuesta: "Sí, y es donde más conviene el precio. A partir de 20 unidades iguales el costo por pieza baja bastante. Escribinos con la cantidad y la fecha que necesitás.",
  },
];

/* Categorías del catálogo. El orden es el de los botones del filtro. */
export const CATEGORIAS = [
  "Llaveros",
  "Soportes y utilidades",
  "Decoración y hogar",
  "Regalos",
];

/* Los tres datos del hero. Son hechos verificables de PROYECTO.md, no
   métricas de relleno: el mínimo de 1 es el diferenciador contra la
   competencia, el envío nacional está decidido, y todo se imprime en PLA. */
export const DATOS = [
  { icono: "package", etiqueta: "Pedido mínimo", valor: "1 unidad" },
  { icono: "truck", etiqueta: "Envíos", valor: "Todo Panamá" },
  { icono: "layers", etiqueta: "Material", valor: "PLA" },
];

/* Opciones del formulario de pedido. */
export const TAMANOS = ["Pequeño", "Mediano", "Grande"];

/* Las fotos de la galería. Son las que hay hoy; cuando estén las nuevas de
   referencias/GUIA-FOTOS.md se cambian acá y nada más.
   Los formatos vienen mezclados (unas apaisadas y otras verticales), así que
   la galería las muestra enteras sobre un fondo en vez de recortarlas. */
export const GALERIA = [
  { src: "img/portada.jpg", alt: "Monedero manzana de malla roja con ARONYS TECH en cubos arriba y el teléfono en cubos abajo" },
  { src: "img/cubos-letras-detalle.jpg", alt: "La palabra ARONYSTECH formada con cubos de colores sobre fondo verde" },
  { src: "img/hero-manzana-cubos.jpg", alt: "Monedero manzana rojo rodeado de llaveros de cubos con letras y números" },
  { src: "img/cubos-numeros.jpg", alt: "Llavero de cubos turquesa con números sobre base roja" },
  { src: "img/soportes-celular.jpg", alt: "Cuatro soportes de celular impresos en 3D: mármol, negro, naranja y turquesa" },
  { src: "img/surtido.jpg", alt: "Soportes de celular de varios colores junto a llaveros de cubos con letras" },
  { src: "img/cubos-letras.jpg", alt: "Surtido de soportes de celular amarillo, turquesa, negro, blanco y morado con llaveros de cubos" },
  { src: "img/manzana-piezas.jpg", alt: "Piezas sueltas del monedero manzana: tapas de malla, bases negras, hoja turquesa y tallo" },
  { src: "img/cajas-regalo.jpg", alt: "Caja de regalo transparente con dulces y cinta, junto a llaveros de cubos" },
];

/* El catálogo. El orden de esta lista es el orden en la página y en el índice,
   y el `id` es el ancla del enlace (#p1, #p2...). */
export const PRODUCTOS = [
  {
    id: "p1",
    textoLibre: true,
    categoria: "Llaveros",
    nombre: "Llavero de nombre",
    precio: "$9",
    unidad: "hasta 10 letras",
    pedido: "un llavero de nombre",
    texto: "Cubos con letras que se enganchan entre sí, uno por letra. Cada cubo puede llevar su propio color, así que dos llaveros con el mismo nombre nunca son iguales. El enganche es parte de la pieza, no una argolla pegada.",
    colores: ["#E5402B", "#24B5A6", "#2E6FE8", "#F2A00E"],
    foto: {
      src: "img/cubos-letras-detalle.jpg",
      ancho: 1600,
      alto: 1200,
      forma: "foto-h",
      alt: "Primer plano de los cubos con letras que forman la palabra AronysTech",
    },
  },
  {
    id: "p2",
    textoLibre: true,
    categoria: "Llaveros",
    nombre: "Llavero de números",
    precio: "$9",
    unidad: "hasta 10 dígitos",
    pedido: "un llavero de números",
    texto: "El mismo sistema de cubos pero con dígitos. Sirve para el número de placa, un teléfono o una fecha que importa. Se puede combinar con letras en el mismo llavero.",
    colores: ["#24B5A6", "#E5402B", "#22252A"],
    foto: {
      src: "img/cubos-numeros.jpg",
      ancho: 896,
      alto: 1195,
      forma: "foto-v",
      alt: "Llavero de cubos con números turquesa sobre base roja formando un número de teléfono",
    },
  },
  {
    id: "p3",
    categoria: "Soportes y utilidades",
    nombre: "Soporte de celular",
    precio: "$7",
    unidad: "por unidad",
    pedido: "un soporte de celular",
    texto: "Plegable, aguanta el peso del teléfono sin moverse y cabe en cualquier bolso. Funciona en vertical y en horizontal, y el borde inferior deja pasar el cable del cargador.",
    colores: ["#F2803C", "#24B5A6", "#22252A", "#8B4FD6"],
    foto: {
      src: "img/soportes-celular.jpg",
      ancho: 1195,
      alto: 896,
      forma: "foto-h",
      alt: "Cuatro soportes de celular impresos en 3D: mármol, negro, naranja y turquesa",
    },
  },
  {
    id: "p4",
    categoria: "Decoración y hogar",
    nombre: "Monedero manzana",
    precio: "$14",
    unidad: "por unidad",
    pedido: "un monedero manzana",
    texto: "La tapa es una malla impresa que deja ver lo que hay adentro. El tallo y la hoja van aparte y se pueden pedir en otro color. Sirve para monedas, dulces o audífonos.",
    colores: ["#E5402B", "#22252A"],
    foto: {
      src: "img/manzana-piezas.jpg",
      ancho: 896,
      alto: 1195,
      forma: "foto-v",
      alt: "Piezas sueltas del monedero manzana: tapas rojas de malla, bases negras, hoja turquesa y tallo café",
    },
  },
  {
    id: "p5",
    categoria: "Regalos",
    nombre: "Caja de regalo armada",
    precio: "$18",
    unidad: "caja completa",
    pedido: "una caja de regalo armada",
    texto: "La pieza que elijás, empacada con dulces y cinta en caja transparente, lista para entregar. Es la opción para cuando el regalo es para hoy y no hay tiempo de envolver nada.",
    colores: [],
    foto: {
      src: "img/cajas-regalo.jpg",
      ancho: 1195,
      alto: 896,
      forma: "foto-h",
      alt: "Caja de regalo transparente con dulces y cinta, junto a llaveros de cubos",
    },
  },
];

/* Los cubitos de colores que flotan detrás del hero. */
export const SUELTOS = [
  { giro: "-12deg", lado: 46, top: "7%", left: "4%", color: "#F2A00E", retraso: "0s" },
  { giro: "9deg", lado: 34, top: "34%", left: "1.5%", color: "#24B5A6", retraso: "1.1s" },
  { giro: "-6deg", lado: 28, bottom: "14%", left: "6%", color: "#2E6FE8", retraso: "2.3s" },
  { giro: "14deg", lado: 40, top: "11%", right: "3%", color: "#7AC943", retraso: ".6s" },
  { giro: "-9deg", lado: 30, bottom: "9%", right: "6%", color: "#8B4FD6", retraso: "1.8s" },
];
