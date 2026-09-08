import { useCallback, useState } from "react";

import Catalogo from "./components/Catalogo.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ModalPedido from "./components/ModalPedido.jsx";
import Nosotros from "./components/Nosotros.jsx";
import Personalizados from "./components/Personalizados.jsx";
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
      <Header />

      <main>
        <Hero />
        <Catalogo alPedir={setPedido} />
        <Personalizados />
        <Nosotros />
      </main>

      <Footer />
      <ModalPedido producto={pedido} alCerrar={cerrar} />
    </>
  );
}
