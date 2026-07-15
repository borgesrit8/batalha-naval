// ============================================================
// CONSTANTES GLOBAIS DO JOGO
// Centralizar aqui evita "magic numbers" espalhados pelo código
// e torna o balanceamento do jogo fácil de ajustar.
// ============================================================

export const TAMANHO = 10;

// Tamanho de cada navio da frota (nº de células)
export const FROTA = [5, 4, 3, 3, 2, 2];

export const NOMES_NAVIOS = {
  5: "Porta-aviões",
  4: "Couraçado",
  3: "Cruzador",
  2: "Submarino",
};

export const COMBUSTIVEL_INICIAL = 100;
export const CUSTO_DISPARO = 5;
export const CUSTO_TEMPO_ESGOTADO = 5;
export const RECUPERAR_COMBUSTIVEL_ACERTO = 10;

export const TURNO_SEGUNDOS = 15;
export const RADAR_SEGUNDOS = 3;

// Frotas pré-definidas para o computador (posições fixas, escolhidas no setup)
export const FROTAS_PC = [
  [
    { linha: 0, col: 0, tamanho: 5, horizontal: true },
    { linha: 2, col: 1, tamanho: 4, horizontal: true },
    { linha: 4, col: 3, tamanho: 3, horizontal: false },
    { linha: 1, col: 7, tamanho: 3, horizontal: false },
    { linha: 7, col: 0, tamanho: 2, horizontal: true },
    { linha: 9, col: 5, tamanho: 2, horizontal: true },
  ],
  [
    { linha: 0, col: 5, tamanho: 5, horizontal: false },
    { linha: 0, col: 0, tamanho: 4, horizontal: true },
    { linha: 5, col: 2, tamanho: 3, horizontal: true },
    { linha: 7, col: 7, tamanho: 3, horizontal: false },
    { linha: 3, col: 8, tamanho: 2, horizontal: true },
    { linha: 6, col: 0, tamanho: 2, horizontal: false },
  ],
  [
    { linha: 9, col: 0, tamanho: 5, horizontal: true },
    { linha: 0, col: 9, tamanho: 4, horizontal: false },
    { linha: 4, col: 4, tamanho: 3, horizontal: true },
    { linha: 7, col: 6, tamanho: 3, horizontal: true },
    { linha: 2, col: 2, tamanho: 2, horizontal: false },
    { linha: 6, col: 2, tamanho: 2, horizontal: true },
  ],
];

// Níveis de dificuldade — afetam a inteligência da IA e o ritmo do jogo
export const DIFICULDADES = {
  facil: {
    id: "facil",
    nome: "Fácil",
    descricao: "IA dispara de forma quase aleatória. Ideal para aprender.",
    usarParidade: false,
    chanceErroPerseguicao: 0.35,
    turnoSegundos: 20,
  },
  normal: {
    id: "normal",
    nome: "Normal",
    descricao: "IA persegue navios atingidos com lógica eficiente.",
    usarParidade: false,
    chanceErroPerseguicao: 0.08,
    turnoSegundos: 15,
  },
  dificil: {
    id: "dificil",
    nome: "Difícil",
    descricao: "IA usa estratégia de paridade (tabuleiro de xadrez) e nunca falha perseguições.",
    usarParidade: true,
    chanceErroPerseguicao: 0,
    turnoSegundos: 12,
  },
};

// Chaves usadas no localStorage — mantidas num único sítio para evitar erros de escrita
export const STORAGE_KEYS = {
  definicoes: "batalha-naval:definicoes",
  estatisticas: "batalha-naval:estatisticas",
  conquistas: "batalha-naval:conquistas",
};

export const ESTATISTICAS_INICIAIS = {
  jogosJogados: 0,
  vitorias: 0,
  derrotas: 0,
  tirosDisparados: 0,
  tirosCertos: 0,
  navioMaisRapido: null, // menor nº de jogadas numa vitória
  moedas: 0,
};

// Conquistas desbloqueáveis. `verificar` recebe as estatísticas ATUALIZADAS
// (depois do jogo terminar) e devolve true se a conquista deve desbloquear.
export const CONQUISTAS = [
  {
    id: "primeira-vitoria",
    nome: "Primeiro Sangue",
    descricao: "Vence a tua primeira batalha.",
    icone: "🏆",
    verificar: (s) => s.vitorias >= 1,
  },
  {
    id: "cinco-vitorias",
    nome: "Almirante",
    descricao: "Vence 5 batalhas.",
    icone: "⭐",
    verificar: (s) => s.vitorias >= 5,
  },
  {
    id: "precisao",
    nome: "Olho de Águia",
    descricao: "Termina um jogo com pelo menos 70% de precisão.",
    icone: "🎯",
    verificar: (s, jogoAtual) => jogoAtual && jogoAtual.precisao >= 70,
  },
  {
    id: "vitoria-rapida",
    nome: "Ataque Relâmpago",
    descricao: "Vence uma batalha em 25 jogadas ou menos.",
    icone: "⚡",
    verificar: (s, jogoAtual) => jogoAtual && jogoAtual.venceu && jogoAtual.jogadas <= 25,
  },
  {
    id: "dez-jogos",
    nome: "Veterano",
    descricao: "Joga 10 partidas, ganhes ou percas.",
    icone: "🎖️",
    verificar: (s) => s.jogosJogados >= 10,
  },
];

export const MOEDAS_POR_VITORIA = 20;
export const MOEDAS_POR_DERROTA = 5;
