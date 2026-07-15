import { useLocalStorageState } from "./useLocalStorageState";
import { STORAGE_KEYS, ESTATISTICAS_INICIAIS, MOEDAS_POR_VITORIA, MOEDAS_POR_DERROTA } from "../constants";
import { calcularPrecisao } from "../utils/tabuleiro";

// Guarda estatísticas agregadas do jogador entre sessões (localStorage).
export function useEstatisticas() {
  const [estatisticas, setEstatisticas] = useLocalStorageState(
    STORAGE_KEYS.estatisticas,
    ESTATISTICAS_INICIAIS
  );

  // Regista o resultado de uma partida terminada e devolve um resumo
  // (usado para verificar conquistas e mostrar o ecrã de fim de jogo).
  function registarJogo({ venceu, jogadas, tirosDisparados, tirosCertos }) {
    let resumo = null;
    setEstatisticas((atual) => {
      const novo = {
        ...atual,
        jogosJogados: atual.jogosJogados + 1,
        vitorias: atual.vitorias + (venceu ? 1 : 0),
        derrotas: atual.derrotas + (venceu ? 0 : 1),
        tirosDisparados: atual.tirosDisparados + tirosDisparados,
        tirosCertos: atual.tirosCertos + tirosCertos,
        moedas: atual.moedas + (venceu ? MOEDAS_POR_VITORIA : MOEDAS_POR_DERROTA),
      };
      if (venceu && (atual.navioMaisRapido === null || jogadas < atual.navioMaisRapido)) {
        novo.navioMaisRapido = jogadas;
      }
      resumo = {
        venceu,
        jogadas,
        precisao: calcularPrecisao(tirosDisparados, tirosCertos),
        estatisticas: novo,
      };
      return novo;
    });
    return resumo;
  }

  function reiniciarEstatisticas() {
    setEstatisticas(ESTATISTICAS_INICIAIS);
  }

  return { estatisticas, registarJogo, reiniciarEstatisticas, definirEstatisticas: setEstatisticas };
}
