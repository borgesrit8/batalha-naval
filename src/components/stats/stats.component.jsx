import React from "react";
import "./stats.css";
import { useT } from "../../i18n";
import { calcularPrecisao } from "../../utils/tabuleiro";

function Stats({ estatisticas, onVoltar }) {
  const t = useT();
  const precisao = calcularPrecisao(estatisticas.tirosDisparados, estatisticas.tirosCertos);
  const taxaVitoria =
    estatisticas.jogosJogados > 0 ? Math.round((estatisticas.vitorias / estatisticas.jogosJogados) * 100) : 0;

  const cartoes = [
    { label: t("estatisticas.jogos"), valor: estatisticas.jogosJogados, icone: "🎮" },
    { label: t("estatisticas.vitorias"), valor: estatisticas.vitorias, icone: "🏆" },
    { label: t("estatisticas.derrotas"), valor: estatisticas.derrotas, icone: "💥" },
    { label: t("estatisticas.taxaVitoria"), valor: taxaVitoria + "%", icone: "📈" },
    { label: t("estatisticas.precisao"), valor: precisao + "%", icone: "🎯" },
    { label: t("estatisticas.melhorPartida"), valor: estatisticas.navioMaisRapido ?? "—", icone: "⚡" },
    { label: t("estatisticas.moedas"), valor: estatisticas.moedas, icone: "🪙" },
  ];

  return (
    <div id="stats" className="animar-entrada">
      <div className="stats__cartao vidro">
        <h2>{t("estatisticas.titulo")}</h2>
        <div className="stats__grelha">
          {cartoes.map((c) => (
            <div key={c.label} className="stats__item">
              <span className="stats__icone">{c.icone}</span>
              <strong>{c.valor}</strong>
              <span className="stats__label">{c.label}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-primaria" onClick={onVoltar}>
          {t("comum.voltar")}
        </button>
      </div>
    </div>
  );
}

export default Stats;
