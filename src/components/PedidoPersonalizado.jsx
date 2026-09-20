import { useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./PedidoPersonalizado.css";

const INICIAL = { pieza: "", uso: "", medidas: "", cantidad: "1", colores: "", fecha: "", referencia: "", entrega: "", notas: "" };
export default function PedidoPersonalizado({ dialogoRef }) {
  const [datos, setDatos] = useState(INICIAL);
  const [resumen, setResumen] = useState(false);
  const tituloRef = useRef(null);
  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));
  const mensaje = ["Hola, quisiera cotizar un pedido personalizado:", `• Pieza o idea: ${datos.pieza.trim()}`, `• Uso: ${datos.uso.trim()}`, `• Medidas aproximadas: ${datos.medidas.trim() || "Necesito asesoría"}`, `• Cantidad: ${datos.cantidad}`, `• Colores: ${datos.colores.trim() || "Por definir"}`, `• Fecha deseada: ${datos.fecha || "Flexible"}`, `• Referencia: ${datos.referencia.trim() || "No tengo; necesito ayuda con el diseño"}`, `• Entrega / zona: ${datos.entrega.trim() || "Por coordinar"}`, ...(datos.notas.trim() ? [`• Otros detalles: ${datos.notas.trim()}`] : []), "", "¿Me confirman si se puede realizar, el precio y el plazo?"].join("\n");
  const cerrar = () => dialogoRef.current.close();
  return <dialog ref={dialogoRef} className="personalizado" aria-labelledby="personalizado-titulo" onClose={() => setResumen(false)} onClick={(e) => { if(e.target === e.currentTarget) cerrar(); }}>
    <div className="personalizado__cabecera"><div><p className="rotulo">Tu idea, por encargo</p><h2 id="personalizado-titulo" ref={tituloRef} tabIndex={-1}>{resumen ? "Revisa tu consulta" : "Cuéntanos qué imaginas"}</h2></div><button type="button" className="personalizado__cerrar" aria-label="Cerrar pedido personalizado" onClick={cerrar}><X /></button></div>
    <form className="personalizado__formulario" hidden={resumen} onSubmit={(e) => {e.preventDefault(); if(!datos.pieza.trim() || !datos.uso.trim()) return; setResumen(true); requestAnimationFrame(() => tituloRef.current?.focus());}}>
      <p>Estas preguntas nos ayudan a cotizar con menos vueltas. Los campos con * son obligatorios; lo demás puede quedar por definir.</p>
      <label>¿Qué quieres hacer? *<textarea name="pieza" required maxLength={600} rows={3} placeholder="Por ejemplo: 20 llaveros con el logo de mi negocio" value={datos.pieza} onChange={cambiar} onBlur={(e) => e.target.setCustomValidity(e.target.value.trim() ? "" : "Cuéntanos qué pieza quieres hacer.")} onInput={(e) => e.target.setCustomValidity("")} /></label>
      <label>¿Para qué lo vas a usar? *<input name="uso" required maxLength={250} placeholder="Regalo, uso diario, una pieza de repuesto…" value={datos.uso} onChange={cambiar} pattern={".*\\S.*"} /></label>
      <div className="personalizado__fila"><label>Medidas aproximadas<input name="medidas" maxLength={120} placeholder="Ancho × alto × fondo, en cm" value={datos.medidas} onChange={cambiar} /><small>Si no sabes, te ayudamos a definirlas.</small></label><label>Cantidad *<input name="cantidad" type="number" min="1" max="10000" step="1" required value={datos.cantidad} onChange={cambiar} /></label></div>
      <div className="personalizado__fila"><label>Colores<input name="colores" maxLength={120} placeholder="Rojo y blanco, por ejemplo" value={datos.colores} onChange={cambiar} /></label><label>¿Para cuándo lo necesitas?<input name="fecha" type="date" value={datos.fecha} onChange={cambiar} /><small>La fecha se confirma al cotizar.</small></label></div>
      <label>¿Tienes un diseño o una referencia?<textarea name="referencia" rows={2} maxLength={400} placeholder="Tengo una foto, un logo, un archivo STL… o pega un enlace" value={datos.referencia} onChange={cambiar} /><small>Las fotos y archivos los puedes adjuntar después en WhatsApp.</small></label>
      <label>Zona y forma de entrega<input name="entrega" maxLength={160} placeholder="Ciudad o zona; envío o retiro por coordinar" value={datos.entrega} onChange={cambiar} /></label>
      <label>¿Algo más que debamos saber?<textarea name="notas" maxLength={500} rows={2} placeholder="Presupuesto orientativo, acabado o detalles importantes" value={datos.notas} onChange={cambiar} /></label>
      <button type="submit" className="boton">Revisar consulta</button>
    </form>
    {resumen && <div className="personalizado__resumen"><p>No se realiza ningún pago. Primero revisamos tu idea y preparamos la cotización.</p><pre>{mensaje}</pre><div className="personalizado__acciones"><button type="button" className="boton boton--hueco" onClick={() => setResumen(false)}>Editar respuestas</button><a className="boton" href={linkWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Continuar a WhatsApp</a></div><small>WhatsApp abrirá el mensaje preparado. Tú decides cuándo enviarlo.</small></div>}
  </dialog>;
}
