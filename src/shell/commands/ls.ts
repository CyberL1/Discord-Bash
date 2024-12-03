import type { Command } from "../../types.ts";
import { existsSync, readdirSync, statSync } from "fs";

const command: Command = {
  name: "ls",
  run: (interaction, [path]) => {
    const { env } = interaction.client.shell.users.get(interaction.user.id);
    let location = env.PWD;

    if (path) {
      location = interaction.client.shell.fs.translate(env, path);
    }

    const realPath = interaction.client.shell.fs.from(location);

    if (!existsSync(realPath)) {
      return { code: 1, message: "Path does not exist" };
    }

    if (!statSync(realPath).isDirectory()) {
      return { code: 1, message: "Path is not a directory" };
    }

    const dirContents = readdirSync(realPath);

    return { code: 0, message: dirContents.join(" ") || "\u200b" };
  },
};

export default command;
