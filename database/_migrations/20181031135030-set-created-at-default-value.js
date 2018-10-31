'use strict';

const table = 'funcionarios'
const col = 'createdAt'
const attr = (S, defaultValue) => ({ allowNull: false, type: S.DATE, defaultValue })

module.exports = {
  up: (q, S) => q.changeColumn(table, col, attr(S, q.sequelize.fn('now'))),
  down: q => q.changeColumn(table, col, attr(S, null))
};
