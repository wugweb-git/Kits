"use client";

import * as React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";

export interface AccordionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Array<{ title: string; content: React.ReactNode; defaultOpen?: boolean }>;
}

export function AccordionGroup({ items, className, ...props }: AccordionGroupProps) {
  return (
    <div data-slot="accordion-group" className={className} {...props}>
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </div>
  );
}