const mongoose = require('mongoose');

const turmasDisciplinasSchema = new mongoose.Schema({
    turma_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes',
        required: true
    },
    disciplina_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disciplinas',
        required: true
    }
});

const TurmasDisciplinas = mongoose.model('TurmasDisciplinas', turmasDisciplinasSchema);

module.exports = TurmasDisciplinas


