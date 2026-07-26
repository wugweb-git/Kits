"use client";

import * as React from "react";

import { cn } from "./utils";

export interface ListGroupProps extends React.HTMLAttributes<HTMLUListElement> {}

export function ListGroup({ className, ...props }: ListGroupProps) {
  return (
    <ul
      data-slot="list-group"
      className={cn("rounded-md border divide-y", className)}
      {...props}
    />
  );
}