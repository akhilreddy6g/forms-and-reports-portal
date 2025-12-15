"use client";
import type { InputHTMLAttributes } from "react";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm text-app-text",
        "outline-none focus:ring-2 focus:ring-app-border",
        props.className ?? "",
      ].join(" ")}
    />
  );
}