const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Field = sequelize.define('Field', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Field;
