import React, { useEffect, useState } from "react";
import "./achievement-toast.css";
import { useSom } from "../../hooks/useSom";

// Mostra uma pequena notificação temporária quando uma conquista é
// desbloqueada. Recebe uma fila de conquistas e apresenta-as uma a uma.
function AchievementToast({ conquistas }) {
  const [indice, setIndice] = useState(0);
  const tocar = useSom();

  useEffect(() => {
    setIndice(0);
  }, [conquistas]);

  useEffect(() => {
    if (indice >= conquistas.length) return;
    tocar("conquista");
    const t = setTimeout(() => setIndice((i) => i + 1), 3200);
    return () => clearTimeout(t);
  }, [indice, conquistas, tocar]);

  if (!conquistas || indice >= conquistas.length) return null;
  const c = conquistas[indice];

  return (
    <div className="achievement-toast animar-entrada" key={c.id}>
      <span className="achievement-toast__icone">{c.icone}</span>
      <div>
        <strong>Conquista desbloqueada!</strong>
        <p>{c.nome}</p>
      </div>
    </div>
  );
}

export default AchievementToast;
