import type { Command } from "#shell/types.ts";
import { existsSync, statSync } from "fs";

const command: Command = {
  name: "cd",
  description: "Changes your directory",
  args: { path: { help: "The directory to go to" } },

  run: (interaction, { args: { path } }) => {
    const { env } = interaction.client.shell.users.get(interaction.user.id);

    if (!path) {
      path = env.HOME;
    }

    path = interaction.client.shell.fs.translate(env, path);
    const realPath = interaction.client.shell.fs.from(path);

    if (!existsSync(realPath)) {
      console.log("Path does not exist");
      return 1;
    }

    if (!statSync(realPath).isDirectory()) {
      console.log("Path is not a directory");
      return 1;
    }

    interaction.client.shell.users.setDirectory(interaction.user.id, path);
    const { PWD } = interaction.client.shell.users.get(interaction.user.id).env;

    console.log(`You're now in: ${PWD}`);
    return 0;
  },
};

export default command;
