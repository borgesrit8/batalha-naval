import React, { useEffect } from "react";
import "./game-over.css";
import { useSom } from "../../hooks/useSom";

// Ecrã final: comportamento visual distinto para vitória vs derrota,
// resumo da partida e lista de conquistas desbloqueadas nesta sessão.
function GameOver({ vencedor, nomeJogador, jogadas, precisao, moedasGanhas, novasConquistas, onJogarNovamente, onMenu }) {
  const venceu = vencedor === nomeJogador;
  const tocar = useSom();

  useEffect(() => {
    tocar(venceu ? "vitoria" : "derrota");
  }, [venceu, tocar]);

  return (
    <div id="game-over" className="animar-entrada">
      <div className={"game-over__cartao vidro" + (venceu ? " game-over__cartao--vitoria" : " game-over__cartao--derrota")}>
        {venceu && (
          <div className="game-over__confettis" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="game-over__confetti" style={{ "--i": i }} />
            ))}
          </div>
        )}

        <div className="game-over__emblema">{venceu ? "🏆" : "🌊"}</div>
        <h2>{venceu ? "Vitória!" : "Derrota"}</h2>
        <p className="game-over__subtitulo">
          {venceu ? `Parabéns, ${nomeJogador}! A tua frota dominou os mares.` : "O Computador afundou a tua frota desta vez."}
        </p>

        <div className="game-over__stats">
          <div className="game-over__stat">
            <strong>{jogadas}</strong>
            <span>Jogadas</span>
          </div>
          <div className="game-over__stat">
            <strong>{precisao}%</strong>
            <span>Precisão</span>
          </div>
          <div className="game-over__stat">
            <strong>+{moedasGanhas}</strong>
            <span>Moedas</span>
          </div>
        </div>

        {novasConquistas.length > 0 && (
          <div className="game-over__conquistas">
            <p className="setup__subtitulo">Novas conquistas:</p>
            {novasConquistas.map((c) => (
              <div key={c.id} className="game-over__conquista">
                <span>{c.icone}</span> {c.nome}
              </div>
            ))}
          </div>
        )}

        <div className="game-over__acoes">
          <button className="btn btn-primaria" onClick={onJogarNovamente}>
            ⚔️ Jogar Novamente
          </button>
          <button className="btn btn-secundaria" onClick={onMenu}>
            🏠 Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameOver;
