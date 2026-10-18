import React from "react";
import "./achievements.css";
import { useT } from "../../i18n";
import { CONQUISTAS } from "../../constants";

function Achievements({ desbloqueadas, onVoltar }) {
  const t = useT();
  return (
    <div id="achievements" className="animar-entrada">
      <div className="achievements__cartao vidro">
        <h2>{t("conquistas.titulo")}</h2>
        <p className="achievements__resumo">
          {t("conquistas.resumo", desbloqueadas.length, CONQUISTAS.length)}
        </p>
        <div className="achievements__lista">
          {CONQUISTAS.map((c) => {
            const desbloqueada = desbloqueadas.includes(c.id);
            return (
              <div
                key={c.id}
                className={"achievements__item" + (desbloqueada ? " achievements__item--desbloqueada" : "")}
              >
                <span className="achievements__icone">{desbloqueada ? c.icone : "🔒"}</span>
                <div>
                  <strong>{t(`conquistas.lista.${c.id}.nome`)}</strong>
                  <p>{t(`conquistas.lista.${c.id}.descricao`)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn btn-primaria" onClick={onVoltar}>
          {t("comum.voltar")}
        </button>
      </div>
    </div>
  );
}

export default Achievements;
