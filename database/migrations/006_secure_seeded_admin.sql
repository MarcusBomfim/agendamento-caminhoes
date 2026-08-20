BEGIN;

-- A conta histórica de demonstração permanece desativada até a API substituir
-- sua senha pelas credenciais fortes definidas no ambiente de execução.
UPDATE users
SET active = FALSE,
    token_version = token_version + 1,
    updated_at = NOW()
WHERE id = 'USR-ADMIN-001'
  AND password_hash = '$2b$12$/4VbPrxq3rNdpCEb6HGqcuoyS8P55ax8TUVuXLi5nQDIRaYDItcSa';

COMMIT;
