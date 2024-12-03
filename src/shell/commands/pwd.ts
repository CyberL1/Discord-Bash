import type { Command } from "../../types.ts";

const command: Command = {
  name: "pwd",
  description: "Displays your current directory",

  run: (interaction) => {
    const user = interaction.client.shell.users.get(interaction.user.id);

    return { code: 0, message: user.env.PWD };
  },
};

export default command;
