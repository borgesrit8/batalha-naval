import React from "react";
import "./settings.css";
import { useT } from "../../i18n";
import { useDefinicoes } from "../../context/DefinicoesContext";
import { DIFICULDADES } from "../../constants";
import { IDIOMAS } from "../../i18n/textos";

// Ecrã de definições: tema, som, música e dificuldade. Tudo é lido/escrito
// através do DefinicoesContext, que já trata da persistência.
function Settings({ onVoltar }) {
  const { definicoes, atualizarDefinicao } = useDefinicoes();
  const t = useT();

  return (
    <div id="settings" className="animar-entrada">
      <div className="settings__cartao vidro">
        <h2>{t("definicoes.titulo")}</h2>

        <div className="settings__linha">
          <div>
            <p className="settings__label">{t("definicoes.idioma")}</p>
            <p className="settings__descricao">{t("definicoes.idiomaDescricao")}</p>
          </div>
          <div className="settings__idiomas">
            {IDIOMAS.map((i) => (
              <button
                key={i.id}
                className={"btn btn-secundaria settings__toggle" + (definicoes.idioma === i.id ? " is-ativo" : "")}
                onClick={() => atualizarDefinicao("idioma", i.id)}
              >
                {i.nome}
              </button>
            ))}
          </div>
        </div>

        <div className="settings__linha">
          <div>
            <p className="settings__label">{t("definicoes.tema")}</p>
            <p className="settings__descricao">{t("definicoes.temaDescricao")}</p>
          </div>
          <button
            className="btn btn-secundaria settings__toggle"
            onClick={() => atualizarDefinicao("tema", definicoes.tema === "escuro" ? "claro" : "escuro")}
          >
            {definicoes.tema === "escuro" ? t("definicoes.escuro") : t("definicoes.claro")}
          </button>
        </div>

        <div className="settings__linha">
          <div>
            <p className="settings__label">{t("definicoes.efeitos")}</p>
            <p className="settings__descricao">{t("definicoes.efeitosDescricao")}</p>
          </div>
          <button
            className={"btn btn-secundaria settings__toggle" + (definicoes.somAtivo ? " is-ativo" : "")}
            onClick={() => atualizarDefinicao("somAtivo", !definicoes.somAtivo)}
          >
            {definicoes.somAtivo ? t("definicoes.ligado") : t("definicoes.desligado")}
          </button>
        </div>

        <div className="settings__linha">
          <div>
            <p className="settings__label">{t("definicoes.musica")}</p>
            <p className="settings__descricao">{t("definicoes.musicaDescricao")}</p>
          </div>
          <button
            className={"btn btn-secundaria settings__toggle" + (definicoes.musicaAtiva ? " is-ativo" : "")}
            onClick={() => atualizarDefinicao("musicaAtiva", !definicoes.musicaAtiva)}
          >
            {definicoes.musicaAtiva ? t("definicoes.ligada") : t("definicoes.desligada")}
          </button>
        </div>

        <div className="settings__bloco-dificuldade">
          <p className="settings__label">{t("definicoes.dificuldade")}</p>
          <div className="settings__dificuldades">
            {Object.values(DIFICULDADES).map((d) => (
              <button
                key={d.id}
                className={"btn btn-secundaria settings__dificuldade" + (definicoes.dificuldade === d.id ? " is-ativo" : "")}
                onClick={() => atualizarDefinicao("dificuldade", d.id)}
              >
                <strong>{t(`dificuldades.${d.id}.nome`)}</strong>
                <span>{t(`dificuldades.${d.id}.descricao`)}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primaria settings__voltar" onClick={onVoltar}>
          {t("comum.voltar")}
        </button>
      </div>
    </div>
  );
}

export default Settings;
