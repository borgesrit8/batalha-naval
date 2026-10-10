import { useState, useEffect } from "react";

// Hook genérico: funciona como useState mas persiste automaticamente
// no localStorage. Evita repetir lógica de leitura/escrita em cada sítio.
// `migrar` (opcional) recebe o valor guardado e devolve-o atualizado — útil
// quando muda o formato ou um valor por omissão entre versões da app.
export function useLocalStorageState(chave, valorInicial, migrar) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = window.localStorage.getItem(chave);
      if (guardado === null) return valorInicial;
      const lido = JSON.parse(guardado);
      return migrar ? migrar(lido) : lido;
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
