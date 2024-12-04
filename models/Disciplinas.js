const mongoose = require('mongoose');

const disciplinasSchema = new mongoose.Schema({
    nome: String,
    descricao: String,
});

module.exports = mongoose.model('Disciplinas', disciplinasSchema);