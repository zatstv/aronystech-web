import { useEffect, useRef } from "react";

import { gsap, pideQuietud } from "../lib/movimiento.js";

/* Para los encabezados de sección: el rótulo, el título y la bajada, sin
   tocar la lista que va debajo, que tiene su propia entrada. */
export const ENCABEZADO = ":scope > .rotulo, :scope > h2, :scope > .catalogo__intro";

/* Hace entrar los hijos de un contenedor de a uno, escalonados, cuando la
   sección llega a la pantalla.

   Cada hijo cae un poco, pasa de largo y se asienta, como una pieza que se
   apoya en la mesa (docs/PROYECTO.md §6: "los cubos caen y se apilan"). Ese
   rebote es lo que pone GSAP; cuándo arrancar lo sigue decidiendo el
   IntersectionObserver del navegador, que ya resolvía bien los saltos del
   menú (ver el rootMargin de abajo).

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
    if (!caja || pideQuietud() || !("IntersectionObserver" in window)) return;

    const hijos = [...caja.querySelectorAll(selector)];
    if (!hijos.length) return;

    const ctx = gsap.context(() => {
      gsap.set(hijos, { autoAlpha: 0, y, rotation: -1.2 });
    }, caja);

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        obs.disconnect();
        ctx.add(() => {
          gsap.to(hijos, {
            autoAlpha: 1,
            y: 0,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.5)",
            /* Más de ~8 y los últimos llegan tarde: se siente lento, no prolijo. */
            stagger: 0.08,
            /* Al terminar se borra todo lo que dejó escrito: si quedara un
               transform en línea, le ganaría a los :hover del CSS que
               levantan las tarjetas. */
            clearProps: "opacity,visibility,transform",
          });
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
      /* Deshace el set y cualquier animación a medias: en modo estricto
         React monta dos veces y el segundo montaje tiene que encontrar los
         hijos limpios. */
      ctx.revert();
    };
  }, [selector, y]);

  return ref;
}
