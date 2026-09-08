import { PAGOS } from "../data/sitio";

export default function Entrega() {
  return (
    <section className="colores-band capas" id="entrega">
      <div className="wrap">
        <div className="s-cabeza reveal">
          <h2>Entrega y pago</h2>
          <p>
            Enviamos a <b>todo Panamá</b>. Y cobramos como te quede mejor, sin obligarte
            a un solo método.
          </p>
        </div>
        <ul className="pagos reveal">
          {PAGOS.map((p) => (
            <li key={p.texto}>
              <i className={`ph-bold ${p.icono}`}></i>
              {p.texto}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
