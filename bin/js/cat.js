const { Command } = require('../../utils/commandParser');
const { ArgumentParser } = require('argparse');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: 'cat',
  description: 'Displays content of a file',
});

ap.add_argument('FILE', {help: 'FILE', nargs: '*'});

module.exports = new Command(false, ap, 'cat').run((args, message, client, stdin) => {
      const { sep } = require('path');
      
      if (!args['FILE'][0]) return message.channel.send("Provide a file");
      if (args['FILE'][0].startsWith("/") || windowsDrives.test(args['FILE'][0]) || message.author.currentdirectory == message.dirs.home && args['FILE'][0].startsWith("..")) return message.channel.send("Action blocked");

      const content = fs.readFileSync(`${message.author.currentdirectory}${sep}${args['FILE'][0]}`).toString();
      message.channel.send(`\`\`\`sh\n${content}\`\`\``);
  });