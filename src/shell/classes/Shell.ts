import EventEmitter from "events";
import Init from "#shell/init.ts";
import { Filesystem } from "./Filesystem.ts";
import { Users } from "./Users.ts";
import { CommandRegistry } from "./CommandRegistry.ts";
import { ChatInputCommandInteraction } from "discord.js";
import { Process } from "./Process.ts";
import type { Process as ProcessType } from "#shell/types.ts";

export class Shell extends EventEmitter {
  cmdRegistry: CommandRegistry;

  constructor() {
    super();

    this.cmdRegistry = new CommandRegistry();
  }

  async init() {
    await Init(this);
    this.emit("ready", this);
  }

  async run(interaction: ChatInputCommandInteraction, command: string) {
    if (!this.users.exists(interaction.user.id)) {
      return interaction.reply(
        "You do not have an account in the system, do `/create-user` to create an account",
      );
    }

    new Process(this, { name: command }).run(interaction);
  }

  fs = new Filesystem();
  users = new Users(this);
  processes: ProcessType[] = [];
}
