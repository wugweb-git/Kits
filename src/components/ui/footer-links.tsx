"use client";

import * as React from "react";

import { cn } from "./utils";

export interface FooterLinksProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
}

export function FooterLinks({ title, className, ...props }: FooterLinksProps) {
  return (
    <footer data-slot="footer-links" className={cn("border-t bg-muted/50", className)} {...props}>
      {title && (
        <div className="text-sm font-semibold">{title}</div>
      )}
    </footer>
  );
}