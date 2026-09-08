import Hero from "./components/Hero.jsx";
import { useAnclaInicial } from "./hooks/useAnclaInicial.js";
import { useReveal } from "./hooks/useReveal.js";

/* El orden de las secciones está decidido en PROYECTO.md §7:
   las informativas arriba y el catálogo al final, en formato de lista
   con índice, para que el visitante entienda el negocio antes de ver precios.

   A medida que vayan llegando los componentes se importan arriba y se
   descomenta su línea acá abajo. */

export default function App() {
  useAnclaInicial();
  useReveal();

  return (
    <>
      {/* <Header /> */}

      <main>
        <Hero />

        {/* 2. <Minimo />      el pedido mínimo es 1: el diferenciador */}
        {/* 3. <Proceso />     cómo funciona + visor 3D fijo al lado */}
        {/* 4. <Ocasiones />   para qué lo piden */}
        {/* 5. <Entrega />     entrega a todo Panamá y métodos de pago */}
        {/* 6. <Preguntas />   preguntas frecuentes */}
        {/* 7. <Catalogo />    índice de productos y después uno por uno */}
        {/* 8. <Cierre />      contacto */}
      </main>

      {/* <BotonFlotante /> */}
      {/* <Footer /> */}
    </>
  );
}

