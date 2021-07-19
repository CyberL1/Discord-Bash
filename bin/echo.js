const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const { basename } = require('path');

const ap = new ArgumentParser({
  prog: basename(__filename).split('.')[0],
  description: 'Echo the STRING(s) to standard output'
});

ap.add_argument('STRING', {help: 'The strings to be printed.', nargs: '*'});

module.exports = new Command(false, ap).execute((args, message, client, stdin) => message.channel.send(args['STRING'][0] ? args['STRING'].join(' ') : '\u200b'));