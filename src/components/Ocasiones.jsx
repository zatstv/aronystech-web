import { OCASIONES } from "../data/sitio";

export default function Ocasiones() {
  return (
    <section>
      <div className="wrap">
        <div className="s-cabeza reveal">
          <h2>Para qué lo piden</h2>
          <p>
            La mayoría de pedidos entran por alguna de estas razones. Si la tuya no está,
            igual escribinos.
          </p>
        </div>
        <div className="tarjetas reveal">
          {OCASIONES.map((o) => (
            <div className="ocasion" key={o.titulo}>
              <h3>{o.titulo}</h3>
              <p>{o.texto}</p>
            </div>
          ))}
        </div>
        <p className="desliza reveal">
          <i className="ph-bold ph-arrows-horizontal"></i>Deslizá para ver todas
        </p>
      </div>
    </section>
  );
}
