'use strict';
// libraries, functions and utilities
const moment = require('moment');
const config = require('./config.json');
const { createReaders } = require('./pointLineReader');
const log = (...args) => console.log(moment().format(), ...args);

log('daemon iniciado.');
config.debug ? log('config:', config) : null;

let readers = [];
let timer = null;
const intervalo = (config.interval || 60) * 1000;

const ciclo = () => {
  readers.map(r => r.kill());
  config.debug ? log('reading...') : null;
  readers = createReaders();
  clearTimeout(timer);
  timer = setTimeout(ciclo, intervalo);
};

timer = ciclo();