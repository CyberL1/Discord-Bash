import type { Command } from "../../types.ts";
import { existsSync, readFileSync, statSync } from "fs";

const command: Command = {
  name: "cat",
  description: "Displays file content",
  args: { path: { help: "Path to file", required: true } },

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

    const fileContents = readFileSync(realPath, { encoding: "utf-8" });
    return { code: 0, message: fileContents };
  },
};

export default command;
