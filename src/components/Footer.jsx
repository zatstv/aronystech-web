import { ArrowRight, ArrowUpRight, Link2, MessageCircle, Phone, Plus } from "lucide-react";

import Marca from "./Marca.jsx";
import { REDES, TEL, TEL_BONITO } from "../data/sitio.js";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./Footer.css";

/* ============================================================
   El pie es una grilla de celdas con el filo a la vista, no una fila de
   columnas sueltas. Sigue invirtiendo la superficie —la tinta es el fondo—
   y adentro va todo del mismo color: acá el acento no se gasta, se lo queda
   el resto de la página.

   Termina con la marca escrita a lo ancho, del tamaño que dé el bloque.
   ============================================================ */

const SITIO = [
  { href: "#inicio", texto: "Inicio" },
  { href: "#galeria", texto: "Galería" },
  { href: "#nosotros", texto: "Nosotros" },
];

/* --- Un renglón de enlace: nombre a la izquierda, flecha a la derecha y la
       raya de puntos abajo --- */
function Renglon({ href, texto, externo = false }) {
  return (
    <li className="pie__renglon">
      <a
        href={href}
        {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span>{texto}</span>
        <ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" />
      </a>
    </li>
  );
}

export default function Footer() {
  const anio = new Date().getFullYear();

  /* Los dos canales que existen de verdad. Las redes se suman solas cuando
     sitio.js las tenga. */
  const canales = [
    {
      id: "whatsapp",
      nombre: "WhatsApp",
      url: linkWhatsApp("Hola, quisiera hacer una consulta."),
      Icono: MessageCircle,
    },
    { id: "tel", nombre: "Llamar", url: `tel:+${TEL}`, Icono: Phone },
    /* lucide 1.x sacó los íconos de marca del paquete, así que las redes
       entran con un eslabón genérico. Cuando existan las cuentas conviene
       pegarles el SVG de cada marca en vez de esto. */
    ...REDES.map((r) => ({ ...r, Icono: Link2 })),
  ];

  return (
    <footer className="pie">
      {/* --- Arriba: quiénes somos y a dónde ir --- */}
      <div className="pie__alta">
        <div className="pie__celda pie__quienes">
          <p className="pie__copy">AronysTech © {anio}</p>
          <p className="pie__texto">
            Impresiones 3D por encargo en Panamá. Todo en PLA, pieza por pieza,
            desde una sola unidad.
          </p>
          <div className="pie__sello" aria-hidden="true">
            <Marca sobreOscuro alto="2.8rem" />
          </div>
          <Plus className="pie__cruz pie__cruz--abajo-izq" size={20} strokeWidth={2} aria-hidden="true" />
        </div>

        <div className="pie__celda pie__mapa">
          <div className="pie__columna">
            <p className="pie__rotulo">Sitio:</p>
            <ul className="pie__lista">
              {SITIO.map((e) => (
                <Renglon key={e.href} {...e} />
              ))}
            </ul>
          </div>

          <div className="pie__columna">
            <p className="pie__rotulo">Pedidos:</p>
            <ul className="pie__lista">
              <Renglon
                href={linkWhatsApp("Hola, quisiera hacer un pedido.")}
                texto="Pedir por WhatsApp"
                externo
              />
              <Renglon href={`tel:+${TEL}`} texto={TEL_BONITO} />
              <Renglon href="#acceso" texto="Tu cuenta" />
            </ul>
          </div>

          <Plus className="pie__cruz pie__cruz--abajo-der" size={20} strokeWidth={2} aria-hidden="true" />
        </div>
      </div>

      {/* --- Franja de contacto: a la izquierda el texto, a la derecha una
              celda por canal --- */}
      {/* Cuántos canales hay lo decide sitio.js, así que el número de columnas
          se lo pasa el componente a la hoja de estilos. */}
      <div className="pie__franja" style={{ "--canales": canales.length }}>
        <div className="pie__celda pie__contacto">
          <p className="pie__escribinos">
            Escríbenos:
            <a href={linkWhatsApp("Hola, quisiera hacer una consulta.")} target="_blank" rel="noopener noreferrer">
              {TEL_BONITO}
            </a>
          </p>
          <p className="pie__rubros">
            <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
            Llaveros / Soportes / Piezas a medida
          </p>
        </div>

        {canales.map(({ id, nombre, url, Icono }) => (
          <a
            key={id}
            className="pie__canal"
            href={url}
            aria-label={nombre}
            {...(url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Icono size={26} strokeWidth={1.9} aria-hidden="true" />
          </a>
        ))}
      </div>

      {/* --- La marca a lo ancho. Es decorativa: el nombre ya está arriba,
              así que para un lector de pantalla sería repetirlo dos veces. --- */}
      <p className="pie__gigante" aria-hidden="true">Aronys<span>—</span>Tech</p>

      <div className="pie__legal">
        <Marca sobreOscuro alto="2rem" />
        <span>Impreso por encargo en Panamá 20—{String(anio).slice(2)}</span>
      </div>
    </footer>
  );
}
