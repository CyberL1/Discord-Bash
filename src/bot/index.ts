import "dotenv/config";
import "../webserver/index.ts";
import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";

const client = new Client({ intents: ["Guilds"] });
client.commands = new Collection();

const eventFiles = readdirSync(`${import.meta.dirname}/events`).filter((f) =>
  f.endsWith(".ts"),
);

for (const file of eventFiles) {
  const event = await import(`./events/${file}`);

  if (event.data.once) {
    client.once(event.data.name, event.run);
  } else {
    client.on(event.data.name, event.run);
  }
}

const commandFiles = readdirSync(`${import.meta.dirname}/commands`).filter(
  (f) => f.endsWith(".ts"),
);

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  const commandName = file.split(".")[0];

  client.commands.set(commandName, command);
}

client.login(process.env.BOT_TOKEN);
