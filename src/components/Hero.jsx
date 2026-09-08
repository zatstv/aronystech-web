import { motion, useReducedMotion } from "motion/react";

import NombreDibujado from "./NombreDibujado.jsx";
import { TEL_BONITO } from "../data/sitio.js";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./Hero.css";

/* La entrada se escalona: rótulo, nombre, titular. Una sola curva para todo,
   así el movimiento se siente de una pieza y no de tres animaciones sueltas. */
const CURVA = [0.22, 1, 0.36, 1];

function entrada(retraso, quieto) {
  if (quieto) return {};
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: retraso, ease: CURVA },
  };
}

export default function Hero() {
  const quieto = Boolean(useReducedMotion());

  return (
    <section className="hero" id="inicio">
      <div className="contenedor hero__grilla">
        <div>
          <motion.p className="rotulo" {...entrada(0, quieto)}>
            Impresión 3D · Panamá
          </motion.p>

          {/* El nombre se dibuja solo, en loop. */}
          <motion.div
            className="hero__nombre"
            {...(quieto
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.985 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.9, delay: 0.12, ease: CURVA },
                })}
          >
            {/* El SVG ya se anuncia como imagen con el nombre de la marca,
                así que no hace falta repetirlo en un título oculto. */}
            <NombreDibujado texto="AronysTech" cajaAncho={760} cajaAlto={180} tamano={110} grosor={3} />  
          </motion.div>
        </div>

        <div>


          {/* Ranuras del armador. Cuando mandes el componente, reemplaza este
              bloque por <ArmadorCubos /> y el resto del hero queda igual. */}
          <div className="hero__armador">
            <p className="rotulo">Armá tu llavero</p>
            <div className="hero__ranuras" aria-hidden="true">
              <span className="hero__ranura" />
              <span className="hero__ranura" />
              <span className="hero__ranura" />
              <span className="hero__ranura" />
              <span className="hero__ranura" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
