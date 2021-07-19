const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: 'chmod',
  description: 'Change file permissions',
});

ap.add_argument('NODE', {help: 'Permissions node', nargs: '?'})
ap.add_argument('FILE', {help: 'The file to change permission', nargs: '*'});

module.exports = new Command(false, ap, 'chmod').execute((args, message, client, stdin) => {
    const { sep } = require('path');

    if (!args['NODE']) return message.channel.send("Provide permission node");
    if (!args['FILE'][0]) return message.channel.send("Provide a file/dir to change");
    if (args['FILE'][0].startsWith("/") || windowsDrives.test(args['FILE'][0]) || message.author.currentdirectory == message.dirs.home && args['FILE'][0].startsWith("..")) return message.channel.send("Action blocked");
    
    fs.chmod(`${message.author.currentdirectory}${sep}${args['FILE'][0]}`, args['NODE'], (err, stdout, stderr) => { if(err) return message.channel.send(`\`\`\`chmod: cannot access '${args['FILE'][0]}': No such file or directory\`\`\``)});
  });