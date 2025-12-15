"use client";
import type { TextareaHTMLAttributes } from "react";

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "w-full min-h-24 rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm text-app-text",
        "outline-none focus:ring-2 focus:ring-app-border",
        props.className ?? "",
      ].join(" ")}
    />
  );
}