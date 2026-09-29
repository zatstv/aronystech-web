import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { GALERIA } from "../data/sitio.js";
import { gsap, pideQuietud } from "../lib/movimiento.js";
import "./Galeria.css";

/* ============================================================
   Galería en mosaico: las fotos van en filas del mismo alto y cada una se
   estira lo que haga falta para que la fila llene el ancho. Las verticales
   quedan angostas y las horizontales anchas, sin recortar de más.

   Basado en "Adaptive photo layout with flexbox" (CSS-Tricks). Los
   polyfills del original (lazysizes, object-fit-images) ya no hacen falta:
   todos los navegadores de hoy traen loading="lazy" y object-fit.

   Tocar una foto la abre en grande en el visor, que sale desde el lugar
   que la foto ocupa en el mosaico y vuelve ahí al cerrarse.
   ============================================================ */

function Foto({ foto, indice, alAbrir, miniRef }) {
  /* Cada foto aparece recién cuando terminó de bajar, en vez de pintarse
     a pedazos. */
  const [cargada, setCargada] = useState(false);
  return (
    <li>
      <button
        type="button"
        className="galeria__abrir"
        ref={miniRef}
        onClick={() => alAbrir(indice)}
      >
        <img
          src={`/${foto.src}`}
          alt={foto.alt}
          loading="lazy"
          decoding="async"
          className={cargada ? "esta-cargada" : ""}
          onLoad={() => setCargada(true)}
        />
      </button>
    </li>
  );
}

/* Las fotos entran fila por fila a medida que se baja, no todas juntas al
   asomar la galería: es larga, y para cuando se llegara al final ya habrían
   terminado de entrar hace rato.

   Cada foto se descubre de abajo hacia arriba mientras la imagen se aleja
   un poco adentro del marco, la misma entrada que la foto de la ficha de
   producto.

   Un observador por foto, y las que avisan en la misma tanda —las de una
   misma fila, o todas las de arriba si se entró directo a un ancla— entran
   escalonadas entre ellas. Como en useEntradaEscalonada, se esconden desde
   el JS, así que sin JS la galería se ve igual. */
function useEntradaPorFilas() {
  const ref = useRef(null);

  useEffect(() => {
    const lista = ref.current;
    if (!lista || pideQuietud() || !("IntersectionObserver" in window)) return;

    const fotos = [...lista.children];
    const imagen = (li) => li.querySelector("img");
    const ctx = gsap.context(() => {
      gsap.set(fotos, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(fotos.map(imagen), { scale: 1.2 });
    }, lista);

    const obs = new IntersectionObserver(
      (entradas) => {
        const llegan = entradas.filter((e) => e.isIntersecting).map((e) => e.target);
        if (!llegan.length) return;
        llegan.forEach((f) => obs.unobserve(f));
        ctx.add(() => {
          gsap.to(llegan, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            ease: "power4.inOut",
            stagger: 0.08,
            clearProps: "clipPath",
          });
          /* Al terminar se borra el transform: si quedara escrito en línea,
             le ganaría al acercamiento del :hover del CSS. */
          gsap.to(llegan.map(imagen), {
            scale: 1,
            duration: 1.3,
            ease: "power3.out",
            stagger: 0.08,
            clearProps: "transform",
          });
        });
      },
      /* El mismo margen de arriba que en useEntradaEscalonada: lo que ya
         quedó atrás cuenta como visto, para que un salto del menú no deje
         huecos en blanco. */
      { rootMargin: "99999px 0px -10% 0px" }
    );

    fotos.forEach((f) => obs.observe(f));
    return () => {
      obs.disconnect();
      ctx.revert();
    };
  }, []);

  return ref;
}

/* Dónde y cómo hay que poner la foto grande para que calce justo encima de
   su miniatura. Es la mitad de la animación "FLIP": se mide dónde termina,
   se la lleva a donde empieza y se la deja volver.

   La miniatura está recortada (object-fit: cover) y la grande no, así que
   no alcanza con escalar: la grande se agranda hasta cubrir la miniatura y
   se le recorta lo que sobra con clip-path. El recorte va en los píxeles
   de la foto grande sin escalar, porque clip-path se aplica antes que la
   escala. */
