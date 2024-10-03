/*imports*/
require ('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors'); 
const router = express.Router();

const app = express()

//Config JSON resposta
app.use(express.json())
app.use(cors());

//Models, Rotas
const User = require('./models/user')


//Abrir Rota - Public Route
app.get('/', (req, res) => {
    res.status(200).json({msg : 'EAE MEU PIVETE BEM VINDO A MINHA APi!'})
})

//Private Route
app.get('/user/:id', checkToken, async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Excluindo o campo de senha
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }
});


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

    const {name, password, confirmpassword, email, numerotelefone, datanascimento, cpf, tipodeUsuario} = require.body

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

    if (!tipodeUsuario) {
        return res.status(422).json({ msg: 'O tipo de usuário é obrigatório!' })
    }

     // Validação para garantir que o tipo de usuário é válido
     const tiposValidos = ['Aluno', 'Professor', 'Coordenador']
     if (!tiposValidos.includes(tipodeUsuario)) {
         return res.status(422).json({ msg: 'Tipo de usuário inválido! Os valores permitidos são: Aluno, Professor, Coordenador.' })
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
        cpf,
        tipodeUsuario
    })

    // Usuario registrando no bd
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

// ========Rota para listar todos os usuários
router.get('/user', async (req, res) => {
    try {
        const users = await User.find();  // Busca todos os usuários no banco de dados
        res.json(users);  // Retorna os usuários como JSON
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }
});

module.exports = router;

router.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, numerotelefone, datanascimento, cpf, tipodeUsuario } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, password, numerotelefone, datanascimento, cpf, tipodeUsuario },
            { new: true } // Retorna o usuário atualizado
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o usuário.' });
    }
});

//Rota para aceitar a requisição do DELETE do front
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir o usuário.' });
    }
});

//=======================
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

    if (user.tipodeUsuario !== 'Coordenador') {
        return res.status(403).json({ msg: 'Acesso restrito! Apenas coordenadores podem fazer login no sistema.' });
    }
    

try {
    const secret = process.env.SECRET
    const token = jwt.sign(
        {
            id: user._id,
    },
    secret,
)
    res.status(200).json({
        msg: "Autenticação realizada com sucesso",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                tipodeUsuario: user.tipodeUsuario
            }
        })

} catch (err) {
    console.log(err);
    res.status(500).json({
        msg: 'Ocorreu um erro no servidor, tente novamente mais tarde.',
    });
}
})




//Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@sistemaescolar.xkjs7.mongodb.net/?retryWrites=true&w=majority&appName=SistemaEscolar`)
.then(() => {
        app.listen(3000)
        console.log('Conectado ao Banco com Sucesso!')})
.catch((err) => console.log((err)))

// Configurar CORS para permitir requisições de qualquer origem
app.use(cors({
    origin: '*',  // Permitir todas as origens
}));

