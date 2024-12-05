import type { Command } from "../../types.ts";

const command: Command = {
  name: "help",
  description: "Displays commmands",

  run: (interaction) => {
    const commands = [];

    for (const [key] of interaction.client.shell.cmdRegistry.commands) {
      commands.push(key);
    }

    console.log(commands.join("\n"));
    return 0;
  },
};

export default command;
