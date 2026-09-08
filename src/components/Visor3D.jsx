import { useEffect, useRef, useState } from "react";

/* El script de model-viewer pesa cerca de 1 MB: se pide una sola vez
   y lo comparten el hero y la sección del proceso. */
const URL_SCRIPT =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js";

let scriptPedido = false;

function pedirScript(alFallar) {
  if (scriptPedido) return;
  scriptPedido = true;
  const sc = document.createElement("script");
  sc.type = "module";
  sc.src = URL_SCRIPT;
  sc.onerror = alFallar;
  document.head.appendChild(sc);
}

/* Espera al momento indicado antes de montar el visor:
   - "load": cuando la página terminó de cargar (el hero, para no pelear con el LCP)
   - "visible": cuando la sección se acerca en el scroll */
function useMomento(cuando, caja) {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (cuando === "load") {
      if (document.readyState === "complete") {
        setListo(true);
        return;
      }
      const alCargar = () => setListo(true);
      window.addEventListener("load", alCargar);
      return () => window.removeEventListener("load", alCargar);
    }

    const el = caja.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setListo(true);
      return;
    }
    const visto = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0].isIntersecting) return;
        visto.disconnect();
        setListo(true);
      },
      { rootMargin: "500px 0px" }
    );
    visto.observe(el);
    return () => visto.disconnect();
  }, [cuando, caja]);

  return listo;
}

export default function Visor3D({
  src,
  alt,
  orbit,
  minOrbit = "auto 25deg 4%",
  maxOrbit = "auto 100deg auto",
  fov,
  sinGiro = false,
  cuando = "visible",
  onCargado,
  /* El hero usa el propio <h1> como caja del visor, con el render de
     respaldo adentro; el de la sección del proceso usa un <div> vacío. */
  as: Caja = "div",
  className = "visor-caja",
  mostrarCarga = true,
  children,
}) {
  const caja = useRef(null);
  const [estado, setEstado] = useState("esperando"); // esperando | cargando | listo | error
  const listo = useMomento(cuando, caja);

  useEffect(() => {
    if (!listo || !caja.current) return;

    setEstado("cargando");
    pedirScript(() => setEstado("error"));

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mv = document.createElement("model-viewer");

    mv.setAttribute("src", src);
    mv.setAttribute("alt", alt);
    mv.setAttribute("camera-controls", "");
    mv.setAttribute("camera-orbit", orbit);
    mv.setAttribute("min-camera-orbit", minOrbit);
    mv.setAttribute("max-camera-orbit", maxOrbit);
    if (fov) {
      mv.setAttribute("field-of-view", fov);
      mv.setAttribute("min-field-of-view", fov);
      mv.setAttribute("max-field-of-view", fov);
    }
    mv.setAttribute("interaction-prompt", "none");
    mv.setAttribute("shadow-intensity", "0.9");
    mv.setAttribute("shadow-softness", "0.8");
    mv.setAttribute("exposure", "1.7");
    mv.setAttribute("tone-mapping", "neutral");
    mv.setAttribute("environment-image", "neutral");
    // sin esto el modelo se traga el scroll vertical en celular
    mv.setAttribute("touch-action", "pan-y");
    // el hero gira solo delante de los ojos: si pidieron menos movimiento, se queda quieto
    if (!quieto && !sinGiro) {
      mv.setAttribute("auto-rotate", "");
      mv.setAttribute("auto-rotate-delay", "900");
      mv.setAttribute("rotation-per-second", "14deg");
    }

    const alCargar = () => {
      setEstado("listo");
      if (onCargado) onCargado();
    };
    mv.addEventListener("load", alCargar);

    const contenedor = caja.current;
    contenedor.appendChild(mv);

    return () => {
      mv.removeEventListener("load", alCargar);
      mv.remove();
    };
    // onCargado se deja fuera a propósito: solo interesa armar el visor una vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo, src, alt, orbit, minOrbit, maxOrbit, fov, sinGiro]);

  return (
    <Caja className={className} ref={caja}>
      {children}
      {mostrarCarga && estado !== "listo" && (
        <div className="visor-carga">
          {estado === "error" ? "No se pudo cargar el visor" : "Cargando el modelo"}
        </div>
      )}
    </Caja>
  );
}
