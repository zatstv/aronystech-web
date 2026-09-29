import { useEffect, useRef, useState } from "react";

import { GALERIA } from "../data/sitio.js";
import { gsap, pideQuietud } from "../lib/movimiento.js";
import "./Galeria.css";

/* ============================================================
   Galería en mosaico: las fotos van en filas del mismo alto y cada una se
   estira lo que haga falta para que la fila llene el ancho. Las verticales
   quedan angostas y las horizontales anchas, sin recortar de más.

   Basado en "Adaptive photo layout with flexbox" (CSS-Tricks). Los
   polyfills del original (lazysizes, object-fit-images) ya no hacen falta:
   todos los navegadores de hoy traen loading="lazy" y object-fit.
   ============================================================ */

function Foto({ foto }) {
  /* Cada foto aparece recién cuando terminó de bajar, en vez de pintarse
     a pedazos. */
  const [cargada, setCargada] = useState(false);
  return (
    <li>
      <img
        src={`/${foto.src}`}
        alt={foto.alt}
        loading="lazy"
        decoding="async"
        className={cargada ? "esta-cargada" : ""}
        onLoad={() => setCargada(true)}
      />
    </li>
  );
}

/* Las fotos entran fila por fila a medida que se baja, no todas juntas al
   asomar la galería: es larga, y para cuando se llegara al final ya habrían
   terminado de entrar hace rato.

   Un observador por foto, y las que avisan en la misma tanda —las de una
   misma fila, o todas las de arriba si se entró directo a un ancla— entran
   escalonadas entre ellas. Como en useEntradaEscalonada, se esconden desde
   el JS, así que sin JS la galería se ve igual. */
function useEntradaPorFilas() {
  const ref = useRef(null);

  useEffect(() => {
    const lista = ref.current;
    if (!lista || pideQuietud() || !("IntersectionObserver" in window)) return;

    const fotos = [...lista.children];
    const ctx = gsap.context(() => {
      gsap.set(fotos, { autoAlpha: 0, y: 40, scale: 0.97 });
    }, lista);

    const obs = new IntersectionObserver(
      (entradas) => {
        const llegan = entradas.filter((e) => e.isIntersecting).map((e) => e.target);
        if (!llegan.length) return;
        llegan.forEach((f) => obs.unobserve(f));
        ctx.add(() => {
          gsap.to(llegan, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.07,
            clearProps: "opacity,visibility,transform",
          });
        });
      },
      /* El mismo margen de arriba que en useEntradaEscalonada: lo que ya
         quedó atrás cuenta como visto, para que un salto del menú no deje
         huecos en blanco. */
      { rootMargin: "99999px 0px -10% 0px" }
    );

    fotos.forEach((f) => obs.observe(f));
    return () => {
      obs.disconnect();
      ctx.revert();
    };
  }, []);

  return ref;
}

export default function Galeria() {
  const mosaicoRef = useEntradaPorFilas();

  return (
    <section className="galeria" id="galeria" aria-label="Galería de piezas impresas">
      <ul className="galeria__mosaico" ref={mosaicoRef}>
        {GALERIA.map((foto) => (
          <Foto key={foto.src} foto={foto} />
        ))}
      </ul>
    </section>
  );
}
