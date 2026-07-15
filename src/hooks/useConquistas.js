import { useLocalStorageState } from "./useLocalStorageState";
import { STORAGE_KEYS, CONQUISTAS } from "../constants";

// Mantém a lista de ids de conquistas já desbloqueadas.
export function useConquistas() {
  const [desbloqueadas, setDesbloqueadas] = useLocalStorageState(STORAGE_KEYS.conquistas, []);

  // Verifica todas as conquistas contra as estatísticas mais recentes e
  // devolve as que acabaram de ser desbloqueadas (para mostrar um toast).
  function verificarNovasConquistas(estatisticas, jogoAtual) {
    const novas = [];
    CONQUISTAS.forEach((c) => {
      if (!desbloqueadas.includes(c.id) && c.verificar(estatisticas, jogoAtual)) {
        novas.push(c);
      }
    });
    if (novas.length > 0) {
      setDesbloqueadas((atual) => [...atual, ...novas.map((c) => c.id)]);
    }
    return novas;
  }

  return { desbloqueadas, verificarNovasConquistas, definirDesbloqueadas: setDesbloqueadas };
}
