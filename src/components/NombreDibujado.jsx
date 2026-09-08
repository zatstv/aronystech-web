import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { PALETA } from "../data/sitio.js";
import "./NombreDibujado.css";

/* ============================================================
   El nombre de la marca se dibuja solo, trazo por trazo.

   Se anima `stroke-dashoffset` sobre un <text> de SVG. El problema es que
   un <text> no tiene `getTotalLength()`, así que no hay forma directa de
   saber cuánto mide el contorno de las letras. Sin ese número el dibujo
   queda cortado (si te quedás corto) o se pasa un rato quieto sobre la
   palabra ya terminada (si te pasás).

   La solución: se dibuja el SVG en un canvas y se cuentan los píxeles con
   tinta. Después una búsqueda binaria encuentra el `dasharray` más chico
   que pinta lo mismo que la palabra completa. Ese es el largo real.
   ============================================================ */

const NS = "http://www.w3.org/2000/svg";

/* --- La fuente, metida dentro del SVG ---------------------------------
   Cuando el SVG se rasteriza pasa por un <img>, que corre aislado: no ve
   las fuentes que cargó la página. Sin esto, la medición se haría con la
   tipografía por defecto del navegador en vez de con Outfit, y el número
   saldría de otra palabra. Por eso Outfit 900 está auto-alojada en
   public/fuentes/ y se incrusta como data URI en el clon.
   Se descarga una sola vez para toda la página. */
let fuentePendiente = null;

function fuenteIncrustada() {
  if (fuentePendiente) return fuentePendiente;

  fuentePendiente = fetch("/fuentes/outfit-900-latin.woff2")
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("sin fuente"))))
    .then((buffer) => {
      const bytes = new Uint8Array(buffer);
      let binario = "";
      for (let i = 0; i < bytes.length; i += 1) binario += String.fromCharCode(bytes[i]);
      return btoa(binario);
    })
    .catch(() => null); // si falla, se mide igual con la fuente de reemplazo

  return fuentePendiente;
}

function cargarImagen(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("no se pudo rasterizar el SVG"));
    img.src = url;
  });
}

function contarOpacos(ctx, ancho, alto) {
  const datos = ctx.getImageData(0, 0, ancho, alto).data;
  let n = 0;
  for (let i = 3; i < datos.length; i += 4) {
    if (datos[i] > 12) n += 1;
  }
  return n;
}

/* Dibuja una copia del SVG en un canvas y devuelve cuántos píxeles quedaron
   con tinta. `aplicar` decide el dasharray de esa pasada. */
async function tintaDe(origen, base64, aplicar) {
  const clon = origen.cloneNode(true);
  clon.setAttribute("xmlns", NS);

  const texto = clon.querySelector("text");
  if (!texto) return 0;

  aplicar(texto);
  // Blanco puro: solo interesa cuánta superficie se pinta, no de qué color.
  texto.setAttribute("stroke", "#ffffff");
  texto.style.stroke = "#ffffff";

  if (base64) {
    const estilo = document.createElementNS(NS, "style");
    estilo.textContent =
      `@font-face{font-family:'Outfit';font-style:normal;font-weight:900;` +
      `src:url(data:font/woff2;base64,${base64}) format('woff2');}`;
    clon.insertBefore(estilo, clon.firstChild);
  }

  const caja = origen.viewBox.baseVal;
  const ancho = Math.max(1, Math.round(caja.width || 800));
  const alto = Math.max(1, Math.round(caja.height || 160));
  clon.setAttribute("width", String(ancho));
  clon.setAttribute("height", String(alto));
  clon.style.visibility = "visible";

  const xml = new XMLSerializer().serializeToString(clon);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const img = await cargarImagen(url);
    // Al 45% del tamaño: alcanza para comparar superficies y es el doble de rápido.
    const cw = Math.max(1, Math.round(ancho * 0.45));
    const ch = Math.max(1, Math.round(alto * 0.45));
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return 0;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, cw, ch);
    return contarOpacos(ctx, cw, ch);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* El dasharray más chico que pinta lo mismo que la palabra terminada. */
async function medirLargoDelTrazo(svg) {
  const base64 = await fuenteIncrustada();

  const completa = await tintaDe(svg, base64, (t) => {
    t.style.strokeDasharray = "none";
    t.style.strokeDashoffset = "0";
  });
  if (completa <= 0) throw new Error("el SVG no pintó nada");

  // 99.4% y no 100%: el antialias hace que el último píxel nunca coincida exacto.
  const cubre = async (largo) => {
    const tinta = await tintaDe(svg, base64, (t) => {
      t.style.strokeDasharray = `${largo} 100000`;
      t.style.strokeDashoffset = "0";
    });
    return tinta >= completa * 0.994;
  };

  // Primero se duplica hasta pasarse, después se busca el borde por bisección.
  let alto = 64;
  while (alto < 24000 && !(await cubre(alto))) alto *= 2;

  let bajo = 1;
  while (bajo < alto) {
    const medio = (bajo + alto) >> 1;
    if (await cubre(medio)) alto = medio;
    else bajo = medio + 1;
  }

  return Math.max(1, bajo);
}

