'use strict';
module.exports = (sequelize, DataTypes) => {
  var Ponto = sequelize.define('Ponto', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nome: DataTypes.STRING,
    ip: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'pontos'
  });
  Ponto.associate = function(models) {
    // associations can be defined here
  };
  return Ponto;
};