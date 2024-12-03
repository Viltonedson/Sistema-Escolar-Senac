import mongoose from 'mongoose';

const turmasSchema = new mongoose.Schema({
    nome: String,
    ano: String,
    semestres: Number,
    turno: {
        type: String,
        required: true,
        enum: ['Manhã', 'Tarde', 'Noite']
    }
});

const Turmas = mongoose.model('Turmas', turmasSchema);

export default Turmas;