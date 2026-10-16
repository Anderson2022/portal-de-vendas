import type { RegisterRow } from "@/lib/financeiro/dimensoes/types";
export function RegisterTable<T extends RegisterRow>({
  rows,
  onEdit,
}: {
  rows: T[];
  onEdit: (row: T) => void;
}) {
  const byId = new Map(rows.map((row) => [String(row.id), row]));
  function depth(row: T) {
    const visited = new Set<string>();
    let level = 0;
    let parent = row.parentId;
    while (parent && !visited.has(String(parent))) {
      visited.add(String(parent));
      const ancestor = byId.get(String(parent));
      if (!ancestor) break;
      level++;
      parent = ancestor.parentId;
    }
    return level;
  }
  return (
    <div className="overflow-x-auto">
      <table className="tbl w-full">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Situação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.code}</td>
              <td style={{ paddingLeft: `${16 + depth(row) * 20}px` }}>
                {row.parentId ? "↳ " : ""}
                {row.name}
              </td>
              <td>{row.active ? "Ativo" : "Inativo"}</td>
              <td>
                <button
                  type="button"
                  className="fin-button"
                  onClick={() => onEdit(row)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && (
        <p className="p-8 text-center text-slate-500">
          Nenhum cadastro encontrado.
        </p>
      )}
    </div>
  );
}
