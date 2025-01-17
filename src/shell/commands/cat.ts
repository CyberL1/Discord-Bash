import type { Command } from "#shell/types.ts";
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
      console.log("Path does not exist");
      return 1;
    }

    if (statSync(realPath).isDirectory()) {
      console.log("Path is a directory");
      return 1;
    }

    const fileContents = readFileSync(realPath, { encoding: "utf-8" });

    console.log(fileContents);
    return 0;
  },
};

export default command;
