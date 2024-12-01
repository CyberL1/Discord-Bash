import { Collection, Message } from "discord.js";
import { Shell } from "./src/shell/classes/Shell.ts";
import { Command } from "./src/types.ts";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>;
    shell: Shell;
  }
}
