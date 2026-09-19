import { ArrowLeft, ArrowRight, Package } from "lucide-react";
import { PALETA } from "../data/sitio.js";
import "./DetalleProducto.css";

export default function DetalleProducto({ producto, alPedir }) {
  if (!producto) return <main className="detalle contenedor"><a href="#galeria">Volver a la galería</a><h1 id="detalle-titulo" tabIndex={-1}>No encontramos esta pieza</h1></main>;
  const colores = PALETA.filter((c) => producto.colores.includes(c.hex));
  return <main className="detalle contenedor">
    <a className="detalle__volver" href="#galeria"><ArrowLeft size={18} /> Volver a la galería</a>
    <div className="detalle__grilla">
      <div className="detalle__imagen"><img src={`/${producto.foto.src}`} alt={producto.foto.alt} width={producto.foto.ancho} height={producto.foto.alto} /></div>
      <div className="detalle__info">
        <p className="rotulo">{producto.categoria} · Por encargo</p>
        <h1 id="detalle-titulo" tabIndex={-1}>{producto.nombre}</h1>
        <div className="detalle__precio">{producto.precio}<span>{producto.unidad}</span></div>
        <p className="detalle__descripcion">{producto.texto}</p>
        {colores.length > 0 && <div className="detalle__colores"><h2>Colores de esta pieza</h2><ul>{colores.map((c) => <li key={c.hex}><span style={{background:c.hex}} />{c.nombre}</li>)}</ul></div>}
        <div className="detalle__nota"><Package size={22} /><p>Hecho por encargo. Personalizá tu pedido y consultá el precio final y la fecha de entrega.</p></div>
        <button className="boton detalle__boton" onClick={() => alPedir(producto)}>Personalizar mi pedido <ArrowRight size={18} /></button>
        <p className="detalle__ayuda">Elegí las opciones antes de continuar a WhatsApp.</p>
      </div>
    </div>
  </main>;
}
