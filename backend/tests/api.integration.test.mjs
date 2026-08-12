import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import { handleRequest } from "../dist/app.js";

let server;
let baseUrl;
let token;

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  return { response, body };
}

before(async () => {
  server = createServer(handleRequest);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
  const login = await request("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "admin@portoagenda.com", password: "Porto@123" }) });
  token = login.body.data.token;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

const authorizedHeaders = (accessToken = token) => ({ Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" });

test("expõe o endpoint público de saúde", async () => {
  const { response, body } = await request("/api/health");
  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
});

test("recusa credenciais inválidas", async () => {
  const { response } = await request("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "admin@portoagenda.com", password: "senha-incorreta" }) });
  assert.equal(response.status, 401);
});

test("protege os dados operacionais", async () => {
  const anonymous = await request("/api/drivers");
  assert.equal(anonymous.response.status, 401);
  const anonymousUsers = await request("/api/users");
  assert.equal(anonymousUsers.response.status, 401);
  const authenticated = await request("/api/auth/me", { headers: authorizedHeaders() });
  assert.equal(authenticated.response.status, 200);
  assert.equal(authenticated.body.data.email, "admin@portoagenda.com");
});

test("cadastra usuários com senha protegida e restringe a administração", async () => {
  const weakPassword = await request("/api/users", {
    method: "POST",
    headers: authorizedHeaders(),
    body: JSON.stringify({ name: "Senha Fraca", email: "fraco@portoagenda.com", password: "senhafraca", role: "OPERATOR" }),
  });
  assert.equal(weakPassword.response.status, 400);

  const created = await request("/api/users", {
    method: "POST",
    headers: authorizedHeaders(),
    body: JSON.stringify({ name: "Novo Operador", email: "novo.operador@portoagenda.com", password: "Operador@2027", role: "OPERATOR" }),
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.data.email, "novo.operador@portoagenda.com");
  assert.equal(created.body.data.active, true);
  assert.equal("password" in created.body.data, false);
  assert.equal("passwordHash" in created.body.data, false);

  const duplicate = await request("/api/users", {
    method: "POST",
    headers: authorizedHeaders(),
    body: JSON.stringify({ name: "E-mail Repetido", email: "NOVO.OPERADOR@PORTOAGENDA.COM", password: "Operador@2028", role: "OPERATOR" }),
  });
  assert.equal(duplicate.response.status, 409);

  const operatorLogin = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "novo.operador@portoagenda.com", password: "Operador@2027" }),
  });
  assert.equal(operatorLogin.response.status, 200);
  const operatorToken = operatorLogin.body.data.token;

  const forbidden = await request("/api/users", { headers: authorizedHeaders(operatorToken) });
  assert.equal(forbidden.response.status, 403);

  const disabled = await request(`/api/users/${created.body.data.id}/status`, {
    method: "PATCH",
    headers: authorizedHeaders(),
    body: JSON.stringify({ active: false }),
  });
  assert.equal(disabled.response.status, 200);
  assert.equal(disabled.body.data.active, false);

  const disabledSession = await request("/api/drivers", { headers: authorizedHeaders(operatorToken) });
  assert.equal(disabledSession.response.status, 401);
});

test("impede que o administrador desative a própria conta", async () => {
  const me = await request("/api/auth/me", { headers: authorizedHeaders() });
  const response = await request(`/api/users/${me.body.data.id}/status`, {
    method: "PATCH",
    headers: authorizedHeaders(),
    body: JSON.stringify({ active: false }),
  });
  assert.equal(response.response.status, 422);
});

test("redefine a senha com token temporário de uso único", async () => {
  const created = await request("/api/users", {
    method: "POST",
    headers: authorizedHeaders(),
    body: JSON.stringify({ name: "Operador Recuperação", email: "recuperacao@portoagenda.com", password: "SenhaAntiga@2027", role: "OPERATOR" }),
  });
  assert.equal(created.response.status, 201);

  const previousLogin = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "recuperacao@portoagenda.com", password: "SenhaAntiga@2027" }),
  });
  assert.equal(previousLogin.response.status, 200);

  const unknownEmail = await request("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "nao-existe@portoagenda.com" }),
  });
  assert.equal(unknownEmail.response.status, 200);
  assert.match(unknownEmail.body.data.message, /Se o e-mail estiver cadastrado/);

  const recovery = await request("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "recuperacao@portoagenda.com" }),
  });
  assert.equal(recovery.response.status, 200);
  const resetUrl = new URL(recovery.body.data.resetUrl);
  const resetToken = resetUrl.searchParams.get("token");
  assert.equal(resetToken?.length, 64);

  const weakPassword = await request("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: resetToken, password: "senhafraca" }),
  });
  assert.equal(weakPassword.response.status, 400);

  const reset = await request("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: resetToken, password: "SenhaNova@2028" }),
  });
  assert.equal(reset.response.status, 200);

  const reused = await request("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: resetToken, password: "OutraSenha@2029" }),
  });
  assert.equal(reused.response.status, 400);

  const previousSession = await request("/api/drivers", { headers: authorizedHeaders(previousLogin.body.data.token) });
  assert.equal(previousSession.response.status, 401);

  const oldPassword = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "recuperacao@portoagenda.com", password: "SenhaAntiga@2027" }),
  });
  assert.equal(oldPassword.response.status, 401);

  const newPassword = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "recuperacao@portoagenda.com", password: "SenhaNova@2028" }),
  });
  assert.equal(newPassword.response.status, 200);
});

