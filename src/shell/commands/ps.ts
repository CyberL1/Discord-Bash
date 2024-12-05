import type { Command } from "../../types.ts";

const command: Command = {
  name: "ps",
  description: "Displays active processes",

  run: async (interaction) => {
    const processes = interaction.client.shell.processes;

    console.log(processes.map((p) => `${p.name}: ${p.pid}`).join("\n"));
    return 0;
  },
};

export default command;
