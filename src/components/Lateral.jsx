import { useCallback, useEffect, useRef, useState } from "react";
import {
  House,
  Images,
  LogIn,
  Menu,
  MessageCircle,
  Users,
  X,
} from "lucide-react";

import Login from "./Login.jsx";
import Marca from "./Marca.jsx";
import { useSeccionActiva } from "../hooks/useSeccionActiva.js";
import { aplicarTema, leerTema } from "../lib/tema.js";
import { linkWhatsApp } from "../lib/whatsapp.js";
import "./Lateral.css";

/* ============================================================
   La navegación vive en una barra lateral fija, no en una franja arriba.

   En escritorio queda a la izquierda y el contenido se corre para dejarle
   lugar (el corrimiento lo pone .contenido, al final de esta hoja). En
   celular no cabe: ahí vuelve a haber una barra angosta arriba y la lateral
   entra deslizándose por el costado.

   Los números de la derecha no son adorno: son las teclas que saltan a cada
   sección, igual que se leen.
   ============================================================ */

const SECCIONES = ["inicio", "catalogo", "galeria", "nosotros"];

const GRUPOS = [
  {
    enlaces: [
      { href: "#inicio", texto: "Inicio", icono: House, tecla: "1" },
      { href: "#galeria", texto: "Galería", icono: Images, tecla: "2" },
      { href: "#nosotros", texto: "Nosotros", icono: Users, tecla: "3" },
    ],
  },
];

const TEMAS = [
  { valor: "claro", texto: "Claro" },
  { valor: "oscuro", texto: "Oscuro" },
  { valor: "auto", texto: "Auto" },
];

/* --- Claro / Oscuro / Auto, abajo de todo --- */
function SelectorTema() {
  const [tema, setTema] = useState(leerTema);

  const elegir = (valor) => {
    setTema(valor);
    aplicarTema(valor);
  };

  return (
    <div className="lateral__tema" role="group" aria-label="Tema de la página">
      {TEMAS.map((t) => (
        <button
          key={t.valor}
          type="button"
          className={`lateral__tema-opcion ${tema === t.valor ? "esta-activo" : ""}`}
          aria-pressed={tema === t.valor}
          onClick={() => elegir(t.valor)}
        >
          {t.texto}
        </button>
      ))}
    </div>
  );
}

