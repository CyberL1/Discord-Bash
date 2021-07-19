const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: 'ls',
  description: 'List files and directories in a directory.',
  add_help: false
});

ap.add_argument('PATH', { nargs: '*' });

module.exports = new Command(false, ap, 'ls').execute((args, message, client, stdin) => {
    const { sep } = require('path');
    
    if (!args['PATH'][0]) return message.channel.send(fs.readdirSync(message.author.currentdirectory) || '\u2000b');
    if (args['PATH'][0].startsWith("/") || windowsDrives.test(args['PATH'][0]) || message.author.currentdirectory == message.dirs.home && args['PATH'][0].startsWith("..")) return message.channel.send("Action blocked");
    if (!fs.existsSync(`${message.author.currentdirectory}${sep}${args['PATH'][0]}`)) return message.channel.send(`Directory \`${args['PATH'][0]}\` does not exist`);
    
    message.channel.send(fs.readdirSync(`${message.author.currentdirectory}${sep}${args['PATH'][0]}` || '\u2000b'));
  });