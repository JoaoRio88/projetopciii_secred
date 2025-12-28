const mongoose = require('mongoose');

const IndividuoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  nif: { type: String, required: true, unique: true },
  dataNascimento: { type: Date },
  nacionalidade: { type: String },
  profissao: { type: String },
  
  // ALTERADO: Em vez de Estado Civil, temos Status Policial
  statusOperacional: { 
    type: String, 
    enum: ['Livre', 'Sob Vigilância', 'Procurado', 'Detido', 'Desaparecido', 'Óbito'],
    default: 'Livre'
  },

  morada: { type: String },
  telefone: { type: String },
  fotoUrl: { type: String },

  // NOVO: Lista de Crimes
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

module.exports = mongoose.model('Individuo', IndividuoSchema);