module.exports = {
  pointLineReader: function (endpoint, reader) {
    reader.on('message', () => {
      console.info(`Endpoint ${endpoint.name || endpoint.nome} message:`, ...arguments);
    });
    reader.on('error', () => {
      console.error(`Endpoint ${endpoint.name || endpoint.nome} error:`, ...arguments);
    });
    reader.on('disconnect', () => {
      console.error(`Endpoint ${endpoint.name || endpoint.nome} disconnected:`, ...arguments);
    });
    reader.on('close', code => {
      console.error(`Endpoint ${endpoint.name || endpoint.nome} exited with code ${code}`);
    });
    reader.on('exit', (code, signal) => {
      console.error(`Endpoint ${endpoint.name || endpoint.nome} exited with code ${code} and signal ${signal}`);
    });
  }
}