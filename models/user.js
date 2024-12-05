const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    tipodeUsuario: {
        type: String,
        required: true,
        enum: ['Aluno', 'Professor', 'Coordenador'],
    },
});

module.exports = mongoose.model('User', UserSchema);