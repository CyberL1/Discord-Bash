const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const { basename } = require('path');

const ap = new ArgumentParser({
  prog: basename(__filename).split('.')[0],
  description: 'Shows your currect path'
});

module.exports = new Command(false, ap).execute((args, message, client, stdin) => message.channel.send(message.author.currentdirectory));