const mongoose = require('mongoose');

const alunosTurmasSchema = new mongoose.Schema({
    aluno_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    turma_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turmas',
        required: true
    },

});


module.exports = AlunosTurmas