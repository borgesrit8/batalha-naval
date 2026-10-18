import React from "react";
import "./how-to-play.css";
import { useT } from "../../i18n";

function HowToPlay({ onVoltar }) {
  const t = useT();
  return (
    <div id="how-to-play" className="animar-entrada">
      <div className="htp__cartao vidro">
        <h2>{t("comoJogar.titulo")}</h2>
        <ol className="htp__lista">
          {t("comoJogar.passos").map((passo, i) => (
            <li key={i}>{passo}</li>
          ))}
        </ol>
        <button className="btn btn-primaria" onClick={onVoltar}>
          {t("comum.voltar")}
        </button>
      </div>
    </div>
  );
}

export default HowToPlay;
