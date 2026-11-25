import { useState } from "react";
import { ArrowLeft, Check, CheckCircle2, Copy, Landmark, MessageCircle, Printer, Smartphone } from "lucide-react";

import { CUENTAS_PAGO, MAYOREO, PAGOS } from "../data/sitio.js";
import { dinero, facturaEnTexto, numeroFactura, precioNumero, sePagaEnLinea } from "../lib/factura.js";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./PasoPago.css";

/* ============================================================
   Último paso del pedido de una pieza del catálogo.

   Con Yappy o transferencia (los métodos `enLinea` de PAGOS) el pago va
   primero: la página muestra la cuenta y el total, el cliente pone su nombre
   y el número de comprobante, sale la factura y recién ahí se manda todo por
   WhatsApp. Con los demás métodos, o desde MAYOREO unidades (el precio lo
   cotiza Hugo), sigue como antes: el mensaje va directo a WhatsApp.

   Los métodos salen de PAGOS, la misma lista que se muestra en Preguntas.
   ============================================================ */

/* Los tres momentos del pedido, arriba de cada pantalla del pago. */
const ETAPAS = ["Pedido", "Pago", "Factura"];
function Pasos({ actual }) {
  return (
    <ol className="pasos-pago" aria-label="Avance del pedido">
      {ETAPAS.map((e, i) => (
        <li key={e} className={i < actual ? "hecho" : i === actual ? "actual" : ""} aria-current={i === actual ? "step" : undefined}>
          <span>{i < actual ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : i + 1}</span>
          {e}
        </li>
      ))}
    </ol>
  );
}

/* Un dato de la cuenta con botón para copiarlo, que es lo que el cliente
   va a pegar en Yappy o en la app del banco. */
function DatoCuenta({ nombre, valor }) {
  const [copiado, setCopiado] = useState(false);
  const copiable = valor && nombre !== "A nombre de" && nombre !== "Tipo de cuenta";
  return (
    <div>
      <dt>{nombre}</dt>
      <dd>
        {valor}
        {copiable && (
          <button
            type="button"
            className="pago__copiar"
            aria-label={`Copiar ${nombre}`}
            onClick={() => navigator.clipboard?.writeText(valor.replace(/[-\s]/g, "")).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 1600); })}
          >
            {copiado ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
          </button>
        )}
      </dd>
    </div>
  );
}

const ICONO_METODO = { Yappy: Smartphone, "Transferencia bancaria": Landmark };

/* Yappy de entrada: en Panamá es el que más se usa (ver PAGOS). */
const POR_DEFECTO = PAGOS.find((p) => p.icono === "yappy")?.texto ?? PAGOS[0]?.texto;

