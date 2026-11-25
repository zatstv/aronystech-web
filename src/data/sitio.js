/* Todo el contenido editable de la página vive acá.
   Para cambiar un precio, un texto o una pregunta, se toca este archivo y nada más. */

export const TEL = "50670622458";
export const TEL_BONITO = "+506 7062 2458";

/* Redes sociales, para la fila de íconos del pie.

   Instagram y TikTok ya están. Facebook sigue pendiente
   (docs/PROYECTO.md §2) y un ícono que no lleva a ningún lado es peor que no
   tenerlo. Cuando haya cuenta se agrega acá y la celda aparece sola:

     { id: "instagram", nombre: "Instagram", url: "https://instagram.com/..." }

   El id solo tiene que ser distinto entre sí. Los íconos de marca no vienen
   en lucide 1.x: hoy todas entran con un eslabón genérico. */
export const REDES = [
  { id: "instagram", nombre: "Instagram", url: "https://www.instagram.com/aronystech" },
  { id: "tiktok", nombre: "TikTok", url: "https://www.tiktok.com/@aronystech_16" },
];

/* Los colores de filamento que hay. De acá salen los que se ofrecen en el
   pedido de cada pieza (filtrados por `colores` de PRODUCTOS) y las
   bolitas del pedido personalizado. */
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

/* `icono` elige el dibujo de cada paso en la línea de tiempo, y de cada
   ocasión en su tarjeta. Qué dibujo corresponde a cada nombre está en
   ICONOS, en Proceso.jsx. */
export const PASOS = [
  { icono: "mensaje", titulo: "Escribes", texto: "Nos mandas por WhatsApp qué quieres, en qué color y para cuándo. Si tienes un diseño propio, también sirve." },
  { icono: "modelo", titulo: "Se modela", texto: "Tu idea se convierte en un archivo 3D. Puedes girarlo y verlo antes de que exista la pieza." },
  { icono: "visto", titulo: "Confirmas", texto: "Te pasamos el precio final y la imagen de cómo va a quedar. Nada entra a la impresora sin tu visto bueno." },
  { icono: "impresora", titulo: "Se imprime", texto: "La pieza crece capa por capa y se limpia a mano. Cada pedido se hace desde cero, no sale de una caja." },
  { icono: "envio", titulo: "Te llega", texto: "Enviamos a todo Panamá. Coordinamos la entrega y te avisamos apenas sale, por el mismo chat." },
];

/* Cómo se puede pagar. Los nombres de icono son los de lucide, que es la
   librería que usa la página; antes decían "ph-*", de Phosphor, que no está
   instalada y por eso no dibujaban nada.

   Yappy va segundo a propósito: en Panamá es el que más se usa y el que la
   gente busca antes de escribir para preguntar.

   `detalle` es lo que se lee debajo de cada método en el último paso del
   pedido. `enLinea: true` quiere decir que una pieza del catálogo se paga ahí
   mismo: la página muestra la cuenta (CUENTAS_PAGO), el cliente pone el número
   de comprobante, sale la factura y recién después se manda por WhatsApp. Los
   demás métodos se coordinan por el chat como siempre. */
export const PAGOS = [
  { icono: "efectivo", texto: "Efectivo", detalle: "Al recibir o al retirar el pedido" },
  { icono: "yappy", texto: "Yappy", detalle: "Pagas aquí mismo y te sale la factura", enLinea: true },
  { icono: "banco", texto: "Transferencia bancaria", detalle: "Pagas aquí mismo y te sale la factura", enLinea: true },
  { icono: "tarjeta", texto: "Tarjeta", detalle: "Te pasamos los datos por el chat" },
  { icono: "cripto", texto: "Criptomonedas", detalle: "Te pasamos la dirección por el chat" },
  { icono: "paypal", texto: "PayPal", detalle: "Te pasamos los datos por el chat" },
];

/* A dónde se paga con los métodos `enLinea`. Los datos del banco quedan en
   blanco hasta tenerlos. */
