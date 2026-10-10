import React from "react";
import "./main-menu.css";
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
            ? `${utilizador.displayName || utilizador.email} · Sair`
            : convidado
            ? "Convidado · Entrar"
            : "Entrar"}
        </button>
      </div>

      <div className="main-menu__conteudo">
        {/* Ilustração da frota */}
        <FrotaIlustracao className="main-menu__frota" />

        {/* Título */}
        <h1 className="main-menu__titulo">
          Batalha <span className="main-menu__titulo-destaque">Naval</span>
        </h1>
        <p className="main-menu__subtitulo">
          Comanda a tua frota. Afunda o inimigo. Domina o oceano.
        </p>

        {/* Botões */}
        <div className="main-menu__botoes">
          <button className="btn btn-primaria main-menu__botao-jogar" onClick={comSom(onJogar)}>
            ▶ Jogar contra o Computador
          </button>

          <button className="btn btn-secundaria main-menu__botao-multiplayer" onClick={comSom(onMultiplayer)}>
            🌐 Multiplayer Online
          </button>

          <div className="main-menu__grelha">
            <button className="btn btn-secundaria" onClick={comSom(onEstatisticas)}>
              📊 Estatísticas
            </button>
            <button className="btn btn-secundaria" onClick={comSom(onConquistas)}>
              🏅 Conquistas
            </button>
            <button className="btn btn-secundaria" onClick={comSom(onComoJogar)}>
              ❓ Como Jogar
            </button>
            <button className="btn btn-secundaria" onClick={comSom(onDefinicoes)}>
              ⚙️ Definições
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;