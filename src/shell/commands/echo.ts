import type { Command } from "../../types.ts";

const command: Command = {
  name: "echo",
  run: (interaction, args) => {
    interaction.editReply(args.join(" "));
  },
};

export default command;
