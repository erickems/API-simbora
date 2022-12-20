require('./config/mongo.service.js')
const Cliente = require('./model/cliente/Cliente')
const Estabelecimento = require('./model/estabelecimento/Estabelecimento')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(
    express.urlencoded({extended:true}),
    express.json(),
)

const port = 8080

app.listen(port, () => {
    console.log(`API funfando na porta ${port}`)
})

app.get('/clientes', async(req, res) => {
    try{
        const cliente = await Cliente.find()
        res.status(200).json(cliente)

    }catch(error){
        res.status(500).json({error: error})
    }
})

app.post('/criaCliente', async(req, res) =>{
    const {
        nome,
        email,
        senha
    } = req.body

    const cliente = {
        nome,
        email,
        senha
    }

    try{
        await Cliente.create(cliente)
        res.status(201).json({message: 'Cliente criado com sucesso'})
    }catch(error){
        res.status(500).json({error: error})
    }
})

app.get('/estabelecimentos', async(req, res) => {
    try{
        const estabelecimento = await Estabelecimento.find()
        res.status(200).json(estabelecimento)

    }catch(error){
        res.status(500).json({error: error})
    }
})

app.post('/criaEstabelecimento', async(req, res) =>{
    const {
        nome,
        long,
        lat
    } = req.body

    const estabelecimento = {
        nome,
        long,
        lat
    }

    try{
        await Estabelecimento.create(estabelecimento)
        res.status(201).json({message: 'Estabelecimento criado com sucesso'})
    }catch(error){
        res.status(500).json({error: error})
    }
})