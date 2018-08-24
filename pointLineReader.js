// configuração
const { spawn } = require('child_process');
const moment = require('moment');
const db = require('./database/models/');
const debugFn = require('./debug');
const config = require('./config.json');

// constants
const debug = 'debug' in config && config.debug === true;
const defaultModel = 2; // "2 - PointLine BIOPROX"
const args = config.cli.args;
const h = config.cli.output;

/**
 * Reduce que converte o array em objeto usando colunas
 * @arg {array} colunas lista de cabeçalhos
 * @return {function} método de reduce
 */
const toObj = colunas => (anterior, atual, indice) => {
  // ['id', 'nsr', 'datetime', 'pis'] ==> { id: ..., nsr: ..., datetime: ..., pis: ... }
  anterior[colunas[indice]] = atual;
  return anterior
};

/**
 * isoDate - generate ISO compliant date String
 */
const isoDate = (date = null) => moment(date).format()

/* O programa PRECISA ser executado com o CWD CORRETO do diretório do Executável
   senão o PointLineReader.exe vai executar um pedido TCP -> silently crash -> die
   por motivos de: Pascal/Delphi é um negócio velho, só deixe o CWD configurado que
   tá tudo certo. */
const execOpts = {
  cwd: config.cli.cwd,
  windowsHide: true
};

// caminho para o executável
const path = config.cli.path;

// só pra fazer um filter ficar mais legível
const emptyIDsOut = v => v.id.length > 1 || Number(v.nsr) === 0;

const createReaders = () => db.Marcacao
  .findAll({
    attributes: [
      'id',
      [
        db.sequelize.fn('max', db.sequelize.col('nsr')),
        'lastNSR'
      ],
      'ponto'
    ],
    group: 'ponto',
    include: [{
      as: 'Ponto',
      model: db.Ponto,
      where: { id: db.sequelize.col('ponto') }
    }]
  })
  .map(function (res) {
    config.debug ? console.log('rel', res.Ponto.nome, 'last:', res.dataValues.lastNSR) : null;
    return {
      id: res.Ponto.id,
      model: res.dataValues.model || defaultModel,
      nome: res.Ponto.nome,
      ip: res.Ponto.ip,
      offset: res.dataValues.lastNSR
    }
  })
  .map(function (relogio) {
    const endpoint = Object.keys(config.endpoints)
      .filter(k => config.endpoints[k].id === relogio.id)
      .reduce((p, a) => a, {});
    return pointLineReader(Object.assign(endpoint, relogio));
  })
  .catch(function (err) {
    debug ? console.error('Rolou um erro ae:', err) : null;
  });

const pointLineReader = function (endpoint) {
  const execArgs = [
    args.model, // "-m"
    endpoint.model, // "2 - PointLine BIOPROX"
    args.ip, // "-i" string
    endpoint.ip, // "000.000.000.000" string
    args.offset, // "-u" string
    endpoint.offset // 000000000 number
  ];
  const reader = spawn(path, execArgs, execOpts);
  reader.stderr.on('data', err => {
    if (debug) {
      const nome = endpoint.name || endpoint.nome;
      console.error(`Err@${nome}-${isoDate()}\r\nstderr:`, err);
    }
  });
  if (debug) { // if we are debugging:
    debugFn.pointLineReader(endpoint, reader);
  }
  reader.stdout.on('data', data => {
    if ((`${data}`).trim().length < 1) return null;
    const lines = (`${data}`).split('\n');
    // arruma o csv em um array de objetos, removendo linhas em branco
    const list = lines
      .map(line => {
        return line.trim()
          .split(',') // quebra em , por ser CSV
          .reduce(toObj(h), {});
      })
      .filter(emptyIDsOut);
    // formata os dados de cada objeto para seus respectivos tipos corretos
    const table = list.map(marcacao => ({ // remove o id e
      ponto: endpoint.id,
      nsr: Number(marcacao.nsr), // unico
      datetime: moment(marcacao.datetime).format(),
      pis: marcacao.pis // relacionamento com funcionarios
    }));
    // TODO: Inserir cada objeto de table no banco 
    return table
      .map((marcacao, idx) => db.Funcionario
        .findCreateFind({
          where: { pis: marcacao.pis },
          defaults: { pis: marcacao.pis, createdAt: isoDate() }
        })
        .then(funcionario => db.Marcacao.findOrCreate({
          where: { nsr: marcacao.nsr, ponto: endpoint.id },
          defaults: marcacao
        }))
        .then(function () {
          return true;
        })
        .catch(function (err) {
          debug ? console.error('Deu ruim:', err) : null;
          return false;
        })
      )
  });
  return reader;
};

module.exports = {
  pointLineReader,
  createReaders
}