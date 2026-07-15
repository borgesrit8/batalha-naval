import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { STORAGE_KEYS } from "../constants";

const DEFINICOES_INICIAIS = {
  tema: "escuro", // "claro" | "escuro"
  somAtivo: true,
  musicaAtiva: true,
  dificuldade: "normal", // "facil" | "normal" | "dificil"
};

const DefinicoesContext = createContext(null);

// Contexto global para preferências do jogador: tema, som, música,
// dificuldade. Persistido em localStorage e aplicado ao <html> via
// atributo data-tema, para que todo o CSS reaja automaticamente.
export function DefinicoesProvider({ children }) {
  const [definicoes, setDefinicoes] = useLocalStorageState(
    STORAGE_KEYS.definicoes,
    DEFINICOES_INICIAIS
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-tema", definicoes.tema);
  }, [definicoes.tema]);

  function atualizarDefinicao(chave, valor) {
    setDefinicoes((atual) => ({ ...atual, [chave]: valor }));
  }

  return (
    <DefinicoesContext.Provider value={{ definicoes, atualizarDefinicao }}>
      {children}
    </DefinicoesContext.Provider>
  );
}

export function useDefinicoes() {
  const ctx = useContext(DefinicoesContext);
  if (!ctx) throw new Error("useDefinicoes tem de ser usado dentro de <DefinicoesProvider>");
  return ctx;
}
