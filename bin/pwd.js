const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');

const ap = new ArgumentParser({
  prog: 'pwd',
  description: 'Shows your currect path',
});

module.exports = new Command(false, ap, 'pwd').execute((args, message, client, stdin) => message.channel.send(message.author.currentdirectory));