const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Imports dos modelos com os nomes exatos dos arquivos
const User = require('./models/user.js');
const Turmas = require('./models/Turmas.js');
const Disciplinas = require('./models/Disciplinas.js');
const ProfessorDisciplinas = require('./models/ProfessorDisciplinas.js');
const TurmasDisciplinas = require('./models/TurmasDisciplinas.js');
const AlunosTurmas = require('./models/AlunosTurmas.js');
const Conceito = require('./models/Conceito.js');
const Comunicado = require('./models/Comunicado.js');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', 'http://localhost:19000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Middleware para JSON
app.use(express.json());

// Configuração JSON
app.use(cors());

// Configuração do CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

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

    const {name, password, confirmpassword, email, numerotelefone, datanascimento, cpf, tipodeUsuario} = req.body

    
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

});

// ========Rota para listar todos os usuários
app.get('/user', async (req, res) => {
    try {
        const users = await User.find();  // Busca todos os usuários no banco de dados
        res.json(users);  // Retorna os usuários como JSON
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }
});

module.exports = app;

app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, numerotelefone, datanascimento, cpf, tipodeUsuario } = req.body;
    
    try {
        // Verifica se o usuário existe
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }

        // Atualiza os campos necessários
        user.name = name || user.name;
        user.email = email || user.email;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        user.numerotelefone = numerotelefone || user.numerotelefone;
        user.datanascimento = datanascimento || user.datanascimento;
        user.cpf = cpf || user.cpf;
        user.tipodeUsuario = tipodeUsuario || user.tipodeUsuario;

        await user.save();
        res.json({ msg: 'Usuário atualizado com sucesso.' });
    } catch (error) {
        console.error(error);
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
    const { email, password } = req.body;

    // Validacao
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatorio' });
    }

    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória!' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado, necessario fazer o registro' });
        }

        // check if password match
        if (!user.password) {
            return res.status(422).json({ msg: 'Erro no sistema de autenticação' });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        
        if (!checkPassword) {
            return res.status(422).json({ msg: 'Senha Inválida' });
        }

        if (user.tipodeUsuario !== 'Coordenador') {
            return res.status(403).json({ msg: 'Acesso restrito! Apenas coordenadores podem fazer login no sistema.' });
        }

        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        );
        res.status(200).json({
            msg: "Autenticação realizada com sucesso",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                tipodeUsuario: user.tipodeUsuario
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Ocorreu um erro no servidor, tente novamente mais tarde.',
        });
    }
})

// Login específico para o app mobile (apenas alunos)
app.post('/auth/login/mobile', async (req, res) => {
    try {
        console.log('Recebendo requisição de login mobile:', req.body);
        const { email, password } = req.body;

        // Validar entrada
        if (!email || !password) {
            console.log('Campos faltando:', { email: !!email, password: !!password });
            return res.status(422).json({ msg: 'Email e senha são obrigatórios!' });
        }

        // Buscar usuário pelo email
        const user = await User.findOne({ email: email });
        console.log('Usuário encontrado:', user ? 'Sim' : 'Não');
        
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // Verificar senha
        if (!user.password) {
            console.error('Usuário não tem senha definida');
            return res.status(400).json({ msg: 'Usuário não tem senha definida' });
        }

        const passwordCorreta = await bcrypt.compare(password, user.password);
        console.log('Senha está correta:', passwordCorreta ? 'Sim' : 'Não');

        if (!passwordCorreta) {
            return res.status(401).json({ msg: 'Senha incorreta' });
        }

        // Gerar token
        const secret = process.env.SECRET;
        const token = jwt.sign(
            { id: user._id },
            secret
        );

        // Enviar resposta
        res.status(200).json({
            msg: "Login realizado com sucesso",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                tipo: user.tipo
            }
        });

    } catch (error) {
        console.error('Erro no login mobile:', error);
        res.status(500).json({
            msg: 'Erro no servidor durante o login',
            error: error.message
        });
    }
});

