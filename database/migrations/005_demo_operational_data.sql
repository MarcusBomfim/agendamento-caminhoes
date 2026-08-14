BEGIN;

INSERT INTO drivers (id, name, cpf, cnh, cnh_category, cnh_expires_at, phone, carrier, status) VALUES
  ('MOT-004', 'André Lima', '91400000028', '07361529482', 'E', '2029-01-14', '(13) 99102-8843', 'Eixo Sul Cargas', 'ATIVO'),
  ('MOT-005', 'Juliana Alves', '35600000070', '05928471630', 'D', '2027-06-30', '(13) 99617-4521', 'Navega Log', 'INATIVO'),
  ('MOT-006', 'Renato Oliveira', '60400000035', '08146372950', 'E', '2029-08-11', '(13) 99245-6318', 'Atlas Rodoviário', 'ATIVO'),
  ('MOT-007', 'Fernanda Costa', '23800000064', '09275163840', 'E', '2028-12-02', '(11) 97831-4406', 'Baixada Cargas', 'ATIVO'),
  ('MOT-008', 'Lucas Barreto', '87100000009', '06819452730', 'D', '2027-10-19', '(13) 98720-3159', 'Porto Sul', 'ATIVO'),
  ('MOT-009', 'Patrícia Gomes', '14500000093', '07520941683', 'E', '2030-02-25', '(13) 99564-8021', 'Santos Express', 'ATIVO'),
  ('MOT-010', 'Diego Martins', '52900000047', '08734629150', 'E', '2029-05-07', '(11) 97418-5260', 'Transmar Logística', 'ATIVO')
ON CONFLICT (id) DO NOTHING;

INSERT INTO vehicles (id, plate, type, model, carrier, renavam, capacity_tons, status) VALUES
  ('VEI-004', 'KPL9C31', 'Cavalo mecânico', 'DAF XF 530', 'Eixo Sul Cargas', '01583726409', 46, 'DISPONÍVEL'),
  ('VEI-005', 'QWE5D70', 'Carreta baú', 'Iveco S-Way', 'Navega Log', '01192837465', 40, 'INATIVO'),
  ('VEI-006', 'LMN3F21', 'Porta-contêiner', 'Volkswagen Meteor 29.520', 'Atlas Rodoviário', '01630495827', 44, 'EM_OPERAÇÃO'),
  ('VEI-007', 'RST8G64', 'Carreta sider', 'Volvo FH 460', 'Baixada Cargas', '01749263018', 43, 'DISPONÍVEL'),
  ('VEI-008', 'UVW1H92', 'Bitrem graneleiro', 'Scania G 410', 'Porto Sul', '01857392046', 57, 'MANUTENÇÃO'),
  ('VEI-009', 'XYZ6J35', 'Porta-contêiner', 'Mercedes Axor 2544', 'Santos Express', '01962840537', 45, 'DISPONÍVEL'),
  ('VEI-010', 'BCD4K78', 'Carreta prancha', 'DAF CF 450', 'Rota Litoral', '01074951628', 50, 'INATIVO')
ON CONFLICT (id) DO NOTHING;

INSERT INTO terminals (id, name, code, location, gates, opening_time, closing_time, hourly_capacity, status) VALUES
  ('TER-004', 'Terminal Saboó', 'TSAB', 'Cais do Saboó — Santos', 6, '05:00', '23:30', 28, 'OPERACIONAL'),
  ('TER-005', 'Pátio Cubatão', 'PCUB', 'Distrito Industrial — Cubatão', 5, '04:30', '22:30', 24, 'OPERACIONAL'),
  ('TER-006', 'Terminal Conceiçãozinha', 'TCON', 'Vicente de Carvalho — Guarujá', 3, '06:30', '20:30', 12, 'RESTRITO'),
  ('TER-007', 'Base Logística Anchieta', 'BANC', 'Rodovia Anchieta — Santos', 2, '07:00', '19:00', 8, 'INATIVO')
ON CONFLICT (id) DO NOTHING;