export default function Lateral() {
  const [abierto, setAbierto] = useState(false);
  const menuRef = useRef(null);
  const navRef = useRef(null);
  const [acceso, setAcceso] = useState(false);
  const cerrarAcceso = useCallback(() => setAcceso(false), []);
  const anclaAcceso = useRef(null);
  const activa = useSeccionActiva(SECCIONES);

  /* Arriba de todo la cabecera se vuelve transparente y el video de la
     portada pasa por detrás. Apenas se baja recupera su fondo, si no los
     enlaces quedarían encima del contenido sin nada que los separe. */
  const [arriba, setArriba] = useState(() => typeof window === "undefined" || window.scrollY < 40);

  useEffect(() => {
    const mirar = () => setArriba(window.scrollY < 40);
    mirar();
    window.addEventListener("scroll", mirar, { passive: true });
    return () => window.removeEventListener("scroll", mirar);
  }, []);

  /* Los atajos. Se ignoran si hay un campo con el foco (los del panel de
     acceso, sin ir más lejos) o si el visitante viene apretando Ctrl/Alt/Cmd,
     que son combinaciones del navegador y no nuestras. */
  useEffect(() => {
    const alTeclear = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || document.querySelector('[aria-modal="true"], dialog[open]')) return;
      const foco = document.activeElement;
      if (foco?.matches("input, textarea, select, [contenteditable]")) return;

      if (e.key === "/") {
        e.preventDefault();
        setAcceso(true);
        return;
      }

      const enlace = GRUPOS[0].enlaces.find((l) => l.tecla === e.key);
      if (!enlace) return;
      e.preventDefault();
      window.location.hash = enlace.href;
      document.getElementById(enlace.href.slice(1))?.scrollIntoView();
      setAbierto(false);
    };

    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const media = window.matchMedia("(max-width: 63.9375rem)");
    const anterior = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focoFrame = requestAnimationFrame(() => {
      navRef.current?.querySelector(".lateral__cuerpo a[href]")?.focus();
    });
    const cerrarPorAncho = () => { if (!media.matches) setAbierto(false); };
    const teclado = (e) => {
      if (e.key === "Escape") { setAcceso(false); setAbierto(false); }
      if (e.key !== "Tab") return;
      const items = [menuRef.current, ...navRef.current.querySelectorAll('a[href], button, input')].filter((el) => el && !el.disabled && el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
      if (e.shiftKey && document.activeElement === items[0]) {e.preventDefault(); items.at(-1)?.focus();}
      else if (!e.shiftKey && document.activeElement === items.at(-1)) {e.preventDefault(); items[0]?.focus();}
    };
    document.addEventListener("keydown", teclado);
    media.addEventListener("change", cerrarPorAncho);
    return () => {
      cancelAnimationFrame(focoFrame);
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", teclado);
      media.removeEventListener("change", cerrarPorAncho);
      if (media.matches && anterior?.isConnected) anterior.focus();
    };
  }, [abierto]);

  return (
    <>
      {/* Solo en celular: la barra angosta de arriba con el botón del menú. */}
      <div className={`lateral__movil ${arriba ? "esta-arriba" : ""}`}>
        <a className="lateral__marca" href="#inicio" aria-label="AronysTech, ir al inicio">
          <Marca alto="2.4rem" />
        </a>
        <button
          type="button"
          ref={menuRef}
          className="lateral__menu"
          aria-expanded={abierto}
          aria-controls="nav-lateral"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto((v) => !v)}
        >
          {abierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* El velo solo existe con el menú desplegado en celular. */}
      {abierto && (
        <button
          type="button"
          className="lateral__velo"
          aria-label="Cerrar menú"
          onClick={() => setAbierto(false)}
        />
      )}

      <nav
        ref={navRef}
        id="nav-lateral"
        className={`lateral ${abierto ? "esta-abierto" : ""} ${arriba ? "esta-arriba" : ""}`}
        aria-label="Navegación principal"
      >
        <a className="lateral__marca lateral__marca--rail" href="#inicio" aria-label="AronysTech, ir al inicio">
          <Marca alto="2.6rem" />
        </a>

        <div className="lateral__cuerpo">
          {GRUPOS.map((grupo, i) => (
            <div className="lateral__grupo" key={grupo.titulo ?? i}>
              {grupo.titulo && <p className="lateral__grupo-titulo">{grupo.titulo}</p>}
              <ul className="lateral__lista">
                {grupo.enlaces.map(({ href, texto, icono: Icono, tecla }) => (
                  <li key={href}>
                    <a
                      className={`lateral__enlace ${activa === href.slice(1) ? "esta-activo" : ""}`}
                      href={href}
                      aria-current={activa === href.slice(1) ? "page" : undefined}
                      onClick={() => setAbierto(false)}
                    >
                      <Icono size={17} strokeWidth={2} />
                      <span className="lateral__texto">{texto}</span>
                      <span className="lateral__tecla" aria-hidden="true">{tecla}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lateral__grupo">
            <p className="lateral__grupo-titulo">Tu cuenta</p>
            <ul className="lateral__lista">
              <li className="lateral__ancla-acceso" ref={anclaAcceso}>
                <button
                  type="button"
                  className={`lateral__enlace ${acceso ? "esta-activo" : ""}`}
                  aria-expanded={acceso}
                  onClick={() => setAcceso((v) => !v)}
                >
                  <LogIn size={17} strokeWidth={2} />
                  <span className="lateral__texto">Iniciar sesión</span>
                  <span className="lateral__tecla" aria-hidden="true">/</span>
                </button>

                <Login abierto={acceso} alCerrar={cerrarAcceso} anclaRef={anclaAcceso} />
              </li>
            </ul>
          </div>

          <div className="lateral__grupo">
            <p className="lateral__grupo-titulo">Escríbenos</p>
            <ul className="lateral__lista">
              <li>
                <a
                  className="lateral__enlace"
                  href={linkWhatsApp("Hola, quisiera información sobre sus impresiones 3D.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setAbierto(false)}
                >
                  <MessageCircle size={17} strokeWidth={2} />
                  <span className="lateral__texto">WhatsApp</span>
                  <span className="lateral__tecla" aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="lateral__pie">
          <SelectorTema />
        </div>
      </nav>
    </>
  );
}
