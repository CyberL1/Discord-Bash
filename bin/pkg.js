const { Command, cmdRegistry } = require('../utils/commandParser');
const { ArgumentParser } = require('argparse');
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');

const ap = new ArgumentParser({
  prog: path.basename(__filename).split('.')[0],
  description: 'Allows you to install packages (REMOVE and UPDATE requires system reboot)'
});

ap.add_argument('ACTION', {help: 'INSTALL/REMOVE/UPDATE', nargs: '?'});
ap.add_argument('PACKAGE', {help: 'PACKAGE NAME', nargs: '*'});

module.exports = new Command(true, ap).execute(async (args, message, client, stdin) => {
      if (!args['ACTION']) return message.channel.send("Provide an action (install/remove/update)");

      const pkgAuthor = args['PACKAGE'][0];
      const pkgName = args['PACKAGE'][1];

      switch(args['ACTION'].toLowerCase()) {
        case 'install':
          if (!pkgAuthor) return message.channel.send('Provide package author');
          if (!pkgName) return message.channel.send('Provide package name');
          if (fs.existsSync(`${message.dirs.packages}${path.sep}${pkgName}`)) return message.channel.send(`Package \`${pkgName}\` is installed already`);

          await child_process.exec(`git clone https://github.com/${pkgAuthor}/${pkgName} ${message.dirs.packages}${path.sep}${pkgName}`, async (err, stdout, stderr) => {
            if (err) return message.channel.send(`\`\`\`${stderr}\`\`\``);

            const packageFilesIn = fs.readdirSync(`${message.dirs.packages}${path.sep}${pkgName}${path.sep}commands`).filter(file => file.endsWith('.js'));
            for (const file of packageFilesIn) await cmdRegistry.register(require(`${message.dirs.packages}${path.sep}${pkgName}${path.sep}commands${path.sep}${file}`));
            message.channel.send('Package installed');
        });
          break;
        case 'remove':
          if (!pkgAuthor) return message.channel.send('Provide package name');
          if (!fs.existsSync(`${message.dirs.packages}${path.sep}${pkgAuthor}`)) return message.channel.send(`Package \`${pkgAuthor}\` is not installed`);

          await child_process.exec(`rm -rf ${message.dirs.packages}${path.sep}${pkgAuthor}`, (err, stdout, stderr) => {
          if (err) return message.channel.send(`\`\`\`${stderr}\`\`\``);
          return message.channel.send('Package removed');
        });
        break;
      case 'update':
        if (!pkgAuthor) return message.channel.send('Provide package name');
        if (!fs.existsSync(`${message.dirs.packages}${path.sep}${pkgAuthor}`)) return message.channel.send(`Package \`${pkgAuthor}\` is not installed`);

        await child_process.exec(`cd ${message.dirs.packages}${path.sep}${pkgAuthor} && git pull`, async (err, stdout, stderr) => {
          if (stdout == 'Already up to date.\n') return message.channel.send('Already up to date.');
          return message.channel.send('Package updated');
        });
        break;
      }
  });