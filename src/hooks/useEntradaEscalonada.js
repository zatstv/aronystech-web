import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Hace entrar los hijos de un contenedor de a uno, escalonados, cuando la
   sección llega a la pantalla.

   Esto es lo único que GSAP aporta que el .reveal de siempre no hacía: aquel
   funde el bloque entero de una vez, y para una grilla de tarjetas el
   escalonado se nota. Para todo lo demás sigue estando useReveal, que pesa
   cero y ya funciona.

   Va con gsap.from() a propósito, no con una clase que arranque en opacity 0:
   así el estado normal del CSS es "visible". Si el JS no llega a correr, o
   falla, o es un buscador leyendo la página, el contenido está ahí igual. Al
   revés —invisible por CSS y visible por JS— un error deja la sección en
   blanco para siempre.

   Devuelve la ref que hay que colgar del contenedor. */
export function useEntradaEscalonada({ selector = ":scope > *", y = 24 } = {}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      /* matchMedia de GSAP en vez de leer la preferencia a mano: si alguien
         la cambia con la página abierta, revierte solo lo que había animado. */
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const hijos = ref.current?.querySelectorAll(selector);
        if (!hijos?.length) return;

        gsap.from(hijos, {
          opacity: 0,
          y,
          duration: 0.5,
          /* Más de ~8 y los últimos llegan tarde: se siente lento, no prolijo. */
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            /* Atado al contenedor, no a la página: así ScrollTrigger no
               revisa todo el documento en cada scroll. */
            trigger: ref.current,
            start: "top 85%",
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return ref;
}
