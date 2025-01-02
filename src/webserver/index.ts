import fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

const filesDirPath = join(import.meta.dirname, "files");

process.env.WEBSERVER_PORT ??= "3000";
process.env.WEBSERVER_HOST ??= "localhost";
process.env.WEBSERVER_URL ??= `http://${process.env.WEBSERVER_HOST}:${process.env.WEBSERVER_PORT}`;

const app = fastify();

if (!existsSync(filesDirPath)) {
  mkdirSync(filesDirPath);
}

app.get("/", (_req, reply: FastifyReply) => {
  const files = readdirSync(filesDirPath);

  reply.header("content-type", "text/html");
  return files.map((file) => `<a href="/${file}">${file}</a>`).join("<br>");
});

app.get(
  "/:file",
  (req: FastifyRequest<{ Params: { file: string } }>, reply: FastifyReply) => {
    const filePath = join(filesDirPath, req.params.file);

    if (!existsSync(filePath)) {
      reply.code(404);
      return "File not found";
    }

    reply.header("content-type", "text/plain");
    return readFileSync(filePath);
  },
);

try {
  await app.listen({
    port: Number(process.env.WEBSERVER_PORT),
    host: process.env.WEBSERVER_HOST,
  });

  console.log("Webserver accessible at", process.env.WEBSERVER_URL);
} catch (err) {
  console.error(err);
  process.exit(1);
}
