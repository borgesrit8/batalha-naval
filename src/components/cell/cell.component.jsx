import React from "react";
import "./cell.css";

// Uma única célula do tabuleiro. Puramente apresentacional: recebe o
// estado já calculado e limita-se a escolher classes/animações.
function Cell({ cel, mostrarNavio, emRadar, afundado, onClick }) {
  const acertou = cel.atingida && cel.navio;
  const falhou = cel.atingida && !cel.navio;

  const classes = ["cell"];
  if (falhou) classes.push("cell--falhado");
  if (acertou) classes.push("cell--acerto");
  if (afundado) classes.push("cell--afundado");
  if (!cel.atingida && mostrarNavio && cel.navio) classes.push("cell--navio");
  if (emRadar) classes.push("cell--radar");
  if (!cel.atingida && onClick) classes.push("cell--clicavel");

  let rotulo = "Água";
  if (acertou) rotulo = "Acerto";
  else if (falhou) rotulo = "Falhou";
  else if (mostrarNavio && cel.navio) rotulo = "Navio";

  return (
    <button
      type="button"
      className={classes.join(" ")}
      onClick={onClick}
      disabled={!onClick}
      aria-label={rotulo}
    >
      {falhou && <span className="cell__splash" aria-hidden="true" />}
      {falhou && <span className="cell__cruz" aria-hidden="true" />}
      {acertou && (
        <span className="cell__explosao" aria-hidden="true">
          <span className="cell__explosao-nucleo" />
        </span>
      )}
      {afundado && <span className="cell__afundado-icone" aria-hidden="true">☠</span>}
    </button>
  );
}

export default React.memo(Cell);
