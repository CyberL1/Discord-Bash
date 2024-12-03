import type { Command } from "../../types.ts";

export class Arguments {
  private command: Command;

  constructor(command: Command) {
    this.command = command;
  }

  parse(args: string[]) {
    const argsParsed = {};

    for (const [name, properties] of Object.entries(this.command.args)) {
      const index = Object.keys(this.command.args).indexOf(name);

      if (properties.infinite) {
        argsParsed[name] = args.slice(index).join(" ");
      } else {
        argsParsed[name] = args[index];
      }
    }

    return argsParsed;
  }
}
