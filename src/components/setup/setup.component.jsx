import React, { useState } from "react";
import "./setup.css";
import Board from "../board/board.component";
import { FROTA, FROTAS_PC, NOMES_NAVIOS } from "../../constants";
import {
  criarTabuleiro,
  posicaoValida,
  colocarNavio,
  gerarFrotaAleatoria,
} from "../../utils/tabuleiro";
import { useSom } from "../../hooks/useSom";

function Setup({ onIniciar, onVoltarMenu }) {
  const tocar = useSom();

  const [nome, setNome] = useState("");
  const [nomeConfirmado, setNomeConfirmado] = useState(false);

  const [tabuleiro, setTabuleiro] = useState(criarTabuleiro());
  const [navioAtual, setNavioAtual] = useState(0);
  const [horizontal, setHorizontal] = useState(true);
  const [erro, setErro] = useState("");

  const [frotaPC, setFrotaPC] = useState("aleatorio");
  const [tabuleiroPC, setTabuleiroPC] = useState(criarTabuleiro());
  const [debug, setDebug] = useState(false);

  function handleMudarFrotaPC(valor) {
    setFrotaPC(valor);
    if (valor === "aleatorio") {
      setTabuleiroPC(criarTabuleiro());
    } else {
      const frota = FROTAS_PC[parseInt(valor, 10)];
      let tab = criarTabuleiro();
      for (let i = 0; i < frota.length; i++) {
        const n = frota[i];
        tab = colocarNavio(tab, n.linha, n.col, n.tamanho, n.horizontal, "pc-" + i);
      }
      setTabuleiroPC(tab);
    }
  }

  function handleCliqueCell(l, c) {
    if (navioAtual >= FROTA.length) return;
    const tamanho = FROTA[navioAtual];

    if (!posicaoValida(tabuleiro, l, c, tamanho, horizontal)) {
      setErro("Posição inválida! Verifica os limites e sobreposições.");
      return;
    }

    setErro("");
    tocar("clique");
    const id = "j-" + navioAtual;
    const novoTabuleiro = colocarNavio(tabuleiro, l, c, tamanho, horizontal, id);
    setTabuleiro(novoTabuleiro);
    setNavioAtual(navioAtual + 1);
  }

  function handleReiniciar() {
    setTabuleiro(criarTabuleiro());
    setNavioAtual(0);
    setErro("");
  }

  function handleColocarAleatorio() {
    setTabuleiro(gerarFrotaAleatoria());
    setNavioAtual(FROTA.length);
    setErro("");
  }

  function handleIniciar() {
    const tabPC = frotaPC === "aleatorio" ? gerarFrotaAleatoria() : tabuleiroPC;
    tocar("clique");
    onIniciar({ nome, tabJogador: tabuleiro, tabPC, debug });
  }

  const frotaCompleta = navioAtual >= FROTA.length;

  if (!nomeConfirmado) {
    return (
      <div id="setup" className="animar-entrada">
        <div className="setup-boasvindas vidro">
          <h2>Batalha Naval Avançada</h2>
          <p>Introduz o teu nome de comandante para começar:</p>
          <div className="setup-boasvindas__form">
            <input
              type="text"
              placeholder="O teu nome..."
              value={nome}
              maxLength={20}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && nome.trim() !== "" && setNomeConfirmado(true)}
              autoFocus
            />
            <button
              className="btn btn-primaria"
              onClick={() => setNomeConfirmado(true)}
              disabled={nome.trim() === ""}
            >
              Continuar
            </button>
          </div>
          {onVoltarMenu && (
            <button className="btn btn-secundaria setup-boasvindas__voltar" onClick={onVoltarMenu}>
              ← Menu principal
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="setup" className="animar-entrada">
      <h2 className="setup__titulo">Olá {nome}! Posiciona a tua frota</h2>

      <div id="setup-layout">
        <div id="setup-controlos" className="vidro">
          <fieldset>
            <legend>Orientação do navio</legend>
            <div className="setup-orientacao">
              <button
                type="button"
                className={"btn btn-secundaria" + (horizontal ? " is-ativo" : "")}
                onClick={() => setHorizontal(true)}
              >
                ↔ Horizontal
              </button>
              <button
                type="button"
                className={"btn btn-secundaria" + (!horizontal ? " is-ativo" : "")}
                onClick={() => setHorizontal(false)}
              >
                ↕ Vertical
              </button>
            </div>
          </fieldset>

          <div id="lista-navios">
            <p className="setup__subtitulo">Navios a colocar:</p>
            {FROTA.map((tamanho, i) => (
              <p
                key={i}
                className={
                  "setup__navio" +
                  (i < navioAtual ? " setup__navio--feito" : i === navioAtual ? " setup__navio--atual" : "")
                }
              >
                {i < navioAtual ? "✔" : i === navioAtual ? "▶" : "○"} {NOMES_NAVIOS[tamanho]} ({tamanho})
              </p>
            ))}
          </div>

          <div className="setup-acoes-rapidas">
            <button className="btn btn-secundaria" onClick={handleReiniciar}>
              Reiniciar
            </button>
            <button className="btn btn-secundaria" onClick={handleColocarAleatorio}>
              🎲 Auto-colocar
            </button>
          </div>

          <fieldset>
            <legend>Frota do computador</legend>
            <select value={frotaPC} onChange={(e) => handleMudarFrotaPC(e.target.value)}>
              <option value="aleatorio">Aleatória</option>
              <option value="0">Pré-definida 1</option>
              <option value="1">Pré-definida 2</option>
              <option value="2">Pré-definida 3</option>
            </select>
          </fieldset>

          <fieldset>
            <legend>Debug</legend>
            <label className="setup-checkbox">
              <input type="checkbox" checked={debug} onChange={(e) => setDebug(e.target.checked)} />
              Mostrar frota do PC durante o jogo
            </label>
          </fieldset>

          {erro !== "" && <p className="setup__erro">{erro}</p>}

          <button
            className="btn btn-primaria setup__iniciar"
            onClick={handleIniciar}
            disabled={!frotaCompleta}
          >
            🚀 Iniciar Jogo
          </button>
        </div>

        <Board
          titulo="O teu tabuleiro"
          tabuleiro={tabuleiro}
          mostrarNavios={true}
          radarArea={null}
          onCellClick={!frotaCompleta ? handleCliqueCell : null}
          destacado
        />

        <Board
          titulo={frotaPC === "aleatorio" ? "Computador (gerada ao iniciar)" : "Computador (pré-visualização)"}
          tabuleiro={tabuleiroPC}
          mostrarNavios={true}
          radarArea={null}
          onCellClick={null}
        />
      </div>
    </div>
  );
}

export default Setup;
