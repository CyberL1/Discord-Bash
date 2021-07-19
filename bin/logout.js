const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const { basename } = require('path');

const ap = new ArgumentParser({
  prog: basename(__filename).split('.')[0],
  description: 'Logout from system'
});

module.exports = new Command(false, ap, 'exit').execute((args, message, client, stdin) => {
  message.author.collector.stop();
  message.channel.send('Logged out');
});