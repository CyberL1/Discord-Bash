export const run = async (interaction) => {
  const command = interaction.client.commands.get(interaction.commandName);
  command.run(interaction);
};

export const data = {
  name: "interactionCreate",
};
