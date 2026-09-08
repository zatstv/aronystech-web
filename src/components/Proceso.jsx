import { PASOS } from "../data/sitio";
import Visor3D from "./Visor3D";

export default function Proceso() {
  return (
    <section id="archivo">
      <div className="wrap">
        <div className="s-cabeza reveal">
          <span className="rotulo">Cómo funciona</span>
          <h2>Antes de la pieza está el archivo</h2>
        </div>

        <div className="proceso">
          <div className="proceso-visor">
            {/* Este se arma solo cuando la sección se acerca en el scroll. */}
            <Visor3D
              src="modelo/aronys-tech-apple-tag.glb"
              alt="Colgante de manzana impreso en 3D con el nombre ARONYS TECH y el número de teléfono en cubos de letras, girable"
              orbit="25deg 72deg auto"
            />
            <p className="visor-pista">
              <i className="ph-bold ph-hand-pointing"></i>Arrastrá para girar
            </p>
            <div className="visor-datos">
              <span>Rojo glitter</span>
              <span>Blanco</span>
              <span>Turquesa</span>
            </div>
          </div>

          <ol className="proceso-pasos">
            {PASOS.map((paso) => (
              <li className="paso reveal" key={paso.titulo}>
                <h3>{paso.titulo}</h3>
                <p>{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="nota-material reveal">
          <i className="ph-bold ph-leaf"></i>
          <p>
            Todo se imprime en <b>PLA</b>, un plástico hecho a base de maíz y
            biodegradable. Es rígido, detalla muy bien y no huele. Para piezas que van a
            estar al sol todo el día conviene otro material, y te lo decimos antes de
            imprimir.
          </p>
        </div>
      </div>
    </section>
  );
}
