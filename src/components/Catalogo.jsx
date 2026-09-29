import { ArrowRight, PencilRuler } from "lucide-react";

import { PRODUCTOS } from "../data/sitio.js";
import { ENCABEZADO, useEntradaEscalonada } from "../hooks/useEntradaEscalonada.js";
import "./Catalogo.css";

/* ============================================================
   Las piezas que ya tienen precio. Es la puerta de entrada a la ficha de
   cada una (#producto/<id>) y al modal de pedido, que llevaban un tiempo
   sin ningún enlace que llegara a ellos.

   Cada tarjeta tiene dos salidas: "Pedir" abre el modal directo, para quien
   ya sabe lo que quiere; el nombre y la foto llevan a la ficha, para quien
   quiere leer primero. La última tarjeta no es una pieza: es la salida al
   pedido personalizado, para quien no encontró lo suyo.

   Lo que se muestra sale de PRODUCTOS en data/sitio.js.
   ============================================================ */

export default function Catalogo({ alPedir }) {
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
              <a className="producto__foto" href={`#producto/${p.id}`} tabIndex={-1} aria-hidden="true">
                <img
                  src={`/${p.foto.src}`}
                  alt=""
                  width={p.foto.ancho}
                  height={p.foto.alto}
                  style={p.foto.encuadre ? { objectPosition: p.foto.encuadre } : undefined}
                  loading="lazy"
                  decoding="async"
                />
              </a>

              <div className="producto__cuerpo">
                <p className="producto__categoria">{p.categoria}</p>
                <h3 className="producto__nombre">
                  <a href={`#producto/${p.id}`}>{p.nombre}</a>
                </h3>
                <p className="producto__precio">
                  {p.precio} <span>{p.unidad}</span>
                </p>

                <button
                  type="button"
                  className="producto__pedir"
                  onClick={() => alPedir(p)}
                  aria-label={`Pedir ${p.nombre}`}
                >
                  Pedir
                  <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
                </button>
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
