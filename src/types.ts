import { ChatInputCommandInteraction } from "discord.js";

export interface Command {
  name: string;
  description: string;
  args?: Arguments;
  flags?: Flags;
  superuserOnly?: boolean;
  run: (
    interaction: ChatInputCommandInteraction,
    args: ArgumentsParsed,
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

interface Flags {
  [flag: string]: FlagOptions;
}

interface FlagOptions {
  help: string;
  type: "string" | "boolean";
}

export interface ArgumentsParsed {
  flags: { [key: string]: string };
  args: { [key: string]: string };
}
