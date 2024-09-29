const mongoose = require('mongoose')


//Criando entidade(tabela)
const User = mongoose.model('User',{
    name: String,
    email: String,
    password: String,
    numerotelefone: String,
    datanascimento: Date,
    cpf: String,
    tipodeUsuario: {
        type: String,
        required: true,
        enum: ['Aluno', 'Professor', 'Coordenador'],},
})

module.exports = User