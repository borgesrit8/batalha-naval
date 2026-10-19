import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPosition,
  BannerAdSize,
  MaxAdContentRating,
} from "@capacitor-community/admob";

const ID_BANNER = "ca-app-pub-4514217627004917/3273004867";

// Guarda se o jogador (na Europa) deve ter acesso ao botão
// "Privacidade dos anúncios" nas Definições, para mudar a escolha.
let precisaOpcoesPrivacidade = false;
const ouvintes = new Set();

function avisar() {
  ouvintes.forEach((f) => f(precisaOpcoesPrivacidade));
}

export function ouvirOpcoesPrivacidade(f) {
  ouvintes.add(f);
  f(precisaOpcoesPrivacidade);
  return () => ouvintes.delete(f);
}

// Texto curto com o estado do consentimento, mostrado nas Definições
// (ajuda a perceber porque é que os anúncios não aparecem).
let estadoAnuncios = "";
const ouvintesEstado = new Set();

function definirEstado(texto) {
  estadoAnuncios = texto;
  ouvintesEstado.forEach((f) => f(texto));
}

export function ouvirEstadoAnuncios(f) {
  ouvintesEstado.add(f);
  f(estadoAnuncios);
  return () => ouvintesEstado.delete(f);
}

// Se o Google não responder, não fica à espera para sempre.
function comLimite(promessa, ms, mensagem) {
  return Promise.race([
    promessa,
    new Promise((_, rejeitar) => setTimeout(() => rejeitar(new Error(mensagem)), ms)),
  ]);
}

function textoErro(erro) {
  return (erro && (erro.message || erro.errorMessage)) || String(erro);
}

async function mostrarBanner() {
  await AdMob.showBanner({
    adId: ID_BANNER,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
  });
  // Reserva espaço em baixo para o banner não tapar os botões
  document.body.classList.add("com-anuncio");
}

// 1) Pergunta o consentimento (RGPD) se for preciso  2) Inicia o AdMob
// 3) Mostra o banner. Se o pedido de consentimento der erro, o banner é
// mostrado na mesma: sem consentimento, o Google só mostra anúncios
// limitados (não personalizados).
export async function iniciarAnuncios() {
  if (!Capacitor.isNativePlatform()) return;

  let podeMostrar = true;
  definirEstado("a pedir consentimento…");
  try {
    let info = await comLimite(AdMob.requestConsentInfo(), 10000, "sem resposta (10s)");
    let passo = `${info.status}, form=${info.isConsentFormAvailable ? "sim" : "não"}`;
    if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) {
      try {
        info = await AdMob.showConsentForm();
        passo += ` → ${info.status}`;
      } catch (erro) {
        passo += ` → erro janela: ${textoErro(erro)}`;
      }
    }
    precisaOpcoesPrivacidade = info.privacyOptionsRequirementStatus === "REQUIRED";
    avisar();
    podeMostrar = info.canRequestAds !== false;
    definirEstado(`${passo}, anúncios=${podeMostrar ? "sim" : "não"}`);
  } catch (erro) {
    definirEstado(`erro consentimento: ${textoErro(erro)}`);
  }

  if (!podeMostrar) return;

  try {
    definirEstado(`${estadoAnuncios} | a iniciar anúncios…`);
    await comLimite(AdMob.initialize({
      initializeForTesting: true,
      // Só anúncios adequados a todas as idades (sem conteúdo adulto)
      maxAdContentRating: MaxAdContentRating.General,
    }), 10000, "initialize sem resposta");
    await comLimite(mostrarBanner(), 15000, "banner sem resposta");
    definirEstado(estadoAnuncios.replace(" | a iniciar anúncios…", " | banner ok"));
  } catch (erro) {
    definirEstado(`${estadoAnuncios} | erro banner: ${textoErro(erro)}`);
    console.warn("[AdMob] Não foi possível mostrar o anúncio:", erro);
  }
}

export function pararAnuncios() {
  if (!Capacitor.isNativePlatform()) return;
  AdMob.hideBanner().catch(() => {});
  document.body.classList.remove("com-anuncio");
}

// Abre outra vez a janela do Google para o jogador mudar a escolha.
export async function abrirOpcoesPrivacidade() {
  try {
    await AdMob.showPrivacyOptionsForm();
  } catch (erro) {
    console.warn("[AdMob] Não foi possível abrir as opções de privacidade:", erro);
  }
}
