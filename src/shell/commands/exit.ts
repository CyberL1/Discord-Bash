import type { Command } from "../../types.ts";

const command: Command = {
  name: "exit",
  run: (_imteraction, [code]) => {
    return { code: Number(code) || 0 };
  },
};

export default command;
