import mongoose from 'mongoose';

const turmasDisciplinas = new mongoose.Schema({
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

const TurmasDisciplinas = mongoose.model('TurmasDisciplinas', turmasDisciplinas);

export default TurmasDisciplinas;
