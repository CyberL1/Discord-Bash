import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const run = (interaction: ChatInputCommandInteraction) => {
  const cmd = interaction.options.getString("cmd");
  interaction.client.shell.run(interaction, cmd);
};

export const data = new SlashCommandBuilder()
  .setName("x")
  .setDescription("Execute a command in the shell")
  .addStringOption((o) =>
    o.setName("cmd").setDescription("The command to execute").setRequired(true),
  );
