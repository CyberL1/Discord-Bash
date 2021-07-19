const { Collection } = require('discord.js');

require('argparse').ArgumentParser.prototype.error = function(err) {
  throw err instanceof Error ? err : new Error(err);
};

class HelpCalled extends Error {}

class Tokenizer {
  constructor(str) {
    this.str = str.trim();
    this.finished = false;
    this.commands = [];
    this.tokens = [];
    this.current = '';
  }

  tokenize() {
    if (this.finished) return this.commands;
    let command = true;
    let capture = null;
    let escape = false;
    let finishedCapture = false;
    let inSpace = true;
    
    for (let i = 0; i < this.str.length; i++) {
      const char = this.str[i];
      
      if (finishedCapture) {
        if (char === '|') {
          this.advanceCommand();
          command = inSpace = true;
        } else if (char !== ' ') {
          throw new Error(`(at ${i}) expected space or pipe, got ${char}`);
        }
        inSpace = true;
        finishedCapture = false;
      } else if (command) {
        if (char === ' ') {
          if (!inSpace) {
            this.token('cmd');
            command = false;
            inSpace = true;
          }
        } else if (char === '|') {
          this.token('cmd');
          this.advanceCommand();
          command = inSpace = true;
        } else {
          this.append(char);
          inSpace = false;
        }
      } else if (capture) {
        if (escape) {
          this.append(char);
          escape = false;
        } else if (char === capture.delim) {
          this.token(capture.type);
          finishedCapture = true;
          capture = null;
        } else {
          this.append(char);
        }
      } else if (char === ' ') {
        if (!inSpace) this.token('str');
        inSpace = true;
      } else if (char === '|') {
        if (!inSpace) this.token('str');
        this.advanceCommand();
        command = inSpace = true;
      } else {
        this.append(char);
        inSpace = false;
      }
    }
    if (command) {
      this.token('cmd');
    } else if (!inSpace) {
      if (capture) {
        throw new Error(`(at end) expected ${capture.delim}`);
      } else {
        this.token('str');
      }
    }
    this.advanceCommand();
    this.finished = true;
    return this.commands;
  }

  advanceCommand() {
    this.commands.push(this.tokens);
    this.tokens = [];
  }

  append(c) {
    this.current += c;
  }

  token(type) {
    this.tokens.push({
      type: type,
      value: this.current,
    });
    this.current = '';
  }
}

class CommandRegistry {
  constructor() {
    this.commands = new Collection();
    this.aliases = new Map();
  }

  async execute(msg, bot, str) {
    let commands;
    try {
      commands = new Tokenizer(str).tokenize();
    } catch (e) {
      throw new Error(`Errored while parsing:\n\`${e.message}\``);
    }
    return await this.executeTokens(msg, bot, commands);
  }

  async executeTokens(msg, bot, commands) {
    for (let i = 0; i < commands.length; i++) {
      const name = commands[i][0].value;
      const command = this.resolve(name);
      if (!command) return;
      commands[i] = {
        cmd: command,
        args: commands[i].slice(1).map(t => t.value),
      };
    }
    return await this.executeCommands(msg, bot, commands);
  }

  async executeCommands(msg, bot, commands) {
    let stream = [];
    for (const command of commands) {
      try {
        if (command.cmd.superuserOnly) return msg.channel.send('You must be superuser to run this command');
        stream = await command.cmd.invoke(command.args, msg, bot, stream);
        if (typeof stream === 'string') stream = [stream];
      } catch (e) {
        throw new Error(`Errored on invocation:\n\`${e.message}\``);
      }
    }
    return stream;
  }

  register(cmd) {
    if (cmd.aliases) for (const alias of cmd.aliases) this.aliases.set(alias, cmd.name);
    this.commands.set(cmd.name, cmd);
    return false;
  }

  unregister(cmd) {
    let command;
    if (this.commands.has(cmd)) command = this.commands.get(cmd);
    else if (this.aliases.has(cmd)) command = this.commands.get(this.aliases.get(cmd));

    if (!command) return `The command or alias \`${cmd}\` doesn't exist`;
    delete require.cache[require.resolve(`../bin/js/${command.name}.js`)];
    return false;
  }

  resolve(name) {
    return this.commands.get(name) || this.commands.get(this.aliases.get(name));
  }
}

class Command {
  constructor(superuserOnly, args, ...aliases) {
    this.superuserOnly = superuserOnly || false;
    this.name = args.prog;
    this.aliases = aliases;
    this.args = args;
    this.exec = null;
  }

  execute(exec) {
    this.exec = exec;
    return this;
  }

  async invoke(args, msg, bot, stdin, su = false) {
    try {
      const parsed = this.args.parse_args(args);
      parsed.superuserMode = su;
      return await this.exec(parsed, msg, bot, stdin);
    } catch (e) {
      if (e instanceof HelpCalled) return this.args.format_help();
      throw new Error(`${this.name}: ${e.message}`);
    }
  }
}

module.exports = {
  cmdRegistry: new CommandRegistry(),
  Tokenizer: Tokenizer,
  Command: Command,
};

process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.log(`Uncaught Exception: ${errorMsg}`);
  console.error(err);
});

process.on("unhandledRejection", err => {
  console.log(`Unhandled rejection: ${err}`);
  console.error(err);
});