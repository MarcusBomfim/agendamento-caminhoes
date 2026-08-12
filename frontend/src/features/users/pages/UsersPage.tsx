import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Power, RotateCcw, UserCog } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { RegistryFieldError, RegistryFormActions, RegistryFormPanel } from "../../registries/components/RegistryFormParts";
import { RegistryPageHeader } from "../../registries/components/RegistryPageHeader";
import { RegistryStatus } from "../../registries/components/RegistryStatus";
import { RegistryToolbar } from "../../registries/components/RegistryToolbar";
import { normalizeSearch } from "../../registries/utils";
import { useAuth } from "../../auth/useAuth";
import { apiRequest } from "../../../services/apiClient";
import { userSchema } from "../schemas/userSchema";
import type { ManagedUser, UserFormValues } from "../types";

const defaultValues: UserFormValues = { name: "", email: "", role: "OPERATOR", password: "", confirmPassword: "" };

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [actionError, setActionError] = useState("");
  const usersQuery = useQuery({ queryKey: ["users"], queryFn: () => apiRequest<ManagedUser[]>("/users"), enabled: currentUser?.role === "ADMIN" });
  const createMutation = useMutation({
    mutationFn: (values: UserFormValues) => apiRequest<ManagedUser>("/users", { method: "POST", body: JSON.stringify({ name: values.name, email: values.email, role: values.role, password: values.password }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, active }: Pick<ManagedUser, "id" | "active">) => apiRequest<ManagedUser>(`/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ active }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    onError: (error) => setActionError(error instanceof Error ? error.message : "Não foi possível alterar o usuário"),
  });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormValues>({ resolver: zodResolver(userSchema), defaultValues });

  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
  const filteredUsers = useMemo(() => {
    const term = normalizeSearch(search);
    return users.filter((user) => normalizeSearch(`${user.name} ${user.email} ${user.role}`).includes(term));
  }, [search, users]);

  const closeForm = () => { reset(defaultValues); setActionError(""); setShowPassword(false); setFormOpen(false); };
  const submit = async (values: UserFormValues) => {
    setActionError("");
    try { await createMutation.mutateAsync(values); closeForm(); }
    catch (error) { setActionError(error instanceof Error ? error.message : "Não foi possível cadastrar o usuário"); }
  };

  return (
    <section className="registry-page">
      <RegistryPageHeader eyebrow="ADMINISTRAÇÃO" title="Usuários do sistema" description="Crie acessos individuais e controle quem pode utilizar a operação." icon={UserCog} count={users.length} activeCount={users.filter((item) => item.active).length} activeLabel="Usuários ativos" formOpen={formOpen} onToggleForm={() => formOpen ? closeForm() : setFormOpen(true)} />
      {usersQuery.isLoading && <div className="api-state-banner">Carregando usuários da API...</div>}
      {(usersQuery.error || actionError) && <div className="api-state-banner is-error" role="alert">{actionError || (usersQuery.error instanceof Error ? usersQuery.error.message : "Não foi possível carregar os usuários")}</div>}

      {formOpen && <RegistryFormPanel title="Cadastrar usuário" description="Defina os dados de acesso e a permissão do novo usuário." onCancel={closeForm}>
        <form onSubmit={handleSubmit(submit)} noValidate><div className="registry-form-grid">
          <label className="registry-field registry-field-wide"><span>Nome completo *</span><input autoFocus autoComplete="name" {...register("name")} /><RegistryFieldError message={errors.name?.message} /></label>
          <label className="registry-field"><span>Função *</span><select {...register("role")}><option value="OPERATOR">Operador</option><option value="ADMIN">Administrador</option></select><RegistryFieldError message={errors.role?.message} /></label>
          <label className="registry-field registry-field-wide"><span>E-mail *</span><input type="email" autoComplete="email" placeholder="nome@empresa.com" {...register("email")} /><RegistryFieldError message={errors.email?.message} /></label>
          <div className="registry-field"><span>Requisitos da senha</span><p className="password-guidance">10 caracteres, letras maiúscula e minúscula, número e caractere especial.</p></div>
          <label className="registry-field"><span>Senha *</span><div className="password-input"><input type={showPassword ? "text" : "password"} autoComplete="new-password" {...register("password")} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div><RegistryFieldError message={errors.password?.message} /></label>
          <label className="registry-field"><span>Confirmar senha *</span><input type={showPassword ? "text" : "password"} autoComplete="new-password" {...register("confirmPassword")} /><RegistryFieldError message={errors.confirmPassword?.message} /></label>
        </div><RegistryFormActions onCancel={closeForm} submitting={isSubmitting || createMutation.isPending} /></form>
      </RegistryFormPanel>}

      <div className="registry-list-card"><RegistryToolbar value={search} onChange={setSearch} placeholder="Pesquisar por nome, e-mail ou função" count={filteredUsers.length} />
        <div className="registry-table-scroll"><table className="registry-table"><caption className="sr-only">Usuários cadastrados</caption><thead><tr><th>Usuário</th><th>E-mail</th><th>Função</th><th>Status</th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>
          {filteredUsers.map((user) => <tr key={user.id}><td><strong>{user.name}</strong><small>{user.id}</small></td><td><strong>{user.email}</strong></td><td><strong>{user.role === "ADMIN" ? "Administrador" : "Operador"}</strong></td><td><RegistryStatus status={user.active ? "ATIVO" : "INATIVO"} /></td><td><button className="registry-row-action" type="button" disabled={user.id === currentUser?.id || statusMutation.isPending} onClick={() => { setActionError(""); statusMutation.mutate({ id: user.id, active: !user.active }); }} title={user.id === currentUser?.id ? "Sua conta não pode ser desativada aqui" : user.active ? "Desativar" : "Reativar"}>{user.active ? <Power size={16} /> : <RotateCcw size={16} />}</button></td></tr>)}
        </tbody></table>{filteredUsers.length === 0 && !usersQuery.isLoading && <div className="registry-empty"><UserCog size={25} /><strong>Nenhum usuário encontrado</strong><span>Tente pesquisar por outro termo.</span></div>}</div>
      </div>
    </section>
  );
}
