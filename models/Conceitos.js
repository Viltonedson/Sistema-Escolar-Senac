const mongoose = require('mongoose');

const conceitosSchema = new mongoose.Schema({
    aluno_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuer',
        required: true
    },
    disciplina_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disciplinas',
        required: true
    },
    conceito: {
        type: String, 
        enum: ['A', 'B', 'C', 'D', 'E', 'F'], 
        required: true
    },
    data_avaliacao: {
        type: Date,
        default: Date.now
    },
    peso: {
        type: Number
    }
});

const Conceitos = mongoose.model('Conceitos', conceitosSchema);

module.exports = Conceitos;