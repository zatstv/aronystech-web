import { useCallback, useEffect, useRef } from "react";

import "./FondoCuadricula.css";

/* ============================================================
   Cuadrícula de fondo. Se deforma hacia el cursor y suelta una onda
   al hacer clic. Portada del componente "kinetic grid" a JSX.

   Tres diferencias con el original, todas a propósito:

   1. No pinta fondo. El original rellenaba de #161618 y dibujaba en azul
      neón. Acá el lienzo queda transparente y los colores salen de los
      tokens de global.css, así que la cuadrícula se lee como una cama de
      impresión sobre el papel y acompaña sola al modo oscuro.
   2. Se detiene sola. El original dejaba un requestAnimationFrame corriendo
      para siempre. Acá el bucle para cuando el cursor se quedó quieto y no
      hay ondas vivas, y arranca de nuevo al moverse. En reposo no consume.
   3. En pantallas táctiles y con prefers-reduced-motion se dibuja una sola
      vez, sin bucle: se ve la textura y no gasta batería.
   ============================================================ */

const LADO = 58;          // separación de la retícula, en píxeles de CSS
const RADIO_INFLUENCIA = 260;
const DEFORMACION_MAX = 24;
const SUAVIZADO = 0.08;   // cuánto persigue el cursor real al puntero
const ANCHO_ONDA = 55;

const NODO_R = 1.6;
const NODO_R_ACTIVO = 3.2;

function entre(a, b, t) {
  return a + (b - a) * t;
}

/* Los colores salen de las variables CSS, no están escritos acá: así el
   modo oscuro y cualquier cambio de acento se propagan solos. */
function leerColores() {
  const css = getComputedStyle(document.documentElement);
  const rgb = (nombre, respaldo) => {
    const v = css.getPropertyValue(nombre).trim() || respaldo;
    const h = v.replace("#", "");
    const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  };
  return { tinta: rgb("--tinta", "#22252A"), acento: rgb("--acento", "#E5402B") };
}

