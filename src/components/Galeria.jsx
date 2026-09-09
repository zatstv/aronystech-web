import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { GALERIA } from "../data/sitio.js";
import "./Galeria.css";

/* ============================================================
   Galería de fotos: se arrastra, se pasa con las flechas y tiene una tira
   de miniaturas donde la activa se ensancha. Portado del carrusel de
   miniaturas a JSX con los tokens de la página.

   Dos cambios sobre el original:
   - Las fotos se muestran enteras (object-fit: contain) sobre el papel, no
     recortadas. Las de acá vienen en formatos mezclados, y §6f del
     PROYECTO.md ya dejó dicho que no se recortan.
   - Usa `motion`, que ya estaba instalado. `framer-motion` es el nombre
     viejo de la misma librería: instalarlo sería duplicarla.
   ============================================================ */

const MINI_ANCHA = 120;
const MINI_ANGOSTA = 36;
const SEPARACION = 3;
const MARGEN = 3;

function Miniaturas({ indice, alElegir }) {
  const tiraRef = useRef(null);

  /* Centra la miniatura activa. Como solo una está ensanchada, la posición
     se calcula sumando las angostas que quedaron detrás. */
  useEffect(() => {
    const tira = tiraRef.current;
    if (!tira) return;
    const hastaAca = indice * (MINI_ANGOSTA + SEPARACION) + MARGEN;
    const centro = tira.offsetWidth / 2 - MINI_ANCHA / 2;
    tira.scrollTo({ left: hastaAca - centro, behavior: "smooth" });
  }, [indice]);

  return (
    <div className="galeria__tira" ref={tiraRef}>
      <div className="galeria__tira-interior">
        {GALERIA.map((foto, i) => (
          <motion.button
            key={foto.src}
            type="button"
            onClick={() => alElegir(i)}
            aria-label={`Ver foto ${i + 1} de ${GALERIA.length}`}
            aria-current={i === indice}
            className={`galeria__mini ${i === indice ? "esta-activa" : ""}`}
            initial={false}
            animate={i === indice ? "activa" : "quieta"}
            variants={{
              activa: {
                width: MINI_ANCHA,
                marginLeft: MARGEN,
                marginRight: MARGEN,
              },
              quieta: { width: MINI_ANGOSTA, marginLeft: 0, marginRight: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <img src={`/${foto.src}`} alt="" loading="lazy" draggable={false} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function Galeria() {
  const [indice, setIndice] = useState(0);
  const [arrastrando, setArrastrando] = useState(false);
  const [ancho, setAncho] = useState(0);
  const marcoRef = useRef(null);
  const x = useMotionValue(0);
  const quieto = useReducedMotion();

  const ultima = GALERIA.length - 1;
  const ir = useCallback(
    (n) => setIndice(Math.max(0, Math.min(ultima, n))),
    [ultima],
  );

  /* El ancho del marco manda: define el paso del desplazamiento y los topes
     del arrastre. Si cambia el tamaño de la ventana hay que volver a medir,
     o el carrusel queda desfasado. */
  useEffect(() => {
    const medir = () => setAncho(marcoRef.current?.offsetWidth ?? 0);
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  useEffect(() => {
    if (arrastrando || !ancho) return;
    const destino = -indice * ancho;
    if (quieto) {
      x.set(destino);
      return;
    }
    const control = animate(x, destino, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
    return () => control.stop();
  }, [indice, ancho, arrastrando, quieto, x]);

  /* Flechas del teclado, que el original no traía. */
  const alTeclear = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      ir(indice - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      ir(indice + 1);
    }
  };

  return (
    <section className="galeria" id="galeria">
      <div className="contenedor">
        <p className="rotulo">Galería</p>
        <h2 className="titulo-seccion galeria__titulo">Cómo se ven de cerca</h2>
        <p className="galeria__intro">
          Fotos de piezas ya entregadas. Arrastrá para pasarlas, o tocá una
          miniatura.
        </p>

        <div className="galeria__carrusel">
          <div
            className="galeria__marco"
            ref={marcoRef}
            tabIndex={0}
            role="group"
            aria-roledescription="carrusel"
            aria-label="Fotos de piezas impresas"
            onKeyDown={alTeclear}
          >
            <motion.div
              className="galeria__pista"
              style={{ x }}
              drag="x"
              dragElastic={0.15}
              dragMomentum={false}
              dragConstraints={{ left: -ultima * ancho, right: 0 }}
              onDragStart={() => setArrastrando(true)}
              onDragEnd={(e, info) => {
                setArrastrando(false);
                const { offset, velocity } = info;
                // Un gesto rápido pasa de foto aunque el dedo no haya recorrido
                // mucho; si fue lento, se exige un tercio del ancho.
                if (Math.abs(velocity.x) > 500)
                  ir(indice + (velocity.x > 0 ? -1 : 1));
                else if (Math.abs(offset.x) > ancho * 0.3)
                  ir(indice + (offset.x > 0 ? -1 : 1));
                else ir(indice);
              }}
            >
              {GALERIA.map((foto, i) => (
                <div
                  className="galeria__hueco"
                  key={foto.src}
                  aria-hidden={i !== indice}
                >
                  <img
                    src={`/${foto.src}`}
                    alt={foto.alt}
                    loading={i === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </div>
              ))}
            </motion.div>

            <button
              type="button"
              className="galeria__flecha es-izquierda"
              onClick={() => ir(indice - 1)}
              disabled={indice === 0}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={20} strokeWidth={2.6} />
            </button>

            <button
              type="button"
              className="galeria__flecha es-derecha"
              onClick={() => ir(indice + 1)}
              disabled={indice === ultima}
              aria-label="Foto siguiente"
            >
              <ChevronRight size={20} strokeWidth={2.6} />
            </button>

            <p className="galeria__cuenta" aria-live="polite">
              {indice + 1} / {GALERIA.length}
            </p>
          </div>

          <Miniaturas indice={indice} alElegir={ir} />
        </div>
      </div>
    </section>
  );
}
