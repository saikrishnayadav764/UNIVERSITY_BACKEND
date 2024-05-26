const Field = require('../models/Field');

exports.getFields = async (req, res) => {
  const fields = await Field.findAll();
  res.json(fields);
};

exports.getFieldById = async (req, res) => {
  const { id } = req.params;
  const field = await Field.findByPk(id);
  if (field) {
    res.json(field);
  } else {
    res.status(404).json({ message: 'Field not found' });
  }
};

exports.createField = async (req, res) => {
  const { name } = req.body;
  const field = await Field.create({ name });
  res.status(201).json(field);
};

exports.updateField = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const field = await Field.findByPk(id);
  if (field) {
    field.name = name;
    await field.save();
    res.json(field);
  } else {
    res.status(404).json({ message: 'Field not found' });
  }
};

exports.deleteField = async (req, res) => {
  const { id } = req.params;
  const field = await Field.findByPk(id);
  if (field) {
    await field.destroy();
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Field not found' });
  }
};
