import React from 'react';
import { Copy, Check, Code, Eye } from 'lucide-react';
import { Badge } from '../../../design-system/components';
import { Button } from '../../../design-system/components';

const F = 'Inter Tight, sans-serif';

interface BlockVariant {
  id: string;
  label: string;
  preview: React.ReactNode;
  code?: string;
}

interface BlockPageShellProps {
  title: string;
  description: string;
  category: string;
  count: number;
  variants: BlockVariant[];
}

export function BlockPageShell({ title, description, category, count, variants }: BlockPageShellProps) {
  const [activeView, setActiveView] = React.useState<Record<string, 'preview' | 'code'>>({});
  const [copied, setCopied] = React.useState<string | null>(null);

  const getView = (id: string) => activeView[id] ?? 'preview';
  const setView = (id: string, v: 'preview' | 'code') =>
    setActiveView(prev => ({ ...prev, [id]: v }));

  const handleCopy = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: F }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
          <Badge variant="outline">{category}</Badge>
          <Badge variant="outline">{count} blocks</Badge>
        </div>
        <h1 style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--ts-h2-size)', fontWeight: 'var(--ts-h2-weight)', color: 'var(--foreground)', fontFamily: F }}>{title}</h1>
        <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', fontFamily: F }}>{description}</p>
      </div>

      {/* Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
        {variants.map((v) => (
          <div
            key={v.id}
            style={{ border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--card)' }}
          >
            {/* Block toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-3) var(--spacing-5)', borderBottom: 'var(--border-default)', background: 'var(--muted)' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{v.label}</span>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <button
                  onClick={() => setView(v.id, 'preview')}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: getView(v.id) === 'preview' ? 'var(--border-accent)' : 'var(--border-default)', background: getView(v.id) === 'preview' ? 'var(--accent-subtle)' : 'transparent', color: getView(v.id) === 'preview' ? 'var(--accent)' : 'var(--muted-foreground)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontFamily: F }}
                >
                  <Eye size={12} /> Preview
                </button>
                {v.code && (
                  <button
                    onClick={() => setView(v.id, 'code')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: getView(v.id) === 'code' ? 'var(--border-accent)' : 'var(--border-default)', background: getView(v.id) === 'code' ? 'var(--accent-subtle)' : 'transparent', color: getView(v.id) === 'code' ? 'var(--accent)' : 'var(--muted-foreground)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontFamily: F }}
                  >
                    <Code size={12} /> Code
                  </button>
                )}
                {v.code && (
                  <button
                    onClick={() => handleCopy(v.id, v.code!)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: 'var(--border-default)', background: 'transparent', color: 'var(--muted-foreground)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontFamily: F }}
                  >
                    {copied === v.id ? <Check size={12} style={{ color: 'var(--success)' }} /> : <Copy size={12} />}
                    {copied === v.id ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </div>

            {/* Block content */}
            {getView(v.id) === 'preview' ? (
              <div style={{ background: 'var(--background)' }}>{v.preview}</div>
            ) : (
              <pre style={{ margin: 0, padding: 'var(--spacing-5)', background: 'var(--surface-1000)', color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--core-font-family-mono)', overflowX: 'auto', lineHeight: 1.7, maxHeight: 400 }}>
                {v.code}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
