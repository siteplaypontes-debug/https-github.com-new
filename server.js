import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🔐 ENV
const API_ID = process.env.TELEGRAM_API_ID;
const API_HASH = process.env.TELEGRAM_API_HASH;
const WORKER_SECRET = process.env.TELEGRAM_WORKER_SECRET;

// TESTE
app.get("/", (req, res) => {
  res.send("Telegram Worker Online 🚀");
});

// START LOGIN
app.post("/start", async (req, res) => {
  const { phone } = req.body;

  console.log("Start login for:", phone);

  // aqui depois entra TDLib real
  res.json({
    success: true,
    message: "Código enviado (simulado)",
  });
});

// VERIFY CODE
app.post("/verify", async (req, res) => {
  const { code } = req.body;

  console.log("Verify code:", code);

  // aqui depois entra TDLib real
  res.json({
    success: true,
    message: "Login aprovado (simulado)",
  });
});

// STATUS
app.get("/status", (req, res) => {
  res.json({
    status: "ok",
    api_id: API_ID ? "configured" : "missing",
  });
});

app.listen(PORT, () => {
  console.log(`Worker rodando na porta ${PORT}`);
});
