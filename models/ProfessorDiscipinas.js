
const mongoose = require('mongoose')

const ProfessorDisciplinasSchema = new mongoose.Schema({
    professor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Aqui é o modelo User, que você já definiu
        required: true
    },
    disciplina_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disciplina', // Aqui é o modelo Disciplina, que você já definiu
        required: true
    }
});

const ProfessorDisciplinas = mongoose.model('ProfessorDisciplinas', ProfessorDisciplinasSchema);

module.exports = ProfessorDisciplinas;