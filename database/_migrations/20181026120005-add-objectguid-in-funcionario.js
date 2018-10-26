'use strict';

const table = 'funcionarios';
const col = 'objectguid';
const idx = 'idx_unique_user_objectguid';

module.exports = {
  up: (q, S) => q.addColumn(table, col, { type: S.String })
    .then(() => q.addConstraint(table, col, { type: 'unique', name: idx })),
  down: (q, S) => q.removeConstraint(table, idx)
    .then(() => q.removeColumn(table, col))
}
