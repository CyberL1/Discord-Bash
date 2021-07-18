// Platform check
if (require("os").platform() == "win32") console.warn("Windows is not supported by Discord-Bash, use WSL for full experience.");

const Discord = require('discord.js');
const { cmdRegistry } = require('./utils/commandParser');
const interpreter = require("./utils/interpreter");
const fs = require('fs');

const client = new Discord.Client();

client.on("ready", () => {
    console.log('Logged in');
    client.user.setActivity('Mention me');
});

// Load system settings
const settings = require('./settings.json');

client.on('message', async message => {
    if (message.author.bot) return;
    
    if (message.content.startsWith(`${settings.prefix}forcelogout`) && message.author.collector) return message.author.collector.stop();

    // Filesystem dir shortcuts
    const { sep } = require('path');
    message.dirs = {
        users: `${__dirname}${sep}home`,
        home: `${__dirname}${sep}home${sep}${message.author.id}`,
        bin: `${__dirname}${sep}bin`,
        js: `${__dirname}${sep}bin${sep}js`,
        sh: `${__dirname}${sep}bin${sep}sh`,
        user: {
            local: {
                bin: `${__dirname}${sep}home${sep}${message.author.id}${sep}local${sep}bin`,
                autorun: `${__dirname}${sep}home${sep}${message.author.id}${sep}local${sep}autorun`
            }
        }
    };
    
    // Mention the bot to start system
    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (!message.content.match(mention)) return;
    if (message.author.collector) return message.channel.send(`You cannot login multiple times at the same time,\nyou are already loged in here -> ${message.author.collector.channel instanceof Discord.DMChannel ? client.user : message.author.collector.channel}\nclick to jump to the channel and continue the usage of your account\nor do \`${settings.prefix}forcelogout\` to force logout`);
    
    // Initiate system variables
    global.windowsDrives = /^([a-z]):/i;

    // Filesystem check
    if (!fs.existsSync(`${__dirname}${sep}sudoers.txt`)) await fs.writeFileSync(`${__dirname}${sep}sudoers.txt`, '[YOUR ID HERE]');
    if (!fs.existsSync(message.dirs.bin)) await fs.mkdirSync(message.dirs.bin);
    if (!fs.existsSync(message.dirs.js)) await fs.mkdirSync(message.dirs.js);
    if (!fs.existsSync(message.dirs.sh)) await fs.mkdirSync(message.dirs.sh);
    if (!fs.existsSync(message.dirs.users)) await fs.mkdirSync(message.dirs.users);
    if (!fs.existsSync(message.dirs.home)) await fs.mkdirSync(message.dirs.home);
    
    // Load js commands
    const jsFiles = fs.readdirSync(__dirname + '/bin/js');
    for (const file of jsFiles) {
        if (file.endsWith('.js')) cmdRegistry.register(require('./bin/js/' + file));
    }
    
    message.author.collector = message.channel.createMessageCollector(m => m.author.id == message.author.id);
    await message.react('✅');
    message.author.currentdirectory = message.dirs.home;

    // Launch user autorun scripts in /home/{user.id}/local/autorun
    if (fs.existsSync(message.dirs.user.local.autorun)) {
        try {
            await fs.readdirSync(message.dirs.user.local.autorun).forEach(file => {
                interpreter.file(message, client, `${message.dirs.user.local.autorun}${sep}${file}`);
            });
        } catch (e) {
            return console.log(e);
        };
    };

    message.author.collector.on("collect", async collected => {
        const split = collected.content.trim().split(/ +/g);
        const cmd = split[0];
        
        await interpreter.cmd(collected, client, collected.content.trim());

        // Look for commands in /bin/sh
        if (fs.existsSync(message.dirs.sh)) {
            let files = await fs.readdirSync(message.dirs.sh);
            
            if (files.includes(cmd)) {
                let command;
                try {
                    command = `${message.dirs.sh}${sep}${cmd}`;
                } catch (e) {
                    return console.log(e);
                };
                
                try {
                    interpreter.file(message, client, command);
                } catch (e) {
                    return console.log(e);
                }};
            };
            
            // Look for commands in /home/{user.id}/local/bin
            if (fs.existsSync(message.dirs.user.local.bin)) {
                let files = await fs.readdirSync(message.dirs.user.local.bin);
                
                if (files.includes(cmd)) {
                    let command;
                    try {
                        command = `${message.dirs.user.local.bin}${sep}${cmd}`;
                    } catch (e) {
                        return console.log(e);
                    };
                    
                    try {
                        interpreter.file(message, client, command);
                    } catch (e) {
                        return console.log(e);
                    }};
                };
            });
    
    message.author.collector.on("end", () => {
        delete message.author.collector;
    });
});

client.login(settings.token);
