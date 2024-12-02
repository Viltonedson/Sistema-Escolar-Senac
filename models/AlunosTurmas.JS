import mongoose from 'mongoose';

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

export default mongoose.model('AlunosTurmas', AlunosTurmasSchema);
