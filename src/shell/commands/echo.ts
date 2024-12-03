import type { Command } from "../../types.ts";

const command: Command = {
  name: "echo",
  run: (_interaction, args) => {
    return { code: 0, message: `${args.join(" ")}\n` };
  },
};

export default command;
