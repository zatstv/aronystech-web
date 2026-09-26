import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Copy, MessageCircle, Paperclip, X } from "lucide-react";

import { CANTIDADES, MAYOREO, OCASIONES, PALETA, REFERENCIAS, TEL_BONITO, TIPOS_ENCARGO } from "../data/sitio.js";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./PedidoPersonalizado.css";

/* ============================================================
   Pedido personalizado: lo que no está en la galería.

   Es un cuestionario corto que termina en un mensaje de WhatsApp ya
   escrito. Casi todo se contesta tocando opciones y no escribiendo: el
   cliente decide en segundos, y a nosotros nos llega la consulta ordenada,
   con lo necesario para cotizar sin diez mensajes de ida y vuelta.

   Se abre desde cualquier enlace a #personalizado (la portada, la barra
   lateral, el pie). Con #personalizado/<tipo> llega con el tipo ya elegido:
   los ids están en TIPOS_ENCARGO.

   Lo que se va escribiendo queda guardado en el navegador. Si alguien cierra
   sin querer o vuelve mañana, encuentra su consulta como la dejó.
   ============================================================ */

const ANCLA = "#personalizado";
const GUARDADO = "aronys-pedido-personalizado";

const INICIAL = {
  tipo: "",
  descripcion: "",
  ocasion: "",
  cantidad: "1",
  colores: [],
  medidas: "",
  intemperie: false,
  referencia: "",
  enlace: "",
  fecha: "",
  entrega: "",
  zona: "",
  nombre: "",
  notas: "",
};

/* El guardado es una comodidad, no algo de lo que dependa el formulario: en
   una ventana privada o con el almacenamiento bloqueado, leer o escribir
   revienta, y en ese caso simplemente se arranca de cero. */
function leerBorrador() {
  try {
    const guardado = JSON.parse(localStorage.getItem(GUARDADO));
    return guardado ? { ...INICIAL, ...guardado } : INICIAL;
  } catch {
    return INICIAL;
  }
}

function guardarBorrador(datos) {
  try {
    localStorage.setItem(GUARDADO, JSON.stringify(datos));
  } catch {
    /* Sin guardado: el formulario sigue funcionando igual. */
  }
}

function borrarBorrador() {
  try {
    localStorage.removeItem(GUARDADO);
  } catch {
    /* Nada que borrar. */
  }
}

/* Hoy en formato AAAA-MM-DD y en la hora de acá, que es lo que pide el
   `min` del campo de fecha. toISOString() daría la fecha de Greenwich, que
   de noche en Panamá ya es mañana. */
