import { ChatInputCommandInteraction } from "discord.js";
import type { ArgumentsParsed, Command, Token } from "#shell/types.ts";
import { Tokenizer } from "./Tokenizer.ts";
import { Arguments } from "./Arguments.ts";

export class CommandRegistry {
  commands: Map<string, Command>;

  constructor() {
    this.commands = new Map();
  }

  async execute(interaction: ChatInputCommandInteraction, str: string) {
    const user = interaction.client.shell.users.get(interaction.user.id);

    if (!interaction.deferred) {
      await interaction.deferReply({
        ephemeral: user.config.RESPONSE_TYPE === "private",
      });
    }

    let tokensArray: Token[][] = [];

    try {
      const lines = str.split("\n").filter((l) => l.length > 0);
      tokensArray = lines.map((line) => new Tokenizer(line).tokenize());

      for (let tokens of tokensArray) {
        // Replace "$" variables
        const { env } = interaction.client.shell.users.get(interaction.user.id);
        tokens = tokens.map((t) => {
          const match = /\\?\$([A-Za-z_][A-Za-z0-9_]*)/g;

          if (t.value.match(match)) {
            for (const m of t.value.match(match)) {
              if (!m.startsWith("\\")) {
                t.value = t.value.replace(m, env[m.slice(1)] ?? "");
              }
            }
          }

          return t;
        });
      }
    } catch (e) {
      throw new Error(`Errored while parsing:\n${e.message}`);
    }

    return await this.executeTokens(interaction, tokensArray);
  }

  async executeTokens(
    interaction: ChatInputCommandInteraction,
    tokensArray: Token[][],
  ) {
    let exit: number = 0;

    for (const tokens of tokensArray) {
      const cmds = tokens.filter((t) => t.type === "cmd");

      for (const cmd of cmds) {
        try {
          const command = this.commands.get(cmd.value);

          if (!command) {
            console.log(`${cmd.value}: command not found`);
            exit = 127;
            continue;
          }

          const args = tokens.slice(1).map((t) => t.value);
          const argsParsed = new Arguments(command).parse(args);

          if (typeof args === "string") {
            console.log(`Missing ${args} argument`);
            exit = 2;
            continue;
          }

          exit = await command.run(interaction, argsParsed as ArgumentsParsed);
        } catch (e) {
          exit = 1;

          console.error(`Exited with code: ${exit}`);
          throw new Error(`Errored while running:\n${e.message}`);
        }
      }
    }

    return exit;
  }

  register(cmd: Command) {
    this.commands.set(cmd.name, cmd);
  }
}
