// ============================================================
// SALAS DE MULTIPLAYER (Firestore)
// Modelo de dados:
//   rooms/{codigo}                      -> estado partilhado da sala
//   rooms/{codigo}/frotas/{uid}         -> posição da frota de CADA jogador
//                                          (só legível/escrevível pelo próprio — ver firestore.rules)
//   rooms/{codigo}/jogadas/{jogadaId}   -> cada tiro disparado
//
// Nota importante (ver README): sem Cloud Functions, é o defensor quem
// calcula e reporta se foi atingido, porque é o único que tem acesso à
// sua própria frota. Suficiente para jogar com amigos; não é à prova de
// um cliente alterado de propósito.
// ============================================================
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

function gerarCodigo() {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem O/0/I/1 para evitar confusão
  let codigo = "";
  for (let i = 0; i < 5; i++) codigo += letras[Math.floor(Math.random() * letras.length)];
  return codigo;
}

export async function criarSala(uid, nome) {
  const codigo = gerarCodigo();
  await setDoc(doc(db, "rooms", codigo), {
    codigo,
    jogadorA: { uid, nome },
    jogadorB: null,
    estado: "espera", // espera -> colocacao -> batalha -> fim
    prontoA: false,
    prontoB: false,
    vez: null,
    vencedor: null,
    criadoEm: serverTimestamp(),
  });
  return codigo;
}

export async function entrarSala(codigo, uid, nome) {
  const ref = doc(db, "rooms", codigo.toUpperCase());
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Sala não encontrada. Confirma o código.");
  const sala = snap.data();

  if (sala.jogadorA && sala.jogadorA.uid === uid) return sala.codigo;
  if (sala.jogadorB && sala.jogadorB.uid === uid) return sala.codigo;
  if (sala.jogadorB) throw new Error("Esta sala já está cheia.");

  await updateDoc(ref, { jogadorB: { uid, nome }, estado: "colocacao" });
  return sala.codigo;
}

export function ouvirSala(codigo, callback) {
  return onSnapshot(doc(db, "rooms", codigo), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}

export function ouvirJogadas(codigo, callback) {
  const q = query(collection(db, "rooms", codigo, "jogadas"), orderBy("criadoEm", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function guardarFrota(codigo, uid, tabuleiro, sou) {
  await setDoc(doc(db, "rooms", codigo, "frotas", uid), { tabuleiro });
  const ref = doc(db, "rooms", codigo);
  await updateDoc(ref, sou === "A" ? { prontoA: true } : { prontoB: true });
}

export async function carregarFrotaPropria(codigo, uid) {
  const snap = await getDoc(doc(db, "rooms", codigo, "frotas", uid));
  return snap.exists() ? snap.data().tabuleiro : null;
}

export async function iniciarBatalha(codigo, primeiroUid) {
  await updateDoc(doc(db, "rooms", codigo), { estado: "batalha", vez: primeiroUid });
}

export async function dispararOnline(codigo, atiradorUid, adversarioUid, l, c) {
  await addDoc(collection(db, "rooms", codigo, "jogadas"), {
    atirador: atiradorUid,
    l,
    c,
    resultado: null,
    afundado: false,
    criadoEm: serverTimestamp(),
  });
  // A vez passa logo para o adversário: ele vai primeiro "ver" o resultado
  // do disparo que acabou de sofrer e, de seguida, disparar o seu.
  await updateDoc(doc(db, "rooms", codigo), { vez: adversarioUid });
}

export async function resolverJogada(codigo, jogadaId, { acertou, afundado, terminouCom }) {
  await updateDoc(doc(db, "rooms", codigo, "jogadas", jogadaId), {
    resultado: acertou,
    afundado,
  });

  if (terminouCom) {
    await updateDoc(doc(db, "rooms", codigo), { estado: "fim", vencedor: terminouCom, vez: null });
  }
}
