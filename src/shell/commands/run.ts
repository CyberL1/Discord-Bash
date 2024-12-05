import type { Command } from "../../types.ts";
import { existsSync, readFileSync, statSync } from "fs";
import { Process } from "../classes/Process.ts";

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

    const lines = readFileSync(realPath).toString().split("\n");

    for await (const line of lines) {
      if (line.length) {
        const [name] = line.split(" ");

        new Process(interaction.client.shell, { name }).run(interaction);
      }
    }

    return 0;
  },
};

export default command;
