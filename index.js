const express = require('express');
const db = require('./db');
const app = express()
const calcularIMC = require('./imc')
const port = 3000
const converterTemperatura = require('./conversor')
app.use(express.json())


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

app.delete('/paciente/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM medicoes WHERE id = ?', [id]);
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
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})