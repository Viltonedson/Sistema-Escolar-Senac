const mongoose = require('mongoose');

const turmasDisciplinasSchema = new mongoose.Schema({
    turma_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turmas',
        required: true
    },
    disciplina_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disciplinas',
        required: true
    }
});

module.exports = mongoose.model('TurmasDisciplinas', turmasDisciplinasSchema);
