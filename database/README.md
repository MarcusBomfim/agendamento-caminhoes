# Banco de dados PostgreSQL

## Criação

```powershell
createdb porto_agenda
psql -d porto_agenda -f migrations/001_initial_schema.sql
psql -d porto_agenda -f migrations/002_seed_data.sql
psql -d porto_agenda -f migrations/003_user_email_index.sql
psql -d porto_agenda -f migrations/004_password_reset.sql
psql -d porto_agenda -f migrations/005_demo_operational_data.sql
psql -d porto_agenda -f migrations/006_secure_seeded_admin.sql
```

Depois, copie `backend/.env.example` para `backend/.env` e ajuste `DATABASE_URL`.

## Acesso inicial

Defina o e-mail e a senha administrativa nas variáveis `DEMO_USER_EMAIL` e `DEMO_USER_PASSWORD`. A sexta migração desativa a credencial histórica da base; ao iniciar, a API grava o hash da senha configurada no ambiente e só então ativa a conta.

O índice da terceira migração impede e-mails duplicados mesmo quando as letras maiúsculas e minúsculas são diferentes. Com Docker Compose, todas as migrações são aplicadas automaticamente antes da inicialização da API.

A quarta migração adiciona a versão das sessões e a tabela de tokens de recuperação. O banco armazena somente o hash de cada token, seu prazo de validade e o momento de utilização.

A quinta migração amplia a base demonstrativa com 10 motoristas, 10 veículos, 7 terminais e 18 agendamentos distribuídos entre o dia anterior, o dia atual e o dia seguinte. Os registros representam todos os estados do fluxo operacional: pendente, confirmado, em pátio, concluído, atrasado e cancelado.

Todos os registros operacionais das migrações são fictícios e existem somente para demonstração.
