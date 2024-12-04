import type { Command } from "../../types.ts";

const command: Command = {
  name: "exit",
  description: "Returns a given code",
  args: { code: { help: "The code to return" } },

  run: (_imteraction, { args: { code } }) => {
    return { code: Number(code) || 0 };
  },
};

export default command;
