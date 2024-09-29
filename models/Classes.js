const mongoose = require('mongoose')

const Classes = mongoose.model('Classes',{
    turma: String,
    nome: String
    ano: Number
    semestre: number
})

module.exports = User