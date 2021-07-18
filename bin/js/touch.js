const { Command } = require('../../utils/commandParser');
const { ArgumentParser } = require('argparse');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: 'touch',
  description: 'Creates a new file',
});

ap.add_argument('FILE', { nargs: '?' });
ap.add_argument('TEXT', { nargs: '*' });

module.exports = new Command(false, ap, 'touch').run((args, message, client, stdin) => {
    const { sep } = require('path');
    
    if (!args['FILE']) return message.channel.send("Provide filename");
    if (args['FILE'].startsWith("/") || windowsDrives.test(args['FILE']) || message.author.currentdirectory == message.dirs.home && args['FILE'].startsWith("..")) return message.channel.send("Action blocked");
    if (!args['TEXT'][0]) return message.channel.send("Provide text");

    fs.writeFileSync(`${message.author.currentdirectory}${sep}${args['FILE']}`, args['TEXT'].join(' '));
  });