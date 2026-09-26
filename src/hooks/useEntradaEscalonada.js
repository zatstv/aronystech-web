import { useEffect, useRef } from "react";

/* Hace entrar los hijos de un contenedor de a uno, escalonados, cuando la
   sección llega a la pantalla.

   Antes lo hacía GSAP, que sumaba 47 kB comprimidos solo para esto. El
   navegador ya trae las dos piezas: IntersectionObserver avisa cuándo
   aparece el contenedor, y element.animate() hace la animación con su
   retraso para cada hijo.

   El estado normal del CSS sigue siendo "visible". Los hijos se esconden
   desde acá, con JS, y recién cuando se sabe que el JS va a poder volver a
   mostrarlos. Si el JS no llega a correr, o falla, o es un buscador leyendo
   la página, el contenido está ahí igual. Al revés —invisible por CSS y
   visible por JS— un error deja la sección en blanco para siempre.

   Devuelve la ref que hay que colgar del contenedor. */
export function useEntradaEscalonada({ selector = ":scope > *", y = 24 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const caja = ref.current;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!caja || quieto || !("IntersectionObserver" in window) || !caja.animate) return;

    const hijos = [...caja.querySelectorAll(selector)];
    const esconder = (h) => {
      h.style.opacity = "0";
      h.style.transform = `translateY(${y}px)`;
    };
    const soltar = (h) => {
      h.style.opacity = "";
      h.style.transform = "";
    };
    hijos.forEach(esconder);

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        obs.disconnect();
        hijos.forEach((h, i) => {
          soltar(h);
          /* fill: "backwards" mantiene al hijo en el primer cuadro mientras
             espera su turno; si no, se vería entero y después desaparecería. */
          h.animate(
            [
              { opacity: 0, transform: `translateY(${y}px)` },
              { opacity: 1, transform: "none" },
            ],
            {
              duration: 500,
              /* Más de ~8 y los últimos llegan tarde: se siente lento, no prolijo. */
              delay: i * 80,
              easing: "cubic-bezier(.25, .46, .45, .94)",
              fill: "backwards",
            }
          );
        });
      },
      /* Arranca cuando el borde de arriba pasa el 85% de la pantalla.

         El margen de arriba, enorme, estira la zona observada hacia todo lo
         que ya quedó atrás. Sin él, quien salta por el menú de una sección a
         otra pasa por encima del contenedor sin que llegue a cruzar la
         pantalla, el observador no avisa nunca y los hijos quedan
         invisibles. Así, todo lo que está por encima cuenta como ya visto. */
      { rootMargin: "99999px 0px -15% 0px" }
    );

    obs.observe(caja);
    return () => {
      obs.disconnect();
      hijos.forEach(soltar);
    };
  }, [selector, y]);

  return ref;
}
