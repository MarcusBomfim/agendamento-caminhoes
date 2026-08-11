BEGIN;

INSERT INTO users (id, name, email, password_hash, role)
VALUES ('USR-ADMIN-001', 'Operador Portuário', 'admin@portoagenda.com', '$2b$12$/4VbPrxq3rNdpCEb6HGqcuoyS8P55ax8TUVuXLi5nQDIRaYDItcSa', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

INSERT INTO drivers (id, name, cpf, cnh, cnh_category, cnh_expires_at, phone, carrier, status) VALUES
  ('MOT-001', 'Carlos Mendes', '48200000011', '04829163740', 'E', '2028-03-18', '(13) 99724-1840', 'Rota Litoral', 'ATIVO'),
  ('MOT-002', 'Marina Souza', '72500000006', '06472819351', 'E', '2027-11-05', '(13) 98851-7204', 'Transmar Logística', 'ATIVO'),
  ('MOT-003', 'Paulo Ribeiro', '19300000042', '05736182940', 'D', '2026-09-22', '(11) 97642-3195', 'Costa Transportes', 'BLOQUEADO')
ON CONFLICT (id) DO NOTHING;

INSERT INTO vehicles (id, plate, type, model, carrier, renavam, capacity_tons, status) VALUES
  ('VEI-001', 'BRA2E19', 'Cavalo mecânico', 'Volvo FH 540', 'Rota Litoral', '01482936175', 45, 'DISPONÍVEL'),
  ('VEI-002', 'FRT7A42', 'Carreta LS', 'Scania R450', 'Transmar Logística', '01372649580', 48, 'EM_OPERAÇÃO'),
  ('VEI-003', 'GHT4B88', 'Porta-contêiner', 'Mercedes Actros', 'Costa Transportes', '01263847591', 42, 'MANUTENÇÃO')
ON CONFLICT (id) DO NOTHING;

INSERT INTO terminals (id, name, code, location, gates, opening_time, closing_time, hourly_capacity, status) VALUES
  ('TER-001', 'Terminal Atlântico', 'TATL', 'Margem Direita — Santos', 4, '06:00', '23:00', 18, 'OPERACIONAL'),
  ('TER-002', 'Pátio Alemoa', 'PALE', 'Alemoa — Santos', 3, '05:00', '22:00', 14, 'OPERACIONAL'),
  ('TER-003', 'Terminal Guarujá', 'TGUA', 'Margem Esquerda — Guarujá', 2, '07:00', '21:00', 10, 'RESTRITO')
ON CONFLICT (id) DO NOTHING;

COMMIT;
