const { Command } = require('../../utils/commandParser');
const { ArgumentParser } = require('argparse');

const ap = new ArgumentParser({
  prog: 'logout',
  description: 'logout from system',
});

module.exports = new Command(false, ap, 'logout', 'exit').execute((args, message, client, stdin) => message.author.collector.stop());