import { Navigate, Route, Routes } from "react-router";

interface TemporaryPageProps {
  title: string;
  description: string;
}

function TemporaryPage({ title, description }: TemporaryPageProps) {
  return (
    <main className="temporary-page">
      <span>PORTO AGENDA</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </main>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <TemporaryPage
            title="Acesso ao sistema"
            description="Esta página receberá o formulário de autenticação."
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <TemporaryPage
            title="Dashboard"
            description="Visão geral das operações e dos agendamentos."
          />
        }
      />
      <Route
        path="/agendamentos"
        element={
          <TemporaryPage
            title="Agendamentos"
            description="Consulta e gerenciamento dos horários agendados."
          />
        }
      />
      <Route
        path="/agendamentos/novo"
        element={
          <TemporaryPage
            title="Novo agendamento"
            description="Cadastro de uma nova operação portuária."
          />
        }
      />
      <Route
        path="/motoristas"
        element={
          <TemporaryPage
            title="Motoristas"
            description="Cadastro e consulta de motoristas."
          />
        }
      />
      <Route
        path="/veiculos"
        element={
          <TemporaryPage
            title="Veículos"
            description="Cadastro e consulta de caminhões."
          />
        }
      />
      <Route
        path="/terminais"
        element={
          <TemporaryPage
            title="Terminais"
            description="Configuração de terminais, portões e horários."
          />
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

