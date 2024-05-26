const Subject = require('../models/Subject');

exports.getSubjects = async (req, res) => {
  const subjects = await Subject.findAll();
  res.json(subjects);
};

exports.getSubjectById = async (req, res) => {
  const { id } = req.params;
  const subject = await Subject.findByPk(id);
  if (subject) {
    res.json(subject);
  } else {
    res.status(404).json({ message: 'Subject not found' });
  }
};

exports.createSubject = async (req, res) => {
  const { name, fieldId } = req.body;
  const subject = await Subject.create({ name, fieldId });
  res.status(201).json(subject);
};

exports.updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name, fieldId } = req.body;
  const subject = await Subject.findByPk(id);
  if (subject) {
    subject.name = name;
    subject.fieldId = fieldId;
    await subject.save();
    res.json(subject);
  } else {
    res.status(404).json({ message: 'Subject not found' });
  }
};

exports.deleteSubject = async (req, res) => {
  const { id } = req.params;
  const subject = await Subject.findByPk(id);
  if (subject) {
    await subject.destroy();
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Subject not found' });
  }
};
