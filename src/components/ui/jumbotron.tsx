"use client";

import * as React from "react";

import { cn } from "./utils";

export interface JumbotronProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function Jumbotron({ title, description, className, ...props }: JumbotronProps) {
  return (
    <section
      data-slot="jumbotron"
      className={cn("rounded-lg border bg-card p-6", className)}
      {...props}
    >
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
    </section>
  );
}