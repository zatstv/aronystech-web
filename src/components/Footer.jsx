import { linkWhatsApp } from "../lib/whatsapp";

export default function Footer() {
  return (
    <footer>
      <div className="wrap pie">
        <span className="pie-marca">
          <span className="marca-cubo">A</span>AronysTech
        </span>
        <span className="pie-links">
          <a href={linkWhatsApp()} target="_blank" rel="noopener">
            WhatsApp
          </a>
          <a href="#catalogo">Catálogo</a>
          <a href="#preguntas">Preguntas</a>
        </span>
        <span className="pie-nota">
          Impresión 3D personalizada en Panamá · Todo en PLA, impreso por encargo
        </span>
      </div>
    </footer>
  );
}
