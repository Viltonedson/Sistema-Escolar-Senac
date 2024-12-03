import mongoose from 'mongoose';

const comunicadosSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    conteudo: { type: String, required: true },
    autor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    data_criacao: { type: Date, default: Date.now },
    destinatarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios' }], 
    status: { type: String, enum: ['ativo', 'arquivado', 'deletado'], default: 'ativo' }
});

const Comunicado = mongoose.model('Comunicados', comunicadosSchema);

export default Comunicado;