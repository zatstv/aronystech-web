import { useEffect, useRef, useState } from "react";
import { ArrowUp, CreditCard, MessageCircle, X } from "lucide-react";

import { PRODUCTOS } from "../data/sitio.js";
import { dinero, precioNumero } from "../lib/factura.js";

import { linkWhatsApp } from "../lib/whatsapp.js";
import "./Asistente.css";

/* ============================================================
   El asistente: un chat abajo a la derecha que atiende al cliente antes de
   WhatsApp. Responde dudas, y si quiere algo le hace las preguntas que
   faltan para cotizar. Cuando ya está, le arma el mensaje y lo manda a
   WhatsApp con un botón. La IA vive en el servidor (worker/index.js), acá
   solo está la conversación.

   La charla se guarda en sessionStorage para que no se pierda al abrir una
   ficha de producto o recargar; se borra al cerrar la pestaña.
   ============================================================ */

const BIENVENIDA = {
  de: "asistente",
  texto: "¡Hola! Soy el asistente de AronysTech. Cuéntame qué pieza tienes en mente, o pregúntame lo que quieras sobre precios, colores o envíos.",
};

const SUGERENCIAS = ["Quiero algo personalizado", "¿Cuánto cuesta un llavero?", "¿Hacen envíos a mi provincia?"];

const GUARDADO = "aronystech-chat";

function leerGuardado() {
  try {
    const datos = JSON.parse(sessionStorage.getItem(GUARDADO));
    if (Array.isArray(datos?.mensajes) && datos.mensajes.length) return datos;
  } catch {
    /* sin almacenamiento: se arranca de cero */
  }
  return { mensajes: [BIENVENIDA], resumen: "", pago: null };
}

const ERRORES = {
  ocupado: "Hay mucha gente escribiendo ahora mismo. Prueba de nuevo en un momento, o escríbenos directo por WhatsApp.",
  otro: "El asistente no está disponible ahora. Escríbenos directo por WhatsApp y te atendemos ahí.",
};

