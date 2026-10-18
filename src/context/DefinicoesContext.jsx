import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { STORAGE_KEYS } from "../constants";
import { idiomaDoDispositivo } from "../i18n/idioma";

// Versão do visual: quando muda, o tema volta ao claro (o novo design por omissão).
const VERSAO_VISUAL = 2;

const DEFINICOES_INICIAIS = {
  versaoVisual: VERSAO_VISUAL,
  tema: "claro", // "claro" | "escuro"
  idioma: idiomaDoDispositivo(), // "pt" | "en"
  somAtivo: true,
  musicaAtiva: true,
  dificuldade: "normal", // "facil" | "normal" | "dificil"
};

const DefinicoesContext = createContext(null);

function migrarDefinicoes(guardadas) {
  let def = guardadas || {};
  if (def.versaoVisual !== VERSAO_VISUAL) {
    def = { ...DEFINICOES_INICIAIS, ...def, tema: "claro", versaoVisual: VERSAO_VISUAL };
  }
  // Quem já tinha a app antes de haver línguas fica com a do telemóvel
  if (!def.idioma) def = { ...def, idioma: idiomaDoDispositivo() };
  return def;
}

// Contexto global para preferências do jogador: tema, som, música,
// dificuldade. Persistido em localStorage e aplicado ao <html> via
// atributo data-tema, para que todo o CSS reaja automaticamente.
export function DefinicoesProvider({ children }) {
  const [definicoes, setDefinicoes] = useLocalStorageState(
    STORAGE_KEYS.definicoes,
    DEFINICOES_INICIAIS,
    migrarDefinicoes
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-tema", definicoes.tema);
  }, [definicoes.tema]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", definicoes.idioma === "en" ? "en" : "pt");
  }, [definicoes.idioma]);

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
