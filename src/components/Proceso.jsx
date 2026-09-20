import { OCASIONES, PASOS } from "../data/sitio.js";
import { useEntradaEscalonada } from "../hooks/useEntradaEscalonada.js";
import "./Proceso.css";

/* ============================================================
   Dos cosas que alguien necesita saber antes de escribir: cómo es el
   trámite de punta a punta, y para qué sirve esto en la vida real.

   Los pasos van en <ol> numerado de verdad. El número que se ve lo pone el
   CSS con un contador, así que nadie tiene que escribirlo a mano ni
   renumerar si algún día se agrega un paso en el medio.
   ============================================================ */

export default function Proceso() {
  const pasosRef = useEntradaEscalonada();
  const ocasionesRef = useEntradaEscalonada();

  return (
    <section className="proceso" id="proceso">
      <div className="contenedor">
        <p className="rotulo">Cómo funciona</p>
        <h2 className="titulo-seccion proceso__titulo">De la idea a tu mano</h2>

        <ol className="proceso__pasos" ref={pasosRef}>
          {PASOS.map((paso) => (
            <li className="paso" key={paso.titulo}>
              <h3 className="paso__titulo">{paso.titulo}</h3>
              <p className="paso__texto">{paso.texto}</p>
            </li>
          ))}
        </ol>

        <div className="ocasiones">
          <h3 className="ocasiones__titulo">Para qué lo piden</h3>
          <ul className="ocasiones__lista" ref={ocasionesRef}>
            {OCASIONES.map((o) => (
              <li className="ocasion" key={o.titulo}>
                <h4 className="ocasion__titulo">{o.titulo}</h4>
                <p className="ocasion__texto">{o.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
