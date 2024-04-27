import { SlashCommandBuilder } from "discord.js";

export const run = (interaction) => {
  const command = interaction.options.getString("cmd");

  shell.run(command);
};

export const data = new SlashCommandBuilder()
  .setName("x")
  .setDescription("Execute a command in the shell")
  .addStringOption((o) =>
    o.setName("cmd").setDescription("The command to execute").setRequired(true),
  );
