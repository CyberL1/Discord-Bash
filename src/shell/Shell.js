import EventEmitter from "events";
import Init from "./init.js";

export const Shell = class extends EventEmitter {
  constructor() {
    super();

    this.commands = new Map();
  }

  async init() {
    await Init(this);
    this.emit("ready", this);
  }

  async run(interaction, command, args) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const cmd = this.commands.get(command);

      interaction.shell = this;
      cmd.run(interaction, args);
    } catch (e) {
      interaction.editReply(`${command}: command not found`);
      console.error(e);
    }
  }
};
