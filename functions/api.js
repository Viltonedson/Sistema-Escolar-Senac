import express from 'express';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/user.js';
import Comunicado from '../models/Comunicado.js';
import AlunosTurmas from '../models/AlunosTurmas.js';

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API Sistema Escolar Senac funcionando!' });
});

// Rota de login
app.post('/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (senha !== user.senha) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'sua_chave_secreta',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                tipo: user.tipo
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Handler para Netlify Functions
export const handler = serverless(app);
