import type { Command } from "#shell/types.ts";
import { existsSync, readFileSync, statSync } from "fs";
import { Process } from "#shell/classes/Process.ts";

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
      console.log("Path does not exist");
      return 1;
    }

    if (statSync(realPath).isDirectory()) {
      console.log("Path is a directory");
      return 1;
    }

    const name = readFileSync(realPath).toString();
    new Process(interaction.client.shell, { name }).run(interaction);
  },
};

export default command;
