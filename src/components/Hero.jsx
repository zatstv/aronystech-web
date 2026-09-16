import { Boxes, MessageCircle, Package, Truck } from "lucide-react";

import NombreDibujado from "./NombreDibujado.jsx";
import { DATOS, PALETA } from "../data/sitio.js";
import "./Hero.css";

const ICONOS = { package: Package, truck: Truck, layers: Boxes };

export default function Hero({ alPersonalizar }) {
  return (
    <section className="hero" id="inicio">
      <div className="contenedor hero__grilla">
        <div className="hero__texto">
          <span className="hero__pastilla">
            <span className="hero__punto" aria-hidden="true" />
            Impresión 3D por encargo
          </span>

          {/* El nombre se dibuja solo, en loop. */}
          <div className="hero__nombre">
            <NombreDibujado texto="AronysTech" cajaAncho={760} cajaAlto={180} tamano={110} grosor={3} />
          </div>

          <h1 className="hero__titular">
            Diseñamos tu idea,
            <br />
            <span className="hero__titular-acento">y lo imprimimos en 3D.</span>
          </h1>

          <p className="hero__bajada">
            diseñamos o imprimimos tu idea en 3D, pieza por pieza, desde una sola unidad. Todo en PLA, hecho a mano y por encargo.
          </p>

          <div className="hero__acciones">
            <a className="boton" href="#catalogo">
              <Package size={17} strokeWidth={2.4} />
              Ver catálogo
            </a>
            <button
              type="button"
              className="boton boton--hueco"
              onClick={alPersonalizar}
            >
              <MessageCircle size={17} strokeWidth={2.4} />
              Pedido personalizado
            </button>
          </div>

          <dl className="hero__datos">
            {DATOS.map((d) => {
              const Icono = ICONOS[d.icono];
              return (
                <div key={d.etiqueta}>
                  <dt>
                    <Icono size={14} strokeWidth={2.4} />
                    {d.etiqueta}
                  </dt>
                  <dd>{d.valor}</dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="hero__lado">
          <div className="hero__foto">
            {/* Recorte de llavero-selection.png, que traía el llavero ocupando
                el 58% del ancho y flotaba dentro del marco. El original sigue
                en public/img por si hace falta otro encuadre.

                Las medidas son las del archivo: con ellas el navegador reserva
                el hueco antes de bajarlo y la portada no salta al cargar. Si
                se cambia la foto, hay que cambiarlas. */}
            <img
              src="/img/llavero-hero.png"
              width="1484"
              height="873"
              alt="Llavero rectangular impreso en 3D con el logotipo de AronysTech en relieve, rojo y turquesa"
              fetchPriority="high"
            />
          </div>

          {/* Los colores del armador, no un muestrario de filamentos: la §9
              decidió no publicar la lista ni prometer cantidades. */}

        </div>
      </div>
    </section>
  );
}
