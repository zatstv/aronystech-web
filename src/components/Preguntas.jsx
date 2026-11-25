import { useRef } from "react";
import { Banknote, Bitcoin, Landmark, CreditCard, MessageCircle, Plus, Smartphone, Wallet } from "lucide-react";

import { PAGOS, PREGUNTAS } from "../data/sitio.js";
import { ENCABEZADO, useEntradaEscalonada } from "../hooks/useEntradaEscalonada.js";
import { gsap, pideQuietud } from "../lib/movimiento.js";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./Preguntas.css";

/* ============================================================
   Las dudas que frenan un pedido, contestadas antes de que haya que
   preguntarlas por WhatsApp: si se derrite, cuánto tarda, cómo se paga.

   Va armado con <details> nativo en vez de un acordeón hecho a mano. Sale
   gratis lo que costaría escribir: abre y cierra con teclado, el buscador
   del navegador (Ctrl+F) encuentra el texto aunque esté cerrado, y los
   lectores de pantalla ya saben narrarlo. Un <div> con onClick no hace
   ninguna de las tres.
   ============================================================ */

const ICONOS = {
  efectivo: Banknote,
  yappy: Smartphone,
  banco: Landmark,
  tarjeta: CreditCard,
  cripto: Bitcoin,
  paypal: Wallet,
};

/* Una pregunta. Sigue siendo un <details> nativo (ver arriba por qué), y
   lo único que se le agrega es que la respuesta se despliegue en vez de
   aparecer de golpe.

   El clic en el <summary> se intercepta: al abrir, primero se marca
   abierta y después se anima el alto desde cero; al cerrar, primero se
   anima hasta cero y recién al final se quita el open, porque sin open el
   navegador ya no dibuja la respuesta y no habría nada que animar.

   Todo lo demás lo sigue haciendo el navegador: el teclado, lo que narra
   un lector de pantalla y Ctrl+F, que abre la pregunta sola (sin
   animación) si encuentra el texto adentro. Con menos movimiento no se
   intercepta nada. */
function Pregunta({ pregunta, respuesta }) {
  const ref = useRef(null);
  const cerrando = useRef(false);

  const alTocar = (e) => {
    const detalle = ref.current;
    const cuerpo = detalle.querySelector(".pregunta__cuerpo");
    if (pideQuietud()) return;
    e.preventDefault();
    gsap.killTweensOf(cuerpo);

    if (!detalle.open || cerrando.current) {
      /* Abrir, o volver a abrir una que se estaba cerrando: en ese caso
         sigue desde el alto que tenga en ese momento. */
      const desdeCerrada = !detalle.open;
      cerrando.current = false;
      detalle.open = true;
      gsap.fromTo(
        cuerpo,
        desdeCerrada ? { height: 0, opacity: 0 } : { height: cuerpo.offsetHeight },
        { height: "auto", opacity: 1, duration: 0.45, ease: "power3.out", clearProps: "height,opacity" }
      );
    } else {
      cerrando.current = true;
      gsap.to(cuerpo, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          cerrando.current = false;
          detalle.open = false;
          gsap.set(cuerpo, { clearProps: "height,opacity" });
        },
      });
    }
  };

  return (
    <details className="pregunta" ref={ref}>
      <summary className="pregunta__titulo" onClick={alTocar}>
        <span className="pregunta__texto">{pregunta}</span>
        {/* Decorativo: la cruz gira a "cerrar" desde el CSS. Quien no
            ve la pantalla ya escucha si está abierto o cerrado. */}
        <Plus className="pregunta__signo" size={20} aria-hidden="true" />
      </summary>
      {/* El envoltorio es lo que se anima: con el alto en cero, el relleno
          del párrafo quedaría asomando si se animara el párrafo mismo. */}
      <div className="pregunta__cuerpo">
        <p className="pregunta__respuesta">{respuesta}</p>
      </div>
    </details>
  );
}

export default function Preguntas() {
  const encabezadoRef = useEntradaEscalonada({ selector: ENCABEZADO });
  const listaRef = useEntradaEscalonada({ y: 16 });
  const pagosRef = useEntradaEscalonada({ y: 10 });

  return (
    <section className="preguntas" id="preguntas">
      <div className="contenedor" ref={encabezadoRef}>
        <p className="rotulo">Preguntas</p>
        <h2 className="titulo-seccion preguntas__titulo">Lo que todos preguntan</h2>

        {/* Dos columnas en pantalla ancha: las preguntas a la izquierda y, al
            lado, lo que se busca después de leerlas —cómo pagar y a quién
            preguntar lo que no está—. Antes esa columna quedaba vacía. */}
        <div className="preguntas__cuerpo">
          <div className="preguntas__lista" ref={listaRef}>
            {PREGUNTAS.map((p) => (
              <Pregunta key={p.pregunta} pregunta={p.pregunta} respuesta={p.respuesta} />
            ))}
          </div>

          <aside className="preguntas__lado">
            <div className="pagos">
              <h3 className="pagos__titulo">Cómo puedes pagar</h3>
              <ul className="pagos__lista" ref={pagosRef}>
                {PAGOS.map((f) => {
                  const Icono = ICONOS[f.icono];
                  return (
                    <li className="pagos__medio" key={f.texto}>
                      {Icono && <Icono size={18} strokeWidth={2.2} aria-hidden="true" />}
                      {f.texto}
                    </li>
                  );
                })}
              </ul>
              <p className="pagos__nota">
                Las piezas del catálogo se pagan con Yappy o transferencia al hacer el pedido y te
                sale la factura. Los pedidos personalizados se cotizan primero por WhatsApp.
              </p>
            </div>

            <div className="duda">
              <div className="duda__cabeza">
                <h3 className="duda__titulo">¿Otra duda?</h3>
                {/* Los tres puntitos de "escribiendo…" de cualquier chat. */}
                <span className="duda__burbuja" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
              <p className="duda__texto">
                Escríbenos por WhatsApp y te contestamos ahí mismo, sin compromiso.
              </p>
              <a
                className="boton duda__boton"
                href={linkWhatsApp("Hola, tengo una pregunta.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={17} strokeWidth={2.4} aria-hidden="true" />
                Preguntar por WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
