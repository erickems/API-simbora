const restful = require('node-restful')
const Evento = require('./../evento/Evento')
const mongoose = restful.mongoose

const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  evento_interesse: {type: [String]}
  })

module.exports = mongoose.model('Cliente', clienteSchema)