export const CUENTAS_PAGO = {
  Yappy: [
    ["Yappy", "6711-0785"],
    ["A nombre de", "Hugo Pineda"],
  ],
  "Transferencia bancaria": [
    ["Banco", ""],
    ["Tipo de cuenta", ""],
    ["Número de cuenta", ""],
    ["A nombre de", "Hugo Pineda"],
  ],
};

export const OCASIONES = [
  { icono: "torta", titulo: "Cumpleaños", texto: "Un llavero con el nombre cuesta menos que una tarjeta y dura años." },
  { icono: "birrete", titulo: "Graduaciones", texto: "Con el año, la carrera o las iniciales. Se pueden hacer varios iguales." },
  { icono: "fiesta", titulo: "Recuerdos de fiesta", texto: "Pedidos de 10, 20 o 50 unidades con el mismo diseño y el precio baja." },
  { icono: "empresa", titulo: "Regalos de empresa", texto: "Con el logo de la compañía. Mándanos el archivo y lo adaptamos." },
  { icono: "boda", titulo: "Bodas", texto: "Detalle para los invitados con la fecha o los nombres de los novios." },
  { icono: "repuesto", titulo: "Piezas de repuesto", texto: "Esa perilla o soporte que ya no se consigue. Manda la foto y la medida." },
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
    respuesta: "Sí. Si ya tienes el archivo en STL o 3MF lo imprimimos tal cual. Si solo tienes una foto, un boceto o el logo en PNG, lo modelamos nosotros y te cobramos el diseño aparte una sola vez.",
  },
  {
    pregunta: "¿Cuántas letras caben en un llavero?",
    respuesta: "El máximo es 10 cubos. Más largo se vuelve incómodo de cargar y pesa. Si necesitas una palabra larga, se puede repartir en dos llaveros.",
  },
  {
    pregunta: "¿Cómo se limpia?",
    respuesta: "Con agua tibia y jabón, nada de agua hirviendo ni lavaplatos. Si la pieza tiene malla, un cepillo de dientes viejo saca la suciedad de los huequitos.",
  },
  {
    pregunta: "¿Hacen pedidos grandes?",
    respuesta: "Sí, y es donde más conviene el precio. A partir de 10 unidades iguales el costo por pieza baja bastante. Escríbenos con la cantidad y la fecha que necesitas.",
  },
];

/* Los tres datos del hero. Son hechos verificables de docs/PROYECTO.md, no
   métricas de relleno: el mínimo de 1 es el diferenciador contra la
   competencia, el envío nacional está decidido, y todo se imprime en PLA. */
export const DATOS = [
  { icono: "package", etiqueta: "Pedido mínimo", valor: "1 unidad" },
  { icono: "truck", etiqueta: "Envíos", valor: "Todo Panamá" },
  { icono: "layers", etiqueta: "Material", valor: "PLA" },
];

/* Opciones del formulario de pedido. */
export const TAMANOS = ["Pequeño", "Mediano", "Grande"];

/* El pedido personalizado arranca eligiendo qué clase de pieza es. Cada tipo
   trae su propio ejemplo en la caja de descripción: a quien no sabe cómo
   pedir algo, ver cómo lo pidió otro le resuelve la mitad.

   El `id` es también el ancla: #personalizado/repuesto abre el formulario con
   ese tipo ya elegido. */
export const TIPOS_ENCARGO = [
  { id: "llavero", nombre: "Llavero", ejemplo: "Un llavero de cubos que diga MAMÁ, con un corazón al final" },
  { id: "logo", nombre: "Con mi logo", ejemplo: "30 llaveros con el logo de mi negocio para regalar a clientes" },
  { id: "regalo", nombre: "Regalo o recuerdo", ejemplo: "Recuerdos para una boda con los nombres y la fecha" },
  { id: "repuesto", nombre: "Pieza de repuesto", ejemplo: "La perilla de la estufa se partió; tengo la pieza rota para medirla" },
  { id: "utilidad", nombre: "Soporte o utilidad", ejemplo: "Un soporte para colgar los audífonos debajo del escritorio" },
  { id: "otro", nombre: "Otra idea", ejemplo: "Cuéntanos qué tienes en mente, aunque no sepas si se puede imprimir" },
];

/* Qué tiene el cliente para mostrarnos. Cambia lo que le pedimos después:
   con un STL imprimimos tal cual, con una foto hay que modelar. */
