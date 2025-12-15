"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "edit" | "clear";

const STYLE: Record<Variant, string> = {
  primary: "bg-brand-primaryBtn text-app-textOnDark hover:opacity-90",
  secondary: "bg-brand-secondaryBtn text-app-textOnDark hover:opacity-90",
  edit: "bg-brand-editBtn text-app-textOnDark hover:opacity-90",
  clear: "bg-brand-clearBtn text-app-textOnDark hover:opacity-90",
};

export function Button({
    variant = "primary",
    className = "",
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
    return (
      <button
        {...props}
        className={[
          "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold",
          "transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-app-border",
          "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-40",
          STYLE[variant],
          className,
        ].join(" ")}
      />
    );
  }