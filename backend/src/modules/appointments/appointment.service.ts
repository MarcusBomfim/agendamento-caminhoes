import { AppError } from "../../shared/errors/AppError.ts";
import { createId } from "../../shared/utils/createId.ts";
import { registryRepository } from "../registries/registry.repository.ts";
import { appointmentRepository } from "./appointment.repository.ts";
import type { Appointment, AppointmentFilters, AppointmentStatus, NewAppointment } from "./appointment.types.ts";

const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = { PENDENTE: ["CONFIRMADO", "CANCELADO"], CONFIRMADO: ["EM_PÁTIO", "ATRASADO", "CANCELADO"], ATRASADO: ["EM_PÁTIO", "CANCELADO"], EM_PÁTIO: ["CONCLUÍDO"], CONCLUÍDO: [], CANCELADO: [] };
const scheduleStart = (item: Pick<Appointment, "scheduledDate" | "scheduledTime">) => new Date(`${item.scheduledDate}T${item.scheduledTime}:00`);
function overlaps(first: Appointment, input: NewAppointment) { const firstStart = scheduleStart(first).getTime(); const firstEnd = firstStart + first.estimatedMinutes * 60_000; const nextStart = scheduleStart(input).getTime(); const nextEnd = nextStart + input.estimatedMinutes * 60_000; return firstStart < nextEnd && nextStart < firstEnd; }

export class AppointmentService {
  list(filters: AppointmentFilters) { return appointmentRepository.list(filters); }
  async findById(id: string) { const appointment = await appointmentRepository.findById(id); if (!appointment) throw new AppError(404, "Agendamento não encontrado"); return appointment; }

  async create(input: NewAppointment, createdBy?: string) {
    const [driver, vehicle, terminal] = await Promise.all([registryRepository.findDriver(input.driverId), registryRepository.findVehicle(input.vehicleId), registryRepository.findTerminal(input.terminalId)]);
    if (!driver) throw new AppError(404, "Motorista não encontrado");
    if (!vehicle) throw new AppError(404, "Veículo não encontrado");
    if (!terminal) throw new AppError(404, "Terminal não encontrado");
    if (driver.status !== "ATIVO") throw new AppError(422, "Motorista não está autorizado para agendamento");
    if (driver.cnhExpiresAt < input.scheduledDate) throw new AppError(422, "A CNH estará vencida na data do agendamento");
    if (["MANUTENÇÃO", "INATIVO"].includes(vehicle.status)) throw new AppError(422, "Veículo indisponível para agendamento");
    if (terminal.status === "INATIVO") throw new AppError(422, "Terminal está inativo");
    if (scheduleStart(input).getTime() <= Date.now()) throw new AppError(422, "A janela deve ser agendada para uma data futura");
    const endMinutes = Number(input.scheduledTime.slice(0, 2)) * 60 + Number(input.scheduledTime.slice(3)) + input.estimatedMinutes;
    const closingMinutes = Number(terminal.closingTime.slice(0, 2)) * 60 + Number(terminal.closingTime.slice(3));
    if (input.scheduledTime < terminal.openingTime || endMinutes > closingMinutes) throw new AppError(422, "A janela está fora do horário de funcionamento do terminal");
    const gateNumber = Number(input.gate.match(/\d+/)?.[0]);
    if (!gateNumber || gateNumber > terminal.gates) throw new AppError(422, "Portão inválido para o terminal selecionado");
    const active = (await appointmentRepository.list()).filter((item) => !["CANCELADO", "CONCLUÍDO"].includes(item.status));
    if (active.some((item) => (item.driverId === input.driverId || item.vehicleId === input.vehicleId) && overlaps(item, input))) throw new AppError(409, "Motorista ou veículo já possui agendamento nesse intervalo");
    const hour = input.scheduledTime.slice(0, 2);
    if (active.filter((item) => item.terminalId === input.terminalId && item.scheduledDate === input.scheduledDate && item.scheduledTime.startsWith(hour)).length >= terminal.hourlyCapacity) throw new AppError(409, "Capacidade horária do terminal atingida");
    return appointmentRepository.create(createId("PA"), input, createdBy);
  }

  async updateStatus(id: string, status: AppointmentStatus) { const appointment = await this.findById(id); if (!allowedTransitions[appointment.status].includes(status)) throw new AppError(422, `Transição de ${appointment.status} para ${status} não permitida`); return appointmentRepository.updateStatus(id, status); }
}

export const appointmentService = new AppointmentService();
