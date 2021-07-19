const { Command } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const path = require('path');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: path.basename(__filename).split('.')[0],
  description: 'Creates a new file'
});

ap.add_argument('FILE', { nargs: '?' });
ap.add_argument('TEXT', { nargs: '*' });

module.exports = new Command(false, ap).execute((args, message, client, stdin) => {
    if (!args['FILE']) return message.channel.send("Provide filename");
    if (args['FILE'].startsWith("/") || windowsDrives.test(args['FILE']) || message.author.currentdirectory == message.dirs.home && args['FILE'].startsWith("..")) return message.channel.send("Action blocked");
    if (!args['TEXT'][0]) return message.channel.send("Provide text");

    fs.writeFileSync(`${message.author.currentdirectory}${path.sep}${args['FILE']}`, args['TEXT'].join(' '));
  });