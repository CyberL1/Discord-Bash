import { readdirSync } from "fs";

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
  import("../../shell/index.js");
};

export const data = {
  name: "ready",
  once: true,
};
