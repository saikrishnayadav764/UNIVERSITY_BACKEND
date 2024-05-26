const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Field = require('./Field');


const Student = sequelize.define('Student', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  enrollmentYear: {
    type: DataTypes.INTEGER,
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

Student.belongsTo(Field, { as: 'field' });



module.exports = Student;
