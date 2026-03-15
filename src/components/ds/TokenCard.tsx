import React from 'react';
import { Copy, Check } from 'lucide-react';

interface TokenCardProps {
  name: string;
  value: string;
  usage?: string;
  preview?: React.ReactNode;
  copyValue?: string;
}

export function TokenCard({ name, value, usage, preview, copyValue }: TokenCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyValue || value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="bg-card border border-border p-6 hover:border-accent transition-colors"
      style={{ borderRadius: 'var(--radius-lg)' }}
    >
      {preview && (
        <div className="mb-4 flex items-center justify-center h-16">
          {preview}
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <code 
            className="text-primary"
            style={{ 
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            {name}
          </code>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}
            aria-label="Copy value"
          >
            {copied ? (
              <Check size={16} className="text-accent" />
            ) : (
              <Copy size={16} className="text-muted-foreground" />
            )}
          </button>
        </div>
        
        <p 
          className="text-foreground"
          style={{ fontSize: 'var(--text-sm)' }}
        >
          {value}
        </p>
        
        {usage && (
          <p 
            className="text-muted-foreground"
            style={{ fontSize: 'var(--text-xs)' }}
          >
            {usage}
          </p>
        )}
      </div>
    </div>
  );
}
