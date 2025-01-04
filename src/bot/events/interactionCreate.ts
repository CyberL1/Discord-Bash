import { ChatInputCommandInteraction } from "discord.js";

export const run = async (interaction: ChatInputCommandInteraction) => {
  const command = interaction.client.commands.get(interaction.commandName);
  command.run(interaction);
};

export const data = {
  name: "interactionCreate",
};
