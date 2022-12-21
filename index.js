require('./config/mongo.service.js')
const Cliente = require('./model/cliente/Cliente')
const Estabelecimento = require('./model/estabelecimento/Estabelecimento')
const Evento = require('./model/evento/Evento')
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

app.patch("/estabelecimentos/:id/eventos" ,async (req,res)=>{

    const estaId =req.params.id
    const evento = req.body
    try {
        const local = await Estabelecimento.findById(estaId)
        const nEvento = await Evento.create(evento)
        console.log(nEvento._id.valueOf())
        console.log(local.eventos)
       local.eventos.push(nEvento._id.valueOf())
        console.log(local.eventos)
        await Estabelecimento.findOneAndUpdate({_id : local._id.valueOf() } ,
             {eventos : local.eventos})
        res.send(201)
    } catch (error) {
        res.json(error)
    }
})


app.post('/eventos', async(req,res)=>{

    ///token do estabelecimento para recuperar 
    //do banco e adicionar o id deste evento
    const {nome,
         horario,
        promocoes,
        atracoes} = req.body
    
    const evento = {nome,
        horario,
       promocoes,
       atracoes}

    try {
        const e = await Evento.create(evento);

        //_id: new ObjectId("63a22514079eb1fe38d02421"),
        res.status(201).json({message: 'Evento criado com sucesso'})
    }catch(error){
        res.status(500).json({error: error})
    }
})

app.get("/eventos/:id", async(req , res)=>{

    console.log("--",req.params)
    try{
        const evento = await Evento.findById(req.params.id)
        res.json(evento)
    }catch(error){
        console.log(error)
        res.status(404)
    }
    })