const { Command } = require('../../utils/commandParser');
const { ArgumentParser } = require('argparse');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: 'mkdir',
  description: 'Create a directory',
});

ap.add_argument('DIRECTORY', {help: 'The directory to create', nargs: '*'});

module.exports = new Command(false, ap, 'mkdir').run((args, message, client, stdin) => {
    const { sep } = require('path');
    
    if (!args['DIRECTORY'][0]) return message.channel.send("Provide directory to create");
    if (args['DIRECTORY'][0].startsWith("/") || windowsDrives.test(args['DIRECTORY'][0]) || message.author.currentdirectory == message.dirs.home && args['DIRECTORY'][0].startsWith("..")) return message.channel.send("Action blocked");
    
    fs.mkdirSync(`${message.author.currentdirectory}${sep}${args['DIRECTORY'][0]}`, (err, stdout, stderr) => { if(err) return message.channel.send(`\`\`\`mkdir: cannot create directory ‘${args[0]}’: File exists\`\`\``)});
  });