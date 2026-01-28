const mongoose = require('mongoose');

const AcessoRequestSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  telefone: { type: String },
  cargo: { type: String },
  justificacao: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pendente', 'aprovado', 'rejeitado'], 
    default: 'pendente' 
  },
  roleAtribuido: {
    type: String,
    enum: ['admin', 'secretariado', 'patrulha']
  },
  dataSubmissao: { type: Date, default: Date.now },
  dataResposta: { type: Date },
  adminResponsavel: { type: String }
});


module.exports = mongoose.model('AcessoRequest', AcessoRequestSchema);