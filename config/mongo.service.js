const mongoose = require('mongoose')
require('dotenv').config()


const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_CLUSTER = process.env.DB_CLUSTER


mongoose.set('strictQuery', false)

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.${DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`)
    .then(() =>{console.log('Conexão estabelecida com o MongoDB')
})