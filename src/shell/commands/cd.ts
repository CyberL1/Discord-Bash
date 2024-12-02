import type { Command } from "../../types.ts";
import { existsSync, statSync } from "fs";

const command: Command = {
  name: "cd",
  run: (interaction, [path]) => {
    const { env } = interaction.client.shell.users.get(interaction.user.id);

    if (!path) {
      path = env.HOME;
    }

    path = interaction.client.shell.fs.translate(env, path);
    const realPath = interaction.client.shell.fs.from(path);

    if (!existsSync(realPath)) {
      return interaction.editReply("Path does not exist");
    }

    if (!statSync(realPath).isDirectory()) {
      return interaction.editReply("Path is not a directory");
    }

    interaction.client.shell.users.setDirectory(interaction.user.id, path);
    const { PWD } = interaction.client.shell.users.get(interaction.user.id).env;

    interaction.editReply(`You're now in: ${PWD}`);
  },
};

export default command;