export const REFERENCIAS = [
  { id: "archivo", nombre: "Un archivo 3D", detalle: "STL, 3MF u OBJ: se imprime tal cual" },
  { id: "imagen", nombre: "Una foto, logo o boceto", detalle: "Lo modelamos nosotros; el diseño se cobra una vez" },
  { id: "nada", nombre: "Solo la idea", detalle: "Te ayudamos a definirla desde cero" },
];

/* Los botones rápidos de cantidad. A partir de MAYOREO el formulario avisa
   que el precio por pieza baja (ver PREGUNTAS, "¿Hacen pedidos grandes?"). */
export const CANTIDADES = [1, 5, 10, 20, 50];
export const MAYOREO = 10;

/* La galería: un mosaico de fotos justo después de la portada, en filas
   del mismo alto que se llenan a lo ancho.

   El orden de la lista es el orden del mosaico, de izquierda a derecha y
   de arriba abajo. Conviene no poner juntas dos fotos de la misma pieza.
   Las fotos viven en public/img/rueda, recortadas a 700px de ancho. */
export const GALERIA = [
  { src: "img/rueda/barco-pirata.webp", alt: "Galeón negro con velas rotas, visto de costado sobre una mesa de madera" },
  { src: "img/rueda/llavero-panda.webp", alt: "Llavero negro brillante con la silueta de un panda y argolla metálica" },
  { src: "img/rueda/organizador-plumas.webp", alt: "Organizador negro en forma de prisma con plumas y lápices en sus huecos" },
  { src: "img/rueda/ocarina.webp", alt: "Ocarina azul sobre una base blanca con forma de columna" },
  { src: "img/rueda/hogwarts-libreria.webp", alt: "Rincón iluminado con la escalera de Hogwarts, encajado entre los libros de una repisa" },
  { src: "img/rueda/llavero-yuji.webp", alt: "Llavero negro brillante con el dibujo de Yuji Itadori" },
  { src: "img/rueda/dino-programador.webp", alt: "Dinosaurio gris con lentes sentado al borde de una repisa, escribiendo en un teclado" },
  { src: "img/rueda/tablero-pared.webp", alt: "Tablero blanco de pared con repisas hexagonales, un control de consola y figuras pequeñas" },
  { src: "img/rueda/sombrero-libros.webp", alt: "Sujetalibros gris con un sombrero de mago sobre una pila de libros, entre libros antiguos" },
  { src: "img/rueda/llavero-gojo.webp", alt: "Llavero negro brillante con el dibujo de Satoru Gojo con la venda en los ojos" },
  { src: "img/rueda/mascota-escritorio.webp", alt: "Figura naranja de bloques sentada detrás de una laptop, sobre una base roja" },
  { src: "img/rueda/hogwarts-escalera.webp", alt: "Detalle de una escalera blanca con barandal y cuadros pequeños colgados en la pared" },
  { src: "img/rueda/barco-velas.webp", alt: "Barco pirata negro visto de tres cuartos, con todas sus velas y cuerdas" },
  { src: "img/rueda/llaveros-jujutsu.webp", alt: "Cuatro llaveros de Jujutsu Kaisen sobre fondo blanco: Panda, Nobara, Yuji y Gojo" },
  { src: "img/rueda/organizador-vacio.webp", alt: "Organizador de escritorio negro y gris, vacío, mostrando sus compartimentos" },
  { src: "img/rueda/figura-gojo.webp", alt: "Figura de Satoru Gojo de pie junto a una lámpara de mesa" },
  { src: "img/rueda/sombrero-perfil.webp", alt: "Sujetalibros del sombrero de mago visto de lado, apoyado contra un libro" },
  { src: "img/rueda/llavero-nobara.webp", alt: "Llavero negro brillante con el dibujo de Nobara Kugisaki" },
  { src: "img/rueda/dino-impresora.webp", alt: "Dinosaurio gris con lentes y teclado sentado encima de una impresora 3D" },
  { src: "img/rueda/tablero-vacio.webp", alt: "Paneles blancos perforados montados en la pared, sin accesorios" },
  { src: "img/rueda/barco-proa.webp", alt: "Barco pirata negro visto desde la proa sobre una mesa" },
  { src: "img/rueda/organizador-modulos.webp", alt: "Tres módulos del organizador de escritorio encajados entre sí" },
  { src: "img/rueda/mascota-codigo.webp", alt: "La mascota naranja de bloques junto a una pantalla con código" },
];

