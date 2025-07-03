const ownCommerceModel = require('../models/ownCommerceModel');

exports.getOwnCommerce = (req, res) => {
  ownCommerceModel.getOwnCommerce((err, row) => {
    if (err) return res.status(500).json({ message: 'Error al obtener los datos del comercio' });
    res.json(row || {});
  });
};

exports.upsertOwnCommerce = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Solo administradores pueden editar los datos del comercio' });
  }
  const { name, rif, location, description } = req.body;
  if (!name || !rif || !location) {
    return res.status(400).json({ message: 'Nombre, RIF y Ubicación son obligatorios' });
  }
  ownCommerceModel.upsertOwnCommerce({ name, rif, location, description }, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al guardar los datos del comercio' });
    res.json({ success: true });
  });
}; 