const { cmdRegistry, Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const { basename } = require('path');
const { readFileSync } = require('fs');

const sudoers = readFileSync('sudoers.txt');

const ap = new ArgumentParser({
  prog: basename(__filename).split('.')[0],
  description: 'Execute COMMAND with full privileges',
  add_help: false
});

ap.add_argument('COMMAND', {help: 'The command to run', nargs: '?'});
ap.add_argument('ARG', {help: 'The arguments to COMMAND', nargs: '*'});

module.exports = new Command(false, ap).execute(async (args, message, client, stdin) => {
    const name = args['COMMAND'];
    
    if (!sudoers.includes(message.author.id)) return message.channel.send(`${message.author.username} is not in the sudoers file.\nThis incident will be reported.`);
    const command = cmdRegistry.resolve(name);

    if (!command) return;
    const result = command.invoke(args['ARG'], message, client, stdin, true);
    typeof result === 'string' ? [result] : result;
  });