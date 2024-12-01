import type { Command } from "../../types.ts";
import { readdirSync } from "fs";

const command: Command = {
  name: "ls",
  run: (interaction) => {
    const location = interaction.client.shell.users.get(interaction.user.id)
      .variables.PWD;

    const dirContents = readdirSync(interaction.client.shell.fs.from(location));

    interaction.editReply(dirContents.join(" ") || "\u200b");
  },
};

export default command;
