const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const path = require('path');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: path.basename(__filename).split('.')[0],
  description: 'List files and directories in a directory',
  add_help: false
});

ap.add_argument('PATH', { nargs: '*' });

module.exports = new Command(false, ap).execute((args, message, client, stdin) => {    
    if (!args['PATH'][0]) return message.channel.send(fs.readdirSync(message.author.currentdirectory) || '\u2000b');
    if (args['PATH'][0].startsWith("/") || windowsDrives.test(args['PATH'][0]) || message.author.currentdirectory == message.dirs.home && args['PATH'][0].startsWith("..")) return message.channel.send("Action blocked");
    if (!fs.existsSync(`${message.author.currentdirectory}${path.sep}${args['PATH'][0]}`)) return message.channel.send(`Directory \`${args['PATH'][0]}\` does not exist`);
    
    message.channel.send(fs.readdirSync(`${message.author.currentdirectory}${path.sep}${args['PATH'][0]}` || '\u2000b'));
  });