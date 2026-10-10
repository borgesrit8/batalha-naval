# Batalha Naval Avançada — Edição Premium

Versão redesenhada do projeto original (React + Vite), agora com interface
premium, som, conquistas/estatísticas, **login por email** e **multiplayer
online por turnos**, e preparação para publicação na Google Play.

## Como correr em modo local (single-player)

```bash
npm install
npm run dev
```

Sem configurares o Firebase, a app funciona perfeitamente em modo
convidado: jogas contra o computador, guardas estatísticas localmente,
mas login e multiplayer ficam desativados (com um aviso claro no ecrã).

---

## 1. Ativar login + multiplayer online (Firebase)

1. Vai a [console.firebase.google.com](https://console.firebase.google.com) e cria um
   projeto novo (gratuito).
2. Em **Build > Authentication > Sign-in method**, ativa o fornecedor
   **Email/Password**.
3. Em **Build > Firestore Database**, cria uma base de dados (podes começar
   em modo de produção, as regras já vêm neste repositório).
4. Em **Definições do projeto > As tuas apps**, cria uma "Web app" e copia
   as chaves para um ficheiro `.env` na raiz do projeto (usa o
   `.env.example` como modelo):

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

5. Publica as regras de segurança: abre `firestore.rules` deste projeto,
   copia o conteúdo para a aba **Regras** do Firestore na consola (ou usa
   a Firebase CLI: `firebase deploy --only firestore:rules`).
6. `npm run dev` — o login e o multiplayer já devem estar ativos.
7. **Site no Vercel:** o `.env` não vai para o GitHub, por isso as mesmas 6
   variáveis têm de ser adicionadas em Vercel → Settings → Environment
   Variables (tipo "Config"), seguidas de um novo deploy.

### Como funciona o multiplayer

- Um jogador cria uma sala (gera um código de 5 caracteres) e o outro
  entra com esse código.
- Cada jogador posiciona a sua frota; essa posição fica guardada numa
  subcoleção só legível pelo próprio jogador (ninguém consegue "espreitar"
  os navios do adversário pela consola do browser).
- Os disparos e resultados sincronizam em tempo real via Firestore.
- **Limitação conhecida**: sem um servidor próprio (Cloud Functions), é o
  cliente do jogador atingido que reporta se foi acerto ou erro — é
  suficiente para jogar com amigos de confiança, mas um cliente alterado
  de propósito poderia mentir sobre os resultados. Resolver isto por
  completo exigiria mover essa lógica para Cloud Functions.

---

## 2. Publicar na Google Play

O projeto já vem preparado com [Capacitor](https://capacitorjs.com), que
embrulha a app web numa app Android nativa. Precisas de fazer isto no teu
computador (não é possível a partir daqui):

1. Instala o [Android Studio](https://developer.android.com/studio).
2. `npm install`
3. `npm run cap:add:android` — cria a pasta `android/` (gerada localmente,
   não incluída no repositório).
4. `npm run cap:sync` — compila a app web e copia-a para o projeto Android.
5. `npm run cap:open:android` — abre o Android Studio.
6. Em Android Studio: substitui os ícones em `android/app/src/main/res/`
   pelos teus (usa o [Icon Generator](https://developer.android.com/studio/write/image-asset-studio)
   integrado — Splash já está configurado a azul-marinho `#0b1f3a`).
7. **Build > Generate Signed Bundle / APK**, cria uma keystore nova (guarda-a
   bem, vais precisar dela em todas as atualizações futuras) e gera o `.aab`.
8. Cria uma conta de developer em [play.google.com/console](https://play.google.com/console)
   (pagamento único de 25 USD) e submete o `.aab`, com capturas de ecrã,
   descrição, política de privacidade (obrigatória por causa do login) e
   classificação etária.

## O que mudou nesta versão

**Interface** — paleta oceânica, glassmorphism, tema claro/escuro,
animações no tabuleiro (água, explosão, navio afundado), HUD com anel de
tempo e barra de combustível, ecrã de fim de jogo distinto para
vitória/derrota.

**Contra o computador** — splash, menu, definições (tema/som/música/
dificuldade), tutorial, estatísticas e conquistas persistidas localmente,
som sintetizado via Web Audio API, 3 níveis de dificuldade com IA distinta.

**Novo nesta iteração** — login por email (Firebase Authentication),
progresso sincronizado na nuvem (`users/{uid}` no Firestore, com fusão
inteligente entre progresso local e da nuvem), e **multiplayer online por
turnos** com salas por código, animações e som iguais ao modo single-player.
Modo online usa regras clássicas (sem combustível/radar) para manter a
sincronização simples e fiável.

**Código** — lógica pura em `src/utils`, serviços de rede isolados em
`src/services` (`salas.js`, `progresso.js`), contexto de autenticação
(`AuthContext`) separado do contexto de definições, hooks reutilizáveis,
constantes centralizadas, componentes memoizados no tabuleiro.

## Fora do âmbito desta entrega

- Cloud Functions para arbitragem 100% fiável dos disparos.
- Loja de moedas, desafio diário, temas desbloqueáveis — a arquitetura
  (moedas, conquistas) já suporta vir a adicionar isto.
- O build/assinatura/submissão real à Play Store, que depende de
  ferramentas locais (Android Studio) e de uma conta de developer paga.
