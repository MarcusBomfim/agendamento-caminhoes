import { Search } from "lucide-react";

export function RegistryToolbar({ value, onChange, placeholder, count }: { value: string; onChange: (value: string) => void; placeholder: string; count: number }) {
  return (
    <div className="registry-toolbar">
      <label><span className="sr-only">Pesquisar cadastros</span><Search size={17} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>
      <span>{count} {count === 1 ? "resultado" : "resultados"}</span>
    </div>
  );
}