export default function Asistente({ alPagar }) {
  const [abierto, setAbierto] = useState(false);
  const [{ mensajes, resumen, pago = null }, setChat] = useState(leerGuardado);
  const [texto, setTexto] = useState("");
  const [esperando, setEsperando] = useState(false);
  const [error, setError] = useState("");
  const listaRef = useRef(null);
  const entradaRef = useRef(null);
  const botonRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(GUARDADO, JSON.stringify({ mensajes, resumen, pago }));
    } catch {
      /* no pasa nada si no se puede guardar */
    }
  }, [mensajes, resumen, pago]);

  /* Siempre a la vista el último mensaje. */
  useEffect(() => {
    const lista = listaRef.current;
    if (lista) lista.scrollTop = lista.scrollHeight;
  }, [mensajes, esperando, error, abierto, resumen]);

  useEffect(() => {
    if (abierto) entradaRef.current?.focus({ preventScroll: true });
  }, [abierto]);

  const cerrar = () => {
    setAbierto(false);
    botonRef.current?.focus({ preventScroll: true });
  };

  const enviar = async (contenido) => {
    const limpio = contenido.trim();
    if (!limpio || esperando) return;
    const nuevos = [...mensajes, { de: "cliente", texto: limpio }];
    setChat({ mensajes: nuevos, resumen, pago });
    setTexto("");
    setError("");
    setEsperando(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mensajes: nuevos }),
      });
      const datos = await r.json().catch(() => ({}));
      if (!r.ok || !datos.respuesta) {
        setError(datos.error === "ocupado" ? ERRORES.ocupado : ERRORES.otro);
        return;
      }
      setChat({
        mensajes: [...nuevos, { de: "asistente", texto: datos.respuesta }],
        resumen: datos.pedido_listo && datos.resumen ? datos.resumen : resumen,
        pago: datos.pedido_listo ? datos.pago ?? null : pago,
      });
    } catch {
      setError(ERRORES.otro);
    } finally {
      setEsperando(false);
      entradaRef.current?.focus({ preventScroll: true });
    }
  };

  const reiniciar = () => {
    setChat({ mensajes: [BIENVENIDA], resumen: "", pago: null });
    setError("");
  };

  const soloBienvenida = mensajes.length === 1;

  /* Pieza del catálogo: primero se paga en la página y la factura va después
     por WhatsApp. Personalizado o mayoreo: directo a WhatsApp. */
  const productoPago = pago && PRODUCTOS.find((p) => p.id === pago.producto_id);
  const pagar = () => {
    alPagar?.(productoPago, { color: pago.color, cantidad: pago.cantidad, texto: pago.texto });
    setAbierto(false);
  };

  return (
    <div className={`asistente ${abierto ? "esta-abierto" : ""}`}>
      {abierto && (
        <section
          className="asistente__panel"
          role="dialog"
          aria-label="Chat con el asistente de AronysTech"
          onKeyDown={(e) => e.key === "Escape" && cerrar()}
        >
          <header className="asistente__cabeza">
            <div>
              <p className="asistente__titulo">Asistente AronysTech</p>
              <p className="asistente__sub">Te ayuda a armar y pagar tu pedido</p>
            </div>
            <button type="button" className="asistente__cerrar" onClick={cerrar} aria-label="Cerrar el chat">
              <X size={18} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </header>

          <ol className="asistente__mensajes" ref={listaRef} aria-live="polite">
            {mensajes.map((m, i) => (
              <li key={i} className={`asistente__burbuja asistente__burbuja--${m.de}`}>
                {m.texto}
              </li>
            ))}
            {esperando && (
              <li className="asistente__burbuja asistente__burbuja--asistente asistente__escribiendo" aria-label="Escribiendo">
                <span />
                <span />
                <span />
              </li>
            )}
            {error && (
              <li className="asistente__aviso">
                {error} <a href={linkWhatsApp()} target="_blank" rel="noopener">Abrir WhatsApp</a>
              </li>
            )}
          </ol>

          {resumen && (
            <div className="asistente__listo">
              {productoPago ? (
                <button type="button" className="asistente__whatsapp asistente__pagar" onClick={pagar}>
                  <CreditCard size={18} strokeWidth={2.4} aria-hidden="true" />
                  Pagar ahora · {dinero(precioNumero(productoPago) * pago.cantidad)}
                </button>
              ) : (
                <a className="asistente__whatsapp" href={linkWhatsApp(resumen)} target="_blank" rel="noopener">
                  <MessageCircle size={18} strokeWidth={2.4} aria-hidden="true" />
                  Mandar el pedido por WhatsApp
                </a>
              )}
              <details>
                <summary>Ver el mensaje</summary>
                <p>{resumen}</p>
              </details>
            </div>
          )}

          {soloBienvenida && (
            <div className="asistente__sugerencias">
              {SUGERENCIAS.map((s) => (
                <button key={s} type="button" onClick={() => enviar(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            className="asistente__entrada"
            onSubmit={(e) => {
              e.preventDefault();
              enviar(texto);
            }}
          >
            <textarea
              ref={entradaRef}
              rows={1}
              value={texto}
              maxLength={1200}
              placeholder="Escribe tu mensaje…"
              aria-label="Tu mensaje"
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  enviar(texto);
                }
              }}
            />
            <button type="submit" disabled={!texto.trim() || esperando} aria-label="Enviar">
              <ArrowUp size={18} strokeWidth={2.6} aria-hidden="true" />
            </button>
          </form>

          <p className="asistente__pie">
            <a href={linkWhatsApp()} target="_blank" rel="noopener">Prefiero hablar con una persona</a>
            {!soloBienvenida && (
              <button type="button" onClick={reiniciar}>
                Empezar de nuevo
              </button>
            )}
          </p>
        </section>
      )}

      <button
        ref={botonRef}
        type="button"
        className="asistente__boton"
        onClick={() => (abierto ? cerrar() : setAbierto(true))}
        aria-expanded={abierto}
        aria-label={abierto ? "Cerrar el chat" : "Abrir el chat con el asistente"}
      >
        {abierto ? (
          <X size={22} strokeWidth={2.4} aria-hidden="true" />
        ) : (
          <>
            <MessageCircle size={22} strokeWidth={2.4} aria-hidden="true" />
            <span className="asistente__boton-texto">¿Te ayudo a cotizar?</span>
          </>
        )}
      </button>
    </div>
  );
}
