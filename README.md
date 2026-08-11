# Porto Agenda

Sistema full stack para organizar o agendamento e o controle de caminhões em operações portuárias. A aplicação reúne agenda operacional, motoristas, veículos e terminais em um painel protegido por autenticação.

## Funcionalidades

- Autenticação de operadores com JWT.
- Dashboard com indicadores da operação.
- Cadastro, consulta e atualização de agendamentos.
- Gestão de motoristas, veículos e terminais.
- Filtros por data, terminal e situação.
- Validação de horários, documentos, disponibilidade e capacidade do terminal.
- Persistência em PostgreSQL ou modo demonstrativo em memória.
- Testes automatizados no front-end e na API.

## Tecnologias

**Front-end:** React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod e Vitest.

**Back-end:** Node.js, TypeScript, PostgreSQL, `pg`, JWT, bcrypt e Zod.

**Infraestrutura:** Docker Compose, Nginx e GitHub Actions.

## Estrutura

```text
agendamento-caminhoes-portuarios/
├── frontend/             # Interface React
├── backend/              # API e regras de negócio
├── database/migrations/  # Estrutura e dados iniciais do PostgreSQL
├── docs/                 # Documentação técnica
├── .github/workflows/    # Integração contínua
└── docker-compose.yml    # Aplicação completa em contêineres
```

## Execução local

Pré-requisitos: Node.js 24 ou superior e npm.

### 1. API

```powershell
cd backend
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```

A API ficará disponível em `http://localhost:3333`.

O PostgreSQL é opcional no desenvolvimento. Sem `DATABASE_URL`, a API usa dados temporários em memória. Para utilizar o banco, configure a conexão no arquivo `backend/.env` e execute:

```powershell
npm.cmd run db:migrate
```

### 2. Front-end

Em outro terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Acesse `http://localhost:5173`.

## Execução com Docker

Com Docker Desktop instalado:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

A interface ficará em `http://localhost:8080`, a API em `http://localhost:3333` e o PostgreSQL na porta `5432`.

## Acesso demonstrativo

- E-mail: `admin@portoagenda.com`
- Senha: `Porto@123`

Essas credenciais devem ser alteradas antes de uma publicação real.

## Qualidade

```powershell
cd backend
npm.cmd run typecheck
npm.cmd test

cd ..\frontend
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

O GitHub Actions executa essas verificações automaticamente em atualizações da branch `main` e em pull requests.

## Documentação

- [Arquitetura](docs/ARQUITETURA.md)
- [Endpoints da API](docs/API.md)
- [Banco de dados](database/README.md)
- [Testes](docs/TESTES.md)
- [Publicação](docs/PUBLICACAO.md)
- [Etapas do desenvolvimento](docs/ETAPAS.md)
