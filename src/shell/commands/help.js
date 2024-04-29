export const run = (interaction) => {
  const commands = [];

  for (const [key] of interaction.shell.cmdRegistry.commands) {
    commands.push(key);
  }

  interaction.editReply(commands.join("\n"));
};

export const info = {
  name: "help",
};
