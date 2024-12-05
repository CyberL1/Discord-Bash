import type { Command } from "../../types.ts";

const command: Command = {
  name: "pwd",
  description: "Displays your current directory",

  run: (interaction) => {
    const user = interaction.client.shell.users.get(interaction.user.id);

    console.log(user.env.PWD);
    return 0;
  },
};

export default command;
