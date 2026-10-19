import type { ReactNode } from "react";

type AdminTableProps = {
  caption?: string;
  columns: string[];
  children: ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
};

const thClass =
  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted";
const tdClass = "px-4 py-3 text-sm text-navy";

export function AdminTable({
  caption,
  columns,
  children,
  emptyMessage = "Nothing to show yet.",
  isEmpty = false,
}: AdminTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white">
      <table className="w-full min-w-[32rem] border-collapse text-left">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-border bg-brand-teal/5">
            {columns.map((column) => (
              <th key={column} scope="col" className={thClass}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {isEmpty ? (
            <tr>
              <td
                colSpan={columns.length}
                className={`${tdClass} py-8 text-center text-muted`}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export const adminTableCellClass = tdClass;
