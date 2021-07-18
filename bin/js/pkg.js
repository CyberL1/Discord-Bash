const { Command } = require('../../utils/commandParser');
const { ArgumentParser } = require('argparse');

const ap = new ArgumentParser({
  prog: 'pkg',
  description: 'Allows you to install packages',
});

ap.add_argument('ACTION', {help: 'INSTALL/UNINSTALL', nargs: '?'});
ap.add_argument('PACKAGE', {help: 'PACKAGE NAME', nargs: '*'});

module.exports = new Command(true, ap, 'pkg').run((args, message, client, stdin) => {
      if (!args['ACTION']) return message.channel.send("Provide an action (install/uninstall)");
      if (!args['PACKAGE'][0]) return message.channel.send('Prove package name');

      require('child_process').exec(`git clone https://github.com/discord-bash/${args['PACKAGE'][0]} ${message.dirs.packages}/${args['PACKAGE'][0]}`, function(err, stdout, stderr) { if(err) return message.channel.send(`\`\`\`${stderr}\`\`\``); return message.channel.send(`\`\`\`${stdout}\`\`\``)});
  });