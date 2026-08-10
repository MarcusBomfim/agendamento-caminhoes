import { z } from "zod";

const requiredText = (message: string) => z.string().trim().min(1, message);

export const appointmentSchema = z.object({
  scheduledDate: requiredText("Informe a data do agendamento."),
  scheduledTime: requiredText("Informe o horário."),
  estimatedMinutes: z.enum(["30", "45", "60", "90"]),
  carrier: requiredText("Selecione a transportadora."),
  driver: requiredText("Selecione o motorista."),
  vehiclePlate: requiredText("Selecione o veículo."),
  terminal: requiredText("Selecione o terminal."),
  gate: requiredText("Selecione o portão."),
  operation: z.enum(["IMPORTAÇÃO", "EXPORTAÇÃO"]),
  containerNumber: z.string().trim().max(20, "Use no máximo 20 caracteres."),
  notes: z.string().trim().max(300, "Use no máximo 300 caracteres."),
});

