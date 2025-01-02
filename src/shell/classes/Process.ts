import type { Process as ProcessType } from "../../types.ts";
import type { ChatInputCommandInteraction } from "discord.js";
import { Shell } from "./Shell.ts";
import { writeFileSync } from "fs";
import { join } from "path";

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

    const outputForDiscord = `\`\`\`sh\n${output}\`\`\``;

    if (outputForDiscord.length > 2000) {
      const filesRoot = join(
        import.meta.dirname,
        "..",
        "..",
        "webserver",
        "files",
      );

      const fileName = Date.now().toString();
      writeFileSync(join(filesRoot, fileName), output);

      interaction.editReply(
        `Output was too large for discord, find it here instead: ${process.env.WEBSERVER_URL}/${fileName}`,
      );
      return;
    }

    interaction.editReply(outputForDiscord);
    this.remove();

    return exit;
  }

  remove() {
    this.shell.processes = this.shell.processes.filter(
      (p) => p.pid != this.process.pid,
    );
  }
}
