import EventEmitter from "events";
import Init from "./init.js";
import dotnev from "dotenv";

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
    interaction.user.env = {
      RESPONSE_TYPE: "private",
      HOME: `/home/${interaction.user.id}`,
    };

    await interaction.deferReply({
      ephemeral: interaction.user.env.RESPONSE_TYPE === "private",
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

  fromVfs(path) {
    return `${import.meta.dirname}/../../filesystem/${path}`;
  }

  getConfig(userId) {
    const config = dotnev.config({
      override: true,
      path: this.fromVfs(`/home/${userId}/.shellcfg`),
    });

    return config;
  }
};
