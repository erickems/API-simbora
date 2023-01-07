require('./config/mongo.service.js')
const cors = require('cors')
const express = require('express')
const cliente = require('./model/cliente/Cliente')
const estabelecimento = require('./model/estabelecimento/Estabelecimento')
const evento = require('./model/evento/Evento')
const app = express()

app.use(cors())
app.use("/model/cliente/Cliente", cliente)
app.use("/model/estabelecimento/Estabelecimento", estabelecimento)
app.use("/model/evento/Evento", evento)
app.use(
    express.urlencoded({extended:true}),
    express.json()
)

module.exports = app