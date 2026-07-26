"use client";

import * as React from "react";

import { cn } from "./utils";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function SearchInput({ icon, className, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
      <input
        type="search"
        data-slot="search-input"
        className={cn(
          "flex rounded-md border border-border bg-background px-3 py-2 text-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
          "placeholder:text-muted-foreground",
          icon && "pl-9",
          className
        )}
        {...props}
      />
    </div>
  );
}