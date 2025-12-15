"use client";

import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";

export function MultiTextFieldView({
  value,
  onChangeAction,
}: {
  value: string[];
  onChangeAction: (v: string[]) => void;
}) {
  const add = () => onChangeAction([...(value ?? []), ""]);
  const remove = (i: number) => onChangeAction(value.filter((_, idx) => idx !== i));
  const update = (i: number, next: string) => onChangeAction(value.map((v, idx) => (idx === i ? next : v)));

  return (
    <div className="flex flex-col gap-2">
      {value.map((v, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <TextInput value={v} onChange={(e) => update(idx, e.target.value)} />
          <Button type="button" variant="clear" onClick={() => remove(idx)} className="px-3">
            Remove
          </Button>
        </div>
      ))}
      <div>
        <Button type="button" variant="secondary" onClick={add}>
          Add
        </Button>
      </div>
    </div>
  );
}