INSERT INTO appointments (
  id, scheduled_date, scheduled_time, estimated_minutes, carrier,
  driver_id, vehicle_id, terminal_id, gate, operation,
  container_number, status, notes, created_by
) VALUES
  ('PA-DEMO-101', CURRENT_DATE, '07:00', 45, 'Rota Litoral', 'MOT-001', 'VEI-001', 'TER-001', 'Portão 01', 'IMPORTAÇÃO', 'MSCU1234567', 'CONCLUÍDO', 'Descarga concluída sem ocorrências', 'USR-ADMIN-001'),
  ('PA-DEMO-102', CURRENT_DATE, '07:30', 45, 'Transmar Logística', 'MOT-002', 'VEI-002', 'TER-002', 'Portão 02', 'EXPORTAÇÃO', 'TCLU7654321', 'CONCLUÍDO', 'Lacre conferido na saída', 'USR-ADMIN-001'),
  ('PA-DEMO-103', CURRENT_DATE, '08:00', 45, 'Eixo Sul Cargas', 'MOT-004', 'VEI-004', 'TER-004', 'Portão 04', 'IMPORTAÇÃO', 'HLCU4829156', 'EM_PÁTIO', 'Aguardando direcionamento para a doca', 'USR-ADMIN-001'),
  ('PA-DEMO-104', CURRENT_DATE, '08:20', 60, 'Atlas Rodoviário', 'MOT-006', 'VEI-006', 'TER-001', 'Portão 03', 'EXPORTAÇÃO', 'MAEU7319042', 'CONFIRMADO', 'Carga refrigerada', 'USR-ADMIN-001'),
  ('PA-DEMO-105', CURRENT_DATE, '09:00', 45, 'Baixada Cargas', 'MOT-007', 'VEI-007', 'TER-005', 'Portão 02', 'IMPORTAÇÃO', 'CMAU6942180', 'ATRASADO', 'Atraso informado na Rodovia Anchieta', 'USR-ADMIN-001'),
  ('PA-DEMO-106', CURRENT_DATE, '09:30', 30, 'Porto Sul', 'MOT-008', 'VEI-009', 'TER-006', 'Portão 01', 'EXPORTAÇÃO', 'MEDU5183274', 'PENDENTE', 'Aguardando validação documental', 'USR-ADMIN-001'),
  ('PA-DEMO-107', CURRENT_DATE, '10:15', 45, 'Santos Express', 'MOT-009', 'VEI-001', 'TER-003', 'Portão 02', 'IMPORTAÇÃO', 'COSU8402519', 'CONFIRMADO', '', 'USR-ADMIN-001'),
  ('PA-DEMO-108', CURRENT_DATE, '11:00', 60, 'Transmar Logística', 'MOT-010', 'VEI-006', 'TER-004', 'Portão 05', 'EXPORTAÇÃO', 'ONEU3629741', 'EM_PÁTIO', 'Check-in realizado', 'USR-ADMIN-001'),
  ('PA-DEMO-109', CURRENT_DATE, '12:30', 45, 'Rota Litoral', 'MOT-001', 'VEI-007', 'TER-002', 'Portão 03', 'IMPORTAÇÃO', 'MSCU9083175', 'PENDENTE', 'Conferência de autorização pendente', 'USR-ADMIN-001'),
  ('PA-DEMO-110', CURRENT_DATE, '14:00', 45, 'Transmar Logística', 'MOT-002', 'VEI-002', 'TER-005', 'Portão 04', 'EXPORTAÇÃO', 'TGHU2476108', 'CONFIRMADO', '', 'USR-ADMIN-001'),
  ('PA-DEMO-111', CURRENT_DATE, '15:30', 30, 'Porto Sul', 'MOT-004', 'VEI-008', 'TER-006', 'Portão 02', 'IMPORTAÇÃO', 'CAIU1736904', 'CANCELADO', 'Cancelado após indisponibilidade mecânica', 'USR-ADMIN-001'),
  ('PA-DEMO-112', CURRENT_DATE, '17:00', 45, 'Atlas Rodoviário', 'MOT-006', 'VEI-009', 'TER-001', 'Portão 04', 'EXPORTAÇÃO', 'SEGU5942817', 'CONCLUÍDO', 'Operação antecipada pela equipe do terminal', 'USR-ADMIN-001'),
  ('PA-DEMO-113', CURRENT_DATE + 1, '08:00', 45, 'Eixo Sul Cargas', 'MOT-004', 'VEI-004', 'TER-004', 'Portão 01', 'EXPORTAÇÃO', 'TEMU4638291', 'PENDENTE', '', 'USR-ADMIN-001'),
  ('PA-DEMO-114', CURRENT_DATE + 1, '09:15', 60, 'Baixada Cargas', 'MOT-007', 'VEI-007', 'TER-005', 'Portão 03', 'IMPORTAÇÃO', 'OOLU8251463', 'CONFIRMADO', 'Necessário pesagem na entrada', 'USR-ADMIN-001'),
  ('PA-DEMO-115', CURRENT_DATE + 1, '10:45', 45, 'Santos Express', 'MOT-009', 'VEI-009', 'TER-003', 'Portão 01', 'EXPORTAÇÃO', 'TRHU6103972', 'PENDENTE', '', 'USR-ADMIN-001'),
  ('PA-DEMO-116', CURRENT_DATE + 1, '13:30', 45, 'Transmar Logística', 'MOT-010', 'VEI-006', 'TER-004', 'Portão 06', 'IMPORTAÇÃO', 'FCIU2947851', 'CONFIRMADO', '', 'USR-ADMIN-001'),
  ('PA-DEMO-117', CURRENT_DATE - 1, '16:00', 45, 'Rota Litoral', 'MOT-001', 'VEI-001', 'TER-001', 'Portão 02', 'IMPORTAÇÃO', 'MSCU7412580', 'CONCLUÍDO', 'Operação finalizada no prazo', 'USR-ADMIN-001'),
  ('PA-DEMO-118', CURRENT_DATE - 1, '17:30', 30, 'Navega Log', 'MOT-005', 'VEI-005', 'TER-002', 'Portão 01', 'EXPORTAÇÃO', '', 'CANCELADO', 'Cadastro inativo no momento do check-in', 'USR-ADMIN-001')
ON CONFLICT (id) DO NOTHING;

COMMIT;
