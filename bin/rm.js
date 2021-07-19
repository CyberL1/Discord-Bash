const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const path = require('path');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: path.basename(__filename).split('.')[0],
  description: 'Remove a file'
});

ap.add_argument('FILE', { help: 'The file to remove', nargs: '*' });

module.exports = new Command(false, ap).execute((args, message, client, stdin) => {
    if (!args['FILE'][0]) return message.channel.send("Provide file to remove");
    if (args['FILE'][0].startsWith("/") || windowsDrives.test(args['FILE'][0]) || message.author.currentdirectory == message.dirs.home && args['FILE'][0].startsWith("..")) return message.channel.send("Action blocked");
    
    fs.unlink(`${message.author.currentdirectory}${path.sep}${args['FILE'][0]}`, function(err, stdout, stderr) { if(err) return message.channel.send(`\`\`\`rmdir: failed to remove '${args['FILE'][0]}': No such file or directory\`\`\``)});
  });