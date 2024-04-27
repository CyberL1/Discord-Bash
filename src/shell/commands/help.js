export const run = (interaction) => {
  const commands = [];

  for (const [key] of interaction.shell.commands) {
    commands.push(key);
  }

  interaction.editReply(commands.join("\n"));
};
