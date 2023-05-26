const server = require('./server');
const net = require('net');


let client;
const MAX_RESPONSE_TIME = 1000;

describe('Buddies DB', () => {
  beforeAll(async () => {
    const PORT = 7379;
    await new Promise((res) => {
      server.listen(PORT, () => {
        client = net.connect({ port: PORT })
        res(undefined);
      })
    })
  })

  it('should reply to PING', async () => {
    const res = await sendMessage('+PING\r\n');
    expect(res).toBe('+PONG\r\n');
  })

  afterAll(() => {
    server.close();
  })
})


const sendMessage = async (message) => {
  client.write(message);
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => reject('No response received'), MAX_RESPONSE_TIME)
    client.on('data', (data) => {
      const buffer = Buffer.from(data);
      const response = buffer.toString();
      clearInterval(timer);
      client.end();
      resolve(response);
    })
  })
}