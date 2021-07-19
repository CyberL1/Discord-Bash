const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: 'mkdir',
  description: 'Remove a directory',
});

ap.add_argument('DIRECTORY', {help: 'The directory to remove', nargs: '*'});

module.exports = new Command(false, ap, 'rmdir').execute((args, message, client, stdin) => {
    const { sep } = require('path');

    if (!args['DIRECTORY'][0]) return message.channel.send("Provide directory to remove");
    if (args['DIRECTORY'][0].startsWith("/") || windowsDrives.test(args['DIRECTORY'][0]) || message.author.currentdirectory == message.dirs.home && args['DIRECTORY'][0].startsWith("..")) return message.channel.send("Action blocked");
    
    fs.rmdir(`${message.author.currentdirectory}${sep}${args['DIRECTORY'][0]}`, (err, stdout, stderr) => { if(err) return message.channel.send(`\`\`\`rmdir: failed to remove '${args['DIRECTORY'][0]}': No such file or directory\`\`\``)});
  });