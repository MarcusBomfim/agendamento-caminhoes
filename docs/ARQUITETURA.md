# Arquitetura

## Visão geral

```text
Navegador
   │
   ▼
React + TanStack Query
   │ HTTP/JSON + JWT
   ▼
API Node.js + regras de negócio
   │
   ▼
PostgreSQL
```

O front-end cuida da navegação, dos formulários, dos estados de carregamento e da apresentação dos dados. Toda operação persistente passa pela API, que valida a entrada, aplica as regras operacionais e acessa os repositórios.

## Front-end

O código é organizado por funcionalidades em `frontend/src/features`. Cada área reúne páginas, componentes, tipos e validações relacionados ao mesmo domínio. As chamadas HTTP ficam em `frontend/src/services`, enquanto os componentes compartilhados ficam em `frontend/src/components`.

- React Router controla as rotas públicas e protegidas.
- TanStack Query gerencia cache, carregamento e atualização dos dados da API.
- React Hook Form e Zod controlam os formulários e suas validações.
- O token de acesso fica no armazenamento local e é enviado no cabeçalho `Authorization`.

## API

A API está organizada em módulos dentro de `backend/src/modules`. Cada módulo separa rotas, validação, serviço, repositório e tipos conforme sua responsabilidade.

- Zod valida variáveis de ambiente e dados recebidos.
- JWT identifica a sessão do operador.
- bcrypt gera e compara hashes de senha com fator de custo 12 nos novos cadastros, sem armazenar a senha original.
- A camada de serviço aplica conflitos de agenda, validade da CNH, situação do veículo, capacidade do terminal e transições de status.
- O cadastro e a gestão de usuários exigem função `ADMIN`, verificada novamente no servidor.

## Dados

Com `DATABASE_URL` configurada, os repositórios usam PostgreSQL. As migrações em `database/migrations` criam as tabelas, restrições, índices e os dados iniciais.

Sem uma conexão configurada, o sistema usa repositórios em memória. Esse modo facilita demonstrações locais, mas os dados são apagados ao reiniciar a API.

## Autenticação

1. O operador envia e-mail e senha para `/api/auth/login`.
2. A API verifica a senha e devolve um JWT com tempo de expiração.
3. O front-end envia o token nas rotas protegidas.
4. A API valida assinatura e expiração antes de liberar o recurso.
5. Uma resposta `401` encerra a sessão inválida no navegador.

## Proteção das senhas

As senhas não são criptografadas de forma reversível. Antes de salvar um novo usuário, a API aplica bcrypt com um salt individual e armazena somente o hash. No login, bcrypt compara a senha informada com esse hash. Assim, nem a interface nem os endpoints administrativos recebem a senha armazenada.

A validação exige no mínimo 10 caracteres, letras maiúscula e minúscula, número e caractere especial. O limite de 72 bytes evita o truncamento silencioso característico do bcrypt.

## Recuperação de senha

1. O usuário informa o e-mail sem receber confirmação sobre a existência da conta.
2. A API gera 32 bytes aleatórios e envia o token somente no link de recuperação.
3. O PostgreSQL armazena apenas o hash SHA-256 do token, com validade de 30 minutos.
4. Na redefinição, o token é consumido de forma atômica e não pode ser reutilizado.
5. A nova senha recebe hash bcrypt e a versão de sessão do usuário é incrementada, invalidando JWTs anteriores.

Solicitações repetidas têm intervalo mínimo configurável. O envio por e-mail utiliza SMTP quando configurado; somente ambientes locais podem expor o link diretamente para facilitar testes.
