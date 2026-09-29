import { gsap } from "gsap";

/* Todo el movimiento de la página pasa por acá.

   Solo el núcleo de GSAP, sin ScrollTrigger: cuándo arranca cada cosa lo
   decide IntersectionObserver, que el navegador ya trae. Así el costo queda
   en ~28 kB comprimidos y no en ~46. */

/* Quien pidió menos movimiento no ve ninguno: ni entradas ni parallax. Se
   lee en cada llamada y no una vez al cargar, por si la cambia con la
   página abierta. */
export function pideQuietud() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap };
