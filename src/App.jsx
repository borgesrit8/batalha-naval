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
  NOMES_NAVIOS,
  NAVIOS_FEMININOS,
} from "./constants";
import {
  copiarTabuleiro,
  todosAfundados,
  ataqueAleatorio,
  ataqueParidade,
  celulasAdjacentes,
  encontrarAreaRadar,
  calcularPrecisao,
  navioAfundadoNestaCelula,
  contarNavios,
  tamanhoNavio,
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

// Devolve true com a probabilidade indicada (0 a 1).
function sortear(probabilidade) {
  return Math.random() < probabilidade;
}

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

  // Pausa entre jogadas (para se ver o resultado do tiro antes de mudar de ecrã),
  // n.º do turno (reinicia o cronómetro quando se joga outra vez) e mensagem do último tiro.
  const [aguardar, setAguardar] = useState(false);
  const [turnoId, setTurnoId] = useState(0);
  const [mensagem, setMensagem] = useState(null);
  // Cada partida tem um id; temporizadores de uma partida antiga são ignorados.
  const partidaRef = useRef(0);

  const dificuldadeAtual = DIFICULDADES[definicoes.dificuldade] || DIFICULDADES.normal;

  function abrirOverlay(destino) {
    faseAnteriorMenu.current = fase === FASES.MENU ? FASES.MENU : faseAnteriorMenu.current;
    setFase(destino);
  }

  function handleIniciar(dados) {
    setNomeJogador(dados.nome);
    setTabJogador(dados.tabJogador);
    setTabPC(dados.tabPC);
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
    setAguardar(false);
    setTurnoId(0);
    setMensagem({ tipo: "info", texto: "Escolhe uma célula para disparar" });
    partidaRef.current += 1;
    jogoRegistadoRef.current = false;
  }

  // Agenda uma ação só se a partida ainda for a mesma.
  function depois(ms, fn) {
    const id = partidaRef.current;
    setTimeout(() => {
      if (partidaRef.current === id) fn();
    }, ms);
  }

  function descreverTiro(tab, l, c, sujeito) {
    const cel = tab[l][c];
    if (!cel.navio) return { tipo: "agua", texto: sujeito === "jogador" ? "Água! Vez do computador" : "O computador falhou" };
    if (navioAfundadoNestaCelula(tab, l, c)) {
      const nome = NOMES_NAVIOS[tamanhoNavio(tab, cel.navio)] || "Navio";
      const fem = NAVIOS_FEMININOS.includes(nome);
      return {
        tipo: "afundado",
        texto:
          sujeito === "jogador"
            ? `${nome} ${fem ? "afundada" : "afundado"}! Joga outra vez`
            : `O computador afundou ${fem ? "a tua" : "o teu"} ${nome.toLowerCase()}`,
      };
    }
    return { tipo: "acerto", texto: sujeito === "jogador" ? "Acertaste! Joga outra vez" : "O computador acertou e volta a jogar" };
  }

  // Passa a vez ao computador: mostra o tabuleiro do jogador e começa a disparar.
  function passarVezAoPC(tabJAtual, modo, alvos, jogadasAtuais) {
    setVezDoJogador(false);
    setMensagem({ tipo: "info", texto: "O computador está a mirar…" });
    depois(900, () => atacarPC(tabJAtual, modo, alvos, jogadasAtuais));
  }

  function handleDisparo(l, c) {
    if (!vezDoJogador || aguardar || fase !== FASES.JOGO) return;

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
    setMensagem(descreverTiro(novoTab, l, c, "jogador"));

    if (todosAfundados(novoTab)) {
      setAguardar(true);
      depois(900, () => {
        setVencedor(nomeJogador);
        setFase(FASES.FIM);
      });
      return;
    }

    if (acertou) {
      // Acertou: continua a jogar, com o cronómetro reiniciado.
      setTurnoId((t) => t + 1);
      return;
    }

    // Falhou: deixa ver a cruz um instante e depois passa a vez.
    setAguardar(true);
    depois(1000, () => {
      setAguardar(false);
      passarVezAoPC(tabJogador, modoIA, alvosIA, jogadas + 1);
    });
  }

  function atacarPC(tabJAtual, modo, alvos, jogadasAtuais) {
    let l, c;
    const errarPerseguicao = modo === "cacar" && alvos.length > 0 && sortear(dificuldadeAtual.chanceErroPerseguicao);

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
      // Descarta alvos já atingidos (podem ter sido apanhados entretanto)
      const pendentes = alvos.filter((a) => !novoTab[a.l][a.c].atingida);
      const adjacentes = celulasAdjacentes(novoTab, l, c).filter(
        (a) => !pendentes.some((p) => p.l === a.l && p.c === a.c)
      );
      novosAlvos = [...pendentes, ...adjacentes];
      novoModo = novosAlvos.length > 0 ? "cacar" : "aleatorio";
    } else {
      novosAlvos = alvos.slice(1).filter((a) => !novoTab[a.l][a.c].atingida);
      novoModo = novosAlvos.length > 0 ? "cacar" : "aleatorio";
    }

    tocar(acertou ? "acerto" : "agua");
    setTabJogador(novoTab);
    setModoIA(novoModo);
    setAlvosIA(novosAlvos);
    setJogadas(jogadasAtuais + 1);
    setMensagem(descreverTiro(novoTab, l, c, "pc"));

    if (todosAfundados(novoTab)) {
      depois(900, () => {
        setVencedor("Computador");
        setFase(FASES.FIM);
      });
      return;
    }

    if (acertou) {
      // O computador acertou: volta a disparar.
      depois(1000, () => atacarPC(novoTab, novoModo, novosAlvos, jogadasAtuais + 1));
      return;
    }

    // O computador falhou: o jogador vê a cruz e depois volta a ser a sua vez.
    depois(1200, () => {
      setVezDoJogador(true);
      setTurnoId((t) => t + 1);
      setMensagem({ tipo: "info", texto: "A tua vez! Escolhe onde disparar" });
    });
  }

  function handleTempoEsgotado() {
    if (!vezDoJogador || aguardar || fase !== FASES.JOGO) return;

    const novoCombustivel = combustivel - 5;
    if (novoCombustivel <= 0) {
      setVencedor("Computador");
      setFase(FASES.FIM);
      return;
    }

    setCombustivel(novoCombustivel);
    passarVezAoPC(tabJogador, modoIA, alvosIA, jogadas);
    setMensagem({ tipo: "agua", texto: "Tempo esgotado! Vez do computador" });
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

  const tabVisivel = vezDoJogador ? tabPC : tabJogador;
  const frota = fase === FASES.JOGO ? contarNavios(tabVisivel) : { total: 0, restantes: 0 };

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
          <main id="jogo" className="animar-entrada">
            <Dashboard
              nomeJogador={nomeJogador}
              vezDoJogador={vezDoJogador}
              combustivel={combustivel}
              radarDisponivel={radarDisponivel && !aguardar}
              jogoAtivo={fase === FASES.JOGO && !aguardar}
              turnoId={turnoId}
              turnoSegundos={dificuldadeAtual.turnoSegundos}
              onTempoEsgotado={handleTempoEsgotado}
              onSegundos={handleSegundos}
              onRadarAtivado={handleRadar}
            />

            <div className={"jogo-alvo" + (vezDoJogador ? " jogo-alvo--inimigo" : " jogo-alvo--meu")}>
              <div className="jogo-alvo__cabecalho">
                <h2>{vezDoJogador ? "Frota inimiga" : "A tua frota"}</h2>
                <span className="jogo-alvo__frota">
                  {frota.restantes}/{frota.total} navios a flutuar
                </span>
              </div>

              <div key={vezDoJogador ? "pc" : "jogador"} className="jogo-alvo__tabuleiro">
                <Board
                  titulo={null}
                  tabuleiro={tabVisivel}
                  mostrarNavios={!vezDoJogador}
                  radarArea={vezDoJogador ? radarArea : null}
                  onCellClick={vezDoJogador && !aguardar ? handleDisparo : null}
                  destacado={vezDoJogador}
                />
              </div>

              <p
                key={mensagem ? mensagem.texto + jogadas : "vazio"}
                className={"jogo-mensagem" + (mensagem ? " jogo-mensagem--" + mensagem.tipo : "")}
                role="status"
              >
                {mensagem ? mensagem.texto : "\u00a0"}
              </p>
            </div>
          </main>
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
