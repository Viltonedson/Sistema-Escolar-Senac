const mongoose = require('mongoose');

const comunicadoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    autor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destinatarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    data: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comunicado', comunicadoSchema);