const restful = require('node-restful')
const mongoose = restful.mongoose

const estabelecimentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  long: { type: Number, required: true },
  lat: { type: Number, required: true }
  })

module.exports = mongoose.model('Estabelecimento', estabelecimentoSchema)