import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, firebaseConfigurado } from "../lib/firebase";

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
        entrarComoConvidado,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function traduzirErro(codigo) {
  const mapa = {
    "auth/invalid-email": "Email inválido.",
    "auth/user-not-found": "Não existe conta com este email.",
    "auth/wrong-password": "Password incorreta.",
    "auth/invalid-credential": "Email ou password incorretos.",
    "auth/email-already-in-use": "Já existe uma conta com este email.",
    "auth/weak-password": "A password precisa de pelo menos 6 caracteres.",
  };
  return mapa[codigo] || "Ocorreu um erro. Tenta novamente.";
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth tem de ser usado dentro de <AuthProvider>");
  return ctx;
}
