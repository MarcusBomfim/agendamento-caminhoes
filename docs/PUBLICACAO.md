# Publicação

## Execução completa com Docker

Pré-requisitos: Docker Desktop e Docker Compose.

Na raiz do projeto:

```powershell
Copy-Item .env.example .env
```

Edite `.env` e defina valores próprios para a senha do PostgreSQL e para `JWT_SECRET`. Depois execute:

```powershell
docker compose up --build
```

Serviços locais:

| Serviço | Endereço |
| --- | --- |
| Interface | `http://localhost:8080` |
| API | `http://localhost:3333` |
| Saúde da API | `http://localhost:3333/api/health` |
| PostgreSQL | `localhost:5432` |

As migrações são aplicadas automaticamente pelo serviço `migrations` antes da API, inclusive quando o volume do PostgreSQL já existe.

No Docker local, `PASSWORD_RESET_EXPOSE_LINK=true` apresenta o link de recuperação diretamente na tela. Isso facilita os testes sem contratar um serviço de e-mail.

## E-mail de recuperação

Para enviar os links por e-mail, configure no arquivo `.env`:

```text
PASSWORD_RESET_EXPOSE_LINK=false
SMTP_HOST=smtp.seuprovedor.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_usuario
SMTP_PASSWORD=sua_senha
SMTP_FROM=Porto Agenda <nao-responda@seudominio.com>
```

Use a porta e a opção de segurança indicadas pelo seu provedor. Em produção, mantenha `PASSWORD_RESET_EXPOSE_LINK=false`, para que o token seja entregue somente pelo e-mail do usuário.

Para encerrar os serviços:

```powershell
docker compose down
```

Esse comando preserva os dados. A remoção do volume só deve ser feita quando a exclusão do banco for intencional.

## Recomendações para produção

- Use HTTPS no front-end e na API.
- Armazene senhas, URL do banco e chave JWT em variáveis secretas da plataforma.
- Armazene também as credenciais SMTP como segredos e nunca as envie ao GitHub.
- Troque o usuário e a senha demonstrativos antes da primeira publicação.
- Crie contas individuais e mantenha a função de administrador apenas para quem gerencia acessos.
- Restrinja `FRONTEND_URL` ao endereço real da interface.
- Ative `DATABASE_SSL=true` quando o provedor PostgreSQL exigir conexão segura.
- Utilize um banco gerenciado com backups automáticos.
- Execute testes e builds antes de liberar uma nova versão.
- Monitore erros, disponibilidade e uso de recursos.

O arquivo `docker-compose.yml` é adequado para desenvolvimento e demonstração. Em produção, o front-end, a API e o banco podem ser publicados separadamente, mantendo as mesmas variáveis de ambiente.