test("lista os cadastros iniciais", async () => {
  const [drivers, vehicles, terminals] = await Promise.all([
    request("/api/drivers", { headers: authorizedHeaders() }),
    request("/api/vehicles", { headers: authorizedHeaders() }),
    request("/api/terminals", { headers: authorizedHeaders() }),
  ]);
  assert.equal(drivers.response.status, 200);
  assert.ok(drivers.body.data.length >= 3);
  assert.ok(vehicles.body.data.length >= 3);
  assert.ok(terminals.body.data.length >= 3);
});

test("impede motorista duplicado", async () => {
  const duplicate = await request("/api/drivers", { method: "POST", headers: authorizedHeaders(), body: JSON.stringify({ name: "Motorista Duplicado", cpf: "48200000011", cnh: "99999999999", cnhCategory: "E", cnhExpiresAt: "2028-10-10", phone: "(13) 99999-9999", carrier: "Rota Litoral" }) });
  assert.equal(duplicate.response.status, 409);
});

test("valida os dados de novos veículos", async () => {
  const invalid = await request("/api/vehicles", { method: "POST", headers: authorizedHeaders(), body: JSON.stringify({ plate: "A", type: "Carreta", model: "Teste", carrier: "Teste", renavam: "1", capacityTons: -2 }) });
  assert.equal(invalid.response.status, 400);
  assert.equal(invalid.body.error, "Dados inválidos");
});

test("cria agendamento e aplica o fluxo de status", async () => {
  const created = await request("/api/appointments", { method: "POST", headers: authorizedHeaders(), body: JSON.stringify({ scheduledDate: "2027-02-18", scheduledTime: "14:00", estimatedMinutes: 45, carrier: "Rota Litoral", driverId: "MOT-001", vehicleId: "VEI-001", terminalId: "TER-001", gate: "Portão 01", operation: "EXPORTAÇÃO", containerNumber: "MSCU7654321", notes: "Teste de integração" }) });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.data.status, "PENDENTE");
  const invalidTransition = await request(`/api/appointments/${created.body.data.id}/status`, { method: "PATCH", headers: authorizedHeaders(), body: JSON.stringify({ status: "CONCLUÍDO" }) });
  assert.equal(invalidTransition.response.status, 422);
  const confirmed = await request(`/api/appointments/${created.body.data.id}/status`, { method: "PATCH", headers: authorizedHeaders(), body: JSON.stringify({ status: "CONFIRMADO" }) });
  assert.equal(confirmed.response.status, 200);
  assert.equal(confirmed.body.data.status, "CONFIRMADO");
});
