import React, { useEffect, useState } from "react";
import "./splash.css";
import FrotaIlustracao from "../main-menu/frota-ilustracao.component";

// Ecrã de arranque com barra de progresso simulada — dá uma sensação de
// app "profissional" e disfarça o tempo de inicialização do áudio/estado.
function Splash({ onTerminar }) {
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const inicio = Date.now();
    const duracao = 1100;
    let frame;

    function passo() {
      const decorrido = Date.now() - inicio;
      const p = Math.min(100, Math.round((decorrido / duracao) * 100));
      setProgresso(p);
      if (p < 100) {
        frame = requestAnimationFrame(passo);
      } else {
        setTimeout(onTerminar, 200);
      }
    }
    frame = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(frame);
  }, [onTerminar]);

  return (
    <div id="splash">
      <FrotaIlustracao className="splash__frota" />
      <h1 className="splash__titulo">Batalha Naval</h1>
      <div className="splash__barra">
        <div className="splash__barra-preenchimento" style={{ width: progresso + "%" }} />
      </div>
      <p className="splash__texto">A preparar a frota… {progresso}%</p>
    </div>
  );
}

export default Splash;
