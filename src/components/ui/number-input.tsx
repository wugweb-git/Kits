"use client";

import * as React from "react";

import { cn } from "./utils";

export interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number;
  onValueChange?: (value: number) => void;
}

export function NumberInput({ value, onValueChange, className, ...props }: NumberInputProps) {
  const [internal, setInternal] = React.useState<string>(value?.toString() || "");

  React.useEffect(() => {
    if (value !== undefined) setInternal(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setInternal(next);
    const num = parseFloat(next);
    if (!Number.isNaN(num) && onValueChange) onValueChange(num);
  };

  return (
    <input
      type="number"
      data-slot="number-input"
      className={cn(
        "flex rounded-md border border-border bg-background px-3 py-2 text-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
        className
      )}
      value={internal}
      onChange={handleChange}
      {...props}
    />
  );
}