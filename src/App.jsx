import Aviso from "./components/Aviso";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Minimo from "./components/Minimo";
import Proceso from "./components/Proceso";
import Entrega from "./components/Entrega";
import Ocasiones from "./components/Ocasiones";
import Preguntas from "./components/Preguntas";
import Catalogo from "./components/Catalogo";
import Cierre from "./components/Cierre";
import Footer from "./components/Footer";
import BotonFlotante from "./components/BotonFlotante";
import { useReveal } from "./hooks/useReveal";
import { useAnclaInicial } from "./hooks/useAnclaInicial";

export default function App() {
  useReveal();
  useAnclaInicial();

  return (
    <>
      <Aviso />
      <Header />
      <main id="inicio">
        <Hero />
        <Minimo />
        <Proceso />
        <Entrega />
        <Ocasiones />
        <Preguntas />
        <Catalogo />
        <Cierre />
      </main>
      <Footer />
      <BotonFlotante />
    </>
  );
}
