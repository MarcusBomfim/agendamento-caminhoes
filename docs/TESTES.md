# Testes

## API

```powershell
cd backend
npm.cmd test
```

A suíte inicia a API em uma porta temporária e verifica saúde, autenticação, proteção das rotas, listagens, validação dos cadastros e fluxo de status dos agendamentos.

Para verificar somente os tipos:

```powershell
npm.cmd run typecheck
```

## Front-end

```powershell
cd frontend
npm.cmd test
```

Os testes cobrem a validação do formulário de agendamento, o envio do formulário de acesso e a apresentação dos status.

Modo de acompanhamento durante o desenvolvimento:

```powershell
npm.cmd run test:watch
```

Verificação completa:

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

## Integração contínua

O fluxo `.github/workflows/ci.yml` executa os testes, a análise estática e o build em cada pull request e em atualizações da branch `main`.
