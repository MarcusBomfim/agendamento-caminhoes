# Porto Agenda

Sistema full stack para organizar o agendamento e o controle de caminhões em operações portuárias. A aplicação reúne agenda operacional, motoristas, veículos, terminais e usuários em um painel protegido por autenticação e controle de acesso.

## Funcionalidades

- Autenticação de operadores com JWT.
- Cadastro administrativo de usuários e controle de acesso por função.
- Senhas protegidas com hash bcrypt e política de senha forte.
- Recuperação de senha via SMTP ou link local, com token temporário de uso único e revogação das sessões anteriores.
- Limitação de tentativas nas rotas de login e recuperação de senha.
- Validação obrigatória de segredos fortes antes da inicialização em produção.
- Dashboard com indicadores da operação.
- Cadastro, consulta e atualização de agendamentos.
- Gestão de motoristas, veículos e terminais.
- Filtros por data, terminal e situação.
- Validação de horários, documentos, disponibilidade e capacidade do terminal.
- Persistência em PostgreSQL ou modo demonstrativo em memória.
- Base demonstrativa ampliada com 10 motoristas, 10 veículos, 7 terminais e 18 agendamentos em diferentes estados operacionais.
- Testes automatizados no front-end e na API.

Todos os nomes, documentos, telefones, placas, empresas e demais registros incluídos na base demonstrativa são fictícios e destinados exclusivamente à apresentação do sistema.

## Tecnologias

**Front-end:** React 19, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Vitest e Testing Library.

**Back-end:** Node.js 24, TypeScript, PostgreSQL, `pg`, JWT, bcrypt, Zod e Nodemailer.

**Infraestrutura:** Docker Compose, Nginx e GitHub Actions.

## Estrutura

```text
agendamento-caminhoes-portuarios/
├── frontend/             # Interface React
├── backend/              # API e regras de negócio
├── database/migrations/  # Estrutura e dados iniciais do PostgreSQL
├── docs/                 # API, arquitetura e publicação
├── .github/workflows/    # Integração contínua
└── docker-compose.yml    # Aplicação completa em contêineres
```

## Execução local

Pré-requisitos: Node.js 24 ou superior e npm.

```powershell
git clone https://github.com/MarcusBomfim/agendamento-caminhoes.git
cd agendamento-caminhoes
```

### 1. API

```powershell
cd backend
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```

Antes de iniciar, preencha no arquivo `backend/.env` uma `JWT_SECRET` local e uma senha forte em `DEMO_USER_PASSWORD`. O arquivo real `.env` é ignorado pelo Git.

A API ficará disponível em `http://localhost:3333`.

O PostgreSQL é opcional no desenvolvimento. Para executar a API no modo demonstrativo em memória, remova ou deixe `DATABASE_URL` vazia no arquivo `backend/.env`. Para utilizar o banco, configure a conexão e execute:

```powershell
npm.cmd run db:migrate
```

As variáveis relacionadas a JWT, credenciais demonstrativas e recuperação de senha estão documentadas em `backend/.env.example`.

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

Antes do segundo comando, edite `.env` e defina valores inéditos para `POSTGRES_PASSWORD`, `JWT_SECRET` e `DEMO_USER_PASSWORD`. Para gerar uma chave JWT aleatória no PowerShell:

```powershell
[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).ToLower()
```

A senha administrativa deve ter pelo menos 12 caracteres, incluindo letras maiúsculas e minúsculas, número e símbolo. A interface ficará em `http://localhost:8080`, a API em `http://localhost:3333` e o PostgreSQL na porta `5432`. As migrações são aplicadas automaticamente antes da inicialização da API.

## Acesso demonstrativo

O e-mail inicial é definido por `DEMO_USER_EMAIL` e a senha somente por `DEMO_USER_PASSWORD`, no arquivo `.env` local. Nenhuma senha de acesso é publicada no repositório ou exibida na interface.

O usuário histórico da base é desativado pela migração e só volta a ficar ativo depois que a API substitui sua senha pelas credenciais fortes do ambiente. Em produção, links de recuperação nunca são devolvidos pela API; configure SMTP para entregá-los por e-mail.

## Testes e qualidade

A API possui testes de integração para saúde, autenticação, limite de tentativas, autorização administrativa, usuários, recuperação de senha, revogação de sessões, validações e fluxo dos agendamentos:

```powershell
cd backend
npm.cmd run typecheck
npm.cmd test
```

O front-end possui testes para formulários, política de senha, autenticação, redefinição de senha e apresentação dos status:

```powershell
cd ..\frontend
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

O GitHub Actions executa essas verificações automaticamente em atualizações da branch `main` e em pull requests.

Para acompanhar os testes do front-end durante o desenvolvimento, execute `npm.cmd run test:watch` dentro da pasta `frontend`.

## Documentação

- [Arquitetura](docs/ARQUITETURA.md)
- [Endpoints da API](docs/API.md)
- [Banco de dados](database/README.md)
- [Publicação](docs/PUBLICACAO.md)
