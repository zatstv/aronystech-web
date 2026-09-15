import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { GALERIA } from "../data/sitio.js";
import "./Galeria.css";

export default function Galeria() {
  const [indice, setIndice] = useState(0);
  const dialogo = useRef(null);
  const abrir = (i) => { setIndice(i); dialogo.current.showModal(); };
  const avanzar = (paso) => setIndice((i) => (i + paso + GALERIA.length) % GALERIA.length);
  return <section className="galeria" id="galeria">
    <div className="contenedor">
      <div className="galeria__cabecera"><div><p className="rotulo">Galería</p><h2 className="titulo-seccion galeria__titulo">De la idea a tus manos.</h2></div><p className="galeria__intro">Texturas, colores y detalles de nuestras piezas. Tocá una foto para verla de cerca.</p></div>
      <div className="galeria__mosaico">{GALERIA.map((foto, i) => <button className="galeria__pieza" key={foto.src} onClick={() => abrir(i)} aria-label={`Ampliar foto: ${foto.alt}`}>
        <img src={`/${foto.src}`} alt={foto.alt} loading="lazy" />
        <span className="galeria__ampliar" aria-hidden="true"><span>{String(i + 1).padStart(2, "0")}</span><ArrowUpRight size={20} /></span>
      </button>)}</div>
    </div>
    <dialog className="galeria__visor" ref={dialogo} aria-label="Foto ampliada" onClick={(e) => { if(e.target === e.currentTarget) dialogo.current.close(); }} onKeyDown={(e) => {if(e.key === "ArrowRight") {e.preventDefault(); avanzar(1);} if(e.key === "ArrowLeft") {e.preventDefault(); avanzar(-1);} }}>
      <div className="galeria__visor-interior">
        <div className="galeria__barra"><span aria-live="polite">{indice + 1} / {GALERIA.length}</span><button onClick={() => dialogo.current.close()} aria-label="Cerrar foto"><X /></button></div>
        <img src={`/${GALERIA[indice].src}`} alt={GALERIA[indice].alt} />
        <div className="galeria__controles"><button onClick={() => avanzar(-1)} aria-label="Foto anterior"><ChevronLeft /></button><p>{GALERIA[indice].alt}</p><button onClick={() => avanzar(1)} aria-label="Foto siguiente"><ChevronRight /></button></div>
      </div>
    </dialog>
  </section>;
}
