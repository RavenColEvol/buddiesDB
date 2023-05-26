const server = require('./server');
const net = require('net');


let client;
const MAX_RESPONSE_TIME = 1000;

describe('Buddies DB', () => {
  beforeEach(async () => {
    const PORT = 7379;
    await new Promise((res) => {
      server.listen(PORT, () => {
        client = net.connect({ port: PORT })
        res(undefined);
      })
    })
  })

  it('should reply to PING', async () => {
    const res = await sendMessage('*1\r\n$4\r\nPING\r\n');
    expect(res).toBe('+PONG\r\n');
  })

  it('should able to SET value', async () => {
    const res = await sendMessage('*3\r\n$3\r\nSET\r\n$4\r\nkey\r\n$7\r\nvalue\r\n');
    expect(res).toBe('+OK\r\n');
  })

  it('should able to GET value', async () => {
    await sendMessage('*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n');
    const res = await sendMessage('*2\r\n$3\r\nGET\r\n$3\r\nkey\r\n');
    expect(res).toBe('$5\r\nvalue\r\n');
    const nilRes = await sendMessage('*2\r\n$3\r\nGET\r\n$6\r\nunkown\r\n');
    expect(nilRes).toBe('+(nil)\r\n');
  })

  it('should able to DEL key', async () => {
    await sendMessage('*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n');
    const res = await sendMessage('*3\r\n$3\r\nDEL\r\n$3\r\nkey\r\n');
    expect(res).toBe('+(integer) 1\r\n');
    const zeroDel = await sendMessage('*3\r\n$3\r\nDEL\r\n$3\r\nkey\r\n');
    expect(zeroDel).toBe('+(integer) 0\r\n');
    const nilRes = await sendMessage('*2\r\n$3\r\nGET\r\n$6\r\nkey\r\n');
    expect(nilRes).toBe('+(nil)\r\n');
  })

  afterEach(() => {
    server.close();
    client.end();
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
      resolve(response);
    })
  })
}