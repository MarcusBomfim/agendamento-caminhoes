# API Porto Agenda

URL local: `http://localhost:3333`

As respostas usam JSON. Registros retornados ficam dentro da propriedade `data`. Nesta etapa, os dados são mantidos em memória e reiniciam junto com o servidor.

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
  "scheduledDate": "2026-08-12",
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
- `404`: recurso não encontrado.
- `409`: conflito de horário ou duplicidade.
- `422`: regra de negócio não atendida.
- `500`: erro inesperado.
