const { cmdRegistry, Command } = require('../../utils/commandParser');
const { ArgumentParser } = require('argparse');

const ap = new ArgumentParser({
  prog: 'help',
  description: 'Show basic information concerning bot operation.',
  add_help: false,
});

module.exports = new Command(false, ap, 'help').run((args, message, client, stdin) => message.channel.send(cmdRegistry.commands.map(c => c.name).join('\n')));