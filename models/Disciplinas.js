import mongoose from 'mongoose';

const disciplinasSchema = new mongoose.Schema({
    nome: String,
    descricao: String,
});

const Disciplinas = mongoose.model('Disciplinas', disciplinasSchema);
export default Disciplinas;