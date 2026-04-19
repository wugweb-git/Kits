import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { FileInput } from '../../ui/legacy-adapters';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function FileInputDoc() {
  const [file, setFile] = React.useState<File | File[] | null>(null);
  const [multiple, setMultiple] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [accept, setAccept] = React.useState('*');
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

  const getDynamicCode = () => `import { FileInput } from "@/components/design-system/components";

export function FileInputDemo() {
  const [file, setFile] = React.useState<File | null>(null);

  return (
    <FileInput
      value={file}
      onChange={setFile}
      accept="${accept === '*' ? undefined : accept}"
      multiple={${multiple}}
      maxSize={${5 * 1024 * 1024}}
      placeholder="Drop files here or click to browse"
      disabled={${isDisabled}}
    />
  );
}`;

  const acceptTypes = [
    { label: 'Any', value: '*' },
    { label: 'Images', value: 'image/*' },
    { label: 'PDF', value: '.pdf' },
    { label: 'CSV', value: '.csv,.xlsx' },
  ];

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
        badge="Form Component"
        title="File Input"
        description="A drag-and-drop file upload area with click-to-browse fallback. Supports single and multiple file selection with configurable accept types and max file size validation."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the file input">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>File Type</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                {acceptTypes.map(t => (
                  <Button key={t.value} variant={accept === t.value ? 'default' : 'outline'} size="sm" onClick={() => setAccept(t.value)}>{t.label}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Multiple</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={!multiple ? 'default' : 'outline'} size="sm" onClick={() => setMultiple(false)}>Single</Button>
                <Button variant={multiple ? 'default' : 'outline'} size="sm" onClick={() => setMultiple(true)}>Multiple</Button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>State</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={!isDisabled ? 'default' : 'outline'} size="sm" onClick={() => setIsDisabled(false)}>Enabled</Button>
                <Button variant={isDisabled ? 'default' : 'outline'} size="sm" onClick={() => setIsDisabled(true)}>Disabled</Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)' }}>
              <FileInput
                value={file}
                onChange={setFile}
                accept={accept === '*' ? undefined : accept}
                multiple={multiple}
                maxSize={5 * 1024 * 1024}
                placeholder="Drop files here or click to browse"
                disabled={isDisabled}
              />
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--border" label="Drop Zone Border" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--muted" label="Drop Zone Background" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--muted')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard token="--accent" label="Active Drag Color" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--radius-lg" label="Drop Zone Radius" value="12px" category="radius" onClick={() => handleTokenClick('--radius-lg')} isHighlighted={highlightedToken === '--radius-lg'} />
        </PageGrid>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Always specify <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>maxSize</code> to prevent oversized uploads from reaching the server</li>
              <li>Use descriptive <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>placeholder</code> text that lists allowed file types and size limits</li>
              <li>Show upload progress after file selection for better user feedback</li>
              <li>Validate files on the server side as well — client-side checks can be bypassed</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
