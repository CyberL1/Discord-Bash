import { existsSync, readdirSync } from "fs";
import decompress from "decompress";

export default async (shell) => {
  const eventFiles = readdirSync(`${import.meta.dirname}/events`).filter((f) =>
    f.endsWith(".js"),
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
    (f) => f.endsWith(".js"),
  );

  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    shell.cmdRegistry.register(command);
  }

  // Unpack rootfs.zip

  if (!existsSync("filesysytem")) {
    console.log("Unpacking rootfs");
    await decompress("rootfs.zip", "filesystem");
    console.log("Unpacking done");
  }
};
