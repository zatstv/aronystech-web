import { PRODUCTOS } from "../data/sitio";
import { linkWhatsApp } from "../lib/whatsapp";

export default function Catalogo() {
  return (
    <section id="catalogo">
      <div className="wrap">
        <div className="s-cabeza reveal">
          <span className="rotulo">El catálogo</span>
          <h2>Lo que imprimimos</h2>
          <p>
            Todo se hace por encargo, en el color que elijás. Los precios son por unidad y
            bajan cuando el pedido es grande.
          </p>
        </div>

        <nav className="indice reveal" aria-label="Índice del catálogo">
          <h3>En este catálogo</h3>
          <ol>
            {PRODUCTOS.map((p, i) => (
              <li key={p.id}>
                <a href={`#${p.id}`}>
                  <span className="n">{i + 1}</span>
                  {p.nombre}
                  <span className="precio-mini">{p.precio}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {PRODUCTOS.map((p, i) => (
          <article className="item reveal" id={p.id} key={p.id}>
            <div className="item-cabeza">
              <span className="n n-grande">{i + 1}</span>
              <h3>{p.nombre}</h3>
            </div>
            <p className="item-texto">{p.texto}</p>
            <div className="item-datos">
              <span className="precio-bloque">
                <span className="precio">{p.precio}</span>
                <small>{p.unidad}</small>
              </span>
              {p.colores.length > 0 && (
                <span className="colores">
                  {p.colores.map((hex) => (
                    <span className="color-punto" key={hex} style={{ background: hex }} />
                  ))}
                </span>
              )}
              <a
                className="btn btn-main btn-sm"
                href={linkWhatsApp(`Hola AronysTech, quiero ${p.pedido}.`)}
                target="_blank"
                rel="noopener"
              >
                <i className="ph-bold ph-whatsapp-logo"></i>Pedir por WhatsApp
              </a>
            </div>
            <div className={`item-foto ${p.foto.forma}`}>
              <img
                src={p.foto.src}
                width={p.foto.ancho}
                height={p.foto.alto}
                loading="lazy"
                alt={p.foto.alt}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
