'use strict';
module.exports = (sequelize, DataTypes) => {
  const Funcionario = sequelize.define('Funcionario', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nome: DataTypes.STRING,
    matricula: DataTypes.DECIMAL(11,0),
    pis: DataTypes.DECIMAL(11,0)
  }, {
    freezeTableName: true,
    tableName: 'funcionarios'
  });
  Funcionario.associate = function(models) {
    // associations can be defined here
  };
  return Funcionario;
};