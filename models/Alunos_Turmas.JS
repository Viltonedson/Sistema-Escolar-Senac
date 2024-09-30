const mongoose = require('mongoose');

const alunosTurmasSchema = new mongoose.Schema({
    aluno_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    turma_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turmas_Disciplinas',
        required: true
    },
    turno: String,
    email: String
    

});


module.exports = AlunosTurmas