import { MessageCircle } from "lucide-react";

import Marca from "./Marca.jsx";
import { TEL_BONITO } from "../data/sitio.js";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="pie">
      <div className="contenedor pie__grilla">
        <div>
          <div className="pie__marca">
            <Marca sobreOscuro alto="2.6rem" />
          </div>
          <p className="pie__texto">
            Impresiones 3D hechas por encargo en Panamá. Todo en PLA, pieza por
            pieza, desde una sola unidad.
          </p>
        </div>

        <div>
          <h3 className="pie__rotulo">Mirá</h3>
          <ul className="pie__enlaces">
            <li><a href="#catalogo">Catálogo</a></li>
            <li><a href="#galeria">Galería</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
          </ul>
        </div>

        <div>
          <h3 className="pie__rotulo">Contacto</h3>
          <a
            className="boton pie__boton"
            href={linkWhatsApp("Hola, quisiera hacer una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={17} strokeWidth={2.4} />
            Escríbenos por WhatsApp
          </a>
          <p className="pie__tel">{TEL_BONITO}</p>
        </div>
      </div>

      <p className="pie__legal">
        © {new Date().getFullYear()} AronysTech — Impreso por encargo
      </p>
    </footer>
  );
}
