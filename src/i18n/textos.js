// ============================================================
// TEXTOS DO JOGO (PT / EN)
// Cada chave existe nas duas línguas. Os valores podem ser texto
// simples ou funções (quando o texto depende de um nome, número, etc.).
// Para acrescentar uma língua nova basta copiar o bloco "en" e traduzir.
// ============================================================

// Navios femininos em PT (para concordar "afundado/afundada", "o teu/a tua")
const NAVIOS_FEMININOS_PT = ["Fragata"];

const pt = {
  comum: {
    voltar: "← Voltar",
    voltarMenu: "← Voltar ao menu",
    menuPrincipal: "← Menu principal",
    ou: "ou",
  },

  navios: { 5: "Porta-aviões", 4: "Fragata", 3: "Cruzador", 2: "Submarino" },

  splash: {
    titulo: "Batalha Naval",
    aCarregar: (p) => `A preparar a frota… ${p}%`,
  },

  menu: {
    titulo1: "Batalha",
    titulo2: "Naval",
    subtitulo: "Comanda a tua frota. Afunda o inimigo. Domina o oceano.",
    jogar: "▶ Jogar contra o Computador",
    multiplayer: "🌐 Multiplayer Online",
    estatisticas: "📊 Estatísticas",
    conquistas: "🏅 Conquistas",
    comoJogar: "❓ Como Jogar",
    definicoes: "⚙️ Definições",
    sair: (nome) => `${nome} · Sair`,
    convidadoEntrar: "Convidado · Entrar",
    entrar: "Entrar",
    ilustracao: "Porta-aviões, fragata e submarino a navegar",
  },

  setup: {
    tituloBoasVindas: "Batalha Naval Avançada",
    pedirNome: "Introduz o teu nome de comandante para começar:",
    placeholderNome: "O teu nome...",
    continuar: "Continuar",
    titulo: (nome) => `Olá ${nome}! Posiciona a tua frota`,
    naviosAColocar: "Navios a colocar",
    horizontal: "↔ Horizontal",
    vertical: "↕ Vertical",
    reiniciar: "Reiniciar",
    autoColocar: "🎲 Auto-colocar",
    frotaPC: "Frota do computador",
    aleatoria: "Aleatória",
    predefinida: (n) => `Pré-definida ${n}`,
    posicaoInvalida: "Posição inválida! Verifica os limites e sobreposições.",
    iniciar: "🚀 Iniciar Jogo",
  },

  jogo: {
    frotaInimiga: "Frota inimiga",
    tuaFrota: "A tua frota",
    naviosAFlutuar: (r, t) => `${r}/${t} navios a flutuar`,
    escolheCelula: "Escolhe uma célula para disparar",
    pcAMirar: "O computador está a mirar…",
    tuaVez: "A tua vez! Escolhe onde disparar",
    tempoEsgotado: "Tempo esgotado! Vez do computador",
    agua: "Água! Vez do computador",
    pcFalhou: "O computador falhou",
    acertaste: "Acertaste! Joga outra vez",
    pcAcertou: "O computador acertou e volta a jogar",
    afundaste: (nome) =>
      `${nome} ${NAVIOS_FEMININOS_PT.includes(nome) ? "afundada" : "afundado"}! Joga outra vez`,
    pcAfundou: (nome) =>
      `O computador afundou ${NAVIOS_FEMININOS_PT.includes(nome) ? "a tua" : "o teu"} ${nome.toLowerCase()}`,
  },

  painel: {
    vezDe: (nome) => `Vez de ${nome}`,
    vezPC: "Vez do computador",
    segundos: (s) => `${s} segundos`,
    combustivel: "⛽ Combustível",
    radar: "📡 Radar",
    ativarRadar: "Ativar Radar",
    radarIndisponivel: "Radar indisponível",
  },

  celula: { agua: "Água", acerto: "Acerto", falhou: "Falhou", navio: "Navio" },

  fim: {
    vitoria: "Vitória!",
    derrota: "Derrota",
    parabens: (nome) => `Parabéns, ${nome}! A tua frota dominou os mares.`,
    perdeste: "O Computador afundou a tua frota desta vez.",
    semCombustivel: "Ficaste sem combustível! ⛽ Cada disparo gasta combustível e só os acertos o recarregam.",
    perdesteOnline: (nome) => `${nome} afundou a tua frota desta vez.`,
    jogadas: "Jogadas",
    precisao: "Precisão",
    moedas: "Moedas",
    novasConquistas: "Novas conquistas:",
    jogarNovamente: "⚔️ Jogar Novamente",
    menu: "🏠 Menu Principal",
  },

  definicoes: {
    titulo: "Definições",
    idioma: "Idioma",
    idiomaDescricao: "Língua dos textos do jogo.",
    tema: "Tema",
    temaDescricao: "Escolhe entre modo escuro e claro.",
    escuro: "🌙 Escuro",
    claro: "☀️ Claro",
    efeitos: "Efeitos sonoros",
    efeitosDescricao: "Cliques, disparos e explosões.",
    ligado: "🔊 Ligado",
    desligado: "🔇 Desligado",
    musica: "Música de fundo",
    musicaDescricao: "Ambiente sonoro oceânico.",
    ligada: "🎵 Ligada",
    desligada: "🔈 Desligada",
    dificuldade: "Dificuldade da IA",
    privacidade: "Privacidade dos anúncios",
    privacidadeDescricao: "Muda a tua escolha sobre anúncios personalizados.",
    privacidadeBotao: "🔒 Opções de privacidade",
    conta: "Conta",
    contaDescricao: (email) => `Tens sessão iniciada como ${email}.`,
    apagarConta: "🗑️ Apagar conta",
    apagarAviso:
      "Isto apaga a tua conta e o progresso guardado na nuvem (estatísticas e conquistas). Não pode ser desfeito. Para confirmar, escreve a tua palavra-passe.",
    passwordConfirmar: "A tua palavra-passe",
    cancelar: "Cancelar",
    apagarDefinitivo: "Apagar definitivamente",
    aApagar: "A apagar…",
    contaApagada: "✅ A tua conta foi apagada.",
  },

  dificuldades: {
    facil: { nome: "Fácil", descricao: "IA dispara de forma quase aleatória. Ideal para aprender." },
    normal: { nome: "Normal", descricao: "IA persegue navios atingidos com lógica eficiente." },
    dificil: {
      nome: "Difícil",
      descricao: "IA usa estratégia de paridade (tabuleiro de xadrez) e nunca falha perseguições.",
    },
  },

  comoJogar: {
    titulo: "Como Jogar",
    passos: [
      "Introduz o teu nome e posiciona a tua frota de 6 navios (horizontal ou vertical).",
      "Na tua vez, escolhe uma célula da frota inimiga. Se acertares num navio, jogas outra vez!",
      "Cada disparo custa 5 de combustível — gere-o com cuidado.",
      "Tens um tempo limite por turno; se esgotar, perdes combustível e passas a vez.",
      "Acertos rápidos recarregam combustível e podem desbloquear o Radar, que revela uma área 2x2.",
      "Afunda toda a frota do computador antes que ele afunde a tua para vencer!",
    ],
  },

  estatisticas: {
    titulo: "Estatísticas",
    jogos: "Jogos",
    vitorias: "Vitórias",
    derrotas: "Derrotas",
    taxaVitoria: "Taxa de vitória",
    precisao: "Precisão global",
    melhorPartida: "Melhor partida",
    moedas: "Moedas",
  },

  conquistas: {
    titulo: "Conquistas",
    resumo: (d, t) => `${d} / ${t} desbloqueadas`,
    desbloqueada: "Conquista desbloqueada!",
    lista: {
      "primeira-vitoria": { nome: "Primeiro Sangue", descricao: "Vence a tua primeira batalha." },
      "cinco-vitorias": { nome: "Almirante", descricao: "Vence 5 batalhas." },
      precisao: { nome: "Olho de Águia", descricao: "Termina um jogo com pelo menos 70% de precisão." },
      "vitoria-rapida": { nome: "Ataque Relâmpago", descricao: "Vence uma batalha em 25 jogadas ou menos." },
      "dez-jogos": { nome: "Veterano", descricao: "Joga 10 partidas, ganhes ou percas." },
    },
  },

  auth: {
    entrar: "Entrar",
    criarConta: "Criar Conta",
    criarContaBotao: "Criar conta",
    descricao: "Faz login com o teu email para guardar o progresso na nuvem e jogares online contra amigos.",
    naoConfigurado:
      "⚠️ O login ainda não está configurado neste projeto (falta o ficheiro .env com as chaves do Firebase — ver README). Por agora só podes continuar como convidado.",
    teuNome: "O teu nome",
    email: "Email",
    password: "Password (mín. 6 caracteres)",
    semConta: "Ainda não tens conta? Regista-te",
    comConta: "Já tens conta? Entrar",
    convidado: "👤 Continuar como convidado",
    erros: {
      "auth/invalid-email": "Email inválido.",
      "auth/user-not-found": "Não existe conta com este email.",
      "auth/wrong-password": "Password incorreta.",
      "auth/invalid-credential": "Email ou password incorretos.",
      "auth/email-already-in-use": "Já existe uma conta com este email.",
      "auth/weak-password": "A password precisa de pelo menos 6 caracteres.",
      "auth/missing-password": "Escreve a tua palavra-passe.",
      "auth/requires-recent-login": "Por segurança, sai e volta a entrar antes de apagar a conta.",
      "auth/too-many-requests": "Demasiadas tentativas. Espera um pouco e tenta de novo.",
      generico: "Ocorreu um erro. Tenta novamente.",
    },
  },

  lobby: {
    titulo: "Multiplayer Online",
    descricao: "Cria uma sala e envia o código a um amigo, ou entra numa sala existente.",
    criar: "➕ Criar Sala Nova",
    placeholderCodigo: "Código da sala (ex: A3F9K)",
    entrar: "Entrar na Sala",
    naoAutenticado: "Ainda não estás autenticado.",
    erroCriar: "Não foi possível criar a sala.",
    erroEntrar: "Não foi possível entrar na sala.",
    comandante: "Comandante",
    erros: {
      "sala-nao-encontrada": "Sala não encontrada. Confirma o código.",
      "sala-cheia": "Esta sala já está cheia.",
    },
  },

  online: {
    aLigar: (c) => `A ligar à sala ${c}…`,
    sala: (c) => `Sala ${c}`,
    partilha: "Partilha este código com um amigo para ele entrar:",
    aEspera: "⏳ À espera que o segundo jogador entre…",
    sairSala: "← Sair da sala",
    posiciona: (c) => `Sala ${c} — posiciona a tua frota`,
    frotaConfirmada: "✅ Frota confirmada! À espera do adversário…",
    orientacao: "Orientação",
    posicaoInvalida: "Posição inválida.",
    confirmar: "✅ Confirmar Frota",
    tu: "Tu",
    contra: (c, nome) => `Sala ${c} — vs ${nome}`,
    tuaVez: "É a tua vez de disparar!",
    aguardar: (nome) => `A aguardar disparo de ${nome}…`,
    tabuleiroDe: (nome) => `Tabuleiro de ${nome}`,
    abandonar: "← Abandonar partida",
  },
};

