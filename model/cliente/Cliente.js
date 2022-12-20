const restful = require('node-restful')
const mongoose = restful.mongoose

const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true }
  })

module.exports = mongoose.model('Cliente', clienteSchema)