import "dotenv/config";
import { Client } from "discord.js";
import { readdirSync } from "fs";

const client = new Client({ intents: ["Guilds"] });

const eventFiles = readdirSync(`${import.meta.dirname}/events`).filter((f) =>
	f.endsWith(".js"),
);

for (const file of eventFiles) {
	const event = await import(`./events/${file}`);

	if (event.data.once) {
		client.once(event.data.name, event.run);
	} else {
		client.on(event.data.name, event.run);
	}
}

client.login(process.env.BOT_TOKEN);
