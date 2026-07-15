import React from "react";
import "./stats.css";
import { calcularPrecisao } from "../../utils/tabuleiro";

function Stats({ estatisticas, onVoltar }) {
  const precisao = calcularPrecisao(estatisticas.tirosDisparados, estatisticas.tirosCertos);
  const taxaVitoria =
    estatisticas.jogosJogados > 0 ? Math.round((estatisticas.vitorias / estatisticas.jogosJogados) * 100) : 0;

  const cartoes = [
    { label: "Jogos", valor: estatisticas.jogosJogados, icone: "🎮" },
    { label: "Vitórias", valor: estatisticas.vitorias, icone: "🏆" },
    { label: "Derrotas", valor: estatisticas.derrotas, icone: "💥" },
    { label: "Taxa de vitória", valor: taxaVitoria + "%", icone: "📈" },
    { label: "Precisão global", valor: precisao + "%", icone: "🎯" },
    { label: "Melhor partida", valor: estatisticas.navioMaisRapido ?? "—", icone: "⚡" },
    { label: "Moedas", valor: estatisticas.moedas, icone: "🪙" },
  ];

  return (
    <div id="stats" className="animar-entrada">
      <div className="stats__cartao vidro">
        <h2>Estatísticas</h2>
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
          ← Voltar
        </button>
      </div>
    </div>
  );
}

export default Stats;
