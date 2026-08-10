import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CalendarCheck2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { carrierOptions, driverOptions, gateOptions, terminalOptions, vehicleOptions } from "../data";
import { appointmentSchema } from "../schemas/appointmentSchema";
import type { AppointmentFormValues } from "../types";
import { useAppointments } from "../useAppointments";

function FieldError({ message }: { message?: string }) {
  return message ? <span className="field-error">{message}</span> : null;
}

export function AppointmentForm() {
  const navigate = useNavigate();
  const { createAppointment } = useAppointments();
  const today = new Date().toISOString().slice(0, 10);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { scheduledDate: today, scheduledTime: "08:00", estimatedMinutes: "45", carrier: "", driver: "", vehiclePlate: "", terminal: "", gate: "", operation: "IMPORTAÇÃO", containerNumber: "", notes: "" },
  });

  const submit = (values: AppointmentFormValues) => {
    const appointment = createAppointment(values);
    navigate("/agendamentos", { state: { createdId: appointment.id } });
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit(submit)} noValidate>
      <section className="form-section"><header><span><CalendarCheck2 size={20} /></span><div><h3>Janela de atendimento</h3><p>Defina quando e onde o caminhão será recebido.</p></div></header><div className="form-grid">
        <label className="form-field"><span>Data *</span><input type="date" min={today} {...register("scheduledDate")} /><FieldError message={errors.scheduledDate?.message} /></label>
        <label className="form-field"><span>Horário *</span><input type="time" {...register("scheduledTime")} /><FieldError message={errors.scheduledTime?.message} /></label>
        <label className="form-field"><span>Duração estimada *</span><select {...register("estimatedMinutes")}><option value="30">30 minutos</option><option value="45">45 minutos</option><option value="60">60 minutos</option><option value="90">90 minutos</option></select><FieldError message={errors.estimatedMinutes?.message} /></label>
        <label className="form-field"><span>Terminal *</span><select {...register("terminal")}><option value="">Selecione</option>{terminalOptions.map((option) => <option key={option}>{option}</option>)}</select><FieldError message={errors.terminal?.message} /></label>
        <label className="form-field"><span>Portão *</span><select {...register("gate")}><option value="">Selecione</option>{gateOptions.map((option) => <option key={option}>{option}</option>)}</select><FieldError message={errors.gate?.message} /></label>
        <label className="form-field"><span>Tipo de operação *</span><select {...register("operation")}><option value="IMPORTAÇÃO">Importação</option><option value="EXPORTAÇÃO">Exportação</option></select><FieldError message={errors.operation?.message} /></label>
      </div></section>

      <section className="form-section"><header><span className="section-number">02</span><div><h3>Transporte</h3><p>Vincule a empresa, o motorista e o veículo.</p></div></header><div className="form-grid">
        <label className="form-field"><span>Transportadora *</span><select {...register("carrier")}><option value="">Selecione</option>{carrierOptions.map((option) => <option key={option}>{option}</option>)}</select><FieldError message={errors.carrier?.message} /></label>
        <label className="form-field"><span>Motorista *</span><select {...register("driver")}><option value="">Selecione</option>{driverOptions.map((option) => <option key={option}>{option}</option>)}</select><FieldError message={errors.driver?.message} /></label>
        <label className="form-field"><span>Veículo *</span><select {...register("vehiclePlate")}><option value="">Selecione</option>{vehicleOptions.map((option) => <option key={option}>{option}</option>)}</select><FieldError message={errors.vehiclePlate?.message} /></label>
        <label className="form-field"><span>Número do contêiner</span><input placeholder="Ex.: MSCU1234567" {...register("containerNumber")} /><FieldError message={errors.containerNumber?.message} /></label>
        <label className="form-field form-field-wide"><span>Observações</span><textarea rows={4} placeholder="Informações relevantes para a operação" {...register("notes")} /><FieldError message={errors.notes?.message} /></label>
      </div></section>

      <footer className="form-actions"><Link to="/agendamentos"><ArrowLeft size={17} /> Cancelar</Link><button type="submit" disabled={isSubmitting}><Save size={17} /> Salvar agendamento</button></footer>
    </form>
  );
}

