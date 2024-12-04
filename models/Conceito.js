const mongoose = require('mongoose');

const conceitoSchema = new mongoose.Schema({
    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    disciplina: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disciplinas',
        required: true
    },
    conceito: {
        type: String,
        required: true,
        enum: ['Desenvolvido', 'Em Desenvolvimento', 'Não Desenvolvido']
    }
});

module.exports = mongoose.model('Conceito', conceitoSchema);
