import React from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../../../utils/clipboard';

interface TokenCardProps {
  token: string;
  name?: string;
  label?: string;
  value: string;
  category?: string;
  highlighted?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
}

export function TokenCard({ 
  token, 
  name, 
  label, 
  value, 
  category, 
  highlighted, 
  isHighlighted, 
  onClick 
}: TokenCardProps) {
  const [copied, setCopied] = React.useState(false);
  const isSelected = highlighted || isHighlighted;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(token);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
        padding: 'var(--spacing-4)',
        background: 'var(--card)',
        border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--motion-duration-short) var(--motion-easing-standard)',
        position: 'relative'
      }}
      className={isSelected ? 'elevation-2' : ''}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
          <span style={{ fontSize: 'var(--ts-body-sm-size)', fontWeight: 500, color: 'var(--foreground)' }}>
            {label || name}
          </span>
          <code style={{ fontSize: 'var(--ts-code-size)', color: 'var(--muted-foreground)' }}>
            {token}
          </code>
        </div>
        
        {category === 'color' && (
          <div 
            style={{ 
              width: 'var(--spacing-6)', 
              height: 'var(--spacing-6)', 
              borderRadius: 'var(--radius-md)', 
              background: `var(${token})`,
              border: '1px solid var(--border)'
            }} 
          />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{ fontSize: 'var(--ts-body-sm-size)', color: 'var(--muted-foreground)' }}>
          {value}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: 'none',
            border: 'none',
            padding: 'var(--spacing-1)',
            cursor: 'pointer',
            color: copied ? 'var(--success)' : 'var(--muted-foreground)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
          }}
          title="Copy token name"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}
