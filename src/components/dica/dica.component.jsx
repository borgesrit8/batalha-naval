import React from "react";
import "./dica.css";
import { useT } from "../../i18n";

// Caixa de ajuda para quem joga pela primeira vez.
// "flutuante": aparece por cima do ecrã, com fundo escurecido.
function Dica({ titulo, itens, onFechar, flutuante = false }) {
  const t = useT();
  const caixa = (
    <div className={"dica" + (flutuante ? " dica--flutuante" : "")} role="dialog" aria-label={titulo}>
      <p className="dica__titulo">💡 {titulo}</p>
      <ul className="dica__lista">
        {itens.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button type="button" className="btn btn-primaria dica__botao" onClick={onFechar}>
        {t("dicas.percebi")}
      </button>
    </div>
  );
  if (!flutuante) return caixa;
  return <div className="dica__fundo">{caixa}</div>;
}

export default Dica;
