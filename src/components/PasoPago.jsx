import { useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./PasoPago.css";

const METODOS = [
  { nombre: "Tarjeta", detalle: "Pago en línea · vista previa" },
  { nombre: "Transferencia bancaria", detalle: "Datos bancarios y comprobante · vista previa" },
  { nombre: "PayPal", detalle: "Pago en línea · vista previa" },
  { nombre: "Efectivo", detalle: "Coordinamos el pago por WhatsApp" },
  { nombre: "Yappy", detalle: "Coordinamos el pago por WhatsApp" },
];

export default function PasoPago({ mensaje, producto, cantidad, alVolver }) {
  const [metodo, setMetodo] = useState("Tarjeta");
  const [revisado, setRevisado] = useState(false);
  const directo = metodo === "Efectivo" || metodo === "Yappy";
  const estado = directo ? "Por coordinar" : "Pendiente de verificación. Vista previa: no se realizó ningún cobro.";
  const enlace = linkWhatsApp(`${mensaje}\n\nMétodo de pago: ${metodo}\nEstado del pago: ${estado}`);
  return <div className="pago">
    <button type="button" className="pago__volver" onClick={alVolver}><ArrowLeft size={16} /> Editar pedido</button>
    <p className="rotulo">Paso 2 de 2</p>
    <h3>¿Cómo preferís pagar?</h3>
    <p className="pago__intro">{producto.nombre} · {cantidad} {cantidad === 1 ? "unidad" : "unidades"}</p>
    <p className="pago__aviso">Vista previa. Todavía no se procesan pagos. El importe final y las medidas deben confirmarse.</p>
    <fieldset className="pago__metodos"><legend className="oculto-visual">Método de pago</legend>{METODOS.map((m) => <label key={m.nombre} className={`pago__metodo ${metodo === m.nombre ? "seleccionado" : ""}`}><input type="radio" name="metodo-pago" value={m.nombre} checked={metodo === m.nombre} onChange={() => {setMetodo(m.nombre); setRevisado(false);}} /><span><strong>{m.nombre}</strong><small>{m.detalle}</small></span></label>)}</fieldset>
    <div className="pago__explicacion" aria-live="polite">
      {directo ? <p>Continuá a WhatsApp con el pedido completo. Allí coordinamos {metodo === "Yappy" ? "los datos para Yappy" : "la entrega y el pago en efectivo"}.</p> : <><h4>{metodo === "Transferencia bancaria" ? "Transferencia y comprobante" : `Pago con ${metodo}`}</h4><p>{metodo === "Transferencia bancaria" ? "Aquí se mostrarán la cuenta, el importe y la referencia para transferir. Todavía no hay datos bancarios configurados." : "Aquí se abrirá el proveedor de pago cuando esté conectado. Esta vista no solicita datos de tarjeta ni realiza cobros."}</p><p>Después de verificar el pago, el pedido continuará a WhatsApp con su referencia para coordinar la entrega.</p></>}
    </div>
    {!directo && !revisado && <button type="button" className="boton pago__continuar" onClick={() => setRevisado(true)}>Ver cierre de ejemplo <ArrowRight size={18} /></button>}
    {(directo || revisado) && <div className="pago__cierre" aria-live="polite">{!directo && <p><strong>Pedido preparado · pago pendiente.</strong><br />Esta demostración no confirma ningún pago.</p>}<a className="boton pago__continuar" href={enlace} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Continuar a WhatsApp</a><p className="pago__intro">Se prepara el mensaje; vos decidís cuándo enviarlo.</p></div>}
    <details className="pago__resumen"><summary>Ver el pedido completo</summary><p>{mensaje}</p></details>
  </div>;
}
