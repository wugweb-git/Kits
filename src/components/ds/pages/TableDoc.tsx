import React from 'react';
import { Copy, Check, ExternalLink, ArrowUpDown } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Table } from '../../wugweb/Table';
import { Button } from '../../wugweb/Button';
import { Badge } from '../../ui/badge';
import { copyToClipboard } from '../../../utils/clipboard';

interface Column<T> {
  key: keyof T;
  label: string;
  width?: number;
  sortable?: boolean;
  render?: (value: any) => React.ReactNode;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export function TableDoc() {
  const [striped, setStriped] = React.useState(false);
  const [bordered, setBordered] = React.useState(true);
  const [hoverable, setHoverable] = React.useState(true);
  const [compact, setCompact] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);

  const handleTokenClick = (token: string) => {
    setHighlightedToken(token);
    setTimeout(() => setHighlightedToken(null), 2000);
  };

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const columns: Column<User>[] = [
    { key: 'id', label: 'ID', width: 60, sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge
          variant="outline"
          style={{
            backgroundColor: value === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 67, 67, 0.1)',
            color: value === 'Active' ? 'var(--success)' : 'var(--destructive)',
            borderColor: 'transparent'
          }}
        >
          {value}
        </Badge>
      )
    },
  ];

  const data: User[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Inactive' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'Active' },
    { id: 5, name: 'Evan Wright', email: 'evan@example.com', role: 'Editor', status: 'Inactive' },
  ];

  const jsxCode = `import { Table } from './components/wugweb/Table';
import { Badge } from './components/ui/badge';

const columns = [
  { key: 'id', label: 'ID', width: 60, sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  {
    key: 'status',
    label: 'Status',
    render: (value) => <Badge>{value}</Badge>
  },
];

const data = [
  { id: 1, name: 'Alice', status: 'Active' },
  { id: 2, name: 'Bob', status: 'Inactive' },
];

<Table
  columns={columns}
  data={data}
  striped={${striped}}
  bordered={${bordered}}
  hoverable={${hoverable}}
  compact={${compact}}
/>

// Design Tokens Used:
// Background: var(--table-background)
// Border: var(--border)
// Header Background: var(--table-header)`;

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
      <Button onClick={copyPageLink} variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
        {copiedLink ? 'Copied!' : 'Copy Link'}
      </Button>
      <Button variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        <ExternalLink size={16} />
        View in Figma
      </Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader
        badge="Data Display"
        title="Table"
        description="A responsive data table component with support for sorting, filtering, and custom cell rendering. Built with accessibility in mind."
        actions={headerActions}
      />

      {/* Interactive Preview */}
      <PageSection title="Interactive Preview" description="Customize the table appearance">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
              <input type="checkbox" checked={striped} onChange={(e) => setStriped(e.target.checked)} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Striped</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
              <input type="checkbox" checked={bordered} onChange={(e) => setBordered(e.target.checked)} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Bordered</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
              <input type="checkbox" checked={hoverable} onChange={(e) => setHoverable(e.target.checked)} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Hoverable</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
              <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Compact</span>
            </label>
          </div>

          {/* Preview */}
          <div style={{ overflowX: 'auto' }}>
            <Table
              columns={columns}
              data={data}
              striped={striped}
              bordered={bordered}
              hoverable={hoverable}
              compact={compact}
            />
          </div>
        </PageCard>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="All CSS variables used in this component">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
          <TokenCard
            label="Background"
            token="--table-background"
            value="#1A1A1A"
            color="var(--table-background)"
            onClick={() => handleTokenClick('--table-background')}
            isHighlighted={highlightedToken === '--table-background'}
          />
          <TokenCard
            label="Border Color"
            token="--border"
            value="#2B2B2B"
            color="var(--border)"
            onClick={() => handleTokenClick('--border')}
            isHighlighted={highlightedToken === '--border'}
          />
          <TokenCard
            label="Header Background"
            token="--table-header"
            value="#262626"
            color="var(--table-header)"
            onClick={() => handleTokenClick('--table-header')}
            isHighlighted={highlightedToken === '--table-header'}
          />
        </div>
      </PageSection>

      {/* Code Examples */}
      <PageSection title="Code Examples" description="Copy and paste the code below">
        <CollapsibleCodeBlock code={jsxCode} language="tsx" />
      </PageSection>

      {/* Accessibility */}
      <PageSection title="Accessibility" description="WCAG 2.1 Level AA compliant">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-2)', color: 'var(--foreground)' }}>
                  Best Practices
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                  <li>Uses semantic <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>&lt;table&gt;</code>, <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>&lt;thead&gt;</code>, and <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>&lt;tbody&gt;</code> elements</li>
                  <li>Proper <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>scope</code> attributes on header cells for screen readers</li>
                  <li>Sortable columns include <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>aria-sort</code> attributes</li>
                  <li>Keyboard navigation support for interactive elements</li>
                </ul>
              </div>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