function hoy() {
  const d = new Date();
  const dos = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

/* "2026-10-15" → "jueves 15 de octubre". Se arma la fecha a mano en la hora
   local por lo mismo de arriba: new Date("2026-10-15") la toma como UTC y
   en Panamá la muestra un día antes. */
function fechaLegible(valor) {
  const [a, m, d] = valor.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-PA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/* Lee el tipo que viene en el ancla, si hay uno válido. */
function tipoDelAncla(hash) {
  const id = hash.slice(ANCLA.length + 1);
  return TIPOS_ENCARGO.some((t) => t.id === id) ? id : "";
}

function armarMensaje(datos) {
  const tipo = TIPOS_ENCARGO.find((t) => t.id === datos.tipo);
  const referencia = REFERENCIAS.find((r) => r.id === datos.referencia);
  const cantidad = Number(datos.cantidad) || 1;

  const colores = datos.colores.length
    ? datos.colores.join(", ")
    : "Que ustedes me recomienden";

  const entrega =
    datos.entrega === "retiro"
      ? "Paso a retirarlo"
      : datos.entrega === "envio"
        ? `Envío${datos.zona.trim() ? ` a ${datos.zona.trim()}` : ""}`
        : "Por coordinar";

  const lineas = [
    "Hola, quisiera cotizar un pedido personalizado.",
    ...(datos.nombre.trim() ? [`Soy ${datos.nombre.trim()}.`] : []),
    "",
    `• Tipo: ${tipo?.nombre ?? "Por definir"}`,
    `• Qué quiero: ${datos.descripcion.trim()}`,
    ...(datos.ocasion ? [`• Ocasión: ${datos.ocasion}`] : []),
    `• Cantidad: ${cantidad} ${cantidad === 1 ? "unidad" : "unidades"}`,
    `• Colores: ${colores}`,
    `• Medidas aproximadas: ${datos.medidas.trim() || "Necesito que me asesoren"}`,
    ...(datos.intemperie ? ["• Va a estar al sol o a la intemperie"] : []),
    `• Referencia: ${referencia?.nombre ?? "Solo la idea"}${
      referencia && referencia.id !== "nada" ? " (la adjunto en este chat)" : ""
    }`,
    ...(datos.enlace.trim() ? [`• Enlace: ${datos.enlace.trim()}`] : []),
    `• Para cuándo: ${datos.fecha ? fechaLegible(datos.fecha) : "Sin apuro"}`,
    `• Entrega: ${entrega}`,
    ...(datos.notas.trim() ? [`• Otros detalles: ${datos.notas.trim()}`] : []),
    "",
    "¿Me confirman si se puede hacer, el precio y el plazo?",
  ];
  return lineas.join("\n");
}

/* --- Una opción para tocar. Por dentro es un radio o una casilla de
       verdad: el teclado, el lector de pantalla y la validación del
       navegador funcionan sin escribir nada extra. --- */
function Chip({ tipo = "radio", nombre, valor, marcado, alCambiar, requerido, children }) {
  return (
    <label className="chip">
      <input
        type={tipo}
        name={nombre}
        value={valor}
        checked={marcado}
        required={requerido}
        onChange={alCambiar}
      />
      {children}
    </label>
  );
}

export default function PedidoPersonalizado() {
  const dialogoRef = useRef(null);
  const tituloRef = useRef(null);
  const [datos, setDatos] = useState(leerBorrador);
  /* "formulario" → "resumen" → "enviado" */
  const [paso, setPaso] = useState("formulario");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => guardarBorrador(datos), [datos]);

  /* Se abre con el ancla. Apenas abre, el ancla se borra de la dirección:
     si quedara puesta, volver a tocar el mismo enlace no cambiaría nada y
     el formulario no se abriría la segunda vez. */
  useEffect(() => {
    const mirar = () => {
      const hash = window.location.hash;
      if (hash !== ANCLA && !hash.startsWith(`${ANCLA}/`)) return;

      const tipo = tipoDelAncla(hash);
      if (tipo) setDatos((d) => ({ ...d, tipo }));

      history.replaceState(null, "", window.location.pathname + window.location.search);
      const dialogo = dialogoRef.current;
      if (dialogo && !dialogo.open) dialogo.showModal();
    };

    mirar();
    window.addEventListener("hashchange", mirar);
    return () => window.removeEventListener("hashchange", mirar);
  }, []);

  /* Al cambiar de paso, el foco va al título y el cuadro vuelve arriba:
     si no, quien usa lector de pantalla no se entera de que cambió. */
  const irA = (siguiente) => {
    setPaso(siguiente);
    setCopiado(false);
    requestAnimationFrame(() => {
      dialogoRef.current?.scrollTo({ top: 0 });
      tituloRef.current?.focus();
    });
  };

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos((d) => ({ ...d, [name]: type === "checkbox" ? checked : value }));
  };

  const alternarColor = (nombre) =>
    setDatos((d) => ({
      ...d,
      colores: d.colores.includes(nombre)
        ? d.colores.filter((c) => c !== nombre)
        : [...d.colores, nombre],
    }));

  const cerrar = () => dialogoRef.current?.close();

  const empezarDeNuevo = () => {
    borrarBorrador();
    setDatos(INICIAL);
    irA("formulario");
  };

  const mensaje = armarMensaje(datos);
  const tipo = TIPOS_ENCARGO.find((t) => t.id === datos.tipo);
  const cantidad = Number(datos.cantidad) || 0;
  const adjunta = datos.referencia === "archivo" || datos.referencia === "imagen";

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(mensaje);
      setCopiado(true);
    } catch {
      /* Sin permiso para el portapapeles: el mensaje sigue a la vista y se
         puede seleccionar a mano. */
    }
  };

  const titulos = {
    formulario: "Cuéntanos qué imaginas",
    resumen: "Revisa tu consulta",
    enviado: "Listo, sigue en WhatsApp",
  };

  return (
    <dialog
      ref={dialogoRef}
      className="personalizado"
      aria-labelledby="personalizado-titulo"
      /* Al volver a abrir, siempre se arranca por el formulario, con lo que
         había quedado escrito. */
      onClose={() => setPaso("formulario")}
      onClick={(e) => {
        if (e.target === e.currentTarget) cerrar();
      }}
    >
      <div className="personalizado__cabecera">
        <div>
          <p className="rotulo">
            {paso === "formulario" ? "Paso 1 de 2 · Tu idea" : "Paso 2 de 2 · Enviar"}
          </p>
          <h2 id="personalizado-titulo" ref={tituloRef} tabIndex={-1}>
            {titulos[paso]}
          </h2>
        </div>
        <button
          type="button"
          className="personalizado__cerrar"
          aria-label="Cerrar pedido personalizado"
          onClick={cerrar}
        >
          <X size={20} />
        </button>
      </div>

      {paso === "formulario" && (
        <form
          className="personalizado__formulario"
          onSubmit={(e) => {
            e.preventDefault();
            if (!datos.descripcion.trim()) return;
            irA("resumen");
          }}
        >
          <p className="personalizado__intro">
            Todavía no se paga nada. Con esto preparamos la cotización y te
            respondemos por WhatsApp. Solo lo que tiene * es obligatorio.
          </p>

          {/* --- La pieza --- */}
          <fieldset className="personalizado__bloque">
            <legend>¿Qué quieres hacer? *</legend>
            <div className="personalizado__chips">
              {TIPOS_ENCARGO.map((t) => (
                <Chip
                  key={t.id}
                  nombre="tipo"
                  valor={t.id}
                  marcado={datos.tipo === t.id}
                  alCambiar={cambiar}
                  requerido
                >
                  {t.nombre}
                </Chip>
              ))}
            </div>
          </fieldset>

          <label className="personalizado__campo">
            Descríbelo con tus palabras *
            <textarea
              name="descripcion"
              required
              maxLength={600}
              rows={3}
              placeholder={tipo?.ejemplo ?? "Por ejemplo: 20 llaveros con el logo de mi negocio"}
              value={datos.descripcion}
              onChange={(e) => {
                e.target.setCustomValidity("");
                cambiar(e);
              }}
              onInvalid={(e) => e.target.setCustomValidity("Cuéntanos qué pieza quieres hacer.")}
              /* Solo espacios también cuenta como vacío. */
              onBlur={(e) =>
                e.target.setCustomValidity(
                  e.target.value.trim() ? "" : "Cuéntanos qué pieza quieres hacer."
                )
              }
            />
          </label>

          <fieldset className="personalizado__bloque">
            <legend>¿Es para alguna ocasión?</legend>
            <div className="personalizado__chips">
              {[...OCASIONES.map((o) => o.titulo), "Uso diario"].map((o) => (
                <Chip
                  key={o}
                  tipo="checkbox"
                  nombre="ocasion"
                  valor={o}
                  marcado={datos.ocasion === o}
                  /* Una sola a la vez, pero se puede desmarcar: por eso es
                     casilla y no radio. */
                  alCambiar={() => setDatos((d) => ({ ...d, ocasion: d.ocasion === o ? "" : o }))}
                >
                  {o}
                </Chip>
              ))}
            </div>
          </fieldset>

          {/* --- Cantidad y colores --- */}
          <fieldset className="personalizado__bloque">
            <legend>¿Cuántas unidades? *</legend>
            <div className="personalizado__cantidad">
              <div className="personalizado__chips">
                {CANTIDADES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`chip ${cantidad === n ? "esta-activo" : ""}`}
                    aria-pressed={cantidad === n}
                    onClick={() => setDatos((d) => ({ ...d, cantidad: String(n) }))}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <label>
                <span className="oculto-visual">Otra cantidad</span>
                <input
                  name="cantidad"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="10000"
                  step="1"
                  required
                  value={datos.cantidad}
                  onChange={cambiar}
                />
              </label>
            </div>
            {cantidad >= MAYOREO && (
              <p className="personalizado__nota">
                Desde {MAYOREO} unidades iguales el precio por pieza baja. Lo
                vas a ver en la cotización.
              </p>
            )}
          </fieldset>

          <fieldset className="personalizado__bloque">
            <legend>Colores</legend>
            <p className="personalizado__ayuda">
              Elige los que quieras. Si no marcas ninguno, te recomendamos nosotros.
            </p>
            <div className="personalizado__colores">
              {PALETA.map((c) => (
                <label key={c.hex} className="personalizado__color" title={c.nombre}>
                  <input
                    type="checkbox"
                    checked={datos.colores.includes(c.nombre)}
                    onChange={() => alternarColor(c.nombre)}
                  />
                  <span style={{ background: c.hex }} aria-hidden="true">
                    {datos.colores.includes(c.nombre) && <Check size={16} strokeWidth={3} />}
                  </span>
                  <span className="oculto-visual">{c.nombre}</span>
                </label>
              ))}
            </div>
            {datos.colores.length > 0 && (
              <p className="personalizado__ayuda">Elegiste: {datos.colores.join(", ")}</p>
            )}
          </fieldset>

          <div className="personalizado__fila">
            <label className="personalizado__campo">
              Medidas aproximadas
              <input
                name="medidas"
                maxLength={120}
                placeholder="Ancho × alto × fondo, en cm"
                value={datos.medidas}
                onChange={cambiar}
              />
              <small>Si no sabes, te ayudamos a definirlas.</small>
            </label>
            <label className="personalizado__campo">
              ¿Para cuándo lo necesitas?
              <input name="fecha" type="date" min={hoy()} value={datos.fecha} onChange={cambiar} />
              <small>Si no pones fecha, lo tomamos sin apuro.</small>
            </label>
          </div>

          {/* El PLA se ablanda con el sol del carro (ver PREGUNTAS). Mejor
              saberlo antes de cotizar que después de entregar. */}
          <label className="personalizado__casilla">
            <input type="checkbox" name="intemperie" checked={datos.intemperie} onChange={cambiar} />
            <span>
              Va a estar al sol, en el carro o a la intemperie
              {datos.intemperie && (
                <small>Te lo cotizamos en PETG, que aguanta más calor que el PLA.</small>
              )}
            </span>
          </label>

          {/* --- Referencia --- */}
          <fieldset className="personalizado__bloque">
            <legend>¿Qué tienes para mostrarnos?</legend>
            <div className="personalizado__referencias">
              {REFERENCIAS.map((r) => (
                <label key={r.id} className="personalizado__referencia">
                  <input
                    type="radio"
                    name="referencia"
                    value={r.id}
                    checked={datos.referencia === r.id}
                    onChange={cambiar}
                  />
                  <span>
                    <strong>{r.nombre}</strong>
                    <small>{r.detalle}</small>
                  </span>
                </label>
              ))}
            </div>
            {adjunta && (
              <p className="personalizado__nota">
                <Paperclip size={14} aria-hidden="true" /> El archivo o la foto
                los adjuntas en el chat de WhatsApp, apenas se abra.
              </p>
            )}
            <label className="personalizado__campo">
              <span className="personalizado__opcional">Enlace, si lo tienes</span>
              <input
                name="enlace"
                type="url"
                maxLength={300}
                placeholder="Thingiverse, Printables, Pinterest…"
                value={datos.enlace}
                onChange={cambiar}
              />
            </label>
          </fieldset>

          {/* --- Entrega --- */}
          <fieldset className="personalizado__bloque">
            <legend>¿Cómo te lo hacemos llegar?</legend>
            <div className="personalizado__chips">
              <Chip nombre="entrega" valor="envio" marcado={datos.entrega === "envio"} alCambiar={cambiar}>
                Envío
              </Chip>
              <Chip nombre="entrega" valor="retiro" marcado={datos.entrega === "retiro"} alCambiar={cambiar}>
                Paso a retirarlo
              </Chip>
            </div>
            {datos.entrega === "envio" && (
              <label className="personalizado__campo">
                <span className="personalizado__opcional">Ciudad o zona</span>
                <input
                  name="zona"
                  maxLength={160}
                  placeholder="Por ejemplo: David, Chiriquí"
                  autoComplete="address-level2"
                  value={datos.zona}
                  onChange={cambiar}
                />
              </label>
            )}
          </fieldset>

          <div className="personalizado__fila">
            <label className="personalizado__campo">
              ¿Cómo te llamas?
              <input
                name="nombre"
                maxLength={80}
                autoComplete="given-name"
                placeholder="Para saber a quién le escribimos"
                value={datos.nombre}
                onChange={cambiar}
              />
            </label>
            <label className="personalizado__campo">
              ¿Algo más?
              <input
                name="notas"
                maxLength={500}
                placeholder="Presupuesto, acabado, un detalle importante…"
                value={datos.notas}
                onChange={cambiar}
              />
            </label>
          </div>

          <div className="personalizado__pie">
            <button type="submit" className="boton">
              Revisar consulta
            </button>
            <small>Tus respuestas quedan guardadas en este navegador.</small>
          </div>
        </form>
      )}

      {paso === "resumen" && (
        <div className="personalizado__resumen">
          <p className="personalizado__intro">
            Este es el mensaje que se va a abrir en WhatsApp. Puedes cambiarlo
            allí mismo antes de enviarlo.
          </p>
          <pre>{mensaje}</pre>
          {adjunta && (
            <p className="personalizado__nota">
              <Paperclip size={14} aria-hidden="true" /> No olvides adjuntar{" "}
              {datos.referencia === "archivo" ? "el archivo 3D" : "la foto, el logo o el boceto"}{" "}
              en el chat.
            </p>
          )}
          <div className="personalizado__acciones">
            <button type="button" className="boton boton--hueco" onClick={() => irA("formulario")}>
              <ArrowLeft size={18} /> Editar
            </button>
            <a
              className="boton"
              href={linkWhatsApp(mensaje)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => irA("enviado")}
            >
              <MessageCircle size={18} /> Continuar a WhatsApp
            </a>
          </div>
        </div>
      )}

      {paso === "enviado" && (
        <div className="personalizado__resumen">
          <p>
            WhatsApp se abrió en otra pestaña con tu consulta escrita. Solo falta
            que toques enviar. Te respondemos con el precio y el plazo.
          </p>
          <p>
            ¿No se abrió? Copia el mensaje y mándalo a <strong>{TEL_BONITO}</strong>.
          </p>
          <div className="personalizado__acciones">
            <button type="button" className="boton boton--hueco" onClick={copiar}>
              {copiado ? <Check size={18} /> : <Copy size={18} />}
              {copiado ? "Copiado" : "Copiar mensaje"}
            </button>
            <button type="button" className="boton boton--hueco" onClick={empezarDeNuevo}>
              Empezar otra consulta
            </button>
          </div>
          <span className="oculto-visual" role="status">
            {copiado ? "Mensaje copiado" : ""}
          </span>
        </div>
      )}
    </dialog>
  );
}
