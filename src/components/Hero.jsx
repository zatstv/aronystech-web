import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Boxes, MessageCircle, Package, Truck } from "lucide-react";

import { DATOS } from "../data/sitio.js";
import { gsap, pideQuietud } from "../lib/movimiento.js";
import "./Hero.css";

const ICONOS = { package: Package, truck: Truck, layers: Boxes };

/* ============================================================
   Portada a sangre: el video ocupa toda la pantalla y encima flota lo
   mínimo. Nada de tarjetas ni recuadros, como en la referencia.

   El video es decorativo y va en aria-hidden: lo que hay que entender está
   escrito al lado. Si alguien pidió menos movimiento ni siquiera se baja,
   se muestra el póster y listo: son 2,3 MB que se ahorra.
   ============================================================ */

const POSTER = "/video/hero-poster.webp";

export default function Hero() {
  const seccionRef = useRef(null);
  /* Se lee una sola vez, al montar: si el video ya empezó, cambiar la
     preferencia a mitad de camino no debería hacerlo desaparecer de golpe. */
  const [quieto] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* El video pesa 2,2 MB y no se ve hasta que se reproduce; el póster son
     35 KB y es lo único que hay en pantalla al entrar. Con autoPlay el
     navegador baja el video de entrada, peleando ancho de banda justo con la
     imagen que el visitante sí está esperando.

     Por eso las <source> no se pintan hasta que la página terminó de cargar:
     el póster gana la carrera, y el video entra después sin que se note.
     preload="metadata" no alcanza para esto: con autoPlay el navegador lo
     ignora, porque para arrancar solo necesita el archivo entero igual. */
  const videoRef = useRef(null);
  const [cargarVideo, setCargarVideo] = useState(false);

  useEffect(() => {
    if (quieto) return;

    const soltar = () => {
      /* Atado a window a propósito: sacar requestIdleCallback del objeto y
         llamarlo suelto revienta con "Illegal invocation" en Chrome. */
      const pedir = window.requestIdleCallback
        ? window.requestIdleCallback.bind(window)
        : (f) => window.setTimeout(f, 200);
      pedir(() => setCargarVideo(true));
    };

    /* Si la página ya cargó (recarga, o vuelta atrás), no hay evento que
       esperar: el load ya pasó y nunca volvería a dispararse. */
    if (document.readyState === "complete") {
      soltar();
      return;
    }
    window.addEventListener("load", soltar, { once: true });
    return () => window.removeEventListener("load", soltar);
  }, [quieto]);

  /* Las <source> agregadas después no las mira nadie hasta que se pide de
     nuevo el archivo, así que hay que pedirlo a mano con load().

     Y después hay que arrancarlo a mano también: el atributo autoPlay ya se
     gastó al montar, cuando el <video> todavía no tenía ninguna fuente. El
     navegador lo dio por fallido ahí mismo y no lo reintenta solo, por más
     que la fuente aparezca después. Sin este play() la portada se queda con
     el póster quieto. */
  useEffect(() => {
    const video = videoRef.current;
    if (!cargarVideo || !video) return;

    video.load();
    /* Puede rechazar si el navegador bloquea la reproducción automática.
       Es un fondo decorativo: si no arranca, queda el póster y no pasa nada,
       pero la promesa sin atrapar ensucia la consola. */
    video.play().catch(() => {});
  }, [cargarVideo]);

  /* Cuánto se lleva la cabecera antes de la portada. Se mide en vez de
     escribirlo: la barra cambió de riel lateral a cabecera de arriba, y con
     un número fijo la portada se pasa de la pantalla apenas cambie el alto.
     Medir el borde de arriba de la sección sirve igual si la cabecera está
     en el flujo, si es pegajosa o si flota encima. */
  useEffect(() => {
    const el = seccionRef.current;
    if (!el) return;

    const medir = () => {
      const arriba = el.getBoundingClientRect().top + window.scrollY;
      el.style.setProperty("--portada-tope", `${Math.max(0, Math.round(arriba))}px`);
    };

    /* En el siguiente cuadro: recién ahí la cabecera tiene su alto real. */
    const id = requestAnimationFrame(medir);
    window.addEventListener("resize", medir);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", medir);
    };
  }, []);

  /* La entrada: el titular sube línea por línea y después aparece la
     franja de abajo. Va en useLayoutEffect para esconder el texto antes del
     primer cuadro; con useEffect se vería entero un instante y después
     desaparecería para volver a entrar.

     Corta a propósito (poco más de un segundo en total): es lo primero que
     ve alguien que llegó desde WhatsApp, y no tiene que esperar para leer. */
  const contenidoRef = useRef(null);
  useLayoutEffect(() => {
    const caja = contenidoRef.current;
    if (!caja || pideQuietud()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".portada__titular > span", {
          autoAlpha: 0,
          y: 36,
          duration: 0.8,
          stagger: 0.14,
        })
        .from(
          ".portada__bajada, .portada__datos > div, .portada__boton",
          { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.06, clearProps: "transform" },
          "-=0.4"
        );
    }, caja);
    return () => ctx.revert();
  }, []);

  /* Al bajar, el texto se queda un poco atrás y se apaga, y la galería
     entra por encima. Solo el texto: si se moviera el video, su borde de
     abajo —el que se funde con el papel— dejaría ver el corte.

     Con quickSetter y un solo requestAnimationFrame por cuadro: el scroll
     dispara el evento muchas más veces de las que la pantalla se redibuja. */
  useEffect(() => {
    const seccion = seccionRef.current;
    const caja = contenidoRef.current;
    if (!seccion || !caja || pideQuietud()) return;

    const ponerY = gsap.quickSetter(caja, "y", "px");
    const ponerAlfa = gsap.quickSetter(caja, "opacity");
    let pedido = 0;

    const pintar = () => {
      pedido = 0;
      const alto = seccion.offsetHeight;
      /* 0 con la portada entera a la vista, 1 cuando ya se fue. */
      const p = Math.min(1, Math.max(0, window.scrollY / alto));
      ponerY(p * alto * 0.3);
      ponerAlfa(1 - Math.min(1, p * 1.6));
    };
    const alMover = () => {
      if (!pedido) pedido = requestAnimationFrame(pintar);
    };

    pintar();
    window.addEventListener("scroll", alMover, { passive: true });
    return () => {
      window.removeEventListener("scroll", alMover);
      cancelAnimationFrame(pedido);
      gsap.set(caja, { clearProps: "transform,opacity" });
    };
  }, []);

  return (
    <section className="portada" id="inicio" ref={seccionRef}>
      <div className="portada__fondo" aria-hidden="true">
        {quieto ? (
          <img src={POSTER} alt="" />
        ) : (
          <video
            ref={videoRef}
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            /* Sin esto, iOS lo abre a pantalla completa al tocarlo. */
            disablePictureInPicture
          >
            {cargarVideo && (
              <>
                <source src="/video/hero.webm" type="video/webm" />
                <source src="/video/hero.mp4" type="video/mp4" />
              </>
            )}
          </video>
        )}
        {/* El velo no es parejo: carga arriba y abajo, que es donde va el
            texto, y deja el medio limpio para que se vea la pieza. */}
        <div className="portada__velo" />
      </div>

      <div className="portada__contenido" ref={contenidoRef}>
        <h1 className="portada__titular">
          <span>Diseñamos tu idea,</span>
          <span className="portada__titular-eco">y lo imprimimos en 3D.</span>
        </h1>

        <div className="portada__pie">
          <p className="portada__bajada">
            Llaveros, soportes y piezas a medida. Todo en PLA, pieza por pieza,
            desde una sola unidad.
          </p>

          <div className="portada__cierre">
            <dl className="portada__datos">
              {DATOS.map((d) => {
                const Icono = ICONOS[d.icono];
                return (
                  <div key={d.etiqueta}>
                    <dt>
                      <Icono size={13} strokeWidth={2.4} aria-hidden="true" />
                      {d.etiqueta}
                    </dt>
                    <dd>{d.valor}</dd>
                  </div>
                );
              })}
            </dl>

            <div className="portada__acciones">
              {/* Abre el formulario de pedido personalizado, no WhatsApp:
                  primero se juntan las respuestas y recién al final se arma
                  el mensaje. */}
              <a className="portada__boton portada__boton--hueco" href="#personalizado">
                <MessageCircle size={15} strokeWidth={2.4} aria-hidden="true" />
                Pedido personalizado
              </a>

              <a className="portada__boton" href="#galeria">
                Ver las piezas
                <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
