import { useState } from "react";
import { SUELTOS } from "../data/sitio";
import ArmadorCubos from "./ArmadorCubos";
import Visor3D from "./Visor3D";

export default function Hero() {
  const [modeloListo, setModeloListo] = useState(false);

  return (
    <section className="hero">
      {SUELTOS.map((s, i) => (
        <span
          className="suelto"
          key={i}
          aria-hidden="true"
          style={{
            "--giro": s.giro,
            width: s.lado,
            height: s.lado,
            top: s.top,
            bottom: s.bottom,
            left: s.left,
            right: s.right,
            background: s.color,
            animationDelay: s.retraso,
          }}
        />
      ))}

      <div className="wrap hero-grid">
        <div className="hero-texto">
          {/* El hero ya muestra el render del logo como imagen, así que el WebGL
              espera a que cargue el resto y no se pelea con el LCP. */}
          <Visor3D
            as="h1"
            className="hero-logo"
            mostrarCarga={false}
            cuando="load"
            src="modelo/aronystech-logo-3d.glb"
            alt="Logo de AronysTech impreso en 3D: una manzana junto a las letras ARONYS TECH, girable"
            /* El logo es muy apaisado. model-viewer encuadra la esfera envolvente con
               el FOV vertical, así que con radio automático queda diminuto; y de cerca,
               el FOV horizontal se abre a ~87 grados y lo deforma como un gran angular.
               Cámara lejos con FOV angosto: mismo encuadre, perspectiva plana de logo.
               Radio y FOV quedan fijos, así que camera-controls solo gira la pieza. */
            orbit="0deg 90deg 2m"
            minOrbit="auto 25deg 2m"
            maxOrbit="auto 155deg 2m"
            fov="4deg"
            /* es el título de la página: girando mostraría el texto espejado media
               vuelta, así que se queda quieto y se gira arrastrando */
            sinGiro
            onCargado={() => setModeloListo(true)}
          >
            <span className="solo-lectores">AronysTech — tu nombre, impreso en 3D</span>
            <img
              className={modeloListo ? "oculto" : undefined}
              src="img/logo-3d.png"
              width="900"
              height="258"
              alt=""
              fetchPriority="high"
            />
          </Visor3D>

          <p className="hero-sub">
            Llaveros, soportes y regalos hechos a la medida. Escribí tu nombre y mirá
            cómo queda.
          </p>

          <ArmadorCubos />
        </div>

        <div className="hero-foto">
          <img
            src="img/portada.jpg"
            width="896"
            height="1195"
            alt="Manzana roja impresa en 3D con el nombre ARONYS TECH y el número de teléfono formados con llaveros de cubos de letras y números"
          />
        </div>
      </div>
    </section>
  );
}
