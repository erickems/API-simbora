const restful = require('node-restful')
const mongoose = restful.mongoose

const estabelecimentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao : {type: String,required : true},
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  eventos : [String],
  tipo_estabelecimento: {type: String}
  })

module.exports = mongoose.model('Estabelecimento', estabelecimentoSchema)
