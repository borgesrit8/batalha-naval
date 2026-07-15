import React, { useState, useEffect, useMemo, useRef } from "react";
import "./online-game.css";
import Board from "../board/board.component";
import GameOver from "../game-over/game-over.component";
import { useAuth } from "../../context/AuthContext";
import { FROTA, NOMES_NAVIOS } from "../../constants";
import {
  criarTabuleiro,
  posicaoValida,
  colocarNavio,
  gerarFrotaAleatoria,
  copiarTabuleiro,
  todosAfundados,
  navioAfundadoNestaCelula,
  calcularPrecisao,
} from "../../utils/tabuleiro";
import { ouvirSala, ouvirJogadas, guardarFrota, iniciarBatalha, dispararOnline, resolverJogada } from "../../services/salas";
import { useSom } from "../../hooks/useSom";

// Partida multiplayer completa: colocação de frota -> espera pelo
// adversário -> batalha sincronizada por turnos via Firestore -> fim.
function OnlineGame({ codigo, sou, onSair }) {
  const { utilizador } = useAuth();
  const tocar = useSom();
  const meuUid = utilizador.uid;

  const [sala, setSala] = useState(null);
  const [jogadas, setJogadas] = useState([]);

  const [tabuleiroProprio, setTabuleiroProprio] = useState(criarTabuleiro());
  const [navioAtual, setNavioAtual] = useState(0);
  const [horizontal, setHorizontal] = useState(true);
  const [erro, setErro] = useState("");
  const [pronto, setPronto] = useState(false);

  const processadasRef = useRef(new Set());
  const tabuleiroProprioRef = useRef(tabuleiroProprio);
  tabuleiroProprioRef.current = tabuleiroProprio;

  useEffect(() => {
    const cancelarSala = ouvirSala(codigo, setSala);
    const cancelarJogadas = ouvirJogadas(codigo, setJogadas);
    return () => {
      cancelarSala();
      cancelarJogadas();
    };
  }, [codigo]);

  // Quando ambos os jogadores estão prontos, o jogador A é responsável por
  // iniciar a batalha (evita que os dois tentem fazê-lo em simultâneo).
  useEffect(() => {
    if (!sala) return;
    if (sala.estado === "colocacao" && sala.prontoA && sala.prontoB && sou === "A") {
      iniciarBatalha(codigo, sala.jogadorA.uid);
    }
  }, [sala, codigo, sou]);

  // Processa disparos recebidos do adversário: calcula acerto/afundamento
  // usando a MINHA frota local (só eu a tenho) e reporta o resultado.
  useEffect(() => {
    if (!sala || sala.estado !== "batalha") return;
    jogadas.forEach((j) => {
      if (j.atirador === meuUid) return;
      if (j.resultado !== null) return;
      if (processadasRef.current.has(j.id)) return;
      processadasRef.current.add(j.id);

      const novoTab = copiarTabuleiro(tabuleiroProprioRef.current);
      novoTab[j.l][j.c].atingida = true;
      const acertou = novoTab[j.l][j.c].navio !== null;
      const afundado = acertou && navioAfundadoNestaCelula(novoTab, j.l, j.c);
      setTabuleiroProprio(novoTab);
      tocar(acertou ? "acerto" : "agua");

      const perdi = todosAfundados(novoTab);
      resolverJogada(codigo, j.id, {
        acertou,
        afundado,
        terminouCom: perdi ? j.atirador : null,
      });
    });
  }, [jogadas, sala, meuUid, codigo, tocar]);

  function handleCliqueColocacao(l, c) {
    if (navioAtual >= FROTA.length) return;
    const tamanho = FROTA[navioAtual];
    if (!posicaoValida(tabuleiroProprio, l, c, tamanho, horizontal)) {
      setErro("Posição inválida.");
      return;
    }
    setErro("");
    tocar("clique");
    setTabuleiroProprio(colocarNavio(tabuleiroProprio, l, c, tamanho, horizontal, "navio-" + navioAtual));
    setNavioAtual(navioAtual + 1);
  }

  async function handleConfirmarFrota() {
    await guardarFrota(codigo, meuUid, tabuleiroProprio, sou);
    setPronto(true);
  }

  async function handleDisparar(l, c) {
    if (!sala || sala.estado !== "batalha" || sala.vez !== meuUid) return;
    const adversarioUid = sou === "A" ? sala.jogadorB.uid : sala.jogadorA.uid;
    tocar("clique");
    await dispararOnline(codigo, meuUid, adversarioUid, l, c);
  }

  const tabuleiroAdversarioVisivel = useMemo(() => {
    const tab = criarTabuleiro();
    jogadas
      .filter((j) => j.atirador === meuUid)
      .forEach((j) => {
        tab[j.l][j.c].atingida = true;
        if (j.resultado) {
          tab[j.l][j.c].navio = j.afundado ? "afundado-" + j.id : "hit-" + j.id;
        }
      });
    return tab;
  }, [jogadas, meuUid]);

  const calcularAfundadoAdversario = (tab, l, c) =>
    typeof tab[l][c].navio === "string" && tab[l][c].navio.startsWith("afundado-");

  if (!sala) {
    return (
      <div id="online-game" className="animar-entrada">
        <p className="online-game__aviso">A ligar à sala {codigo}…</p>
      </div>
    );
  }

  if (sala.estado === "espera") {
    return (
      <div id="online-game" className="animar-entrada">
        <div className="online-game__cartao vidro">
          <h2>Sala {codigo}</h2>
          <p>Partilha este código com um amigo para ele entrar:</p>
          <p className="online-game__codigo">{codigo}</p>
          <p className="online-game__aviso">⏳ À espera que o segundo jogador entre…</p>
          <button className="auth__voltar" onClick={onSair}>
            ← Sair da sala
          </button>
        </div>
      </div>
    );
  }

  if (sala.estado === "colocacao") {
    const frotaCompleta = navioAtual >= FROTA.length;
    return (
      <div id="online-game" className="animar-entrada">
        <h2 className="online-game__titulo">Sala {codigo} — posiciona a tua frota</h2>
        {pronto ? (
          <p className="online-game__aviso">✅ Frota confirmada! À espera do adversário…</p>
        ) : (
          <div id="setup-layout">
            <div id="setup-controlos" className="vidro">
              <fieldset>
                <legend>Orientação</legend>
                <div className="setup-orientacao">
                  <button className={"btn btn-secundaria" + (horizontal ? " is-ativo" : "")} onClick={() => setHorizontal(true)}>
                    ↔ Horizontal
                  </button>
                  <button className={"btn btn-secundaria" + (!horizontal ? " is-ativo" : "")} onClick={() => setHorizontal(false)}>
                    ↕ Vertical
                  </button>
                </div>
              </fieldset>
              <div id="lista-navios">
                {FROTA.map((tamanho, i) => (
                  <p key={i} className={i < navioAtual ? "setup__navio--feito" : i === navioAtual ? "setup__navio--atual" : "setup__navio"}>
                    {i < navioAtual ? "✔" : i === navioAtual ? "▶" : "○"} {NOMES_NAVIOS[tamanho]} ({tamanho})
                  </p>
                ))}
              </div>
              <div className="setup-acoes-rapidas">
                <button className="btn btn-secundaria" onClick={() => { setTabuleiroProprio(criarTabuleiro()); setNavioAtual(0); }}>
                  Reiniciar
                </button>
                <button className="btn btn-secundaria" onClick={() => { setTabuleiroProprio(gerarFrotaAleatoria()); setNavioAtual(FROTA.length); }}>
                  🎲 Auto-colocar
                </button>
              </div>
              {erro && <p className="setup__erro">{erro}</p>}
              <button className="btn btn-primaria setup__iniciar" onClick={handleConfirmarFrota} disabled={!frotaCompleta}>
                ✅ Confirmar Frota
              </button>
            </div>
            <Board
              titulo="A tua frota"
              tabuleiro={tabuleiroProprio}
              mostrarNavios
              radarArea={null}
              onCellClick={!frotaCompleta ? handleCliqueColocacao : null}
              destacado
            />
          </div>
        )}
      </div>
    );
  }

  if (sala.estado === "fim") {
    const nomeVencedor = sala.vencedor === meuUid ? "Tu" : sala.jogadorA.uid === sala.vencedor ? sala.jogadorA.nome : sala.jogadorB.nome;
    const meusTiros = jogadas.filter((j) => j.atirador === meuUid);
    const acertos = meusTiros.filter((j) => j.resultado === true).length;
    return (
      <GameOver
        vencedor={nomeVencedor}
        nomeJogador="Tu"
        jogadas={meusTiros.length}
        precisao={calcularPrecisao(meusTiros.length, acertos)}
        moedasGanhas={sala.vencedor === meuUid ? 20 : 5}
        novasConquistas={[]}
        onJogarNovamente={onSair}
        onMenu={onSair}
      />
    );
  }

  // sala.estado === "batalha"
  const minhaVez = sala.vez === meuUid;
  const nomeAdversario = sou === "A" ? sala.jogadorB?.nome : sala.jogadorA?.nome;

  return (
    <div id="online-game" className="animar-entrada">
      <header className="jogo-cabecalho">
        <h1>Sala {codigo} — vs {nomeAdversario}</h1>
        <p>{minhaVez ? "É a tua vez de disparar!" : `A aguardar disparo de ${nomeAdversario}…`}</p>
      </header>
      <main id="jogo-layout">
        <Board titulo="A tua frota" tabuleiro={tabuleiroProprio} mostrarNavios radarArea={null} onCellClick={null} />
        <Board
          titulo={"Tabuleiro de " + nomeAdversario}
          tabuleiro={tabuleiroAdversarioVisivel}
          mostrarNavios={false}
          radarArea={null}
          onCellClick={minhaVez ? handleDisparar : null}
          calcularAfundado={calcularAfundadoAdversario}
          destacado={minhaVez}
        />
      </main>
      <button className="auth__voltar" onClick={onSair}>
        ← Abandonar partida
      </button>
    </div>
  );
}

export default OnlineGame;
