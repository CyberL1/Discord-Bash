import type { Command } from "../../types.ts";

const command: Command = {
  name: "help",
  run: (interaction) => {
    const commands = [];

    for (const [key] of interaction.client.shell.cmdRegistry.commands) {
      commands.push(key);
    }

    interaction.editReply(commands.join("\n"));
  },
};

export default command;
