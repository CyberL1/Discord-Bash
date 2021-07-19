const { Command } = require('../../utils/commandParser');
const { ArgumentParser } = require('argparse');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: 'cd',
  description: 'Change directory',
});

ap.add_argument('PATH', {help: 'The PATH to go to', nargs: '*'});

module.exports = new Command(false, ap, 'cd').execute((args, message, client, stdin) => {
    const { sep } = require('path');
    
    if (!args['PATH'][0]) return message.author.currentdirectory = `${message.dirs.home}`;
    if (args['PATH'][0].startsWith("/") || message.author.currentdirectory == message.dirs.home && args['PATH'][0].startsWith("..")) return message.channel.send("Action blocked");
    if (args['PATH'][0] == ".") return;
    if (args['PATH'][0] == "..") return message.author.currentdirectory = message.author.currentdirectory.split("/").slice(0, -1).join("/");
    if (!fs.existsSync(`${message.author.currentdirectory}${sep}${args['PATH'][0]}`)) return message.channel.send(`Directory \`${args['PATH'][0]}\` does not exist`);
    
    message.author.currentdirectory = `${message.author.currentdirectory}${sep}${args['PATH'][0]}`;
  });