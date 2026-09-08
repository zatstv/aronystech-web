import { linkWhatsApp } from "../lib/whatsapp";

export default function BotonFlotante() {
  return (
    <a
      className="flotante"
      href={linkWhatsApp("Hola AronysTech, quiero hacer un pedido.")}
      target="_blank"
      rel="noopener"
      aria-label="Pedir por WhatsApp"
    >
      <i className="ph-bold ph-whatsapp-logo"></i>
    </a>
  );
}
