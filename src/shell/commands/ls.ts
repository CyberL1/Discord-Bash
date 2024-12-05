import type { Command } from "../../types.ts";
import { existsSync, readdirSync, statSync } from "fs";

const command: Command = {
  name: "ls",
  description: "Displays contents of a directory",
  args: { path: { help: "Path to a directory" } },
  flags: {
    "--all|-a": { help: "List files starting with .", type: "boolean" },
  },

  run: (interaction, { flags, args: { path } }) => {
    const { env } = interaction.client.shell.users.get(interaction.user.id);
    let location = env.PWD;

    if (path) {
      location = interaction.client.shell.fs.translate(env, path);
    }

    const realPath = interaction.client.shell.fs.from(location);

    if (!existsSync(realPath)) {
      console.log("Path does not exist");
      return 1;
    }

    if (!statSync(realPath).isDirectory()) {
      console.log("Path is not a directory");
      return 1;
    }

    let dirContents = readdirSync(realPath);

    if (!flags.all) {
      dirContents = dirContents.filter((c) => !c.startsWith("."));
    }

    console.log(dirContents.join(" ") || "\u200b");
    return 0;
  },
};

export default command;