const en = {
  comum: {
    voltar: "← Back",
    voltarMenu: "← Back to menu",
    menuPrincipal: "← Main menu",
    ou: "or",
  },

  navios: { 5: "Carrier", 4: "Frigate", 3: "Cruiser", 2: "Submarine" },

  splash: {
    titulo: "Battleship",
    aCarregar: (p) => `Preparing the fleet… ${p}%`,
  },

  menu: {
    titulo1: "Naval",
    titulo2: "Battle",
    subtitulo: "Command your fleet. Sink the enemy. Rule the ocean.",
    jogar: "▶ Play vs Computer",
    multiplayer: "🌐 Online Multiplayer",
    estatisticas: "📊 Statistics",
    conquistas: "🏅 Achievements",
    comoJogar: "❓ How to Play",
    definicoes: "⚙️ Settings",
    sair: (nome) => `${nome} · Sign out`,
    convidadoEntrar: "Guest · Sign in",
    entrar: "Sign in",
    ilustracao: "Aircraft carrier, frigate and submarine at sea",
  },

  setup: {
    tituloBoasVindas: "Advanced Battleship",
    pedirNome: "Enter your commander name to start:",
    placeholderNome: "Your name...",
    continuar: "Continue",
    titulo: (nome) => `Hi ${nome}! Place your fleet`,
    naviosAColocar: "Ships to place",
    horizontal: "↔ Horizontal",
    vertical: "↕ Vertical",
    reiniciar: "Reset",
    autoColocar: "🎲 Auto-place",
    frotaPC: "Computer fleet",
    aleatoria: "Random",
    predefinida: (n) => `Preset ${n}`,
    posicaoInvalida: "Invalid position! Check the edges and overlaps.",
    iniciar: "🚀 Start Game",
  },

  jogo: {
    frotaInimiga: "Enemy fleet",
    tuaFrota: "Your fleet",
    naviosAFlutuar: (r, t) => `${r}/${t} ships afloat`,
    escolheCelula: "Pick a cell to fire at",
    pcAMirar: "The computer is aiming…",
    tuaVez: "Your turn! Pick where to fire",
    tempoEsgotado: "Time's up! Computer's turn",
    agua: "Miss! Computer's turn",
    pcFalhou: "The computer missed",
    acertaste: "Hit! Fire again",
    pcAcertou: "The computer hit and fires again",
    afundaste: (nome) => `${nome} sunk! Fire again`,
    pcAfundou: (nome) => `The computer sank your ${nome.toLowerCase()}`,
  },

  painel: {
    vezDe: (nome) => `${nome}'s turn`,
    vezPC: "Computer's turn",
    segundos: (s) => `${s} seconds`,
    combustivel: "⛽ Fuel",
    radar: "📡 Radar",
    ativarRadar: "Activate Radar",
    radarIndisponivel: "Radar unavailable",
  },

  celula: { agua: "Water", acerto: "Hit", falhou: "Miss", navio: "Ship" },

  fim: {
    vitoria: "Victory!",
    derrota: "Defeat",
    parabens: (nome) => `Well done, ${nome}! Your fleet rules the seas.`,
    perdeste: "The computer sank your fleet this time.",
    semCombustivel: "You ran out of fuel! ⛽ Every shot uses fuel and only hits refill it.",
    perdesteOnline: (nome) => `${nome} sank your fleet this time.`,
    jogadas: "Shots",
    precisao: "Accuracy",
    moedas: "Coins",
    novasConquistas: "New achievements:",
    jogarNovamente: "⚔️ Play Again",
    menu: "🏠 Main Menu",
  },

  definicoes: {
    titulo: "Settings",
    idioma: "Language",
    idiomaDescricao: "Language of the game texts.",
    tema: "Theme",
    temaDescricao: "Choose between dark and light mode.",
    escuro: "🌙 Dark",
    claro: "☀️ Light",
    efeitos: "Sound effects",
    efeitosDescricao: "Clicks, shots and explosions.",
    ligado: "🔊 On",
    desligado: "🔇 Off",
    musica: "Background music",
    musicaDescricao: "Ocean ambience.",
    ligada: "🎵 On",
    desligada: "🔈 Off",
    dificuldade: "AI difficulty",
    privacidade: "Ad privacy",
    privacidadeDescricao: "Change your choice about personalised ads.",
    privacidadeBotao: "🔒 Privacy options",
    conta: "Account",
    contaDescricao: (email) => `You're signed in as ${email}.`,
    apagarConta: "🗑️ Delete account",
    apagarAviso:
      "This deletes your account and the progress saved in the cloud (statistics and achievements). It can't be undone. To confirm, enter your password.",
    passwordConfirmar: "Your password",
    cancelar: "Cancel",
    apagarDefinitivo: "Delete permanently",
    aApagar: "Deleting…",
    contaApagada: "✅ Your account has been deleted.",
  },

  dificuldades: {
    facil: { nome: "Easy", descricao: "The AI fires almost at random. Great for learning." },
    normal: { nome: "Normal", descricao: "The AI hunts down ships it has hit." },
    dificil: {
      nome: "Hard",
      descricao: "The AI uses a checkerboard strategy and never misses a follow-up.",
    },
  },

  comoJogar: {
    titulo: "How to Play",
    passos: [
      "Enter your name and place your fleet of 6 ships (horizontal or vertical).",
      "On your turn, pick a cell on the enemy fleet. If you hit a ship, you fire again!",
      "Each shot costs 5 fuel — manage it carefully.",
      "Each turn has a time limit; if it runs out, you lose fuel and your turn.",
      "Quick hits refill fuel and can unlock the Radar, which reveals a 2x2 area.",
      "Sink the whole computer fleet before it sinks yours to win!",
    ],
  },

  estatisticas: {
    titulo: "Statistics",
    jogos: "Games",
    vitorias: "Wins",
    derrotas: "Losses",
    taxaVitoria: "Win rate",
    precisao: "Overall accuracy",
    melhorPartida: "Best game",
    moedas: "Coins",
  },

  conquistas: {
    titulo: "Achievements",
    resumo: (d, t) => `${d} / ${t} unlocked`,
    desbloqueada: "Achievement unlocked!",
    lista: {
      "primeira-vitoria": { nome: "First Blood", descricao: "Win your first battle." },
      "cinco-vitorias": { nome: "Admiral", descricao: "Win 5 battles." },
      precisao: { nome: "Eagle Eye", descricao: "Finish a game with at least 70% accuracy." },
      "vitoria-rapida": { nome: "Lightning Strike", descricao: "Win a battle in 25 shots or fewer." },
      "dez-jogos": { nome: "Veteran", descricao: "Play 10 games, win or lose." },
    },
  },

  auth: {
    entrar: "Sign in",
    criarConta: "Create Account",
    criarContaBotao: "Create account",
    descricao: "Sign in with your email to save your progress in the cloud and play online with friends.",
    naoConfigurado:
      "⚠️ Sign-in isn't set up in this project yet (the .env file with the Firebase keys is missing — see README). For now you can only continue as a guest.",
    teuNome: "Your name",
    email: "Email",
    password: "Password (min. 6 characters)",
    semConta: "No account yet? Sign up",
    comConta: "Already have an account? Sign in",
    convidado: "👤 Continue as guest",
    erros: {
      "auth/invalid-email": "Invalid email.",
      "auth/user-not-found": "There's no account with this email.",
      "auth/wrong-password": "Wrong password.",
      "auth/invalid-credential": "Wrong email or password.",
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/weak-password": "The password needs at least 6 characters.",
      "auth/missing-password": "Enter your password.",
      "auth/requires-recent-login": "For security, sign out and sign in again before deleting your account.",
      "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
      generico: "Something went wrong. Please try again.",
    },
  },

  lobby: {
    titulo: "Online Multiplayer",
    descricao: "Create a room and send the code to a friend, or join an existing room.",
    criar: "➕ Create New Room",
    placeholderCodigo: "Room code (e.g. A3F9K)",
    entrar: "Join Room",
    naoAutenticado: "You're not signed in yet.",
    erroCriar: "Couldn't create the room.",
    erroEntrar: "Couldn't join the room.",
    comandante: "Commander",
    erros: {
      "sala-nao-encontrada": "Room not found. Check the code.",
      "sala-cheia": "This room is already full.",
    },
  },

  online: {
    aLigar: (c) => `Connecting to room ${c}…`,
    sala: (c) => `Room ${c}`,
    partilha: "Share this code with a friend so they can join:",
    aEspera: "⏳ Waiting for the second player…",
    sairSala: "← Leave room",
    posiciona: (c) => `Room ${c} — place your fleet`,
    frotaConfirmada: "✅ Fleet confirmed! Waiting for your opponent…",
    orientacao: "Orientation",
    posicaoInvalida: "Invalid position.",
    confirmar: "✅ Confirm Fleet",
    tu: "You",
    contra: (c, nome) => `Room ${c} — vs ${nome}`,
    tuaVez: "Your turn to fire!",
    aguardar: (nome) => `Waiting for ${nome} to fire…`,
    tabuleiroDe: (nome) => `${nome}'s board`,
    abandonar: "← Leave game",
  },
};

export const TEXTOS = { pt, en };
export const IDIOMAS = [
  { id: "pt", nome: "🇵🇹 Português" },
  { id: "en", nome: "🇬🇧 English" },
];
