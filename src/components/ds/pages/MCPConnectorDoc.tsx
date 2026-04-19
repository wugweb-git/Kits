import React from 'react';
import { Zap, GitBranch, RefreshCw, Shield, Copy, Check, ExternalLink, ArrowRight, Layers, Code } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { Button } from '../../design-system/components';
import { Badge } from '../../design-system/components';

const F = 'Inter Tight, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

function CodeBlock({ code, lang = '' }: { code: string; lang?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div style={{ border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--spacing-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', background: 'var(--muted)', borderBottom: 'var(--border-default)' }}>
        <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: MONO }}>{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); }} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: F }}>
          {copied ? <Check size={11} style={{ color: 'var(--success)' }} /> : <Copy size={11} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: 'var(--spacing-4)', background: 'var(--surface-1000)', color: 'var(--muted-foreground)', fontSize: '12px', fontFamily: MONO, lineHeight: 1.75, overflowX: 'auto' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

const mcpCapabilities = [
  { icon: GitBranch, color: 'var(--accent)', title: 'Push tokens to GitHub', desc: 'MCP agent commits updated token JSON directly to github.com/wugweb-git/Kits on every design decision. No manual export.', status: 'Planned' },
  { icon: RefreshCw, color: '#3B82F6', title: 'Sync tokens → Figma', desc: 'Trigger Tokens Studio sync from code. Change a token in globals.css → MCP pushes to GitHub → Tokens Studio pulls → Figma updates.', status: 'Planned' },
  { icon: Zap, color: '#10B981', title: 'Trigger Style Dictionary builds', desc: 'On token push, MCP runs Style Dictionary transforms to regenerate CSS variables, Tailwind config, and JS tokens automatically.', status: 'Alpha' },
  { icon: Shield, color: '#8B5CF6', title: 'Validate token schema', desc: 'MCP validates every token change against W3C DTCG schema before commit. Prevents naming drift, type violations, and broken references.', status: 'Planned' },
  { icon: Code, color: '#F59E0B', title: 'Generate component stubs', desc: 'From a semantic token definition, MCP generates a type-safe React component stub pre-wired to the correct CSS variables.', status: 'Planned' },
  { icon: Layers, color: '#EC4899', title: 'Multi-brand token swap', desc: 'Pass a brand config to MCP → it swaps the alias.json layer → regenerates all outputs → deploys. Full rebrand in one API call.', status: 'Planned' },
];

const mcpSchema = `// MCP Tool Schema — wugweb-kits-tokens
{
  "name": "wugweb-kits/push-tokens",
  "description": "Push updated design tokens to GitHub and trigger Style Dictionary build",
  "inputSchema": {
    "type": "object",
    "properties": {
      "layer": {
        "type": "string",
        "enum": ["global", "alias", "semantic", "component"],
        "description": "Which token layer to update"
      },
      "tokens": {
        "type": "object",
        "description": "W3C DTCG token object to merge into the layer"
      },
      "commitMessage": {
        "type": "string",
        "description": "Git commit message for the token change"
      },
      "triggerBuild": {
        "type": "boolean",
        "default": true,
        "description": "Run Style Dictionary after push"
      }
    },
    "required": ["layer", "tokens"]
  }
}`;

const mcpExample = `// Example: Push a brand color update via MCP
await mcp.call("wugweb-kits/push-tokens", {
  layer: "alias",
  tokens: {
    color: {
      brand: {
        primary: {
          value: "{color.brand.yellow.500}",
          type: "color"
        }
      }
    }
  },
  commitMessage: "chore(tokens): update brand primary to yellow-500",
  triggerBuild: true
});

// MCP then:
// 1. Validates against W3C DTCG schema
// 2. Commits alias.json to github.com/wugweb-git/Kits
// 3. Triggers Style Dictionary → outputs CSS vars, Tailwind, JS
// 4. Optionally syncs to Figma via Tokens Studio webhook`;

const mcpValidateSchema = `// MCP Tool Schema — validate-tokens
{
  "name": "wugweb-kits/validate-tokens",
  "description": "Validate token JSON against W3C DTCG schema and naming contract",
  "inputSchema": {
    "type": "object",
    "properties": {
      "tokens": { "type": "object" },
      "layer": {
        "type": "string",
        "enum": ["global", "alias", "semantic", "component"]
      }
    },
    "required": ["tokens", "layer"]
  }
}

// Returns:
// { valid: true } or
// { valid: false, errors: [{ path: "color.brand.primary", error: "Missing 'type' field" }] }`;

const fullPipeline = `Token change decision
        ↓
MCP validate-tokens (schema check)
        ↓
MCP push-tokens → GitHub commit (tokens/*.json)
        ↓
GitHub Action: style-dictionary build
        ↓  ↓  ↓
CSS vars  Tailwind  JS tokens
        ↓
Tokens Studio webhook → Figma sync
        ↓
kits.wugweb.studio hot-reload`;

const projects = [
  { name: 'Kits', repo: 'wugweb-git/Kits', url: 'https://github.com/wugweb-git/Kits', live: 'https://kits.wugweb.studio' },
  { name: 'StayWeb', repo: 'wugweb-git/Staywebdev', url: 'https://github.com/wugweb-git/Staywebdev', live: 'https://stayweb.wugweb.studio' },
  { name: 'DocWeb', repo: 'wugweb-git/Docweb', url: 'https://github.com/wugweb-git/Docweb', live: 'https://doc.wugweb.studio' },
  { name: 'NookWeb', repo: 'wugweb-git/Nookweb', url: 'https://github.com/wugweb-git/Nookweb', live: 'https://nook.wugweb.studio' },
  { name: 'ThinkWeb', repo: 'wugweb-git/thinkweb', url: 'https://github.com/wugweb-git/thinkweb', live: 'https://think.wugweb.studio' },
];

export function MCPConnectorDoc() {
  return (
    <PageWrapper>
      <PageHeader
        badge="MCP Connector"
        title="MCP Integration"
        description="Model Context Protocol connector for Wugweb Kits. Enables AI-driven token management: push tokens to GitHub, trigger Style Dictionary builds, validate schema, sync to Figma — all via MCP tool calls."
      />

      {/* Status */}
      <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap', marginBottom: 'var(--spacing-10)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', background: 'var(--warning-subtle)', border: '1px solid var(--warning)', borderRadius: 'var(--radius-full)', padding: '4px 14px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warning)' }} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--warning)', fontFamily: F }}>MCP: In development</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', background: 'var(--accent-subtle)', border: 'var(--border-accent)', borderRadius: 'var(--radius-full)', padding: '4px 14px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--accent)', fontFamily: F }}>Token system: Production-ready</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', background: 'var(--success-subtle)', border: '1px solid var(--success)', borderRadius: 'var(--radius-full)', padding: '4px 14px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--success)', fontFamily: F }}>Style Dictionary: Active</span>
        </div>
      </div>

      {/* Full pipeline visual */}
      <PageSection title="Full Automation Pipeline">
        <div style={{ border: 'var(--border-default)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <div style={{ padding: '8px 16px', background: 'var(--muted)', borderBottom: 'var(--border-default)' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: MONO }}>pipeline.txt</span>
          </div>
          <pre style={{ margin: 0, padding: 'var(--spacing-6)', background: 'var(--surface-1000)', color: 'var(--accent)', fontSize: '13px', fontFamily: MONO, lineHeight: 1.9 }}>
            <code>{fullPipeline}</code>
          </pre>
        </div>
      </PageSection>

      {/* Capabilities */}
      <PageSection title="MCP Capabilities" description="6 planned tool definitions for the wugweb-kits MCP server.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
          {mcpCapabilities.map(cap => {
            const Icon = cap.icon;
            return (
              <div key={cap.title} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: `color-mix(in srgb, ${cap.color} 14%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: cap.color }} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: cap.status === 'Alpha' ? 'var(--accent-subtle)' : 'var(--muted)', color: cap.status === 'Alpha' ? 'var(--accent)' : 'var(--muted-foreground)', fontFamily: F }}>{cap.status}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>{cap.title}</h3>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6, fontFamily: F }}>{cap.desc}</p>
              </div>
            );
          })}
        </div>
      </PageSection>

      {/* Tool schemas */}
      <PageSection title="Tool Schemas" description="JSON schemas for the MCP tools. Compatible with Cursor, Claude Desktop, and any MCP-compliant client.">
        <CodeBlock code={mcpSchema} lang="json — push-tokens schema" />
        <CodeBlock code={mcpExample} lang="typescript — push-tokens example" />
        <CodeBlock code={mcpValidateSchema} lang="json — validate-tokens schema" />
      </PageSection>

      {/* Connected products */}
      <PageSection title="Connected Products" description="All Wugweb products share the same token layer. MCP updates flow to all of them.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {projects.map(p => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-4) var(--spacing-5)', flexWrap: 'wrap' }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', fontFamily: F }}>{p.name[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{p.name}</p>
                <code style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: MONO }}>{p.repo}</code>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textDecoration: 'none', background: 'var(--muted)', border: 'var(--border-default)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontFamily: F }}>
                  GitHub <ExternalLink size={11} />
                </a>
                <a href={p.live} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-xs)', color: 'var(--accent)', textDecoration: 'none', background: 'var(--accent-subtle)', border: 'var(--border-accent)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontFamily: F }}>
                  Live <ExternalLink size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Next steps */}
      <PageSection title="Implementation Roadmap">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            {[
              { step: '01', status: 'done', label: 'Token system (4-layer)', desc: 'Core → Alias → Semantic → Component. W3C DTCG compliant JSON.' },
              { step: '02', status: 'done', label: 'Style Dictionary setup', desc: 'sd.config.js with tokens-studio transforms. Outputs CSS + Tailwind + JS.' },
              { step: '03', status: 'done', label: 'Tokens Studio → GitHub sync', desc: 'github.com/wugweb-git/Kits is the source of truth for all tokens.' },
              { step: '04', status: 'active', label: 'MCP server definition', desc: 'Define tool schemas and implement wugweb-kits MCP server.' },
              { step: '05', status: 'pending', label: 'MCP ↔ GitHub integration', desc: 'push-tokens, validate-tokens tools with real GitHub API writes.' },
              { step: '06', status: 'pending', label: 'Figma webhook trigger', desc: 'On token push, webhook triggers Tokens Studio pull in Figma.' },
              { step: '07', status: 'pending', label: 'Multi-brand via alias swap', desc: 'Pass brand config → MCP swaps alias.json → full rebrand in one call.' },
            ].map(r => (
              <div key={r.step} style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: r.status === 'done' ? 'var(--success)' : r.status === 'active' ? 'var(--accent)' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  {r.status === 'done' ? <Check size={13} style={{ color: 'white' }} /> : <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: r.status === 'active' ? 'var(--accent-foreground)' : 'var(--muted-foreground)', fontFamily: MONO }}>{r.step}</span>}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 2 }}>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{r.label}</p>
                    <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: 'var(--radius-full)', background: r.status === 'done' ? 'var(--success-subtle)' : r.status === 'active' ? 'var(--accent-subtle)' : 'var(--muted)', color: r.status === 'done' ? 'var(--success)' : r.status === 'active' ? 'var(--accent)' : 'var(--muted-foreground)', fontFamily: F }}>{r.status === 'done' ? 'Complete' : r.status === 'active' ? 'In progress' : 'Planned'}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
