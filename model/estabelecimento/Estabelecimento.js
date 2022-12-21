const { Schema } = require('mongoose')
const restful = require('node-restful')
const mongoose = restful.mongoose
const Evento = require('./../evento/Evento')

const estabelecimentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  long: { type: Number, required: true },
  lat: { type: Number, required: true },
  eventos : [String]
  })

module.exports = mongoose.model('Estabelecimento', estabelecimentoSchema)
