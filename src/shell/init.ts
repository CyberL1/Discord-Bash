import { existsSync, readdirSync } from "fs";
import decompress from "decompress";
import { Shell } from "./classes/Shell.ts";

export default async (shell: Shell) => {
  const eventFiles = readdirSync(`${import.meta.dirname}/events`).filter((f) =>
    f.endsWith(".ts"),
  );

  for (const file of eventFiles) {
    const event = await import(`./events/${file}`);

    if (event.data.once) {
      shell.once(event.data.name, event.run);
    } else {
      shell.on(event.data.name, event.run);
    }
  }

  const commandFiles = readdirSync(`${import.meta.dirname}/commands`).filter(
    (f) => f.endsWith(".ts"),
  );

  for (const file of commandFiles) {
    const { default: command } = await import(`./commands/${file}`);
    shell.cmdRegistry.register(command);
  }

  // Unpack rootfs.zip
  if (!existsSync("filesystem")) {
    console.log("Unpacking rootfs");
    await decompress("rootfs.zip", "filesystem");
    console.log("Unpacking done");
  }
};
