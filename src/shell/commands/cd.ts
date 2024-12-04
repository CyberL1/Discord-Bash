import type { Command } from "../../types.ts";
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
      return { code: 1, message: "Path does not exist" };
    }

    if (!statSync(realPath).isDirectory()) {
      return { code: 1, message: "Path is not a directory" };
    }

    interaction.client.shell.users.setDirectory(interaction.user.id, path);
    const { PWD } = interaction.client.shell.users.get(interaction.user.id).env;

    return { code: 0, message: `You're now in: ${PWD}` };
  },
};

export default command;
