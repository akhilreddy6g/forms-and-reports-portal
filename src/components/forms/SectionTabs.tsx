"use client";

import type { FormSection } from "@/lib/forms/schema";

export function SectionTabs({
  sections,
  activeId,
  onSelectAction,
}: {
  sections: FormSection[];
  activeId: string;
  onSelectAction: (id: string) => void;
}) {
  return (
    <nav className="flex flex-wrap gap-2 rounded-lg bg-app-surface p-2">
      {sections.map((s) => {
        const active = s.id === activeId;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelectAction(s.id)}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active ? "bg-brand-primaryBtn text-app-textOnDark" : "bg-app-bg text-app-text",
            ].join(" ")}
          >
            {s.title}
          </button>
        );
      })}
    </nav>
  );
}