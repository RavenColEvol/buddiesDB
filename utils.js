const DB = {};

const handleCommand = (command) => {
  command = command.split('\r\n');
  command = command.filter(removeStringLength);
  command.shift(); //REMOVE ARRAY INDICATOR AT FRONT
  command.pop(); // REMOVE EXTRA SPACE AFTER SPLIT

  let curr = 0;
  let res  = '';

  while(curr !== command.length) {
    const top = command[curr];
    switch(top) {
      case 'PING': {
        res += '+PONG\r\n'
        break;
      }
      case 'SET': {
        res += '+OK\r\n'
        const [key, value] = [command[++curr], command[++curr]];
        DB[key] = value;
        break;
      }
      case 'GET': {
        const [key] = [command[++curr]];

        if (!DB.hasOwnProperty(key)) {
          res += '+(nil)\r\n';
          break;
        }

        const value = DB[key];
        res += `$${value.length}\r\n${value}\r\n`
        break;
      }
      case 'DEL': {
        const [key] = [command[++curr]];

        res += `+(integer) ${Number(DB.hasOwnProperty(key))}\r\n`;
        delete DB[key];
        break;
      }
      default: {
        return '-Unkown Command\r\n'
      }
    }
    curr++;
  }

  return res;
}

function removeStringLength(command) {
  return !/^\$\d+$/.test(command)
}

module.exports = {
  handleCommand
}