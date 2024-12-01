import EventEmitter from "events";
import Init from "../init.js";
import { Filesystem } from "./Filesystem.js";
import { Users } from "./Users.js";
import { CommandRegistry } from "./CommandRegistry.js";

export class Shell extends EventEmitter {
  constructor() {
    super();

    this.cmdRegistry = new CommandRegistry();
  }

  async init() {
    await Init(this);
    this.emit("ready", this);
  }

  async run(interaction, command) {
    if (!this.users.exists(interaction.user.id)) {
      return interaction.reply(
        "You don not have an account in the system, do `/create-user` to create an account",
      );
    }

    interaction.shelluser = this.users.get(interaction.user.id);
    interaction.shell = this;

    this.cmdRegistry.execute(interaction, command);
  }

  fs = new Filesystem(this);
  users = new Users(this);
}
