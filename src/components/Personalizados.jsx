import { Boxes, MessageSquareText, Package, Palette, Printer } from "lucide-react";

import { PASOS } from "../data/sitio.js";
import "./Personalizados.css";

const ICONOS = [Palette, Boxes, MessageSquareText, Printer, Package];

export default function Personalizados() {
  return (
    <section className="personalizados" id="personalizados">
      <div className="contenedor personalizados__grilla">
        <div className="personalizados__foto">
          <img
            src="/img/cubos-letras-detalle.jpg"
            width="1600"
            height="1200"
            alt="Primer plano de los cubos con letras que forman la palabra AronysTech"
            loading="lazy"
          />
        </div>

        <div>
          <p className="rotulo">A pedido</p>
          <h2 className="titulo-seccion personalizados__titulo">
            Se hace con lo que vos elijas
          </h2>
          <p className="personalizados__intro">
            Nada sale de una caja. Elegís el texto, los colores y el tamaño, y la
            pieza se imprime para vos desde cero.
          </p>

          {/* Riel punteado que conecta los pasos: se lee como proceso, no como
              una lista de tarjetas. */}
          <ol className="personalizados__pasos">
            {PASOS.map((paso, i) => {
              const Icono = ICONOS[i] ?? Boxes;
              return (
                <li key={paso.titulo}>
                  <span className="personalizados__icono">
                    <Icono size={18} strokeWidth={2.4} />
                  </span>
                  <div>
                    <h3>
                      {i + 1}. {paso.titulo}
                    </h3>
                    <p>{paso.texto}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
