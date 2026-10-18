import { useCallback } from "react";
import { TEXTOS } from "./textos";
import { useDefinicoes } from "../context/DefinicoesContext";

export { idiomaDoDispositivo } from "./idioma";

// Procura uma chave do tipo "jogo.tuaVez" no dicionário da língua.
// Se faltar a tradução, usa o português; se nem isso existir, mostra a chave.
function procurar(dic, chave) {
  return chave.split(".").reduce((o, k) => (o == null ? undefined : o[k]), dic);
}

export function traduzir(idioma, chave, ...args) {
  let valor = procurar(TEXTOS[idioma] || TEXTOS.pt, chave);
  if (valor === undefined) valor = procurar(TEXTOS.pt, chave);
  if (valor === undefined) return chave;
  return typeof valor === "function" ? valor(...args) : valor;
}

// Hook para os componentes: const t = useT(); t("menu.jogar")
export function useT() {
  const { definicoes } = useDefinicoes();
  const idioma = definicoes.idioma || "pt";
  return useCallback((chave, ...args) => traduzir(idioma, chave, ...args), [idioma]);
}
