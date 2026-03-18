import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { DataTable } from '../../wugweb/DataTable';
import { Badge } from '../../wugweb/Badge';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

const sampleUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joined: '2024-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', joined: '2024-02-20' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive', joined: '2024-03-10' },
  { id: 4, name: 'David Lee', email: 'david@example.com', role: 'Admin', status: 'Active', joined: '2024-04-05' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', role: 'Editor', status: 'Active', joined: '2024-05-18' },
  { id: 6, name: 'Frank Brown', email: 'frank@example.com', role: 'Viewer', status: 'Pending', joined: '2024-06-22' },
];

export function DataTableDoc() {
  const [searchable, setSearchable] = React.useState(true);
  const [striped, setStriped] = React.useState(false);
  const [hoverable, setHoverable] = React.useState(true);
  const [size, setSize] = React.useState<'s' | 'm' | 'l'>('m');
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);

  const handleTokenClick = (token: string) => {
    setHighlightedToken(token);
    setTimeout(() => setHighlightedToken(null), 2000);
  };

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
  };

  const columns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'role', title: 'Role', sortable: true },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'success' : value === 'Inactive' ? 'destructive' : 'default'}>
          {value}
        </Badge>
      ),
    },
    { key: 'joined', title: 'Joined', sortable: true },
  ];

  const getDynamicCode = () => `import { DataTable } from "@/components/wugweb/DataTable";

const columns = [
  { key: "name", title: "Name", sortable: true },
  { key: "email", title: "Email", sortable: true },
  { key: "role", title: "Role" },
  {
    key: "status",
    title: "Status",
    render: (value) => <Badge>{value}</Badge>,
  },
];

<DataTable
  data={users}
  columns={columns}
  searchable={${searchable}}
  striped={${striped}}
  hoverable={${hoverable}}
  size="${size}"
  emptyText="No users found"
/>`;

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
      <Button onClick={copyPageLink} variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
        {copiedLink ? 'Copied!' : 'Copy Link'}
      </Button>
      <Button variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        <ExternalLink size={16} />View in Figma
      </Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader
        badge="Data Display Component"
        title="Data Table"
        description="An advanced table with built-in sorting, global search, and custom cell rendering. Designed for data-heavy interfaces where users need to find, compare, and act on information."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the data table">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['s', 'm', 'l'] as const).map(s => (
                  <Button key={s} variant={size === s ? 'default' : 'outline'} size="sm" onClick={() => setSize(s)}>{s.toUpperCase()}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Search</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={searchable ? 'default' : 'outline'} size="sm" onClick={() => setSearchable(true)}>On</Button>
                <Button variant={!searchable ? 'default' : 'outline'} size="sm" onClick={() => setSearchable(false)}>Off</Button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Striped</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={striped ? 'default' : 'outline'} size="sm" onClick={() => setStriped(true)}>On</Button>
                <Button variant={!striped ? 'default' : 'outline'} size="sm" onClick={() => setStriped(false)}>Off</Button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Hover</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={hoverable ? 'default' : 'outline'} size="sm" onClick={() => setHoverable(true)}>On</Button>
                <Button variant={!hoverable ? 'default' : 'outline'} size="sm" onClick={() => setHoverable(false)}>Off</Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <DataTable
              data={sampleUsers}
              columns={columns}
              searchable={searchable}
              striped={striped}
              hoverable={hoverable}
              size={size}
              emptyText="No users found"
            />
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--card" label="Table Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--card')} isHighlighted={highlightedToken === '--card'} />
          <TokenCard token="--border" label="Row Border" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--muted" label="Striped Row / Header" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--muted')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard token="--accent" label="Sort Indicator" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--foreground" label="Cell Text" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--foreground')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard token="--radius-lg" label="Table Radius" value="12px" category="radius" onClick={() => handleTokenClick('--radius-lg')} isHighlighted={highlightedToken === '--radius-lg'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}
