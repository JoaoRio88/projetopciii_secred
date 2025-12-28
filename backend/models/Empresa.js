const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  nif: { type: String, required: true, unique: true },
  capitalSocial: { type: Number },
  morada: { type: String },
  localidade: { type: String },
  codPostal: { type: String },
  email: { type: String },
  telefone: { type: String },
  fotoUrl: { type: String },

  // NOVO: Status da Empresa
  statusOperacional: { 
    type: String, 
    enum: ['Ativa', 'Sob Investigação', 'Suspensa', 'Encerrada Compulsivamente'],
    default: 'Ativa'
  },

  // NOVO: Crimes Associados à Organização
  crimes: [{ type: String }],

  veiculos: [{
    matricula: String,
    marca: String,
    modelo: String
  }],

  contasBancarias: [{
    banco: String,
    iban: String
  }],

  dataRegisto: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Empresa', EmpresaSchema);