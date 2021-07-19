const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const path = require('path');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: path.basename(__filename).split('.')[0],
  description: 'Displays content of a file'
});

ap.add_argument('FILE', {help: 'FILE', nargs: '*'});

module.exports = new Command(false, ap).execute((args, message, client, stdin) => {
      
      if (!args['FILE'][0]) return message.channel.send("Provide a file");
      if (args['FILE'][0].startsWith("/") || windowsDrives.test(args['FILE'][0]) || message.author.currentdirectory == message.dirs.home && args['FILE'][0].startsWith("..")) return message.channel.send("Action blocked");

      const content = fs.readFileSync(`${message.author.currentdirectory}${path.sep}${args['FILE'][0]}`).toString();
      message.channel.send(`\`\`\`sh\n${content}\`\`\``);
  });