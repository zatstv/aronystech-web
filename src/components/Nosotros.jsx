import { ArrowRight } from "lucide-react";

import { useEntradaEscalonada } from "../hooks/useEntradaEscalonada.js";
import "./Nosotros.css";

/* ============================================================
   Quiénes están detrás. La foto es del dinosaurio sentado sobre una de las
   impresoras: es lo más parecido a una foto del taller que hay por ahora, y
   dice lo mismo que el texto, que acá se imprime pieza por pieza.

   Es la misma foto de la galería, así que quien ya la vio no la vuelve a
   bajar. Si algún día hay una del taller de verdad, se cambia FOTO y listo.
   ============================================================ */

const FOTO = {
  src: "/img/rueda/dino-impresora.webp",
  alt: "Dinosaurio gris con lentes y teclado, impreso en 3D, sentado encima de una impresora 3D del taller",
  ancho: 700,
  alto: 525,
};

export default function Nosotros() {
  const cajaRef = useEntradaEscalonada();

  return (
    <section className="nosotros" id="nosotros">
      <div className="contenedor nosotros__caja">
        <figure className="nosotros__foto">
          <img
            src={FOTO.src}
            alt={FOTO.alt}
            width={FOTO.ancho}
            height={FOTO.alto}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="nosotros__texto-caja" ref={cajaRef}>
          <p className="rotulo">Nosotros</p>
          <h2 className="nosotros__titulo">Un taller chico que imprime de a uno</h2>
          <p className="nosotros__texto">
            Somos un taller de impresión 3D en Panamá por encargo, que diseña y fabrica piezas únicas, una a la vez. Todo lo que hacemos es artesanal, hecho a mano y con mucho cuidado. No tenemos stock: cada pedido es especial y se hace a medida.
          </p>
          <a className="boton nosotros__boton" href="#personalizado">
            Cuéntanos tu idea
            <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
