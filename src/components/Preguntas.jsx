import { PREGUNTAS } from "../data/sitio";

export default function Preguntas() {
  return (
    <section className="faq-band capas" id="preguntas">
      <div className="wrap">
        <div className="s-cabeza reveal">
          <h2>Preguntas frecuentes</h2>
        </div>
        <div className="faq reveal">
          {PREGUNTAS.map((p) => (
            <details key={p.pregunta}>
              <summary>{p.pregunta}</summary>
              <p>{p.respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
