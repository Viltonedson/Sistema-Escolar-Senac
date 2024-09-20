/*imports*/
require ('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//Config JSON resposta
app.use(express.json())

//Models
const User = require('../models/user')

//Abrir Rota - Public Route
app.get('/', (req, res) => {
    res.status(200).json({msg : 'EAE MEU PIVETE BEM VINDO A MINHA API!'})
})

//Private Route
app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id

    //check if user exist
    const user = await User.findById(id, '-password')

    if(!user){
     return res.status(404).json({msg : 'Usuário não encontrado'})
    }

    res.status(200).json({user})
})

function checkToken(req, res, next){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token){
        return res.status(401).json({msg : 'Acesso negado!'})
    }

    try {
        
        const secret = process.env.SECRET

        jwt.verify(token, secret)
        next()

    } catch (error) {
        res.status(400).json({msg:'Token Inválido'})
    }
}

// Registro de Usuario
app.post('/auth/register', async(require, res) => {

    const {name, password, confirmpassword, email, numerotelefone, datanascimento, cpf} = require.body

    //Validacao
    if(!name){
        return res.status(422).json({msg : 'O nome é obrigatório!'})
    }

    if(!password){
        return res.status(422).json({msg : 'A senha é obrigatória!'})
    }

    if(!confirmpassword){
        return res.status(422).json({msg : 'E obrigatorio confirmar a senha!'})
    }

    if(!email){
        return res.status(422).json({msg : 'O email é obrigatório!'})
    }

    if(!numerotelefone){
        return res.status(422).json({msg : 'O numero de telefone é obrigatória!'})
    }

    if(!datanascimento){
        return res.status(422).json({msg : 'A data de nascimento é obrigatório!'})
    }

    if(!cpf){
        return res.status(422).json({msg : 'O cpf é obrigatório!'})
    }

    //query check if user exist
    const userExist = await User.findOne({email: email})
    if (userExist){
        return res.status(422).json({msg : 'O email já está cadastrado no sistema, utilize outro!'})
    }

    //criar password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //criar usuario
    const user = new User({
        name,
        email,
        password : passwordHash,
        numerotelefone,
        datanascimento,
        cpf
    })

    try{
        await user.save()

        res.status(201).json({msg : 'Usúario criado com sucesso!'})

    }catch(error){
        console.log(error)

        res 
            .status(500)
            .json({
                msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!',
            })
    }

 

})

//Login User
   app.post('/auth/login', async (req, res) => {
    const {email, password} = req.body

//Validacao
    if (!email) {
        return res.status(422).json({msg : 'O email é obrigatorio'})
    }

    if(!password){
        return res.status(422).json({msg : 'A senha é obrigatória!'})
    }

//Check if user exist
const user = await User.findOne({email: email})

if (!user){
    return res.status(404).json({ msg : 'Usuário não encontrado, necessario fazer o registro'})
}

//check if password match/existe
const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword){
        return res.status(422).json({ msg : 'Senha Inválida'})
    }

try {
    const secret = process.env.SECRET
    const token = jwt.sign(
        {
            id: user._id,
    },
    secret,
)
    res.status(200).json({msg : "Autenticação realizada com sucesso", token})

} catch (err) {
    console.log(error)
}
})

//Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@medepapai.npmbv.mongodb.net/?retryWrites=true&w=majority&appName=MEDEPAPAI`)
.then(() => {
        app.listen(3000)
        console.log('Conectado ao Banco com Sucesso!')})
.catch((err) => console.log((err)))
