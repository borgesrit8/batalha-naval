import React, { useState } from "react";
import "./auth.css";
import { useAuth } from "../../context/AuthContext";

// Ecrã de login/registo. Se o Firebase não estiver configurado, avisa e
// deixa sempre disponível o botão "continuar como convidado".
function Auth({ onEntrou, onVoltar }) {
  const { entrar, registar, entrarComoConvidado, erro, firebaseConfigurado } = useAuth();
  const [modo, setModo] = useState("login"); // "login" | "registo"
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aEnviar, setAEnviar] = useState(false);

async function handleSubmit(e) {
  e.preventDefault();

  setAEnviar(true);

  const ok =
    modo === "login"
      ? await entrar(email, password)
      : await registar(nome, email, password);

  console.log("Login OK:", ok);

  setAEnviar(false);

  if (ok) {
    console.log("Utilizador autenticado.");
    onEntrou();
  }
}
  function handleConvidado() {
    entrarComoConvidado();
    onEntrou();
  }

  return (
    <div id="auth" className="animar-entrada">
      <div className="auth__cartao vidro">
        <h2>{modo === "login" ? "Entrar" : "Criar Conta"}</h2>
        <p className="auth__descricao">
          Faz login com o teu email para guardar o progresso na nuvem e jogares online contra amigos.
        </p>

        {!firebaseConfigurado && (
          <p className="auth__aviso">
            ⚠️ O login ainda não está configurado neste projeto (falta o ficheiro .env com as chaves do
            Firebase — ver README). Por agora só podes continuar como convidado.
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth__form">
          {modo === "registo" && (
            <input
              type="text"
              placeholder="O teu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={!firebaseConfigurado}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!firebaseConfigurado}
          />
          <input
            type="password"
            placeholder="Password (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={!firebaseConfigurado}
          />

          {erro && <p className="auth__erro">{erro}</p>}

          <button className="btn btn-primaria" type="submit" disabled={!firebaseConfigurado || aEnviar}>
            {aEnviar ? "…" : modo === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          className="auth__trocar-modo"
          onClick={() => setModo(modo === "login" ? "registo" : "login")}
          disabled={!firebaseConfigurado}
        >
          {modo === "login" ? "Ainda não tens conta? Regista-te" : "Já tens conta? Entrar"}
        </button>

        <div className="auth__separador">ou</div>

        <button className="btn btn-secundaria" onClick={handleConvidado}>
          👤 Continuar como convidado
        </button>

        {onVoltar && (
          <button className="auth__voltar" onClick={onVoltar}>
            ← Voltar ao menu
          </button>
        )}
      </div>
    </div>
  );
}

export default Auth;
