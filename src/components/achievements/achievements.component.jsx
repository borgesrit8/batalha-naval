import React from "react";
import "./achievements.css";
import { CONQUISTAS } from "../../constants";

function Achievements({ desbloqueadas, onVoltar }) {
  return (
    <div id="achievements" className="animar-entrada">
      <div className="achievements__cartao vidro">
        <h2>Conquistas</h2>
        <p className="achievements__resumo">
          {desbloqueadas.length} / {CONQUISTAS.length} desbloqueadas
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
                  <strong>{c.nome}</strong>
                  <p>{c.descricao}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn btn-primaria" onClick={onVoltar}>
          ← Voltar
        </button>
      </div>
    </div>
  );
}

export default Achievements;
