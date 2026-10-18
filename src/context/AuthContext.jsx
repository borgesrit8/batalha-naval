import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth, firebaseConfigurado } from "../lib/firebase";
import { apagarProgresso } from "../services/progresso";

const AuthContext = createContext(null);

// Gere a sessão do jogador. Quando o Firebase não está configurado
// (.env vazio), a app continua a funcionar em "modo convidado" — só
// perde a possibilidade de guardar progresso na nuvem e jogar online.
export function AuthProvider({ children }) {
  const [utilizador, setUtilizador] = useState(null);
  const [aCarregar, setACarregar] = useState(firebaseConfigurado);
  const [convidado, setConvidado] = useState(!firebaseConfigurado);
  const [erro, setErro] = useState("");





  useEffect(() => {
    if (!firebaseConfigurado) return;
    const cancelar = onAuthStateChanged(auth, (u) => {
        console.log("Firebase devolveu:", u);

  setUtilizador(u);
  setACarregar(false);

  if (u) setConvidado(false);
});
    return cancelar;
  }, []);

  async function entrar(email, password) {
  setErro("");

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    console.log("Login Firebase:", cred.user);

    return true;
  } catch (e) {
    console.log(e);

    setErro(traduzirErro(e.code));
    return false;
  }
}

  async function registar(nome, email, password) {
    setErro("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: nome });
      setUtilizador({ ...cred.user, displayName: nome });
      return true;
    } catch (e) {
      setErro(traduzirErro(e.code));
      return false;
    }
  }

  async function sair() {
    if (firebaseConfigurado) await signOut(auth);
    setUtilizador(null);
    setConvidado(true);
  }

  // Apaga a conta de vez: confirma a palavra-passe (o Firebase exige um
  // login recente), apaga o progresso na nuvem e depois o utilizador.
  async function apagarConta(password) {
    setErro("");
    const u = firebaseConfigurado ? auth.currentUser : null;
    if (!u) return false;
    try {
      const credencial = EmailAuthProvider.credential(u.email, password);
      await reauthenticateWithCredential(u, credencial);
      await apagarProgresso(u.uid);
      await deleteUser(u);
      setUtilizador(null);
      setConvidado(true);
      return true;
    } catch (e) {
      setErro(traduzirErro(e.code));
      return false;
    }
  }

  function limparErro() {
    setErro("");
  }

  function entrarComoConvidado() {
    setConvidado(true);
  }

  return (
    <AuthContext.Provider
      value={{
        utilizador,
        aCarregar,
        convidado,
        erro,
        firebaseConfigurado,
        entrar,
        registar,
        sair,
        apagarConta,
        limparErro,
        entrarComoConvidado,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Guarda só o código do erro do Firebase; o ecrã de login traduz-o
// para a língua escolhida (ver i18n/textos.js → auth.erros).
const ERROS_CONHECIDOS = [
  "auth/invalid-email",
  "auth/user-not-found",
  "auth/wrong-password",
  "auth/invalid-credential",
  "auth/email-already-in-use",
  "auth/weak-password",
  "auth/missing-password",
  "auth/requires-recent-login",
  "auth/too-many-requests",
];

function traduzirErro(codigo) {
  return ERROS_CONHECIDOS.includes(codigo) ? codigo : "generico";
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth tem de ser usado dentro de <AuthProvider>");
  return ctx;
}
