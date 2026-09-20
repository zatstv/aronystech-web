import { Banknote, Bitcoin, CreditCard, Plus, Smartphone, Wallet } from "lucide-react";

import { PAGOS, PREGUNTAS } from "../data/sitio.js";
import { useEntradaEscalonada } from "../hooks/useEntradaEscalonada.js";
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
  tarjeta: CreditCard,
  cripto: Bitcoin,
  paypal: Wallet,
};

export default function Preguntas() {
  const listaRef = useEntradaEscalonada({ y: 16 });

  return (
    <section className="preguntas" id="preguntas">
      <div className="contenedor">
        <p className="rotulo">Preguntas</p>
        <h2 className="titulo-seccion preguntas__titulo">Lo que todos preguntan</h2>

        <div className="preguntas__lista" ref={listaRef}>
          {PREGUNTAS.map((p) => (
            <details className="pregunta" key={p.pregunta}>
              <summary className="pregunta__titulo">
                {p.pregunta}
                {/* Decorativo: la cruz gira a "cerrar" desde el CSS. Quien no
                    ve la pantalla ya escucha si está abierto o cerrado. */}
                <Plus className="pregunta__signo" size={20} aria-hidden="true" />
              </summary>
              <p className="pregunta__respuesta">{p.respuesta}</p>
            </details>
          ))}
        </div>

        <div className="pagos">
          <h3 className="pagos__titulo">Cómo puedes pagar</h3>
          <ul className="pagos__lista">
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
            El pago se coordina por WhatsApp al confirmar el pedido. No se cobra nada por la
            página.
          </p>
        </div>
      </div>
    </section>
  );
}
