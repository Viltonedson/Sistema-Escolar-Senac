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
const Turmas = require('./models/Turmas')
const Disciplinas = require('./models/Disciplinas')
const Comunicados = require('./models/Comunicado')
const ProfessorDisciplinas = require('./models/ProfessorDisciplinas');
const TurmasDisciplinas = require('./models/TurmasDisciplinas');
const AlunosTurmas = require('./models/AlunosTurmas');
const Conceito = require('./models/Conceito');

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
//================================================================================================================//
//================================================================================================================//

// Registro de Usuario
app.post('/auth/register', async (req, res) => {

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
app.get('/user', async (req, res) => {
    try {
        const users = await User.find();  // Busca todos os usuários no banco de dados
        res.json(users);  // Retorna os usuários como JSON
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }
});

module.exports = router;

app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, numerotelefone, datanascimento, cpf, tipodeUsuario } = req.body;
    
    try {
    const { id } = req.params;
    const { name, email, password, numerotelefone, datanascimento, cpf, tipodeUsuario } = req.body;

    // Verifica se o usuário existe
     let user = await User.findById(id);
     if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

     // Atualiza os campos necessários
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;
    user.numerotelefone = numerotelefone || user.numerotelefone;
    user.datanascimento = datanascimento || user.datanascimento;
    user.cpf = cpf || user.cpf;
    user.tipodeUsuario = tipodeUsuario || user.tipodeUsuario;

    await user.save();

    res.json({ msg: 'Usuário atualizado com sucesso.' });
    } catch (error) {
    res.status(500).json({ msg: 'Erro ao atualizar usuário.' });
    }
});

//Rota para aceitar a requisição do DELETE do front
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se o usuário existe e exclui
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }

        res.json({ msg: 'Usuário excluído com sucesso.' });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao excluir usuário.' });
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
//================================================================================================================//
//================================================================================================================//

// Criar turma
app.post('/Turmas', async (req, res) => {
    const { nome, ano, semestres, turno } = req.body;
    try {
        const turma = new Turmas({ nome, ano, semestres, turno });
        await turma.save();
        res.status(201).json({ message: 'Turma criada com sucesso!', turma });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar turma', error });
    }
});

