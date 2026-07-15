import React, { useState, useCallback, useRef, useEffect } from "react";
import "./App.css";
import {
  Setup,
  Board,
  Dashboard,
  GameOver,
  MainMenu,
  Settings,
  HowToPlay,
  Stats,
  Achievements,
  AchievementToast,
  Splash,
  Auth,
  Lobby,
  OnlineGame,
} from "./components";
import { DefinicoesProvider, useDefinicoes } from "./context/DefinicoesContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { carregarProgresso, guardarProgresso, fundirProgresso } from "./services/progresso";
import {
  COMBUSTIVEL_INICIAL,
  CUSTO_DISPARO,
  RADAR_SEGUNDOS,
  DIFICULDADES,
  MOEDAS_POR_VITORIA,
  MOEDAS_POR_DERROTA,
} from "./constants";
import {
  copiarTabuleiro,
  todosAfundados,
  ataqueAleatorio,
  ataqueParidade,
  celulasAdjacentes,
  encontrarAreaRadar,
  calcularPrecisao,
} from "./utils/tabuleiro";
import { useEstatisticas } from "./hooks/useEstatisticas";
import { useConquistas } from "./hooks/useConquistas";
import { useSom } from "./hooks/useSom";

// Fases possíveis da aplicação. Mantidas como string simples (em vez de
// enum/typescript) para não sair do estilo do projeto original.
const FASES = {
  SPLASH: "splash",
  MENU: "menu",
  SETUP: "setup",
  JOGO: "jogo",
  FIM: "fim",
  DEFINICOES: "definicoes",
  ESTATISTICAS: "estatisticas",
  CONQUISTAS: "conquistas",
  COMO_JOGAR: "comoJogar",
  AUTH: "auth",
  LOBBY: "lobby",
  JOGO_ONLINE: "jogoOnline",
};

