import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { ChatBubble } from '../../ui/legacy-adapters';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function ChatBubbleDoc() {
  const [variant, setVariant] = React.useState<'sent' | 'received'>('received');
  const [showAvatar, setShowAvatar] = React.useState(true);
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

  const getDynamicCode = () => `import { ChatBubble } from "@/components/design-system/components";

// Received message
<ChatBubble
  message="Hello! How can I help you today?"
  variant="received"
  sender="Support"
  timestamp="10:30 AM"
  showAvatar
/>

// Sent message
<ChatBubble
  message="I need help with my account settings."
  variant="sent"
  timestamp="10:31 AM"
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

  const conversation = [
    { variant: 'received' as const, message: 'Hi! Welcome to Wugweb support. How can I help you today?', sender: 'Alice', time: '10:30 AM', showAvatar: true },
    { variant: 'sent' as const, message: "I'm having trouble customizing the design tokens.", sender: 'You', time: '10:31 AM', showAvatar: false },
    { variant: 'received' as const, message: "No problem! The design tokens live in /styles/globals.css. Update any --variable to change the whole system at once.", sender: 'Alice', time: '10:32 AM', showAvatar: true },
    { variant: 'sent' as const, message: 'That makes sense! Does changing --accent update all the highlighted elements?', sender: 'You', time: '10:33 AM', showAvatar: false },
    { variant: 'received' as const, message: "Exactly! Every component that uses var(--accent) will update automatically. No Tailwind overrides needed.", sender: 'Alice', time: '10:33 AM', showAvatar: true },
  ];

  return (
    <PageWrapper>
      <PageHeader
        badge="Utility Component"
        title="Chat Bubble"
        description="A message bubble for chat and messaging interfaces. Renders sent messages (right-aligned, accent) and received messages (left-aligned, muted) with optional avatar and timestamp."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Toggle variant and avatar display">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['received', 'sent'] as const).map(v => (
                  <Button key={v} variant={variant === v ? 'default' : 'outline'} size="sm" onClick={() => setVariant(v)} style={{ textTransform: 'capitalize' }}>{v}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Show Avatar</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={showAvatar ? 'default' : 'outline'} size="sm" onClick={() => setShowAvatar(true)}>On</Button>
                <Button variant={!showAvatar ? 'default' : 'outline'} size="sm" onClick={() => setShowAvatar(false)}>Off</Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)' }}>
              <ChatBubble
                message={variant === 'received' ? "Hello! How can I help you today?" : "I need help with my account settings."}
                variant={variant}
                sender={variant === 'received' ? 'Alice' : 'You'}
                timestamp="10:30 AM"
                showAvatar={showAvatar}
              />
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Full Conversation Preview" description="A realistic chat thread using ChatBubble">
        <PageCard>
          <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {conversation.map((msg, i) => (
              <ChatBubble
                key={i}
                message={msg.message}
                variant={msg.variant}
                sender={msg.sender}
                timestamp={msg.time}
                showAvatar={msg.showAvatar}
              />
            ))}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--card" label="Received Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--card')} isHighlighted={highlightedToken === '--card'} />
          <TokenCard token="--accent-subtle" label="Sent Background" value="rgba(255, 190, 26, 0.10)" category="color" onClick={() => handleTokenClick('--accent-subtle')} isHighlighted={highlightedToken === '--accent-subtle'} />
          <TokenCard token="--foreground" label="Message Text" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--foreground')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard token="--muted-foreground" label="Timestamp Color" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard token="--radius-lg" label="Bubble Radius" value="12px" category="radius" onClick={() => handleTokenClick('--radius-lg')} isHighlighted={highlightedToken === '--radius-lg'} />
          <TokenCard token="--spacing-3" label="Bubble Padding" value="12px" category="spacing" onClick={() => handleTokenClick('--spacing-3')} isHighlighted={highlightedToken === '--spacing-3'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}
