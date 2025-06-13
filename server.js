const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();
if (!process.env.MONGODB_URI) {
  console.error('Erreur : MONGODB_URI non défini dans .env');
  process.exit(1);
}

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

const errorHandler = (error) => {
  if (error.syscall !== 'listen') throw error;
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES': console.error(bind + ' requires elevated privileges.'); process.exit(1); break;
    case 'EADDRINUSE': console.error(bind + ' is already in use.'); process.exit(1); break;
    default: throw error;
  }
};

const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => console.log('Listening on port ' + port));
server.listen(port);