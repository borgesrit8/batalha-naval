import React, { useState } from "react";
import "./setup.css";
import { useT } from "../../i18n";
import Board from "../board/board.component";
import { FROTA, FROTAS_PC } from "../../constants";
import {
  criarTabuleiro,
  posicaoValida,
  colocarNavio,
  gerarFrotaAleatoria,
} from "../../utils/tabuleiro";
import { useSom } from "../../hooks/useSom";

function Setup({ onIniciar, onVoltarMenu }) {
  const tocar = useSom();
  const t = useT();

  const [nome, setNome] = useState("");
  const [nomeConfirmado, setNomeConfirmado] = useState(false);

  const [tabuleiro, setTabuleiro] = useState(criarTabuleiro());
  const [navioAtual, setNavioAtual] = useState(0);
  const [horizontal, setHorizontal] = useState(true);
  const [erro, setErro] = useState("");

  const [frotaPC, setFrotaPC] = useState("aleatorio");
  const [tabuleiroPC, setTabuleiroPC] = useState(criarTabuleiro());

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
      setErro(t("setup.posicaoInvalida"));
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
    onIniciar({ nome, tabJogador: tabuleiro, tabPC });
  }

  const frotaCompleta = navioAtual >= FROTA.length;

  if (!nomeConfirmado) {
    return (
      <div id="setup" className="animar-entrada">
        <div className="setup-boasvindas vidro">
          <h2>{t("setup.tituloBoasVindas")}</h2>
          <p>{t("setup.pedirNome")}</p>
          <div className="setup-boasvindas__form">
            <input
              type="text"
              placeholder={t("setup.placeholderNome")}
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
              {t("setup.continuar")}
            </button>
          </div>
          {onVoltarMenu && (
            <button className="btn btn-secundaria setup-boasvindas__voltar" onClick={onVoltarMenu}>
              {t("comum.menuPrincipal")}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="setup" className="setup--compacto animar-entrada">
      <h2 className="setup__titulo">{t("setup.titulo", nome)}</h2>

      <Board
        titulo={null}
        tabuleiro={tabuleiro}
        mostrarNavios={true}
        radarArea={null}
        onCellClick={!frotaCompleta ? handleCliqueCell : null}
        destacado
      />

      <div id="setup-controlos" className="vidro">
        <ul id="lista-navios" aria-label={t("setup.naviosAColocar")}>
          {FROTA.map((tamanho, i) => (
            <li
              key={i}
              className={
                "setup__navio" +
                (i < navioAtual ? " setup__navio--feito" : i === navioAtual ? " setup__navio--atual" : "")
              }
            >
              {i < navioAtual ? "✔ " : ""}
              {t(`navios.${tamanho}`)} ({tamanho})
            </li>
          ))}
        </ul>

        <div className="setup-grelha-botoes">
          <button
            type="button"
            className={"btn btn-secundaria" + (horizontal ? " is-ativo" : "")}
            onClick={() => setHorizontal(true)}
          >
            {t("setup.horizontal")}
          </button>
          <button
            type="button"
            className={"btn btn-secundaria" + (!horizontal ? " is-ativo" : "")}
            onClick={() => setHorizontal(false)}
          >
            {t("setup.vertical")}
          </button>
          <button type="button" className="btn btn-secundaria" onClick={handleReiniciar}>
            {t("setup.reiniciar")}
          </button>
          <button type="button" className="btn btn-secundaria" onClick={handleColocarAleatorio}>
            {t("setup.autoColocar")}
          </button>
        </div>

        <label className="setup-frota-pc">
          <span>{t("setup.frotaPC")}</span>
          <select value={frotaPC} onChange={(e) => handleMudarFrotaPC(e.target.value)}>
            <option value="aleatorio">{t("setup.aleatoria")}</option>
            <option value="0">{t("setup.predefinida", 1)}</option>
            <option value="1">{t("setup.predefinida", 2)}</option>
            <option value="2">{t("setup.predefinida", 3)}</option>
          </select>
        </label>

        {erro !== "" && <p className="setup__erro">{erro}</p>}

        <button
          className="btn btn-primaria setup__iniciar"
          onClick={handleIniciar}
          disabled={!frotaCompleta}
        >
          {t("setup.iniciar")}
        </button>
      </div>
    </div>
  );
}

export default Setup;
