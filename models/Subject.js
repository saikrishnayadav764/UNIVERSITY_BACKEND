const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Field = require('./Field');

const Subject = sequelize.define('Subject', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fieldId: {
    type: DataTypes.INTEGER,
    references: {
      model: Field,
      key: 'id',
    },
  },
});

Subject.belongsTo(Field, { as: 'field' });

module.exports = Subject;
