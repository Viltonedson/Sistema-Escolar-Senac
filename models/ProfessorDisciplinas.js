const mongoose = require('mongoose');

const professorDisciplinasSchema = new mongoose.Schema({
    professor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    disciplina_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disciplinas',
        required: true
    }
});

module.exports = mongoose.model('ProfessorDisciplinas', professorDisciplinasSchema);