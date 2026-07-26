"use client";

import * as React from "react";

import { cn } from "./utils";

export interface SideMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
}

export function SideMenu({ open = false, className, ...props }: SideMenuProps) {
  return (
    <aside
      data-slot="side-menu"
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r bg-background transition-transform",
        open ? "translate-x-0" : "-translate-x-full",
        className
      )}
      {...props}
    />
  );
}