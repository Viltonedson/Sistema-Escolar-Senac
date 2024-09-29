
const mongoose = require('mongoose')

const Professores_Disciplinas = mongoose.model('Professores_Disciplinas',{
    professor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professos_Discplinas',
        required: true
    },
    disciplina_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disciplinas',
        required: true
    }
})

module.exports = Professores_Disciplinas