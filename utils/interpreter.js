const { createReadStream } = require('fs');
const { createInterface } = require('readline');
const { cmdRegistry } = require('./commandParser');

exports.cmd = async (message, client, cmd) => {
    cmd = cmd
    .replaceAll('\\n', '\n')
    .replaceAll('$USER', message.author.username)
    .replaceAll('$ID', message.author.id)
    .replaceAll('$PWD', message.author.currentdirectory)

    await cmdRegistry.execute(message, client, cmd.trim());
}

exports.file = (message, client, file) => {
    const interface = createInterface({
        input: createReadStream(file)
    });

    interface.on('line', async line => {
       line = line
       .replaceAll('\\n', '\n')
       .replaceAll('$USER', message.author.username)
       .replaceAll('$ID', message.author.id)
       .replaceAll('$PWD', message.author.currentdirectory)

        await cmdRegistry.execute(message, client, line.trim());
    });
}