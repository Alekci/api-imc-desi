const express = require('express');
const db = require('./db');
const calcularIMC = require('./imc')
const app = express()
const port = 3000
app.use(express.json())



app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/paciente', async (req, res) => {
  try {
    const [rows] = await db.execute('select * from pacientes');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro Interno do Servidor",
      detalhes: error.message
    });
  }
})
app.get('/paciente/obesidade', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pacientes WHERE status = "Obesidade";');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro Interno do Servidor",
      detalhes: error.message
    });
  }
})
app.get('/paciente/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('select * from pacientes where id=?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        mensagem: "Paciente não encontrado",
        detalhes: error.message
      });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro Interno do Servidor",
      detalhes: error.message
    });
  }
})

app.post('/paciente',async(req,res)=>{
  const {nome,idade,altura,peso}=req.body;
  if(!nome||!idade||!altura||!peso){
      return res.status(400).json({
        mensagem: "Verifique se todos os campos estão preenchidos",
        detalhes: error.message
      });
  }
  const {imc,status}=calcularIMC(Number(peso),Number(altura));
  try {
      const [rows] = await db.execute('INSERT INTO `pacientes` (`nome`, `idade`, `altura`, `peso`, `imc`, `status`) VALUES (?,?,?,?,?,?);', [nome,idade,altura,peso,imc,status]);
      res.status(201).json({
        id:rows.insertId,
        nome,
        idade,
        altura,
        peso,
        imc,
        status
      });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro Interno do Servidor",
      detalhes: error.message
    });
  }
})
app.put('/paciente/:id',async(req,res)=>{
  const { id } = req.params;
  const {nome,idade,altura,peso}=req.body;
  if(!nome||!idade||!altura||!peso||!id){
      return res.status(400).json({
        mensagem: "Verifique se todos os campos estão preenchidos",
        detalhes: error.message
      });
  }
  const {imc,status}=calcularIMC(Number(peso),Number(altura));
  try {
      const [rows] = await db.execute('UPDATE `pacientes` SET `nome` = ?, `idade` = ?, `altura` = ?, `peso` = ?, `imc` = ?, `status` = ? WHERE `pacientes`.`id` = ?;', [nome,idade,altura,peso,imc,status,id]);
      res.status(200).json({mensagem:"Paciente atualizado com sucesso."  
      });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro Interno do Servidor",
      detalhes: error.message
    });
  }
})

app.delete('/paciente/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('delete from pacientes where id=?', [id]);
    if (rows.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Paciente não encontrado",
        detalhes: error.message
      });
    }
    res.status(200).json({mensagem:"Paciente apagado com sucesso"});
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro Interno do Servidor",
      detalhes: error.message
    });
  }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})