import type { Command } from "../../types.ts";

const command: Command = {
  name: "pwd",
  run: (interaction) => {
    const user = interaction.client.shell.users.get(interaction.user.id);

    interaction.editReply(user.env.PWD);
  },
};

export default command;
