'use strict';
module.exports = {
  up: (q, S) => q
    .createTable('pontos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: S.INTEGER
      },
      nome: {
        type: S.STRING(190),
        allowNull: false,
        unique: true
      },
      ip: {
        type: S.STRING(15),
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: S.DATE
      },
      updatedAt: {
        allowNull: false,
        type: S.DATE
      }
  }),
  down: q => q.dropTable('pontos')
};