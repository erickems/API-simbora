require('./config/mongo.service.js')
const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())
app.use(
    express.urlencoded({extended:true}),
    express.json(),
)

module.exports = app