import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("apresenta o texto e a classe do status confirmado", () => {
    render(<StatusBadge status="CONFIRMADO" />);

    const badge = screen.getByText("Confirmado");
    expect(badge).toHaveClass("appointment-status-confirmed");
  });
});
