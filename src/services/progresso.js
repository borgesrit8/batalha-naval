// ============================================================
// SINCRONIZAÇÃO DE PROGRESSO NA NUVEM (Firestore)
// Guarda uma cópia das estatísticas/conquistas em users/{uid} para
// que o jogador as recupere em qualquer dispositivo onde faça login.
// O localStorage continua a ser a fonte de dados quando não há sessão.
// ============================================================
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, firebaseConfigurado } from "../lib/firebase";

export async function carregarProgresso(uid) {
  if (!firebaseConfigurado || !uid) return null;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function guardarProgresso(uid, estatisticas, desbloqueadas) {
  if (!firebaseConfigurado || !uid) return;
  const ref = doc(db, "users", uid);
  await setDoc(
    ref,
    { estatisticas, desbloqueadas, atualizadoEm: serverTimestamp() },
    { merge: true }
  );
}

// Junta o progresso local com o da nuvem ficando sempre com o "melhor"
// valor de cada campo — evita perder progresso feito offline.
export function fundirProgresso(local, nuvem) {
  if (!nuvem) return local;
  const estatisticas = { ...local.estatisticas };
  const remoto = nuvem.estatisticas || {};
  Object.keys(estatisticas).forEach((chave) => {
    if (typeof estatisticas[chave] === "number" && typeof remoto[chave] === "number") {
      estatisticas[chave] = Math.max(estatisticas[chave], remoto[chave]);
    }
  });
  if (remoto.navioMaisRapido != null) {
    estatisticas.navioMaisRapido =
      estatisticas.navioMaisRapido == null
        ? remoto.navioMaisRapido
        : Math.min(estatisticas.navioMaisRapido, remoto.navioMaisRapido);
  }
  const desbloqueadas = Array.from(new Set([...(local.desbloqueadas || []), ...(nuvem.desbloqueadas || [])]));
  return { estatisticas, desbloqueadas };
}
