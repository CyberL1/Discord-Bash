import { Collection, Message } from "discord.js";
import { Shell } from "./shell/classes/Shell.ts";
import { Command } from "./shell/types.ts";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>;
    shell: Shell;
  }
}
