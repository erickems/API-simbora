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

app.get('/', async (req, res) => {
    try {
        res.status(200).json({ status: "API funcionando nice and clear" })

    } catch (error) {
        res.status(500).json({ error: error })
    }
})

app.get('/clientes', async (req, res) => {
    try {
        //não exibe a senha, apenas nome e email
        const cliente = await Cliente.find({}, { senha: 0 })
        res.status(200).json(cliente)

    } catch (error) {
        res.status(500).json({ error: error })
    }
})

app.post('/criaCliente', async (req, res) => {

    eventos = []

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
        senha: hash,
        eventos
    })

    try {
        await Cliente.create(cliente);

        res.status(201).json({ msg: "Cliente criado com sucesso!" });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
})

app.post('/login', async (req, res) => {
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

        const token = jwt.sign({ id: cliente._id, }, secret);

        res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
})

app.get("/cliente/:id", checkToken, async (req, res) => {
    const id = req.params.id;

    //não exibe a senha, apenas nome e email
    const cliente = await Cliente.findById(id, {}, { senha: 0 });

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

        //   jwt.verify(token, secret);
        jwt.verify(token, secret, function (err, decoded) {
            if (err) return res.status(500).json({ auth: false, message: 'Falha para autenticar o token.' });

            // se tudo estiver ok, salva no request para uso posterior
            req.userId = decoded.id;
            console.log(req.userId)
            // console.log(req.userId)

            next();

        });

        //   next();
    } catch (err) {
        res.status(400).json({ msg: "O Token é inválido!" });
    }
}

app.get('/estabelecimentos', async (req, res) => {
    try {
        const estabelecimento = await Estabelecimento.find()
        res.status(200).json(estabelecimento)

    } catch (error) {
        res.status(500).json({ error: error })
    }
})

app.post('/criaEstabelecimento', async (req, res) => {
    const {
        nome,
        descricao,
        long,
        lat
    } = req.body

    const estabelecimento = {
        nome,
        descricao,
        long,
        lat
    }

    try {
        await Estabelecimento.create(estabelecimento)
        res.status(201).json({ message: 'Estabelecimento criado com sucesso' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

app.get("/estabelecimentos/:id/eventos", async (req, res) => {

    const estaId = req.params.id
    try {
        const local = await Estabelecimento.findById(estaId)
        // console.log(local.eventos)
        let eventos = []
        for (let i = 0; i < local.eventos.length; i++) {
            let evento = await Evento.findById(local.eventos[i])
            // console.log(evento)
            eventos.push(evento)
        }
        // console.log(eventos)
        res.send(201, eventos)
    } catch (error) {
        res.json(error)
    }

})

app.patch("/estabelecimentos/:id/eventos", async (req, res) => {

    const estaId = req.params.id
    const evento = req.body
    try {
        const local = await Estabelecimento.findById(estaId)
        const nEvento = await Evento.create(evento)
        // console.log(nEvento._id.valueOf())
        // console.log(local.eventos)
        local.eventos.push(nEvento._id.valueOf())
        // console.log(local.eventos)
        await Estabelecimento.findOneAndUpdate({ _id: local._id.valueOf() },
            { eventos: local.eventos })
        res.send(201)
    } catch (error) {
        res.json(error)
    }
})


app.post('/eventos', async (req, res) => {

    ///token do estabelecimento para recuperar 
    //do banco e adicionar o id deste evento
    const { nome,
        horario,
        promocoes,
        atracoes } = req.body

    const evento = {
        nome,
        horario,
        promocoes,
        atracoes
    }

    try {
        const e = await Evento.create(evento);

        //_id: new ObjectId("63a22514079eb1fe38d02421"),
        res.status(201).json({ message: 'Evento criado com sucesso' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

app.get("/eventos/:id", async (req, res) => {

    // console.log("--",req.params)
    try {
        const evento = await Evento.findById(req.params.id)
        res.json(evento)
    } catch (error) {
        console.log(error)
        res.status(404)
    }
})

app.get("/eventos/verifyuser/:idEvento", checkToken, async (req, res) => {

    let userId = req.userId
    console.log("checa evento")
    console.log(userId)

    const evento = await Evento.findById(req.params.idEvento)
    console.log(evento)

    if (!evento) {
        return res.status(404).json({ msg: "Evento não encontrado!" });
    }

    console.log(userId)
    console.log(evento.interessados.indexOf(userId))
    if (evento.interessados.indexOf(userId) != -1) {

         res.status(200).end();
    } else {
        res.status(404).end();
    }
})

app.patch('/eventos/sub/:id_evento', checkToken, async (req, res) => {


    try {

        let cliente = await Cliente.findById(req.userId)
        // console.log(cliente)

        const id_evento = req.params.id_evento
        let evento = await Evento.findById(id_evento)
        let interessadosN = evento.interessados
        // console.log(id_evento)
        // console.log(evento)
        //coloca o id do cliente na lista de interessados
        interessadosN.push(req.userId)
        let update = { interessados: interessadosN }

        //faz o update no evento
        let doc = await Evento.findOneAndUpdate({ _id: id_evento }, update)
        // console.log(doc)
        //faz o update na lista de eventos de interesse em cliente
        let interessado = cliente['evento_interesse']
        interessado.push(id_evento)

        update = { evento_interesse: interessado }
        await Cliente.findOneAndUpdate(req.userId, update);
        res.status(201).json(doc)

    } catch (error) {
        res.status(500).json({ error: error })
    }

})
module.exports = app
