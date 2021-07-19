const { cmdRegistry, Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const { basename } = require('path');

const ap = new ArgumentParser({
  prog: basename(__filename).split('.')[0],
  description: 'Show all commands',
  add_help: false
});

module.exports = new Command(false, ap).execute((args, message, client, stdin) => message.channel.send(cmdRegistry.commands.map(c => c.name).join('\n')));