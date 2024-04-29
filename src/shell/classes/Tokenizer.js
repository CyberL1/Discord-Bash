export class Tokenizer {
  constructor(str) {
    this.str = str.trim();
    this.tokens = [];
    this.commands = [];
    this.current = "";
  }

  tokenize() {
    // let isComment = false;
    const isComment = false;
    let isCommand = true;

    for (let i = 0; i < this.str.length; i++) {
      const char = this.str[i];

      if (!isComment) {
        if (char != " ") {
          this.current += char;
        }

        if (isCommand && char === " ") {
          this.token("cmd");
          isCommand = false;
        } else if (char === " ") {
          this.token("str");
        }
      }
    }

    // Ensure the last string doens't get skipped
    if (this.current.length) {
      this.token("str");
    }

    this.advanceCommand();
    return this.commands;
  }

  advanceCommand() {
    this.commands.push(this.tokens);
    this.tokens = [];
  }

  token(type) {
    this.tokens.push({ type, value: this.current });
    this.current = "";
  }
}

export class CommandRegistry {
  constructor() {
    this.commands = new Map();
  }

  async execute(interaction, str) {
    await interaction.deferReply({
      ephemeral: interaction.shelluser.config.RESPONSE_TYPE === "private",
    });

    let commands = [];

    try {
      commands = new Tokenizer(str).tokenize();
    } catch (e) {
      throw new Error(`Errored while parsing:\n${e.message}`);
    }
    return await this.executeTokens(interaction, commands);
  }

  async executeTokens(interaction, commands) {
    for (let i = 0; i < commands.length; i++) {
      const name = commands[i][0].value;
      const command = this.resolve(name);

      if (command) {
        commands[i] = {
          cmd: command,
          args: commands[i].slice(1).map((t) => t.value),
        };
      } else {
        return interaction.editReply(`${name}: command not found`);
      }
    }

    return await this.executeCommands(interaction, commands);
  }

  async executeCommands(interaction, commands) {
    for (const command of commands) {
      try {
        command.cmd.run(interaction, command.args);
      } catch (e) {
        throw new Error(`Errored while running:\n${e.message}`);
      }
    }
  }

  register(cmd) {
    this.commands.set(cmd.info.name, cmd);
  }

  resolve(name) {
    return this.commands.get(name);
  }
}
