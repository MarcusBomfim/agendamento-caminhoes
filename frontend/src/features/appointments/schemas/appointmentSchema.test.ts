import { describe, expect, it } from "vitest";
import { appointmentSchema } from "./appointmentSchema";

const validAppointment = {
  scheduledDate: "2027-02-18",
  scheduledTime: "09:30",
  estimatedMinutes: "60",
  carrier: "Transporte Atlântico",
  driverId: "driver-1",
  vehicleId: "vehicle-1",
  terminalId: "terminal-1",
  gate: "Portão 2",
  operation: appointmentSchema.shape.operation.options[0],
  containerNumber: "MSCU1234567",
  notes: "Carga liberada para acesso.",
};

describe("appointmentSchema", () => {
  it("aceita um agendamento completo", () => {
    expect(appointmentSchema.safeParse(validAppointment).success).toBe(true);
  });

  it("recusa os relacionamentos obrigatórios vazios", () => {
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      driverId: "",
      vehicleId: "",
      terminalId: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(["driverId", "vehicleId", "terminalId"]),
      );
    }
  });

  it("limita o número do contêiner a 20 caracteres", () => {
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      containerNumber: "A".repeat(21),
    });

    expect(result.success).toBe(false);
  });
});
