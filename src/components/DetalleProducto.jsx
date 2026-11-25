import { useEffect, useLayoutEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Boxes, Package, Truck } from "lucide-react";

import { DATOS, PALETA, PRODUCTOS } from "../data/sitio.js";
import { useEntradaEscalonada } from "../hooks/useEntradaEscalonada.js";
import { gsap, pideQuietud } from "../lib/movimiento.js";
import "./DetalleProducto.css";

/* ============================================================
   La ficha de una pieza (#producto/<id>). Desde que las tarjetas del
   catálogo ya no piden directo, todo pedido de una pieza con precio pasa
   por acá: tiene que contestar lo que alguien quiere saber antes de
   escribir —qué es, cuánto sale, en qué colores, cuánto hay que pedir— y
   dejar el botón a mano.

   Abajo van las otras piezas, para seguir mirando sin volver al catálogo.
   ============================================================ */

const ICONOS = { package: Package, truck: Truck, layers: Boxes };

/* La entrada de la ficha, en un solo tiempo: la foto se descubre de abajo
   hacia arriba, el título sube, el precio cae como un sello y el resto
   aparece detrás. Va en useLayoutEffect para esconder todo antes del primer
   cuadro; con useEffect se vería la ficha entera un instante antes de
   empezar.

   Como en el resto de la página, lo esconde el JS y no el CSS: si esto no
   corre, la ficha se ve igual. */
function useEntradaFicha(ref) {
  useLayoutEffect(() => {
    const ficha = ref.current;
    if (!ficha || pideQuietud()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".detalle__imagen", {
          clipPath: "inset(100% 0% 0% 0% round 10px)",
          duration: 0.9,
          ease: "power4.inOut",
          clearProps: "clipPath",
        })
        .from(".detalle__imagen img", { scale: 1.15, duration: 1.2, clearProps: "transform" }, "<")
        .from(".detalle__info .rotulo, .detalle h1", { autoAlpha: 0, y: 28, duration: 0.7, stagger: 0.08 }, "-=0.8")
        .from(
          ".detalle__etiqueta",
          { autoAlpha: 0, scale: 1.8, rotation: -14, duration: 0.55, ease: "back.out(2.2)", clearProps: "transform" },
          "-=0.35"
        )
        .from(".detalle__unidad", { autoAlpha: 0, x: -10, duration: 0.4 }, "-=0.25")
        .from(
          ".detalle__descripcion, .detalle__linea, .detalle__detalles > *, .detalle__pedir",
          { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.07, clearProps: "transform" },
          "-=0.3"
        );
    }, ficha);
    return () => ctx.revert();
  }, [ref]);
}

/* Con el mouse encima, la foto se inclina un poco hacia él, como una lámina
   que se levanta de la mesa. Solo con mouse: en táctil no hay "encima". */
function useInclinacion(ref) {
  useEffect(() => {
    const el = ref.current;
    const conMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!el || !conMouse || pideQuietud()) return;

    gsap.set(el, { transformPerspective: 900 });
    const girarX = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const girarY = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });

    const mover = (e) => {
      const r = el.getBoundingClientRect();
      /* -0.5 a 0.5 desde el centro de la foto. */
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      girarY(x * 7);
      girarX(-y * 7);
    };
    const soltar = () => {
      girarX(0);
      girarY(0);
    };

    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", soltar);
    return () => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", soltar);
      gsap.set(el, { clearProps: "transform" });
    };
  }, [ref]);
}

function NoEncontrada() {
  return (
    <main className="detalle contenedor">
      <a className="detalle__volver" href="#catalogo">
        <ArrowLeft size={18} aria-hidden="true" /> Volver al catálogo
      </a>
      <h1 id="detalle-titulo" tabIndex={-1}>No encontramos esta pieza</h1>
    </main>
  );
}

export default function DetalleProducto({ producto, alPedir }) {
  const fichaRef = useRef(null);
  const fotoRef = useRef(null);
  const otrasRef = useEntradaEscalonada();
  useEntradaFicha(fichaRef);
  useInclinacion(fotoRef);

  if (!producto) return <NoEncontrada />;

  const colores = PALETA.filter((c) => producto.colores.includes(c.hex));
  const otras = PRODUCTOS.filter((p) => p.id !== producto.id).slice(0, 3);

  return (
    <main className="detalle">
      <div className="contenedor">
        <a className="detalle__volver" href="#catalogo">
          <ArrowLeft size={18} strokeWidth={2.4} aria-hidden="true" />
          Volver al catálogo
        </a>

        <div className="detalle__grilla" ref={fichaRef}>
          <figure className="detalle__imagen" ref={fotoRef}>
            <img
              src={`/${producto.foto.src}`}
              alt={producto.foto.alt}
              width={producto.foto.ancho}
              height={producto.foto.alto}
            />
          </figure>

          <div className="detalle__info">
            <p className="rotulo">{producto.categoria} · Por encargo</p>

            <h1 id="detalle-titulo" tabIndex={-1}>{producto.nombre}</h1>

            <p className="detalle__precio">
              <span className="detalle__etiqueta">{producto.precio}</span>
              <span className="detalle__unidad">{producto.unidad}</span>
            </p>

            <p className="detalle__descripcion">{producto.texto}</p>

            {/* Una línea de capas, como los divisores del resto del sitio. */}
            <hr className="detalle__linea" />

            <div className="detalle__detalles">
              {colores.length > 0 && (
                <div className="detalle__fila">
                  <p className="detalle__clave">Colores</p>
                  <ul className="detalle__colores">
                    {colores.map((c) => (
                      <li key={c.hex}>
                        <span style={{ background: c.hex }} aria-hidden="true" />
                        {c.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pedido mínimo, envíos y material: lo mismo que dice la
                  portada, porque quien llega directo a una ficha por un
                  enlace no la vio. */}
              <dl className="detalle__datos">
                {DATOS.map((d) => {
                  const Icono = ICONOS[d.icono];
                  return (
                    <div key={d.etiqueta}>
                      <dt className="detalle__clave">{d.etiqueta}</dt>
                      <dd>
                        <Icono size={15} strokeWidth={2.2} aria-hidden="true" />
                        {d.valor}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            <div className="detalle__pedir">
              <button type="button" className="boton detalle__boton" onClick={() => alPedir(producto)}>
                Personalizar mi pedido
                <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
              </button>
              <p className="detalle__ayuda">
                Eliges el color, el texto y la cantidad, pagas con Yappy o
                transferencia y te sale la factura al instante. Después la mandas por
                WhatsApp para coordinar la entrega.
              </p>
            </div>
          </div>
        </div>
      </div>

      {otras.length > 0 && (
        <section className="detalle__otras" aria-labelledby="otras-titulo">
          <div className="contenedor">
            <h2 id="otras-titulo" className="detalle__otras-titulo">Otras piezas</h2>
            <ul className="otras" ref={otrasRef}>
              {otras.map((p) => (
                <li className="otra" key={p.id}>
                  <div className="otra__foto">
                    <img
                      src={`/${p.foto.src}`}
                      alt=""
                      width={p.foto.ancho}
                      height={p.foto.alto}
                      style={p.foto.encuadre ? { objectPosition: p.foto.encuadre } : undefined}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="otra__cuerpo">
                    <h3 className="otra__nombre">
                      <a href={`#producto/${p.id}`}>{p.nombre}</a>
                    </h3>
                    <p className="otra__precio">{p.precio}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
