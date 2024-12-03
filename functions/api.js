import express from 'express';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Importar modelos
import User from '../models/User.js';
import Turmas from '../models/Turmas.js';
import Disciplinas from '../models/Disciplinas.js';
import Comunicados from '../models/Comunicados.js';
import ProfessorDisciplinas from '../models/ProfessorDisciplinas.js';
import TurmasDisciplinas from '../models/TurmasDisciplinas.js';
import AlunosTurmas from '../models/AlunosTurmas.js';
import Conceito from '../models/Conceito.js';

// Suas rotas aqui (copie todas as rotas do app.js)
// ...

// Exportar o handler para Netlify Functions
export const handler = serverless(app);
