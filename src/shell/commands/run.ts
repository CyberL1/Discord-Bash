import type { Command } from "../../types.ts";
import { existsSync, readFileSync, statSync } from "fs";

const command: Command = {
  name: "run",
  description: "Runs a script file",
  args: { path: { help: "Path to the file", required: true } },

  run: async (interaction, { args: { path } }) => {
    const { env } = interaction.client.shell.users.get(interaction.user.id);

    const realPath = interaction.client.shell.fs.from(
      interaction.client.shell.fs.translate(env, path),
    );

    if (!existsSync(realPath)) {
      return { code: 1, message: "Path does not exist" };
    }

    if (statSync(realPath).isDirectory()) {
      return { code: 1, message: "Path is a directory" };
    }

    const buffer = readFileSync(realPath);
    await interaction.client.shell.cmdRegistry.execute(interaction, buffer);
  },
};

export default command;
