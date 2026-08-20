# Publicação

## Execução completa com Docker

Pré-requisitos: Docker Desktop e Docker Compose.

Na raiz do projeto:

```powershell
Copy-Item .env.example .env
```

Edite `.env` e defina valores próprios para `POSTGRES_PASSWORD`, `JWT_SECRET` e `DEMO_USER_PASSWORD`. A aplicação recusa a inicialização em produção quando encontra valores ausentes, previsíveis ou fracos. Depois execute:

```powershell
docker compose up --build
```

Para disponibilizar a demonstração somente leitura do portfólio, mantenha `DEMO_VISITOR_ENABLED=true`. Esse modo não revela a senha administrativa e bloqueia operações de escrita no servidor. Use `false` quando não quiser oferecer acesso público.

Serviços locais:

| Serviço | Endereço |
| --- | --- |
| Interface | `http://localhost:8080` |
| API | `http://localhost:3333` |
| Saúde da API | `http://localhost:3333/api/health` |
| PostgreSQL | `localhost:5432` |

As migrações são aplicadas automaticamente pelo serviço `migrations` antes da API, inclusive quando o volume do PostgreSQL já existe.

O Docker executa a API em modo de produção e mantém `PASSWORD_RESET_EXPOSE_LINK=false`. Dessa forma, tokens de redefinição não aparecem na resposta da API nem na interface.

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

Use a porta e a opção de segurança indicadas pelo seu provedor. Em produção, `PASSWORD_RESET_EXPOSE_LINK=true` é rejeitado pela validação de segurança, para que o token seja entregue somente pelo e-mail do usuário.

Para encerrar os serviços:

```powershell
docker compose down
```

Esse comando preserva os dados. A remoção do volume só deve ser feita quando a exclusão do banco for intencional.

## Recomendações para produção

- Use HTTPS no front-end e na API.
- Armazene senhas, URL do banco e chave JWT em variáveis secretas da plataforma.
- Armazene também as credenciais SMTP como segredos e nunca as envie ao GitHub.
- Use uma senha administrativa inédita, com pelo menos 12 caracteres, letras maiúsculas e minúsculas, número e símbolo.
- Crie contas individuais e mantenha a função de administrador apenas para quem gerencia acessos.
- Restrinja `FRONTEND_URL` ao endereço real da interface.
- Ative `DATABASE_SSL=true` quando o provedor PostgreSQL exigir conexão segura e mantenha `DATABASE_SSL_REJECT_UNAUTHORIZED=true`.
- Só ative `TRUST_PROXY=true` quando a API estiver realmente atrás de um proxy confiável que substitui o cabeçalho `X-Forwarded-For`.
- Utilize um banco gerenciado com backups automáticos.
- Execute testes e builds antes de liberar uma nova versão.
- Monitore erros, disponibilidade e uso de recursos.

O arquivo `docker-compose.yml` é adequado para desenvolvimento e demonstração. Em produção, o front-end, a API e o banco podem ser publicados separadamente, mantendo as mesmas variáveis de ambiente.
