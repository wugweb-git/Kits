import React from 'react';
import { Clock, ArrowLeft } from 'lucide-react';
import { PageWrapper, PageHeader } from '../../PageWrapper';
import { Button } from '../../../wugweb/Button';

const F = 'Inter Tight, sans-serif';

interface TemplateStubProps {
  title: string;
  description: string;
  blocks: string[];
  onBack?: () => void;
}

export function TemplateStub({ title, description, blocks, onBack }: TemplateStubProps) {
  return (
    <PageWrapper>
      <PageHeader
        badge="Template · In Progress"
        title={title}
        description={description}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-10)' }}>
        {blocks.map((block, i) => (
          <div
            key={block}
            style={{
              background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)',
              display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)',
              opacity: 0.7,
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)' }}>{String(i + 1).padStart(2, '0')}</span>
            </div>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: F }}>{block}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-8)', textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-4)' }}>
          <Clock size={22} style={{ color: 'var(--muted-foreground)' }} />
        </div>
        <h3 style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>Coming soon</h3>
        <p style={{ margin: '0 0 var(--spacing-6)', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
          This template is being assembled from the blocks above. All values will use <code style={{ fontFamily: 'var(--core-font-family-mono)', fontSize: 'var(--text-xs)', background: 'var(--muted)', padding: '1px 5px', borderRadius: 'var(--radius-sm)' }}>CSS variables</code> — no hardcoded values anywhere.
        </p>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft size={14} /> Back to templates
          </Button>
        )}
      </div>
    </PageWrapper>
  );
}
