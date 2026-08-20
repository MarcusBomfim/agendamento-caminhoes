import { zodResolver } from "@hookform/resolvers/zod";
import { Power, RotateCcw, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegistryFieldError, RegistryFormActions, RegistryFormPanel } from "../../registries/components/RegistryFormParts";
import { RegistryPageHeader } from "../../registries/components/RegistryPageHeader";
import { RegistryStatus } from "../../registries/components/RegistryStatus";
import { RegistryToolbar } from "../../registries/components/RegistryToolbar";
import type { DriverFormValues } from "../../registries/types";
import { formatRegistryDate, normalizeSearch } from "../../registries/utils";
import { useRegistry } from "../../registries/useRegistry";
import { useAuth } from "../../auth/useAuth";

const driverSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome completo"),
  cpf: z.string().trim().min(11, "Informe um CPF válido"),
  cnh: z.string().trim().min(9, "Informe o número da CNH"),
  cnhCategory: z.string().min(1, "Selecione a categoria"),
  cnhExpiresAt: z.string().min(1, "Informe a validade"),
  phone: z.string().trim().min(10, "Informe um telefone válido"),
  carrier: z.string().trim().min(2, "Informe a transportadora"),
});

const defaultValues: DriverFormValues = { name: "", cpf: "", cnh: "", cnhCategory: "", cnhExpiresAt: "", phone: "", carrier: "" };

export function DriversPage() {
  const { user } = useAuth();
  const canEdit = user?.role !== "VIEWER";
  const { drivers, isLoading, error, createDriver, toggleDriverStatus } = useRegistry();
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DriverFormValues>({ resolver: zodResolver(driverSchema), defaultValues });

  const filteredDrivers = useMemo(() => {
    const term = normalizeSearch(search);
    return drivers.filter((driver) => normalizeSearch(`${driver.name} ${driver.cpf} ${driver.cnh} ${driver.carrier}`).includes(term));
  }, [drivers, search]);

  const closeForm = () => { reset(defaultValues); setFormOpen(false); };
  const submit = async (values: DriverFormValues) => { await createDriver(values); closeForm(); };

  return (
    <section className="registry-page">
      <RegistryPageHeader eyebrow="CADASTROS" title="Motoristas autorizados" description={canEdit ? "Mantenha documentos, contatos e situação dos motoristas atualizados." : "Consulte os motoristas e suas informações operacionais."} icon={UsersRound} count={drivers.length} activeCount={drivers.filter((item) => item.status === "ATIVO").length} activeLabel="Motoristas ativos" formOpen={formOpen} onToggleForm={() => formOpen ? closeForm() : setFormOpen(true)} readOnly={!canEdit} />
      {isLoading && <div className="api-state-banner">Carregando motoristas da API...</div>}{error && <div className="api-state-banner is-error">{error}</div>}

      {canEdit && formOpen && <RegistryFormPanel title="Cadastrar motorista" description="Preencha os dados pessoais e a habilitação do profissional." onCancel={closeForm}>
        <form onSubmit={handleSubmit(submit)} noValidate><div className="registry-form-grid">
          <label className="registry-field registry-field-wide"><span>Nome completo *</span><input autoFocus {...register("name")} /><RegistryFieldError message={errors.name?.message} /></label>
          <label className="registry-field"><span>CPF *</span><input placeholder="000.000.000-00" {...register("cpf")} /><RegistryFieldError message={errors.cpf?.message} /></label>
          <label className="registry-field"><span>CNH *</span><input {...register("cnh")} /><RegistryFieldError message={errors.cnh?.message} /></label>
          <label className="registry-field"><span>Categoria *</span><select {...register("cnhCategory")}><option value="">Selecione</option><option>D</option><option>E</option></select><RegistryFieldError message={errors.cnhCategory?.message} /></label>
          <label className="registry-field"><span>Validade da CNH *</span><input type="date" {...register("cnhExpiresAt")} /><RegistryFieldError message={errors.cnhExpiresAt?.message} /></label>
          <label className="registry-field"><span>Telefone *</span><input placeholder="(13) 99999-9999" {...register("phone")} /><RegistryFieldError message={errors.phone?.message} /></label>
          <label className="registry-field registry-field-wide"><span>Transportadora *</span><input {...register("carrier")} /><RegistryFieldError message={errors.carrier?.message} /></label>
        </div><RegistryFormActions onCancel={closeForm} submitting={isSubmitting} /></form>
      </RegistryFormPanel>}

      <div className="registry-list-card"><RegistryToolbar value={search} onChange={setSearch} placeholder="Pesquisar por nome, CPF, CNH ou transportadora" count={filteredDrivers.length} />
        <div className="registry-table-scroll"><table className="registry-table"><caption className="sr-only">Motoristas cadastrados</caption><thead><tr><th>Motorista</th><th>Documentos</th><th>Contato</th><th>Transportadora</th><th>Status</th>{canEdit && <th><span className="sr-only">Ações</span></th>}</tr></thead><tbody>
          {filteredDrivers.map((driver) => <tr key={driver.id}><td><strong>{driver.name}</strong><small>{driver.id}</small></td><td><strong>CNH {driver.cnh} · {driver.cnhCategory}</strong><small>Validade {formatRegistryDate(driver.cnhExpiresAt)} · {driver.cpf}</small></td><td><strong>{driver.phone}</strong></td><td><strong>{driver.carrier}</strong></td><td><RegistryStatus status={driver.status} /></td>{canEdit && <td><button className="registry-row-action" type="button" onClick={() => toggleDriverStatus(driver.id)} title={driver.status === "ATIVO" ? "Desativar" : "Reativar"}>{driver.status === "ATIVO" ? <Power size={16} /> : <RotateCcw size={16} />}</button></td>}</tr>)}
        </tbody></table>{filteredDrivers.length === 0 && <div className="registry-empty"><UsersRound size={25} /><strong>Nenhum motorista encontrado</strong><span>Tente pesquisar por outro termo.</span></div>}</div>
      </div>
    </section>
  );
}
