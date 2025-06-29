// test-post.js

// Usa node-fetch dinamicamente no Node.js (compatível com ES modules)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Dados da aeronave que você quer inserir no banco
const novaAeronave = {
  nome: "Boeing 737"
};

// Faz a requisição POST para a rota /aeronaves do seu backend
fetch("http://localhost:3000/aeronaves", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(novaAeronave)
})
  .then(res => res.json())
  .then(data => {
    console.log("✅ Resposta da API:", data);
  })
  .catch(err => {
    console.error("❌ Erro ao enviar:", err.message);
  });
