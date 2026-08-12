# Banco de dados PostgreSQL

## Criação

```powershell
createdb porto_agenda
psql -d porto_agenda -f migrations/001_initial_schema.sql
psql -d porto_agenda -f migrations/002_seed_data.sql
psql -d porto_agenda -f migrations/003_user_email_index.sql
psql -d porto_agenda -f migrations/004_password_reset.sql
```

Depois, copie `backend/.env.example` para `backend/.env` e ajuste `DATABASE_URL`.

## Acesso inicial

- E-mail: `admin@portoagenda.com`
- Senha: `Porto@123`

Troque essa senha antes de publicar o sistema.

O índice da terceira migração impede e-mails duplicados mesmo quando as letras maiúsculas e minúsculas são diferentes. Com Docker Compose, todas as migrações são aplicadas automaticamente antes da inicialização da API.

A quarta migração adiciona a versão das sessões e a tabela de tokens de recuperação. O banco armazena somente o hash de cada token, seu prazo de validade e o momento de utilização.
