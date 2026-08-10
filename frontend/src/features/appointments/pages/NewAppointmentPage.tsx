import { AppointmentForm } from "../components/AppointmentForm";

export function NewAppointmentPage() {
  return (
    <section className="new-appointment-page">
      <div className="new-appointment-heading">
        <span>NOVA OPERAÇÃO</span>
        <h2>Agende a entrada de um caminhão</h2>
        <p>Informe os dados da janela, do transporte e da operação portuária.</p>
      </div>
      <div className="form-progress" aria-label="Etapas do formulário">
        <span className="is-active"><b>1</b> Janela</span><i /><span className="is-active"><b>2</b> Transporte</span><i /><span><b>3</b> Confirmação</span>
      </div>
      <AppointmentForm />
    </section>
  );
}
