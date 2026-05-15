const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let umidadeAtual = 0;
let regar = false;
let plantaAtual = "alface";

// 🌱 Faixas reais (%)
const plantas = {
  alface: { min: 30, max: 45 },
  tomate: { min: 20, max: 60 },
  cebolinha: { min: 12, max: 34 },
  coentro: { min: 26, max: 49 },
  rucula: { min: 32, max: 72 },
  couve: { min: 42, max: 63 },
  espinafre: { min: 15, max: 32 },
  cenoura: { min: 21, max: 48 },
  beterraba: { min: 34, max: 55 },
  pepino: { min: 23, max: 47 },
  abobrinha: { min: 30, max: 65 },
  pimentao: { min: 15, max: 48 },
  manjericao: { min: 15, max: 40 },
  hortela: { min: 15, max: 35 },
  salsinha: { min: 24, max: 58  },
  milho: { min: 32, max: 48 },
  feijao: { min: 27, max: 55 },
  girassol: { min: 40, max: 50 },
  almeirao: { min: 30, max: 40 },
  repolho: { min: 31, max: 50 }
};

// Recebe do ESP32
app.post("/umidade", (req, res) => {
  umidadeAtual = req.body.umidade;

  const faixa = plantas[plantaAtual];

  console.log(`Umidade: ${umidadeAtual}% | Ideal: ${faixa.min}-${faixa.max}%`);

  if (umidadeAtual < faixa.min) {
    regar = true;
  }

  res.send("OK");
});

// ESP32 consulta
app.get("/comando", (req, res) => {
  res.json({ regar });
});

// botão manual
app.post("/regar", (req, res) => {
  regar = true;
  res.send("OK");
});

// reset
app.post("/reset", (req, res) => {
  regar = false;
  res.send("OK");
});

// trocar planta
app.post("/planta", (req, res) => {
  plantaAtual = req.body.planta;
  res.send("OK");
});

// status pro site
app.get("/status", (req, res) => {
  const faixa = plantas[plantaAtual];

  res.json({
    planta: plantaAtual,
    umidade: umidadeAtual,
    ideal: `${faixa.min}-${faixa.max}%`,
    status: umidadeAtual < faixa.min ? "SECO" : "OK"
  });
});

// lista
app.get("/plantas", (req, res) => {
  res.json(plantas);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});
