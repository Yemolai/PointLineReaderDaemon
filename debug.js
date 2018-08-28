const config = require('./config.json');
const debug = 'debug' in config && config.debug === true;

const getNow = () => (new Date((new Date()).toUTCString()));
const isBool = variable => typeof variable === 'boolean'
const force = (flag, fn) => (...args) => flag || args[0] === true ? fn.call(...args.slice(isBool(args[0]))) : null;
module.exports = {
  dump: function (name, variable, max = 5) {
    if (!debug) { return false }
    if (variable instanceof Array) {
      this.log(name, typeof variable, variable.length, variable.slice(0, 5));
    } else if (typeof variable === 'object') {
      this.log(name, typeof variable, Object.keys(variable), variable);
    } else {
      this.log(name, typeof variable, variable);
    }
  },
  now: getNow,
  log: force(debug, (...args) => console.log(getNow(), ...args)),
  err: force(debug, (...args) => console.error(getNow(), ...args)),
  pointLineReader: function (endpoint, reader) {
    if (!debug) { return false; }
    const name = endpoint.name || endpoint.nome;
    const d = this;
    reader.on('message', (...args) => this.log(`Endpoint ${name} message:`, ...args));
    reader.on('error', (...args) => this.err(`Endpoint ${name} error:`, ...args));
    reader.on('disconnect', (...args) => this.err(`Endpoint ${name} disconnected:`, ...args));
    reader.on('close', (...args) => this.err(getNow(), `Endpoint ${name} exited with code ${args[0]}`, ...args.slice(1)));
    reader.on('exit', (...args) => {
      console.error(getNow(), `Endpoint ${name} exited with code ${args[0]} and signal ${args[1]}`, ...args.slice(2));
    });
  }
}