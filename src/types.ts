import { ChatInputCommandInteraction } from "discord.js";

export interface Command {
  name: string;
  superuserOnly?: boolean;
  run: (
    interaction: ChatInputCommandInteraction,
    args: string[],
  ) => Exit | Promise<Exit>;
}

export interface Token {
  type: string;
  value: string;
}

export interface Exit {
  code: number;
  message?: string;
}
