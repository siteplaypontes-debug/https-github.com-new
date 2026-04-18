import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_ID = process.env.TELEGRAM_API_ID;
const API_HASH = process.env.TELEGRAM_API_HASH;
const WORKER_SECRET = process.env.TELEGRAM_WORKER_SECRET;

// ---------- AUTH MIDDLEWARE ----------
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  if (!WORKER_SECRET) {
    return res.status(500).json({ ok: false, error: "WORKER_SECRET não configurado" });
  }
  if (auth !== `Bearer ${WORKER_SECRET}`) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  next();
}

// ---------- PUBLIC ----------
app.get("/", (_req, res) => {
  res.send("Telegram Worker Online 🚀");
});

// ---------- HEALTH (autenticada) ----------
app.get("/health", requireAuth, (_req, res) => {
  res.json({
    ok: true,
    status: "ok",
    api_id: API_ID ? "configured" : "missing",
    api_hash: API_HASH ? "configured" : "missing",
    mode: "stub", // troca pra "tdlib" quando integrar GramJS de verdade
  });
});

// ---------- LOGIN START ----------
app.post("/start", requireAuth, async (req, res) => {
  const { phone, request_id } = req.body || {};
  if (!phone) return res.json({ ok: false, error: "phone obrigatório" });
  console.log("[start]", request_id, phone);
  // STUB — em produção real, chamar GramJS .sendCode()
  res.json({
    ok: true,
    phone_code_hash: "stub_hash_" + Date.now(),
  });
});

// ---------- LOGIN VERIFY ----------
app.post("/verify", requireAuth, async (req, res) => {
  const { code, phone } = req.body || {};
  if (!code) return res.json({ ok: false, error: "code obrigatório" });
  console.log("[verify]", phone, code);
  // STUB
  res.json({
    ok: true,
    session_string: "stub_session_" + Date.now(),
    user: { id: "0", first_name: "Stub", username: "stub_user", phone },
  });
});

// ---------- STATUS / DISCONNECT ----------
app.post("/status", requireAuth, (_req, res) => {
  res.json({ ok: true, status: "active", last_heartbeat: new Date().toISOString() });
});
app.post("/disconnect", requireAuth, (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Worker rodando na porta ${PORT}`));
