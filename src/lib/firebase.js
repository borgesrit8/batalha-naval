// ============================================================
// INICIALIZAÇÃO DO FIREBASE
// As chaves vêm de variáveis de ambiente (ficheiro .env, nunca
// commitado) — ver .env.example e o README para os passos de
// criação do projeto Firebase.
// ============================================================
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Verdadeiro apenas quando o .env foi mesmo preenchido — permite à app
// funcionar em modo "só local" (sem login/multiplayer) enquanto não
// configuras o Firebase, em vez de rebentar com um ecrã branco.
export const firebaseConfigurado = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app = null;
let auth = null;
let db = null;

if (firebaseConfigurado) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn(
    "[Firebase] Variáveis de ambiente em falta — login e multiplayer online " +
      "ficam desativados. Preenche o ficheiro .env (ver .env.example)."
  );
}

export { app, auth, db };
