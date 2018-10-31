'use strict';

const table = 'funcionarios';
const col = ['samaccountname', 'userprincipalname', 'username', 'dn'];
const idx = (table, column) => `idx_${table}_unique_${column}`;

module.exports = {
  up: (q, S) => col.map(c => q.addColumn(table, c, { type: S.STRING })
    .then(() => q.addConstraint(table, c, { type: 'unique', name: idx(table, c) }))),
  down: q => col.map(c => q.removeConstraint(table, idx(table, c))
    .then(() => q.removeColumn(table, c)))
}
