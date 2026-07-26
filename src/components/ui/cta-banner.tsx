"use client";

import * as React from "react";

import { cn } from "./utils";
import { Button } from "./button";

export interface CTABannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export function CTABanner({
  title,
  description,
  buttonText = "Get Started",
  onButtonClick,
  className,
  ...props
}: CTABannerProps) {
  return (
    <div
      data-slot="cta-banner"
      className={cn("rounded-lg bg-primary p-8 text-primary-foreground", className)}
      {...props}
    >
      {title && <h3 className="text-xl font-semibold">{title}</h3>}
      {description && <p className="mt-2 text-primary-foreground/80">{description}</p>}
      {buttonText && (
        <Button className="mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}