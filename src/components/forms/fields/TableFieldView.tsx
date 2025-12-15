"use client";

import type { TableField } from "@/lib/forms/schema";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";

export function TableFieldView({
  field,
  value,
  onChangeAction,
}: {
  field: TableField;
  value: unknown[];
  onChangeAction: (v: unknown[]) => void;
}) {
  const rows = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];

  const addRow = () => {
    const row: Record<string, unknown> = {};
    for (const c of field.columns) row[c.id] = c.type === "multiText" ? [] : "";
    onChangeAction([...rows, row]);
  };

  const removeRow = (idx: number) => onChangeAction(rows.filter((_, i) => i !== idx));

  const setCell = (r: number, colId: string, v: unknown) => {
    onChangeAction(rows.map((row, i) => (i === r ? { ...row, [colId]: v } : row)));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-lg border border-app-border bg-app-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-app-border">
            <tr>
              {field.columns.map((c) => (
                <th key={c.id} className="px-3 py-2 font-semibold text-app-text">
                  {c.label}
                </th>
              ))}
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-app-border last:border-b-0">
                {field.columns.map((c) => {
                  const cell = row[c.id];
                  if (c.type === "date") {
                    return (
                      <td key={c.id} className="px-3 py-2">
                        <TextInput
                          type="date"
                          value={typeof cell === "string" ? cell : ""}
                          onChange={(e) => setCell(rIdx, c.id, e.target.value)}
                        />
                      </td>
                    );
                  }
                  if (c.type === "multiText") {
                    return (
                      <td key={c.id} className="px-3 py-2">
                        <TextInput
                          value={Array.isArray(cell) ? cell.join(", ") : ""}
                          onChange={(e) =>
                            setCell(
                              rIdx,
                              c.id,
                              e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                            )
                          }
                        />
                      </td>
                    );
                  }
                  return (
                    <td key={c.id} className="px-3 py-2">
                      <TextInput
                        value={typeof cell === "string" ? cell : ""}
                        onChange={(e) => setCell(rIdx, c.id, e.target.value)}
                      />
                    </td>
                  );
                })}
                <td className="px-3 py-2">
                  <Button type="button" variant="clear" onClick={() => removeRow(rIdx)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={field.columns.length + 1} className="px-3 py-3 text-app-muted">
                  No rows yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div>
        <Button type="button" variant="secondary" onClick={addRow}>
          Add row
        </Button>
      </div>
    </div>
  );
}