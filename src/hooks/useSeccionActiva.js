import { useEffect, useState } from "react";

/* Cuál de las secciones está a la vista, para marcarla en la barra lateral.

   Se queda con la que cruza la franja de arriba de la pantalla: con
   rootMargin recortando el 60% de abajo, la sección activa es la que ocupa el
   primer tramo visible y no la que asoma por el borde inferior. */
export function useSeccionActiva(ids) {
  const [activa, setActiva] = useState(ids[0]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const secciones = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!secciones.length) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        const visibles = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibles.length) setActiva(visibles[0].target.id);
      },
      { rootMargin: "-72px 0px -60% 0px" }
    );

    secciones.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [ids]);

  return activa;
}
