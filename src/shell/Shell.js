import EventEmitter from "events";

export const Shell = class extends EventEmitter {
  constructor() {
    super();
  }

  init() {
    console.log("Shell initializing");
    this.emit("ready", this);
  }
};
