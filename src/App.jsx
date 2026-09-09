import { useCallback, useState } from "react";

import Catalogo from "./components/Catalogo.jsx";
import FondoCuadricula from "./components/FondoCuadricula.jsx";
import Footer from "./components/Footer.jsx";
import Galeria from "./components/Galeria.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ModalPedido from "./components/ModalPedido.jsx";
import Nosotros from "./components/Nosotros.jsx";
import { useAnclaInicial } from "./hooks/useAnclaInicial.js";
import { useReveal } from "./hooks/useReveal.js";

export default function App() {
  useAnclaInicial();
  useReveal();

  /* Qué producto está abierto en el modal de pedido. null = cerrado. */
  const [pedido, setPedido] = useState(null);
  const cerrar = useCallback(() => setPedido(null), []);

  return (
    <>
      <FondoCuadricula />

      {/* Todo lo demás se apoya encima de la cuadrícula. */}
      <div className="contenido">
        <Header />

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
