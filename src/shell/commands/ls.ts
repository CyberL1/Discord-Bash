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
      return { code: 1, message: "Path does not exist" };
    }

    if (!statSync(realPath).isDirectory()) {
      return { code: 1, message: "Path is not a directory" };
    }

    let dirContents = readdirSync(realPath);

    if (!flags.all) {
      dirContents = dirContents.filter((c) => !c.startsWith("."));
    }

    return { code: 0, message: dirContents.join(" ") || "\u200b" };
  },
};

export default command;
