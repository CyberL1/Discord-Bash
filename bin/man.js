const { cmdRegistry, Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const { basename } = require('path');

const ap = new ArgumentParser({
  prog: basename(__filename).split('.')[0],
  description: 'Formats and displays information on a command'
});

ap.add_argument('COMMAND', {help: 'The command to look up', nargs: '*'});

module.exports = new Command(false, ap).execute((args, message, client, stdin) => {
    if (!args['COMMAND'][0]) return message.channel.send('What manual page do you want?');
    
    const command = cmdRegistry.resolve(args['COMMAND'][0]);
    
    message.channel.send(!command ? `No manual entry for ${args['COMMAND'][0]}` : `\`\`\`\n${command.args.format_help()}\`\`\``);
  });