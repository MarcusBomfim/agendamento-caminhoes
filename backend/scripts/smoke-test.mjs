import { createServer } from "node:http";
import { handleRequest } from "../dist/app.js";

const server = createServer(handleRequest);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

try {
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Endereço de teste indisponível");
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const [healthResponse, driversResponse, appointmentsResponse] = await Promise.all([
    fetch(`${baseUrl}/api/health`),
    fetch(`${baseUrl}/api/drivers`),
    fetch(`${baseUrl}/api/appointments`),
  ]);

  if (![healthResponse, driversResponse, appointmentsResponse].every((response) => response.ok)) throw new Error("Um endpoint respondeu com erro");
  const health = await healthResponse.json();
  const drivers = await driversResponse.json();
  const appointments = await appointmentsResponse.json();
  const createResponse = await fetch(`${baseUrl}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scheduledDate: "2027-01-15", scheduledTime: "09:00", estimatedMinutes: 45, carrier: "Rota Litoral", driverId: "MOT-001", vehicleId: "VEI-001", terminalId: "TER-001", gate: "Portão 01", operation: "IMPORTAÇÃO", containerNumber: "MSCU1234567", notes: "Teste automatizado" }),
  });
  if (createResponse.status !== 201) throw new Error(`Criação retornou ${createResponse.status}`);
  const created = await createResponse.json();

  const invalidTransitionResponse = await fetch(`${baseUrl}/api/appointments/${created.data.id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "CONCLUÍDO" }),
  });
  if (invalidTransitionResponse.status !== 422) throw new Error("Uma transição inválida foi aceita");

  console.log(JSON.stringify({ health: health.status, service: health.service, drivers: drivers.data.length, appointments: appointments.data.length, createStatus: createResponse.status, businessRuleStatus: invalidTransitionResponse.status }));
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
