const mongoose = require('mongoose')



const Disciplinas = mongoose.model('Disciplinas',{
    nome: String,
    descricao: String,
})

module.exports = Disciplinas