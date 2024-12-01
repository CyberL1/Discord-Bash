import { Tokenizer } from "./Tokenizer.js";

export class CommandRegistry {
  constructor() {
    this.commands = new Map();
  }

  async execute(interaction, str) {
    await interaction.deferReply({
      ephemeral: interaction.shelluser.config.RESPONSE_TYPE === "private",
    });

    let tokens = [];

    try {
      tokens = new Tokenizer(str).tokenize();
    } catch (e) {
      throw new Error(`Errored while parsing:\n${e.message}`);
    }
    return await this.executeTokens(interaction, tokens);
  }

  async executeTokens(interaction, tokens) {
    const cmds = tokens.filter((t) => t.type === "cmd");

    for (const cmd of cmds) {
      try {
        const command = this.commands.get(cmd.value);

        if (!command) {
          return interaction.editReply(`${cmd.value}: command not found`);
        }

        command.run(
          interaction,
          tokens.slice(1).map((t) => t.value),
        );
      } catch (e) {
        throw new Error(`Errored while running:\n${e.message}`);
      }
    }
  }

  register(cmd) {
    this.commands.set(cmd.info.name, cmd);
  }
}
