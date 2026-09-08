import { useState } from "react";
import { CHIPS, PALETA } from "../data/sitio";
import { linkWhatsApp } from "../lib/whatsapp";

const MAX = 10;

function nombreColor(hex) {
  const encontrado = PALETA.find((c) => c.hex === hex);
  return encontrado ? encontrado.nombre : "el color que elija";
}

/* El mensaje de WhatsApp cambia con lo que se va escribiendo,
   así el pedido llega ya redactado. */
function mensajePedido(texto, fijo) {
  if (!texto) return "Hola AronysTech, quiero un llavero de cubos.";
  const color = fijo ? nombreColor(fijo) : "colores surtidos";
  return `Hola AronysTech, quiero un llavero de cubos que diga "${texto}" en ${color}.`;
}

export default function ArmadorCubos() {
  const [valor, setValor] = useState("");
  const [fijo, setFijo] = useState(null); // null = colores surtidos

  const texto = valor.toUpperCase().replace(/\s+/g, " ").trim();
  // los espacios no llevan cubo, pero sí cuentan para repartir los colores:
  // por eso se guarda la posición original de cada letra.
  const letras = texto
    .split("")
    .map((ch, i) => ({ ch, i }))
    .filter((x) => x.ch !== " ");

  return (
    <div className="armador">
      <label className="armador-label" htmlFor="nombre">
        Escribí lo que querés en los cubos
      </label>
      <input
        className="armador-input"
        id="nombre"
        type="text"
        maxLength={MAX}
        placeholder="Por ejemplo: MARÍA"
        autoComplete="off"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <p className="armador-hint">Hasta {MAX} caracteres. Letras, números o los dos.</p>

      <div className="cubos" aria-live="polite">
        {letras.length === 0 ? (
          <span className="cubos-vacio">
            {[0, 1, 2, 3, 4].map((i) => (
              <span className="ranura" key={i} />
            ))}
          </span>
        ) : (
          letras.map(({ ch, i }) => (
            <span
              className="cubo"
              key={i}
              style={{
                "--base": fijo || PALETA[i % PALETA.length].hex,
                animationDelay: `${i * 45}ms`,
              }}
            >
              {ch}
            </span>
          ))
        )}
      </div>

      <div className="paleta">
        <span className="paleta-txt">Color del cubo</span>
        {CHIPS.map((c) => (
          <button
            className="chip"
            type="button"
            key={c.hex}
            style={{ background: c.hex }}
            aria-label={c.etiqueta}
            aria-pressed={fijo === c.hex}
            onClick={() => setFijo(c.hex)}
          />
        ))}
        <button
          className="chip"
          type="button"
          style={{
            background:
              "linear-gradient(135deg,#E5402B 0 25%,#F2A00E 25% 50%,#24B5A6 50% 75%,#2E6FE8 75%)",
          }}
          aria-label="Colores surtidos"
          aria-pressed={fijo === null}
          onClick={() => setFijo(null)}
        />
      </div>

      <a
        className="btn btn-main"
        href={linkWhatsApp(mensajePedido(texto, fijo))}
        target="_blank"
        rel="noopener"
      >
        <i className="ph-bold ph-whatsapp-logo"></i>Pedir por WhatsApp
      </a>
    </div>
  );
}
