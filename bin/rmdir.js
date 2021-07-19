const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const path = require('path');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: path.basename(__filename).split('.')[0],
  description: 'Remove a directory'
});

ap.add_argument('DIRECTORY', {help: 'The directory to remove', nargs: '*'});

module.exports = new Command(false, ap).execute((args, message, client, stdin) => {
    if (!args['DIRECTORY'][0]) return message.channel.send("Provide directory to remove");
    if (args['DIRECTORY'][0].startsWith("/") || windowsDrives.test(args['DIRECTORY'][0]) || message.author.currentdirectory == message.dirs.home && args['DIRECTORY'][0].startsWith("..")) return message.channel.send("Action blocked");
    
    fs.rmdir(`${message.author.currentdirectory}${path.sep}${args['DIRECTORY'][0]}`, (err, stdout, stderr) => { if(err) return message.channel.send(`\`\`\`rmdir: failed to remove '${args['DIRECTORY'][0]}': No such file or directory\`\`\``)});
  });