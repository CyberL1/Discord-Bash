import type { Command } from "../../types.ts";
import { existsSync, statSync } from "fs";

const command: Command = {
  name: "run",
  description: "Runs a script file",
  args: { path: { help: "Path to the file" } },

  run: async (interaction, { path }) => {
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

    await interaction.client.shell.cmdRegistry.executeFile(
      interaction,
      realPath,
    );
  },
};

export default command;
