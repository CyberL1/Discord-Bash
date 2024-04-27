import { SlashCommandBuilder } from "discord.js";

export const run = (interaction) => {
  const args = interaction.options.getString("cmd").split(" ");
  const command = args.shift();

  interaction.client.shell.run(interaction, command, args);
};

export const data = new SlashCommandBuilder()
  .setName("x")
  .setDescription("Execute a command in the shell")
  .addStringOption((o) =>
    o.setName("cmd").setDescription("The command to execute").setRequired(true),
  );
