// ============================================================
// MOTOR DE SOM
// Todos os efeitos são sintetizados em tempo real com a Web Audio
// API — não é preciso carregar ficheiros .mp3, o que mantém o
// projeto leve e o arranque instantâneo (importante em mobile).
// Isto cumpre o requisito de "arquitetura de som reutilizável":
// basta chamar tocar("explosao") em qualquer sítio do código.
// ============================================================

class MotorSom {
  constructor() {
    this.contexto = null;
    this.somAtivo = true;
    this.musicaAtiva = true;
    this._nosMusica = null;
  }

  _garantirContexto() {
    if (!this.contexto) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.contexto = new AudioCtx();
    }
    if (this.contexto.state === "suspended") {
      this.contexto.resume();
    }
    return this.contexto;
  }

  definirSomAtivo(valor) {
    this.somAtivo = valor;
  }

  definirMusicaAtiva(valor) {
    this.musicaAtiva = valor;
    if (!valor) this.pararMusica();
  }

  _tom(freqInicial, freqFinal, duracao, tipo = "sine", volume = 0.2, atraso = 0) {
    const ctx = this._garantirContexto();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tipo;
    const inicio = ctx.currentTime + atraso;
    osc.frequency.setValueAtTime(freqInicial, inicio);
    osc.frequency.exponentialRampToValueAtTime(Math.max(freqFinal, 1), inicio + duracao);
    gain.gain.setValueAtTime(volume, inicio);
    gain.gain.exponentialRampToValueAtTime(0.001, inicio + duracao);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(inicio);
    osc.stop(inicio + duracao + 0.02);
  }

  _ruido(duracao, volume = 0.3, passaBaixo = 1200, atraso = 0) {
    const ctx = this._garantirContexto();
    if (!ctx) return;
    const tamanho = ctx.sampleRate * duracao;
    const buffer = ctx.createBuffer(1, tamanho, ctx.sampleRate);
    const dados = buffer.getChannelData(0);
    for (let i = 0; i < tamanho; i++) {
      dados[i] = (Math.random() * 2 - 1) * (1 - i / tamanho);
    }
    const fonte = ctx.createBufferSource();
    fonte.buffer = buffer;
    const filtro = ctx.createBiquadFilter();
    filtro.type = "lowpass";
    filtro.frequency.value = passaBaixo;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime + atraso);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + atraso + duracao);
    fonte.connect(filtro);
    filtro.connect(gain);
    gain.connect(ctx.destination);
    fonte.start(ctx.currentTime + atraso);
  }

  tocar(nome) {
    if (!this.somAtivo) return;
    try {
      switch (nome) {
        case "clique":
          this._tom(700, 500, 0.08, "triangle", 0.15);
          break;
        case "agua":
          this._ruido(0.35, 0.18, 900);
          break;
        case "acerto":
          this._tom(180, 60, 0.35, "sawtooth", 0.25);
          this._ruido(0.3, 0.3, 700, 0.02);
          break;
        case "afundado":
          this._tom(300, 40, 0.6, "sawtooth", 0.28);
          this._ruido(0.5, 0.35, 500, 0.05);
          break;
        case "vitoria":
          [523, 659, 784, 1047].forEach((f, i) => this._tom(f, f, 0.25, "sine", 0.2, i * 0.14));
          break;
        case "derrota":
          [400, 350, 300, 220].forEach((f, i) => this._tom(f, f * 0.9, 0.35, "sine", 0.2, i * 0.18));
          break;
        case "radar":
          this._tom(900, 1400, 0.25, "sine", 0.15);
          break;
        case "conquista":
          [660, 880, 1100].forEach((f, i) => this._tom(f, f, 0.18, "triangle", 0.18, i * 0.09));
          break;
        default:
          break;
      }
    } catch (e) {
      // Falhas de áudio nunca devem quebrar o jogo.
      console.warn("Som indisponível:", e);
    }
  }

  iniciarMusica() {
    if (!this.musicaAtiva || this._nosMusica) return;
    const ctx = this._garantirContexto();
    if (!ctx) return;

    const master = ctx.createGain();
    master.gain.value = 0.05;
    master.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.value = 110;
    osc2.frequency.value = 164.81;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 30;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    osc1.connect(master);
    osc2.connect(master);
    osc1.start();
    osc2.start();
    lfo.start();

    this._nosMusica = { osc1, osc2, lfo, master };
  }

  pararMusica() {
    if (!this._nosMusica) return;
    const { osc1, osc2, lfo, master } = this._nosMusica;
    try {
      master.gain.exponentialRampToValueAtTime(0.001, this.contexto.currentTime + 0.4);
      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        lfo.stop();
      }, 450);
    } catch (e) {
      // ignora
    }
    this._nosMusica = null;
  }
}

// Instância única partilhada por toda a aplicação.
export const motorSom = new MotorSom();
