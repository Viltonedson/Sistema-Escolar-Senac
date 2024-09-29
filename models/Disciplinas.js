const mongoose = require('mongoose')


//Criando entidade(tabela)
const Disciplinas = mongoose.model('Disciplinas',{
    dsciplina: String,
    nome: String,
    password: String,
    descricao: String,

})

module.exports = Disciplinas