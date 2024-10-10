const mongoose = require('mongoose');

const AlunosTurmasSchema = new mongoose.Schema({
    aluno_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    turma_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turmas', 
        required: true
    }
}, {
    timestamps: true 
});


const AlunosTurmas = mongoose.model('AlunosTurmas', AlunosTurmasSchema);

module.exports = AlunosTurmas;
