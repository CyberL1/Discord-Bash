import { SlashCommandBuilder } from "discord.js";

export const run = (interaction) => {
  try {
    interaction.client.shell.users.create(interaction.user.id);
  } catch {
   return interaction.reply("You already have an account");
  }

  interaction.reply("Account created");
};

export const data = new SlashCommandBuilder()
  .setName("create-user")
  .setDescription("Create an account in the system");