function JogoInterno() {
  const { definicoes } = useDefinicoes();
  const { utilizador } = useAuth();
  const { estatisticas, registarJogo, definirEstatisticas } = useEstatisticas();
  const { desbloqueadas, verificarNovasConquistas, definirDesbloqueadas } = useConquistas();
  const tocar = useSom();

  const [fase, setFase] = useState(FASES.SPLASH);
  const faseAnteriorMenu = useRef(FASES.MENU);
  const progressoCarregadoRef = useRef(null);

  const [salaCodigo, setSalaCodigo] = useState(null);
  const [salaSou, setSalaSou] = useState(null);
  const [destinoAuth, setDestinoAuth] = useState(FASES.MENU);

  function handleAbrirConta() {
    setDestinoAuth(FASES.MENU);
    setFase(FASES.AUTH);
  }

  function handleAbrirMultiplayer() {
    if (utilizador) {
      setFase(FASES.LOBBY);
    } else {
      setDestinoAuth(FASES.LOBBY);
      setFase(FASES.AUTH);
    }
  }

  function handleEntrouSala(codigo, sou) {
    setSalaCodigo(codigo);
    setSalaSou(sou);
    setFase(FASES.JOGO_ONLINE);
  }

  function handleSairSala() {
    setSalaCodigo(null);
    setSalaSou(null);
    setFase(FASES.MENU);
  }

  const [nomeJogador, setNomeJogador] = useState("");
  const [tabJogador, setTabJogador] = useState([]);
  const [tabPC, setTabPC] = useState([]);
  const [debug, setDebug] = useState(false);

  const [vezDoJogador, setVezDoJogador] = useState(true);
  const [combustivel, setCombustivel] = useState(COMBUSTIVEL_INICIAL);
  const [jogadas, setJogadas] = useState(0);
  const [vencedor, setVencedor] = useState("");

  const [tirosJogador, setTirosJogador] = useState(0);
  const [tirosCertosJogador, setTirosCertosJogador] = useState(0);

  const [radarDisponivel, setRadarDisponivel] = useState(false);
  const [radarArea, setRadarArea] = useState(null);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  const [modoIA, setModoIA] = useState("aleatorio");
  const [alvosIA, setAlvosIA] = useState([]);

  const [novasConquistas, setNovasConquistas] = useState([]);
  const jogoRegistadoRef = useRef(false);

  const dificuldadeAtual = DIFICULDADES[definicoes.dificuldade] || DIFICULDADES.normal;

  function abrirOverlay(destino) {
    faseAnteriorMenu.current = fase === FASES.MENU ? FASES.MENU : faseAnteriorMenu.current;
    setFase(destino);
  }

  function handleIniciar(dados) {
    setNomeJogador(dados.nome);
    setTabJogador(dados.tabJogador);
    setTabPC(dados.tabPC);
    setDebug(dados.debug);
    setFase(FASES.JOGO);
    setVezDoJogador(true);
    setCombustivel(COMBUSTIVEL_INICIAL);
    setJogadas(0);
    setTirosJogador(0);
    setTirosCertosJogador(0);
    setVencedor("");
    setRadarDisponivel(false);
    setRadarArea(null);
    setModoIA("aleatorio");
    setAlvosIA([]);
    setNovasConquistas([]);
    jogoRegistadoRef.current = false;
  }

  function handleDisparo(l, c) {
    if (!vezDoJogador || fase !== FASES.JOGO) return;

    const novoCombustivel = combustivel - CUSTO_DISPARO;
    if (novoCombustivel <= 0) {
      tocar("agua");
      setVencedor("Computador");
      setFase(FASES.FIM);
      return;
    }

    const novoTab = copiarTabuleiro(tabPC);
    novoTab[l][c].atingida = true;
    const acertou = novoTab[l][c].navio !== null;

    tocar(acertou ? "acerto" : "agua");

    let combustivelFinal = novoCombustivel;
    if (acertou) {
      combustivelFinal = Math.min(COMBUSTIVEL_INICIAL, novoCombustivel + 10);
    }

    const segundosUsados = dificuldadeAtual.turnoSegundos - segundosRestantes;
    if (acertou && segundosUsados < RADAR_SEGUNDOS) {
      setRadarDisponivel(true);
    }

    setTabPC(novoTab);
    setCombustivel(combustivelFinal);
    setRadarArea(null);
    setJogadas((j) => j + 1);
    setTirosJogador((t) => t + 1);
    if (acertou) setTirosCertosJogador((t) => t + 1);

    if (todosAfundados(novoTab)) {
      setVencedor(nomeJogador);
      setFase(FASES.FIM);
      return;
    }

    setVezDoJogador(false);
    setTimeout(() => atacarPC(novoTab, tabJogador, modoIA, alvosIA, jogadas + 1), 800);
  }

  function atacarPC(tabPCAtual, tabJAtual, modo, alvos, jogadasAtuais) {
    let l, c;
    const errarPerseguicao = modo === "cacar" && alvos.length > 0 && Math.random() < dificuldadeAtual.chanceErroPerseguicao;

    if (modo === "cacar" && alvos.length > 0 && !errarPerseguicao) {
      const alvo = alvos[0];
      l = alvo.l;
      c = alvo.c;
    } else {
      const pos = dificuldadeAtual.usarParidade ? ataqueParidade(tabJAtual) : ataqueAleatorio(tabJAtual);
      l = pos.l;
      c = pos.c;
    }

    const novoTab = copiarTabuleiro(tabJAtual);
    novoTab[l][c].atingida = true;
    const acertou = novoTab[l][c].navio !== null;

    let novoModo = "aleatorio";
    let novosAlvos = [];

    if (acertou) {
      const adjacentes = celulasAdjacentes(novoTab, l, c);
      if (adjacentes.length > 0) {
        novoModo = "cacar";
        novosAlvos = [...alvos.slice(1), ...adjacentes];
      }
    } else {
      novoModo = alvos.length > 1 ? "cacar" : "aleatorio";
      novosAlvos = alvos.slice(1);
    }

    setTabJogador(novoTab);
    setModoIA(novoModo);
    setAlvosIA(novosAlvos);
    setJogadas(jogadasAtuais + 1);

    if (todosAfundados(novoTab)) {
      setVencedor("Computador");
      setFase(FASES.FIM);
      return;
    }

    setVezDoJogador(true);
  }

  function handleTempoEsgotado() {
    if (!vezDoJogador || fase !== FASES.JOGO) return;

    const novoCombustivel = combustivel - 5;
    if (novoCombustivel <= 0) {
      setVencedor("Computador");
      setFase(FASES.FIM);
      return;
    }

    setCombustivel(novoCombustivel);
    setVezDoJogador(false);
    setTimeout(() => atacarPC(tabPC, tabJogador, modoIA, alvosIA, jogadas), 800);
  }

  function handleRadar() {
    if (!radarDisponivel) return;
    tocar("radar");
    const area = encontrarAreaRadar(tabPC);
    setRadarArea(area);
    setRadarDisponivel(false);
  }

  const handleSegundos = useCallback((s) => setSegundosRestantes(s), []);

  // Ao autenticar, junta o progresso guardado na nuvem com o local (fica
  // sempre com o melhor de cada). Só corre uma vez por sessão de login.
  useEffect(() => {
    if (!utilizador || progressoCarregadoRef.current === utilizador.uid) return;
    progressoCarregadoRef.current = utilizador.uid;
    carregarProgresso(utilizador.uid).then((nuvem) => {
      const fundido = fundirProgresso({ estatisticas, desbloqueadas }, nuvem);
      definirEstatisticas(fundido.estatisticas);
      definirDesbloqueadas(fundido.desbloqueadas);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utilizador]);

  // Guarda na nuvem sempre que estatísticas/conquistas mudam, se houver sessão.
  useEffect(() => {
    if (!utilizador) return;
    guardarProgresso(utilizador.uid, estatisticas, desbloqueadas);
  }, [utilizador, estatisticas, desbloqueadas]);

  // Regista o resultado assim que o jogo termina (uma única vez por partida).
  useEffect(() => {
    if (fase !== FASES.FIM || jogoRegistadoRef.current) return;
    jogoRegistadoRef.current = true;

    const venceu = vencedor === nomeJogador;
    const resumo = registarJogo({
      venceu,
      jogadas,
      tirosDisparados: tirosJogador,
      tirosCertos: tirosCertosJogador,
    });

    if (resumo) {
      const novas = verificarNovasConquistas(resumo.estatisticas, {
        venceu,
        jogadas,
        precisao: resumo.precisao,
      });
      setNovasConquistas(novas);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase]);

  return (
    <div id="container">
      {fase === FASES.SPLASH && <Splash onTerminar={() => setFase(FASES.MENU)} />}

      {fase === FASES.MENU && (
        <MainMenu
          moedas={estatisticas.moedas}
          onJogar={() => setFase(FASES.SETUP)}
          onMultiplayer={handleAbrirMultiplayer}
          onDefinicoes={() => abrirOverlay(FASES.DEFINICOES)}
          onEstatisticas={() => abrirOverlay(FASES.ESTATISTICAS)}
          onConquistas={() => abrirOverlay(FASES.CONQUISTAS)}
          onComoJogar={() => abrirOverlay(FASES.COMO_JOGAR)}
          onConta={handleAbrirConta}
        />
      )}

      {fase === FASES.AUTH && (
        <Auth onEntrou={() => setFase(destinoAuth)} onVoltar={() => setFase(FASES.MENU)} />
      )}
      {fase === FASES.LOBBY && <Lobby onEntrouSala={handleEntrouSala} onVoltar={() => setFase(FASES.MENU)} />}
      {fase === FASES.JOGO_ONLINE && salaCodigo && (
        <OnlineGame codigo={salaCodigo} sou={salaSou} onSair={handleSairSala} />
      )}

      {fase === FASES.DEFINICOES && <Settings onVoltar={() => setFase(FASES.MENU)} />}
      {fase === FASES.ESTATISTICAS && <Stats estatisticas={estatisticas} onVoltar={() => setFase(FASES.MENU)} />}
      {fase === FASES.CONQUISTAS && (
        <Achievements desbloqueadas={desbloqueadas} onVoltar={() => setFase(FASES.MENU)} />
      )}
      {fase === FASES.COMO_JOGAR && <HowToPlay onVoltar={() => setFase(FASES.MENU)} />}

      {fase === FASES.SETUP && <Setup onIniciar={handleIniciar} onVoltarMenu={() => setFase(FASES.MENU)} />}

      {fase === FASES.JOGO && (
        <>
          <header className="jogo-cabecalho">
            <h1>Batalha Naval Avançada</h1>
            <p>Dificuldade: {dificuldadeAtual.nome}</p>
          </header>
          <main id="jogo-layout">
            <Board
              titulo={"Teu tabuleiro — " + nomeJogador}
              tabuleiro={tabJogador}
              mostrarNavios={true}
              radarArea={null}
              onCellClick={null}
            />

            <Dashboard
              nomeJogador={nomeJogador}
              vezDoJogador={vezDoJogador}
              combustivel={combustivel}
              radarDisponivel={radarDisponivel}
              jogoAtivo={fase === FASES.JOGO}
              debug={debug}
              turnoSegundos={dificuldadeAtual.turnoSegundos}
              onTempoEsgotado={handleTempoEsgotado}
              onSegundos={handleSegundos}
              onRadarAtivado={handleRadar}
              onToggleDebug={() => setDebug((d) => !d)}
            />

            <Board
              titulo="Tabuleiro do Computador"
              tabuleiro={tabPC}
              mostrarNavios={debug}
              radarArea={radarArea}
              onCellClick={vezDoJogador ? handleDisparo : null}
            />
          </main>
        </>
      )}

      {fase === FASES.FIM && (
        <GameOver
          vencedor={vencedor}
          nomeJogador={nomeJogador}
          jogadas={jogadas}
          precisao={calcularPrecisao(tirosJogador, tirosCertosJogador)}
          moedasGanhas={vencedor === nomeJogador ? MOEDAS_POR_VITORIA : MOEDAS_POR_DERROTA}
          novasConquistas={novasConquistas}
          onJogarNovamente={() => setFase(FASES.SETUP)}
          onMenu={() => setFase(FASES.MENU)}
        />
      )}

      {novasConquistas.length > 0 && fase === FASES.FIM && <AchievementToast conquistas={novasConquistas} />}

      {fase !== FASES.SPLASH && (
        <footer className="rodape-global">
          <p>© 2026 Fleetoria. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}

// O Provider fica fora do componente principal para que o tema (data-tema)
// esteja disponível antes de qualquer render condicional.
function App() {
  return (
    <DefinicoesProvider>
      <AuthProvider>
        <JogoInterno />
      </AuthProvider>
    </DefinicoesProvider>
  );
}

export default App;