function sobreMiniatura(grande, mini) {
  const a = mini.getBoundingClientRect();
  const b = grande.getBoundingClientRect();
  const escala = Math.max(a.width / b.width, a.height / b.height);
  const sobraX = (b.width - a.width / escala) / 2;
  const sobraY = (b.height - a.height / escala) / 2;
  return {
    x: a.left + a.width / 2 - (b.left + b.width / 2),
    y: a.top + a.height / 2 - (b.top + b.height / 2),
    scale: escala,
    clipPath: `inset(${sobraY}px ${sobraX}px ${sobraY}px ${sobraX}px)`,
  };
}

function aLaVista(el) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

const ENTERA = { x: 0, y: 0, scale: 1, clipPath: "inset(0px 0px 0px 0px)" };

/* ============================================================
   El visor. Es un <dialog> nativo abierto con showModal(), como el pedido
   personalizado: el resto de la página queda inerte, el foco no se escapa
   y Escape llega como evento "cancel", que acá se intercepta para cerrar
   con la animación en vez de golpe.
   ============================================================ */
function Visor({ indice, miniaturas, alCambiar, alCerrar }) {
  const dialogoRef = useRef(null);
  const fondoRef = useRef(null);
  const fotoRef = useRef(null);
  const controlesRef = useRef(null);
  /* Hacia dónde se movió la última vez, para que la foto nueva entre del
     lado correcto. */
  const sentido = useRef(0);
  const cerrando = useRef(false);
  const abierto = indice !== null;
  const foto = abierto ? GALERIA[indice] : null;
  const mini = abierto ? miniaturas.current[indice] : null;
  const miniImg = mini?.querySelector("img");

  /* Abrir: la foto sale de su miniatura y crece hasta el centro. */
  useLayoutEffect(() => {
    const dialogo = dialogoRef.current;
    if (!abierto || !dialogo || dialogo.open) return;

    cerrando.current = false;
    dialogo.showModal();
    /* A mano: el navegador elige el primer botón que encuentra, y el que
       conviene es el de cerrar, que es el que se busca con Tab. */
    dialogo.querySelector(".visor__cerrar")?.focus();
    if (pideQuietud()) return;

    const grande = fotoRef.current;
    gsap.set(grande, { autoAlpha: 0 });
    const lista = grande.complete ? Promise.resolve() : grande.decode().catch(() => {});
    lista.then(() => {
      gsap
        .timeline()
        .fromTo(fondoRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" })
        .fromTo(
          grande,
          { ...sobreMiniatura(grande, mini), autoAlpha: 1 },
          { ...ENTERA, duration: 0.65, ease: "power3.inOut", clearProps: "transform,clipPath" },
          0
        )
        .fromTo(
          controlesRef.current.children,
          /* Solo opacidad, no autoAlpha: visibility:hidden le saca el foco
             al botón de cerrar, y sin foco adentro del visor las flechas
             del teclado dejan de llegar. */
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, clearProps: "opacity,transform" },
          0.35
        );
    });
    /* Solo al abrir: el cambio de foto con el visor abierto lo resuelve el
       efecto de abajo. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);

  /* Pasar a otra foto con el visor abierto: la nueva entra del costado. */
  const primera = useRef(true);
  useLayoutEffect(() => {
    if (!abierto) {
      primera.current = true;
      return;
    }
    if (primera.current) {
      primera.current = false;
      return;
    }
    if (pideQuietud()) return;
    gsap.fromTo(
      fotoRef.current,
      { autoAlpha: 0, x: sentido.current * 60 },
      { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out", clearProps: "transform" }
    );
  }, [indice, abierto]);

  const mover = useCallback(
    (paso) => {
      sentido.current = paso;
      alCambiar((indice + paso + GALERIA.length) % GALERIA.length);
    },
    [indice, alCambiar]
  );

  /* Cerrar: la foto vuelve a su lugar en el mosaico. Si con las flechas se
     llegó a una foto que quedó fuera de la pantalla, no hay a dónde volver
     a la vista, y se desvanece en el lugar. */
  const cerrar = useCallback(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo || cerrando.current) return;
    cerrando.current = true;

    const terminar = () => {
      dialogo.close();
      alCerrar();
      /* El foco vuelve a la miniatura de la foto que se estaba mirando, que
         no siempre es la que se tocó para abrir. */
      mini?.focus({ preventScroll: true });
    };
    if (pideQuietud()) return terminar();

    const grande = fotoRef.current;
    gsap.killTweensOf([grande, fondoRef.current]);
    const tl = gsap.timeline({ onComplete: terminar });
    tl.to(controlesRef.current.children, { opacity: 0, duration: 0.15 }, 0);
    tl.to(fondoRef.current, { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, 0.05);
    if (mini && aLaVista(mini)) {
      tl.to(grande, { ...sobreMiniatura(grande, mini), duration: 0.55, ease: "power3.inOut" }, 0);
    } else {
      tl.to(grande, { autoAlpha: 0, scale: 0.92, duration: 0.35, ease: "power2.in" }, 0);
    }
  }, [alCerrar, mini]);

  const alTeclear = (e) => {
    if (e.key === "ArrowRight") mover(1);
    else if (e.key === "ArrowLeft") mover(-1);
  };

  /* En celular se pasa de foto deslizando el dedo. */
  const toque = useRef(null);
  const alApoyar = (e) => {
    toque.current = e.clientX;
  };
  const alSoltar = (e) => {
    if (toque.current === null) return;
    const dx = e.clientX - toque.current;
    toque.current = null;
    if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
  };

  return (
    <dialog
      className="visor"
      ref={dialogoRef}
      aria-label="Foto ampliada"
      onCancel={(e) => {
        e.preventDefault();
        cerrar();
      }}
      onKeyDown={alTeclear}
    >
      {/* Tocar fuera de la foto cierra, como en cualquier visor. */}
      <div className="visor__fondo" ref={fondoRef} onClick={cerrar} />

      {foto && (
        /* El marco deja pasar los toques (pointer-events: none) para que
           tocar al lado de la foto llegue al fondo y cierre. */
        <figure className="visor__marco">
          {/* El alto y ancho salen de la miniatura, que ya está cargada:
              así la foto grande ocupa su lugar desde el primer cuadro y se
              puede medir antes de terminar de decodificarse. */}
          <img
            ref={fotoRef}
            src={`/${foto.src}`}
            alt={foto.alt}
            width={miniImg?.naturalWidth || undefined}
            height={miniImg?.naturalHeight || undefined}
            draggable={false}
            onPointerDown={alApoyar}
            onPointerUp={alSoltar}
          />
        </figure>
      )}

      <div className="visor__controles" ref={controlesRef}>
        <p className="visor__cuenta" aria-live="polite">
          {abierto && `${indice + 1} / ${GALERIA.length}`}
        </p>
        <button type="button" className="visor__boton visor__cerrar" onClick={cerrar} aria-label="Cerrar">
          <X size={20} strokeWidth={2.4} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="visor__boton visor__flecha visor__flecha--atras"
          onClick={() => mover(-1)}
          aria-label="Foto anterior"
        >
          <ChevronLeft size={22} strokeWidth={2.4} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="visor__boton visor__flecha visor__flecha--adelante"
          onClick={() => mover(1)}
          aria-label="Foto siguiente"
        >
          <ChevronRight size={22} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
    </dialog>
  );
}

export default function Galeria() {
  const mosaicoRef = useEntradaPorFilas();
  const miniaturas = useRef([]);
  const [abierta, setAbierta] = useState(null);
  const cerrar = useCallback(() => setAbierta(null), []);

  return (
    <section className="galeria" id="galeria" aria-label="Galería de piezas impresas">
      <ul className="galeria__mosaico" ref={mosaicoRef}>
        {GALERIA.map((foto, i) => (
          <Foto
            key={foto.src}
            foto={foto}
            indice={i}
            alAbrir={setAbierta}
            miniRef={(el) => (miniaturas.current[i] = el)}
          />
        ))}
      </ul>

      <Visor indice={abierta} miniaturas={miniaturas} alCambiar={setAbierta} alCerrar={cerrar} />
    </section>
  );
}
