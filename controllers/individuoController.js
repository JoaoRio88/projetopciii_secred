const Individuo = require('../models/Individuo');

// Obter Todos
exports.getIndividuos = async (req, res) => {
  try {
    const individuos = await Individuo.find();
    res.json(individuos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PESQUISA (LIVE: por nome ou nif)
exports.searchIndividuos = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();

    // evita spam de requests a cada tecla
    if (q.length < 2) return res.json([]);

    const isNif = /^[0-9]+$/.test(q);

    const filtro = isNif
      ? { nif: new RegExp(q, 'i') }
      : { nome: new RegExp(q, 'i') };

    const lista = await Individuo.find(filtro)
      .select('nome nif') // só o essencial
      .limit(10);

    res.json(lista);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obter Um
exports.getIndividuoById = async (req, res) => {
  try {
    const individuo = await Individuo.findById(req.params.id);
    if (!individuo) return res.status(404).json({ message: 'Individuo não encontrado' });
    res.json(individuo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CRIAR
exports.createIndividuo = async (req, res) => {
  try {
    // 1. Converter strings JSON que vêm do Frontend para Arrays reais
    let veiculos = [];
    let contas = [];
    let crimes = [];

    if (req.body.veiculos) veiculos = JSON.parse(req.body.veiculos);
    if (req.body.contasBancarias) contas = JSON.parse(req.body.contasBancarias);
    if (req.body.crimes) crimes = JSON.parse(req.body.crimes);

    // 2. Processar a Foto (se existir upload)
    let fotoUrl = '';
    if (req.file) {
      // Cria o link: http://localhost:5000/uploads/nomeficheiro.jpg
      fotoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (req.body.fotoUrl) {
      fotoUrl = req.body.fotoUrl; // Caso venha um link manual
    }

    const individuo = new Individuo({
      ...req.body, // Nome, NIF, Morada, Status, etc.
      veiculos: veiculos,
      contasBancarias: contas,
      crimes: crimes,
      fotoUrl: fotoUrl
    });

    const novoIndividuo = await individuo.save();
    res.status(201).json(novoIndividuo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ATUALIZAR
exports.updateIndividuo = async (req, res) => {
  try {
    const dados = { ...req.body };

    // Converter Arrays
    if (dados.veiculos) dados.veiculos = JSON.parse(dados.veiculos);
    if (dados.contasBancarias) dados.contasBancarias = JSON.parse(dados.contasBancarias);
    if (dados.crimes) dados.crimes = JSON.parse(dados.crimes);

    // Atualizar Foto (apenas se vier um novo ficheiro)
    if (req.file) {
      dados.fotoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Atualizar Data de Modificação (para o Dashboard detetar atividade)
    dados.dataAtualizacao = Date.now();

    const updatedIndividuo = await Individuo.findByIdAndUpdate(req.params.id, dados, { new: true });
    res.json(updatedIndividuo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// APAGAR
exports.deleteIndividuo = async (req, res) => {
  try {
    await Individuo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Individuo apagado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
