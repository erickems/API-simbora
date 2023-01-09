require('./config/mongo.service.js')
const Cliente = require('./model/cliente/Cliente')
const Estabelecimento = require('./model/estabelecimento/Estabelecimento')
const Evento = require('./model/evento/Evento')
const app = require('./expressConfig.js')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 5010

app.listen(port, () => {
    console.log(`API funfando na porta ${port}`)
})

app.get('/', async(req, res) => {
    try{
        res.status(200).json({status: "API funcionando nice and clear"})

    }catch(error){
        res.status(500).json({error: error})
    }
})

app.get('/clientes', async(req, res) => {
    try{
        //não exibe a senha, apenas nome e email
        const cliente = await Cliente.find({}, {senha:0})
        res.status(200).json(cliente)

    }catch(error){
        res.status(500).json({error: error})
    }
})

app.post('/criaCliente', async(req, res) =>{

    let {
        nome,
        email,
        senha
    } = req.body

    if (!nome) {
        return res.status(422).json({ msg: "O nome é obrigatório!" });
    }
    
    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório!" });
    }

    if (!senha) {
        return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    const userExists = await Cliente.findOne({ email: email });

    if (userExists) {
        return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
    }

    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(senha, salt);

    const cliente = new Cliente({
        nome,
        email,
        hash
    })

    try {
        await Cliente.create(cliente);

        res.status(201).json({ msg: "Cliente criado com sucesso!" });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
})

app.post('/login', async(req, res) => {
    const { email, senha } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }

  if (!senha) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  const cliente = await Cliente.findOne({ email: email }).select("senha");

  if (!cliente) {
    return res.status(404).json({ msg: "Cliente não encontrado!" });
  }
  
  const checkPassword = bcrypt.compareSync(senha, cliente.senha);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida" });
  }

  try {
    const secret = "HIOAHDIHOIhOHihasd0901jaa";

    const token = jwt.sign({id: cliente._id,}, secret);

    res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
})

app.get("/cliente/:id", checkToken, async (req, res) => {
    const id = req.params.id;
    
    //não exibe a senha, apenas nome e email
    const cliente = await Cliente.findById(id, {}, {senha:0});
  
    if (!cliente) {
      return res.status(404).json({ msg: "Cliente não encontrado!" });
    }
  
    res.status(200).json({ cliente });
  });
  
  function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ msg: "Acesso negado!" });
  
    try {
      const secret = "HIOAHDIHOIhOHihasd0901jaa";
  
      jwt.verify(token, secret);
  
      next();
    } catch (err) {
      res.status(400).json({ msg: "O Token é inválido!" });
    }
  }

app.get('/estabelecimentos', async(req, res) => {
    try{
        const estabelecimento = await Estabelecimento.find()
        res.status(200).json(estabelecimento)

    }catch(error){
        res.status(500).json({error: error})
    }
})

app.post('/criaEstabelecimento', async(req, res) =>{
    const {
        nome,
        long,
        lat
    } = req.body

    const estabelecimento = {
        nome,
        long,
        lat
    }

    try{
        await Estabelecimento.create(estabelecimento)
        res.status(201).json({message: 'Estabelecimento criado com sucesso'})
    }catch(error){
        res.status(500).json({error: error})
    }
})

app.patch("/estabelecimentos/:id/eventos" ,async (req,res)=>{

    const estaId =req.params.id
    const evento = req.body
    try {
        const local = await Estabelecimento.findById(estaId)
        const nEvento = await Evento.create(evento)
        console.log(nEvento._id.valueOf())
        console.log(local.eventos)
       local.eventos.push(nEvento._id.valueOf())
        console.log(local.eventos)
        await Estabelecimento.findOneAndUpdate({_id : local._id.valueOf() } ,
             {eventos : local.eventos})
        res.send(201)
    } catch (error) {
        res.json(error)
    }
})


app.post('/eventos', async(req,res)=>{

    ///token do estabelecimento para recuperar 
    //do banco e adicionar o id deste evento
    const {nome,
         horario,
        promocoes,
        atracoes} = req.body
    
    const evento = {nome,
        horario,
       promocoes,
       atracoes}

    try {
        const e = await Evento.create(evento);

        //_id: new ObjectId("63a22514079eb1fe38d02421"),
        res.status(201).json({message: 'Evento criado com sucesso'})
    }catch(error){
        res.status(500).json({error: error})
    }
})

app.get("/eventos/:id", async(req , res)=>{

    console.log("--",req.params)
    try{
        const evento = await Evento.findById(req.params.id)
        res.json(evento)
    }catch(error){
        console.log(error)
        res.status(404)
    }
    })

module.exports = app