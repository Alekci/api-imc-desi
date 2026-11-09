const express = require('express');
const db = require('./db');
const app = express();
const port = 3000;
const calcularDolar = require('./conversor')

// Middleware para interpretar requisições em formato JSON
app.use(express.json());

/**
 * Função utilitária para calcular IMC e determinar o Status Nutricional no Server-Side
 */
function calcularIMC(peso, altura) {
  const numPeso = parseFloat(peso);
  const numAltura = parseFloat(altura);

  const imcCalculado = numPeso / (numAltura * numAltura);
  const imc = parseFloat(imcCalculado.toFixed(2));

  let status = "Peso normal";
  if (imc < 18.5) {
    status = "Abaixo do peso";
  } else if (imc >= 18.5 && imc <= 24.9) {
    status = "Peso normal";
  } else if (imc >= 25.0 && imc <= 29.9) {
    status = "Sobrepeso";
  } else {
    status = "Obesidade";
  }

  return { imc, status };
}

// -----------------------------------------------------------------------------
// 1. READ ALL (GET /paciente) - Listar todos os pacientes
// -----------------------------------------------------------------------------
app.get('/paciente', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pacientes');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

// -----------------------------------------------------------------------------
// 2. READ FILTERED (GET /paciente/obesidade) - Listar apenas pacientes com obesidade
// -----------------------------------------------------------------------------
app.get('/paciente/obesidade', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pacientes WHERE status = "Obesidade"');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

// -----------------------------------------------------------------------------
// 3. READ ONE (GET /paciente/:id) - Buscar paciente específico por ID
// -----------------------------------------------------------------------------
app.get('/paciente/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM pacientes WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensagem: "Paciente não encontrado" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

// -----------------------------------------------------------------------------
// 4. CREATE (POST /paciente) - Cadastrar novo paciente com cálculo automático de IMC
// -----------------------------------------------------------------------------
app.post('/paciente', async (req, res) => {
  const { nome, idade, altura, peso } = req.body;

  // Validação dos dados recebidos
  if (!nome || !idade || !altura || !peso) {
    return res.status(400).json({ mensagem: "Verifique se todos os campos estão preenchidos" });
  }

  // Processamento das regras de negócio no servidor
  const { imc, status } = calcularIMC(peso, altura);

  try {
    const query = `
      INSERT INTO pacientes (nome, idade, altura, peso, imc, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [nome, idade, altura, peso, imc, status]);

    res.status(201).json({
      id: result.insertId,
      nome,
      idade: Number(idade),
      altura: Number(altura),
      peso: Number(peso),
      imc,
      status
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }

});
app.post('/converter', async (req, res) => {
  const { valorReal, cotacao, descricao } = req.body;

  if (!descricao || !valorReal || !cotacao) {
    return res.status(400).json({ mensagem: "Verifique se todos os campos estão preenchidos" });
  }
  const { dolar } = calcularDolar(Number(valorReal), Number(cotacao));

  try {
    const [rows] = await db.execute('INSERT INTO `conversoes` (descricao, valorReal, cotacao, valorDolar) VALUES (?, ?, ?, ?)', [descricao, valorReal, cotacao, dolar]);

    res.status(201).json({
      id: rows.insertId,
      descricao,
      valorReal,
      cotacao,
      dolar
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});
// -----------------------------------------------------------------------------
// 5. UPDATE (PUT /paciente/:id) - Atualizar dados do paciente e recalcular IMC
// -----------------------------------------------------------------------------
app.put('/paciente/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, idade, altura, peso } = req.body;

  // Validação dos campos obrigatórios
  if (!nome || !idade || !altura || !peso) {
    return res.status(400).json({ mensagem: "Verifique se todos os campos estão preenchidos" });
  }

  // Recálculo obrigatório do IMC e status com base nos novos valores
  const { imc, status } = calcularIMC(peso, altura);

  try {
    const query = `
      UPDATE pacientes 
      SET nome = ?, idade = ?, altura = ?, peso = ?, imc = ?, status = ? 
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [nome, idade, altura, peso, imc, status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Paciente não encontrado para atualização" });
    }

    res.status(200).json({
      id: Number(id),
      nome,
      idade: Number(idade),
      altura: Number(altura),
      peso: Number(peso),
      imc,
      status
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

// -----------------------------------------------------------------------------
// 6. DELETE (DELETE /paciente/:id) - Remover paciente do banco
// -----------------------------------------------------------------------------
app.delete('/paciente/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM pacientes WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Paciente não encontrado" });
    }
    res.status(200).json({ mensagem: "Paciente apagado com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando com sucesso em http://localhost:${port}`);
});