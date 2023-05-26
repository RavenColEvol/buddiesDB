const net = require('net');
const { handleCommand } = require('./utils');

const PORT = process.env.PORT || 7379;
const IP   = process.env.ADDRESS || 'localhost';
const ENV  = process.env.NODE_ENV;

const server = net.createServer();

server.on('connection', (socket) => {
  socket.on('data', (data) => {
    const buffer = Buffer.from(data);
    const command   = buffer.toString();
    const response  = handleCommand(command);
    socket.write(response);
  })
})

server.on('error', (err) => {
  throw err;
})

if (ENV !== 'test') {
  server.listen(PORT, IP, () => {
    console.log('buddies started on ', server.address());
  })
}

module.exports = server;