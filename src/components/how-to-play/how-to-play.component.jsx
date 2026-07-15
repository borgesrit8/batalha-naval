import React from "react";
import "./how-to-play.css";

function HowToPlay({ onVoltar }) {
  return (
    <div id="how-to-play" className="animar-entrada">
      <div className="htp__cartao vidro">
        <h2>Como Jogar</h2>
        <ol className="htp__lista">
          <li>Introduz o teu nome e posiciona a tua frota de 6 navios (horizontal ou vertical).</li>
          <li>Cada disparo custa 5 de combustível — gere-o com cuidado.</li>
          <li>Tens um tempo limite por turno; se esgotar, perdes combustível e passas a vez.</li>
          <li>Acertos rápidos recarregam combustível e podem desbloquear o Radar, que revela uma área 2x2.</li>
          <li>Afunda toda a frota do computador antes que ele afunde a tua para vencer!</li>
        </ol>
        <button className="btn btn-primaria" onClick={onVoltar}>
          ← Voltar
        </button>
      </div>
    </div>
  );
}

export default HowToPlay;