//================================================================================================================//
//================================================================================================================//
// Criar turma
app.post('/turmas', async (req, res) => {
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
app.get('/turmas', async (req, res) => {
    try {
        const turmas = await Turmas.find();
        res.status(200).json(turmas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar turmas', error });
    }
});

// Rota para buscar uma turma específica por ID
app.get('/turmas/:id', async (req, res) => {
    try {
        const turma = await Turmas.findById(req.params.id);
        if (!turma) {
            return res.status(404).json({ message: 'Turma não encontrada' });
        }
        res.json(turma);
    } catch (error) {
        console.error('Erro ao buscar turma:', error);
        res.status(500).json({ message: 'Erro ao buscar turma' });
    }
});

// Criar disciplina
app.post('/disciplinas', async (req, res) => {
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
app.get('/disciplinas', async (req, res) => {
    try {
        const disciplinas = await Disciplinas.find();
        res.status(200).json(disciplinas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar disciplinas', error });
    }
});

// Rota para alocar professores a uma disciplina
app.post('/professordisciplinas', async (req, res) => {
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


app.get('/turmas/:turma_id/disciplinas', async (req, res) => {
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

// Rota para buscar disciplinas de uma turma
app.get('/turmas/:turmaId/disciplinas', async (req, res) => {
    try {
        const turmaId = req.params.turmaId;
        const disciplinas = await TurmasDisciplinas.find({ turma_id: turmaId }).populate('disciplina');
        res.json(disciplinas.map(td => td.disciplina));
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar disciplinas da turma' });
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

        // Criar nova associação
        const novaAssociacao = new AlunosTurmas({
            aluno_id,
            turma_id
        });

        // Salvar a nova associação
        await novaAssociacao.save();

        res.status(201).json({ message: 'Aluno associado à turma com sucesso!', novaAssociacao });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao associar aluno à turma.' });
    }
});

//================================================================================================================//
//================================================================================================================//
app.post('/conceitos', async (req, res) => {
    try {
        const { aluno_id, disciplina_id, conceito } = req.body;
        
        // Criar novo conceito de forma mais simples
        const novoConceito = await Conceito.create({
            aluno: aluno_id,
            disciplina: disciplina_id,
            conceito: conceito
        });

        res.status(201).json({ 
            message: 'Conceito criado com sucesso!', 
            conceito: novoConceito 
        });
    } catch (error) {
        console.error('Erro ao criar conceito:', error.message);
        res.status(500).json({ 
            error: 'Erro ao criar conceito', 
            message: error.message 
        });
    }
});

// Buscar alunos e conceitos vinculados a uma disciplina
app.get('/disciplinas/:disciplinaId/alunos-conceitos', async (req, res) => {
    try {
        const disciplinaId = req.params.disciplinaId;

      // Buscar alunos da turma
        const alunosTurmas = await AlunosTurmas.find({ disciplina_id: disciplinaId }).populate('aluno');
        const conceitos = await Conceito.find({ disciplina: disciplinaId });

        // Combinar alunos com conceitos
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
// Rota para buscar a turma e disciplinas de um aluno específico
app.get('/turmas/aluno/:alunoId', checkToken, async (req, res) => {
    try {
        // Buscar a relação aluno-turma
        const alunoTurma = await AlunosTurmas.findOne({ aluno_id: req.params.alunoId })
            .populate('turma_id', 'nome ano semestres turno');

        if (!alunoTurma) {
            return res.status(404).json({ message: 'Aluno não está matriculado em nenhuma turma' });
        }

        // Buscar as disciplinas da turma
        const turmasDisciplinas = await TurmasDisciplinas.find({ turma_id: alunoTurma.turma_id._id }).populate('disciplina_id');

        // Formatar a resposta
        const response = {
            turma: alunoTurma.turma_id,
            disciplinas: turmasDisciplinas.map(td => ({
                nome: td.disciplina_id.nome,
                horario: td.disciplina_id.horario
            }))
        };

        res.json(response);
    } catch (error) {
        console.error('Erro ao buscar dados da turma do aluno:', error);
        res.status(500).json({ message: 'Erro ao buscar dados da turma' });
    }
});

//================================================================================================================//
//================================================================================================================//
// Rota para buscar professores de uma disciplina específica
app.get('/disciplinas/:disciplinaId/professores', checkToken, async (req, res) => {
    try {
        const professorDisciplinas = await ProfessorDisciplinas.find({ disciplina_id: req.params.disciplinaId })
            .populate({
                path: 'professor_id',
                select: 'name email tipodeUsuario', // Selecionando apenas os campos necessários
                match: { tipodeUsuario: 'Professor' } // Garantindo que só retorne usuários do tipo Professor
            })
            .populate('disciplina_id', 'nome');

        // Filtrando apenas os registros onde professor_id não é null (devido ao match do populate)
        const professoresValidos = professorDisciplinas
            .filter(pd => pd.professor_id !== null)
            .map(pd => ({
                professor: {
                    nome: pd.professor_id.name,
                    email: pd.professor_id.email
                },
                disciplina: pd.disciplina_id.nome
            }));

        res.json(professoresValidos);
    } catch (error) {
        console.error('Erro ao buscar professores da disciplina:', error);
        res.status(500).json({ message: 'Erro ao buscar professores da disciplina' });
    }
});

//================================================================================================================//
//================================================================================================================//
// Rota para vincular professor(es) a uma disciplina
app.post('/disciplinas/:disciplinaId/professores', checkToken, async (req, res) => {
    try {
        const { professores } = req.body;
        const disciplinaId = req.params.disciplinaId;

        // Validar disciplinaId
        if (!mongoose.Types.ObjectId.isValid(disciplinaId)) {
            return res.status(400).json({ message: 'ID da disciplina inválido' });
        }

        // Validar entrada de professores
        if (!Array.isArray(professores) || professores.length === 0) {
            return res.status(400).json({ message: 'Lista de professores é obrigatória' });
        }

        // Validar cada ID de professor
        const professorIds = professores.filter(id => mongoose.Types.ObjectId.isValid(id));
        if (professorIds.length === 0) {
            return res.status(400).json({ message: 'Nenhum ID de professor válido fornecido' });
        }

        // Verificar se a disciplina existe
        const disciplina = await Disciplinas.findById(disciplinaId);
        if (!disciplina) {
            return res.status(404).json({ message: 'Disciplina não encontrada' });
        }

        // Verificar se todos os professores existem e são do tipo Professor
        const professoresValidos = await User.find({
            _id: { $in: professorIds },
            tipodeUsuario: 'Professor'
        });

        if (professoresValidos.length === 0) {
            return res.status(404).json({ message: 'Nenhum professor válido encontrado' });
        }

        // Remover vínculos existentes
        await ProfessorDisciplinas.deleteMany({ disciplina_id: disciplinaId });

        // Criar novos vínculos apenas com professores válidos
        const vinculos = professoresValidos.map(professor => ({
            professor_id: professor._id,
            disciplina_id: disciplinaId
        }));

        const resultado = await ProfessorDisciplinas.insertMany(vinculos);

        res.status(201).json({
            message: 'Professores vinculados com sucesso',
            professoresVinculados: professoresValidos.length,
            vinculos: resultado
        });

    } catch (error) {
        console.error('Erro ao vincular professores:', error);
        res.status(500).json({ 
            message: 'Erro ao vincular professores à disciplina',
            error: error.message 
        });
    }
});

// Rota para buscar professores de uma disciplina
app.get('/disciplinas/:disciplinaId/professores', checkToken, async (req, res) => {
    try {
        const disciplinaId = req.params.disciplinaId;

        // Verificar se a disciplina existe
        const disciplina = await Disciplinas.findById(disciplinaId);
        if (!disciplina) {
            return res.status(404).json({ message: 'Disciplina não encontrada' });
        }

        // Buscar vínculos professor-disciplina
        const vinculos = await ProfessorDisciplinas.find({ disciplina_id: disciplinaId })
            .populate({
                path: 'professor_id',
                select: 'name email tipodeUsuario', // Excluir campos sensíveis como senha
                match: { tipodeUsuario: 'Professor' }
            })
            .populate('disciplina_id', 'nome');

        // Formatar resposta
        const professores = vinculos
            .filter(v => v.professor_id !== null) // Filtrar apenas professores válidos
            .map(v => ({
                professor: {
                    id: v.professor_id._id,
                    nome: v.professor_id.name,
                    email: v.professor_id.email
                },
                disciplina: v.disciplina_id.nome
            }));

        res.json(professores);

    } catch (error) {
        console.error('Erro ao buscar professores da disciplina:', error);
        res.status(500).json({ message: 'Erro ao buscar professores da disciplina' });
    }
});

// Rota para remover professor de uma disciplina
app.delete('/disciplinas/:disciplinaId/professores/:professorId', checkToken, async (req, res) => {
    try {
        const { disciplinaId, professorId } = req.params;

        // Verificar se o vínculo existe
        const vinculo = await ProfessorDisciplinas.findOne({
            disciplina_id: disciplinaId,
            professor_id: professorId
        });

        if (!vinculo) {
            return res.status(404).json({ message: 'Vínculo professor-disciplina não encontrado' });
        }

        // Remover vínculo
        await ProfessorDisciplinas.deleteOne({
            disciplina_id: disciplinaId,
            professor_id: professorId
        });

        res.json({ message: 'Professor removido da disciplina com sucesso' });

    } catch (error) {
        console.error('Erro ao remover professor da disciplina:', error);
        res.status(500).json({ message: 'Erro ao remover professor da disciplina' });
    }
});

//================================================================================================================//
//================================================================================================================//
// Rota para buscar todos os conceitos de um aluno
app.get('/alunos/:alunoId/conceitos', async (req, res) => {
    try {
        const { alunoId } = req.params;

        // Buscar todos os conceitos do aluno
        const conceitos = await Conceito.find({ aluno: alunoId })
            .populate('disciplina', 'nome'); // Popula os dados da disciplina

        // Se não encontrar conceitos, retorna array vazio
        if (!conceitos) {
            return res.json([]);
        }

        res.json(conceitos);
    } catch (error) {
        console.error('Erro ao buscar conceitos do aluno:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar conceitos',
            message: error.message 
        });
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
    console.log('Conectado ao MongoDB!')
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`)
    })
})
.catch((err) => console.log(err))

// Configurar CORS para permitir requisições de qualquer origem
app.use(cors({
    origin: '*',  // Permitir todas as origens
}));

// Buscar conceitos de um aluno
app.get('/alunos/:alunoId/conceitos', async (req, res) => {
    try {
        const alunoId = req.params.alunoId;

        // Buscar todas as disciplinas do aluno através da turma
        const alunoTurma = await AlunosTurmas.findOne({ aluno_id: alunoId })
            .populate('turma_id');

        if (!alunoTurma) {
            return res.status(404).json({ message: 'Aluno não encontrado em nenhuma turma' });
        }

        // Buscar disciplinas da turma
        const turmasDisciplinas = await TurmasDisciplinas.find({ 
            turma_id: alunoTurma.turma_id._id 
        }).populate('disciplina_id');

        // Buscar conceitos do aluno
        const conceitos = await Conceito.find({ 
            aluno: alunoId
        });

        // Combinar disciplinas com conceitos
        const disciplinasConceitos = turmasDisciplinas.map(td => {
            const conceito = conceitos.find(c => 
                c.disciplina.toString() === td.disciplina_id._id.toString()
            );
            
            return {
                disciplina: {
                    id: td.disciplina_id._id,
                    nome: td.disciplina_id.nome
                },
                conceito: conceito ? conceito.conceito : 'Não avaliado'
            };
        });

        res.json(disciplinasConceitos);

    } catch (error) {
        console.error('Erro ao buscar conceitos do aluno:', error);
        res.status(500).json({ message: 'Erro ao buscar conceitos do aluno' });
    }
});
