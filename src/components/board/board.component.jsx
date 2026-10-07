import React, { useMemo } from "react";
import "./board.css";
import Cell from "../cell/cell.component";
import { navioAfundadoNestaCelula } from "../../utils/tabuleiro";

// Renderiza um tabuleiro 10x10 completo, com letras/números de referência
// (como num jogo de batalha naval "a sério") e delega cada célula ao
// componente <Cell>, que decide a sua própria aparência/animação.
function Board({ titulo, tabuleiro, mostrarNavios, radarArea, onCellClick, destacado, calcularAfundado = navioAfundadoNestaCelula }) {
  const letras = useMemo(() => "ABCDEFGHIJ".split(""), []);

  return (
    <div className={"board-wrapper" + (destacado ? " board-wrapper--destaque" : "")}>
      {titulo && <h3 className="board-wrapper__titulo">{titulo}</h3>}
      <div className="board vidro">
        <div className="board__linha board__linha--cabecalho">
          <div className="board__celula-vazia" />
          {letras.map((letra) => (
            <div key={letra} className="board__rotulo">{letra}</div>
          ))}
        </div>
        {tabuleiro.map((linha, l) => (
          <div key={l} className="board__linha">
            <div className="board__rotulo">{l + 1}</div>
            {linha.map((cel, c) => {
              let emRadar = false;
              if (radarArea !== null) {
                if (
                  l >= radarArea.l &&
                  l <= radarArea.l + 1 &&
                  c >= radarArea.c &&
                  c <= radarArea.c + 1
                ) {
                  emRadar = true;
                }
              }

              const afundado = cel.atingida && cel.navio && calcularAfundado(tabuleiro, l, c);

              return (
                <Cell
                  key={c}
                  cel={cel}
                  mostrarNavio={mostrarNavios}
                  emRadar={emRadar}
                  afundado={afundado}
                  onClick={
                    onCellClick && !cel.atingida ? () => onCellClick(l, c) : null
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Board);
