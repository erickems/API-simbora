const restFull = require('node-restful')
const mongoose = restFull.mongoose

const eventoSchema = new mongoose.Schema({
    nome : {type : String,required : true},
    horario : {type : Date, required : true},
    interessados : {type : }

})