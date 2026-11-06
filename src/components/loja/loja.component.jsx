import React, { useState } from "react";
import "./loja.css";
import { useT } from "../../i18n";
import { useDefinicoes } from "../../context/DefinicoesContext";
import { useSom } from "../../hooks/useSom";
import { TEMAS_TABULEIRO, CATEGORIAS_LOJA, MOEDAS_POR_DIA } from "../../constants";
import { saldoMoedas } from "../../utils/tabuleiro";
import EnfeitesTema from "../board/enfeites-tema.component";

// Tabuleiro 4×4 de amostra: n = navio, a = água/falha, x = acerto, f = afundado
const AMOSTRA = ["nnn.", ".ax.", "ff.a", "..a."].join("").split("");

function MiniTabuleiro({ tema }) {
  return (
    <div className={"loja__preview tema-preview tabuleiro-tema--" + tema.id}>
      <EnfeitesTema tema={tema} pequeno />
      {AMOSTRA.map((c, i) => (
        <span key={i} className={"loja__mini loja__mini--" + c}>
          {c === "a" && (tema.falha || <i className="loja__cruz" />)}
          {c === "x" && (tema.acerto || "💥")}
        </span>
      ))}
    </div>
  );
}

// Um tema está à venda se não tiver época ou se estivermos num dos seus meses.
function aVenda(tema, mesAtual) {
  return !tema.meses || tema.meses.includes(mesAtual);
}

function Loja({ estatisticas, onComprar, onVoltar }) {
  const t = useT();
  const tocar = useSom();
  const { definicoes, atualizarDefinicao } = useDefinicoes();
  const [categoria, setCategoria] = useState("criancas");
  const [comprouAgora, setComprouAgora] = useState(null);

  const saldo = saldoMoedas(estatisticas, TEMAS_TABULEIRO);
  const comprados = estatisticas.temasComprados || [];
  const mesAtual = new Date().getMonth() + 1;
  const emUso = definicoes.temaTabuleiro;

  function usar(id) {
    tocar("clique");
    atualizarDefinicao("temaTabuleiro", id);
  }

  function comprar(tema) {
    if (saldo < tema.preco) return;
    tocar("clique");
    onComprar(tema.id);
    atualizarDefinicao("temaTabuleiro", tema.id);
    setComprouAgora(tema.id);
  }

  // Temas da época: os que estão à venda primeiro, depois os já comprados,
  // e por fim os que só voltam noutra altura do ano.
  const lista = TEMAS_TABULEIRO.filter((tema) => tema.categoria === categoria).sort((a, b) => {
    const ordem = (tema) => (aVenda(tema, mesAtual) ? 0 : comprados.includes(tema.id) ? 1 : 2);
    return ordem(a) - ordem(b);
  });

  function botao(tema) {
    const temIt = comprados.includes(tema.id);
    if (emUso === tema.id) {
      return <span className="loja__botao loja__botao--uso">{t("loja.emUso")}</span>;
    }
    if (temIt) {
      return (
        <button className="loja__botao loja__botao--usar" onClick={() => usar(tema.id)}>
          {t("loja.usar")}
        </button>
      );
    }
    if (!aVenda(tema, mesAtual)) {
      return <span className="loja__botao loja__botao--fechado">{t("loja.disponivel", tema.meses)}</span>;
    }
    if (saldo < tema.preco) {
      return (
        <button className="loja__botao loja__botao--comprar" disabled>
          {t("loja.comprar", tema.preco)}
          <small>{t("loja.faltam", tema.preco - saldo)}</small>
        </button>
      );
    }
    return (
      <button className="loja__botao loja__botao--comprar" onClick={() => comprar(tema)}>
        {t("loja.comprar", tema.preco)}
      </button>
    );
  }

  return (
    <div id="loja" className="animar-entrada">
      <div className="loja__topo">
        <button className="loja__voltar" onClick={onVoltar} aria-label={t("loja.voltar")}>
          ←
        </button>
        <h2 className="loja__titulo">{t("loja.titulo")}</h2>
        <span className="loja__saldo">🪙 {saldo}</span>
      </div>

      <p className="loja__premio">{t("loja.premioDiario", MOEDAS_POR_DIA)}</p>

      <div className="loja__separadores" role="tablist">
        {CATEGORIAS_LOJA.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={categoria === c}
            className={"loja__separador" + (categoria === c ? " loja__separador--ativo" : "")}
            onClick={() => setCategoria(c)}
          >
            {t("loja.categorias." + c)}
          </button>
        ))}
      </div>

      {comprouAgora && <p className="loja__aviso">{t("loja.comprado")}</p>}

      <div className="loja__grelha">
        {lista.map((tema) => (
          <div
            key={tema.id}
            className={
              "loja__cartao" +
              (emUso === tema.id ? " loja__cartao--uso" : "") +
              (!aVenda(tema, mesAtual) && !comprados.includes(tema.id) ? " loja__cartao--fora" : "")
            }
          >
            <MiniTabuleiro tema={tema} />
            <strong className="loja__nome">{t("loja.temas." + tema.id)}</strong>
            {botao(tema)}
          </div>
        ))}
      </div>

      <div className="loja__classico">
        <strong>{t("loja.temas.classico")}</strong>
        {emUso === "classico" ? (
          <span className="loja__botao loja__botao--uso">{t("loja.emUso")}</span>
        ) : (
          <button className="loja__botao loja__botao--usar" onClick={() => usar("classico")}>
            {t("loja.gratis")} · {t("loja.usar")}
          </button>
        )}
      </div>
    </div>
  );
}

export default Loja;
