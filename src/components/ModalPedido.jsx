import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Minus, Plus, X } from "lucide-react";

import { PALETA, TAMANOS } from "../data/sitio.js";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./ModalPedido.css";

/* Arma el mensaje de WhatsApp con todo lo que eligió el cliente, para que no
   tenga que escribirlo. Es la idea que mejor funcionaba en la referencia. */
function armarMensaje({ producto, color, tamano, cantidad, textoLibre, notas }) {
  const lineas = [
    "Hola, quisiera hacer un pedido:",
    "",
    `• Producto: ${producto.nombre}`,
    `• Color: ${color}`,
    `• Tamaño: ${tamano}`,
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

export default function ModalPedido({ producto, alCerrar }) {
  const [color, setColor] = useState("");
  const [tamano, setTamano] = useState(TAMANOS[1]);
  const [cantidad, setCantidad] = useState(1);
  const [textoLibre, setTextoLibre] = useState("");
  const [notas, setNotas] = useState("");
  const cajaRef = useRef(null);

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
    setColor(colores[0].nombre);
    setTamano(TAMANOS[1]);
    setCantidad(1);
    setTextoLibre("");
    setNotas("");
    cajaRef.current?.focus();
  }, [producto, colores]);

  /* Escape cierra, y mientras está abierto la página de atrás no hace scroll. */
  useEffect(() => {
    if (!producto) return;
    const alTeclear = (e) => e.key === "Escape" && alCerrar();
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
    };
  }, [producto, alCerrar]);

  const enlace = useMemo(() => {
    if (!producto) return "#";
    return linkWhatsApp(
      armarMensaje({ producto, color, tamano, cantidad, textoLibre, notas })
    );
  }, [producto, color, tamano, cantidad, textoLibre, notas]);

  if (!producto) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`Pedir ${producto.nombre}`}>
      <button type="button" className="modal__fondo" aria-label="Cerrar" onClick={alCerrar} />

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
            <legend className="rotulo">Tamaño</legend>
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
                maxLength={10}
                value={textoLibre}
                placeholder="Hasta 10 cubos"
                onChange={(e) => setTextoLibre(e.target.value)}
              />
            </label>
          )}

          <fieldset className="modal__campo">
            <legend className="rotulo">Cantidad</legend>
            <div className="modal__contador">
              <button type="button" onClick={() => setCantidad((n) => Math.max(1, n - 1))} aria-label="Quitar uno">
                <Minus size={16} strokeWidth={2.6} />
              </button>
              <span>{cantidad}</span>
              <button type="button" onClick={() => setCantidad((n) => Math.min(200, n + 1))} aria-label="Sumar uno">
                <Plus size={16} strokeWidth={2.6} />
              </button>
            </div>
          </fieldset>

          <label className="modal__campo">
            <span className="rotulo">Algo más que debamos saber</span>
            <textarea
              rows={2}
              value={notas}
              placeholder="Para cuándo lo necesitás, alguna referencia..."
              onChange={(e) => setNotas(e.target.value)}
            />
          </label>
        </div>

        <div className="modal__pie">
          {/* El precio se muestra por unidad y no se multiplica: el total lo
              confirma el vendedor, porque baja por volumen y por cantidad de letras. */}
          <p className="modal__precio">
            {producto.precio} <span>{producto.unidad}</span>
          </p>
          <a className="boton" href={enlace} target="_blank" rel="noopener noreferrer" onClick={alCerrar}>
            <MessageCircle size={17} strokeWidth={2.4} />
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
