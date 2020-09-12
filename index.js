// Platform check
if(require("os").platform() == "win32") console.warn("Windows is not supported by Discord-Bash, some commands will not work.");

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
    console.log("start");
    client.user.setActivity("Mention me");
});

// Load system settings
const settings = require('./settings.json');

client.on("message", async message => {
    if(message.author.bot) return;
    
    // Filesystem dir shortcuts
    let { sep } = require('path');
    let fsDirs = {
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
    if (settings.adminOnly && message.author.id !== settings.adminID) return message.channel.send("Admin only mode is on. Ask your system administrator to turn it off.");
    
    let { existsSync, mkdirSync, readdirSync, readFileSync } = require('fs');
    
    // Filesystem check
    if(!existsSync(fsDirs.bin)) await mkdirSync(fsDirs.bin);
    if(!existsSync(fsDirs.js)) await mkdirSync(fsDirs.js);
    if(!existsSync(fsDirs.sh)) await mkdirSync(fsDirs.sh);
    if(!existsSync(fsDirs.users)) await mkdirSync(fsDirs.users);
    if(!existsSync(fsDirs.home)) await mkdirSync(fsDirs.home);
    
    let collector = new Discord.MessageCollector(message.channel, m => m.author.id == message.author.id);
    await message.react('✅');
    var currentuserdirectory;
    currentuserdirectory = fsDirs.home;

    // Launch user autorun scripts in /home/{user.id}/local/autorun
    if(existsSync(fsDirs.user.local.autorun)) {
        let autorun = await readdirSync(fsDirs.user.local.autorun);
        try {
            autorun = autorun.forEach(file => {
                let i = readFileSync(file).toString().trim().split(" ")[0];
                if(settings.forbiddencmds.includes(i)) return message.channel.send(`\`\`\`File ${file} contains forbidden commands`);
                
                require('child_process').exec(`sh ${fsDirs.user.local.autorun}${sep}${file}`, async function(err, stdout, stderr) {
                if(err) return message.channel.send(`\`\`\`${stderr}\`\`\``);
                await message.channel.send(stdout);
            })});
        } catch (e) {
            return console.log(e);
        };
    };
    
    collector.on("collect", async collected => {
        // System variables
        let split = collected.content.trim().split(/ +/g);
        let cmd = split[0];
        let jsCmd = cmd+".js";
        let shellCmd = cmd+".sh";
        let args = split.slice(1);
        let windowsDrives = /^([a-z]):/i;

        // Default commands
        try {
            switch(cmd) {
                case 'cat': {
                    let { sep } = require('path');
                    let { readFileSync } = require('fs');
                    if(!args[0]) return message.channel.send("Provide a file");
                    if(args[0].startsWith("/") || windowsDrives.test(args[0]) || currentuserdirectory == fsDirs.home && args[0].startsWith("..")) return message.channel.send("Action blocked");
                    let content = readFileSync(`${currentuserdirectory}${sep}${args[0]}`).toString();
                    message.channel.send(`\`\`\`${content}\`\`\``);
                    break;
                };
                case 'cd': {
                    let { sep } = require('path');
                    if(!args[0]) return currentuserdirectory = fsDirs.home;
                    if(args[0].startsWith("/") || windowsDrives.test(args[0]) || currentuserdirectory == fsDirs.home && args[0].startsWith("..")) return message.channel.send("Action blocked");
                    if(args[0] == ".") return;
                    if(args[0] == "..") return currentuserdirectory = currentuserdirectory.split("/").slice(0, -1).join("/");
                    currentuserdirectory = `${currentuserdirectory}${sep}${args[0]}`;
                    break;
                };
                case 'chmod': {
                    let { sep } = require('path');
                    let { chmod } = require('fs');
                    if(!args[0]) return message.channel.send("Provide permission node");
                    if(!args[1]) return message.channel.send("Provide a file/dir to change");
                    if(args[1].startsWith("/") || windowsDrives.test(args[1]) || currentuserdirectory == fsDirs.home && args[1].startsWith("..")) return message.channel.send("Action blocked");
                    chmod(`${currentuserdirectory}${sep}${args[1]}`, args[0], function(err, stdout, stderr) { if(err) return message.channel.send(`\`\`\`chmod: cannot access '${args[1]}': No such file or directory\`\`\``)});
                    break;
                };
                case 'echo': {
                    if(!args.join(" ")) return message.channel.send("Provide text");
                    message.channel.send(`\`\`\`${args.join(" ")}\`\`\``);
                    break;
                };
                case 'exit': {
                    collector.stop();
                    break;
                };
                case 'help': {
                    let { readdirSync } = require('fs');
                    let defaultcommands = [
                        "cat",
                        "cd",
                        "chmod",
                        "echo",
                        "exit",
                        "help",
                        "ls",
                        "mkdir",
                        "pwd",
                        "rm",
                        "rmdir",
                        "sh",
                        "touch",
                        "update",
                        "wget"
                    ];
                    let js = [];
                    let shell = [];
                    await readdirSync(fsDirs.js).forEach(file => js.push(file.split('.')[0]));
                    await readdirSync(fsDirs.sh).forEach(file => shell.push(file.split('.')[0]));
                    let commands = `${defaultcommands.join("\n")}\n${js.join("\n")}\n${shell.join("\n")}`;
                    message.channel.send(commands);
                    break;
                };
                case 'ls': {
                    let { sep } = require('path');
                    let { readdirSync } = require('fs');
                    if(!args[0]) return message.channel.send(readdirSync(currentuserdirectory));
                    if(args[0].startsWith("/") || windowsDrives.test(args[0]) || currentuserdirectory == fsDirs.home && args[0].startsWith("..")) return message.channel.send("Action blocked");
                    message.channel.send(readdirSync(`${currentuserdirectory}${sep}${args[0]}`));
                    break;
                };
                case 'mkdir': {
                    let { sep } = require('path');
                    let { mkdir } = require('fs');
                    if(!args[0]) return message.channel.send("Provide directory to create");
                    if(args[0].startsWith("/") || windowsDrives.test(args[0]) || currentuserdirectory == fsDirs.home && args[0].startsWith("..")) return message.channel.send("Action blocked");
                    mkdir(`${currentuserdirectory}${sep}${args[0]}`, function(err, stdout, stderr) { if(err) return message.channel.send(`\`\`\`mkdir: cannot create directory ‘${args[0]}’: File exists\`\`\``)});
                    break;
                };
                case 'pwd': {
                    message.channel.send(currentuserdirectory);
                    break;
                };
                case 'rm': {
                    let { sep } = require('path');
                    let { unlink } = require("fs");
                    if(!args[0]) return message.channel.send("Provide file to remove");
                    if(args[0].startsWith("/") || windowsDrives.test(args[0]) || currentuserdirectory == fsDirs.home && args[0].startsWith("..")) return message.channel.send("Action blocked");
                    unlink(`${currentuserdirectory}${sep}${args[0]}`, function(err, stdout, stderr) { if(err) return message.channel.send(`\`\`\`rmdir: failed to remove '${args[0]}': No such file or directory\`\`\``)});
                    break;
                };
                case 'rmdir': {
                    let { sep } = require('path');
                    let { rmdir } = require('fs');
                    if(!args[0]) return message.channel.send("Provide directory to remove");
                    if(args[0].startsWith("/") || windowsDrives.test(args[0]) || currentuserdirectory == fsDirs.home && args[0].startsWith("..")) return message.channel.send("Action blocked");
                    rmdir(`${currentuserdirectory}${sep}${args[0]}`, function(err, stdout, stderr) {if(err) return message.channel.send(`\`\`\`rmdir: failed to remove '${args[0]}': No such file or directory\`\`\``)});
                    break;
                };
                case 'sh': {
                    let { sep } = require('path');
                    let { exec } = require('child_process');
                    if(!args[0]) return message.channel.send("Provide a file");
                    if(args[0].startsWith("/") || windowsDrives.test(args[0]) || currentuserdirectory == fsDirs.home && args[0].startsWith("..")) return message.channel.send("Action blocked");
                    let command = `${currentuserdirectory}${sep}${args[0]}`;
                    let i = readFileSync(command).toString().trim().split(" ")[0];
                    if(settings.forbiddencmds.includes(i)) return message.channel.send(`\`\`\`File ${command} contains forbidden commands`);
                    
                    exec(`sh ${command}`, function(err, stdout, stderr) {
                        if(err) return message.channel.send(`\`\`\`${stderr}\`\`\``);
                        message.channel.send(`\`\`\`${stdout}\`\`\``);
                    });
                    break;
                };
                case 'touch': {
                    let { sep } = require('path');
                    let { writeFileSync } = require('fs');
                    if(!args[0]) return message.channel.send("Provide file");
                    if(args[0].startsWith("/") || windowsDrives.test(args[0]) || currentuserdirectory == fsDirs.home && args[0].startsWith("..")) return message.channel.send("Action blocked");
                    let textJoined = args.slice(1).join(" ");
                    if(!textJoined) return message.channel.send("Provide text");
                    if(!textJoined.startsWith("```") && !textJoined.endsWith("```")) return message.channel.send("Text must be in codeblock");
                    let textFinally = textJoined.slice("```".length).slice(0, textJoined.length - 6);
                    writeFileSync(`${currentuserdirectory}${sep}${args[0]}`, textFinally);
                    break;
                };
                case 'update': {
                    await require('child_process').exec("git pull", function(err, stdout, stderr) {
                        if(err) return message.channel.send(`\`\`\`${stderr}\`\`\``);
                        message.channel.send(`\`\`\`${stdout}\`\`\``);
                    });
                    break;
                };
                case 'wget': {
                        let { sep } = require('path');
                        let { exec } = require('child_process');
                        if(!args[0]) return message.channel.send("Provide url");
                        if(args[0] && !args[1]) return exec(`wget ${args[0]}`, function(err, stdout, stderr) { if(err) return message.channel.send(`\`\`\`${stderr}\`\`\``); return message.channel.send(`\`\`\`${stdout}\`\`\``)});
                        if(args[1].startsWith("/") || windowsDrives.test(args[1]) || currentuserdirectory == fsDirs.home && args[1].startsWith("..")) return message.channel.send("Action blocked");
                        if(args[1]) exec(`wget ${args[0]} -P ${currentuserdirectory}${sep}${args[1]}`, function(err, stdout, stderr) { if(err) return message.channel.send(`\`\`\`${stderr}\`\`\``); return message.channel.send(`\`\`\`${stdout}\`\`\``)});
                    break;
                };
            };
        } catch(err) {
            message.channel.send(`\`\`\`${err}\`\`\``);
        };
        
        // Look for commands in /bin
        let jsFiles = await readdirSync(fsDirs.js);
        let shFiles = await readdirSync(fsDirs.sh);
        let js = jsFiles.filter(x => x.endsWith(".js"));
        let shell = shFiles.filter(x => x.endsWith(".sh"));
        
        if(js.includes(jsCmd)) {
            let command;
            try {
                command = require(`${fsDirs.js}${sep}${cmd}.js`);
            } catch (e) {
                return console.log(e);
            };
            
            try {
                await command.run(client, message, args, currentuserdirectory, fsDirs, windowsDrives, collector);
            } catch (e) {
                return console.log(e);
            }};
            
            if(shell.includes(shellCmd)) {
                let command;
                try {
                    command = `${fsDirs.sh}${sep}${cmd}.sh`;
                } catch (e) {
                    return console.log(e);
                };
                
                try {
                    let { exec } = require('child_process');
                    await exec(`sh ${command}`, function(err, stdout, stderr) {
                        if(err) return message.channel.send(`\`\`\`${stderr}\`\`\``);
                        message.channel.send(stdout);
                    });
                } catch (e) {
                    return console.log(e);
                }};
            
            // Look for commands in /home/{user.id}/local/bin
            if(existsSync(fsDirs.user.local.bin)) {
                let files = await readdirSync(fsDirs.user.local.bin);
                
                if(files.includes(cmd)) {
                    let command;
                    try {
                        command = `${fsDirs.user.local.bin}${sep}${cmd}`;
                    } catch (e) {
                        return console.log(e);
                    };
                    
                    try {
                        let i = readFileSync(command).toString().trim().split(" ")[0];
                        if(settings.forbiddencmds.includes(i)) return message.channel.send(`\`\`\`File ${command} contains forbidden commands`);

                        let { exec } = require('child_process');
                        await exec(`sh ${command}`, function(err, stdout, stderr) {
                            if(err) return message.channel.send(`\`\`\`${stderr}\`\`\``);
                            message.channel.send(stdout);
                        });
                    } catch (e) {
                        return console.log(e);
                    }};
                };
            });
    
    collector.on("end", () => {
        process.chdir(__dirname);
        message.channel.send("Thank you for using **Discord-Bash**. Created by **Cyber#7159**");
    });
});

client.login(settings.token);