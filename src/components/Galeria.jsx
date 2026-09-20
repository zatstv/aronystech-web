import { useEffect, useRef, useState } from "react";

import { SECUENCIA } from "../data/sitio.js";
import "./Galeria.css";

/* ============================================================
   La galería no es un mosaico: es una secuencia que se recorre bajando.

   La foto queda quieta a un costado mientras los textos pasan al lado. El
   paso que esté más cerca del medio de la pantalla manda, y la foto cambia
   sola. Sirve para mostrar una pieza armada y después por separado sin que
   el visitante tenga que tocar nada.

   Para cambiar lo que se ve se edita SECUENCIA en data/sitio.js. Acá no hay
   nada escrito a mano.
   ============================================================ */

export default function Galeria() {
  const [activo, setActivo] = useState(0);
  const pasosRef = useRef([]);

  useEffect(() => {
    const pasos = pasosRef.current.filter(Boolean);
    if (!pasos.length || !("IntersectionObserver" in window)) return;

    /* Recorta 45% arriba y abajo: queda una franja angosta en el medio de la
       pantalla y manda el paso que la cruza. Sin el recorte, con dos pasos a
       la vista ganaba siempre el de arriba y la foto cambiaba tarde. */
    const obs = new IntersectionObserver(
      (entradas) => {
        const dentro = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!dentro.length) return;
        const i = pasos.indexOf(dentro[0].target);
        if (i >= 0) setActivo(i);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    pasos.forEach((p) => obs.observe(p));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="secuencia" id="galeria">
      <div className="contenedor">
        {/* Sin rótulo ni titular: la sección entra directo desde el video y
            arranca con la pieza. Queda solo la línea que dice qué hacer. */}
        <p className="secuencia__intro">
          Baja para ver la misma pieza armada y por separado.
        </p>

        <div className="secuencia__grilla">
          {/* La foto, quieta mientras pasan los textos. */}
          <div className="secuencia__vista">
            <div className="secuencia__marco">
              {SECUENCIA.map((paso, i) => (
                <img
                  key={paso.src}
                  className={`secuencia__foto ${i === activo ? "esta-activo" : ""}`}
                  src={`/${paso.src}`}
                  alt={paso.alt}
                  /* La primera entra con la sección; las demás cuando toque. */
                  loading={i === 0 ? "eager" : "lazy"}
                  /* Solo la que se ve cuenta para un lector de pantalla: las
                     otras cuatro estarían ahí, invisibles, narrando fotos que
                     nadie está mirando. */
                  aria-hidden={i !== activo}
                />
              ))}
            </div>

            {/* La cuenta se saca de la vista pero no del todo: con la foto
                cambiando sola, quien usa lector de pantalla no tiene otra
                forma de enterarse de que cambió. Se queda anunciándose. */}
            <p className="oculto-visual" aria-live="polite">
              Foto {activo + 1} de {SECUENCIA.length}: {SECUENCIA[activo].titulo}
            </p>
          </div>

          <ol className="secuencia__pasos">
            {SECUENCIA.map((paso, i) => (
              <li
                key={paso.src}
                ref={(el) => (pasosRef.current[i] = el)}
                className={`secuencia__paso ${i === activo ? "esta-activo" : ""}`}
              >
                <p className="secuencia__numero">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="secuencia__paso-titulo">{paso.titulo}</h3>
                <p className="secuencia__paso-texto">{paso.texto}</p>

                {/* En celular la foto no se queda quieta al costado: no hay
                    costado. Cada paso lleva la suya y se bajan de corrido. */}
                <img
                  className="secuencia__foto-movil"
                  src={`/${paso.src}`}
                  alt={paso.alt}
                  loading="lazy"
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
