import { useState, useEffect } from "react";

// Hook genérico: funciona como useState mas persiste automaticamente
// no localStorage. Evita repetir lógica de leitura/escrita em cada sítio.
export function useLocalStorageState(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = window.localStorage.getItem(chave);
      return guardado !== null ? JSON.parse(guardado) : valorInicial;
    } catch (e) {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(chave, JSON.stringify(valor));
    } catch (e) {
      // localStorage pode falhar em modo privado — o jogo continua a funcionar em memória.
    }
  }, [chave, valor]);

  return [valor, setValor];
}
