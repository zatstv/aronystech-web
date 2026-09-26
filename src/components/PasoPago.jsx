import { useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { PAGOS } from "../data/sitio.js";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./PasoPago.css";

/* ============================================================
   Último paso del pedido de una pieza del catálogo: cómo prefiere pagar.

   La página no cobra nada. El método elegido viaja en el mensaje de
   WhatsApp, y el pago se hace recién cuando el total está confirmado. Por
   eso los métodos salen de PAGOS, la misma lista que se muestra en
   Preguntas: lo que se ofrece acá es exactamente lo que se acepta.
   ============================================================ */

/* Yappy de entrada: en Panamá es el que más se usa (ver PAGOS). */
const POR_DEFECTO = PAGOS.find((p) => p.icono === "yappy")?.texto ?? PAGOS[0]?.texto;

export default function PasoPago({ mensaje, producto, cantidad, alVolver }) {
  const [metodo, setMetodo] = useState(POR_DEFECTO);
  const enlace = linkWhatsApp(`${mensaje}\n\nQuisiera pagar con: ${metodo}`);

  return (
    <div className="pago">
      <button type="button" className="pago__volver" onClick={alVolver}>
        <ArrowLeft size={16} /> Editar pedido
      </button>

      <p className="rotulo">Paso 2 de 2</p>
      <h3>¿Cómo prefieres pagar?</h3>
      <p className="pago__intro">
        {producto.nombre} · {cantidad} {cantidad === 1 ? "unidad" : "unidades"}
      </p>
      <p className="pago__aviso">
        Todavía no se cobra nada. Primero te confirmamos el total y la fecha por
        WhatsApp; el pago se hace después, con el método que elijas.
      </p>

      <fieldset className="pago__metodos">
        <legend className="oculto-visual">Método de pago</legend>
        {PAGOS.map((m) => (
          <label
            key={m.texto}
            className={`pago__metodo ${metodo === m.texto ? "seleccionado" : ""}`}
          >
            <input
              type="radio"
              name="metodo-pago"
              value={m.texto}
              checked={metodo === m.texto}
              onChange={() => setMetodo(m.texto)}
            />
            <span>
              <strong>{m.texto}</strong>
              <small>{m.detalle}</small>
            </span>
          </label>
        ))}
      </fieldset>

      <a className="boton pago__continuar" href={enlace} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={18} /> Continuar a WhatsApp
      </a>
      <p className="pago__intro">Se prepara el mensaje; tú decides cuándo enviarlo.</p>

      <details className="pago__resumen">
        <summary>Ver el mensaje completo</summary>
        <p>{`${mensaje}\n\nQuisiera pagar con: ${metodo}`}</p>
      </details>
    </div>
  );
}
