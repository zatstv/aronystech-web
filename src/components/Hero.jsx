import { useEffect, useRef, useState } from "react";
import { ArrowRight, Boxes, MessageCircle, Package, Truck } from "lucide-react";

import { DATOS } from "../data/sitio.js";
import "./Hero.css";

const ICONOS = { package: Package, truck: Truck, layers: Boxes };

/* ============================================================
   Portada a sangre: el video ocupa toda la pantalla y encima flota lo
   mínimo. Nada de tarjetas ni recuadros, como en la referencia.

   El video es decorativo y va en aria-hidden: lo que hay que entender está
   escrito al lado. Si alguien pidió menos movimiento ni siquiera se baja,
   se muestra el póster y listo: son 1,2 MB que se ahorra.
   ============================================================ */

const POSTER = "/video/impresora-poster.webp";

export default function Hero({ alPersonalizar }) {
  const seccionRef = useRef(null);
  /* Se lee una sola vez, al montar: si el video ya empezó, cambiar la
     preferencia a mitad de camino no debería hacerlo desaparecer de golpe. */
  const [quieto] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* Cuánto se lleva la cabecera antes de la portada. Se mide en vez de
     escribirlo: la barra cambió de riel lateral a cabecera de arriba, y con
     un número fijo la portada se pasa de la pantalla apenas cambie el alto.
     Medir el borde de arriba de la sección sirve igual si la cabecera está
     en el flujo, si es pegajosa o si flota encima. */
  useEffect(() => {
    const el = seccionRef.current;
    if (!el) return;

    const medir = () => {
      const arriba = el.getBoundingClientRect().top + window.scrollY;
      el.style.setProperty("--portada-tope", `${Math.max(0, Math.round(arriba))}px`);
    };

    /* En el siguiente cuadro: recién ahí la cabecera tiene su alto real. */
    const id = requestAnimationFrame(medir);
    window.addEventListener("resize", medir);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", medir);
    };
  }, []);

  return (
    <section className="portada" id="inicio" ref={seccionRef}>
      <div className="portada__fondo" aria-hidden="true">
        {quieto ? (
          <img src={POSTER} alt="" />
        ) : (
          <video
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            /* Sin esto, iOS lo abre a pantalla completa al tocarlo. */
            disablePictureInPicture
          >
            <source src="/video/impresora.webm" type="video/webm" />
            <source src="/video/impresora.mp4" type="video/mp4" />
          </video>
        )}
        {/* El velo no es parejo: carga arriba y abajo, que es donde va el
            texto, y deja el medio limpio para que se vea la pieza. */}
        <div className="portada__velo" />
      </div>

      <div className="portada__contenido">
        <h1 className="portada__titular">
          Diseñamos tu idea,
          <span>y lo imprimimos en 3D.</span>
        </h1>

        <div className="portada__pie">
          <p className="portada__bajada">
            Llaveros, soportes y piezas a medida. Todo en PLA, pieza por pieza,
            desde una sola unidad.
          </p>

          <div className="portada__cierre">
            <dl className="portada__datos">
              {DATOS.map((d) => {
                const Icono = ICONOS[d.icono];
                return (
                  <div key={d.etiqueta}>
                    <dt>
                      <Icono size={13} strokeWidth={2.4} aria-hidden="true" />
                      {d.etiqueta}
                    </dt>
                    <dd>{d.valor}</dd>
                  </div>
                );
              })}
            </dl>

            <div className="portada__acciones">
              {/* Abre el formulario de pedido personalizado, no WhatsApp:
                  primero se juntan las respuestas y recién al final se arma
                  el mensaje. */}
              <button
                type="button"
                className="portada__boton portada__boton--hueco"
                onClick={alPersonalizar}
              >
                <MessageCircle size={15} strokeWidth={2.4} aria-hidden="true" />
                Pedido personalizado
              </button>

              <a className="portada__boton" href="#galeria">
                Ver las piezas
                <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
