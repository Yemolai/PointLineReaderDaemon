'use strict';
module.exports = (sequelize, DataTypes) => {
  var Marcacao = sequelize.define('Marcacao', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nsr: DataTypes.DECIMAL(9,0),
    datetime: DataTypes.DATE
  }, {
    freezeTableName: true,
    tableName: 'marcacoes'
  });
  Marcacao.associate = function(modelo) {
    modelo.Marcacao.belongsTo(modelo.Ponto, { foreignKey: 'ponto', targetKey: 'id' })
    modelo.Marcacao.belongsTo(modelo.Funcionario, { foreignKey: 'pis', targetKey: 'pis' })
  };
  return Marcacao;
};