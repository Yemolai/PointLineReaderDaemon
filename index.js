'use strict';
// libraries, functions and utilities
const moment = require('moment');
const debug = require('./debug');
const config = require('./config.json');
const { createReaders } = require('./pointLineReader');

debug.log(true, true, 'daemon iniciado.');
config.debug ? log('config:', config) : null;

let readers = [];
let timer = null;
const intervalo = (config.interval || 60) * 1000;
const offline = {
  isOffline: false,
  get () {
    return this.isOffline;
  },
  set (value) {
    return this.isOffline = (value === true);
  }
}

const ciclo = (offline) => {
  if (readers !== null) readers.map(r => r.kill());
  config.debug ? log('reading...') : null;
  readers = createReaders(offline);
  clearTimeout(timer);
  timer = setTimeout(ciclo, intervalo, offline);
};

timer = ciclo(offline);