const mongoose = require('mongoose')

const Classes = mongoose.model('Classes',{
    turma: String,
    nome: String,
    ano: Number,
    semestres: Number,
})

module.exports = User