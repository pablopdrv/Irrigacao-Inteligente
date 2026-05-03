const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let umidadeAtual = 0;
let regar = false;
let plantaAtual = "alface";

// 🌱 Faixas reais (%)
const plantas = {
  alface: { min: 60, max: 80 },
  tomate: { min: 60, max: 70 },
  cebolinha: { min: 60, max: 70 },
  coentro: { min: 60, max: 70 },
  rucula: { min: 60, max: 80 },
  couve: { min: 60, max: 70 },
  espinafre: { min: 60, max: 80 },
  cenoura: { min: 65, max: 75 },
  beterraba: { min: 65, max: 75 },
  pepino: { min: 70, max: 80 },
  abobrinha: { min: 70, max: 80 },
  pimentao: { min: 65, max: 75 },
  manjericao: { min: 55, max: 65 },
  hortela: { min: 70, max: 80 },
  salsinha: { min: 60, max: 70 },
  milho: { min: 50, max: 60 },
  feijao: { min: 50, max: 60 },
  girassol: { min: 40, max: 50 },
  almeirao: { min: 60, max: 70 },
  repolho: { min: 70, max: 80 }
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
