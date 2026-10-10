import React, { useState, useEffect, useMemo } from "react";
import "./dashboard.css";
import { COMBUSTIVEL_INICIAL } from "../../constants";

// HUD central da partida: turno atual, cronómetro (anel animado),
// combustível (barra com gradiente), e radar.
function Dashboard({
  nomeJogador,
  vezDoJogador,
  combustivel,
  radarDisponivel,
  jogoAtivo,
  turnoId,
  turnoSegundos,
  onTempoEsgotado,
  onSegundos,
  onRadarAtivado,
}) {
  const [segundos, setSegundos] = useState(turnoSegundos);

  useEffect(() => {
    setSegundos(turnoSegundos);
  }, [vezDoJogador, turnoId, turnoSegundos]);

  useEffect(() => {
    if (!jogoAtivo || !vezDoJogador) return;
    if (segundos === 0) {
      onTempoEsgotado();
      return;
    }
    const intervalo = setInterval(() => setSegundos((s) => s - 1), 1000);
    return () => clearInterval(intervalo);
  }, [segundos, vezDoJogador, jogoAtivo, onTempoEsgotado]);

  useEffect(() => {
    onSegundos(segundos);
  }, [segundos, onSegundos]);

  const percentTempo = Math.max(0, Math.min(100, (segundos / turnoSegundos) * 100));
  const corTempo = percentTempo > 50 ? "var(--turquoise)" : percentTempo > 20 ? "var(--gold)" : "var(--red)";

  const percentCombustivel = Math.max(0, Math.min(100, (combustivel / COMBUSTIVEL_INICIAL) * 100));

  const anelEstilo = useMemo(
    () => ({
      background: `conic-gradient(${corTempo} ${percentTempo}%, rgba(255,255,255,0.12) ${percentTempo}%)`,
    }),
    [percentTempo, corTempo]
  );

  return (
    <div id="dashboard" className="vidro">
      <div className="dashboard__topo">
        <div className={"dashboard__turno" + (vezDoJogador ? " dashboard__turno--jogador" : " dashboard__turno--pc")}>
          <span className="dashboard__turno-luz" />
          <span className="dashboard__turno-texto">
            {vezDoJogador ? `Vez de ${nomeJogador}` : "Vez do computador"}
          </span>
        </div>

        <div className="dashboard__anel" style={anelEstilo} aria-label={`${segundos} segundos`}>
          <div className="dashboard__anel-interior">
            <strong>{vezDoJogador ? segundos : "—"}</strong>
          </div>
        </div>
      </div>

      <div className="dashboard__base">
        <div className="dashboard__bloco">
          <div className="dashboard__linha-label">
            <span>⛽ Combustível</span>
            <span>{combustivel}/{COMBUSTIVEL_INICIAL}</span>
          </div>
          <div className="dashboard__barra">
            <div
              className="dashboard__barra-preenchimento"
              style={{
                width: percentCombustivel + "%",
                background: percentCombustivel > 40 ? "var(--acento)" : "var(--red)",
              }}
            />
          </div>
        </div>

        <button
          className={"btn btn-secundaria dashboard__botao" + (radarDisponivel && vezDoJogador ? " dashboard__botao--pronto" : "")}
          onClick={onRadarAtivado}
          disabled={!radarDisponivel || !vezDoJogador}
          title={radarDisponivel ? "Ativar Radar" : "Radar indisponível"}
        >
          📡 Radar
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
