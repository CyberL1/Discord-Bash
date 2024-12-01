import { ChatInputCommandInteraction } from "discord.js";
import type { Command, Token } from "../../types.ts";
import { Tokenizer } from "./Tokenizer.ts";

export class CommandRegistry {
  commands: Map<string, Command>;

  constructor() {
    this.commands = new Map();
  }

  async execute(interaction: ChatInputCommandInteraction, str: string) {
    const user = interaction.client.shell.users.get(interaction.user.id);

    await interaction.deferReply({
      ephemeral: user.config.RESPONSE_TYPE === "private",
    });

    let tokens = [];

    try {
      tokens = new Tokenizer(str).tokenize();
    } catch (e) {
      throw new Error(`Errored while parsing:\n${e.message}`);
    }
    return await this.executeTokens(interaction, tokens);
  }

  async executeTokens(
    interaction: ChatInputCommandInteraction,
    tokens: Token[],
  ) {
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

  register(cmd: Command) {
    this.commands.set(cmd.name, cmd);
  }
}
