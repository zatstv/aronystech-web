import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Minus, Plus, X } from "lucide-react";

import { PALETA, TAMANOS } from "../data/sitio.js";
import PasoPago from "./PasoPago.jsx";
import "./ModalPedido.css";

/* Arma el mensaje de WhatsApp con todo lo que eligió el cliente, para que no
   tenga que escribirlo. Es la idea que mejor funcionaba en la referencia. */
function armarMensaje({ producto, color, tamano, cantidad, textoLibre, notas }) {
  const lineas = [
    "Hola, quisiera hacer un pedido:",
    "",
    `• Producto: ${producto.nombre}`,
    `• Color: ${color}`,
    `• Tamaño orientativo: ${tamano} (medidas por confirmar)`,
  ];
  if (producto.textoLibre && textoLibre.trim()) {
    lineas.push(`• Texto: ${textoLibre.trim()}`);
  }
  lineas.push(`• Cantidad: ${cantidad}`);
  lineas.push(`• Precio de lista: ${producto.precio} (${producto.unidad})`);
  if (notas.trim()) lineas.push("", `• Detalles: ${notas.trim()}`);
  lineas.push("", "¿Me confirman el total y para cuándo estaría?");
  return lineas.join("\n");
}

/* `inicial` llega cuando el pedido lo armó el asistente del chat: trae el
   color, la cantidad y el texto, y el modal abre directo en el pago. */
