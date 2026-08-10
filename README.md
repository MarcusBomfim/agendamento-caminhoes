# Porto Agenda

Sistema full stack para agendamento e controle de caminhões em operações portuárias.

## Estrutura

```text
agendamento-caminhoes-portuarios/
├── frontend/       # React, TypeScript e Vite
├── backend/        # API Node.js e TypeScript
├── database/       # Scripts do PostgreSQL
└── docs/           # Regras e acompanhamento das etapas
```

O projeto está sendo desenvolvido de forma incremental. Consulte `docs/ETAPAS.md` para acompanhar o progresso.

## Front-end

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

## API

```powershell
cd backend
npm.cmd install
npm.cmd run dev
```

A API utiliza por padrão `http://localhost:3333`. As configurações disponíveis estão documentadas em `backend/.env.example`.

## Regras implementadas

- Motoristas precisam estar ativos e com a CNH válida.
- Veículos em manutenção ou inativos não podem ser agendados.
- A janela deve respeitar o horário e os portões do terminal.
- Motoristas e veículos não podem ter horários conflitantes.
- A capacidade horária de cada terminal é respeitada.
- Alterações de status seguem um fluxo operacional controlado.

Consulte `docs/API.md` para conhecer os endpoints.
