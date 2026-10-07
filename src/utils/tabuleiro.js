// ============================================================
// LÓGICA PURA DO TABULEIRO
// Nenhuma destas funções depende do React — são fáceis de testar
// isoladamente e podem ser reutilizadas em qualquer sítio.
// ============================================================
import { TAMANHO, FROTA } from "../constants";

export function criarTabuleiro() {
  const tab = [];
  for (let l = 0; l < TAMANHO; l++) {
    const linha = [];
    for (let c = 0; c < TAMANHO; c++) {
      linha.push({ navio: null, atingida: false });
    }
    tab.push(linha);
  }
  return tab;
}

export function copiarTabuleiro(tab) {
  return tab.map((linha) => linha.map((cel) => ({ ...cel })));
}

export function posicaoValida(tab, linha, col, tamanho, horizontal) {
  for (let i = 0; i < tamanho; i++) {
    const l = horizontal ? linha : linha + i;
    const c = horizontal ? col + i : col;
    if (l >= TAMANHO || c >= TAMANHO || l < 0 || c < 0) return false;
    if (tab[l][c].navio !== null) return false;
  }
  return true;
}

export function colocarNavio(tab, linha, col, tamanho, horizontal, id) {
  const novo = copiarTabuleiro(tab);
  for (let i = 0; i < tamanho; i++) {
    const l = horizontal ? linha : linha + i;
    const c = horizontal ? col + i : col;
    novo[l][c].navio = id;
  }
  return novo;
}

export function gerarFrotaAleatoria() {
  let tab = criarTabuleiro();
  for (let i = 0; i < FROTA.length; i++) {
    let colocado = false;
    let tentativas = 0;
    while (!colocado && tentativas < 500) {
      const horizontal = Math.random() < 0.5;
      const linha = Math.floor(Math.random() * TAMANHO);
      const col = Math.floor(Math.random() * TAMANHO);
      if (posicaoValida(tab, linha, col, FROTA[i], horizontal)) {
        tab = colocarNavio(tab, linha, col, FROTA[i], horizontal, "navio-" + i);
        colocado = true;
      }
      tentativas++;
    }
  }
  return tab;
}

export function todosAfundados(tab) {
  for (let l = 0; l < TAMANHO; l++) {
    for (let c = 0; c < TAMANHO; c++) {
      if (tab[l][c].navio !== null && tab[l][c].atingida === false) {
        return false;
      }
    }
  }
  return true;
}

// Um navio está "afundado" quando todas as células com o mesmo id foram atingidas.
// Usado para disparar a animação de afundamento apenas quando faz sentido.
export function navioAfundadoNestaCelula(tab, l, c) {
  const id = tab[l][c].navio;
  if (!id) return false;
  for (let li = 0; li < TAMANHO; li++) {
    for (let ci = 0; ci < TAMANHO; ci++) {
      if (tab[li][ci].navio === id && !tab[li][ci].atingida) return false;
    }
  }
  return true;
}

export function ataqueAleatorio(tab) {
  const livres = [];
  for (let l = 0; l < TAMANHO; l++) {
    for (let c = 0; c < TAMANHO; c++) {
      if (!tab[l][c].atingida) livres.push({ l, c });
    }
  }
  return livres[Math.floor(Math.random() * livres.length)];
}

// Estratégia de paridade: em modo difícil, a IA só dispara aleatoriamente em
// células de "casa preta" de um tabuleiro de xadrez enquanto não tem alvo — o
// menor navio tem tamanho 2, por isso qualquer navio é sempre detetado.
export function ataqueParidade(tab) {
  const livres = [];
  for (let l = 0; l < TAMANHO; l++) {
    for (let c = 0; c < TAMANHO; c++) {
      if (!tab[l][c].atingida && (l + c) % 2 === 0) livres.push({ l, c });
    }
  }
  if (livres.length === 0) return ataqueAleatorio(tab);
  return livres[Math.floor(Math.random() * livres.length)];
}

export function celulasAdjacentes(tab, l, c) {
  const resultado = [];
  if (l - 1 >= 0 && !tab[l - 1][c].atingida) resultado.push({ l: l - 1, c });
  if (l + 1 < TAMANHO && !tab[l + 1][c].atingida) resultado.push({ l: l + 1, c });
  if (c - 1 >= 0 && !tab[l][c - 1].atingida) resultado.push({ l, c: c - 1 });
  if (c + 1 < TAMANHO && !tab[l][c + 1].atingida) resultado.push({ l, c: c + 1 });
  return resultado;
}

export function encontrarAreaRadar(tab) {
  const opcoes = [];
  for (let l = 0; l <= TAMANHO - 2; l++) {
    for (let c = 0; c <= TAMANHO - 2; c++) {
      const temNavio =
        (tab[l][c].navio && !tab[l][c].atingida) ||
        (tab[l][c + 1].navio && !tab[l][c + 1].atingida) ||
        (tab[l + 1][c].navio && !tab[l + 1][c].atingida) ||
        (tab[l + 1][c + 1].navio && !tab[l + 1][c + 1].atingida);
      if (temNavio) opcoes.push({ l, c });
    }
  }
  if (opcoes.length === 0) return null;
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

export function calcularPrecisao(tirosDisparados, tirosCertos) {
  if (tirosDisparados === 0) return 0;
  return Math.round((tirosCertos / tirosDisparados) * 100);
}

// Conta os navios de um tabuleiro e quantos ainda não foram afundados.
export function contarNavios(tab) {
  const porAfundar = new Set();
  const todos = new Set();
  for (const linha of tab) {
    for (const cel of linha) {
      if (cel.navio === null) continue;
      todos.add(cel.navio);
      if (!cel.atingida) porAfundar.add(cel.navio);
    }
  }
  return { total: todos.size, restantes: porAfundar.size };
}

// Tamanho (n.º de células) do navio com este id.
export function tamanhoNavio(tab, id) {
  let n = 0;
  for (const linha of tab) for (const cel of linha) if (cel.navio === id) n++;
  return n;
}
