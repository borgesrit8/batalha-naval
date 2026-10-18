import React, { useEffect, useState } from "react";
import "./settings.css";
import { useT } from "../../i18n";
import { useDefinicoes } from "../../context/DefinicoesContext";
import { useAuth } from "../../context/AuthContext";
import { DIFICULDADES } from "../../constants";
import { IDIOMAS } from "../../i18n/textos";
import { abrirOpcoesPrivacidade, ouvirOpcoesPrivacidade } from "../../services/anuncios";

// Ecrã de definições: tema, som, música e dificuldade. Tudo é lido/escrito
// através do DefinicoesContext, que já trata da persistência.
function Settings({ onVoltar }) {
  const { definicoes, atualizarDefinicao } = useDefinicoes();
  const t = useT();
  const { utilizador, apagarConta, erro, limparErro } = useAuth();
  const [aConfirmar, setAConfirmar] = useState(false);
  const [password, setPassword] = useState("");
  const [aApagar, setAApagar] = useState(false);
  const [apagada, setApagada] = useState(false);
  const [mostrarPrivacidade, setMostrarPrivacidade] = useState(false);

  useEffect(() => ouvirOpcoesPrivacidade(setMostrarPrivacidade), []);

  async function handleApagar(e) {
    e.preventDefault();
    setAApagar(true);
    const ok = await apagarConta(password);
    setAApagar(false);
    if (ok) {
      setApagada(true);
      setAConfirmar(false);
      setPassword("");
    }
  }

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

        {mostrarPrivacidade && (
          <div className="settings__conta">
            <p className="settings__label">{t("definicoes.privacidade")}</p>
            <p className="settings__descricao">{t("definicoes.privacidadeDescricao")}</p>
            <button className="btn btn-secundaria settings__privacidade" onClick={abrirOpcoesPrivacidade}>
              {t("definicoes.privacidadeBotao")}
            </button>
          </div>
        )}

        {utilizador && !utilizador.isAnonymous && (
          <div className="settings__conta">
            <p className="settings__label">{t("definicoes.conta")}</p>
            <p className="settings__descricao">{t("definicoes.contaDescricao", utilizador.email)}</p>

            {!aConfirmar ? (
              <button
                className="btn btn-secundaria settings__apagar"
                onClick={() => {
                  limparErro();
                  setAConfirmar(true);
                }}
              >
                {t("definicoes.apagarConta")}
              </button>
            ) : (
              <form className="settings__confirmar" onSubmit={handleApagar}>
                <p>{t("definicoes.apagarAviso")}</p>
                <input
                  type="password"
                  placeholder={t("definicoes.passwordConfirmar")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                {erro && <p className="settings__erro">{t(`auth.erros.${erro}`)}</p>}
                <div className="settings__confirmar-botoes">
                  <button
                    type="button"
                    className="btn btn-secundaria"
                    onClick={() => {
                      setAConfirmar(false);
                      setPassword("");
                      limparErro();
                    }}
                  >
                    {t("definicoes.cancelar")}
                  </button>
                  <button type="submit" className="btn btn-perigo" disabled={aApagar || password === ""}>
                    {aApagar ? t("definicoes.aApagar") : t("definicoes.apagarDefinitivo")}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {apagada && <p className="settings__sucesso">{t("definicoes.contaApagada")}</p>}

        <button className="btn btn-primaria settings__voltar" onClick={onVoltar}>
          {t("comum.voltar")}
        </button>
      </div>
    </div>
  );
}

export default Settings;
