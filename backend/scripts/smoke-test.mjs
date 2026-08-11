import { createServer } from "node:http";
import { handleRequest } from "../dist/app.js";

const server = createServer(handleRequest);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

try {
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Endereço de teste indisponível");
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const healthResponse = await fetch(`${baseUrl}/api/health`);
  const loginResponse = await fetch(`${baseUrl}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "admin@portoagenda.com", password: "Porto@123" }) });
  if (!healthResponse.ok || !loginResponse.ok) throw new Error("Saúde ou autenticação respondeu com erro");
  const health = await healthResponse.json();
  const session = await loginResponse.json();
  const authorizedHeaders = { Authorization: `Bearer ${session.data.token}` };
  const [driversResponse, appointmentsResponse, meResponse] = await Promise.all([fetch(`${baseUrl}/api/drivers`, { headers: authorizedHeaders }), fetch(`${baseUrl}/api/appointments`, { headers: authorizedHeaders }), fetch(`${baseUrl}/api/auth/me`, { headers: authorizedHeaders })]);
  if (![driversResponse, appointmentsResponse, meResponse].every((response) => response.ok)) throw new Error("Um endpoint protegido respondeu com erro");
  const drivers = await driversResponse.json();
  const appointments = await appointmentsResponse.json();
  const me = await meResponse.json();
  const createResponse = await fetch(`${baseUrl}/api/appointments`, { method: "POST", headers: { ...authorizedHeaders, "Content-Type": "application/json" }, body: JSON.stringify({ scheduledDate: "2027-01-15", scheduledTime: "09:00", estimatedMinutes: 45, carrier: "Rota Litoral", driverId: "MOT-001", vehicleId: "VEI-001", terminalId: "TER-001", gate: "Portão 01", operation: "IMPORTAÇÃO", containerNumber: "MSCU1234567", notes: "Teste automatizado" }) });
  if (createResponse.status !== 201) throw new Error(`Criação retornou ${createResponse.status}`);
  const created = await createResponse.json();
  const invalidTransitionResponse = await fetch(`${baseUrl}/api/appointments/${created.data.id}/status`, { method: "PATCH", headers: { ...authorizedHeaders, "Content-Type": "application/json" }, body: JSON.stringify({ status: "CONCLUÍDO" }) });
  if (invalidTransitionResponse.status !== 422) throw new Error("Uma transição inválida foi aceita");
  const unauthorizedResponse = await fetch(`${baseUrl}/api/drivers`);
  if (unauthorizedResponse.status !== 401) throw new Error("Uma rota protegida aceitou acesso anônimo");
  console.log(JSON.stringify({ health: health.status, user: me.data.email, drivers: drivers.data.length, appointments: appointments.data.length, createStatus: createResponse.status, businessRuleStatus: invalidTransitionResponse.status, unauthorizedStatus: unauthorizedResponse.status }));
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
