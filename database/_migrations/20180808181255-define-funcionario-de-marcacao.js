'use strict';

module.exports = {
  up: (q, S) => q.addColumn('marcacoes', 'pis', { type: S.DECIMAL(11, 0), references: { model: 'funcionarios', key: 'pis' } }),
  down: q => q.removeColumn('marcacoes', 'pis')
};
