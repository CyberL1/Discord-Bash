import { ChatInputCommandInteraction } from "discord.js";

export interface Command {
  name: string;
  description: string;
  args?: Arguments;
  superuserOnly?: boolean;
  run: (
    interaction: ChatInputCommandInteraction,
    args: { [key: string]: string },
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

interface Arguments {
  [arg: string]: ArgumentOptions;
}

interface ArgumentOptions {
  help: string;
  infinite?: boolean;
  required?: boolean;
}
