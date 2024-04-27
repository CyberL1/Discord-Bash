import { readdirSync } from "fs";

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
    const commandName = file.split(".js")[0];

    shell.commands.set(commandName, command);
  }
};
