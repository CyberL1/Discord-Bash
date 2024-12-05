import type { Command } from "../../types.ts";

export class Arguments {
  private command: Command;

  constructor(command: Command) {
    this.command = command;
  }

  parse(args: string[]) {
    if (!this.command) {
      return;
    }

    const flagsParsed = {};
    const flags = args.filter((a) => a.startsWith("-"));

    if (this.command.flags) {
      for (const [names, properties] of Object.entries(this.command.flags)) {
        for (const name of names.split("|")) {
          const argIndex = args.indexOf(name);
          const [long] = names.split("|");

          if (flags.includes(name)) {
            if (properties.type === "boolean") {
              flagsParsed[long.slice(2)] = flags.includes(name);
            } else {
              flagsParsed[long.slice(2)] = args[argIndex + 1];
              args = args.filter((_a, i) => i != argIndex + 1);
            }
          }
        }
      }
    }

    const argsParsed = {};
    args = args.filter((a) => !a.startsWith("-"));

    if (this.command.args) {
      for (const [name, properties] of Object.entries(this.command.args)) {
        const index = Object.keys(this.command.args).indexOf(name);

        if (properties.required && !args[index]) {
          return name;
        }

        if (properties.infinite) {
          argsParsed[name] = args.slice(index).join(" ");
        } else {
          argsParsed[name] = args[index];
        }
      }
    }

    return { args: argsParsed, flags: flagsParsed };
  }
}
