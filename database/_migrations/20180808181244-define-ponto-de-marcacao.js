'use strict';

module.exports = {
  up: (q, S) => q.addColumn('marcacoes', 'ponto', { type: S.INTEGER, references: { model: 'pontos', key: 'id' } })
    .then(() => q.addConstraint('marcacoes', ['nsr', 'ponto'], { type: 'unique', name: 'idx_unique_nsr_ponto'})),
  down: q => q.removeConstraint('marcacoes', 'idx_unique_nsr_ponto')
    .then(() => q.removeColumn('marcacoes', 'ponto'))
};
