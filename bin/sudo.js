const { cmdRegistry, Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const fs = require('fs');

const sudoers = fs.readFileSync('sudoers.txt');

const ap = new ArgumentParser({
  prog: 'sudo',
  description: 'Execute COMMAND with full privileges.',
  add_help: false,
});

ap.add_argument('COMMAND', {help: 'The command to run.', nargs: '?'});
ap.add_argument('ARG', {help: 'The arguments to COMMAND.', nargs: '*'});

module.exports = new Command(false, ap, 'sudo').execute(async (args, msg, bot, stdin) => {
    const name = args['COMMAND'];
    
    if (!sudoers.includes(msg.author.id)) return msg.channel.send(`${msg.author.username} is not in the sudoers file.\nThis incident will be reported.`);
    const command = cmdRegistry.resolve(name);

    if (!command) return;
    const result = command.invoke(args['ARG'], msg, bot, stdin, true);
    typeof result === 'string' ? [result] : result;
  });