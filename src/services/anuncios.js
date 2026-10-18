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

// 1) Inicia o AdMob  2) Pergunta o consentimento (RGPD) se for preciso
// 3) Só mostra o banner se o Google disser que já se podem pedir anúncios.
export async function iniciarAnuncios() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.initialize({
      initializeForTesting: true,
      // Só anúncios adequados a todas as idades (sem conteúdo adulto)
      maxAdContentRating: MaxAdContentRating.General,
    });

    let info = await AdMob.requestConsentInfo();
    if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) {
      info = await AdMob.showConsentForm();
    }

    precisaOpcoesPrivacidade =
      info.privacyOptionsRequirementStatus === "REQUIRED";
    avisar();

    if (!info.canRequestAds) return;

    await AdMob.showBanner({
      adId: ID_BANNER,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
    });
    // Reserva espaço em baixo para o banner não tapar os botões
    document.body.classList.add("com-anuncio");
  } catch (erro) {
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
