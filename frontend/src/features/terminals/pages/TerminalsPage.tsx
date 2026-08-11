import { zodResolver } from "@hookform/resolvers/zod";
import { Clock3, Gauge, MapPin, Power, RotateCcw, Warehouse } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegistryFieldError, RegistryFormActions, RegistryFormPanel } from "../../registries/components/RegistryFormParts";
import { RegistryPageHeader } from "../../registries/components/RegistryPageHeader";
import { RegistryStatus } from "../../registries/components/RegistryStatus";
import { RegistryToolbar } from "../../registries/components/RegistryToolbar";
import type { TerminalFormValues } from "../../registries/types";
import { normalizeSearch } from "../../registries/utils";
import { useRegistry } from "../../registries/useRegistry";

const terminalSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome do terminal"),
  code: z.string().trim().min(3, "Informe o código operacional").max(6, "Use no máximo 6 caracteres"),
  location: z.string().trim().min(5, "Informe a localização"),
  gates: z.string().regex(/^\d+$/, "Informe a quantidade de portões"),
  openingTime: z.string().min(1, "Informe a abertura"),
  closingTime: z.string().min(1, "Informe o fechamento"),
  hourlyCapacity: z.string().regex(/^\d+$/, "Informe a capacidade por hora"),
});

const defaultValues: TerminalFormValues = { name: "", code: "", location: "", gates: "", openingTime: "06:00", closingTime: "22:00", hourlyCapacity: "" };

export function TerminalsPage() {
  const { terminals, isLoading, error, createTerminal, toggleTerminalStatus } = useRegistry();
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TerminalFormValues>({ resolver: zodResolver(terminalSchema), defaultValues });

  const filteredTerminals = useMemo(() => {
    const term = normalizeSearch(search);
    return terminals.filter((terminal) => normalizeSearch(`${terminal.name} ${terminal.code} ${terminal.location}`).includes(term));
  }, [terminals, search]);

  const closeForm = () => { reset(defaultValues); setFormOpen(false); };
  const submit = async (values: TerminalFormValues) => { await createTerminal({ ...values, code: values.code.toUpperCase() }); closeForm(); };

  return (
    <section className="registry-page">
      <RegistryPageHeader eyebrow="CONFIGURAÇÕES" title="Terminais e janelas" description="Configure portões, horários de operação e capacidade de atendimento." icon={Warehouse} count={terminals.length} activeCount={terminals.filter((item) => item.status !== "INATIVO").length} activeLabel="Terminais habilitados" formOpen={formOpen} onToggleForm={() => formOpen ? closeForm() : setFormOpen(true)} />
      {isLoading && <div className="api-state-banner">Carregando terminais da API...</div>}{error && <div className="api-state-banner is-error">{error}</div>}

      {formOpen && <RegistryFormPanel title="Cadastrar terminal" description="Configure a localização e os limites operacionais do novo terminal." onCancel={closeForm}>
        <form onSubmit={handleSubmit(submit)} noValidate><div className="registry-form-grid">
          <label className="registry-field registry-field-wide"><span>Nome do terminal *</span><input autoFocus {...register("name")} /><RegistryFieldError message={errors.name?.message} /></label>
          <label className="registry-field"><span>Código *</span><input placeholder="TATL" {...register("code")} /><RegistryFieldError message={errors.code?.message} /></label>
          <label className="registry-field registry-field-wide"><span>Localização *</span><input placeholder="Bairro — Município" {...register("location")} /><RegistryFieldError message={errors.location?.message} /></label>
          <label className="registry-field"><span>Quantidade de portões *</span><input type="number" min="1" {...register("gates")} /><RegistryFieldError message={errors.gates?.message} /></label>
          <label className="registry-field"><span>Horário de abertura *</span><input type="time" {...register("openingTime")} /><RegistryFieldError message={errors.openingTime?.message} /></label>
          <label className="registry-field"><span>Horário de fechamento *</span><input type="time" {...register("closingTime")} /><RegistryFieldError message={errors.closingTime?.message} /></label>
          <label className="registry-field"><span>Capacidade por hora *</span><input type="number" min="1" {...register("hourlyCapacity")} /><RegistryFieldError message={errors.hourlyCapacity?.message} /></label>
        </div><RegistryFormActions onCancel={closeForm} submitting={isSubmitting} /></form>
      </RegistryFormPanel>}

      <div className="registry-list-card"><RegistryToolbar value={search} onChange={setSearch} placeholder="Pesquisar por nome, código ou localização" count={filteredTerminals.length} />
        <div className="terminal-cards">
          {filteredTerminals.map((terminal) => <article className="terminal-card" key={terminal.id}>
            <header><div className="terminal-card-icon"><Warehouse size={20} /></div><div><span>{terminal.code}</span><h3>{terminal.name}</h3></div><RegistryStatus status={terminal.status} /></header>
            <div className="terminal-location"><MapPin size={15} /><span>{terminal.location}</span></div>
            <div className="terminal-metrics"><div><Clock3 size={16} /><span>Funcionamento<strong>{terminal.openingTime}–{terminal.closingTime}</strong></span></div><div><Gauge size={16} /><span>Capacidade<strong>{terminal.hourlyCapacity} caminhões/h</strong></span></div><div><Warehouse size={16} /><span>Acessos<strong>{terminal.gates} portões</strong></span></div></div>
            <footer><span>{terminal.id}</span><button type="button" onClick={() => toggleTerminalStatus(terminal.id)}>{terminal.status === "INATIVO" ? <RotateCcw size={15} /> : <Power size={15} />}{terminal.status === "INATIVO" ? "Reativar" : "Desativar"}</button></footer>
          </article>)}
        </div>{filteredTerminals.length === 0 && <div className="registry-empty"><Warehouse size={25} /><strong>Nenhum terminal encontrado</strong><span>Tente pesquisar por outro termo.</span></div>}
      </div>
    </section>
  );
}
