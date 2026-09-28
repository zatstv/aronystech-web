import { useEffect, useRef, useState } from "react";

import { GALERIA } from "../data/sitio.js";
import "./Galeria.css";

/* ============================================================
   Galería en cuadrícula, vista de lejos. Cada foto ocupa una celda del
   tamaño de la sección entera, y la cuadrícula completa está achicada
   (--zoom) para que la elegida quede al centro y las vecinas asomen
   alrededor. Elegir otra desliza la cuadrícula hasta ponerla al centro;
   abrirla quita el achique y la foto llena la sección.

   Idea de "Canvas grid" de Giovanni Antonio, pasada a React. De la original
   no se trajo el zoom con la rueda del mouse: acá la rueda baja la página,
   y robársela dejaría a la gente atrapada en la galería. Las flechas solo
   mueven la galería cuando tiene el foco, no en toda la página.
   ============================================================ */

const TOTAL = GALERIA.length;
/* Columnas de la cuadrícula; las filas salen solas. Con 23 fotos quedan
   5 × 5 con dos huecos al final. */
const COLUMNAS = Math.ceil(Math.sqrt(TOTAL));
/* Arranca en una del medio, para que haya vecinas por todos lados. */
const INICIAL = Math.floor(TOTAL / 2);

export default function Galeria() {
  const [actual, setActual] = useState(INICIAL);
  const [abierta, setAbierta] = useState(false);
  const celdasRef = useRef([]);

  const x = actual % COLUMNAS;
  const y = Math.floor(actual / COLUMNAS);

  const elegir = (i) => {
    setActual(i);
    /* preventScroll: el marco tiene overflow hidden, y sin esto el
       navegador lo desplaza por su cuenta para mostrar la celda enfocada,
       descuadrando la cuadrícula. */
    celdasRef.current[i]?.focus({ preventScroll: true });
  };

  const alTocar = (i) => {
    if (i === actual) setAbierta((a) => !a);
    else if (!abierta) elegir(i);
  };

  const alTeclear = (ev) => {
    let nx = x;
    let ny = y;
    switch (ev.key) {
      case "ArrowLeft": nx--; break;
      case "ArrowRight": nx++; break;
      case "ArrowUp": ny--; break;
      case "ArrowDown": ny++; break;
      case "Escape":
        if (!abierta) return;
        setAbierta(false);
        ev.preventDefault();
        return;
      default:
        return;
    }
    ev.preventDefault();
    const filas = Math.ceil(TOTAL / COLUMNAS);
    nx = Math.min(Math.max(nx, 0), COLUMNAS - 1);
    ny = Math.min(Math.max(ny, 0), filas - 1);
    /* La última fila puede venir incompleta: no pasarse de la última foto. */
    elegir(Math.min(ny * COLUMNAS + nx, TOTAL - 1));
  };

  /* Si la sección sale de pantalla abierta, se cierra: al volver a pasar
     no debería encontrarse una foto a pantalla completa tapando el scroll. */
  const seccionRef = useRef(null);
  useEffect(() => {
    if (!abierta) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) setAbierta(false);
    });
    obs.observe(seccionRef.current);
    return () => obs.disconnect();
  }, [abierta]);

  return (
    <section
      className={`galeria ${abierta ? "esta-abierta" : ""}`}
      id="galeria"
      ref={seccionRef}
      aria-label="Galería de piezas impresas"
      aria-roledescription="galería"
      onKeyDown={alTeclear}
      style={{ "--columnas": COLUMNAS }}
    >
      <div className="galeria__marco">
        <div className="galeria__vista">
          <ul className="galeria__lienzo" style={{ "--x": x, "--y": y }}>
            {GALERIA.map((foto, i) => (
              <li key={foto.src} className={`galeria__celda ${i === actual ? "esta-activo" : ""}`}>
                <button
                  type="button"
                  ref={(el) => (celdasRef.current[i] = el)}
                  /* Una sola celda entra con Tab; las flechas mueven entre ellas. */
                  tabIndex={i === actual ? 0 : -1}
                  aria-label={i === actual ? (abierta ? "Cerrar foto" : "Ver foto en grande") : `Ir a la foto ${i + 1}`}
                  onClick={() => alTocar(i)}
                >
                  <img
                    src={`/${foto.src}`}
                    alt={foto.alt}
                    /* Las vecinas de la inicial se piden de entrada. */
                    loading={Math.abs(i - INICIAL) <= COLUMNAS + 1 ? "eager" : "lazy"}
                    decoding="async"
                    draggable="false"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* El recuadro fijo que marca la elegida, y la cruz del centro. */}
        <div className="galeria__foco" aria-hidden="true" />
        <div className="galeria__mira" aria-hidden="true">
          <span /><span /><span />
        </div>

        {/* Mapa chico de toda la cuadrícula, para saltar lejos de un toque.
            Repite lo que ya hacen las flechas, así que el lector de pantalla
            se lo salta. */}
        <div className="galeria__mapa" aria-hidden="true">
          {GALERIA.map((foto, i) => (
            <button
              key={foto.src}
              type="button"
              tabIndex={-1}
              className={i === actual ? "esta-activo" : ""}
              onClick={() => elegir(i)}
            />
          ))}
        </div>

        <p className="galeria__cuenta" aria-live="polite">
          <span>{String(actual + 1).padStart(2, "0")}</span> / {String(TOTAL).padStart(2, "0")}
        </p>

        <button type="button" className="galeria__cerrar" tabIndex={abierta ? 0 : -1} onClick={() => setAbierta(false)}>
          Cerrar
        </button>
      </div>
    </section>
  );
}
