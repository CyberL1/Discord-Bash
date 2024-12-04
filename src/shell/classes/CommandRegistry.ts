import { ChatInputCommandInteraction } from "discord.js";
import type { Command, Exit, Token } from "../../types.ts";
import { Tokenizer } from "./Tokenizer.ts";
import { createInterface } from "readline";
import { createReadStream } from "fs";
import { Arguments } from "./Arguments.ts";

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

    let tokens: Token[] = [];

    try {
      tokens = new Tokenizer(str).tokenize();

      // Replace "$" variables
      const { env } = interaction.client.shell.users.get(interaction.user.id);
      tokens = tokens.map((t) => {
        const match = /\\?\$([A-Za-z_][A-Za-z0-9_]*)/g;

        if (t.value.match(match)) {
          for (const m of t.value.match(match)) {
            if (!m.startsWith("\\") && env[m.slice(1)]) {
              t.value = t.value.replace(m, env[m.slice(1)]);
            }
          }
        }

        return t;
      });
    } catch (e) {
      throw new Error(`Errored while parsing:\n${e.message}`);
    }

    return await this.executeTokens(interaction, [tokens]);
  }

  async executeFile(interaction: ChatInputCommandInteraction, path: string) {
    const user = interaction.client.shell.users.get(interaction.user.id);

    if (!interaction.deferred) {
      await interaction.deferReply({
        ephemeral: user.config.RESPONSE_TYPE === "private",
      });
    }

    const tokensArray: Token[][] = [];

    try {
      const rl = createInterface({ input: createReadStream(path) });

      for await (const line of rl) {
        if (line.length) {
          tokensArray.push(new Tokenizer(line).tokenize());
        }
      }

      for (let tokens of tokensArray) {
        // Replace "$" variables
        const { env } = interaction.client.shell.users.get(interaction.user.id);
        tokens = tokens.map((t) => {
          const match = /\\?\$([A-Za-z_][A-Za-z0-9_]*)/g;

          if (t.value.match(match)) {
            for (const m of t.value.match(match)) {
              if (!m.startsWith("\\") && env[m.slice(1)]) {
                t.value = t.value.replace(m, env[m.slice(1)]);
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
    const exits = [] as Exit[];
    let exit = {} as Exit;

    for (const tokens of tokensArray) {
      const cmds = tokens.filter((t) => t.type === "cmd");

      for (const cmd of cmds) {
        try {
          const command = this.commands.get(cmd.value);

          if (!command) {
            exit = { code: 127, message: `${cmd.value}: command not found` };
            exits.push(exit);
            continue;
          }

          const args = command.args
            ? new Arguments(command).parse(tokens.slice(1).map((t) => t.value))
            : [];

          if (typeof args === "string") {
            exit = {
              code: 2,
              message: `${cmd.value}: Missing ${args} argument`,
            };

            exits.push(exit);
            continue;
          }

          exit = await command.run(interaction, args);

          if (exit) {
            if (exit.code != 0 && exit.message) {
              exit.message = `${cmd.value}: ${exit.message}`;
            }

            exits.push(exit);
          }
        } catch (e) {
          exit.code = 1;

          console.error(`Exited with code: ${exit.code}`);
          throw new Error(`Errored while running:\n${e.message}`);
        }
      }
    }

    if (exit) {
      exit.message = exits.map((e) => e.message).join("\n");
      interaction.editReply(`\`\`\`\n${exit.message}\n\`\`\``);
    }

    return exit;
  }

  register(cmd: Command) {
    this.commands.set(cmd.name, cmd);
  }
}
