/* Claro, oscuro o el del sistema.

   Hasta ahora el modo oscuro salía solo de prefers-color-scheme y no se podía
   elegir. La elección se guarda y se aplica como data-tema en <html>; en
   "auto" no se pone el atributo y manda otra vez el sistema.

   aplicarTemaGuardado() se llama en main.jsx antes de dibujar: si esperara al
   primer render, la página aparecería clara un instante y recién ahí se
   pondría oscura. */

const CLAVE = "aronystech:tema";

export const TEMAS = ["claro", "oscuro", "auto"];

export function leerTema() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return TEMAS.includes(guardado) ? guardado : "auto";
  } catch {
    /* Navegación privada o almacenamiento bloqueado: no es motivo para
       romper la página, simplemente no se recuerda. */
    return "auto";
  }
}

export function aplicarTema(tema) {
  const raiz = document.documentElement;
  if (tema === "auto") delete raiz.dataset.tema;
  else raiz.dataset.tema = tema;

  try {
    localStorage.setItem(CLAVE, tema);
  } catch {
    /* Igual que arriba: se aplica igual, solo que no sobrevive a la recarga. */
  }
}

export function aplicarTemaGuardado() {
  const tema = leerTema();
  if (tema !== "auto") document.documentElement.dataset.tema = tema;
  return tema;
}
