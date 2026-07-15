import React, { useState, useEffect, useMemo } from "react";
import "./dashboard.css";
import { COMBUSTIVEL_INICIAL } from "../../constants";

// HUD central da partida: turno atual, cronómetro (anel animado),
// combustível (barra com gradiente), radar e alternador de debug.
function Dashboard({
  nomeJogador,
  vezDoJogador,
  combustivel,
  radarDisponivel,
  jogoAtivo,
  debug,
  turnoSegundos,
  onTempoEsgotado,
  onSegundos,
  onRadarAtivado,
  onToggleDebug,
}) {
  const [segundos, setSegundos] = useState(turnoSegundos);

  useEffect(() => {
    setSegundos(turnoSegundos);
  }, [vezDoJogador, turnoSegundos]);

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
    <div id="dashboard" className="vidro animar-entrada">
      <div className={"dashboard__turno" + (vezDoJogador ? " dashboard__turno--jogador" : " dashboard__turno--pc")}>
        <span className="dashboard__turno-luz" />
        {vezDoJogador ? `Vez de ${nomeJogador}` : "O Computador está a mirar…"}
      </div>

      <div className="dashboard__anel" style={anelEstilo} aria-hidden="true">
        <div className="dashboard__anel-interior">
          <strong>{vezDoJogador ? segundos : "—"}</strong>
          <span>seg</span>
        </div>
      </div>

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
              background:
                percentCombustivel > 40
                  ? "linear-gradient(90deg, var(--ocean-light), var(--turquoise))"
                  : "linear-gradient(90deg, var(--orange), var(--red))",
            }}
          />
        </div>
      </div>

      <button
        className="btn btn-secundaria dashboard__botao"
        onClick={onRadarAtivado}
        disabled={!radarDisponivel || !vezDoJogador}
      >
        📡 {radarDisponivel ? "Ativar Radar" : "Radar indisponível"}
      </button>

      <button className="btn btn-secundaria dashboard__botao dashboard__botao--debug" onClick={onToggleDebug}>
        {debug ? "🙈 Esconder frota PC" : "🔍 Modo debug (dev)"}
      </button>
    </div>
  );
}

export default Dashboard;
