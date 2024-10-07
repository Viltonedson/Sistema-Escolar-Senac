const mongoose = require('mongoose')

const Turmas = mongoose.model('Turmas',{
    nome: String,
    ano: String,
    semestres: Number,
    turno: {
        type: String,
        required: true,
        enum: ['Manhã', 'Tarde', 'Noite'],},
    }  
)

module.exports = Turmas