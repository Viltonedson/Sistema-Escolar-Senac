
const mongoose = require('mongoose')

const ProfessorDisciplinasSchema = new mongoose.Schema({
    professor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    disciplina_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disciplina',
        required: true
    }
});

const ProfessorDisciplinas = mongoose.model('ProfessorDisciplinas', ProfessorDisciplinasSchema);

module.exports = ProfessorDisciplinas;