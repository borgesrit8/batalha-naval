import React from "react";
import "./main-menu.css";
import { useT } from "../../i18n";
import FrotaIlustracao from "./frota-ilustracao.component";
import { useSom } from "../../hooks/useSom";
import { useAuth } from "../../context/AuthContext";

function MainMenu({
  moedas,
  onJogar,
  onMultiplayer,
  onDefinicoes,
  onEstatisticas,
  onConquistas,
  onComoJogar,
  onConta,
}) {
  const tocar = useSom();
  const t = useT();
  const { utilizador, convidado, sair } = useAuth();

  function comSom(fn) {
    return () => {
      tocar("clique");
      fn();
    };
  }

  async function handleSair() {
    console.log("A terminar sessão...");
    await sair();
  }

  return (
    <div id="main-menu" className="animar-entrada">
      {/* Barra de topo: moedas e conta */}
      <div className="main-menu__topo">
        <div className="main-menu__moedas">🪙 {moedas}</div>
        <button
          className="main-menu__conta"
          onClick={comSom(utilizador ? handleSair : onConta)}
        >
          {utilizador
            ? t("menu.sair", utilizador.displayName || utilizador.email)
            : convidado
            ? t("menu.convidadoEntrar")
            : t("menu.entrar")}
        </button>
      </div>

      <div className="main-menu__conteudo">
        {/* Ilustração da frota */}
        <FrotaIlustracao className="main-menu__frota" />

        {/* Título */}
        <h1 className="main-menu__titulo">
          {t("menu.titulo1")} <span className="main-menu__titulo-destaque">{t("menu.titulo2")}</span>
        </h1>
        <p className="main-menu__subtitulo">
          {t("menu.subtitulo")}
        </p>

        {/* Botões */}
        <div className="main-menu__botoes">
          <button className="btn btn-primaria main-menu__botao-jogar" onClick={comSom(onJogar)}>
            {t("menu.jogar")}
          </button>

          <button className="btn btn-secundaria main-menu__botao-multiplayer" onClick={comSom(onMultiplayer)}>
            {t("menu.multiplayer")}
          </button>

          <div className="main-menu__grelha">
            <button className="btn btn-secundaria" onClick={comSom(onEstatisticas)}>
              {t("menu.estatisticas")}
            </button>
            <button className="btn btn-secundaria" onClick={comSom(onConquistas)}>
              {t("menu.conquistas")}
            </button>
            <button className="btn btn-secundaria" onClick={comSom(onComoJogar)}>
              {t("menu.comoJogar")}
            </button>
            <button className="btn btn-secundaria" onClick={comSom(onDefinicoes)}>
              {t("menu.definicoes")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;