export default function PasoPago({ mensaje, producto, cantidad, lineas, alVolver }) {
  const [metodo, setMetodo] = useState(POR_DEFECTO);
  const [etapa, setEtapa] = useState("elegir"); // elegir → pagar → factura
  const [cliente, setCliente] = useState("");
  const [comprobante, setComprobante] = useState("");
  const [error, setError] = useState("");
  const [factura, setFactura] = useState(null);

  const precio = precioNumero(producto);
  const total = precio * cantidad;
  const enLinea = PAGOS.find((m) => m.texto === metodo)?.enLinea && sePagaEnLinea(producto, cantidad);
  const enlace = linkWhatsApp(`${mensaje}\n\nQuisiera pagar con: ${metodo}`);

  const generarFactura = (e) => {
    e.preventDefault();
    if (!cliente.trim() || !comprobante.trim()) {
      setError("Escribe tu nombre y el número de comprobante del pago.");
      return;
    }
    const fecha = new Date();
    setFactura({
      numero: numeroFactura(fecha),
      fecha: fecha.toLocaleDateString("es-PA", { day: "numeric", month: "long", year: "numeric" }),
      cliente: cliente.trim(),
      comprobante: comprobante.trim(),
      metodo,
      producto: producto.nombre,
      lineas,
      cantidad,
      precio,
      total,
    });
    setEtapa("factura");
  };

  if (etapa === "factura" && factura) {
    return (
      <div className="pago">
        <Pasos actual={2} />
        <p className="pago__ok">
          <CheckCircle2 size={18} aria-hidden="true" /> ¡Listo! Esta es tu factura.
        </p>

        <article className="factura" aria-label={`Factura ${factura.numero}`}>
          <header className="factura__cabeza">
            <div className="factura__emisor">
              <img src="/img/logo-aronystech.webp" alt="AronysTech" width="120" height="48" />
              <p className="factura__sub">Impresión 3D a pedido · Panamá</p>
            </div>
            <div className="factura__datos">
              <p className="factura__titulo">Factura</p>
              <p>{factura.numero}</p>
              <p>{factura.fecha}</p>
            </div>
          </header>

          <p className="factura__cliente"><span>Cliente</span>{factura.cliente}</p>

          <table className="factura__tabla">
            <thead>
              <tr><th>Detalle</th><th>Cant.</th><th>Precio</th><th>Importe</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{factura.producto}</strong>
                  {factura.lineas.map((l) => <small key={l}>{l}</small>)}
                </td>
                <td>{factura.cantidad}</td>
                <td>{dinero(factura.precio)}</td>
                <td>{dinero(factura.total)}</td>
              </tr>
            </tbody>
          </table>

          <div className="factura__total">
            <span>Total pagado</span>
            <strong>{dinero(factura.total)}</strong>
            <em className="factura__sello">Pago reportado</em>
          </div>

          <dl className="factura__pie">
            <div><dt>Método</dt><dd>{factura.metodo}</dd></div>
            <div><dt>Comprobante</dt><dd>{factura.comprobante}</dd></div>
            <div><dt>Envío</dt><dd>Se coordina por WhatsApp</dd></div>
          </dl>
          <p className="factura__gracias">Gracias por tu compra. Hugo verifica el pago y te confirma la entrega por WhatsApp.</p>
        </article>

        <a className="boton pago__continuar pago__whatsapp" href={linkWhatsApp(facturaEnTexto(factura))} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={18} /> Mandar la factura por WhatsApp
        </a>
        <button type="button" className="pago__secundario" onClick={() => window.print()}>
          <Printer size={16} /> Imprimir o guardar en PDF
        </button>
      </div>
    );
  }

  if (etapa === "pagar") {
    return (
      <form className="pago" onSubmit={generarFactura}>
        <button type="button" className="pago__volver" onClick={() => setEtapa("elegir")}>
          <ArrowLeft size={16} /> Cambiar método
        </button>

        <Pasos actual={1} />
        <div className="pago__monto">
          {ICONO_METODO[metodo] && (() => { const Icono = ICONO_METODO[metodo]; return <span className="pago__icono" aria-hidden="true"><Icono size={22} /></span>; })()}
          <p className="rotulo">Pagar con {metodo}</p>
          <p className="pago__cifra">{dinero(total)}</p>
          <p className="pago__intro">{producto.nombre} · {cantidad} × {dinero(precio)}</p>
        </div>

        <p className="pago__instruccion"><b>1.</b> Envía el total a esta cuenta desde tu app:</p>
        <dl className="pago__cuenta">
          {(CUENTAS_PAGO[metodo] ?? []).map(([k, v]) => (
            <DatoCuenta key={k} nombre={k} valor={v} />
          ))}
        </dl>
        <p className="pago__instruccion"><b>2.</b> Escribe tus datos y el comprobante:</p>

        <label className="pago__campo">
          <span className="rotulo">Tu nombre</span>
          <input type="text" autoComplete="name" value={cliente} onChange={(e) => { setCliente(e.target.value); setError(""); }} />
        </label>
        <label className="pago__campo">
          <span className="rotulo">Número de comprobante</span>
          <input type="text" autoComplete="off" value={comprobante} placeholder="El que te sale al hacer el pago" onChange={(e) => { setComprobante(e.target.value); setError(""); }} />
        </label>
        <p className="pago__error" role="alert">{error}</p>

        <button type="submit" className="boton pago__continuar">
          <CheckCircle2 size={18} /> Ya pagué, generar factura
        </button>
      </form>
    );
  }

  return (
    <div className="pago">
      <button type="button" className="pago__volver" onClick={alVolver}>
        <ArrowLeft size={16} /> Editar pedido
      </button>

      <Pasos actual={1} />
      <h3>¿Cómo prefieres pagar?</h3>
      <p className="pago__intro">
        {producto.nombre} · {cantidad} {cantidad === 1 ? "unidad" : "unidades"}
        {precio > 0 && cantidad < MAYOREO && ` · ${dinero(total)}`}
      </p>
      <p className="pago__aviso">
        {enLinea
          ? "Pagas aquí mismo, te sale la factura y después la mandas por WhatsApp para coordinar la entrega."
          : cantidad >= MAYOREO
            ? `Desde ${MAYOREO} unidades el precio baja: te lo confirmamos por WhatsApp antes de cobrar.`
            : "Con este método te confirmamos el total y la fecha por WhatsApp, y el pago se hace después."}
      </p>

      <fieldset className="pago__metodos">
        <legend className="oculto-visual">Método de pago</legend>
        {[...PAGOS].sort((a, b) => Boolean(b.enLinea) - Boolean(a.enLinea)).map((m) => (
          <label
            key={m.texto}
            className={`pago__metodo ${metodo === m.texto ? "seleccionado" : ""} ${m.enLinea && cantidad < MAYOREO ? "pago__metodo--linea" : ""}`}
          >
            <input
              type="radio"
              name="metodo-pago"
              value={m.texto}
              checked={metodo === m.texto}
              onChange={() => setMetodo(m.texto)}
            />
            <span>
              <strong>
                {m.texto}
                {m.enLinea && cantidad < MAYOREO && <i className="pago__chip">Factura al instante</i>}
              </strong>
              <small>{m.enLinea && cantidad >= MAYOREO ? "Te pasamos los datos por el chat" : m.detalle}</small>
            </span>
          </label>
        ))}
      </fieldset>

      {enLinea ? (
        <button type="button" className="boton pago__continuar" onClick={() => setEtapa("pagar")}>
          Pagar {dinero(total)}
        </button>
      ) : (
        <>
          <a className="boton pago__continuar" href={enlace} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} /> Continuar a WhatsApp
          </a>
          <p className="pago__intro">Se prepara el mensaje; tú decides cuándo enviarlo.</p>
          <details className="pago__resumen">
            <summary>Ver el mensaje completo</summary>
            <p>{`${mensaje}\n\nQuisiera pagar con: ${metodo}`}</p>
          </details>
        </>
      )}
    </div>
  );
}
