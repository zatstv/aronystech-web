import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import FichaProducto from "./FichaProducto.jsx";
import { CATEGORIAS, PRODUCTOS } from "../data/sitio.js";
import "./Catalogo.css";

/* Se quitó el filtro "listo para entregar / a pedido" que traía la referencia:
   acá todo se imprime desde cero, así que no habría nada en el primer grupo. */

export default function Catalogo({ alPedir }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return PRODUCTOS.filter((p) => {
      if (categoria !== "Todos" && p.categoria !== categoria) return false;
      if (q && !`${p.nombre} ${p.texto} ${p.categoria}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [busqueda, categoria]);

  return (
    <section className="catalogo" id="catalogo">
      <div className="contenedor">
        <div className="catalogo__cabeza">
          <div>
            <p className="rotulo">Catálogo</p>
            <h2 className="titulo-seccion catalogo__titulo">Lo que imprimimos</h2>
            <p className="catalogo__intro">
              Cada pieza se hace por encargo, en los colores que elijas. Los
              precios son por unidad y bajan a partir de 20 iguales.
            </p>
          </div>

          <div className="catalogo__buscador">
            <Search size={17} strokeWidth={2.4} aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar producto"
            />
          </div>
        </div>

        <div className="catalogo__filtros">
          {["Todos", ...CATEGORIAS].map((c) => (
            <button
              key={c}
              type="button"
              className={`catalogo__filtro ${categoria === c ? "esta-activo" : ""}`}
              aria-pressed={categoria === c}
              onClick={() => setCategoria(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {visibles.length === 0 ? (
          <div className="catalogo__vacio">
            <p className="catalogo__vacio-titulo">Sin resultados</p>
            <p>Probá con otra búsqueda o categoría.</p>
          </div>
        ) : (
          <div className="catalogo__grilla">
            {visibles.map((p) => (
              <FichaProducto key={p.id} producto={p} alPedir={alPedir} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
