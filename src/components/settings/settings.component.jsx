import React from "react";
import "./settings.css";
import { useDefinicoes } from "../../context/DefinicoesContext";
import { DIFICULDADES } from "../../constants";

// Ecrã de definições: tema, som, música e dificuldade. Tudo é lido/escrito
// através do DefinicoesContext, que já trata da persistência.
function Settings({ onVoltar }) {
  const { definicoes, atualizarDefinicao } = useDefinicoes();

  return (
    <div id="settings" className="animar-entrada">
      <div className="settings__cartao vidro">
        <h2>Definições</h2>

        <div className="settings__linha">
          <div>
            <p className="settings__label">Tema</p>
            <p className="settings__descricao">Escolhe entre modo escuro e claro.</p>
          </div>
          <button
            className="btn btn-secundaria settings__toggle"
            onClick={() => atualizarDefinicao("tema", definicoes.tema === "escuro" ? "claro" : "escuro")}
          >
            {definicoes.tema === "escuro" ? "🌙 Escuro" : "☀️ Claro"}
          </button>
        </div>

        <div className="settings__linha">
          <div>
            <p className="settings__label">Efeitos sonoros</p>
            <p className="settings__descricao">Cliques, disparos e explosões.</p>
          </div>
          <button
            className={"btn btn-secundaria settings__toggle" + (definicoes.somAtivo ? " is-ativo" : "")}
            onClick={() => atualizarDefinicao("somAtivo", !definicoes.somAtivo)}
          >
            {definicoes.somAtivo ? "🔊 Ligado" : "🔇 Desligado"}
          </button>
        </div>

        <div className="settings__linha">
          <div>
            <p className="settings__label">Música de fundo</p>
            <p className="settings__descricao">Ambiente sonoro oceânico.</p>
          </div>
          <button
            className={"btn btn-secundaria settings__toggle" + (definicoes.musicaAtiva ? " is-ativo" : "")}
            onClick={() => atualizarDefinicao("musicaAtiva", !definicoes.musicaAtiva)}
          >
            {definicoes.musicaAtiva ? "🎵 Ligada" : "🔈 Desligada"}
          </button>
        </div>

        <div className="settings__bloco-dificuldade">
          <p className="settings__label">Dificuldade da IA</p>
          <div className="settings__dificuldades">
            {Object.values(DIFICULDADES).map((d) => (
              <button
                key={d.id}
                className={"btn btn-secundaria settings__dificuldade" + (definicoes.dificuldade === d.id ? " is-ativo" : "")}
                onClick={() => atualizarDefinicao("dificuldade", d.id)}
              >
                <strong>{d.nome}</strong>
                <span>{d.descricao}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primaria settings__voltar" onClick={onVoltar}>
          ← Voltar
        </button>
      </div>
    </div>
  );
}

export default Settings;