export default function NombreDibujado({
  texto,
  desde = PALETA[0].hex,          // rojo tomate
  hasta = PALETA[1].hex,          // turquesa
  grosor = 2.4,
  /* Segundos que tarda una pasada completa */
  duracion = 5.5,
  /* Vuelve a empezar apenas termina de dibujar */
  repetir = true,
  cajaAncho = 860,
  cajaAlto = 240,
  tamano = 148,
  className,
}) {
  const idLimpio = useId().replace(/:/g, "");
  const idGradiente = `trazo-${idLimpio}`;
  const svgRef = useRef(null);
  const textoRef = useRef(null);
  const [largo, setLargo] = useState(0);
  const menosMovimiento = useReducedMotion();

  const palabra = texto.trim();

  /* Medición. Corre una sola vez por palabra/tamaño. */
  useEffect(() => {
    if (!palabra || menosMovimiento) return;
    if (!svgRef.current) return;

    let cancelado = false;

    (async () => {
      try {
        await document.fonts.ready;
        if (cancelado || !svgRef.current) return;

        const medido = await medirLargoDelTrazo(svgRef.current);
        if (!cancelado) setLargo(medido);
      } catch {
        // Plan B: el ancho del texto por un factor. Menos fino, pero se ve.
        const el = textoRef.current;
        if (!el || cancelado) return;
        const ancho = el.getComputedTextLength() || palabra.length * tamano * 0.62;
        setLargo(Math.max(1, Math.ceil(ancho * 1.15)));
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [palabra, tamano, cajaAncho, grosor, menosMovimiento]);

  /* El dibujo. Se mueve el dashoffset a mano con requestAnimationFrame en vez
     de con una animación CSS, porque así el ciclo reinicia justo cuando la
     palabra queda completa y nunca se queda quieto sobre el resultado. */
  useLayoutEffect(() => {
    const el = textoRef.current;
    if (!el) return;

    if (menosMovimiento || largo <= 0) {
      el.style.strokeDasharray = "none";
      el.style.strokeDashoffset = "0";
      return;
    }

    el.style.strokeDasharray = `${largo} ${largo}`;
    el.style.strokeDashoffset = String(largo);

    const ms = Math.max(0.8, duracion) * 1000;
    const porMs = largo / ms;
    let restante = largo;
    let anterior = performance.now();
    let cuadro = 0;

    const paso = (ahora) => {
      // Tope de 48ms: si la pestaña estuvo en segundo plano, que no salte de golpe.
      const dt = Math.min(48, ahora - anterior);
      anterior = ahora;
      restante -= porMs * dt;

      if (restante <= 0) {
        if (!repetir) {
          el.style.strokeDashoffset = "0";
          return;
        }
        restante = largo;
      }

      el.style.strokeDashoffset = String(restante);
      cuadro = window.requestAnimationFrame(paso);
    };

    cuadro = window.requestAnimationFrame(paso);
    return () => window.cancelAnimationFrame(cuadro);
  }, [largo, duracion, repetir, menosMovimiento]);

  if (!palabra) return null;

  // Hasta que se sepa el largo se mantiene oculto: si no, la palabra aparece
  // entera un instante y recién ahí arranca a dibujarse.
  const listo = largo > 0 || Boolean(menosMovimiento);

  return (
    <div className={["nombre-dibujado", className].filter(Boolean).join(" ")}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${cajaAncho} ${cajaAlto}`}
        role="img"
        aria-label={palabra}
        style={{ visibility: listo ? "visible" : "hidden" }}
      >
        <defs>
          <linearGradient id={idGradiente} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={desde} />
            <stop offset="100%" stopColor={hasta} />
          </linearGradient>
        </defs>

        <text
          ref={textoRef}
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="none"
          stroke={`url(#${idGradiente})`}
          strokeWidth={grosor}
          strokeLinejoin="round"
          strokeLinecap="round"
          fontFamily="Outfit, ui-sans-serif, system-ui, sans-serif"
          fontWeight="900"
          fontSize={tamano}
          letterSpacing="0.02em"
        >
          {palabra}
        </text>
      </svg>
    </div>
  );
}
