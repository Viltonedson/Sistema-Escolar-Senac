import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    senha: String,
    rm: String,
    tipo: {
        type: String,
        required: true,
        enum: ['Aluno', 'Professor', 'Coordenador'],
    },
});

const User = mongoose.model('User', UserSchema);
export default User;