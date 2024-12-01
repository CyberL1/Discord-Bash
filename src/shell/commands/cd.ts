import type { Command } from "../../types.ts";
import { existsSync, statSync } from "fs";
import { join } from "path";

const command: Command = {
  name: "cd",
  run: (interaction, [path]) => {
    const pwd = interaction.client.shell.users.get(interaction.user.id)
      .variables.PWD;

    if (!path || path === "~") {
      path = `/home/${interaction.user.id}`;
    } else if (path.startsWith("~/")) {
      path = path.replace("~/", `/home/${interaction.user.id}/`);
    } else if (path.startsWith("/")) {
      path = path.replace(`/home/${interaction.user.id}`, "");
    } else {
      path = join(pwd, path);
    }

    const realPath = interaction.client.shell.fs.from(path);

    if (!existsSync(realPath)) {
      return interaction.editReply("Path does not exist");
    }

    if (!statSync(realPath).isDirectory()) {
      return interaction.editReply("Path in not a directory");
    }

    interaction.client.shell.users.setDirectory(interaction.user.id, path);
    interaction.editReply(`You're now in: ${path.replaceAll("\\", "/")}`);
  },
};

export default command;
