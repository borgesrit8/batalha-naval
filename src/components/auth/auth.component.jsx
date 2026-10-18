import React, { useState } from "react";
import "./auth.css";
import { useT } from "../../i18n";
import { useAuth } from "../../context/AuthContext";

// Ecrã de login/registo. Se o Firebase não estiver configurado, avisa e
// deixa sempre disponível o botão "continuar como convidado".
function Auth({ onEntrou, onVoltar }) {
  const { entrar, registar, entrarComoConvidado, erro, firebaseConfigurado } = useAuth();
  const t = useT();
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
        <h2>{modo === "login" ? t("auth.entrar") : t("auth.criarConta")}</h2>
        <p className="auth__descricao">
          {t("auth.descricao")}
        </p>

        {!firebaseConfigurado && (
          <p className="auth__aviso">{t("auth.naoConfigurado")}</p>
        )}

        <form onSubmit={handleSubmit} className="auth__form">
          {modo === "registo" && (
            <input
              type="text"
              placeholder={t("auth.teuNome")}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={!firebaseConfigurado}
            />
          )}
          <input
            type="email"
            placeholder={t("auth.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!firebaseConfigurado}
          />
          <input
            type="password"
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={!firebaseConfigurado}
          />

          {erro && <p className="auth__erro">{t(`auth.erros.${erro}`)}</p>}

          <button className="btn btn-primaria" type="submit" disabled={!firebaseConfigurado || aEnviar}>
            {aEnviar ? "…" : modo === "login" ? t("auth.entrar") : t("auth.criarContaBotao")}
          </button>
        </form>

        <button
          className="auth__trocar-modo"
          onClick={() => setModo(modo === "login" ? "registo" : "login")}
          disabled={!firebaseConfigurado}
        >
          {modo === "login" ? t("auth.semConta") : t("auth.comConta")}
        </button>

        <div className="auth__separador">{t("comum.ou")}</div>

        <button className="btn btn-secundaria" onClick={handleConvidado}>
          {t("auth.convidado")}
        </button>

        {onVoltar && (
          <button className="auth__voltar" onClick={onVoltar}>
            {t("comum.voltarMenu")}
          </button>
        )}
      </div>
    </div>
  );
}

export default Auth;
