import { ChatInputCommandInteraction } from "discord.js";

export interface Command {
  name: string;
  superuserOnly?: boolean;
  run: (interaction: ChatInputCommandInteraction, args: string[]) => void;
}

export interface Token {
  type: string;
  value: string;
}
