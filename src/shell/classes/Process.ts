import type { Process as ProcessType } from "../../types.ts";
import type { ChatInputCommandInteraction } from "discord.js";
import { Shell } from "./Shell.ts";

let PID: number = 0;

export class Process {
  private shell: Shell;
  private process: ProcessType;

  constructor(shell: Shell, process: Omit<ProcessType, "pid">) {
    if (!process.name) {
      throw new Error("Process must have a name");
    }

    this.shell = shell;

    this.process = {
      ...process,
      pid: PID + 1,
    };

    shell.processes.push(this.process);
    PID += 1;
  }

  getPid() {
    return this.process.pid;
  }

  async run(interaction: ChatInputCommandInteraction) {
    let output = "";

    // @ts-ignore
    process.stdout.write = process.stderr.write = (message: string) => {
      output += message;
    };

    const exit = await interaction.client.shell.cmdRegistry.execute(
      interaction,
      this.process.name,
    );

    interaction.editReply(`\`\`\`sh\n${output}\`\`\``);
    this.remove();

    return exit;
  }

  remove() {
    this.shell.processes = this.shell.processes.filter(
      (p) => p.pid != this.process.pid,
    );
  }
}
