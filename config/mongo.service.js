const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://erick:6pCPzGoRrz6bLtZL@apicluster.chdkhx1.mongodb.net/?retryWrites=true&w=majority")
    .then(() =>{console.log('Conexão estabelecida com o MongoDB')
})

//mongosh "mongodb+srv://cluster0.jcd84pe.mongodb.net/simbora" --apiVersion 1 --username erick
//"mongodb+srv://erick:6pCPzGoRrz6bLtZL@cluster0.jcd84pe.mongodb.net/?retryWrites=true&w=majority"