export default function ModalPedido({ producto, inicial, alCerrar }) {
  const [pasoPago, setPasoPago] = useState(false);
  const [color, setColor] = useState("");
  const [tamano, setTamano] = useState(TAMANOS[1]);
  const [cantidad, setCantidad] = useState(1);
  const [textoLibre, setTextoLibre] = useState("");
  const [notas, setNotas] = useState("");
  const cajaRef = useRef(null);
  const textoRef = useRef(null);
  const [error, setError] = useState("");

  /* Los colores que ese producto ofrece de verdad. Se calcula antes del
     reinicio porque el color por defecto sale de acá: si arrancara con el
     primero de la paleta, el soporte de celular abriría preseleccionado en
     rojo, que no es uno de sus cuatro colores. */
  const colores = useMemo(() => {
    if (!producto?.colores?.length) return PALETA;
    return PALETA.filter((c) => producto.colores.includes(c.hex));
  }, [producto]);

  /* Cada vez que se abre con otro producto, el formulario vuelve a cero. */
  useEffect(() => {
    if (!producto) return;
    const colorPedido = colores.find((c) => c.nombre === inicial?.color?.toLowerCase());
    setColor(colorPedido ? colorPedido.nombre : (inicial?.color || colores[0].nombre));
    setTamano(TAMANOS[1]);
    setCantidad(inicial?.cantidad || 1);
    setTextoLibre(inicial?.texto || "");
    setNotas("");
    setError("");
    setPasoPago(Boolean(inicial));
  }, [producto, colores, inicial]);

  /* Escape cierra, y mientras está abierto la página de atrás no hace scroll. */
  useEffect(() => {
    if (!producto) return;
    const anterior = document.activeElement;
    const fondo = document.querySelector(".contenido");
    const inertPrevio = fondo?.inert;
    if (fondo) fondo.inert = true;
    cajaRef.current?.focus();
    const alTeclear = (e) => {
      if (e.key === "Escape") { e.preventDefault(); alCerrar(); }
      if (e.key !== "Tab") return;
      const elementos = [...cajaRef.current.querySelectorAll('button:not(:disabled), a[href], input, textarea')].filter((el) => el.getClientRects().length);
      const primero = elementos[0], ultimo = elementos.at(-1);
      if (e.shiftKey && (document.activeElement === primero || document.activeElement === cajaRef.current)) { e.preventDefault(); ultimo?.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero?.focus(); }
    };
    document.addEventListener("keydown", alTeclear);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    /* La barra de arriba usa backdrop-filter, que se compone aparte y no se
       oscurece con el velo: se veía encendida sobre un modal abierto. */
    document.documentElement.dataset.modalAbierto = "si";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = previo;
      delete document.documentElement.dataset.modalAbierto;
      if (fondo) fondo.inert = inertPrevio;
      if (anterior?.isConnected) anterior.focus();
    };
  }, [producto, alCerrar]);

  const mensaje = useMemo(() => producto ? armarMensaje({ producto, color, tamano, cantidad, textoLibre, notas }) : "", [producto, color, tamano, cantidad, textoLibre, notas]);
  useEffect(() => {
    if (!producto) return;
    cajaRef.current?.scrollTo({ top: 0, behavior: "instant" });
    cajaRef.current?.focus();
  }, [pasoPago, producto]);

  if (!producto) return null;

  /* Lo que se eligió, en líneas cortas para la factura. */
  const lineas = [
    `Color: ${color}`,
    `Tamaño: ${tamano}`,
    ...(producto.textoLibre && textoLibre.trim() ? [`Texto: ${textoLibre.trim()}`] : []),
  ];

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`Pedir ${producto.nombre}`}>
      <button type="button" className="modal__fondo" aria-label="Cerrar" tabIndex={-1} onClick={alCerrar} />

      <div className="modal__caja" ref={cajaRef} tabIndex={-1}>
        <div className="modal__cabeza">
          <div>
            <p className="rotulo">Tu pedido</p>
            <h2 className="modal__titulo">{producto.nombre}</h2>
          </div>
          <button type="button" className="modal__cerrar" onClick={alCerrar} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {pasoPago ? <PasoPago mensaje={mensaje} producto={producto} cantidad={cantidad} lineas={lineas} alVolver={() => setPasoPago(false)} /> : <>
        <div className="modal__cuerpo">
          <fieldset className="modal__campo">
            <legend className="rotulo">Color</legend>
            <div className="modal__colores">
              {colores.map((c) => (
                <button
                  key={c.nombre}
                  type="button"
                  className={`modal__color ${color === c.nombre ? "esta-activo" : ""}`}
                  style={{ background: c.hex }}
                  aria-label={c.nombre}
                  aria-pressed={color === c.nombre}
                  onClick={() => setColor(c.nombre)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="modal__campo">
            <legend className="rotulo">Tamaño orientativo</legend>
            <p className="modal__ayuda">Confirmamos las medidas y el precio final por WhatsApp. Si necesitas una medida exacta, escríbela en las notas.</p>
            <div className="modal__opciones">
              {TAMANOS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`modal__opcion ${tamano === t ? "esta-activo" : ""}`}
                  aria-pressed={tamano === t}
                  onClick={() => setTamano(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          {producto.textoLibre && (
            <label className="modal__campo">
              <span className="rotulo">Qué dice</span>
              <input
                type="text"
                ref={textoRef}
                name="personalizacion"
                autoComplete="off"
                aria-invalid={Boolean(error)}
                aria-describedby="pedido-texto-ayuda pedido-texto-error"
                maxLength={10}
                value={textoLibre}
                placeholder="Hasta 10 cubos"
                onChange={(e) => { setTextoLibre(e.target.value); setError(""); }}
              />
              <span id="pedido-texto-ayuda" className="modal__ayuda">Escribe de 1 a 10 caracteres.</span>
              <span id="pedido-texto-error" className="modal__error" role="alert">{error}</span>
            </label>
          )}

          <fieldset className="modal__campo">
            <legend className="rotulo">Cantidad</legend>
            <div className="modal__contador">
              <button type="button" onClick={() => setCantidad((n) => Math.max(1, n - 1))} disabled={cantidad === 1} aria-label="Quitar uno">
                <Minus size={16} strokeWidth={2.6} />
              </button>
              <span>{cantidad}</span>
              <button type="button" onClick={() => setCantidad((n) => Math.min(200, n + 1))} disabled={cantidad === 200} aria-label="Sumar uno">
                <Plus size={16} strokeWidth={2.6} />
              </button>
            </div>
          </fieldset>

          <label className="modal__campo">
            <span className="rotulo">Algo más que debamos saber</span>
            <textarea
              rows={2}
              value={notas}
              placeholder="Para cuándo lo necesitas, alguna referencia..."
              onChange={(e) => setNotas(e.target.value)}
            />
          </label>
        </div>

        <section className="modal__resumen" aria-label="Resumen del pedido">
          <h3>Revisa tu pedido</h3>
          <p>{producto.nombre} · {cantidad} {cantidad === 1 ? "unidad" : "unidades"}</p>
          <p>Color: {color} · Tamaño orientativo: {tamano}</p>
          {producto.textoLibre && <p>Texto: {textoLibre.trim() || "Pendiente de completar"}</p>}
          {notas.trim() && <p>Notas: {notas.trim()}</p>}
          <p className="modal__ayuda">El total y las medidas se confirman antes de encargar.</p>
        </section>
        <div className="modal__pie">
          {/* El precio se muestra por unidad y no se multiplica: el total lo
              confirma el vendedor, porque baja por volumen y por cantidad de letras. */}
          <p className="modal__precio">
            {producto.precio} <span>{producto.unidad}</span>
          </p>
          <button type="button" className="boton" onClick={(e) => {
            if (producto.textoLibre && !textoLibre.trim()) {
              e.preventDefault();
              setError("Escribe el nombre o texto que quieres en los cubos.");
              textoRef.current?.focus();
              return;
            }
            setPasoPago(true);
          }}>
            <MessageCircle size={17} strokeWidth={2.4} />
            Elegir método de pago
          </button>
        </div>
        </>}
      </div>
    </div>
  );
}
