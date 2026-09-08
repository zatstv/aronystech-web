import { linkWhatsApp } from "../lib/whatsapp";

export default function Header() {
  return (
    <header>
      <div className="wrap nav">
        <a className="marca" href="#inicio">
          <span className="marca-cubo">A</span>AronysTech
        </a>
        <nav className="nav-links">
          <a href="#archivo">Cómo funciona</a>
          <a href="#preguntas">Preguntas</a>
          <a href="#catalogo">Catálogo</a>
        </nav>
        <a
          className="btn btn-main btn-sm"
          href={linkWhatsApp("Hola AronysTech, quiero hacer un pedido.")}
          target="_blank"
          rel="noopener"
        >
          <i className="ph-bold ph-whatsapp-logo"></i>
          <span>Pedir por WhatsApp</span>
        </a>
      </div>
    </header>
  );
}
