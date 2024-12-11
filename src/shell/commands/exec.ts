import type { Command } from "../../types.ts";
import { platform } from "os";
import { execSync } from "child_process";

const command: Command = {
  name: "exec",
  description: "Executes a command on the host and returns the result",
  args: {
    cmd: { help: "The command to execute", required: true, infinite: true },
  },

  run: async (interaction, { args: { cmd } }) => {
    const { env } = interaction.client.shell.users.get(interaction.user.id);
    const cwd = interaction.client.shell.fs.from(env.PWD);

    let command = `/bin/bash -c '${cmd}'`;
    if (platform() === "win32") {
      command = `wsl /bin/bash -c '${cmd}'`;
    }

    try {
      const result = execSync(command, { cwd });
      console.log(result.toString());

      return 0;
    } catch (error) {
      return error.status;
    }
  },
};

export default command;
