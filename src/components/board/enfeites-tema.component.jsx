import React from "react";

const CORES_BANDEIROLAS = ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#e67e22"];
const CONFETES = [
  [3, 8, "#f1c40f"],
  [94, 14, "#2ecc71"],
  [2, 55, "#e74c3c"],
  [94, 62, "#3498db"],
  [50, 2, "#ff7ad9"],
  [28, 96, "#f1c40f"],
  [74, 96, "#2ecc71"],
];

// Bonecos nos cantos do tabuleiro e enfeites especiais (neve, bandeirolas,
// confetes) dos temas da loja. Puramente decorativo.
function EnfeitesTema({ tema, pequeno = false }) {
  if (!tema.decos && !tema.extra) return null;
  return (
    <div className={"enfeites" + (pequeno ? " enfeites--pequeno" : "")} aria-hidden="true">
      {tema.extra === "neve" && <span className="enfeites__neve" />}
      {tema.extra === "bandeirolas" && (
        <span className="enfeites__bandeirolas">
          {Array.from({ length: pequeno ? 6 : 14 }, (_, i) => (
            <i key={i} style={{ borderTopColor: CORES_BANDEIROLAS[i % CORES_BANDEIROLAS.length] }} />
          ))}
        </span>
      )}
      {tema.extra === "confete" &&
        CONFETES.map(([x, y, cor], i) => (
          <i key={i} className="enfeites__confete" style={{ left: x + "%", top: y + "%", background: cor }} />
        ))}
      {tema.decos && pequeno && <span className="enfeites__boneco enfeites__boneco--1">{tema.decos[0]}</span>}
      {tema.decos &&
        !pequeno &&
        tema.decos.map((emoji, i) => (
          <span key={i} className={"enfeites__boneco enfeites__boneco--" + i}>
            {emoji}
          </span>
        ))}
    </div>
  );
}

export default EnfeitesTema;
