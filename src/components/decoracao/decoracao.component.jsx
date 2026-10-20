import React from "react";
import "./decoracao.css";

// Decoração de fundo, comum a todos os ecrãs: rosa-dos-ventos num canto,
// gaivotas, e (fora do menu) ondas com um farol e um navio ao longe no fundo do ecrã.
// Fica atrás de tudo e não reage a toques. Usa as cores do tema, por isso
// funciona no modo claro e no escuro.
function Decoracao({ comMar = true }) {
  return (
    <div className="decoracao" aria-hidden="true">
      <svg className="decoracao__rosa" viewBox="0 0 190 190">
        <g transform="translate(95 95)">
          <circle r="80" />
          <circle r="62" />
          <path className="decoracao__rosa-ponta" d="M0 -86 L10 0 L0 86 L-10 0 Z" />
          <path className="decoracao__rosa-ponta" d="M-86 0 L0 -10 L86 0 L0 10 Z" />
        </g>
      </svg>

      <svg className="decoracao__gaivotas" viewBox="0 0 60 22">
        <path d="M2 12 Q8 4 14 11 Q20 4 26 12" />
        <path className="decoracao__gaivota-longe" d="M34 18 Q38 13 42 17 Q46 13 50 18" />
      </svg>

      {comMar && (
      <svg className="decoracao__mar" viewBox="0 0 390 150" preserveAspectRatio="xMidYMax slice">
        <g transform="translate(36 40)" className="decoracao__farol">
          <path className="decoracao__ilha" d="M-14 62 Q0 46 14 62 Z" />
          <rect className="decoracao__farol-torre" x="-4" y="14" width="8" height="38" />
          <rect className="decoracao__farol-faixa" x="-4" y="22" width="8" height="5" />
          <rect className="decoracao__farol-faixa" x="-4" y="36" width="8" height="5" />
          <path className="decoracao__farol-topo" d="M-6 14 h12 l-3 -7 h-6 Z" />
        </g>
        <g className="decoracao__navio">
          <path d="M0 14 H62 L54 24 H8 Z" />
          <rect x="22" y="4" width="14" height="10" rx="2" />
        </g>
        <path
          className="decoracao__onda decoracao__onda--1"
          d="M0 100 Q24 88 48 100 T96 100 T144 100 T192 100 T240 100 T288 100 T336 100 T384 100 T432 100 T480 100 V150 H0 Z"
        />
        <path
          className="decoracao__onda decoracao__onda--2"
          d="M0 118 Q24 108 48 118 T96 118 T144 118 T192 118 T240 118 T288 118 T336 118 T384 118 T432 118 T480 118 V150 H0 Z"
        />
      </svg>
      )}
    </div>
  );
}

export default Decoracao;
