import { readdirSync } from "fs";
import { Shell } from "./Shell.js";

export const shell = new Shell();

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

shell.init();
