import { createServer } from "node:http";
import { env } from "./config/env.ts";
import { handleRequest } from "./app.ts";

const server = createServer(handleRequest);

server.listen(env.PORT, () => {
  console.log(`Porto Agenda API disponível em http://localhost:${env.PORT}`);
});

function shutdown(signal: string) {
  console.log(`Encerrando servidor após ${signal}`);
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
