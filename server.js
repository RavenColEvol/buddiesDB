const net = require('net');

const PORT = process.env.PORT || 7379;
const IP   = process.env.ADDRESS || '0.0.0.0';


const server = net.createServer();

server.on('connection', (socket) => {
  console.log('client connected');

  socket.on('data', (data) => {
    const buffer = Buffer.from(data);
    const text   = buffer.toString();
    console.log('data', text);
  })

  socket.on('close', () => {
    console.log('client disconnected');
  })
})

server.on('error', (err) => {
  throw err;
})

server.on('close', () => {
  console.log('server is closing');
})

server.listen(PORT, IP, () => {
  console.log('buddies started on ', server.address());
})