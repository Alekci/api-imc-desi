const express = require('express');
const db = require('./db');
<<<<<<< HEAD
const app = express()
const calcularIMC = require('./imc')
const port = 3000
const converterTemperatura = require('./conversor')
app.use(express.json())
=======
const app = express();
const port = 3000;
const calcularDolar = require('./conversor')
>>>>>>> 8170ae3fb144b6d46f0995b3aada3528e708551b

// Middleware para interpretar requisições em formato JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Ativa!!')
})
app.get('/medicoes', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM medicoes');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

app.get('/medicoes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM medicoes WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensagem: "Medição não encontrada" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

app.post('/medicao', async (req, res) => {
  const { descricao, tipo = "temperatura", valorOriginal, unidadeOriginal = "Cº", valorConvertido, unidadeConvertida = "Fº" } = req.body;

  if (!descricao || !valorOriginal) {
    return res.status(400).json({ mensagem: "Verifique se todos os campos estão preenchidos" });
  }
  const { fahrenheit, classificacao } = converterTemperatura(Number(valorOriginal));

  try {
    const [rows] = await db.execute('INSERT INTO `medicoes` (descricao, tipo, valorOriginal, unidadeOriginal, valorConvertido, unidadeConvertida, classificacao) VALUES (?, ?, ?, ?, ?, ?, ?)', [descricao, tipo, valorOriginal, unidadeOriginal, valorConvertido, unidadeConvertida, classificacao]);

    res.status(201).json({
      id: rows.insertId,
      descricao,
      tipo,
      valorOriginal: Number(valorOriginal),
      unidadeOriginal,
      fahrenheit: Number(fahrenheit),
      unidadeConvertida,
      classificacao
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
<<<<<<< HEAD
});

app.put('/paciente/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, idade, altura, peso } = req.body;

  // Validação dos campos obrigatórios
  if (!nome || !idade || !altura || !peso) {
    return res.status(400).json({ mensagem: "Verifique se todos os campos estão preenchidos" });
  }

  const { imc, status } = calcularIMC(peso, altura);

  try {
    const query = `
      UPDATE medicoes 
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
=======

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
>>>>>>> 8170ae3fb144b6d46f0995b3aada3528e708551b

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
<<<<<<< HEAD
    const [result] = await db.execute('DELETE FROM medicoes WHERE id = ?', [id]);
=======
    const [result] = await db.execute('DELETE FROM pacientes WHERE id = ?', [id]);
>>>>>>> 8170ae3fb144b6d46f0995b3aada3528e708551b
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Paciente não encontrado" });
    }
    res.status(200).json({ mensagem: "Paciente apagado com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

<<<<<<< HEAD
app.listen(port, () => {
  console.log(`Servidor rodando com sucesso em http://localhost:${port}`);
});
=======
>>>>>>> 8170ae3fb144b6d46f0995b3aada3528e708551b
app.listen(port, () => {
  console.log(`Servidor rodando com sucesso em http://localhost:${port}`);
});