/* El catálogo. El orden de esta lista es el orden en la página, y el `id`
   es el ancla de la ficha (#producto/p1, #producto/p2...).

   `foto.encuadre` es opcional: qué parte de la foto se ve en la tarjeta del
   catálogo, que la recorta apaisada. Sin él se ve el centro. */
export const PRODUCTOS = [
  {
    id: "p1",
    textoLibre: true,
    categoria: "Llaveros",
    nombre: "Llavero de nombre",
    precio: "$8",
    unidad: "hasta 10 letras",
    texto: "Cubos con letras que se enganchan entre sí, uno por letra. Cada cubo puede llevar su propio color, así que dos llaveros con el mismo nombre nunca son iguales. El enganche es parte de la pieza, no una argolla pegada.",
    colores: ["#E5402B", "#24B5A6", "#2E6FE8", "#F2A00E"],
    foto: {
      src: "img/cubos-letras-detalle.webp",
      ancho: 1600,
      alto: 1200,
      alt: "Primer plano de los cubos con letras que forman la palabra AronysTech",
    },
  },
  {
    id: "p2",
    textoLibre: true,
    categoria: "Llaveros",
    nombre: "Llavero de números",
    precio: "$8",
    unidad: "hasta 10 dígitos",
    texto: "El mismo sistema de cubos pero con dígitos. Sirve para el número de placa, un teléfono o una fecha que importa. Se puede combinar con letras en el mismo llavero.",
    colores: ["#24B5A6", "#E5402B", "#22252A"],
    foto: {
      src: "img/cubos-numeros.webp",
      ancho: 896,
      alto: 1195,
      /* En la tarjeta del catálogo la foto se recorta apaisada, y al medio
         está la manzana: los números quedan abajo de todo. */
      encuadre: "center bottom",
      alt: "Llavero de cubos con números turquesa sobre base roja formando un número de teléfono",
    },
  },
  {
    id: "p3",
    categoria: "Soportes y utilidades",
    nombre: "Soporte de celular",
    precio: "$6",
    unidad: "por unidad",
    texto: "Plegable, aguanta el peso del teléfono sin moverse y cabe en cualquier bolso. Funciona en vertical y en horizontal, y el borde inferior deja pasar el cable del cargador.",
    colores: ["#F2803C", "#24B5A6", "#22252A", "#8B4FD6"],
    foto: {
      src: "img/soportes-celular.webp",
      ancho: 1195,
      alto: 896,
      alt: "Cuatro soportes de celular impresos en 3D: mármol, negro, naranja y turquesa",
    },
  },
  {
    id: "p4",
    categoria: "Decoración y hogar",
    nombre: "Monedero manzana",
    precio: "$12",
    unidad: "por unidad",
    texto: "La tapa es una malla impresa que deja ver lo que hay adentro. El tallo y la hoja van aparte y se pueden pedir en otro color. Sirve para monedas, dulces o audífonos.",
    colores: ["#E5402B", "#22252A"],
    foto: {
      src: "img/manzana-piezas.webp",
      ancho: 896,
      alto: 1195,
      alt: "Piezas sueltas del monedero manzana: tapas rojas de malla, bases negras, hoja turquesa y tallo café",
    },
  },
  {
    id: "p5",
    categoria: "Regalos",
    nombre: "Caja de regalo armada",
    precio: "$15",
    unidad: "caja completa",
    texto: "La pieza que elijas, empacada con dulces y cinta en caja transparente, lista para entregar. Es la opción para cuando el regalo es para hoy y no hay tiempo de envolver nada.",
    colores: [],
    foto: {
      src: "img/cajas-regalo.webp",
      ancho: 1195,
      alto: 896,
      alt: "Caja de regalo transparente con dulces y cinta, junto a llaveros de cubos",
    },
  },
];
