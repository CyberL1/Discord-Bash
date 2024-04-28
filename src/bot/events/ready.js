import { readdirSync } from "fs";
import { Shell } from "../../shell/classes/Shell.js";

export const run = async (client) => {
  if ((await client.application.commands.fetch()).size == 0) {
    const commandFiles = readdirSync(
      `${import.meta.dirname}/../commands`,
    ).filter((f) => f.endsWith(".js"));

    const commands = [];

    for (const file of commandFiles) {
      const command = await import(`../commands/${file}`);
      commands.push(command.data.toJSON());
    }

    client.application.commands.set(commands);
    console.log("Commands set");
  }

  console.log(`${client.user.username} ready`);

  client.shell = new Shell();
  client.shell.init();
};

export const data = {
  name: "ready",
  once: true,
};