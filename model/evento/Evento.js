const restFull = require('node-restful')
const mongoose = restFull.mongoose

const eventoSchema = new mongoose.Schema({
    nome : {type : String,required : true},
    horario : {type : Date, required : true},
    promocoes : {type : [String], required : true},
    atracoes : {type : [String], required : true},
    interessados: {type: [String]}
})

module.exports= mongoose.model('Evento',  eventoSchema)
