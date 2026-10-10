import React from "react";
import "./frota-ilustracao.css";

// Ilustração da frota (porta-aviões, fragata e submarino) a navegar sobre
// as ondas. Desenhada em SVG para ficar nítida em qualquer ecrã; as cores
// vêm das variáveis do tema, por isso funciona no modo claro e no escuro.
function FrotaIlustracao({ className = "" }) {
  return (
    <svg
      className={"frota " + className}
      viewBox="0 0 360 140"
      role="img"
      aria-label="Porta-aviões, fragata e submarino a navegar"
    >
      {/* Gaivotas */}
      <g className="frota__gaivotas">
        <path d="M290 28 q4 -4 8 0 q4 -4 8 0" />
        <path d="M312 18 q3 -3 6 0 q3 -3 6 0" />
      </g>

      {/* Onda de trás */}
      <g className="frota__onda frota__onda--tras">
        <path d="M-90 100 Q-67.5 94 -45 100 T0 100 T45 100 T90 100 T135 100 T180 100 T225 100 T270 100 T315 100 T360 100 T405 100 T450 100 V140 H-90 Z" />
      </g>

      {/* Porta-aviões */}
      <g className="frota__navio frota__navio--porta-avioes">
        <path className="frota__casco" d="M52 82 L254 82 L246 92 L238 101 L80 101 L60 92 Z" />
        <path className="frota__linha-agua" d="M63 93 L244 93 L241 96.5 L67 96.5 Z" />
        <rect className="frota__casco" x="48" y="77" width="210" height="6" rx="1.5" />
        <line className="frota__marcas" x1="58" y1="80" x2="196" y2="80" />
        {/* Aviões no convés */}
        <path className="frota__super" d="M78 77 L91 77 L94 75.6 L83 74.6 L81 71 L78 71 Z" />
        <path className="frota__super" d="M104 77 L117 77 L120 75.6 L109 74.6 L107 71 L104 71 Z" />
        <path className="frota__super" d="M130 77 L143 77 L146 75.6 L135 74.6 L133 71 L130 71 Z" />
        {/* Ponte de comando */}
        <rect className="frota__super" x="206" y="57" width="24" height="20" rx="2" />
        <rect className="frota__super" x="210" y="48" width="16" height="10" rx="1.5" />
        <rect className="frota__janela" x="210" y="61" width="3.5" height="2.5" />
        <rect className="frota__janela" x="216" y="61" width="3.5" height="2.5" />
        <rect className="frota__janela" x="222" y="61" width="3.5" height="2.5" />
        <rect className="frota__janela" x="213" y="51" width="3" height="2.2" />
        <rect className="frota__janela" x="219" y="51" width="3" height="2.2" />
        <line className="frota__mastro" x1="218" y1="48" x2="218" y2="32" />
        <rect className="frota__casco" x="211" y="37" width="14" height="2.5" rx="1" />
        <path className="frota__bandeira" d="M218 32 L227 34.5 L218 37 Z" />
      </g>

      {/* Fragata */}
      <g className="frota__navio frota__navio--fragata">
        <path className="frota__casco" d="M258 91 L352 86 L341 103 L267 103 Z" />
        <path className="frota__linha-agua" d="M264 98 L344 98 L342 101 L266 101 Z" />
        <rect className="frota__super" x="282" y="75" width="34" height="16" rx="2" />
        <rect className="frota__super" x="290" y="65" width="20" height="11" rx="1.5" />
        <rect className="frota__janela" x="286" y="79" width="3.5" height="2.5" />
        <rect className="frota__janela" x="292" y="79" width="3.5" height="2.5" />
        <rect className="frota__janela" x="298" y="79" width="3.5" height="2.5" />
        <rect className="frota__janela" x="304" y="79" width="3.5" height="2.5" />
        <rect className="frota__janela" x="294" y="68" width="3" height="2.2" />
        <rect className="frota__janela" x="300" y="68" width="3" height="2.2" />
        <line className="frota__mastro" x1="300" y1="65" x2="300" y2="49" />
        <rect className="frota__casco" x="294" y="53" width="12" height="2.5" rx="1" />
        {/* Canhão de proa */}
        <rect className="frota__super" x="322" y="83" width="11" height="5.5" rx="2" />
        <line className="frota__canhao" x1="332" y1="85" x2="345" y2="81.5" />
        {/* Bandeira à popa */}
        <line className="frota__mastro frota__mastro--fino" x1="262" y1="91" x2="262" y2="80" />
        <path className="frota__bandeira" d="M262 80 L270 82.5 L262 85 Z" />
      </g>

      {/* Submarino (meio submerso, à frente) */}
      <g className="frota__navio frota__navio--submarino">
        <ellipse className="frota__casco" cx="46" cy="119" rx="38" ry="7" />
        <path className="frota__casco" d="M36 113 L53 113 L50.5 101 L39.5 101 Z" />
        <rect className="frota__janela" x="42" y="105" width="3" height="2.2" />
        <line className="frota__mastro frota__mastro--fino" x1="47" y1="101" x2="47" y2="93" />
        <line className="frota__mastro frota__mastro--fino" x1="47" y1="93" x2="51" y2="93" />
      </g>

      {/* Onda da frente */}
      <g className="frota__onda frota__onda--frente">
        <path d="M-90 113 Q-67.5 107 -45 113 T0 113 T45 113 T90 113 T135 113 T180 113 T225 113 T270 113 T315 113 T360 113 T405 113 T450 113 V140 H-90 Z" />
      </g>
    </svg>
  );
}

export default FrotaIlustracao;
