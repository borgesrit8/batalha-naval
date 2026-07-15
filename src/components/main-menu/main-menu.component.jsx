import React from "react";
import "./main-menu.css";
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
    <div id="main-menu">

      {/* Fundo com ondas */}
      <div className="main-menu__oceano">
        <div className="onda onda--1"></div>
        <div className="onda onda--2"></div>
        <div className="onda onda--3"></div>
      </div>


      {/* Conteúdo central */}
      <div className="main-menu__conteudo">

        {/* Moedas */}
        <div className="main-menu__moedas vidro">
          🪙 {moedas}
        </div>


        {/* Conta */}
        <button
          className="main-menu__conta vidro"
          onClick={comSom(utilizador ? handleSair : onConta)}
        >
          {utilizador
            ? `👤 ${utilizador.displayName || utilizador.email} · Sair`
            : convidado
            ? "👤 Convidado · Entrar"
            : "👤 Entrar"}
        </button>


        {/* Título */}
        <h1 className="main-menu__titulo">
          <span>BATALHA</span>
          <span className="main-menu__titulo-destaque">
            NAVAL
          </span>
        </h1>


        {/* Descrição */}
        <p className="main-menu__subtitulo">
          Comanda a tua frota. Afunda o inimigo. Domina o oceano.
        </p>


        {/* Botões */}
        <div className="main-menu__botoes">

          <button
            className="btn btn-primaria main-menu__botao-jogar"
            onClick={comSom(onJogar)}
          >
            ▶ Jogar contra o Computador
          </button>


          <button
            className="btn btn-primaria main-menu__botao-multiplayer"
            onClick={comSom(onMultiplayer)}
          >
            🌐 Multiplayer Online
          </button>


          <button
            className="btn btn-secundaria"
            onClick={comSom(onEstatisticas)}
          >
            📊 Estatísticas
          </button>


          <button
            className="btn btn-secundaria"
            onClick={comSom(onConquistas)}
          >
            🏅 Conquistas
          </button>


          <button
            className="btn btn-secundaria"
            onClick={comSom(onComoJogar)}
          >
            ❓ Como Jogar
          </button>


          <button
            className="btn btn-secundaria"
            onClick={comSom(onDefinicoes)}
          >
            ⚙️ Definições
          </button>

        </div>


       

      </div>

    </div>
  );
}

export default MainMenu;