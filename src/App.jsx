import { useCallback, useEffect, useRef, useState } from "react";

import PedidoPersonalizado from "./components/PedidoPersonalizado.jsx";
import DetalleProducto from "./components/DetalleProducto.jsx";
import { PRODUCTOS } from "./data/sitio.js";

import Acceso from "./components/Acceso.jsx";
import FondoCuadricula from "./components/FondoCuadricula.jsx";
import Footer from "./components/Footer.jsx";
import Galeria from "./components/Galeria.jsx";
import Hero from "./components/Hero.jsx";
import Lateral from "./components/Lateral.jsx";
import ModalPedido from "./components/ModalPedido.jsx";
import Mosaico from "./components/Mosaico.jsx";
import Nosotros from "./components/Nosotros.jsx";
import Proceso from "./components/Proceso.jsx";
import Preguntas from "./components/Preguntas.jsx";
import { useAnclaInicial } from "./hooks/useAnclaInicial.js";
import { useReveal } from "./hooks/useReveal.js";

export default function App() {
  const personalizadoRef = useRef(null);
  /* Vista previa de las pantallas de acceso, en #acceso. No hay router
     instalado y para una pantalla suelta no vale la pena traer uno: alcanza
     con mirar el hash. Cuando el acceso sea de verdad, esto se reemplaza por
     una ruta como corresponde. */
  const [enAcceso, setEnAcceso] = useState(
    () => typeof window !== "undefined" && window.location.hash === "#acceso"
  );

  useEffect(() => {
    const mirar = () => setEnAcceso(window.location.hash === "#acceso");
    window.addEventListener("hashchange", mirar);
    return () => window.removeEventListener("hashchange", mirar);
  }, []);

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
  useReveal();

  /* Qué producto está abierto en el modal de pedido. null = cerrado. */
  const [pedido, setPedido] = useState(null);
  const cerrar = useCallback(() => setPedido(null), []);

  if (enAcceso) return <Acceso />;

  return (
    <>
      <FondoCuadricula />

      {/* Todo lo demás se apoya encima de la cuadrícula. */}
      <div className="contenido">
        <Lateral />

        <main hidden={esDetalle}>
          <Hero alPersonalizar={() => personalizadoRef.current.showModal()} />
          <Galeria />
          <Mosaico />
          <Proceso />
          <Nosotros />
          <Preguntas />
        </main>

        {esDetalle && <DetalleProducto producto={producto} alPedir={setPedido} />}
        <Footer />
      </div>

      <ModalPedido producto={pedido} alCerrar={cerrar} />
      <PedidoPersonalizado dialogoRef={personalizadoRef} />
    </>
  );
}
