const { Command } = require('../../utils/commandParser');
const { ArgumentParser } = require('argparse');
const interpreter = require('../../utils/interpreter');

const ap = new ArgumentParser({
  prog: 'sh',
  description: 'Executes a shell script',
});

ap.add_argument('PATH', {nargs: '*'});

module.exports = new Command(false, ap, 'sh').run((args, message, client, stdin) => {
    const { sep } = require('path');

    if (!args['PATH'][0]) return message.channel.send("Provide a file");
    if (args['PATH'][0].startsWith("/") || windowsDrives.test(args['PATH'][0]) || message.author.currentdirectory == message.dirs.home && args['PATH'][0].startsWith("..")) return message.channel.send("Action blocked");
    
    const command = `${message.author.currentdirectory}${sep}${args['PATH'][0]}`;
    interpreter.file(message, client, command);
  });