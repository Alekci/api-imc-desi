const express = require('express');
const db = require('./db');
const calcularIMC = require('./imc');
const converterTemperatura = require('./conversor');

const app = express();
const port = 3000;


app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Ativa!!');
});

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
  const { descricao, tipo = "temperatura", valor_original, unidade_original = "Cº", unidade_convertida = "Fº" 
  } = req.body;

  if (!descricao || valor_original === undefined) {
    return res.status(400).json({ mensagem: "Verifique se todos os campos estão preenchidos" });
  }

  const { valor_convertido, classificacao } = converterTemperatura(Number(valor_original));

  try {
    const [rows] = await db.execute(
      'INSERT INTO `medicoes` (descricao, tipo, valor_original, unidade_original, valor_convertido, unidade_convertida, classificacao) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [descricao, tipo, valor_original, unidade_original, valor_convertido, unidade_convertida, classificacao]
    );

    res.status(201).json({
      id: rows.insertId,
      descricao,
      tipo,
      valor_original: Number(valor_original),
      unidade_original,
      valor_convertido,
      unidade_convertida,
      classificacao
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

app.put('/medicao/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, tipo = "temperatura", valor_original, unidade_original = "Cº", unidade_convertida = "Fº" } = req.body;

  if (!descricao || valor_original === undefined) {
    return res.status(400).json({ mensagem: "Verifique se todos os campos estão preenchidos" });
  }

  const { valor_convertido, classificacao } = converterTemperatura(Number(valor_original));

  try {
    const query = `
      UPDATE medicoes 
      SET descricao = ?, tipo = ?, valor_original = ?, unidade_original = ?, valor_convertido = ?, unidade_convertida = ?, classificacao = ? 
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [descricao, tipo, valor_original, unidade_original, valor_convertido, unidade_convertida, classificacao, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Medição não encontrada para atualização" });
    }

    res.status(200).json({
      id: Number(id),
      descricao,
      tipo,
      valor_original: Number(valor_original),
      unidade_original,
      valor_convertido,
      unidade_convertida,
      classificacao
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

app.delete('/medicao/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM medicoes WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Medição não encontrada" });
    }
    res.status(200).json({ mensagem: "Medição apagada com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando com sucesso em http://localhost:${port}`);
});