import React from 'react';
import { GitBranch, GitPullRequest, FileText, MessageSquare, CheckCircle2, ExternalLink, Copy, Check, Bug, Lightbulb, BookOpen, Code } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { Button } from '../../wugweb/Button';
import { Badge } from '../../wugweb/Badge';

const F = 'Inter Tight, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

const LINKS = {
  github: 'https://github.com/wugweb-git/Kits',
  issues: 'https://github.com/wugweb-git/Kits/issues',
  pulls: 'https://github.com/wugweb-git/Kits/pulls',
  discussions: 'https://github.com/wugweb-git/Kits/discussions',
  figma: 'https://www.figma.com/design/ttIty8LUIsRsU4AJFlX8To/wugweb-kits',
  live: 'https://kits.wugweb.studio',
  email: 'mailto:hello@wugweb.com',
};

const ways = [
  { icon: FileText, color: 'var(--accent)', title: 'Documentation', desc: 'Fix typos, improve examples, clarify token rules, or add missing API docs. Docs are the most impactful contribution.', label: 'Open docs issue' },
  { icon: Bug, color: 'var(--destructive)', title: 'Bug Reports', desc: 'Found a component rendering wrong? Token missing from the CSS? Open a GitHub issue with reproduction steps.', label: 'File bug report' },
  { icon: Code, color: '#3B82F6', title: 'New Components', desc: 'Propose a component that follows the token contract. Must be variant-based, CSS-variable-only, and WCAG AA compliant.', label: 'Propose component' },
  { icon: Lightbulb, color: '#10B981', title: 'Token Proposals', desc: 'Suggest additions to the semantic or alias layer. All token proposals require a use-case justification.', label: 'Start discussion' },
  { icon: BookOpen, color: '#8B5CF6', title: 'Block Patterns', desc: 'New block patterns for the Blocks section. Must use existing components and CSS variables only. No hardcoded values.', label: 'Submit block' },
  { icon: MessageSquare, color: '#F59E0B', title: 'Design Feedback', desc: 'Review component designs in Figma, flag inconsistencies, suggest improvements. Figma comments or GitHub discussions.', label: 'Open Figma' },
];

function CopyCmd({ cmd }: { cmd: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-1000)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3) var(--spacing-4)', border: 'var(--border-default)', marginBottom: 'var(--spacing-2)' }}>
      <code style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontFamily: MONO }}>{cmd}</code>
      <button onClick={() => { navigator.clipboard.writeText(cmd).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); }} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
        {copied ? <Check size={12} style={{ color: 'var(--success)' }} /> : <Copy size={12} />}
      </button>
    </div>
  );
}

export function Contribute() {
  return (
    <PageWrapper>
      <PageHeader
        badge="Contribute"
        title="Contribute to Kits"
        description="Wugweb Kits is built in the open. Every component, token, and doc page welcomes contributions from designers and developers."
        actions={
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--accent)', textDecoration: 'none', fontFamily: F }}>
            github.com/wugweb-git/Kits <ExternalLink size={14} />
          </a>
        }
      />

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-12)' }}>
        {[
          { label: 'GitHub Repo', url: LINKS.github, icon: GitBranch },
          { label: 'Open Issues', url: LINKS.issues, icon: Bug },
          { label: 'Pull Requests', url: LINKS.pulls, icon: GitPullRequest },
          { label: 'Discussions', url: LINKS.discussions, icon: MessageSquare },
          { label: 'Figma Kit', url: LINKS.figma, icon: BookOpen },
          { label: 'Live Site', url: LINKS.live, icon: ExternalLink },
        ].map(link => {
          const Icon = link.icon;
          return (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3) var(--spacing-4)', background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', color: 'var(--foreground)', transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)', fontFamily: F }}>
              <Icon size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: F }}>{link.label}</span>
              <ExternalLink size={11} style={{ color: 'var(--muted-foreground)', marginLeft: 'auto' }} />
            </a>
          );
        })}
      </div>

      {/* Ways to contribute */}
      <PageSection title="Ways to Contribute">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
          {ways.map(w => {
            const Icon = w.icon;
            return (
              <div key={w.title} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: `color-mix(in srgb, ${w.color} 14%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} style={{ color: w.color }} />
                </div>
                <h3 style={{ margin: 0, fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>{w.title}</h3>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6, fontFamily: F, flex: 1 }}>{w.desc}</p>
                <a href={w.title === 'Design Feedback' ? LINKS.figma : LINKS.issues} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: w.color, textDecoration: 'none', fontFamily: F, marginTop: 'auto' }}>
                  {w.label} <ExternalLink size={11} />
                </a>
              </div>
            );
          })}
        </div>
      </PageSection>

      {/* Dev setup */}
      <PageSection title="Local Development Setup" description="Clone the repo, install dependencies, and run the dev server in 4 commands.">
        <PageCard>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>Clone & install</p>
            <CopyCmd cmd="git clone https://github.com/wugweb-git/Kits.git" />
            <CopyCmd cmd="cd Kits && npm install" />
            <CopyCmd cmd="npm run dev" />
          </div>
          <div>
            <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>Token build (Style Dictionary)</p>
            <CopyCmd cmd="npm run tokens:build" />
            <CopyCmd cmd="npm run tokens:watch" />
          </div>
        </PageCard>
      </PageSection>

      {/* Contribution rules */}
      <PageSection title="Contribution Rules">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-6)' }}>
            {[
              {
                heading: 'Token contract', color: 'var(--accent)',
                rules: [
                  'All values via CSS variables — never hex, never px directly',
                  'Semantic tokens in components — never core tokens',
                  'Naming: --{layer}-{category}-{name}-{scale}',
                  'New token requires use-case in PR description',
                ],
              },
              {
                heading: 'Component standards', color: '#3B82F6',
                rules: [
                  'Variant-based: size (sm/md/lg) + state (default/hover/disabled)',
                  'WCAG 2.1 AA required — include contrast check in PR',
                  'TypeScript types required for all props',
                  'Inter Tight — only allowed font face',
                ],
              },
              {
                heading: 'PR checklist', color: 'var(--success)',
                rules: [
                  'One logical change per PR',
                  'Screenshots for visual changes',
                  'Update CHANGELOG.md entry',
                  'Link related GitHub issue',
                ],
              },
            ].map(({ heading, color, rules }) => (
              <div key={heading}>
                <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>{heading}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {rules.map(r => (
                    <li key={r} style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>
                      <span style={{ color, flexShrink: 0 }}>·</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>

      {/* Contact */}
      <div style={{ background: 'var(--accent-subtle)', border: 'var(--border-accent)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', display: 'flex', gap: 'var(--spacing-5)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ margin: '0 0 var(--spacing-1)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>Have a bigger idea?</p>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F }}>For partnerships, sponsorships, or large contributions, reach out directly at <a href={LINKS.email} style={{ color: 'var(--accent)', textDecoration: 'none', fontFamily: F }}>hello@wugweb.com</a>.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <a href={LINKS.discussions} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm">Start a discussion</Button>
          </a>
          <a href={LINKS.email} style={{ textDecoration: 'none' }}>
            <Button variant="default" size="sm">Email us</Button>
          </a>
        </div>
      </div>
    </PageWrapper>
  );
}
