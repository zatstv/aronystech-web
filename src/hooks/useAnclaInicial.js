import { useEffect } from "react";

/* Al entrar directo a una dirección con ancla (por ejemplo /#catalogo), el
   navegador busca la sección antes de que React haya dibujado nada y no
   encuentra a dónde saltar. Acá se repite el salto ya con la página armada.

   El salto espera a que terminen de cargar las imágenes: hasta entonces las
   fotos de arriba todavía no ocupan su alto real y la sección se corre. */
export function useAnclaInicial() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // "instant" a propósito: el CSS pone scroll-behavior:smooth y, mientras dura
    // ese desplazamiento, los bloques que aparecen al hacer scroll cambian la
    // altura de la página y el destino se corre.
    const saltar = () =>
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" });

    if (document.readyState === "complete") {
      saltar();
      return;
    }
    window.addEventListener("load", saltar);
    return () => window.removeEventListener("load", saltar);
  }, []);
}
