import { useEffect } from "react";

/* Hace aparecer los bloques con clase .reveal a medida que entran en pantalla.
   Si el navegador no trae IntersectionObserver, o el visitante pidió menos
   movimiento, se muestran todos de una vez. */
export function useReveal() {
  useEffect(() => {
    const bloques = document.querySelectorAll(".reveal:not(.visible)");
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window) || quieto) {
      bloques.forEach((el) => el.classList.add("visible"));
      return;
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    bloques.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
