const { Command, cmdRegistry } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const { basename } = require('path');

const ap = new ArgumentParser({
  prog: basename(__filename).split('.')[0],
  description: 'Reload a command'
});

ap.add_argument('COMMAND', { help: 'The command to reload', nargs: '*' });

module.exports = new Command(true, ap).execute(async (args, message, client, stdin) => {  
  if (!args['COMMAND'][0]) return message.channel.send('You must provide a command');

  const command = cmdRegistry.commands.get(args['COMMAND'][0]) || cmdRegistry.commands.get(cmdRegistry.aliases.get(args['COMMAND'][0]));

  let result = await cmdRegistry.unregister(args['COMMAND'][0]);
  if (result) return message.channel.send(`Error unloading: ${result}`);

  result = cmdRegistry.register(require(`./${command.name}`));
  if (result) return message.channel.send(`Error loading: ${result}`);

  await message.channel.send(`Command **${command.name}** reload succesfully`);
  });