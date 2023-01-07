require('./config/mongo.service.js')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors)
app.use(
    express.urlencoded({extended:true}),
    express.json(),
)

module.exports = app