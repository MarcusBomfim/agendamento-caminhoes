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

As migrações são executadas automaticamente pelo contêiner do PostgreSQL na criação inicial do volume.

Para encerrar os serviços:

```powershell
docker compose down
```

Esse comando preserva os dados. A remoção do volume só deve ser feita quando a exclusão do banco for intencional.

## Recomendações para produção

- Use HTTPS no front-end e na API.
- Armazene senhas, URL do banco e chave JWT em variáveis secretas da plataforma.
- Troque o usuário e a senha demonstrativos antes da primeira publicação.
- Restrinja `FRONTEND_URL` ao endereço real da interface.
- Ative `DATABASE_SSL=true` quando o provedor PostgreSQL exigir conexão segura.
- Utilize um banco gerenciado com backups automáticos.
- Execute testes e builds antes de liberar uma nova versão.
- Monitore erros, disponibilidade e uso de recursos.

O arquivo `docker-compose.yml` é adequado para desenvolvimento e demonstração. Em produção, o front-end, a API e o banco podem ser publicados separadamente, mantendo as mesmas variáveis de ambiente.
