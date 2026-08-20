import { createServer } from "node:http";
import { env } from "./config/env.ts";
import { handleRequest } from "./app.ts";
import { closeDatabase } from "./database/client.ts";
import { authService } from "./modules/auth/auth.service.ts";

const server = createServer(handleRequest);

async function start() {
  const securedSeededAdmin = await authService.initializeBootstrapAdmin();
  if (securedSeededAdmin) console.log("Conta administrativa inicial protegida com as credenciais configuradas");
  server.listen(env.PORT, () => {
    console.log(`Porto Agenda API disponível em http://localhost:${env.PORT}`);
  });
}

function shutdown(signal: string) {
  console.log(`Encerrando servidor após ${signal}`);
  server.close(async () => { await closeDatabase(); process.exit(0); });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start().catch(async (error) => {
  console.error("Não foi possível iniciar a API", error);
  await closeDatabase();
  process.exit(1);
});
