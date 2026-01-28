const Empresa = require('../models/Empresa');

exports.getEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.json(empresas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEmpresaById = async (req, res) => {
  try {
    const empresa = await Empresa
      .findById(req.params.id)
      .populate('sociosGerentes.individuo', 'nome nif dataNascimento morada telefone')

    if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
    res.json(empresa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEmpresa = async (req, res) => {
  try {
    let veiculos = [];
    let contas = [];
    let crimes = [];
    let sociosGerentes = [];

    if (req.body.veiculos) veiculos = JSON.parse(req.body.veiculos);
    if (req.body.contasBancarias) contas = JSON.parse(req.body.contasBancarias);
    if (req.body.crimes) crimes = JSON.parse(req.body.crimes);
    if (req.body.sociosGerentes) sociosGerentes = JSON.parse(req.body.sociosGerentes);

    let fotoUrl = '';
    if (req.file) {
      fotoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (req.body.fotoUrl) {
      fotoUrl = req.body.fotoUrl;
    }

    const empresa = new Empresa({
      ...req.body,
      veiculos: veiculos,
      contasBancarias: contas,
      crimes: crimes,
      sociosGerentes: sociosGerentes,
      fotoUrl: fotoUrl
    });

    const novaEmpresa = await empresa.save();
    res.status(201).json(novaEmpresa);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateEmpresa = async (req, res) => {
  try {
    const dados = { ...req.body };

    if (dados.veiculos) dados.veiculos = JSON.parse(dados.veiculos);
    if (dados.contasBancarias) dados.contasBancarias = JSON.parse(dados.contasBancarias);
    if (dados.crimes) dados.crimes = JSON.parse(dados.crimes);
    if (dados.sociosGerentes) dados.sociosGerentes = JSON.parse(dados.sociosGerentes);

    if (req.file) {
      dados.fotoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Atualizar Data de Modificação
    dados.dataAtualizacao = Date.now();

    const updatedEmpresa = await Empresa.findByIdAndUpdate(req.params.id, dados, { new: true });
    res.json(updatedEmpresa);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEmpresa = async (req, res) => {
  try {
    await Empresa.findByIdAndDelete(req.params.id);
    res.json({ message: 'Empresa apagada com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
