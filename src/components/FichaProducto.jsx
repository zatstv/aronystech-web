import { ArrowUpRight } from "lucide-react";

import "./FichaProducto.css";

export default function FichaProducto({ producto }) {
  const { nombre, precio, unidad, texto, colores, categoria, foto } = producto;

  return (
    <article className="ficha">
      <a className="ficha__foto" href={`#producto/${producto.id}`} aria-label={`Ver detalles de ${nombre}`}>
        <img
          src={`/${foto.src}`}
          width={foto.ancho}
          height={foto.alto}
          alt={foto.alt}
          loading="lazy"
        />
        <span className="ficha__sello">Por encargo</span><span className="ficha__explorar"><ArrowUpRight size={22} /></span>
      </a>

      <div className="ficha__cuerpo">
        <div className="ficha__encabezado">
          <h3>{nombre}</h3>
          {/* Etiqueta girada, como una pegada a mano sobre la pieza. */}
          <span className="ficha__precio">{precio}</span>
        </div>

        <p className="ficha__texto">{texto}</p>

        <div className="ficha__pie">
          <div className="ficha__colores">
            {colores.slice(0, 5).map((c) => (
              <span key={c} style={{ background: c }} />
            ))}
          </div>
          <span className="ficha__categoria">{categoria}</span>
        </div>

        <p className="ficha__unidad">{unidad}</p>

        <a className="ficha__detalle" href={`#producto/${producto.id}`}>
          <ArrowUpRight size={17} strokeWidth={2.4} />
          Conocer la pieza
        </a>
      </div>
    </article>
  );
}
