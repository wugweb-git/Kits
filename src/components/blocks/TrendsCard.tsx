import React, { useState } from 'react';
import { Sun, Moon, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

const TRENDS = [
  { label: 'UI Components', value: '+12.4%', direction: 'up', count: '1,284', sub: 'installs this week' },
  { label: 'Token Updates', value: '+5.1%', direction: 'up', count: '312', sub: 'token changes' },
  { label: 'Accessibility', value: '98.2%', direction: 'up', count: 'AA', sub: 'WCAG score' },
  { label: 'Bundle Size', value: '-3.2%', direction: 'down', count: '42kb', sub: 'gzipped output' },
];

export function TrendsCard() {
  const [isDark, setIsDark] = useState(true);

  const bg       = isDark ? 'var(--surface-900)' : 'var(--core-color-neutral-50)';
  const cardBg   = isDark ? 'var(--surface-800)' : 'var(--core-color-neutral-0)';
  const fg       = isDark ? 'var(--foreground)' : 'var(--core-color-neutral-950)';
  const fgMuted  = isDark ? 'var(--muted-foreground)' : 'var(--core-color-neutral-500)';
  const border   = isDark ? 'var(--border)' : 'var(--core-color-neutral-200)';

  return (
    <div style={{
      maxWidth: '600px',
      borderRadius: 'var(--radius-lg)',
      background: bg,
      border: `1px solid ${border}`,
      padding: 'var(--spacing-6)',
      fontFamily: 'var(--core-font-family-base)',
      boxShadow: 'var(--core-shadow-md)',
      transition: `background var(--motion-duration-slow) var(--motion-easing-standard),
                   border-color var(--motion-duration-slow) var(--motion-easing-standard)`,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <BarChart2 size={18} color="var(--accent)" />
          </div>
          <div>
            <p style={{
              margin: 0,
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-body-md)',
              fontWeight: 'var(--font-weight-semibold)' as any,
              color: fg,
              lineHeight: 1.2,
            }}>
              Design System Trends
            </p>
            <p style={{
              margin: 0,
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-caption)',
              color: fgMuted,
            }}>
              Week over week
            </p>
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setIsDark(d => !d)}
          aria-label="Toggle theme"
          style={{
            background: isDark ? 'var(--surface-700)' : 'var(--core-color-neutral-100)',
            border: `1px solid ${border}`,
            borderRadius: 'var(--radius-full)',
            padding: 'var(--spacing-2) var(--spacing-3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            transition: `background var(--motion-duration-fast) var(--motion-easing-standard)`,
          }}
        >
          {isDark
            ? <Moon size={14} color="var(--accent)" />
            : <Sun size={14} color="var(--core-color-warning-500)" />}
          <span style={{
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-caption)',
            color: fgMuted,
            fontWeight: 'var(--font-weight-medium)' as any,
          }}>
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>
      </div>

      {/* Trend grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--spacing-4)',
      }}>
        {TRENDS.map(trend => (
          <div
            key={trend.label}
            style={{
              background: cardBg,
              border: `1px solid ${border}`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-4)',
              transition: `background var(--motion-duration-slow) var(--motion-easing-standard)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
              <span style={{
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-caption)',
                color: fgMuted,
                fontWeight: 'var(--font-weight-medium)' as any,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {trend.label}
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                color: trend.direction === 'up' ? 'var(--success)' : 'var(--destructive)',
              }}>
                {trend.direction === 'up'
                  ? <TrendingUp size={12} />
                  : <TrendingDown size={12} />}
                <span style={{
                  fontFamily: 'var(--core-font-family-base)',
                  fontSize: 'var(--fluid-caption)',
                  fontWeight: 'var(--font-weight-semibold)' as any,
                }}>
                  {trend.value}
                </span>
              </div>
            </div>
            <p style={{
              margin: '0 0 var(--spacing-1) 0',
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-h3)',
              fontWeight: 'var(--font-weight-bold)' as any,
              color: fg,
              lineHeight: 1,
            }}>
              {trend.count}
            </p>
            <p style={{
              margin: 0,
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-caption)',
              color: fgMuted,
            }}>
              {trend.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
