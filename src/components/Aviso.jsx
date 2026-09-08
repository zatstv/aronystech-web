import { useState } from "react";

/* Franja de "esto todavía no es real". Cuando el contenido sea definitivo,
   se borra este componente y su línea en App.jsx. */
export default function Aviso() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="aviso">
      <p>
        <b>Versión de prueba.</b> Los precios, tiempos y textos son de ejemplo,
        puestos para poder ver el diseño. Nada de esto es información real todavía.
      </p>
      <button type="button" aria-label="Cerrar aviso" onClick={() => setVisible(false)}>
        ✕
      </button>
    </div>
  );
}
