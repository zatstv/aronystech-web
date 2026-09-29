import { ArrowRight, PencilRuler } from "lucide-react";

import { PALETA, PRODUCTOS } from "../data/sitio.js";
import { ENCABEZADO, useEntradaEscalonada } from "../hooks/useEntradaEscalonada.js";
import "./Catalogo.css";

/* ============================================================
   Las piezas que ya tienen precio. Cada tarjeta lleva a la ficha de la
   pieza (#producto/<id>), que es donde se lee la descripción, se ven los
   colores y se hace el pedido.

   Antes cada tarjeta tenía además un botón "Pedir" que abría el modal
   directo. Se sacó: la gente pedía sin haber visto qué incluye la pieza.
   Ahora toda la tarjeta es un solo enlace a la ficha.

   El enlace es el del nombre, estirado con un ::after que cubre la tarjeta
   entera. Así un lector de pantalla oye solo "Llavero de nombre, enlace", y
   no la tarjeta completa leída de corrido como si fuera el texto del enlace.

   La última tarjeta no es una pieza: es la salida al pedido personalizado,
   para quien no encontró lo suyo.

   Lo que se muestra sale de PRODUCTOS en data/sitio.js.
   ============================================================ */

function Colores({ hexes }) {
  const colores = PALETA.filter((c) => hexes.includes(c.hex));
  if (!colores.length) return <span />;
  return (
    <p className="producto__colores">
      <span className="oculto-visual">
        Colores: {colores.map((c) => c.nombre).join(", ")}.
      </span>
      {/* Un cubito por color, como los de los llaveros. */}
      {colores.map((c) => (
        <span key={c.hex} className="producto__cubo" style={{ background: c.hex }} aria-hidden="true" />
      ))}
    </p>
  );
}

export default function Catalogo() {
  const encabezadoRef = useEntradaEscalonada({ selector: ENCABEZADO });
  const listaRef = useEntradaEscalonada();

  return (
    <section className="catalogo" id="catalogo">
      <div className="contenedor" ref={encabezadoRef}>
        <p className="rotulo">Catálogo</p>
        <h2 className="titulo-seccion catalogo__titulo">Piezas con precio</h2>
        <p className="catalogo__intro">
          Precios de lista. El total se confirma por WhatsApp antes de imprimir:
          baja con la cantidad.
        </p>

        <ul className="catalogo__lista" ref={listaRef}>
          {PRODUCTOS.map((p) => (
            <li className="producto" key={p.id}>
              <div className="producto__marco">
                <div className="producto__foto">
                  <img
                    src={`/${p.foto.src}`}
                    alt=""
                    width={p.foto.ancho}
                    height={p.foto.alto}
                    style={p.foto.encuadre ? { objectPosition: p.foto.encuadre } : undefined}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="producto__categoria">{p.categoria}</p>
                <p className="producto__precio">{p.precio}</p>
              </div>

              <div className="producto__cuerpo">
                <h3 className="producto__nombre">
                  <a href={`#producto/${p.id}`}>{p.nombre}</a>
                </h3>
                <p className="producto__unidad">{p.unidad}</p>
                <p className="producto__texto">{p.texto}</p>

                <div className="producto__pie">
                  <Colores hexes={p.colores} />
                  <span className="producto__ver" aria-hidden="true">
                    Ver detalles
                    <ArrowRight size={16} strokeWidth={2.4} />
                  </span>
                </div>
              </div>
            </li>
          ))}

          <li className="producto producto--otro">
            <PencilRuler size={30} strokeWidth={1.8} aria-hidden="true" />
            <h3 className="producto__nombre">¿No está lo que buscas?</h3>
            <p>
              Cuéntanos la idea y te la cotizamos. Desde una sola unidad, con tu
              logo, tus colores o tus medidas.
            </p>
            <a className="boton" href="#personalizado">
              Pedido personalizado
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
