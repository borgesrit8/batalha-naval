import React, { useState } from "react";
import "./lobby.css";
import { criarSala, entrarSala } from "../../services/salas";
import { useAuth } from "../../context/AuthContext";

// Ecrã de lobby: cria uma sala nova (gera código a partilhar com o
// amigo) ou entra numa sala existente através do código.
function Lobby({ onEntrouSala, onVoltar }) {
  const { utilizador } = useAuth();
  const [codigoInput, setCodigoInput] = useState("");
  const [aProcessar, setAProcessar] = useState(false);
  const [erro, setErro] = useState("");

  const nome = utilizador?.displayName || utilizador?.email || "Comandante";

  async function handleCriar() {
  if (!utilizador) {
    setErro("Ainda não estás autenticado.");
    return;
  }

  setErro("");
  setAProcessar(true);

  try {
    const codigo = await criarSala(utilizador.uid, nome);
    onEntrouSala(codigo, "A");
  } catch (e) {
    console.error(e);
    setErro("Não foi possível criar a sala.");
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
      setErro(e.message || "Não foi possível entrar na sala.");
    }
    setAProcessar(false);
  }

  return (
    <div id="lobby" className="animar-entrada">
      <div className="lobby__cartao vidro">
        <h2>Multiplayer Online</h2>
        <p className="lobby__descricao">Cria uma sala e envia o código a um amigo, ou entra numa sala existente.</p>

        <button className="btn btn-primaria" onClick={handleCriar} disabled={aProcessar}>
          ➕ Criar Sala Nova
        </button>

        <div className="lobby__separador">ou</div>

        <form onSubmit={handleEntrar} className="lobby__form">
          <input
            type="text"
            placeholder="Código da sala (ex: A3F9K)"
            value={codigoInput}
            maxLength={6}
            onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
          />
          <button className="btn btn-secundaria" type="submit" disabled={aProcessar}>
            Entrar na Sala
          </button>
        </form>

        {erro && <p className="lobby__erro">{erro}</p>}

        <button className="auth__voltar" onClick={onVoltar}>
          ← Voltar ao menu
        </button>
      </div>
    </div>
  );
}

export default Lobby;
