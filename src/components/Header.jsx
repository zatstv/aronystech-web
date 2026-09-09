import { useCallback, useRef, useState } from "react";
import { LogIn, MessageCircle, Menu, X } from "lucide-react";

import Login from "./Login.jsx";
import Marca from "./Marca.jsx";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./Header.css";

const ENLACES = [
  { href: "#catalogo", texto: "Catálogo" },
  { href: "#galeria", texto: "Galería" },
  { href: "#nosotros", texto: "Nosotros" },
];

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const [acceso, setAcceso] = useState(false);
  const cerrarAcceso = useCallback(() => setAcceso(false), []);
  const anclaAcceso = useRef(null);

  return (
    <header className="cabecera">
      <div className="contenedor cabecera__barra">
        <a className="cabecera__marca" href="#inicio" aria-label="AronysTech, ir al inicio">
          <Marca alto="2.9rem" />
        </a>

        {/* En celular los enlaces no desaparecen: bajan a una segunda fila.
            Antes, en teléfono no había forma de saltar a una sección. */}
        <nav className={`cabecera__nav ${abierto ? "esta-abierto" : ""}`}>
          {ENLACES.map((e) => (
            <a key={e.href} href={e.href} onClick={() => setAbierto(false)}>
              {e.texto}
            </a>
          ))}
        </nav>

        <div className="cabecera__acciones">
          {/* Iniciar sesión era un enlace a #login, que no existía en ninguna
              parte: no llevaba a nada. Ahora abre el panel acá mismo. */}
          <div className="login__ancla" ref={anclaAcceso}>
            <button
              type="button"
              className="cabecera__acceso"
              aria-expanded={acceso}
              onClick={() => setAcceso((v) => !v)}
            >
              <LogIn size={16} strokeWidth={2.4} />
              <span className="cabecera__acceso-texto">Iniciar sesión</span>
            </button>

            <Login abierto={acceso} alCerrar={cerrarAcceso} anclaRef={anclaAcceso} />
          </div>

          <a
            className="boton boton--chico"
            href={linkWhatsApp("Hola, quisiera información sobre sus impresiones 3D.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} strokeWidth={2.4} />
            WhatsApp
          </a>
          <button
            type="button"
            className="cabecera__menu"
            aria-expanded={abierto}
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
