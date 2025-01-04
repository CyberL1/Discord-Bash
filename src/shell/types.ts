import { ChatInputCommandInteraction } from "discord.js";

export interface Command {
  name: string;
  description: string;
  args?: Arguments;
  flags?: Flags;
  run: (
    interaction: ChatInputCommandInteraction,
    args: ArgumentsParsed,
  ) => number | Promise<number>;
}

export interface Token {
  type: string;
  value: string;
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

export interface Process {
  pid: number;
  name: string;
}
