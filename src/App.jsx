import { useCallback, useEffect, useState } from "react";

import Acceso from "./components/Acceso.jsx";
import Catalogo from "./components/Catalogo.jsx";
import FondoCuadricula from "./components/FondoCuadricula.jsx";
import Footer from "./components/Footer.jsx";
import Galeria from "./components/Galeria.jsx";
import Hero from "./components/Hero.jsx";
import Lateral from "./components/Lateral.jsx";
import ModalPedido from "./components/ModalPedido.jsx";
import Nosotros from "./components/Nosotros.jsx";
import { useAnclaInicial } from "./hooks/useAnclaInicial.js";
import { useReveal } from "./hooks/useReveal.js";

export default function App() {
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

        <main>
          <Hero />
          <Catalogo alPedir={setPedido} />
          <Galeria />
          <Nosotros />
        </main>

        <Footer />
      </div>

      <ModalPedido producto={pedido} alCerrar={cerrar} />
    </>
  );
}
