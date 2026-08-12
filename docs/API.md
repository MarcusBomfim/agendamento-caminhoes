# API Porto Agenda

URL local: `http://localhost:3333`

As respostas usam JSON e os registros retornados ficam dentro da propriedade `data`.

Quando `DATABASE_URL` está configurada, motoristas, veículos, terminais, usuários e agendamentos são persistidos no PostgreSQL. Sem ela, a API utiliza o modo demonstrativo em memória.

## Autenticação

| Método | Endpoint | Descrição |
| --- | --- | --- |
| POST | `/api/auth/login` | Autentica o operador e retorna o token |
| GET | `/api/auth/me` | Retorna o usuário da sessão |
| POST | `/api/auth/forgot-password` | Solicita um link temporário de recuperação |
| POST | `/api/auth/reset-password` | Redefine a senha usando o token recebido |

Envie o token nas rotas protegidas:

```text
Authorization: Bearer SEU_TOKEN
```

### Recuperação de senha

Solicitação:

```json
{
  "email": "operador@portoagenda.com"
}
```

A resposta é a mesma para e-mails cadastrados e não cadastrados. Isso evita que terceiros descubram quais contas existem no sistema.

Redefinição:

```json
{
  "token": "TOKEN_RECEBIDO_NO_LINK",
  "password": "NovaSenha@2028"
}
```

O token expira, pode ser utilizado uma única vez e é salvo no banco somente como hash SHA-256. Depois da alteração, sessões anteriores do usuário são revogadas.

## Usuários

Essas rotas exigem uma sessão com função `ADMIN`.

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/api/users` | Lista os usuários sem retornar senhas ou hashes |
| POST | `/api/users` | Cadastra um usuário |
| PATCH | `/api/users/:id/status` | Ativa ou desativa um usuário |

### Exemplo de cadastro

```json
{
  "name": "Novo Operador",
  "email": "operador@portoagenda.com",
  "password": "Operador@2027",
  "role": "OPERATOR"
}
```

A senha deve ter pelo menos 10 caracteres, com letras maiúscula e minúscula, número e caractere especial. A API transforma a senha em hash bcrypt antes da persistência e nunca devolve o hash nas respostas.

### Exemplo de login

```json
{
  "email": "admin@portoagenda.com",
  "password": "Porto@123"
}
```

## Saúde da aplicação

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/api/health` | Confirma que a API está funcionando |

## Agendamentos

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/api/appointments` | Lista os agendamentos |
| GET | `/api/appointments/:id` | Consulta um agendamento |
| POST | `/api/appointments` | Cria um agendamento |
| PATCH | `/api/appointments/:id/status` | Altera o status |

Filtros disponíveis na listagem: `status`, `date` e `terminalId`.

### Exemplo de criação

```json
{
  "scheduledDate": "2027-02-18",
  "scheduledTime": "09:00",
  "estimatedMinutes": 45,
  "carrier": "Rota Litoral",
  "driverId": "MOT-001",
  "vehicleId": "VEI-001",
  "terminalId": "TER-001",
  "gate": "Portão 01",
  "operation": "IMPORTAÇÃO",
  "containerNumber": "MSCU1234567",
  "notes": ""
}
```

### Fluxo de status

```text
PENDENTE -> CONFIRMADO -> EM_PÁTIO -> CONCLUÍDO
                         ↘ ATRASADO -> EM_PÁTIO

PENDENTE, CONFIRMADO ou ATRASADO -> CANCELADO
```

## Motoristas

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/api/drivers` | Lista motoristas |
| POST | `/api/drivers` | Cadastra um motorista |
| PATCH | `/api/drivers/:id/status` | Altera a situação |

## Veículos

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/api/vehicles` | Lista veículos |
| POST | `/api/vehicles` | Cadastra um veículo |
| PATCH | `/api/vehicles/:id/status` | Altera a situação |

## Terminais

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/api/terminals` | Lista terminais |
| POST | `/api/terminals` | Cadastra um terminal |
| PATCH | `/api/terminals/:id/status` | Altera a situação |

## Códigos de resposta

- `200`: operação concluída.
- `201`: registro criado.
- `400`: dados enviados são inválidos.
- `401`: autenticação ausente, inválida ou expirada.
- `403`: usuário autenticado sem permissão para o recurso.
- `404`: recurso não encontrado.
- `409`: conflito de horário ou duplicidade.
- `422`: regra de negócio não atendida.
- `500`: erro inesperado.
