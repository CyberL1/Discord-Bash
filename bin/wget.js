const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const path = require('path');
const child_process = require('child_process');

const ap = new ArgumentParser({
  prog: path.basename(__filename).split('.')[0],
  description: 'Get files from the internet'
});

ap.add_argument('URL', {help: 'URL', nargs: '?'});
ap.add_argument('PATH', {help: 'PATH TO SAVE FILE', nargs: '*'});

module.exports = new Command(false, ap).execute((args, message, client, stdin) => {
    if (!args['URL']) return message.channel.send("Provide url");
    if (args['URL'] && !args['PATH'][0]) return child_process.exec(`wget ${args['URL']} -P ${message.author.currentdirectory}`, function(err, stdout, stderr) { if(err) return message.channel.send(`\`\`\`${stderr}\`\`\``); return message.channel.send(`\`\`\`${stdout}\`\`\``)});
    if (args['PATH'][0].startsWith("/") || windowsDrives.test(args['PATH'][0]) || message.author.currentdirectory == message.dirs.home && args['PATH'][0].startsWith("..")) return message.channel.send("Action blocked");
    if (args['PATH'][0]) child_process.exec(`wget ${args['URL']} -P ${message.author.currentdirectory}${path.sep}${args['PATH'][0]}`, function(err, stdout, stderr) { if(err) return message.channel.send(`\`\`\`${stderr}\`\`\``); return message.channel.send(`\`\`\`${stdout}\`\`\``)});
  });