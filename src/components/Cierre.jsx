import { TEL_BONITO } from "../data/sitio";
import { linkWhatsApp } from "../lib/whatsapp";

export default function Cierre() {
  return (
    <section className="cierre capas">
      <div className="wrap">
        <h2>Contanos qué tenés en mente</h2>
        <p>
          Respondemos por WhatsApp el mismo día. Si tenés una foto o una idea a medio
          armar, con eso arrancamos.
        </p>
        <a
          className="btn btn-main"
          href={linkWhatsApp("Hola AronysTech, tengo una idea y quiero cotizarla.")}
          target="_blank"
          rel="noopener"
        >
          <i className="ph-bold ph-whatsapp-logo"></i>Pedir por WhatsApp
        </a>
        <a className="cierre-tel" href={linkWhatsApp()} target="_blank" rel="noopener">
          {TEL_BONITO}
        </a>
      </div>
    </section>
  );
}
