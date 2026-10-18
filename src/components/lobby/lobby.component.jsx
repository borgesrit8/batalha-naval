import React, { useState } from "react";
import "./lobby.css";
import { useT } from "../../i18n";
import { criarSala, entrarSala } from "../../services/salas";
import { useAuth } from "../../context/AuthContext";

// Ecrã de lobby: cria uma sala nova (gera código a partilhar com o
// amigo) ou entra numa sala existente através do código.
function Lobby({ onEntrouSala, onVoltar }) {
  const { utilizador } = useAuth();
  const t = useT();
  const [codigoInput, setCodigoInput] = useState("");
  const [aProcessar, setAProcessar] = useState(false);
  const [erro, setErro] = useState("");

  const nome = utilizador?.displayName || utilizador?.email || t("lobby.comandante");

  async function handleCriar() {
  if (!utilizador) {
    setErro(t("lobby.naoAutenticado"));
    return;
  }

  setErro("");
  setAProcessar(true);

  try {
    const codigo = await criarSala(utilizador.uid, nome);
    onEntrouSala(codigo, "A");
  } catch (e) {
    console.error(e);
    setErro(t("lobby.erroCriar"));
  }

  setAProcessar(false);
}
  async function handleEntrar(e) {
    e.preventDefault();
    if (codigoInput.trim() === "") return;
    setErro("");
    setAProcessar(true);
    try {
      const codigo = await entrarSala(codigoInput.trim(), utilizador.uid, nome);
      onEntrouSala(codigo, "B");
    } catch (e) {
      setErro(
        e.message === "sala-nao-encontrada" || e.message === "sala-cheia"
          ? t(`lobby.erros.${e.message}`)
          : t("lobby.erroEntrar")
      );
    }
    setAProcessar(false);
  }

  return (
    <div id="lobby" className="animar-entrada">
      <div className="lobby__cartao vidro">
        <h2>{t("lobby.titulo")}</h2>
        <p className="lobby__descricao">{t("lobby.descricao")}</p>

        <button className="btn btn-primaria" onClick={handleCriar} disabled={aProcessar}>
          {t("lobby.criar")}
        </button>

        <div className="lobby__separador">{t("comum.ou")}</div>

        <form onSubmit={handleEntrar} className="lobby__form">
          <input
            type="text"
            placeholder={t("lobby.placeholderCodigo")}
            value={codigoInput}
            maxLength={6}
            onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
          />
          <button className="btn btn-secundaria" type="submit" disabled={aProcessar}>
            {t("lobby.entrar")}
          </button>
        </form>

        {erro && <p className="lobby__erro">{erro}</p>}

        <button className="auth__voltar" onClick={onVoltar}>
          {t("comum.voltarMenu")}
        </button>
      </div>
    </div>
  );
}

export default Lobby;
