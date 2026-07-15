import { useEffect } from "react";
import { motorSom } from "../utils/som";
import { useDefinicoes } from "../context/DefinicoesContext";

// Sincroniza o motor de som com as definições do utilizador e devolve
// uma função `tocar(nome)` pronta a usar em qualquer componente.
export function useSom() {
  const { definicoes } = useDefinicoes();

  useEffect(() => {
    motorSom.definirSomAtivo(definicoes.somAtivo);
  }, [definicoes.somAtivo]);

  useEffect(() => {
    motorSom.definirMusicaAtiva(definicoes.musicaAtiva);
    if (definicoes.musicaAtiva) motorSom.iniciarMusica();
    else motorSom.pararMusica();
  }, [definicoes.musicaAtiva]);

  return motorSom.tocar.bind(motorSom);
}
