const mongoose = require('mongoose');

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

module.exports = mongoose.model('Turmas', turmasSchema);