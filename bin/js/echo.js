const { Command } = require('../../utils/commandParser');
const { ArgumentParser } = require('argparse');

const ap = new ArgumentParser({
  prog: 'echo',
  description: 'Echo the STRING(s) to standard output.',
});

ap.add_argument('STRING', {help: 'The strings to be printed.', nargs: '*'});

module.exports = new Command(false, ap, 'echo').run((args, message, client, stdin) => message.channel.send(args['STRING'][0] ? args['STRING'].join(' ') : '\u200b'));