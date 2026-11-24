import { useCallback, useEffect, useState } from "react";

import PedidoPersonalizado from "./components/PedidoPersonalizado.jsx";
import Catalogo from "./components/Catalogo.jsx";
import DetalleProducto from "./components/DetalleProducto.jsx";
import { PRODUCTOS } from "./data/sitio.js";

import FondoCuadricula from "./components/FondoCuadricula.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import Lateral from "./components/Lateral.jsx";
import ModalPedido from "./components/ModalPedido.jsx";
import Nosotros from "./components/Nosotros.jsx";
import Proceso from "./components/Proceso.jsx";
import Galeria from "./components/Galeria.jsx";
import Preguntas from "./components/Preguntas.jsx";
import Asistente from "./components/Asistente.jsx";
import { useAnclaInicial } from "./hooks/useAnclaInicial.js";

export default function App() {
  /* No hay router instalado: la ficha de producto se mira desde el hash
     (#producto/<id>), y el pedido personalizado escucha el suyo por su
     cuenta (#personalizado). */
  const [ruta, setRuta] = useState(() => window.location.hash);
  useEffect(() => {
    const actualizar = () => setRuta(window.location.hash);
    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener("hashchange", actualizar);
  }, []);
  const esDetalle = ruta.startsWith("#producto/");
  const producto = PRODUCTOS.find((p) => ruta === `#producto/${p.id}`);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (esDetalle) {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.getElementById("detalle-titulo")?.focus({ preventScroll: true });
      } else if (ruta) {
        document.getElementById(ruta.slice(1))?.scrollIntoView({ behavior: "instant" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [ruta, esDetalle]);

  useAnclaInicial();

  /* Qué producto está abierto en el modal de pedido. null = cerrado. */
  const [pedido, setPedido] = useState(null);
  const cerrar = useCallback(() => setPedido(null), []);

  return (
    <>
      <FondoCuadricula />

      {/* Todo lo demás se apoya encima de la cuadrícula. */}
      <div className="contenido">
        <Lateral />

        <main hidden={esDetalle}>
          <Hero />
          <Galeria />
          <Catalogo />
          <Proceso />
          <Nosotros />
          <Preguntas />
        </main>

        {/* La key la monta de nuevo al pasar de una ficha a otra desde "Otras
            piezas", así la entrada se repite con la pieza nueva. */}
        {esDetalle && <DetalleProducto key={ruta} producto={producto} alPedir={setPedido} />}
        <Footer />
      </div>

      <ModalPedido producto={pedido} alCerrar={cerrar} />
      <PedidoPersonalizado />
      <Asistente />
    </>
  );
}
