const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const path = require('path');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: path.basename(__filename).split('.')[0],
  description: 'Change directory'
});

ap.add_argument('PATH', {help: 'The PATH to go to', nargs: '*'});

module.exports = new Command(false, ap).execute((args, message, client, stdin) => {
    
    if (!args['PATH'][0]) return message.author.currentdirectory = `${message.dirs.home}`;
    if (args['PATH'][0].startsWith("/") || message.author.currentdirectory == message.dirs.home && args['PATH'][0].startsWith("..")) return message.channel.send("Action blocked");
    if (args['PATH'][0] == ".") return;
    if (args['PATH'][0] == "..") return message.author.currentdirectory = message.author.currentdirectory.split("/").slice(0, -1).join("/");
    if (!fs.existsSync(`${message.author.currentdirectory}${path.sep}${args['PATH'][0]}`)) return message.channel.send(`Directory \`${args['PATH'][0]}\` does not exist`);
    
    message.author.currentdirectory = `${message.author.currentdirectory}${path.sep}${args['PATH'][0]}`;
  });