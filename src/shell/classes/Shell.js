import EventEmitter from "events";
import Init from "../init.js";
import { Filesystem } from "./Filesystem.js";
import { Users } from "./Users.js";

export class Shell extends EventEmitter {
  constructor() {
    super();

    this.commands = new Map();
  }

  async init() {
    await Init(this);
    this.emit("ready", this);
  }

  async run(interaction, command, args) {
    if (!this.users.exists(interaction.user.id)) {
      return interaction.reply("You don not have an account in the system, do `/create-user` to create an account");
    }

    interaction.shelluser = this.users.get(interaction.user.id);

    await interaction.deferReply({
      ephemeral: interaction.shelluser.config.RESPONSE_TYPE === "private",
    });

    try {
      const cmd = this.commands.get(command);

      interaction.shell = this;
      cmd.run(interaction, args);
    } catch (e) {
      interaction.editReply(`${command}: command not found`);
      console.error(e);
    }
  }

  fs = new Filesystem(this);
  users = new Users(this);
}
