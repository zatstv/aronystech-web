import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

import "./Login.css";

/* ============================================================
   Panel de acceso que baja desde la barra de arriba.

   Viene de una tarjeta de Uiverse que estaba pegada como HTML suelto. Lo que
   cambió al pasarla a React:

   - El giro lo manejaba un checkbox oculto con selectores hermanos
     (.toggle:checked ~ ...). Acá el lado visible es estado: se puede leer,
     se puede probar y no depende del orden del marcado.
   - Las clases eran genéricas (.wrapper, .title, .slider) y chocaban con el
     resto del sitio. Ahora van con prefijo propio.
   - Los campos no tenían etiqueta, solo placeholder: al escribir se quedaban
     sin nombre. Cada uno lleva su <label> oculto.

   OJO: sigue siendo solo la parte visual. No valida ni envía nada; según
   STACK.md el acceso lo va a resolver PocketBase.
   ============================================================ */

function Campos({ registrando, id }) {
  return (
    <>
      {registrando && (
        <p className="login__campo">
          <label className="oculto-visual" htmlFor={`${id}-nombre`}>Nombre</label>
          <input id={`${id}-nombre`} className="login__entrada" type="text" name="nombre" placeholder="Nombre" autoComplete="name" />
        </p>
      )}
      <p className="login__campo">
        <label className="oculto-visual" htmlFor={`${id}-correo`}>Correo</label>
        <input id={`${id}-correo`} className="login__entrada" type="email" name="correo" placeholder="Correo" autoComplete="email" />
      </p>
      <p className="login__campo">
        <label className="oculto-visual" htmlFor={`${id}-clave`}>Contraseña</label>
        <input
          id={`${id}-clave`}
          className="login__entrada"
          type="password"
          name="clave"
          placeholder="Contraseña"
          autoComplete={registrando ? "new-password" : "current-password"}
        />
      </p>
    </>
  );
}

export default function Login({ abierto, alCerrar, anclaRef }) {
  const id = useId();
  const [registrando, setRegistrando] = useState(false);
  const panelRef = useRef(null);
  const primeroRef = useRef(null);

  /* Escape cierra, y al abrir el foco entra al panel: si no, quedaba detrás
     del botón y con teclado había que recorrer todo el menú para llegar. */
  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e) => e.key === "Escape" && alCerrar();
    document.addEventListener("keydown", alTeclear);
    primeroRef.current?.focus();
    return () => document.removeEventListener("keydown", alTeclear);
  }, [abierto, alCerrar]);

  /* Un clic afuera lo cierra, como cualquier menú desplegable. */
  useEffect(() => {
    if (!abierto) return;
    const alTocar = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      /* El botón que abre esto vive afuera del panel: si contara como "afuera",
         el clic cerraría acá y el onClick del botón lo volvería a abrir. */
      if (anclaRef?.current?.contains(e.target)) return;
      alCerrar();
    };
    document.addEventListener("pointerdown", alTocar);
    return () => document.removeEventListener("pointerdown", alTocar);
  }, [abierto, alCerrar, anclaRef]);

  if (!abierto) return null;

  return (
    <div className="login" ref={panelRef} role="dialog" aria-modal="false" aria-label="Acceso">
      <div className="login__cabeza">
        <p className="rotulo">Tu cuenta</p>
        <button type="button" className="login__cerrar" onClick={alCerrar} aria-label="Cerrar acceso">
          <X size={18} />
        </button>
      </div>

      {/* Que nadie escriba una contraseña real en una pantalla que no protege nada. */}
      <p className="login__aviso">
        <b>Vista previa.</b> Todavía no valida usuarios ni envía nada.
      </p>

      <div className="login__interruptor" role="group" aria-label="Entrar o crear cuenta">
        <button
          type="button"
          ref={primeroRef}
          className={`login__solapa ${!registrando ? "esta-activo" : ""}`}
          aria-pressed={!registrando}
          onClick={() => setRegistrando(false)}
        >
          Entrar
        </button>
        <button
          type="button"
          className={`login__solapa ${registrando ? "esta-activo" : ""}`}
          aria-pressed={registrando}
          onClick={() => setRegistrando(true)}
        >
          Crear cuenta
        </button>
      </div>

      <div className={`login__caja ${registrando ? "esta-girada" : ""}`}>
        <form
          className="login__cara"
          onSubmit={(e) => e.preventDefault()}
          aria-hidden={registrando}
          /* La cara de atrás sigue en el árbol para que el giro se vea, pero
             no debe recibir el tabulador mientras está dada vuelta. */
          inert={registrando}
        >
          <p className="login__titulo">Entrar</p>
          <Campos registrando={false} id={`${id}-e`} />
          <button className="login__boton" type="submit">Entrar</button>
        </form>

        <form
          className="login__cara login__cara--dorso"
          onSubmit={(e) => e.preventDefault()}
          aria-hidden={!registrando}
          inert={!registrando}
        >
          <p className="login__titulo">Crear cuenta</p>
          <Campos registrando id={`${id}-r`} />
          <button className="login__boton" type="submit">Confirmar</button>
        </form>
      </div>
    </div>
  );
}
