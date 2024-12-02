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
      return interaction.editReply("Path does not exist");
    }

    if (!statSync(realPath).isDirectory()) {
      return interaction.editReply("Path is not a directory");
    }

    const dirContents = readdirSync(realPath);
    interaction.editReply(dirContents.join(" ") || "\u200b");
  },
};

export default command;
