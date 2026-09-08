import { useState } from "react";
import { Boxes } from "lucide-react";

import "./Marca.css";

/* El logotipo de la marca.

   Si el archivo faltara, o el navegador no entendiera WebP, se dibuja el
   lockup de texto en su lugar: la página nunca muestra una imagen rota.

   `sobreOscuro` es para el pie: el logo viene con fondo blanco, y el truco de
   multiplicar que lo disuelve sobre el papel no sirve contra la tinta. Ahí se
   apoya sobre una etiqueta clara, como una calcomanía pegada. */
export default function Marca({ sobreOscuro = false, alto = "2.4rem" }) {
  const [falta, setFalta] = useState(false);

  if (falta) {
    return (
      <span className={`marca marca--texto ${sobreOscuro ? "es-oscuro" : ""}`}>
        <span className="marca__cubo" aria-hidden="true">
          <Boxes size={19} strokeWidth={2.4} />
        </span>
        <span className="marca__nombre">
          Aronys<span className="marca__nombre-acento">Tech</span>
        </span>
      </span>
    );
  }

  return (
    <span className={`marca ${sobreOscuro ? "marca--etiqueta" : "marca--suelto"}`}>
      <img
        src="/img/logo-aronystech.webp"
        alt="AronysTech"
        style={{ height: alto }}
        onError={() => setFalta(true)}
      />
    </span>
  );
}
