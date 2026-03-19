"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          background: 'var(--popover)',
          color: 'var(--popover-foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-2)',
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-regular)',
        },
        className: 'toast',
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--success)",
          "--success-text": "white",
          "--error-bg": "var(--destructive)",
          "--error-text": "white",
          "--info-bg": "var(--accent)",
          "--info-text": "var(--accent-foreground)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };