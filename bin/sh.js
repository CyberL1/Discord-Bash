const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const path = require('path');
const interpreter = require('../utils/interpreter');

const ap = new ArgumentParser({
  prog: path.basename(__filename).split('.')[0],
  description: 'Executes a shell script'
});

ap.add_argument('PATH', {help: 'Path to the script', nargs: '*'});

module.exports = new Command(false, ap).execute((args, message, client, stdin) => {
    if (!args['PATH'][0]) return message.channel.send("Provide a file");
    if (args['PATH'][0].startsWith("/") || windowsDrives.test(args['PATH'][0]) || message.author.currentdirectory == message.dirs.home && args['PATH'][0].startsWith("..")) return message.channel.send("Action blocked");
    
    const command = `${message.author.currentdirectory}${path.sep}${args['PATH'][0]}`;
    interpreter.file(message, client, command);
  });