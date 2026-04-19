import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Rating } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function RatingDoc() {
  const [rating, setRating] = React.useState(3);
  const [max, setMax] = React.useState(5);
  const [size, setSize] = React.useState<'s' | 'm' | 'l'>('m');
  const [readonly, setReadonly] = React.useState(false);
  const [showValue, setShowValue] = React.useState(true);
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

  const getDynamicCode = () => `import { Rating } from "@/components/design-system/components";

export function RatingDemo() {
  const [rating, setRating] = React.useState(${rating});

  return (
    <Rating
      value={rating}
      onChange={setRating}
      max={${max}}
      size="${size}"
      readonly={${readonly}}
      showValue={${showValue}}
    />
  );
}`;

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

  const reviews = [
    { name: 'Alice J.', rating: 5, text: 'Excellent design system! Saves so much time.', date: 'March 2026' },
    { name: 'Bob S.', rating: 4, text: 'Great components, well documented.', date: 'February 2026' },
    { name: 'Carol W.', rating: 4.5, text: 'The CSS variable system is a game changer.', date: 'January 2026' },
  ];

  return (
    <PageWrapper>
      <PageHeader
        badge="Feedback Component"
        title="Rating"
        description="An interactive star rating input. Supports hover preview, fractional display values, readonly mode for static ratings, and configurable max stars."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the rating component">
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
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Max Stars</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {[3, 5, 10].map(m => (
                  <Button key={m} variant={max === m ? 'default' : 'outline'} size="sm" onClick={() => setMax(m)}>{m}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Mode</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={!readonly ? 'default' : 'outline'} size="sm" onClick={() => setReadonly(false)}>Interactive</Button>
                <Button variant={readonly ? 'default' : 'outline'} size="sm" onClick={() => setReadonly(true)}>Readonly</Button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Show Value</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={showValue ? 'default' : 'outline'} size="sm" onClick={() => setShowValue(true)}>On</Button>
                <Button variant={!showValue ? 'default' : 'outline'} size="sm" onClick={() => setShowValue(false)}>Off</Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <Rating value={rating} onChange={setRating} max={max} size={size} readonly={readonly} showValue={showValue} />
              {!readonly && (
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  Click a star to rate. Hover to preview.
                </span>
              )}
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="In Context: Review Cards" description="Typical usage inside user review components">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {reviews.map((review, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-full)', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{review.name}</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{review.date}</p>
                  </div>
                </div>
                <Rating value={review.rating} max={5} size="s" readonly showValue />
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{review.text}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--accent" label="Filled Star" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--muted" label="Empty Star" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--muted')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard token="--muted-foreground" label="Value Label" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard token="--motion-duration-fast" label="Hover Animation" value="80ms" category="other" onClick={() => handleTokenClick('--motion-duration-fast')} isHighlighted={highlightedToken === '--motion-duration-fast'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}
