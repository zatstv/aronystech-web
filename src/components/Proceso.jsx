import { useEffect, useRef } from "react";
import {
  BadgeCheck,
  Box,
  Briefcase,
  Cake,
  GraduationCap,
  Heart,
  MessageCircle,
  PartyPopper,
  Printer,
  Truck,
  Wrench,
} from "lucide-react";

import { OCASIONES, PASOS } from "../data/sitio.js";
import { ENCABEZADO, useEntradaEscalonada } from "../hooks/useEntradaEscalonada.js";
import { gsap, pideQuietud } from "../lib/movimiento.js";
import "./Proceso.css";

/* ============================================================
   Dos cosas que alguien necesita saber antes de escribir: cómo es el
   trámite de punta a punta, y para qué sirve esto en la vida real.

   Los pasos van en una línea de tiempo: cada uno con su dibujo en un
   cubito, unidos por una línea que se va llenando a medida que se baja.
   Cada paso se enciende cuando la línea le llega.

   Los pasos van en <ol> numerado de verdad. El número que se ve lo pone el
   CSS con un contador, así que nadie tiene que escribirlo a mano ni
   renumerar si algún día se agrega un paso en el medio.
   ============================================================ */

const ICONOS = {
  mensaje: MessageCircle,
  modelo: Box,
  visto: BadgeCheck,
  impresora: Printer,
  envio: Truck,
  torta: Cake,
  birrete: GraduationCap,
  fiesta: PartyPopper,
  empresa: Briefcase,
  boda: Heart,
  repuesto: Wrench,
};

/* La línea que une los cubitos.

   Dónde empieza y cuánto mide se mide en vez de escribirlo en el CSS: en
   ancho los pasos van en fila y la línea es horizontal, en angosto van en
   columna y es vertical, y en los dos casos tiene que ir del centro del
   primer cubito al del último, que dependen del largo de cada texto.

   Cuánto está llena sale del scroll. En columna, la línea llega hasta una
   "línea de lectura" al 60% del alto de la pantalla: cada paso se enciende
   cuando su cubito la cruza. En fila los cinco se leen a la vez, así que
   se llena entera mientras la fila sube del 85% al 45% de la pantalla.

   Con menos movimiento la línea se dibuja entera y quieta, con todos los
   pasos encendidos. Sin JS no hay línea (no hay quién la mida), y los
   pasos se ven encendidos igual: el CSS los trae así. */
function useLineaDeTiempo() {
  const ref = useRef(null);

  useEffect(() => {
    const caja = ref.current;
    if (!caja) return;
    const pasos = [...caja.querySelectorAll(".paso")];
    const nodos = pasos.map((p) => p.querySelector(".paso__nodo"));
    const lleno = caja.querySelector(".proceso__via-lleno");
    const quieto = pideQuietud();

    let vertical = false;
    let inicio = 0;
    let largo = 1;
    let pedido = 0;

    const medir = () => {
      const base = caja.getBoundingClientRect();
      const centros = nodos.map((n) => {
        const r = n.getBoundingClientRect();
        return { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top };
      });
      const primero = centros[0];
      const ultimo = centros[centros.length - 1];
      vertical = Math.abs(ultimo.y - primero.y) > Math.abs(ultimo.x - primero.x);
      inicio = primero.y;
      largo = Math.max(1, vertical ? ultimo.y - primero.y : ultimo.x - primero.x);
      caja.style.setProperty("--via-x", `${primero.x}px`);
      caja.style.setProperty("--via-y", `${primero.y}px`);
      caja.style.setProperty("--via-largo", `${largo}px`);
      caja.dataset.via = vertical ? "vertical" : "horizontal";
      pintar();
    };

    const pintar = () => {
      pedido = 0;
      const alto = window.innerHeight;
      const arriba = caja.getBoundingClientRect().top;
      const avance = vertical
        ? (alto * 0.6 - (arriba + inicio)) / largo
        : (alto * 0.85 - arriba) / (alto * 0.4);
      const p = quieto ? 1 : Math.min(1, Math.max(0, avance));
      gsap.set(lleno, vertical ? { scaleY: p, scaleX: 1 } : { scaleX: p, scaleY: 1 });

      pasos.forEach((paso, i) => {
        const llega = p >= i / (pasos.length - 1) - 0.001;
        if (llega === paso.classList.contains("esta-encendido")) return;
        paso.classList.toggle("esta-encendido", llega);
        /* El cubito salta un poco al encenderse, como una pieza que cae en
           su lugar. Al apagarse (subiendo) vuelve sin rebote. */
        if (llega && !quieto) {
          gsap.fromTo(
            nodos[i],
            { scale: 0.7, rotation: -12 },
            { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.4)", clearProps: "transform" }
          );
        }
      });
    };

    const alMover = () => {
      if (!pedido) pedido = requestAnimationFrame(pintar);
    };

    /* Todos apagados desde el principio: solo se encienden a medida que la
       línea les llega. */
    pasos.forEach((p) => p.classList.remove("esta-encendido"));
    caja.dataset.animada = "";
    medir();

    const obs = new ResizeObserver(medir);
    obs.observe(caja);
    if (!quieto) window.addEventListener("scroll", alMover, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", alMover);
      cancelAnimationFrame(pedido);
      delete caja.dataset.animada;
      delete caja.dataset.via;
      pasos.forEach((p) => p.classList.add("esta-encendido"));
    };
  }, []);

  return ref;
}

export default function Proceso() {
  const encabezadoRef = useEntradaEscalonada({ selector: ENCABEZADO });
  /* Entra el texto de cada paso, no el paso entero: los cubitos se quedan
     quietos porque la línea mide dónde están, y si se movieran al medir
     quedaría corrida. Ellos tienen su propia entrada al encenderse. */
  const pasosRef = useEntradaEscalonada({ selector: ".paso__cuerpo" });
  const ocasionesRef = useEntradaEscalonada();
  const lineaRef = useLineaDeTiempo();

  return (
    <section className="proceso" id="proceso">
      <div className="contenedor" ref={encabezadoRef}>
        <p className="rotulo">Cómo funciona</p>
        <h2 className="titulo-seccion proceso__titulo">De la idea a tu mano</h2>

        {/* Dos refs en el mismo elemento no se pueden: la de la entrada va
            en un envoltorio y la de la línea, adentro. */}
        <div ref={pasosRef}>
          <div className="proceso__linea" ref={lineaRef}>
            <div className="proceso__via" aria-hidden="true">
              <div className="proceso__via-lleno" />
            </div>

            <ol className="proceso__pasos">
              {PASOS.map((paso) => {
                const Icono = ICONOS[paso.icono];
                return (
                  <li className="paso esta-encendido" key={paso.titulo}>
                    <span className="paso__nodo" aria-hidden="true">
                      {Icono && <Icono size={22} strokeWidth={2.2} />}
                    </span>
                    <div className="paso__cuerpo">
                      <h3 className="paso__titulo">{paso.titulo}</h3>
                      <p className="paso__texto">{paso.texto}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="ocasiones">
          <h3 className="ocasiones__titulo">Para qué lo piden</h3>
          <ul className="ocasiones__lista" ref={ocasionesRef}>
            {OCASIONES.map((o) => {
              const Icono = ICONOS[o.icono];
              return (
                <li className="ocasion" key={o.titulo}>
                  <span className="ocasion__icono" aria-hidden="true">
                    {Icono && <Icono size={20} strokeWidth={2.2} />}
                  </span>
                  <div>
                    <h4 className="ocasion__titulo">{o.titulo}</h4>
                    <p className="ocasion__texto">{o.texto}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
