import mongoose from 'mongoose';

const ProfessorDisciplinasSchema = new mongoose.Schema({
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

const ProfessorDisciplinas = mongoose.model('ProfessorDisciplinas', ProfessorDisciplinasSchema);

export default ProfessorDisciplinas;