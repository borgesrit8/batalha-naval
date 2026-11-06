import React, { useEffect } from "react";
import "./game-over.css";
import { useT } from "../../i18n";
import { useSom } from "../../hooks/useSom";

// Ecrã final: comportamento visual distinto para vitória vs derrota,
// resumo da partida e lista de conquistas desbloqueadas nesta sessão.
function GameOver({ vencedor, nomeJogador, jogadas, precisao, moedasGanhas, novasConquistas, onJogarNovamente, onMenu, textoDerrota }) {
  const venceu = vencedor === nomeJogador;
  const tocar = useSom();
  const t = useT();

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
        <h2>{venceu ? t("fim.vitoria") : t("fim.derrota")}</h2>
        <p className="game-over__subtitulo">
          {venceu ? t("fim.parabens", nomeJogador) : textoDerrota || t("fim.perdeste")}
        </p>

        <div className="game-over__stats">
          <div className="game-over__stat">
            <strong>{jogadas}</strong>
            <span>{t("fim.jogadas")}</span>
          </div>
          <div className="game-over__stat">
            <strong>{precisao}%</strong>
            <span>{t("fim.precisao")}</span>
          </div>
          <div className="game-over__stat">
            <strong>+{moedasGanhas}</strong>
            <span>{t("fim.moedas")}</span>
          </div>
        </div>

        {novasConquistas.length > 0 && (
          <div className="game-over__conquistas">
            <p className="setup__subtitulo">{t("fim.novasConquistas")}</p>
            {novasConquistas.map((c) => (
              <div key={c.id} className="game-over__conquista">
                <span>{c.icone}</span> {t(`conquistas.lista.${c.id}.nome`)}
              </div>
            ))}
          </div>
        )}

        <div className="game-over__acoes">
          <button className="btn btn-primaria" onClick={onJogarNovamente}>
            {t("fim.jogarNovamente")}
          </button>
          <button className="btn btn-secundaria" onClick={onMenu}>
            {t("fim.menu")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameOver;
