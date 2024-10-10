const mongoose = require('mongoose');

const conceitoSchema = new mongoose.Schema({
    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    disciplina: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disciplina',
        required: true
    },
    conceito: {
        type: String,
        required: true,
        enum: ['Ruim', 'Regular', 'Bom', 'Ótimo', 'Excelente']
    }
});

module.exports = mongoose.model('Conceito', conceitoSchema);