// Visualizar todas as turmas
app.get('/Turmas', async (req, res) => {
    try {
        const turmas = await Turmas.find();
        res.status(200).json(turmas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar turmas', error });
    }
});

// Criar disciplina
app.post('/Disciplinas', async (req, res) => {
    const { nome, descricao } = req.body;
    try {
        const disciplina = new Disciplinas({ nome, descricao });
        await disciplina.save();
        res.status(201).json({ message: 'Disciplina criada com sucesso!', disciplina });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar disciplina', error });
    }
});

// Visualizar todas as disciplinas
app.get('/Disciplinas', async (req, res) => {
    try {
        const disciplinas = await Disciplinas.find();
        res.status(200).json(disciplinas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar disciplinas', error });
    }
});

// Rota para alocar professores a uma disciplina
app.post('/ProfessorDisciplinas', async (req, res) => {
    try {
        const { disciplinaId, professores } = req.body;
        if (!disciplinaId || !Array.isArray(professores) || professores.length === 0) {
            return res.status(400).json({ message: 'Disciplina ID e professores são obrigatórios.' });
        }

        
        const alocacoes = professores.map(professorId => ({
            professor_id: professorId,
            disciplina_id: disciplinaId,
        }));
        
        await ProfessorDisciplinas.insertMany(alocacoes);
        
        res.status(201).json({ message: 'Professores alocados com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao alocar professores' });
    }
});
module.exports = router;
app.get('/professores', async (req, res) => {
    try {
        const professores = await User.find({ tipodeUsuario: 'Professor' });
        res.status(200).json(professores);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar professores', error });
    }
});

// Rota para buscar usuários do tipo Professor
app.get('/users', async (req, res) => {
    try {
        const { tipodeUsuario } = req.query;
        let query = {};
        if (tipodeUsuario) {
            query.tipodeUsuario = tipodeUsuario; 
        }
        const users = await User.find(query);
        res.json(users); 
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).send('Erro ao buscar usuários');
    }
});


router.get('/turmas/:turma_id/disciplinas', async (req, res) => {
    try {
        const turmasDisciplinas = await TurmasDisciplinas.find({ turma_id: req.params.turmaId }).populate('disciplina_id');
        const result = [];

        for (const turmaDisciplina of turmasDisciplinas) {
            const professorDisciplina = await ProfessorDisciplina.findOne({ disciplina_id: turmaDisciplina.disciplina_id._id }).populate('professor_id');
            result.push({
                nome: turmaDisciplina.disciplina_id.nome,
                professor: professorDisciplina ? professorDisciplina.professor_id : null
            });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar disciplinas da turma.' });
    }
});


app.post('/turmas/:turma_id/disciplinas', async (req, res) => {
    try {
        const { disciplinaId } = req.body;
        await TurmasDisciplinas.create({ turma_id: req.params.turmaId, disciplina_id: disciplinaId });
        res.status(200).json({ message: 'Disciplina adicionada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar disciplina.' });
    }
});

app.post('/alunosturmas', async (req, res) => {
    try {
        const { aluno_id, turma_id } = req.body;

        
        const novaAssociacao = new AlunosTurmas({
            aluno_id,
            turma_id
        });

        
        await novaAssociacao.save();

        res.status(201).json({ message: 'Aluno associado à turma com sucesso!', novaAssociacao });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao associar aluno à turma.' });
    }
});

//================================================================================================================//
//================================================================================================================//
app.post('/Conceitos', async (req, res) => {
    try {
        const { aluno, disciplina, conceito } = req.body;

        
        const novoConceito = new Conceito({
            aluno,
            disciplina,
            conceito
        });

       
        await novoConceito.save();

        res.status(201).json({ message: 'Conceito criado com sucesso!', novoConceito });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar conceito.' });
    }
});

app.get('/turmas/:turmaId/disciplinas', async (req, res) => {
    try {
        const turmaId = req.params.turmaId;
        const disciplinas = await TurmasDisciplinas.find({ turma_id: turmaId }).populate('disciplina');
        res.json(disciplinas.map(td => td.disciplina));
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar disciplinas da turma' });
    }
});
// Buscar alunos e conceitos vinculados a uma disciplina
app.get('/disciplinas/:disciplinaId/alunos-conceitos', async (req, res) => {
    try {
        const disciplinaId = req.params.disciplinaId;

      
        const alunosTurmas = await AlunosTurmas.find({ disciplina_id: disciplinaId }).populate('aluno');
        const conceitos = await Conceito.find({ disciplina: disciplinaId });

        
        const alunosConceitos = alunosTurmas.map(alunoTurma => {
            const conceito = conceitos.find(c => c.aluno.equals(alunoTurma.aluno._id));
            return {
                aluno: alunoTurma.aluno,
                conceito: conceito || null
            };
        });

        res.json(alunosConceitos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar alunos e conceitos' });
    }
});
//================================================================================================================//
//================================================================================================================//
app.get('/comunicados', async (req, res) => {
    try {
        const comunicados = await Comunicados.find().populate('autor_id destinatarios');
        res.status(200).json(comunicados);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar comunicados', error });
    }
})

app.post('/comunicados', checkToken, async (req, res) => {
    const { titulo, conteudo, destinatarios } = req.body;
    const autor_id = req.user.id;

    const novoComunicado = new Comunicados({
        titulo,
        conteudo,
        autor_id,
        destinatarios
    });

    try {
        await novoComunicado.save();
        res.status(201).json({ message: 'Comunicado criado com sucesso!', novoComunicado });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar comunicado', error });
    }
});
//================================================================================================================//
//================================================================================================================//
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

