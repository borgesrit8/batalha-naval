// Língua por omissão: português se o telemóvel estiver em português
// (de qualquer país), inglês em todos os outros casos.
export function idiomaDoDispositivo() {
  const lingua = (typeof navigator !== "undefined" && (navigator.language || "")) || "";
  return lingua.toLowerCase().startsWith("pt") ? "pt" : "en";
}
