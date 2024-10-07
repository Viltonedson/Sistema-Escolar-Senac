const mongoose = require('mongoose')


//Criando entidade(tabela)
const Disciplinas = mongoose.model('Disciplinas',{
    nome: String,
    descricao: String,
})

module.exports = Disciplinas