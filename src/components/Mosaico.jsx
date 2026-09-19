import { GALERIA } from "../data/sitio.js";
import "./Mosaico.css";

/* ============================================================
   Mosaico justificado: las fotos se acomodan en filas que llenan el ancho
   completo, y el alto de cada fila lo deciden las fotos que le tocaron.

   No hay que decidir cuántas entran por fila ni recortar nada: cada foto
   pide espacio en proporción a lo ancha que es, y la fila reparte. Una foto
   apaisada se lleva más lugar que una vertical, y todas terminan con el
   mismo alto dentro de su fila.

   El reparto lo hace el CSS con flex; acá solo se le pasa la proporción de
   cada archivo, que viene de GALERIA en data/sitio.js.
   ============================================================ */

export default function Mosaico() {
  return (
    <section className="mosaico" aria-label="Más fotos de piezas">
      <div className="contenedor">
        <div className="mosaico__filas">
          {GALERIA.map((foto) => (
            <figure
              className="mosaico__pieza"
              key={foto.src}
              /* La proporción manda el reparto. Va como variable para que la
                 cuenta viva en el CSS y no repetida en cada regla. */
              style={{ "--proporcion": (foto.ancho / foto.alto).toFixed(4) }}
            >
              <img
                src={`/${foto.src}`}
                alt={foto.alt}
                width={foto.ancho}
                height={foto.alto}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
