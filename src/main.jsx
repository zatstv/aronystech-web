import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/* La base va primero: los componentes se importan dentro de App y su CSS
   tiene que poder pisar al de global.css, no al revés. */
import "./styles/global.css";
import App from "./App.jsx";
import { aplicarTemaGuardado } from "./lib/tema.js";

/* Antes de dibujar: si se aplicara dentro de un efecto, quien eligió oscuro
   vería un destello claro en cada carga. */
aplicarTemaGuardado();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
