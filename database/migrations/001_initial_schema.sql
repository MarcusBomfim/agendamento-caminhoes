BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'OPERATOR' CHECK (role IN ('ADMIN', 'OPERATOR')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  cpf VARCHAR(20) NOT NULL UNIQUE,
  cnh VARCHAR(20) NOT NULL UNIQUE,
  cnh_category VARCHAR(2) NOT NULL CHECK (cnh_category IN ('D', 'E')),
  cnh_expires_at DATE NOT NULL,
  phone VARCHAR(30) NOT NULL,
  carrier VARCHAR(120) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO', 'BLOQUEADO')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id VARCHAR(40) PRIMARY KEY,
  plate VARCHAR(10) NOT NULL UNIQUE,
  type VARCHAR(80) NOT NULL,
  model VARCHAR(100) NOT NULL,
  carrier VARCHAR(120) NOT NULL,
  renavam VARCHAR(20) NOT NULL UNIQUE,
  capacity_tons NUMERIC(6,2) NOT NULL CHECK (capacity_tons > 0),
  status VARCHAR(30) NOT NULL DEFAULT 'DISPONÍVEL' CHECK (status IN ('DISPONÍVEL', 'EM_OPERAÇÃO', 'MANUTENÇÃO', 'INATIVO')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS terminals (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  location VARCHAR(180) NOT NULL,
  gates INTEGER NOT NULL CHECK (gates > 0),
  opening_time TIME NOT NULL,
  closing_time TIME NOT NULL,
  hourly_capacity INTEGER NOT NULL CHECK (hourly_capacity > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'OPERACIONAL' CHECK (status IN ('OPERACIONAL', 'RESTRITO', 'INATIVO')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (opening_time < closing_time)
);

CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(40) PRIMARY KEY,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  estimated_minutes INTEGER NOT NULL CHECK (estimated_minutes BETWEEN 15 AND 180),
  carrier VARCHAR(120) NOT NULL,
  driver_id VARCHAR(40) NOT NULL REFERENCES drivers(id),
  vehicle_id VARCHAR(40) NOT NULL REFERENCES vehicles(id),
  terminal_id VARCHAR(40) NOT NULL REFERENCES terminals(id),
  gate VARCHAR(30) NOT NULL,
  operation VARCHAR(20) NOT NULL CHECK (operation IN ('IMPORTAÇÃO', 'EXPORTAÇÃO')),
  container_number VARCHAR(20) NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'CONFIRMADO', 'EM_PÁTIO', 'CONCLUÍDO', 'ATRASADO', 'CANCELADO')),
  notes VARCHAR(300) NOT NULL DEFAULT '',
  created_by VARCHAR(40) REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS appointments_schedule_idx ON appointments (scheduled_date, scheduled_time);
CREATE INDEX IF NOT EXISTS appointments_driver_idx ON appointments (driver_id, scheduled_date);
CREATE INDEX IF NOT EXISTS appointments_vehicle_idx ON appointments (vehicle_id, scheduled_date);
CREATE INDEX IF NOT EXISTS appointments_terminal_idx ON appointments (terminal_id, scheduled_date);

COMMIT;
