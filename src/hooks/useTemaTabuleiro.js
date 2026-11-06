import { useDefinicoes } from "../context/DefinicoesContext";
import { TEMAS_TABULEIRO } from "../constants";

// Devolve o tema do tabuleiro escolhido nas definições (com os símbolos e
// bonecos), ou o clássico se o guardado já não existir.
export function useTemaTabuleiro() {
  const { definicoes } = useDefinicoes();
  return TEMAS_TABULEIRO.find((t) => t.id === definicoes.temaTabuleiro) || TEMAS_TABULEIRO[0];
}