function rgba([r, g, b], a) {
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

function mezcla(base, activo, t, aBase, aActivo) {
  const c = [0, 1, 2].map((i) => Math.round(entre(base[i], activo[i], t)));
  return rgba(c, entre(aBase, aActivo, t));
}

export default function FondoCuadricula() {
  const lienzoRef = useRef(null);
  const cursor = useRef({ x: -9999, y: -9999 });
  const destino = useRef({ x: -9999, y: -9999 });
  const ondas = useRef([]);
  const cuadro = useRef(0);
  const corriendo = useRef(false);
  const medida = useRef({ w: 0, h: 0 });
  const colores = useRef(leerColores());

  /* Dónde termina un punto de la retícula después de la deformación. */
  const deformar = useCallback((gx, gy, col, fila, cols, filas) => {
    // Los bordes quedan clavados, si no la cuadrícula se despega de la pantalla.
    const margen = 1.5;
    const fCol = Math.min(col / margen, (cols - 1 - col) / margen, 1);
    const fFila = Math.min(fila / margen, (filas - 1 - fila) / margen, 1);
    const clavado = fCol * fCol * fFila * fFila;

    const m = cursor.current;
    const dx = gx - m.x;
    const dy = gy - m.y;
    const dist = Math.hypot(dx, dy);
    const cercania = Math.max(0, 1 - dist / RADIO_INFLUENCIA) * clavado;

    let ox = 0;
    let oy = 0;
    for (const o of ondas.current) {
      const odx = gx - o.x;
      const ody = gy - o.y;
      const odist = Math.hypot(odx, ody);
      const dif = odist - o.radio;
      if (Math.abs(dif) < ANCHO_ONDA) {
        const fuerza = (1 - Math.abs(dif) / ANCHO_ONDA) * o.opacidad * 18 * clavado;
        const ang = Math.atan2(ody, odx);
        const signo = dif < 0 ? 1 : -1;
        ox += Math.cos(ang) * fuerza * signo;
        oy += Math.sin(ang) * fuerza * signo;
      }
    }

    if (dist < RADIO_INFLUENCIA && dist > 0 && clavado > 0) {
      const t = dist / RADIO_INFLUENCIA;
      // Se atenúa muy cerca del cursor para que el nodo no salte de golpe.
      const suave = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
      const cuanto = suave * DEFORMACION_MAX * clavado;
      const ang = Math.atan2(dy, dx);
      return {
        x: gx - Math.cos(ang) * cuanto + ox,
        y: gy - Math.sin(ang) * cuanto + oy,
        cercania,
      };
    }

    return { x: gx + ox, y: gy + oy, cercania };
  }, []);

  const dibujar = useCallback(
    (ahora) => {
      const lienzo = lienzoRef.current;
      const ctx = lienzo?.getContext("2d");
      if (!ctx) return;

      const { w: W, h: H } = medida.current;
      const { tinta, acento } = colores.current;

      ctx.clearRect(0, 0, W, H);

      for (let i = ondas.current.length - 1; i >= 0; i--) {
        const o = ondas.current[i];
        const edad = (ahora - o.nacio) / 1000;
        o.radio = Math.max(0, edad * 400);
        o.opacidad = Math.max(0, 1 - edad * 1.2);
        if (o.opacidad <= 0) ondas.current.splice(i, 1);
      }

      const cols = Math.max(2, Math.ceil(W / LADO)) + 1;
      const filas = Math.max(2, Math.ceil(H / LADO)) + 1;
      const anchoCelda = W / (cols - 1);
      const altoCelda = H / (filas - 1);

      const p = [];
      for (let fila = 0; fila < filas; fila++) {
        p[fila] = [];
        for (let col = 0; col < cols; col++) {
          p[fila][col] = deformar(col * anchoCelda, fila * altoCelda, col, fila, cols, filas);
        }
      }

      const segmento = (a, b) => {
        const media = (a.cercania + b.cercania) / 2;
        const t = media * media * (3 - 2 * media);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = mezcla(tinta, acento, t, 0.07, 0.5);
        ctx.lineWidth = entre(0.8, 1.4, t);
        ctx.stroke();
      };

      for (let fila = 0; fila < filas; fila++)
        for (let col = 0; col < cols - 1; col++) segmento(p[fila][col], p[fila][col + 1]);

      for (let col = 0; col < cols; col++)
        for (let fila = 0; fila < filas - 1; fila++) segmento(p[fila][col], p[fila + 1][col]);

      for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < cols; col++) {
          const n = p[fila][col];
          const t = n.cercania * n.cercania * (3 - 2 * n.cercania);
          const r = entre(NODO_R, NODO_R_ACTIVO, t);
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = mezcla(tinta, acento, t, 0.13, 0.95);
          ctx.fill();
        }
      }

      for (const o of ondas.current) {
        ctx.beginPath();
        ctx.arc(o.x, o.y, Math.max(0, o.radio), 0, Math.PI * 2);
        ctx.strokeStyle = rgba(acento, o.opacidad * 0.3);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    },
    [deformar]
  );

  useEffect(() => {
    const lienzo = lienzoRef.current;
    if (!lienzo) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    const conCursor = window.matchMedia("(hover: hover) and (pointer: fine)");
    const oscuro = window.matchMedia("(prefers-color-scheme: dark)");
    const estatico = () => quieto.matches || !conCursor.matches;

    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Sin esto la cuadrícula se ve borrosa en pantallas retina.
      lienzo.width = Math.round(w * dpr);
      lienzo.height = Math.round(h * dpr);
      lienzo.style.width = `${w}px`;
      lienzo.style.height = `${h}px`;
      lienzo.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
      medida.current = { w, h };
      dibujar(performance.now());
    };

    /* El bucle se apaga cuando el cursor llegó a destino y no quedan ondas.
       Así en reposo no se gasta un solo cuadro. */
    const paso = (ahora) => {
      const c = cursor.current;
      const d = destino.current;
      c.x = entre(c.x, d.x, SUAVIZADO);
      c.y = entre(c.y, d.y, SUAVIZADO);
      dibujar(ahora);

      const llegó = Math.abs(c.x - d.x) < 0.4 && Math.abs(c.y - d.y) < 0.4;
      if (llegó && ondas.current.length === 0) {
        corriendo.current = false;
        return;
      }
      cuadro.current = requestAnimationFrame(paso);
    };

    const arrancar = () => {
      if (corriendo.current || estatico() || document.hidden) return;
      corriendo.current = true;
      cuadro.current = requestAnimationFrame(paso);
    };

    const alMover = (e) => {
      destino.current = { x: e.clientX, y: e.clientY };
      arrancar();
    };

    const alSalir = () => {
      destino.current = { x: -9999, y: -9999 };
      arrancar();
    };

    const alTocar = (e) => {
      ondas.current.push({
        x: e.clientX, y: e.clientY, radio: 0, opacidad: 1, nacio: performance.now(),
      });
      arrancar();
    };

    const alCambiarTema = () => {
      colores.current = leerColores();
      dibujar(performance.now());
    };

    const alOcultar = () => {
      if (document.hidden) {
        cancelAnimationFrame(cuadro.current);
        corriendo.current = false;
      } else arrancar();
    };

    medir();
    window.addEventListener("resize", medir);
    oscuro.addEventListener("change", alCambiarTema);
    document.addEventListener("visibilitychange", alOcultar);

    if (!estatico()) {
      window.addEventListener("mousemove", alMover, { passive: true });
      window.addEventListener("mouseout", alSalir);
      window.addEventListener("click", alTocar);
    }

    return () => {
      cancelAnimationFrame(cuadro.current);
      corriendo.current = false;
      window.removeEventListener("resize", medir);
      oscuro.removeEventListener("change", alCambiarTema);
      document.removeEventListener("visibilitychange", alOcultar);
      window.removeEventListener("mousemove", alMover);
      window.removeEventListener("mouseout", alSalir);
      window.removeEventListener("click", alTocar);
    };
  }, [dibujar]);

  return <canvas ref={lienzoRef} className="cuadricula" aria-hidden="true" />;
}
