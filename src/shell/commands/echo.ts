import type { Command } from "../../types.ts";

const command: Command = {
  name: "echo",
  description: "Displays provided text",
  args: { text: { help: "The text to display", infinite: true } },

  run: (_interaction, { args: { text } }) => {
    return { code: 0, message: text };
  },
};

export default command;
