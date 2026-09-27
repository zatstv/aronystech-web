import { useEffect, useRef, useState } from "react";

import { RUEDA } from "../data/sitio.js";
import "./Rueda.css";

/* ============================================================
   Rueda de fotos: las tarjetas están puestas en un círculo grande, con la
   parte de arriba asomando en pantalla. Al bajar, la rueda gira una foto por
   vez: la que viene entra por la derecha, la que se va sale por la izquierda,
   y subiendo es al revés.

   La sección es alta a propósito (un tramo de scroll por foto) y adentro hay
   un marco pegado a la pantalla. Lo que se baja no mueve el marco: mueve la
   rueda.

   Todo lo que depende de la posición (ángulo, distancia a la de arriba) se
   pasa como variable CSS; el aspecto lo decide Rueda.css.
   ============================================================ */

const TOTAL = RUEDA.length;

export default function Rueda() {
  const [actual, setActual] = useState(0);
  const seccionRef = useRef(null);

  useEffect(() => {
    const seccion = seccionRef.current;
    if (!seccion) return;

    let cuadro = 0;
    const medir = () => {
      cuadro = 0;
      const caja = seccion.getBoundingClientRect();
      const recorrido = caja.height - window.innerHeight;
      if (recorrido <= 0) return;
      const avance = Math.min(Math.max(-caja.top / recorrido, 0), 1);
      setActual(Math.round(avance * (TOTAL - 1)));
    };
    /* Una medida por cuadro como mucho: el scroll dispara más eventos de los
       que la pantalla alcanza a pintar. */
    const alMover = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", alMover);
      window.removeEventListener("resize", alMover);
    };
  }, []);

  /* Tocar una de las vecinas lleva el scroll hasta donde esa queda arriba.
     No se gira la rueda directo: si no, al volver a bajar saltaría de nuevo
     a la que marca el scroll. */
  const irA = (i) => {
    const seccion = seccionRef.current;
    const recorrido = seccion.offsetHeight - window.innerHeight;
    const arriba = seccion.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: arriba + (recorrido * i) / (TOTAL - 1), behavior: "smooth" });
  };

  return (
    <section
      className="rueda"
      id="galeria"
      ref={seccionRef}
      aria-label="Galería de piezas impresas"
      style={{ "--total": TOTAL }}
    >
      <div className="rueda__marco">
        <ul className="rueda__giro" style={{ "--actual": actual }}>
          {RUEDA.map((foto, i) => {
            /* Cuántas fotos la separan de la de arriba, por el lado más corto
               del círculo. 0 es la de arriba. */
            const lejos = Math.min(Math.abs(i - actual), TOTAL - Math.abs(i - actual));
            return (
              <li
                key={foto.src}
                className={`rueda__tarjeta ${i === actual ? "esta-activo" : ""}`}
                style={{ "--i": i, "--lejos": lejos }}
                /* Las que están del otro lado de la rueda no se ven: que el
                   lector de pantalla tampoco las lea. */
                aria-hidden={lejos > 3}
                onClick={i === actual ? undefined : () => irA(i)}
              >
                <img
                  src={`/${foto.src}`}
                  alt={foto.alt}
                  /* Solo las que arrancan a la vista se piden de entrada. */
                  loading={lejos <= 3 ? "eager" : "lazy"}
                  decoding="async"
                  draggable="false"
                />
                <p className="rueda__titulo">{foto.titulo}</p>
              </li>
            );
          })}
        </ul>

        <p className="rueda__cuenta" aria-live="polite">
          <span>{String(actual + 1).padStart(2, "0")}</span> / {String(TOTAL).padStart(2, "0")}
          <span className="oculto-visual">: {RUEDA[actual].titulo}</span>
        </p>
      </div>
    </section>
  );
}
