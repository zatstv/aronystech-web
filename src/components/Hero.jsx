import { Boxes, MessageCircle, Package, Truck } from "lucide-react";

import NombreDibujado from "./NombreDibujado.jsx";
import { DATOS, PALETA } from "../data/sitio.js";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./Hero.css";

const ICONOS = { package: Package, truck: Truck, layers: Boxes };

export default function Hero() {
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
            <a
              className="boton boton--hueco"
              href={linkWhatsApp("Hola, quisiera cotizar un pedido personalizado.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} strokeWidth={2.4} />
              Pedido personalizado
            </a>
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
            <img
              src="/img/llavero-selection.png"
              width="950"
              height="1195"
              alt="Monedero manzana rojo junto a llaveros de cubos con letras de colores"
              fetchPriority="high"
            />
          </div>

          {/* Los colores del armador, no un muestrario de filamentos: la §9
              decidió no publicar la lista ni prometer cantidades. */}
          <div className="hero__colores">
            <p className="rotulo">Colores para combinar</p>
            <div className="hero__puntos">
              {PALETA.map((c) => (
                <span key={c.nombre} title={c.nombre} style={{ background: c.hex }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
