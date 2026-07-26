"use client";

import * as React from "react";

import { cn } from "./utils";

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
}

export function ChatBubble({ variant = "received", className, ...props }: ChatBubbleProps) {
  const variantClasses: Record<string, string> = {
    sent: "bg-primary text-primary-foreground ml-auto",
    received: "bg-muted text-muted-foreground",
  };

  return (
    <div
      data-slot="chat-bubble"
      className={cn("max-w-[70%] rounded-lg px-4 py-2 text-sm", variantClasses[variant], className)}
      {...props}
    />
  );
}