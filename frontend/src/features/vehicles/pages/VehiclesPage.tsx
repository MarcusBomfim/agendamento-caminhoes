import { zodResolver } from "@hookform/resolvers/zod";
import { Power, RotateCcw, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegistryFieldError, RegistryFormActions, RegistryFormPanel } from "../../registries/components/RegistryFormParts";
import { RegistryPageHeader } from "../../registries/components/RegistryPageHeader";
import { RegistryStatus } from "../../registries/components/RegistryStatus";
import { RegistryToolbar } from "../../registries/components/RegistryToolbar";
import type { VehicleFormValues } from "../../registries/types";
import { normalizeSearch } from "../../registries/utils";
import { useRegistry } from "../../registries/useRegistry";

const vehicleSchema = z.object({
  plate: z.string().trim().min(7, "Informe uma placa válida").max(8, "Informe uma placa válida"),
  type: z.string().min(1, "Selecione o tipo"),
  model: z.string().trim().min(2, "Informe o modelo"),
  carrier: z.string().trim().min(2, "Informe a transportadora"),
  renavam: z.string().trim().min(9, "Informe um RENAVAM válido"),
  capacityTons: z.string().regex(/^\d+([.,]\d+)?$/, "Informe uma capacidade válida"),
});

const defaultValues: VehicleFormValues = { plate: "", type: "", model: "", carrier: "", renavam: "", capacityTons: "" };

export function VehiclesPage() {
  const { vehicles, createVehicle, toggleVehicleStatus } = useRegistry();
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VehicleFormValues>({ resolver: zodResolver(vehicleSchema), defaultValues });

  const filteredVehicles = useMemo(() => {
    const term = normalizeSearch(search);
    return vehicles.filter((vehicle) => normalizeSearch(`${vehicle.plate} ${vehicle.model} ${vehicle.type} ${vehicle.carrier} ${vehicle.renavam}`).includes(term));
  }, [vehicles, search]);

  const closeForm = () => { reset(defaultValues); setFormOpen(false); };
  const submit = (values: VehicleFormValues) => { createVehicle({ ...values, plate: values.plate.toUpperCase(), capacityTons: values.capacityTons.replace(",", ".") }); closeForm(); };

  return (
    <section className="registry-page">
      <RegistryPageHeader eyebrow="CADASTROS" title="Frota de veículos" description="Cadastre placas, tipos de caminhão, transportadoras e documentos da frota." icon={Truck} count={vehicles.length} activeCount={vehicles.filter((item) => item.status !== "INATIVO").length} activeLabel="Veículos habilitados" formOpen={formOpen} onToggleForm={() => formOpen ? closeForm() : setFormOpen(true)} />

      {formOpen && <RegistryFormPanel title="Cadastrar veículo" description="Adicione a identificação e as características operacionais do veículo." onCancel={closeForm}>
        <form onSubmit={handleSubmit(submit)} noValidate><div className="registry-form-grid">
          <label className="registry-field"><span>Placa *</span><input autoFocus placeholder="ABC1D23" {...register("plate")} /><RegistryFieldError message={errors.plate?.message} /></label>
          <label className="registry-field"><span>Tipo *</span><select {...register("type")}><option value="">Selecione</option><option>Cavalo mecânico</option><option>Carreta LS</option><option>Porta-contêiner</option><option>Carreta baú</option><option>Caminhão sider</option></select><RegistryFieldError message={errors.type?.message} /></label>
          <label className="registry-field"><span>Modelo *</span><input placeholder="Ex.: Volvo FH 540" {...register("model")} /><RegistryFieldError message={errors.model?.message} /></label>
          <label className="registry-field registry-field-wide"><span>Transportadora *</span><input {...register("carrier")} /><RegistryFieldError message={errors.carrier?.message} /></label>
          <label className="registry-field"><span>RENAVAM *</span><input {...register("renavam")} /><RegistryFieldError message={errors.renavam?.message} /></label>
          <label className="registry-field"><span>Capacidade (t) *</span><input inputMode="decimal" placeholder="45" {...register("capacityTons")} /><RegistryFieldError message={errors.capacityTons?.message} /></label>
        </div><RegistryFormActions onCancel={closeForm} submitting={isSubmitting} /></form>
      </RegistryFormPanel>}

      <div className="registry-list-card"><RegistryToolbar value={search} onChange={setSearch} placeholder="Pesquisar por placa, modelo, tipo ou transportadora" count={filteredVehicles.length} />
        <div className="registry-table-scroll"><table className="registry-table"><caption className="sr-only">Veículos cadastrados</caption><thead><tr><th>Veículo</th><th>Tipo e capacidade</th><th>Transportadora</th><th>RENAVAM</th><th>Status</th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>
          {filteredVehicles.map((vehicle) => <tr key={vehicle.id}><td><strong className="registry-highlight">{vehicle.plate}</strong><small>{vehicle.model} · {vehicle.id}</small></td><td><strong>{vehicle.type}</strong><small>{vehicle.capacityTons} toneladas</small></td><td><strong>{vehicle.carrier}</strong></td><td><strong>{vehicle.renavam}</strong></td><td><RegistryStatus status={vehicle.status} /></td><td><button className="registry-row-action" type="button" onClick={() => toggleVehicleStatus(vehicle.id)} title={vehicle.status === "INATIVO" ? "Reativar" : "Desativar"}>{vehicle.status === "INATIVO" ? <RotateCcw size={16} /> : <Power size={16} />}</button></td></tr>)}
        </tbody></table>{filteredVehicles.length === 0 && <div className="registry-empty"><Truck size={25} /><strong>Nenhum veículo encontrado</strong><span>Tente pesquisar por outro termo.</span></div>}</div>
      </div>
    </section>
  );
}
